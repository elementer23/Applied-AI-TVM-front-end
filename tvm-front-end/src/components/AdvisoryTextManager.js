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
    UpdateCategory,
    DeleteSingleCategory,
} from "../utils/Services";

function AdvisoryTextManager() {
    const [categories, setCategories] = useState([]);
    const [selectedKey, setSelectedKey] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [subSelectedKey, setSubSelectedKey] = useState(null);
    const [advisoryText, setAdvisoryText] = useState(null);

    useEffect(() => {
        async function fetchAllCategories() {
            const data = await GetAllCategories();
            if (data.success) {
                const categoryData = data.current_response;
                setCategories(categoryData);
            }
        }

        fetchAllCategories();
    }, []);

    useEffect(() => {
        async function fetchSubcategories() {
            const data = await GetAllSubcategoriesByCategory(selectedKey);
            if (data.success) {
                setSubcategories(data.current_response);
            }
        }

        fetchSubcategories();
    }, [selectedKey]);

    useEffect(() => {
        async function fetchAdviceText() {
            const data = await GetAdvisoryTextBySubcategoryId(subSelectedKey);
            if (data.success) {
                setAdvisoryText(data.current_response);
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

    async function updateCategoryName(categoryId, categoryName) {
        const data = await UpdateCategory(categoryId, categoryName);

        if (data.success) {
            setCategories((prevCategories) =>
                prevCategories.map((cat) =>
                    cat.id === categoryId ? { ...cat, name: categoryName } : cat
                )
            );
            console.log(data.current_content);
        }
    }

    async function deleteCategory(categoryId, confirmation) {
        const data = await DeleteSingleCategory(categoryId, confirmation);

        if (data.success) {
            setCategories((prevCategories) =>
                prevCategories.filter((prevCat) => prevCat.id !== selectedKey)
            );
            setSubcategories([]);
            setAdvisoryText(null);
            setSubSelectedKey(null);
            setSelectedKey(null);
            console.log(data.current_content);
        }
    }

    return (
        <div className="section right-section">
            <Header />
            <div className={styles.advisoryManagerHeader}>
                <h3 className={styles.advisoryManagerHeading}>
                    Advies overzicht
                </h3>
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
                        />
                    ))}
            </div>
        </div>
    );
}

export default AdvisoryTextManager;
