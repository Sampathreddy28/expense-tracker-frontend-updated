import { useState } from "react";
import api from "../../api/axios";

function AlertSettings() {
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const sendTestAlert = async () => {
    setLoading(true);
    try {
      await api.post("/api/alerts/test");
      alert("📧 Test email sent!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send test email");
    } finally {
      setLoading(false);
    }
  };

  const sendMonthlyReport = async () => {
    setLoading(true);
    try {
      const res = await api.post(
        "/api/reports/send-monthly-report"
      );
      alert(res.data?.message || "📊 Monthly report sent!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send monthly report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Email Alerts</h3>

      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={() => setEnabled(!enabled)}
        />
        Enable Email Alerts
      </label>

      <br /><br />

      <button
        onClick={sendTestAlert}
        disabled={!enabled || loading}
      >
        {loading ? "Sending..." : "Send Test Email"}
      </button>

      <br /><br />

      <button
        onClick={sendMonthlyReport}
        disabled={!enabled || loading}
      >
        {loading ? "Sending..." : "Send Monthly Report"}
      </button>
    </div>
  );
}

export default AlertSettings;
