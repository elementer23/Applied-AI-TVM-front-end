import { useState, useEffect } from "react";
import styles from "../css/AdvisoryManager.module.css";
import { GetAllCategories, CreateNewCategory } from "../utils/Services";
import Header from "./Header";
import "../css/Error.css";

function AddNewCategory() {
    const [categories, setCategories] = useState([]);
    const [input, setInput] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isCategory, setIsCategory] = useState(false);

    async function fetchAllCategories() {
        const data = await GetAllCategories();
        if (data.success) {
            const categoryData = data.current_response;
            if (categoryData.length > 0) setCategories(categoryData);
            setIsCategory(true);
        } else {
            setCategories([]);
            setIsCategory(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await CreateNewCategory(input);

        if (data.success) {
            setInput("");
            setError(null);
            setSuccess(data.message);
            await fetchAllCategories();
        } else {
            setError(data.message);
            setSuccess(null);
        }
    };

    useEffect(() => {
        fetchAllCategories();
    }, []);

    return (
        <div className="section right-section">
            <Header />
            {error && <div className="errorComponent">{error}</div>}
            {success && <div className="successComponent">{success}</div>}
            <div className={styles.advisoryManagerHeader}>
                <h3 className={styles.advisoryManagerHeading}>
                    Voeg categorie toe
                </h3>
            </div>
            <div className={styles.advisoryManagerSection}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "10px" }}>
                        {!isCategory && (
                            <strong>Geen bestaande categorieën</strong>
                        )}

                        {isCategory && (
                            <>
                                <strong>Bestaande categorieën: </strong>
                                <span>
                                    {" ( "}
                                    {categories &&
                                        categories.map((category) => (
                                            <span key={category.id}>
                                                {category.name + "; "}
                                            </span>
                                        ))}
                                    {" ) "}
                                </span>
                            </>
                        )}
                    </div>
                    <div>
                        <label htmlFor="categoryName">categorie naam</label>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className={styles.advisoryManagerInput}
                            id="categoryName"
                            required
                        />
                    </div>
                    <div className={styles.advisoryManagerActions}>
                        <div className={styles.advisoryManagerActionsContainer}>
                            <button className={styles.successBtn} type="submit">
                                Creëren
                            </button>
                            <button
                                type="button"
                                onClick={() => setInput("")}
                                className={styles.cancelBtn}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddNewCategory;
