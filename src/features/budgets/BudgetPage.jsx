import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  BUDGETS_BASE_ENDPOINT,
  BUDGETS_ALERTS_ENDPOINT
} from "../../api/api";

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const res = await api.get(BUDGETS_BASE_ENDPOINT);
      setBudgets(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const checkAlerts = async () => {
    try {
      const res = await api.get(BUDGETS_ALERTS_ENDPOINT);
      setAlert(res.data); // { status, message }
    } catch (err) {
      setAlert({
        status: "ERROR",
        message: "Failed to check budget alerts"
      });
    }
  };

  return (
    <div>
      <h2>Budgets</h2>

      <ul>
        {budgets.map((b) => (
          <li key={b.id}>
            <strong>{b.category?.name}</strong> — {b.limit} ({b.period})
          </li>
        ))}
      </ul>

      <button onClick={checkAlerts}>
        Check Budget Alerts
      </button>

      {alert && <p>{alert.message}</p>}
    </div>
  );
}
