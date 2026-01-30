import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const role = localStorage.getItem("role");

  const userMenu = [
    { label: "Dashboard", path: "/user/dashboard" },
    { label: "Transactions", path: "/user/transactions" },
    { label: "Analytics", path: "/user/analytics" },
  ];

  const adminMenu = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Categories", path: "/admin/categories" },
    { label: "Transactions", path: "/admin/transactions" },
    { label: "Analytics", path: "/admin/analytics" },
  ];

  const menu = role === "ROLE_ADMIN" ? adminMenu : userMenu;

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">
        {role === "ROLE_ADMIN" ? "Admin Panel" : "Expense Tracker"}
      </h3>

      <ul className="sidebar-menu">
        {menu.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
