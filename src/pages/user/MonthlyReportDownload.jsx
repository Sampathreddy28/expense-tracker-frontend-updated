import { API_BASE_URL } from "../../api/api";
import "./MonthlyReportDownload.css";

export default function MonthlyReportDownload() {
  const downloadPdf = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/reports/monthly/pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download report");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "Monthly_Expense_Report.pdf";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <button onClick={downloadPdf} className="download-report-btn">
      📊 Download Monthly Report (PDF)
    </button>
  );
}
