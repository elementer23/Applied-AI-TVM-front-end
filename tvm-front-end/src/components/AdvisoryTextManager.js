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

    useEffect(() => {
        async function fetchAllCategories() {
            const data = await GetAllCategories();
            const categoryData = data.current_response;
            setCategories(categoryData);

            if (categoryData.length > 0) setSelectedKey(categoryData[0].id);
        }

        fetchAllCategories();
    }, []);

    console.log(selectedKey);

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
                        <div
                            key={category.id}
                            className={styles.advisoryManagerCategoryPlatform}
                            onClick={() => setSelectedKey(category.id)}
                        >
                            {category.name}
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default AdvisoryTextManager;
