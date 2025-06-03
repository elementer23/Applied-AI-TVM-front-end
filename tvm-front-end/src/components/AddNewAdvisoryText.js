import Header from "./Header";
import styles from "../css/AdvisoryManager.module.css";
import { useEffect, useState } from "react";
import { GetAllCategories } from "../utils/Services";

function AddNewAdvisoryText() {
    const [categories, setCategories] = useState([]);

    async function fetchAllCategories() {
        const data = await GetAllCategories();
        setCategories(data.current_response);
    }

    useEffect(() => {
        fetchAllCategories();
    }, []);

    return (
        <div className="section right-section">
            <Header />
            <div className={styles.advisoryManagerHeader}>
                <h3 className={styles.advisoryManagerHeading}>
                    Voeg een nieuwe advies tekst toe
                </h3>
            </div>
            <div className={styles.advisoryManagerSection}>
                {/* <form onSubmit={handleSubmit}> */}
                <form>
                    <div>
                        <label htmlFor="categoryName">Category naam</label>
                        <select
                            name="categoryId"
                            id="categoryName"
                            className={styles.advisoryManagerInput}
                        >
                            {categories.map((category) => (
                                <option value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            // onChange={handleInput}
                            className={styles.advisoryManagerInput}
                            name="categoryId"
                            id="categoryName"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="subcategoryName">
                            Sub-category naam
                        </label>
                        <input
                            type="text"
                            // onChange={handleInput}
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
                            // onChange={handleInput}
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
                </form>
                <div className={styles.advisoryManagerActions}>
                    <div className={styles.advisoryManagerActionsContainer}>
                        <button
                            className={styles.successBtn}
                            // onClick={handleSubmit}
                        >
                            Creëren
                        </button>
                        <button className={styles.cancelBtn}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddNewAdvisoryText;
