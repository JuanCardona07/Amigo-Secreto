const fs = require("fs");
const path = require("path");
const { NOMBRES_PARTICIPANTES, DIAS_PARA_REGENERAR } = require("./participantes");
const { generarAsignaciones } = require("./asignaciones");

const ARCHIVO_ESTADO = path.join(__dirname, "..", "data", "state.json");

// Mantenido únicamente en memoria/disco del servidor: nunca se envía completo al cliente.
let estado = null;

const mismosParticipantes = (asignaciones) =>
  Object.keys(asignaciones).sort().join("|") ===
  [...NOMBRES_PARTICIPANTES].sort().join("|");

const necesitaRegenerar = (fechaAsignacion) => {
  const diasTranscurridos =
    (Date.now() - new Date(fechaAsignacion).getTime()) / (1000 * 60 * 60 * 24);
  return diasTranscurridos >= DIAS_PARA_REGENERAR;
};

const persistir = () => {
  fs.mkdirSync(path.dirname(ARCHIVO_ESTADO), { recursive: true });
  fs.writeFileSync(
    ARCHIVO_ESTADO,
    JSON.stringify({
      asignaciones: estado.asignaciones,
      fechaAsignacion: estado.fechaAsignacion,
      revelados: [...estado.revelados],
    })
  );
};

const generarNuevoEstado = () => {
  estado = {
    asignaciones: generarAsignaciones(NOMBRES_PARTICIPANTES),
    fechaAsignacion: new Date().toISOString(),
    revelados: new Set(),
  };
  persistir();
};

const cargarEstado = () => {
  try {
    const crudo = fs.readFileSync(ARCHIVO_ESTADO, "utf-8");
    const guardado = JSON.parse(crudo);

    if (!mismosParticipantes(guardado.asignaciones) || necesitaRegenerar(guardado.fechaAsignacion)) {
      generarNuevoEstado();
      return;
    }

    estado = {
      asignaciones: guardado.asignaciones,
      fechaAsignacion: guardado.fechaAsignacion,
      revelados: new Set(guardado.revelados || []),
    };
  } catch {
    generarNuevoEstado();
  }
};

const obtenerParticipantes = () => [...NOMBRES_PARTICIPANTES];

const yaFueRevelado = (nombreCanonico) => estado.revelados.has(nombreCanonico);

const revelarPareja = (nombreCanonico) => {
  const pareja = estado.asignaciones[nombreCanonico];
  estado.revelados.add(nombreCanonico);
  persistir();
  return pareja;
};

cargarEstado();

module.exports = { obtenerParticipantes, yaFueRevelado, revelarPareja };
