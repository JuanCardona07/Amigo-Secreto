import React, { useState, useEffect } from "react";
import "../index.css";
import { buscarNombreCanonico } from "../utils/nombres";
import { API_BASE_URL } from "../config/api";
import FormularioNombre from "./FormularioNombre";
import ResultadoMensaje from "./ResultadoMensaje";
import ListaParticipantes from "./ListaParticipantes";

const MENSAJE_ERROR_GENERICO = "Ocurrió un error consultando tu pareja. Intenta de nuevo.";

const AmigoSecreto = () => {
  const [nombre, setNombre] = useState("");
  const [participantes, setParticipantes] = useState([]);
  const [mensajePersonalizado, setMensajePersonalizado] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [inputDeshabilitado, setInputDeshabilitado] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/participantes`)
      .then((respuesta) => respuesta.json())
      .then((datos) => setParticipantes(datos.participantes ?? []))
      .catch(() => setMensajeError(MENSAJE_ERROR_GENERICO));
  }, []);

  const mostrarAsignacion = async () => {
    if (!nombre.trim()) {
      setMensajePersonalizado("");
      setMensajeError("Por favor, ingresa tu nombre.");
      return;
    }

    const nombreCanonico = buscarNombreCanonico(nombre, participantes);

    if (!nombreCanonico) {
      setMensajePersonalizado("");
      setMensajeError("El nombre ingresado no está en la lista de participantes.");
      return;
    }

    setMensajeError("");

    try {
      const respuesta = await fetch(`${API_BASE_URL}/api/revelar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombreCanonico }),
      });
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensajeError(datos.error || MENSAJE_ERROR_GENERICO);
        if (respuesta.status === 409) {
          setInputDeshabilitado(true);
        }
        return;
      }

      setMensajePersonalizado(`${datos.nombre}, tu pareja es: ${datos.pareja} 💕`);
      setInputDeshabilitado(true);
      setNombre("");
    } catch {
      setMensajeError(MENSAJE_ERROR_GENERICO);
    }
  };

  return (
    <div className="AmigoSecreto">
      <h1>💝 Juego del Amigo Secreto 💝</h1>
      <FormularioNombre
        nombre={nombre}
        onCambiarNombre={setNombre}
        onEnviar={mostrarAsignacion}
        deshabilitado={inputDeshabilitado}
      />
      <ResultadoMensaje mensaje={mensajePersonalizado} error={mensajeError} />
      <ListaParticipantes participantes={participantes} />
    </div>
  );
};

export default AmigoSecreto;
