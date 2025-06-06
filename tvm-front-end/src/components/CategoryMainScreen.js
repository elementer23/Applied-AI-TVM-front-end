import { useState } from "react";
import AdvisoryTextManager from "./AdvisoryTextManager";
import AddNewAdvisoryText from "./AddNewAdvisoryText";
import AddNewCategory from "./AddNewCategory";

function CategoryMainScreen() {
    const [component, setComponent] = useState("advisory_text_manager");

    const componentHandler = {
        advisory_text_manager: <AdvisoryTextManager />,
        add_new_advisory_text: <AddNewAdvisoryText />,
        add_new_category: <AddNewCategory />,
    };

    return (
        <div className="main-container">
            <div className="left-change-section">
                <div></div>
                <div className="history-content">
                    <p>
                        <strong>Aanpasbare teksten</strong>
                    </p>
                    <ul>
                        <li className="text-change-item">
                            <button
                                className="text-change-button"
                                onClick={() =>
                                    setComponent("advisory_text_manager")
                                }
                            >
                                Overzicht
                            </button>
                        </li>
                        <li className="text-change-item">
                            <button
                                className="text-change-button"
                                onClick={() =>
                                    setComponent("add_new_advisory_text")
                                }
                            >
                                Advies tekst(en) toevoegen
                            </button>
                        </li>
                        <li className="text-change-item">
                            <button
                                className="text-change-button"
                                onClick={() => setComponent("add_new_category")}
                            >
                                Voeg nieuwe categorie toe
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            {componentHandler[component]}
        </div>
    );
}

export default CategoryMainScreen;
