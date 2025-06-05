import styles from "../../css/AdvisoryManager.module.css";
import AdvisoryText from "./AdvisoryText.js";

function Subcategory({
    subcategory,
    subSelectedKey,
    setSubSelectedKey,
    advisoryText,
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
                <AdvisoryText text={advisoryText.text} />
            )}
        </div>
    );
}

export default Subcategory;
