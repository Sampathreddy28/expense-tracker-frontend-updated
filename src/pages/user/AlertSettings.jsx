import { useState } from "react";
import { securedFetch } from "../../api/api";

function AlertSettings() {
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const sendTestAlert = async () => {
    setLoading(true);
    try {
      await securedFetch("/api/alerts/test", {
        method: "POST",
      });
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
      const res = await securedFetch(
        "/api/reports/send-monthly-report",
        { method: "POST" }
      );
      alert(res?.message || "📊 Monthly report sent!");
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

      <button onClick={sendTestAlert} disabled={!enabled || loading}>
        {loading ? "Sending..." : "Send Test Email"}
      </button>

      <br /><br />

      <button onClick={sendMonthlyReport} disabled={!enabled || loading}>
        {loading ? "Sending..." : "Send Monthly Report"}
      </button>
    </div>
  );
}

export default AlertSettings;
