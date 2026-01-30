import React, { useEffect, useState } from 'react';
import { securedFetch } from '../../api/api';
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';
import "./MonthlySummary.css";

const MonthlySummary = () => {
    const [summary, setSummary] = useState([]);

    useEffect(() => {
        securedFetch('/api/transactions/summary/monthly')
            .then(setSummary)
            .catch(console.error);
    }, []);

    return (
        <div className="component-card">
            <h3>Monthly Expense Breakdown</h3>
              <div className="chart-box">

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={summary}
                        dataKey="total"
                        nameKey="category"
                        outerRadius={100}
                    />
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
        </div>
    );
};

export default MonthlySummary;
