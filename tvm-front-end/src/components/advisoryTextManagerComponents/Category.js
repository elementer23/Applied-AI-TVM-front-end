import styles from "../../css/AdvisoryManager.module.css";
import { Trash2, PencilLine } from "lucide-react";
import Subcategory from "./Subcategory";
import { useState } from "react";

/**
 * This is a component which contains the Categories.
 * Will show the corresponding category, through a means
 * of a loop in AdvisoryTextManager.
 * @param {Array} category - an array containing categories
 * @param {*} selectedKey - the selected key containing the chosen category id
 * @param {*} setSelectedKey - the useState method to set the id with
 * @param {Array} subcategories - an array containing subcategories
 * @param {*} subSelectedKey - the selected key containing the chosen subcategory id
 * @param {*} setSubSelectedKey - the useState method to set the id with
 * @param {Array} advisoryText - an array containing advisory texts
 * @param {*} onAdvisoryUpdate - method to update advisory text with
 * @param {*} onAdvisoryDelete - method to delete advisory text with
 * @param {*} onCategoryUpdate - method to update category with
 * @param {*} onCategoryDelete - method to delete category with
 * @param {*} searchTerm - method to pass the search term with
 * @returns The Category component
 */
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
    searchTerm,
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
                    {!displayItems && category.name.replace(/[_]/g, " ")}
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
                            searchTerm={searchTerm}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Category;
