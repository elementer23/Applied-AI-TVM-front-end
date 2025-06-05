import Header from "./Header";
import styles from "../css/AdvisoryManager.module.css";
import { useEffect, useState } from "react";
// import { Trash2, PencilLine } from "lucide-react";
import Category from "./advisoryTextManagerComponents/Category.js";
import {
    GetAdvisoryTextBySubcategoryId,
    GetAllCategories,
    GetAllSubcategoriesByCategory,
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
                        />
                    ))}
            </div>
        </div>
    );
}

export default AdvisoryTextManager;
