const normalizarNombre = (texto) => texto.trim().toLowerCase();

const buscarNombreCanonico = (nombreIngresado, participantes) =>
  participantes.find(
    (participante) => normalizarNombre(participante) === normalizarNombre(nombreIngresado)
  );

module.exports = { normalizarNombre, buscarNombreCanonico };
