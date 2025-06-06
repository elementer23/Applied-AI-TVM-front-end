import styles from "../../css/AdvisoryManager.module.css";
import AdvisoryText from "./AdvisoryText.js";

function Subcategory({
    subcategory,
    subSelectedKey,
    setSubSelectedKey,
    advisoryText,
    onAdvisoryUpdate,
    onAdvisoryDelete,
}) {
    const isSelected = subSelectedKey === subcategory.id;

    return (
        <div>
            <div
                className={styles.advisoryManagerSubcategoryPlatformItem}
                onClick={() => setSubSelectedKey(subcategory.id)}
            >
                <span>{subcategory.name}</span>
            </div>
            {isSelected && advisoryText && (
                <AdvisoryText
                    advisoryText={advisoryText}
                    onAdvisoryUpdate={(id, newText) =>
                        onAdvisoryUpdate(id, newText)
                    }
                    onAdvisoryDelete={(id) => onAdvisoryDelete(id)}
                />
            )}
        </div>
    );
}

export default Subcategory;
