import { generarAsignaciones } from "./asignaciones";
import { NOMBRES_PARTICIPANTES as PARTICIPANTES } from "../constants/participantes";

describe("generarAsignaciones", () => {
  // Se repite varias veces porque el algoritmo usa aleatoriedad.
  for (let ejecucion = 0; ejecucion < 20; ejecucion++) {
    test(`nadie es su propio amigo secreto (ejecución ${ejecucion})`, () => {
      const asignaciones = generarAsignaciones(PARTICIPANTES);
      PARTICIPANTES.forEach((nombre) => {
        expect(asignaciones[nombre]).not.toBe(nombre);
      });
    });

    test(`las asignaciones son una biyección (ejecución ${ejecucion})`, () => {
      const asignaciones = generarAsignaciones(PARTICIPANTES);
      const valores = Object.values(asignaciones);
      expect(new Set(valores).size).toBe(PARTICIPANTES.length);
      expect(valores.sort()).toEqual([...PARTICIPANTES].sort());
    });
  }

  test("lanza un error si hay menos de 2 participantes", () => {
    expect(() => generarAsignaciones(["Marina"])).toThrow();
  });
});
