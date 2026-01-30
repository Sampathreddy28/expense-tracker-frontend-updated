import React, { useEffect, useState } from 'react';
import { securedFetch, CATEGORY_BASE_ENDPOINT } from './api';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await securedFetch(CATEGORY_BASE_ENDPOINT);
                
                // Ensure the response is an array
                if (!Array.isArray(data)) {
                    throw new Error("Invalid data format: expected an array of categories.");
                }

                setCategories(data);
            } catch (err) {
                console.error("Category fetch error:", err.message);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (isLoading) return <div>Loading categories...</div>;

    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="category-manager">
            <h2>Categories</h2>
            <ul>
                {categories.map((cat) => (
                    <li key={cat.id}>{cat.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryManager;
