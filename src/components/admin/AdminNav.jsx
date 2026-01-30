import { NavLink } from "react-router-dom";
import "./AdminNav.css";

const AdminNav = () => (
  <nav className="admin-nav">
    <NavLink to="/admin">Dashboard</NavLink>
    <NavLink to="/admin/analytics">Analytics</NavLink>
    <NavLink to="/admin/users">Users</NavLink>
    <NavLink to="/admin/categories">Categories</NavLink>
    <NavLink to="/admin/transactions">Transactions</NavLink>
  </nav>
);

export default AdminNav;
