import { Trash2, PencilLine } from "lucide-react";
import styles from "../../css/AdvisoryManager.module.css";
import { useState } from "react";

function AdvisoryText({ advisoryText, onAdvisoryUpdate, onAdvisoryDelete }) {
    const [displayItems, setDisplayItems] = useState(false);
    const [editedText, setEditedText] = useState(advisoryText.text);

    const handleAdvisoryUpdate = () => {
        onAdvisoryUpdate(advisoryText.id, editedText);
        setDisplayItems(false);
    };

    const handleAdvisoryDelete = () => {
        const confirmation = window.confirm(
            "Weet je zeker dat je het wilt verwijderen?"
        );

        if (confirmation) {
            onAdvisoryDelete(advisoryText.id);
        }
    };

    return (
        <div className={styles.advisoryManagerAdviceTextPlatform}>
            <div className={styles.advisoryManagerAdviceTextPlatformItemLeft}>
                {!displayItems && advisoryText.text}
                {displayItems && (
                    <textarea
                        rows="10"
                        value={editedText}
                        onChange={(input) => setEditedText(input.target.value)}
                        style={{
                            width: "100%",
                            marginBottom: "10px",
                            marginTop: "10px",
                        }}
                        required
                    />
                )}
            </div>
            <div className={styles.advisoryManagerAdviceTextPlatformItemRight}>
                <button
                    onClick={() => setDisplayItems(true)}
                    style={{
                        background: "none",
                        border: "none",
                        color: "grey",
                        cursor: "pointer",
                        display: displayItems ? "none" : "block",
                    }}
                    title="Pas advies aan"
                >
                    <PencilLine size={16} />
                </button>
                <button
                    className={styles.successBtn}
                    onClick={handleAdvisoryUpdate}
                    style={{ display: displayItems ? "block" : "none" }}
                >
                    udpate
                </button>
                <button
                    onClick={handleAdvisoryDelete}
                    style={{
                        background: "none",
                        border: "none",
                        color: "red",
                        cursor: "pointer",
                        display: displayItems ? "none" : "block",
                    }}
                    title="Verwijder advies"
                >
                    <Trash2 size={16} />
                </button>
                <button
                    onClick={() => {
                        setEditedText(advisoryText.text);
                        setDisplayItems(false);
                    }}
                    className={styles.cancelBtn}
                    style={{ display: displayItems ? "block" : "none" }}
                >
                    cancel
                </button>
            </div>
        </div>
    );
}

export default AdvisoryText;
