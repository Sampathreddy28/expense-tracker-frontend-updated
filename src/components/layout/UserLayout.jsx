import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { forceLogout } from "../../api/api";
import "./Layout.css";

const UserLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    forceLogout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="layout">
      <Navbar onLogout={handleLogout} onMenuClick={() => setSidebarOpen(true)} />

      <div className="layout-body">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
