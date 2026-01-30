import React, { useEffect, useState } from 'react';
import { securedFetch } from '../../api/api';
import { PieChart, Pie, Tooltip, Legend } from 'recharts';

const AnalyticsCategorySummary = () => {
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        securedFetch('/api/transactions/summary/category')
            .then(data => {
                // Backend returns: [categoryName, totalAmount]
                const formatted = data.map(row => ({
                    name: row[0],
                    value: row[1],
                }));
                setSummary(formatted);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading category analytics...</p>;
    if (summary.length === 0) return <p>No data available</p>;

    return (
        <div className="component-card">
            <h3>Expenses by Category</h3>

            <PieChart width={320} height={320}>
                <Pie
                    data={summary}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    fill="#82ca9d"
                />
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
};

export default AnalyticsCategorySummary;
