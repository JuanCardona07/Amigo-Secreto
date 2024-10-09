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
  const [nombresIngresados, setNombresIngresados] = useState(new Set()); // Para almacenar nombres ingresados
  const [inputDeshabilitado, setInputDeshabilitado] = useState(false); // Para deshabilitar el input después de ingresar un nombre

  useEffect(() => {
    const asignacionesGuardadas = localStorage.getItem("asignaciones");
    const fechaAsignacionGuardada = localStorage.getItem("fechaAsignacion");

    if (asignacionesGuardadas && fechaAsignacionGuardada) {
      const fechaGuardada = new Date(fechaAsignacionGuardada);
      const fechaActual = new Date();
      const diferenciaDias = Math.floor(
        (fechaActual - fechaGuardada) / (1000 * 60 * 60 * 24)
      );

      // Verificar si han pasado 5 días para regenerar asignaciones
      if (diferenciaDias >= 5) {
        generarAsignaciones();
      } else {
        setAsignaciones(JSON.parse(asignacionesGuardadas));
      }
    } else {
      // Generar nuevas asignaciones si no existen en localStorage
      generarAsignaciones();
    }
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

    // Verificar que no haya asignaciones repetidas
    const valoresAsignaciones = Object.values(newAsignaciones);
    const nombresUnicos = new Set(valoresAsignaciones);

    if (
      valoresAsignaciones.length === nombresParticipantes.length &&
      valoresAsignaciones.length === nombresUnicos.size
    ) {
      // Guardar las nuevas asignaciones en localStorage con la fecha actual
      const fechaActual = new Date();
      localStorage.setItem("asignaciones", JSON.stringify(newAsignaciones));
      localStorage.setItem("fechaAsignacion", fechaActual);
      setAsignaciones(newAsignaciones);
      console.log("Asignaciones válidas:", newAsignaciones);
    } else {
      console.error("Error: Asignaciones inválidas.");
    }
  };

  const mostrarAsignacion = () => {
    if (nombresIngresados.has(nombre)) {
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

    // Bloquear el campo de texto después de ingresar el nombre
    setInputDeshabilitado(true);

    const amigo = asignaciones[nombre];
    setAmigoSecreto(amigo);
    setMensajePersonalizado(`${nombre}, tu Amigo Secreto es: ${amigo} 🎉`);

    // Agregar el nombre al conjunto de nombres ingresados
    setNombresIngresados((prev) => new Set(prev).add(nombre));

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
          disabled={inputDeshabilitado} // Bloquear input después de ingresar nombre
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
