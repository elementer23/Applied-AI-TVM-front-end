import React from "react";
import styles from "../css/Modal.module.css";
import { useState } from "react";

const Modal = ({ setIsOpen, onSubmit }) => {
    const [formData, setFormData] = useState({
        categoryId: null,
        subcategory: "",
        advice_text: "",
    });

    const handleInput = (input) => {
        setFormData({ ...formData, [input.target.name]: input.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <>
            <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
            <div className={styles.centered}>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <h5 className={styles.heading}>
                            Voeg een nieuw advies toe.
                        </h5>
                    </div>
                    <button
                        className={styles.closeBtn}
                        onClick={() => setIsOpen(false)}
                    >
                        Sluiten
                    </button>
                    <div className={styles.modalContent}>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="categoryName">
                                    Category naam
                                </label>
                                <input
                                    type="text"
                                    onChange={handleInput}
                                    className={styles.modalInput}
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
                                    onChange={handleInput}
                                    className={styles.modalInput}
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
                        </form>
                    </div>
                    <div className={styles.modalActions}>
                        <div className={styles.actionsContainer}>
                            <button
                                className={styles.successBtn}
                                onClick={handleSubmit}
                            >
                                Creëren
                            </button>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;
