import React, { useEffect, useState } from "react";
import { securedFetch } from "../../api/api";
import AddTransaction from "../../pages/user/AddTransaction";
import TransactionHistory from "../../pages/user/TransactionHistory";
import BudgetPage from "../../features/budgets/BudgetPage";
import AnalyticsPage from "../../features/analytics/AnalyticsPage";
import InsightsPage from "../../features/insights/InsightsPage";
import AlertSettings from "./AlertSettings";
import "./Dashboard.css";
import MonthlySummary from "./MonthlySummary";
import MonthlyReportDownload from "./MonthlyReportDownload";
import MonthlyTrendChart from "./MonthlyTrendChart";
import SpendingInsights from "./SpendingInsights";

function Dashboard() {
  if (!localStorage.getItem("token")) {
    window.location.href = "/login";
    return null;
  }

  const [balance, setBalance] = useState("Loading...");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      const data = await securedFetch("/api/transactions/balance");
      setBalance(`₹${Number(data.balance).toFixed(2)}`);
    };
    fetchBalance();
  }, [refreshTrigger]);

  return (
    <>
    
  <div className="dashboard-container">
    <div className="component-card">
      <h3>Current Balance</h3>
      <h1>{balance}</h1>
    </div>

    <AddTransaction onAdded={triggerRefresh} />
    <TransactionHistory refreshTrigger={refreshTrigger} />
    <BudgetPage />
    <AnalyticsPage />
    <InsightsPage />
    <AlertSettings />
   <MonthlyReportDownload />
   <MonthlyTrendChart />
   <SpendingInsights />
  </div>


    </>
  );
}

export default Dashboard;
