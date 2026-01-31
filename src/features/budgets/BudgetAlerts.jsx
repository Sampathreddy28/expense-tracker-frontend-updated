import { useEffect, useState } from "react";
import {
  BUDGETS_ALERTS_ENDPOINT
} from "../../api/api";
import { API_BASE_URL } from "../../api/api";

export default function BudgetAlertBanner() {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    checkAlerts();
  }, []);

  const checkAlerts = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
     `${API_BASE_URL}${BUDGETS_ALERTS_ENDPOINT}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const text = await res.text();

    if (!res.ok) {
      setAlert(text);
    } else {
      setAlert(null);
    }
  };

  if (!alert) return null;

  return (
    <div className="alert alert-warning">
      ⚠️ <strong>Budget Alert:</strong> {alert}
    </div>
  );
}
