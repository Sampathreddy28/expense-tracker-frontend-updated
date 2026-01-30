import React from "react";
import MonthlySummary from "./MonthlySummary";
import AnalyticsCategorySummary from "./AnalyticsCategorySummary";
import AnalyticsMonthlySummary from "./AnalyticsMonthlySummary";
import MonthlyTrendChart from "./MonthlyTrendChart";
import { useState, useEffect } from "react";
import { USER_MONTHLY_TREND } from "../../api/api";


export default function AnalyticsDashboard() {
   const [monthlyTrend, setMonthlyTrend] = useState([]);

  useEffect(() => {
    fetch(USER_MONTHLY_TREND, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(setMonthlyTrend)
      .catch(console.error);
  }, []);
  return (
    <div className="grid-section alerts-analytics">
      <MonthlySummary />
      <AnalyticsCategorySummary />
      <AnalyticsMonthlySummary />
      <MonthlyTrendChart data={monthlyTrend} />

    </div>
  );
}
