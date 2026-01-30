import React, { useEffect, useState } from 'react';
import { securedFetch, BALANCE_ENDPOINT } from './api';

const Balance = ({ refreshTrigger }) => {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBalance = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await securedFetch(BALANCE_ENDPOINT);

            let value = 0;
            if (typeof data === 'number') value = data;
            else if (typeof data === 'string') value = parseFloat(data);
            else if (data?.balance !== undefined) value = Number(data.balance);

            setBalance(isNaN(value) ? 0 : value);

        } catch (err) {
            console.error(err.message);
            setError(err.message);
            setBalance(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, [refreshTrigger]); // 🔥 auto-refresh

    if (loading) return <div className="component-card">Loading balance...</div>;
    if (error) return <div className="component-card error">{error}</div>;

    return (
        <div className="component-card">
            <h3>Current Balance</h3>
            <h2 style={{ color: balance >= 0 ? 'green' : 'red' }}>
                ₹ {balance.toFixed(2)}
                <td>{formatCurrency(tx.amount)}</td>

            </h2>
            <button onClick={fetchBalance}>Refresh</button>
        </div>
    );
};

export default Balance;
