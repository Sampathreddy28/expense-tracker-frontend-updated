const RequireAdmin = ({ children }) => {
  const role = localStorage.getItem("role");

  if (role !== "ADMIN") {
    return <Navigate to="/login" />;
  }

  return children;
};
  