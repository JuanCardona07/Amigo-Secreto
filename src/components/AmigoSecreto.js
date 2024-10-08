import React, { useState, useEffect } from "react";

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

    setAsignaciones(newAsignaciones);
  };

  const mostrarAsignacion = () => {
    if (!nombre) {
      setMensajePersonalizado("Por favor, ingresa tu nombre.");
      return;
    }

    if (!(nombre in asignaciones)) {
      setMensajePersonalizado(
        "El nombre ingresado no está en la lista de participantes."
      );
      return;
    }

    const amigo = asignaciones[nombre];
    setAmigoSecreto(amigo);

    // Mensaje personalizado
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
