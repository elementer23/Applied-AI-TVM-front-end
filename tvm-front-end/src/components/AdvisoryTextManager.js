import Header from "./Header";
import styles from "../css/AdvisoryManager.module.css";
import { useEffect, useState } from "react";
import Category from "./advisoryTextManagerComponents/Category.js";
import "../css/Error.css";
import {
    GetAdvisoryTextBySubcategoryId,
    GetAllCategories,
    GetAllSubcategoriesByCategory,
    UpdateAdvisoryText,
    DeleteAdvisoryText,
    UpdateCategory,
    DeleteSingleCategory,
} from "../utils/Services";
import MessageOutcomeComponent from "./errorComponents/MessageOutcomeComponent.js";

function AdvisoryTextManager() {
    const [categories, setCategories] = useState([]);
    const [isCategory, setIsCategory] = useState(false);
    const [selectedKey, setSelectedKey] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [subSelectedKey, setSubSelectedKey] = useState(null);
    const [advisoryText, setAdvisoryText] = useState(null);
    const [outcomeHandler, setOutcomeHandler] = useState({
        success: null,
        error: null,
    });
    const [searchTerm, setSearchTerm] = useState("");

    async function fetchAllCategories() {
        const data = await GetAllCategories();
        if (data.success) {
            const categoryData = data.current_response;
            setCategories(categoryData);
            setIsCategory(true);
        } else {
            setIsCategory(false);
            setCategories([]);
        }
    }

    useEffect(() => {
        async function fetchSubcategories() {
            if (selectedKey !== null) {
                const data = await GetAllSubcategoriesByCategory(selectedKey);
                if (data.success) {
                    setSubcategories(data.current_response);
                } else {
                    setSubcategories([]);
                }
            }
        }

        fetchSubcategories();
    }, [selectedKey]);

    useEffect(() => {
        async function fetchAdviceText() {
            if (subSelectedKey !== null) {
                const data = await GetAdvisoryTextBySubcategoryId(
                    subSelectedKey
                );
                if (data.success) {
                    setAdvisoryText(data.current_response);
                } else {
                    setAdvisoryText(null);
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
            setOutcomeHandler({ success: data.message, error: null });
        } else {
            setOutcomeHandler({ success: null, error: data.message });
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
            setOutcomeHandler({ success: data.message, error: null });
        } else {
            setOutcomeHandler({ success: null, error: data.message });
        }
    }

    async function updateCategoryName(categoryId, categoryName) {
        const data = await UpdateCategory(categoryId, categoryName);

        if (data.success) {
            setCategories((prevCategories) =>
                prevCategories.map((cat) =>
                    cat.id === categoryId ? { ...cat, name: categoryName } : cat
                )
            );
            setOutcomeHandler({ success: data.message, error: null });
        } else {
            setOutcomeHandler({ success: null, error: data.message });
        }
    }

    async function deleteCategory(categoryId, confirmation) {
        const data = await DeleteSingleCategory(categoryId, confirmation);

        if (data.success) {
            setSubcategories([]);
            setAdvisoryText(null);
            setSubSelectedKey(null);
            setSelectedKey(null);
            fetchAllCategories();
            setOutcomeHandler({ success: data.message, error: null });
        } else {
            setOutcomeHandler({ success: null, error: data.message });
        }
    }

    useEffect(() => {
        fetchAllCategories();
    }, []);

    return (
        <div className="section right-section">
            <Header />
            <MessageOutcomeComponent
                outcomeHandler={outcomeHandler}
                setOutcomeHandler={setOutcomeHandler}
            />
            {!isCategory && <div>Er zijn momenteel geen categorieën.</div>}
            {isCategory && (
                <>
                    {" "}
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
                                    onCategoryUpdate={updateCategoryName}
                                    onCategoryDelete={deleteCategory}
                                    searchTerm={searchTerm}
                                />
                            ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default AdvisoryTextManager;
