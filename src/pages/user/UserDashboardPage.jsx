import { useEffect, useState } from "react";
import { securedFetch } from "../../api/api";
import AddTransaction from "./AddTransaction";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [balance, setBalance] = useState("Loading...");

  useEffect(() => {
    securedFetch("/api/transactions/balance")
      .then((data) => setBalance(`₹${data.balance.toFixed(2)}`))
      .catch(() => setBalance("N/A"));
  }, []);

  return (
    <div className="dashboard-container">
      <div className="balance-card">
        <p className="balance-label">Current Balance</p>
        <h1 className="balance-value">{balance}</h1>
      </div>

      <div className="dashboard-section">
        <AddTransaction />
      </div>
    </div>
  );
};

export default UserDashboard;
