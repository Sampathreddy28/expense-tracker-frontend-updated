import { saveAs } from "file-saver";
import api from "../api/axios";
import { FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import "./ReportsPage.css";

import {
  REPORTS_PDF_ENDPOINT,
  REPORTS_CSV_ENDPOINT,
  REPORTS_EXCEL_ENDPOINT,
} from "../api/api";

export default function ReportsPage() {
  const download = async (type) => {
    let endpoint;

    if (type === "pdf") endpoint = REPORTS_PDF_ENDPOINT;
    if (type === "csv") endpoint = REPORTS_CSV_ENDPOINT;
    if (type === "excel") endpoint = REPORTS_EXCEL_ENDPOINT;

    try {
      const res = await api.get(endpoint, {
        responseType: "blob",
      });

      saveAs(res.data, `transactions.${type}`);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div className="reports-card">
      <h2 className="reports-title">📄 Reports</h2>

      <div className="reports-buttons">
        <button className="report-btn pdf" onClick={() => download("pdf")}>
          <FaFilePdf className="report-icon" />
          Download PDF
        </button>

        <button className="report-btn csv" onClick={() => download("csv")}>
          <FaFileCsv className="report-icon" />
          Download CSV
        </button>

        <button className="report-btn excel" onClick={() => download("excel")}>
          <FaFileExcel className="report-icon" />
          Download Excel
        </button>
      </div>
    </div>
  );
}
