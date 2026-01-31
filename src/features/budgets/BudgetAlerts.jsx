import { useEffect, useState } from "react";
import api from "../../api/axios";
import { BUDGETS_ALERTS_ENDPOINT } from "../../api/api";

export default function BudgetAlertBanner() {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    checkAlerts();
  }, []);

  const checkAlerts = async () => {
    try {
      const res = await api.get(BUDGETS_ALERTS_ENDPOINT);

      // Backend returns { status, message }
      if (res.data?.status === "ALERT") {
        setAlert(res.data.message);
      } else {
        setAlert(null);
      }

    } catch (err) {
      console.error("Alert fetch error:", err.message);
    }
  };

  if (!alert) return null;

  return (
    <div className="alert alert-warning">
      ⚠️ <strong>Budget Alert:</strong> {alert}
    </div>
  );
}
