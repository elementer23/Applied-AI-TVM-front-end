import { Trash2, PencilLine } from "lucide-react";
import styles from "../../css/AdvisoryManager.module.css";

function AdvisoryText({ text }) {
    return (
        <div className={styles.advisoryManagerAdviceTextPlatform}>
            <div className={styles.advisoryManagerAdviceTextPlatformItemLeft}>
                {text}
            </div>
            <div className={styles.advisoryManagerAdviceTextPlatformItemRight}>
                <button
                    style={{
                        background: "none",
                        border: "none",
                        color: "grey",
                        cursor: "pointer",
                    }}
                    title="Pas advies aan"
                >
                    <PencilLine size={16} />
                </button>
                <button
                    style={{
                        background: "none",
                        border: "none",
                        color: "red",
                        cursor: "pointer",
                    }}
                    title="Verwijder advies"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}

export default AdvisoryText;
