import React from 'react';
function LeftSection() {
  return (
    <div className="section left-section">
      <div></div>
      <div className="history-content">
        <p><strong>Gesprek geschiedenis</strong></p>
        <ul>
          <li><strong>Gesprek geschiedenis 1</strong> <i>01/02/2025</i></li>
          <li><strong>Gesprek geschiedenis 2</strong> <i>02/02/2025</i></li>
          <li><strong>Gesprek geschiedenis 3</strong> <i>03/02/2025</i></li>
          <li><strong>Gesprek geschiedenis 4</strong> <i>04/02/2025</i></li>
          <li><strong>Gesprek geschiedenis 5</strong> <i>05/02/2025</i></li>
        </ul>
      </div>
      <div className="guidelines-content">
        <p><strong>Richtlijn bestanden</strong></p>
        <ul>
          <li><strong>Richtlijn bestand 1</strong> <i>Versie 1</i></li>
          <li><strong>Richtlijn bestand 2</strong> <i>Versie 2</i></li>
          <li><strong>Richtlijn bestand 3</strong> <i>Versie 3</i></li>
          <li><strong>Richtlijn bestand 4</strong> <i>Versie 4</i></li>
          <li><strong>Richtlijn bestand 5</strong> <i>Versie 5</i></li>
        </ul>
      </div>
      <div className="new-chat">
        <button className="new-chat-button">Nieuw gesprek</button>
      </div>
    </div>
  );
}

export default LeftSection;
