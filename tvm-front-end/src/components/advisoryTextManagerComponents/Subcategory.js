import styles from "../../css/AdvisoryManager.module.css";
import AdvisoryText from "./AdvisoryText.js";
import { useCallback, useEffect, useRef } from "react";

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
