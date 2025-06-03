import Header from "./Header";
import styles from "../css/AdvisoryManager.module.css";

function AddNewAdvisoryText() {
    return (
        <div className="section right-section">
            <Header />
            <div className={styles.advisoryManagerHeader}>
                <h3 className={styles.advisoryManagerHeading}>
                    Voeg een nieuwe advies tekst toe
                </h3>
            </div>
        </div>
    );
}

export default AddNewAdvisoryText;
