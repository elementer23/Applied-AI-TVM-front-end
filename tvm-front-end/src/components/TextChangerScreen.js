import Header from "./Header";
import { useEffect ,useState } from "react";
import {
    GetAllAdvisoryTexts,
    UpdateAdvisoryText,
} from "../utils/Services";

/*const dummyTexts = {
    verzekering1: "Dit is de eerste tekst voor de verzekering.",
    verzekering2: "Dit is de tweede tekst voor de verzekering.",
    verzekering3: "Dit is de derde tekst voor de verzekering.",
    verzekering4: "Dit is de vierde tekst voor de verzekering.",
};*/

function TextChangerScreen() {
    //const [texts, setTexts] = useState(dummyTexts);
    //const [selectedKey, setSelectedKey] = useState("verzekering1");
    const [texts, setTexts] = useState({});
    const [selectedKey, setSelectedKey] = useState(null);

    // const handleTextChange = (key, value) => {
    //     setTexts((prevTexts) => ({
    //         ...prevTexts,
    //         [selectedKey]: value,
    //     }));
    // };

    const handleTextChange = (value) => {
        setTexts((prevTexts) => ({
            ...prevTexts,
            [selectedKey]: {
                ...prevTexts[selectedKey],
                adviceText: value,
            },
        }));
    };

    const handleSave = async () => {
        const currentText = texts[selectedKey];
        const result = await UpdateAdvisoryText(
            selectedKey,
            currentText.adviceText
        );
        if (result.success) {
            alert("Tekst succesvol opgeslagen!");
        } else {
            alert("Fout bij opslaan van tekst: " + result.error);
        }
    };

    useEffect(() => {
        async function fetchTexts() {
            const result = await GetAllAdvisoryTexts();
            if(result.success) {
                const fetchedTexts = {};
                result.current_response.forEach((text) => {
                    fetchedTexts[text.id] = {
                        adviceText: text.adviceText_text,
                        category: text.category,
                        subcategory: text.subcategory,
                    };
                });
                setTexts(fetchedTexts);
                const firstKey = Object.keys(fetchedTexts)[0];
                setSelectedKey(firstKey);
            }
        }
        fetchTexts();
    }, []);


return (
        <div className="main-container">
            <div className="left-change-section">
                <div></div>
                <div className="history-content">
                    <p><strong>Aanpasbare teksten</strong></p>
                    <ul>
                        {Object.entries(texts).map(([id, obj]) => (
                            <li key={id} className="text-change-item">
                                <button
                                    className="text-change-button"
                                    onClick={() => setSelectedKey(id)}
                                    style={{
                                        color: selectedKey === id ? "#4fc15d" : "black",
                                    }}
                                >
                                    {obj.category} - {obj.subcategory}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="section right-section">
                <Header />
                {selectedKey && texts[selectedKey] && (
                    <>
                        <h3>
                            Tekst aanpassen:{" "}
                            <em>
                                {texts[selectedKey].category} - {texts[selectedKey].subcategory}
                            </em>
                        </h3>
                        <div className="change-section">
                            <textarea
                                rows="10"
                                value={texts[selectedKey].adviceText}
                                onChange={(e) => handleTextChange(e.target.value)}
                                style={{ width: "100%", marginBottom: "10px" }}
                            />
                            <button onClick={handleSave} className="save-btn">
                                Opslaan
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default TextChangerScreen;