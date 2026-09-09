import { normalizarNombre, buscarNombreCanonico } from "./nombres";

describe("normalizarNombre", () => {
  test("quita espacios y pasa a minúsculas", () => {
    expect(normalizarNombre("  Marina  ")).toBe("marina");
  });
});

describe("buscarNombreCanonico", () => {
  const participantes = ["Marina", "Sulma Eliana"];

  test("encuentra el nombre canónico sin importar mayúsculas o espacios", () => {
    expect(buscarNombreCanonico("  marina  ", participantes)).toBe("Marina");
    expect(buscarNombreCanonico("SULMA ELIANA", participantes)).toBe(
      "Sulma Eliana"
    );
  });

  test("devuelve undefined si el nombre no está en la lista", () => {
    expect(buscarNombreCanonico("Pedro", participantes)).toBeUndefined();
  });
});
