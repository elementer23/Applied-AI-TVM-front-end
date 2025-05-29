import Header from "./Header";
import { useState } from "react";

const dummyTexts = {
    verzekering1: "Dit is de eerste tekst voor de verzekering.",
    verzekering2: "Dit is de tweede tekst voor de verzekering.",
    verzekering3: "Dit is de derde tekst voor de verzekering.",
    verzekering4: "Dit is de vierde tekst voor de verzekering.",
};

function TextChangerScreen() {
    const [texts, setTexts] = useState(dummyTexts);
    const [selectedKey, setSelectedKey] = useState("verzekering1");

    const handleTextChange = (key, value) => {
        setTexts((prevTexts) => ({
            ...prevTexts,
            [selectedKey]: value,
        }));
    };

  return (
    <div className="main-container">
        <div className="left-change-section">
            <div></div>
            <div className="history-content">
                <p><strong>Aanpasbare bestanden</strong></p>
                <ul>
                    {Object.keys(texts).map((key) => (
                        <li key={key} className="text-change-item">
                            <button
                                className="text-change-button"
                                onClick={() => setSelectedKey(key)}
                                style={{
                                    color: selectedKey === key ? "#4fc15d" : "black",
                                }}
                            >
                                {key}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        <div className="section right-section">
            <Header />
            <h3>Tekst aanpassen: <em>{selectedKey}</em></h3>
            <div className="change-section">
                {Object.entries(texts).map(([key, value]) => (
                    <div key={key} className="text-change-category">
                        <h4>{key}</h4>
                        <textarea
                            rows="5"
                            value={value}
                            onChange={(e) => handleTextChange(key, e.target.value)}
                            style={{ width: "100%", marginBottom: "10px" }}
                            />
                            <button
                                onClick={() => console.log("Op te slaan teksten:", texts)}
                                className="save-btn"
                            >
                                Opslaan
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    </div>
  );
}

export default TextChangerScreen;