import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { forceLogout } from "../../api/api";
import "./Layout.css";

const UserLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    forceLogout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="layout">
      <Navbar onLogout={handleLogout} />

      <div className="layout-body">
        <Sidebar />

        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
