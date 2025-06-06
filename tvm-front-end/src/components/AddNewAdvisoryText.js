import Header from "./Header";
import styles from "../css/AdvisoryManager.module.css";
import { useEffect, useState } from "react";
import {
    CreateAdvisoryText,
    GetAllCategories,
    GetAllSubcategoriesByCategory,
} from "../utils/Services";

function AddNewAdvisoryText() {
    const [categories, setCategories] = useState([]);
    const [selectedKey, setSelectedKey] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [formData, setFormData] = useState({
        categoryId: null,
        subcategory: "",
        advice_text: "",
    });

    const handleInput = (input) => {
        setFormData({ ...formData, [input.target.name]: input.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const customFormData = {
            ...formData,
            categoryId: selectedKey,
        };
        const content = await CreateAdvisoryText(customFormData);
        if (content.success) console.log("you added something");
    };

    useEffect(() => {
        async function fetchAllCategories() {
            const data = await GetAllCategories();
            const categoryData = data.current_response;
            setCategories(categoryData);

            if (categoryData.length > 0) setSelectedKey(categoryData[0].id);
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
                    Voeg een nieuwe advies tekst toe
                </h3>
            </div>
            <div className={styles.advisoryManagerSection}>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="categoryName">Category naam</label>
                        <select
                            name="categoryId"
                            id="categoryName"
                            className={styles.advisoryManagerInput}
                            onChange={(e) =>
                                setSelectedKey(parseInt(e.target.value))
                            }
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <strong>
                            Bestaande Subcategorieën voor category:{" "}
                        </strong>
                        <span>
                            {" ( "}
                            {subcategories &&
                                subcategories.map((subcategory) => (
                                    <span key={subcategory.id}>
                                        {subcategory.name + "; "}
                                    </span>
                                ))}
                            {" ) "}
                        </span>
                    </div>
                    <div>
                        <label htmlFor="subcategoryName">
                            Sub-category naam
                        </label>
                        <input
                            type="text"
                            onChange={handleInput}
                            className={styles.advisoryManagerInput}
                            name="subcategory"
                            id="subcategoryName"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="insuranceText">
                            Bijbehorende tekst
                        </label>
                        <textarea
                            rows="10"
                            onChange={handleInput}
                            name="advice_text"
                            id="insuranceText"
                            style={{
                                width: "100%",
                                marginBottom: "10px",
                                marginTop: "10px",
                            }}
                            required
                        />
                    </div>
                    <div className={styles.advisoryManagerActions}>
                        <div className={styles.advisoryManagerActionsContainer}>
                            <button className={styles.successBtn} type="submit">
                                Creëren
                            </button>
                            <button className={styles.cancelBtn}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddNewAdvisoryText;
