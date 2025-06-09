import styles from "../../css/AdvisoryManager.module.css";
import { Trash2, PencilLine } from "lucide-react";
import Subcategory from "./Subcategory";
import { useState } from "react";

function Category({
    category,
    selectedKey,
    setSelectedKey,
    subcategories,
    subSelectedKey,
    setSubSelectedKey,
    advisoryText,
    onAdvisoryUpdate,
    onAdvisoryDelete,
    onCategoryUpdate,
    onCategoryDelete,
}) {
    const [displayItems, setDisplayItems] = useState(false);
    const [editedText, setEditedText] = useState(category.name);

    const handleCategoryUpdate = () => {
        onCategoryUpdate(category.id, editedText);
        setDisplayItems(false);
    };

    const handleCategoryDelete = () => {
        const confirmation = window.confirm(
            "Weet je zeker dat je deze categorie wilt verwijderen?"
        );
        const trueConfirmation = window.confirm(
            "Weet je heel, heel zeker dat je het wilt verwijderen?"
        );

        if (confirmation) {
            if (trueConfirmation) {
                onCategoryDelete(category.id, trueConfirmation);
            }
        }
    };

    const isSelected = selectedKey === category.id;

    return (
        <div>
            <div
                className={styles.advisoryManagerCategoryPlatform}
                onClick={() => {
                    setSelectedKey((checkKey) =>
                        checkKey === category.id ? null : category.id
                    );
                    setSubSelectedKey(null);
                }}
            >
                <div className={styles.advisoryManagerCategoryPlatformItemLeft}>
                    {!displayItems && category.name}
                    {displayItems && (
                        <input
                            type="text"
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            className={styles.advisoryManagerInput}
                            required
                        />
                    )}
                </div>
                <div
                    className={styles.advisoryManagerCategoryPlatformItemRight}
                >
                    <button
                        onClick={() => setDisplayItems(true)}
                        style={{
                            background: "none",
                            border: "none",
                            color: "grey",
                            cursor: "pointer",
                            display: displayItems ? "none" : "inline-block",
                        }}
                        title="Pas categorie aan"
                    >
                        <PencilLine size={16} />
                    </button>
                    <button
                        className={styles.successBtn}
                        onClick={handleCategoryUpdate}
                        style={{
                            display: displayItems ? "inline-block" : "none",
                        }}
                    >
                        update
                    </button>
                    <button
                        onClick={handleCategoryDelete}
                        style={{
                            background: "none",
                            border: "none",
                            color: "red",
                            cursor: "pointer",
                            display: displayItems ? "none" : "inline-block",
                        }}
                        title="Verwijder advies"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        onClick={() => {
                            setEditedText(category.name);
                            setDisplayItems(false);
                        }}
                        className={styles.cancelBtn}
                        style={{
                            display: displayItems ? "inline-block" : "none",
                        }}
                    >
                        cancel
                    </button>
                </div>
            </div>

            {isSelected && (
                <div className={styles.advisoryManagerSubcategoryPlatform}>
                    {subcategories.length === 0 && (
                        <div>
                            Momenteel geen subcategorieën voor de gevraagde
                            categorie.
                        </div>
                    )}
                    {subcategories.map((subcategory) => (
                        <Subcategory
                            key={subcategory.id}
                            subcategory={subcategory}
                            subSelectedKey={subSelectedKey}
                            setSubSelectedKey={setSubSelectedKey}
                            advisoryText={advisoryText}
                            onAdvisoryUpdate={onAdvisoryUpdate}
                            onAdvisoryDelete={onAdvisoryDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Category;
