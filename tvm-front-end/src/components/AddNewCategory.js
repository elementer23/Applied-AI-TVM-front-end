import { useState, useEffect } from "react";
import styles from "../css/AdvisoryManager.module.css";
import { GetAllCategories, CreateNewCategory } from "../utils/Services";
import Header from "./Header";

function AddNewCategory() {
    const [categories, setCategories] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        async function fetchAllCategories() {
            const data = await GetAllCategories();
            if (data.success) {
                const categoryData = data.current_response;
                if (categoryData.length > 0) setCategories(categoryData);
            }
        }

        fetchAllCategories();
    }, []);

    const handleSubmit = async () => {
        const data = await CreateNewCategory(input);

        if (data.success) {
            console.log("You created a new Category");
            setInput("");
        }
    };

    return (
        <div className="section right-section">
            <Header />
            <div className={styles.advisoryManagerHeader}>
                <h3 className={styles.advisoryManagerHeading}>
                    Voeg categorie toe
                </h3>
            </div>
            <div className={styles.advisoryManagerSection}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "10px" }}>
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
                            <button className={styles.cancelBtn}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddNewCategory;
