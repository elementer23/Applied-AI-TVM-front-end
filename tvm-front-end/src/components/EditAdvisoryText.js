import Header from "./Header";
import React, { useEffect, useState } from 'react';
import {
    GetAdvisoryTextById,
    GetAllCategories,
    GetAllSubcategoriesByCategory,
    UpdateAdvisoryText
} from "../utils/Services";

function EditAdvisoryText() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState('');

    const [textId, setTextId] = useState('');
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
            const result = await GetAllSubcategoriesByCategory(parseInt(selectedCategory));
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
                    setTextId(result.current_response.id);
                    setFetchedText(result.current_response.text);
                }
            }

            fetchText();
        }
    }, [selectedSubcategory]);
    async function handleSave()
    {
        if (!selectedSubcategory || !fetchedText)
        {
            alert("Both category and sub-category must be selected.");
            return;
        }

        const result = await UpdateAdvisoryText(
            textId,
            fetchedText);

        if (result.success)
        {
            alert("Advisory text updated successfully.");
        }
        else
        {
            alert("Failed to update advisory text.");
        }
    }
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

            {subcategories.length > 0 && (
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
            )}{fetchedText !== null && (
                <div>
                    <h3>Edit Advisory Text</h3>
                    <textarea
                        value={fetchedText}
                        onChange={(e) => setFetchedText(e.target.value)}
                        rows={6}
                        cols={60}
                    />
                    <br />
                    <button onClick={handleSave}>Save</button>
                </div>
            )}
        </div>
    );
}

export default EditAdvisoryText;
