const Redis = require("ioredis");
const { NOMBRES_PARTICIPANTES, DIAS_PARA_REGENERAR } = require("./participantes");
const { generarAsignaciones } = require("./asignaciones");

const CLAVE_ASIGNACIONES = "amigo-secreto:asignaciones";
const CLAVE_FECHA = "amigo-secreto:fecha-asignacion";
const CLAVE_REVELADOS = "amigo-secreto:revelados";

const cliente = new Redis(process.env.REDIS_URL);

const mismosParticipantes = (asignaciones) =>
  Object.keys(asignaciones).sort().join("|") === [...NOMBRES_PARTICIPANTES].sort().join("|");

const necesitaRegenerar = (fechaAsignacion) => {
  const diasTranscurridos =
    (Date.now() - new Date(fechaAsignacion).getTime()) / (1000 * 60 * 60 * 24);
  return diasTranscurridos >= DIAS_PARA_REGENERAR;
};

// Cacheado en memoria del proceso: las asignaciones no cambian entre reinicios
// mientras Redis siga teniendo el mismo sorteo vigente.
let estadoEnMemoria = null;

const generarNuevoEstado = async () => {
  const asignaciones = generarAsignaciones(NOMBRES_PARTICIPANTES);
  const fechaAsignacion = new Date().toISOString();

  await cliente
    .multi()
    .del(CLAVE_REVELADOS)
    .set(CLAVE_ASIGNACIONES, JSON.stringify(asignaciones))
    .set(CLAVE_FECHA, fechaAsignacion)
    .exec();

  estadoEnMemoria = { asignaciones, fechaAsignacion };
  return estadoEnMemoria;
};

const obtenerEstado = async () => {
  if (estadoEnMemoria) return estadoEnMemoria;

  const [asignacionesCrudas, fechaAsignacion] = await cliente.mget(CLAVE_ASIGNACIONES, CLAVE_FECHA);

  if (!asignacionesCrudas || !fechaAsignacion) {
    return generarNuevoEstado();
  }

  const asignaciones = JSON.parse(asignacionesCrudas);

  if (!mismosParticipantes(asignaciones) || necesitaRegenerar(fechaAsignacion)) {
    return generarNuevoEstado();
  }

  estadoEnMemoria = { asignaciones, fechaAsignacion };
  return estadoEnMemoria;
};

const obtenerParticipantes = () => [...NOMBRES_PARTICIPANTES];

const yaFueRevelado = async (nombreCanonico) => {
  await obtenerEstado();
  return Boolean(await cliente.sismember(CLAVE_REVELADOS, nombreCanonico));
};

const revelarPareja = async (nombreCanonico) => {
  const { asignaciones } = await obtenerEstado();
  await cliente.sadd(CLAVE_REVELADOS, nombreCanonico);
  return asignaciones[nombreCanonico];
};

const regenerarEstado = async () => {
  estadoEnMemoria = null;
  await generarNuevoEstado();
};

module.exports = { obtenerParticipantes, yaFueRevelado, revelarPareja, regenerarEstado };
