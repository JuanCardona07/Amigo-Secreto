import React from "react";

const ResultadoMensaje = ({ mensaje, error }) => (
  <>
    {mensaje && <h3>{mensaje}</h3>}
    {error && <h3 className="error">{error}</h3>}
  </>
);

export default ResultadoMensaje;
