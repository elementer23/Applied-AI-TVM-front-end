import styles from "../../css/AdvisoryManager.module.css";
import AdvisoryText from "./AdvisoryText.js";
import { useCallback, useEffect, useRef } from "react";

/**
 * This is a component which contains the subcategories,
 * that correlate to the earlier selected key belonging to
 * Category. It will show the corresponding set of subcategories
 * and will show a message once it's empty.
 * @param {Array} subcategory - an array containing subcategories
 * @param {*} subSelectedKey - the selected key containing the chosen id
 * @param {*} setSubSelectedKey - the useState to set the chosen id with
 * @param {Array} advisoryText - an array containing advisory texts
 * @param {*} onAdvisoryUpdate - method to update the advisory text
 * @param {*} onAdvisoryDelete - method to delete the advisory text
 * @param {*} searchTerm - method that pushes the search term
 * @returns The Subcategory component
 */
function Subcategory({
    subcategory,
    subSelectedKey,
    setSubSelectedKey,
    advisoryText,
    onAdvisoryUpdate,
    onAdvisoryDelete,
    searchTerm,
}) {
    const isSelected = subSelectedKey === subcategory.id;
    const matchRef = useRef(null);

    /**
     * Uses the useCallback hook
     * to check whether the given input
     * is present inside off the subcategories
     * and advisory texts
     */
    const matchesSearch = useCallback(() => {
        if (!searchTerm) return false;
        const search = searchTerm.toLowerCase();
        const subName = subcategory.name?.toLowerCase() || "";
        const adviceText = advisoryText?.text?.toLowerCase() || "";
        return subName.includes(search) || adviceText.includes(search);
    }, [advisoryText, searchTerm, subcategory]);

    useEffect(() => {
        if (matchesSearch() && matchRef.current) {
            matchRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [searchTerm, matchesSearch]);

    return (
        <div
            ref={matchesSearch() ? matchRef : null}
            style={{
                backgroundColor: matchesSearch() ? "#ffffcc" : "transparent",
                padding: "0.5rem",
                borderRadius: "8px",
                marginBottom: "0.5rem",
            }}
        >
            <div
                className={styles.advisoryManagerSubcategoryPlatformItem}
                onClick={() =>
                    setSubSelectedKey((checkKey) =>
                        checkKey === subcategory.id ? null : subcategory.id
                    )
                }
            >
                <span>{subcategory.name.replace(/[_]/g, " ")}</span>
            </div>
            {isSelected && (
                <>
                    {!advisoryText && (
                        <div>Er is hier geen advies tekst voor beschikbaar</div>
                    )}
                    {advisoryText && (
                        <AdvisoryText
                            advisoryText={advisoryText}
                            onAdvisoryUpdate={(id, newText) =>
                                onAdvisoryUpdate(id, newText)
                            }
                            onAdvisoryDelete={(id) => onAdvisoryDelete(id)}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default Subcategory;
