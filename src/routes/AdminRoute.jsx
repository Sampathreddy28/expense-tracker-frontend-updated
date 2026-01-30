import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "ROLE_ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
