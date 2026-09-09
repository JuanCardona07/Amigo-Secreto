import React from "react";

const FormularioNombre = ({ nombre, onCambiarNombre, onEnviar, deshabilitado }) => (
  <div>
    <h2>💌 ¿Quién te tocó? 💌</h2>
    <p>Escribe tu nombre para descubrir tu pareja:</p>
    <label htmlFor="nombre-input" className="sr-only">
      Tu nombre
    </label>
    <input
      id="nombre-input"
      type="text"
      value={nombre}
      onChange={(e) => onCambiarNombre(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onEnviar()}
      placeholder="Tu nombre"
      className="input-nombre"
      disabled={deshabilitado}
    />
    <button onClick={onEnviar} disabled={deshabilitado}>
      🔍 Ver mi pareja
    </button>
  </div>
);

export default FormularioNombre;
