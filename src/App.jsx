import { Routes, Route, Navigate } from "react-router-dom";

/* AUTH */
import Login from "./auth/Login";
import Register from "./auth/Register";
import "./pages/user/Dashboard.css";
/* LAYOUTS */
import UserLayout from "./components/layout/UserLayout";
import AdminLayout from "./components/layout/AdminLayout";

/* ROUTE GUARD */
import ProtectedRoute from "./pages/user/ProtectedRoute";
/* USER PAGES */
import Dashboard from "./pages/user/Dashboard";
import Analytics from "./pages/user/Analytics";
import TransactionHistory from "./pages/user/TransactionHistory";

/* ADMIN PAGES */
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminCategoryAnalytics from "./pages/admin/AdminCategoryAnalytics";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminUserManager from "./pages/admin/AdminUserManager";

const App = () => {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* USER ROUTES */}
      <Route
        path="/user/*"
        element={
          <ProtectedRoute role="ROLE_USER">
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="transactions" element={<TransactionHistory />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="ROLE_ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUserManager />} />
        <Route path="categories" element={<AdminCategoryAnalytics />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
