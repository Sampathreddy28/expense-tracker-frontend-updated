import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");

  // 🚫 Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Wrong role
  if (role && storedRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
