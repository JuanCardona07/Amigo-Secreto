export const normalizarNombre = (texto) => texto.trim().toLowerCase();

export const buscarNombreCanonico = (nombreIngresado, participantes) =>
  participantes.find(
    (participante) => normalizarNombre(participante) === normalizarNombre(nombreIngresado)
  );
