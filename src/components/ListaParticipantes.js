import React from "react";

const ListaParticipantes = ({ participantes }) => (
  <div>
    <h4>Participantes:</h4>
    <ul>
      {participantes.map((participante) => (
        <li key={participante}>{participante}</li>
      ))}
    </ul>
  </div>
);

export default ListaParticipantes;
