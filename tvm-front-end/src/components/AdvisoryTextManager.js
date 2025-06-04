import Header from "./Header";
import styles from "../css/AdvisoryManager.module.css";
import { useEffect, useState } from "react";
import {
    GetAllCategories,
    GetAllSubcategoriesByCategory,
} from "../utils/Services";

function AdvisoryTextManager() {
    const [categories, setCategories] = useState([]);
    const [selectedKey, setSelectedKey] = useState(null);
    const [subcategories, setSubcategories] = useState([]);

    useEffect(() => {
        async function fetchAllCategories() {
            const data = await GetAllCategories();
            const categoryData = data.current_response;
            setCategories(categoryData);
        }

        fetchAllCategories();
    }, []);

    useEffect(() => {
        async function fetchSubcategories() {
            const data = await GetAllSubcategoriesByCategory(selectedKey);
            if (data.success) setSubcategories(data.current_response);
        }

        fetchSubcategories();
    }, [selectedKey]);

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
                        <div key={category.id}>
                            <div
                                className={
                                    styles.advisoryManagerCategoryPlatform
                                }
                                onClick={() => setSelectedKey(category.id)}
                            >
                                {category.name}
                            </div>
                            {selectedKey === category.id && (
                                <div>
                                    {subcategories.map((subcategory) => (
                                        <div
                                            key={subcategory.id}
                                            className={
                                                styles.advisoryManagerSubcategoryPlatform
                                            }
                                        >
                                            {subcategory.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default AdvisoryTextManager;
