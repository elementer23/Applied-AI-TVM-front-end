import Header from "./Header";
import styles from "../css/AdvisoryManager.module.css";
import { useEffect, useState } from "react";
import MessageOutcomeComponent from "./errorComponents/MessageOutcomeComponent";
import {
    CreateAdvisoryText,
    GetAllCategories,
    GetAllSubcategoriesByCategory,
} from "../utils/Services";

function AddNewAdvisoryText() {
    const [categories, setCategories] = useState([]);
    const [isCategory, setIsCategory] = useState(false);
    const [selectedKey, setSelectedKey] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [isSubcategory, setIsSubcategory] = useState(false);
    const [outcomeHandler, setOutcomeHandler] = useState({
        success: null,
        error: null,
    });
    const [formData, setFormData] = useState({
        categoryId: null,
        subcategory: "",
        advice_text: "",
    });

    const resetFormData = () => {
        setFormData({
            categoryId: null,
            subcategory: "",
            advice_text: "",
        });
    };

    useEffect(() => {
        async function fetchAllCategories() {
            const data = await GetAllCategories();

            if (data.success) {
                const categoryData = data.current_response;
                setCategories(categoryData);
                if (categoryData.length > 0) setSelectedKey(categoryData[0].id);

                setIsCategory(true);
            } else {
                setIsCategory(false);
            }
        }

        fetchAllCategories();
    }, []);

    async function fetchSubcategories(categoryId) {
        const data = await GetAllSubcategoriesByCategory(categoryId);
        if (data.success) {
            setSubcategories(data.current_response);
            setIsSubcategory(true);
        } else {
            setIsSubcategory(false);
        }
    }

    const handleInput = (input) => {
        setFormData({ ...formData, [input.target.name]: input.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const customFormData = {
            ...formData,
            categoryId: selectedKey,
        };
        const data = await CreateAdvisoryText(customFormData);
        if (data.success) {
            setOutcomeHandler({ success: data.message, error: null });
            resetFormData();
            await fetchSubcategories(selectedKey);
        } else {
            setOutcomeHandler({ success: null, error: data.message });
        }
    };

    useEffect(() => {
        fetchSubcategories(selectedKey);
    }, [selectedKey]);

    return (
        <div className="section right-section">
            <Header />
            <MessageOutcomeComponent
                outcomeHandler={outcomeHandler}
                setOutcomeHandler={setOutcomeHandler}
            />
            {!isCategory && (
                <div>
                    Geen categorieën om advies teksten en subcategorieën aan toe
                    te voegen!
                </div>
            )}

            {isCategory && (
                <>
                    {" "}
                    <div className={styles.advisoryManagerHeader}>
                        <h3 className={styles.advisoryManagerHeading}>
                            Voeg een nieuwe advies tekst toe
                        </h3>
                    </div>
                    <div className={styles.advisoryManagerSection}>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="categoryName">
                                    Category naam
                                </label>
                                <select
                                    name="categoryId"
                                    id="categoryName"
                                    className={styles.advisoryManagerInput}
                                    onChange={(e) =>
                                        setSelectedKey(parseInt(e.target.value))
                                    }
                                >
                                    {categories &&
                                        categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: "10px" }}>
                                {!isSubcategory && (
                                    <strong>
                                        Er bestaan nog geen subcategorieën voor
                                        deze categorie
                                    </strong>
                                )}
                                {isSubcategory && (
                                    <>
                                        <strong>
                                            Bestaande Subcategorieën voor
                                            category:{" "}
                                        </strong>
                                        <span>
                                            {" ( "}
                                            {subcategories &&
                                                subcategories.map(
                                                    (subcategory) => (
                                                        <span
                                                            key={subcategory.id}
                                                        >
                                                            {subcategory.name +
                                                                "; "}
                                                        </span>
                                                    )
                                                )}
                                            {" ) "}
                                        </span>
                                    </>
                                )}
                            </div>
                            <div>
                                <label htmlFor="subcategoryName">
                                    Sub-category naam
                                </label>
                                <input
                                    type="text"
                                    value={formData.subcategory}
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
                                    value={formData.advice_text}
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
                                <div
                                    className={
                                        styles.advisoryManagerActionsContainer
                                    }
                                >
                                    <button
                                        className={styles.successBtn}
                                        type="submit"
                                    >
                                        Creëren
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => resetFormData()}
                                        className={styles.cancelBtn}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>{" "}
                </>
            )}
        </div>
    );
}

export default AddNewAdvisoryText;
