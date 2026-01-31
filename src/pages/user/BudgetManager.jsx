import React, { useEffect, useState } from "react";
import api from "./axios"; // ✅ Import axios instance
import { BUDGETS_BASE_ENDPOINT } from "./api";

const BudgetManager = () => {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await api.get(BUDGETS_BASE_ENDPOINT); // ✅ Axios call
        const data = res.data;

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }

        setBudgets(data);
      } catch (err) {
        console.error("Budget fetch error:", err.message);

        if (!err.message?.toLowerCase().includes("token")) {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  if (isLoading) return <div>Loading budgets...</div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div className="budget-manager">
      <h2>Budgets</h2>
      {budgets.length === 0 ? (
        <p>No budgets created yet</p>
      ) : (
        <ul>
          {budgets.map((budget) => (
            <li key={budget.id}>
              {budget.name || budget.categoryName || "Unnamed"} :
              ${Number(budget.amount ?? budget.limit ?? 0).toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BudgetManager;
