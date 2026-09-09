export const normalizarNombre = (texto) => texto.trim().toLowerCase();

export const buscarNombreCanonico = (nombreIngresado, participantes) =>
  participantes.find(
    (participante) => normalizarNombre(participante) === normalizarNombre(nombreIngresado)
  );

export const leerNombresIngresados = () => {
  try {
    const guardado = localStorage.getItem("nombresIngresados");
    return guardado ? new Set(JSON.parse(guardado)) : new Set();
  } catch {
    return new Set();
  }
};
