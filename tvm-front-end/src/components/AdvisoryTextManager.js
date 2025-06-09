import Header from "./Header";
import styles from "../css/AdvisoryManager.module.css";
import { useEffect, useState } from "react";
import Category from "./advisoryTextManagerComponents/Category.js";
import {
    GetAdvisoryTextBySubcategoryId,
    GetAllCategories,
    GetAllSubcategoriesByCategory,
    UpdateAdvisoryText,
    DeleteAdvisoryText,
} from "../utils/Services";

function AdvisoryTextManager() {
    const [categories, setCategories] = useState([]);
    const [selectedKey, setSelectedKey] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [subSelectedKey, setSubSelectedKey] = useState(null);
    const [advisoryText, setAdvisoryText] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchAllCategories() {
            const data = await GetAllCategories();
            if (data.success) {
                setCategories(data.current_response);
            }
        }

        fetchAllCategories();
    }, []);

    useEffect(() => {
        async function fetchSubcategories() {
            if (selectedKey !== null) {
                const data = await GetAllSubcategoriesByCategory(selectedKey);
                if (data.success) {
                    setSubcategories(data.current_response);
                }
            }
        }

        fetchSubcategories();
    }, [selectedKey]);

    useEffect(() => {
        async function fetchAdviceText() {
            if (subSelectedKey !== null) {
                const data = await GetAdvisoryTextBySubcategoryId(subSelectedKey);
                if (data.success) {
                    setAdvisoryText(data.current_response);
                }
            }
        }

        fetchAdviceText();
    }, [subSelectedKey]);

    async function updateAdvisoryText(textId, adviceText) {
        const data = await UpdateAdvisoryText(textId, adviceText);

        if (data.success) {
            setAdvisoryText((prevState) => ({
                ...prevState,
                text: adviceText,
            }));
            console.log(data.current_content);
        }
    }

    async function deleteAdvisoryText(textId) {
        const data = await DeleteAdvisoryText(textId);

        if (data.success) {
            setAdvisoryText(null);
            setSubcategories((prevState) =>
                prevState.filter((subcat) => subcat.id !== subSelectedKey)
            );
            setSubSelectedKey(null);
            console.log(data.current_response);
        }
    }

    return (
        <div className="section right-section">
            <Header />
            <div className={styles.advisoryManagerHeader}>
                <h3 className={styles.advisoryManagerHeading}>
                    Advies overzicht
                </h3>
                <div className={styles.searchBarContainer}>
                    <input
                        type="text"
                        placeholder="Zoeken..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            <div className={styles.advisoryManagerSection}>
                {categories &&
                    categories.map((category) => (
                        <Category
                            key={category.id}
                            category={category}
                            selectedKey={selectedKey}
                            setSelectedKey={setSelectedKey}
                            subcategories={subcategories}
                            subSelectedKey={subSelectedKey}
                            setSubSelectedKey={setSubSelectedKey}
                            advisoryText={advisoryText}
                            onAdvisoryUpdate={updateAdvisoryText}
                            onAdvisoryDelete={deleteAdvisoryText}
                            searchTerm={searchTerm}
                        />
                    ))}
            </div>
        </div>
    );
}

export default AdvisoryTextManager;
