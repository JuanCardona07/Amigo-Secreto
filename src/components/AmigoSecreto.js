import React, { useState, useEffect } from "react";
import "../index.css"; // Cambiado a la ruta correcta

const AmigoSecreto = () => {
  const nombresParticipantes = [
    "Marina",
    "Mariela",
    "Doris",
    "Gladis",
    "Jackeline",
    "Mery",
    "Olga",
    "Sulma Eliana",
    "Magnolia",
  ];

  const [nombre, setNombre] = useState("");
  const [asignaciones, setAsignaciones] = useState({});
  const [amigoSecreto, setAmigoSecreto] = useState("");
  const [mensajePersonalizado, setMensajePersonalizado] = useState("");
  const [mensajeError, setMensajeError] = useState(""); // Para mostrar mensajes de error

  useEffect(() => {
    generarAsignaciones();
  }, []);

  const generarAsignaciones = () => {
    const shuffled = [...nombresParticipantes];
    let deranged = [];

    while (true) {
      shuffled.sort(() => Math.random() - 0.5);
      if (
        shuffled.every((value, index) => value !== nombresParticipantes[index])
      ) {
        deranged = shuffled;
        break;
      }
    }

    const newAsignaciones = {};
    nombresParticipantes.forEach((name, index) => {
      newAsignaciones[name] = deranged[index];
    });

    // Verificar que todos los nombres estén asignados y no haya duplicados
    const valoresAsignaciones = Object.values(newAsignaciones);
    const nombresUnicos = new Set(valoresAsignaciones);

    if (
      valoresAsignaciones.length === nombresParticipantes.length &&
      valoresAsignaciones.length === nombresUnicos.size
    ) {
      console.log("Asignaciones válidas:", newAsignaciones);
    } else {
      console.error("Error: Asignaciones inválidas.");
    }

    setAsignaciones(newAsignaciones);
  };

  const mostrarAsignacion = () => {
    if (!nombre) {
      setMensajePersonalizado("");
      setMensajeError("Por favor, ingresa tu nombre.");
      return;
    }

    if (!(nombre in asignaciones)) {
      setMensajePersonalizado("");
      setMensajeError(
        "El nombre ingresado no está en la lista de participantes."
      );
      return;
    }

    if (asignaciones[nombre]) {
      setMensajeError("Ya ingresaste tu nombre, no puedes ingresar otro.");
      return;
    }

    const amigo = asignaciones[nombre];
    setAmigoSecreto(amigo);
    setMensajePersonalizado(`${nombre}, tu Amigo Secreto es: ${amigo} 🎉`);

    // Limpiar el campo de entrada
    setNombre("");
  };

  return (
    <div className="AmigoSecreto">
      <h1>🎁 Juego del Amigo Secreto 🎁</h1>
      <div>
        <h2>🎅 ¡Descubre tu Amigo Secreto! 🎅</h2>
        <p>Ingresa tu nombre para ver quién es tu Amigo Secreto:</p>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
          className="input-nombre"
        />
        <button onClick={mostrarAsignacion}>🔍 Mostrar Amigo Secreto</button>
      </div>
      {mensajePersonalizado && <h3>{mensajePersonalizado}</h3>}
      {mensajeError && <h3 className="error">{mensajeError}</h3>}
      <div>
        <h4>Participantes:</h4>
        <ul>
          {nombresParticipantes.map((nombre, index) => (
            <li key={index}>{nombre}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AmigoSecreto;
