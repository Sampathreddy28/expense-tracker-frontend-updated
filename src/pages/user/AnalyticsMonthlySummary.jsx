import React, { useEffect, useState } from 'react';
import { securedFetch } from '../../api/api';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from 'recharts';

const AnalyticsMonthlySummary = () => {
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await securedFetch('/api/transactions/summary/monthly');

                // Backend returns: [month, year, total]
                const formatted = data.map(row => ({
                    month: `${row[1]}-${String(row[0]).padStart(2, '0')}`,
                    total: row[2]
                }));

                setSummary(formatted);
            } catch (err) {
                console.error("Monthly summary error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading) return <p>Loading monthly summary...</p>;
    if (summary.length === 0) return <p>No monthly data available</p>;

    return (
        <div className="component-card">
            <h3>Monthly Expenses</h3>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={summary}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnalyticsMonthlySummary;
