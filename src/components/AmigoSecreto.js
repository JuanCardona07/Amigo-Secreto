import React, { useState, useEffect, useCallback } from "react";
import "../index.css";
import { generarAsignaciones } from "../utils/asignaciones";
import { buscarNombreCanonico, leerNombresIngresados } from "../utils/nombres";
import {
  NOMBRES_PARTICIPANTES,
  DIAS_PARA_REGENERAR,
} from "../constants/participantes";
import FormularioNombre from "./FormularioNombre";
import ResultadoMensaje from "./ResultadoMensaje";
import ListaParticipantes from "./ListaParticipantes";

const AmigoSecreto = () => {
  const [nombre, setNombre] = useState("");
  const [asignaciones, setAsignaciones] = useState({});
  const [mensajePersonalizado, setMensajePersonalizado] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [nombresIngresados, setNombresIngresados] = useState(new Set());
  const [inputDeshabilitado, setInputDeshabilitado] = useState(false);

  const generarNuevasAsignaciones = useCallback(() => {
    try {
      const nuevasAsignaciones = generarAsignaciones(NOMBRES_PARTICIPANTES);
      localStorage.setItem("asignaciones", JSON.stringify(nuevasAsignaciones));
      localStorage.setItem("fechaAsignacion", new Date().toISOString());
      localStorage.setItem("nombresIngresados", JSON.stringify([]));
      setAsignaciones(nuevasAsignaciones);
      setNombresIngresados(new Set());
    } catch (error) {
      console.error("No se pudieron generar las asignaciones:", error);
      setMensajeError(
        "Ocurrió un error generando las asignaciones. Recarga la página."
      );
    }
  }, []);

  useEffect(() => {
    const asignacionesGuardadas = localStorage.getItem("asignaciones");
    const fechaAsignacionGuardada = localStorage.getItem("fechaAsignacion");

    if (asignacionesGuardadas && fechaAsignacionGuardada) {
      const diasTranscurridos = Math.floor(
        (new Date() - new Date(fechaAsignacionGuardada)) / (1000 * 60 * 60 * 24)
      );

      if (diasTranscurridos >= DIAS_PARA_REGENERAR) {
        generarNuevasAsignaciones();
      } else {
        try {
          const asignacionesParseadas = JSON.parse(asignacionesGuardadas);
          const coincideConParticipantesActuales =
            Object.keys(asignacionesParseadas).sort().join("|") ===
            [...NOMBRES_PARTICIPANTES].sort().join("|");

          if (coincideConParticipantesActuales) {
            setAsignaciones(asignacionesParseadas);
            setNombresIngresados(leerNombresIngresados());
          } else {
            generarNuevasAsignaciones();
          }
        } catch {
          generarNuevasAsignaciones();
        }
      }
    } else {
      generarNuevasAsignaciones();
    }
  }, [generarNuevasAsignaciones]);

  const mostrarAsignacion = () => {
    if (!nombre.trim()) {
      setMensajePersonalizado("");
      setMensajeError("Por favor, ingresa tu nombre.");
      return;
    }

    const nombreCanonico = buscarNombreCanonico(nombre, NOMBRES_PARTICIPANTES);

    if (!nombreCanonico) {
      setMensajePersonalizado("");
      setMensajeError(
        "El nombre ingresado no está en la lista de participantes."
      );
      return;
    }

    if (nombresIngresados.has(nombreCanonico)) {
      setMensajeError("Ya revelaste tu pareja, no puedes consultarla de nuevo.");
      return;
    }

    setMensajeError("");
    setInputDeshabilitado(true);

    const pareja = asignaciones[nombreCanonico];
    setMensajePersonalizado(`${nombreCanonico}, tu pareja es: ${pareja} 💕`);

    const nuevosIngresados = new Set(nombresIngresados).add(nombreCanonico);
    setNombresIngresados(nuevosIngresados);
    localStorage.setItem(
      "nombresIngresados",
      JSON.stringify([...nuevosIngresados])
    );

    setNombre("");
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
      <ListaParticipantes participantes={NOMBRES_PARTICIPANTES} />
    </div>
  );
};

export default AmigoSecreto;
