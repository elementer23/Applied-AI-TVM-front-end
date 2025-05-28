import Header from "./Header";

function TextChangerScreen() {
  return (
    <div className="main-container">
        <div className="left-change-section">
            <div></div>
            <div className="history-content">
                <p><strong>Aanpasbare bestanden</strong></p>
                <ul>
                    <li><strong>Aanpasbare bestand</strong></li>
                </ul>
            </div>
        </div>
        <div className="section right-section">
            <Header />
            <div className="change-section">
                <h3>Tekst aanpassen</h3>
            </div>
        </div>
    </div>
  );
}

export default TextChangerScreen;