const barajarFisherYates = (elementos) => {
  const resultado = [...elementos];
  for (let i = resultado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
  }
  return resultado;
};

const MAX_INTENTOS = 1000;

// Un "derangement" es una permutación sin puntos fijos: nadie queda como su propio amigo secreto.
const generarDerangement = (nombres) => {
  if (nombres.length < 2) {
    throw new Error("Se necesitan al menos 2 participantes.");
  }

  for (let intento = 0; intento < MAX_INTENTOS; intento++) {
    const barajado = barajarFisherYates(nombres);
    if (barajado.every((valor, indice) => valor !== nombres[indice])) {
      return barajado;
    }
  }

  throw new Error("No se pudo generar una asignación válida.");
};

const generarAsignaciones = (nombres) => {
  const derangement = generarDerangement(nombres);
  const asignaciones = {};
  nombres.forEach((nombre, indice) => {
    asignaciones[nombre] = derangement[indice];
  });
  return asignaciones;
};

module.exports = { generarDerangement, generarAsignaciones };
