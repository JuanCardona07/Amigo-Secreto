import React, { useState, useEffect } from "react";
import "../index.css";

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
  const [mensajeError, setMensajeError] = useState("");
  const [nombresIngresados, setNombresIngresados] = useState(new Set());
  const [inputDeshabilitado, setInputDeshabilitado] = useState(false); // Para deshabilitar el cuadro de texto

  const horasParaActualizar = 24; // Tiempo en horas para cambiar asignaciones

  useEffect(() => {
    verificarAsignaciones();
  }, []);

  // Función para verificar si deben generarse nuevas asignaciones
  const verificarAsignaciones = () => {
    const fechaGuardada = localStorage.getItem("fechaAsignacion");
    const asignacionesGuardadas = localStorage.getItem("asignaciones");

    if (fechaGuardada && asignacionesGuardadas) {
      const fechaGuardadaDate = new Date(fechaGuardada);
      const fechaActual = new Date();

      // Calcular la diferencia en horas
      const diferenciaHoras = Math.floor(
        (fechaActual - fechaGuardadaDate) / (1000 * 60 * 60)
      );

      if (diferenciaHoras < horasParaActualizar) {
        // Usar las asignaciones previas si no ha pasado el tiempo definido
        setAsignaciones(JSON.parse(asignacionesGuardadas));
        return;
      }
    }

    // Generar nuevas asignaciones si no hay ninguna o ya pasó el tiempo
    generarAsignaciones();
  };

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

    // Guardar las nuevas asignaciones y la fecha en localStorage
    localStorage.setItem("asignaciones", JSON.stringify(newAsignaciones));
    localStorage.setItem("fechaAsignacion", new Date().toISOString());

    setAsignaciones(newAsignaciones);
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

    const amigo = asignaciones[nombre];
    setAmigoSecreto(amigo);
    setMensajePersonalizado(`${nombre}, tu Amigo Secreto es: ${amigo} 🎉`);

    // Agregar el nombre al conjunto de nombres ingresados
    setNombresIngresados((prev) => new Set(prev).add(nombre));

    // Bloquear el campo de texto para evitar que se ingresen más nombres
    setInputDeshabilitado(true);

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
          disabled={inputDeshabilitado} // Deshabilitar el campo de texto si el nombre ya ha sido ingresado
        />
        <button onClick={mostrarAsignacion} disabled={inputDeshabilitado}>
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
