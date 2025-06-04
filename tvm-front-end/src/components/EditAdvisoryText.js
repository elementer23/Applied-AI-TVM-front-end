import Header from "./Header";
import React, { useEffect, useState } from 'react';
import {GetAllCategories} from "../utils/Services";

function EditAdvisoryText() {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');

    useEffect(() =>
    {
        async function fetchCategories()
        {
            const result = await GetAllCategories();

            if (result.success)
            {
                console.log(result.current_response); // Debug
                setCategories(result.current_response);

                const firstId = result.current_response[0]?.id;
                setSelectedCategoryId(firstId);
            }
        }
        fetchCategories();
    }, []);

    const handleChange = (e) =>
    {
        setCategories(e.target.value);
    };

    return (
        <div>
            <label htmlFor="categories">Category:</label>
            <select
                value={selectedCategoryId || ''}
                onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
            >
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default EditAdvisoryText;
