import React, { useState, useEffect } from "react";
import "../index.css"; // Ruta correcta

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
  const [nombreIngresado, setNombreIngresado] = useState(null); // Para almacenar el nombre ingresado

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
    // Verificar si el nombre ya fue ingresado
    if (nombreIngresado) {
      setMensajeError("Ya ingresaste tu nombre, no puedes ingresar otro.");
      return;
    }

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

    // Si el nombre es válido y no ha sido ingresado antes
    const amigo = asignaciones[nombre];
    setAmigoSecreto(amigo);
    setMensajePersonalizado(`${nombre}, tu Amigo Secreto es: ${amigo} 🎉`);

    // Marcar que el nombre ha sido ingresado
    setNombreIngresado(nombre);

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
          disabled={!!nombreIngresado} // Deshabilitar si ya se ingresó un nombre
        />
        <button onClick={mostrarAsignacion} disabled={!!nombreIngresado}>
          🔍 Mostrar Amigo Secreto
        </button>
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
