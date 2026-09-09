const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { buscarNombreCanonico } = require("./nombres");
const { obtenerParticipantes, yaFueRevelado, revelarPareja, regenerarEstado } = require("./store");

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

const tokenValido = (tokenRecibido) => {
  if (!ADMIN_TOKEN || !tokenRecibido) return false;
  const bufEsperado = Buffer.from(ADMIN_TOKEN);
  const bufRecibido = Buffer.from(tokenRecibido);
  return (
    bufEsperado.length === bufRecibido.length &&
    crypto.timingSafeEqual(bufEsperado, bufRecibido)
  );
};

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json({ limit: "10kb" }));

// Limita intentos por IP para dificultar la enumeración/fuerza bruta de nombres.
const limitadorRevelar = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos. Intenta de nuevo más tarde." },
});

app.get("/api/participantes", (_req, res) => {
  res.json({ participantes: obtenerParticipantes() });
});

app.post("/api/revelar", limitadorRevelar, async (req, res, next) => {
  try {
    const { nombre } = req.body ?? {};

    if (typeof nombre !== "string" || !nombre.trim() || nombre.length > 100) {
      return res.status(400).json({ error: "Nombre inválido." });
    }

    const nombreCanonico = buscarNombreCanonico(nombre, obtenerParticipantes());

    if (!nombreCanonico) {
      return res.status(404).json({ error: "El nombre ingresado no está en la lista de participantes." });
    }

    if (await yaFueRevelado(nombreCanonico)) {
      return res.status(409).json({ error: "Ya revelaste tu pareja, no puedes consultarla de nuevo." });
    }

    const pareja = await revelarPareja(nombreCanonico);
    res.json({ nombre: nombreCanonico, pareja });
  } catch (err) {
    next(err);
  }
});

const limitadorAdmin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos. Intenta de nuevo más tarde." },
});

app.post("/api/admin/regenerar", limitadorAdmin, async (req, res, next) => {
  try {
    if (!ADMIN_TOKEN) {
      return res.status(503).json({ error: "Función de administración no configurada." });
    }

    const auth = req.get("Authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

    if (!tokenValido(token)) {
      return res.status(401).json({ error: "No autorizado." });
    }

    await regenerarEstado();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// Manejador de errores centralizado: nunca se exponen stack traces ni detalles internos al cliente.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Ocurrió un error inesperado." });
});

app.listen(PORT, () => {
  console.log(`Servidor de Amigo Secreto escuchando en el puerto ${PORT}`);
});
