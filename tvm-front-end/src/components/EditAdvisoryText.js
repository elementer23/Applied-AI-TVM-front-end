import Header from "./Header";
import React, { useEffect, useState } from 'react';
import {GetAdvisoryTextById, GetAllCategories, GetSubCategoryByCategoryId} from "../utils/Services";

function EditAdvisoryText() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState('');

    const [fetchedText, setFetchedText] = useState(null);

    useEffect(() =>
    {
        async function fetchCategories()
        {
            const result = await GetAllCategories();

            if (result.success)
            {
                console.log(result.current_response); // Debug
                setCategories(result.current_response);
            }
        }
        fetchCategories();
    }, []);

    useEffect(() =>
    {
        if (!selectedCategory)
        {
            setSubcategories([]);
            setSelectedSubcategory('');
            return;
        }

        async function fetchSubcategories()
        {
            const result = await GetSubCategoryByCategoryId(parseInt(selectedCategory));
            if (result.success)
            {
                setSubcategories(result.current_response);
                setSelectedSubcategory(''); // Reset on category change
            }
        }

        fetchSubcategories();
    }, [selectedCategory]);
    useEffect(() =>
    {
        if (selectedSubcategory)
        {
            async function fetchText()
            {
                const result = await GetAdvisoryTextById(parseInt(selectedSubcategory));
                if (result.success)
                {
                    setFetchedText(result.current_response.text);
                }
            }

            fetchText();
        }
    }, [selectedSubcategory]);
    return (
        <div>
            <label htmlFor="categories">Category:</label>
            <select
                value={selectedCategory}
                onChange={(e) => {
                    const value = e.target.value;
                    setSelectedSubcategory('');
                    setSubcategories([]);
                    setFetchedText(null);
                    setSelectedCategory(value);
                }}
            >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                    </option>
                ))}
            </select>

            {selectedCategory && subcategories.length > 0 && (
                <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                >
                    <option value="">-- Select Sub-category --</option>
                    {subcategories.map((sub) => (
                        <option key={sub.id} value={sub.id.toString()}>
                            {sub.name}
                        </option>
                    ))}
                </select>
            )}{fetchedText && (
                <div>
                    <h3>Advisory Text</h3>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>{fetchedText}</pre>
                </div>
            )}
        </div>
    );
}

export default EditAdvisoryText;
