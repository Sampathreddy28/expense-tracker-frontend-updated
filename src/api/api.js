// ================= BASE URL =================
export const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL || "https://expense-tracker-backend-2-op8c.onrender.com";

// ================= AUTH =================
export const LOGIN_ENDPOINT = "/api/auth/login";
export const REGISTER_ENDPOINT = "/api/auth/signup";
export const REFRESH_ENDPOINT = "/api/auth/refresh";

// ================= TRANSACTIONS =================
export const TRANSACTIONS_ENDPOINT = "/api/transactions";
export const BALANCE_ENDPOINT = "/api/transactions/balance";
export const MONTHLY_SUMMARY_ENDPOINT = "/api/transactions/summary/monthly";
export const CATEGORY_SUMMARY_ENDPOINT = "/api/transactions/summary/category";

// ================= CATEGORIES =================
export const CATEGORY_BASE_ENDPOINT = "/api/categories";

// ================= BUDGETS =================
export const BUDGETS_BASE_ENDPOINT = "/api/budgets";
export const BUDGETS_ALERTS_ENDPOINT = "/api/budgets/alerts";



// ================= LOGOUT =================
export function forceLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");

  // Force full reset
  window.location.replace("/login");
}


// ================= REFRESH TOKEN =================
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  const response = await fetch(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });

  if (!response.ok) return null;

  const data = await response.json();
  localStorage.setItem("token", data.accessToken);
  return data.accessToken;
}

// ================= SECURED FETCH (USER + ADMIN) =================
export const securedFetch = async (endpoint, options = {}) => {
  let token = localStorage.getItem("token");

  if (!token) {
    forceLogout();
    throw new Error("Not authenticated");
  }

  const doFetch = async (accessToken) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...(options.headers || {})
      }
    });

  let response = await doFetch(token);

  // 🔁 Access token expired → try refresh once
  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      forceLogout();
      throw new Error("Session expired");
    }

    response = await doFetch(newToken);
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "API error");
  }

  return response.json();
};
// ================= ADMIN =================
// export const ADMIN_LOGIN_ENDPOINT = "/api/admin/signin";

export async function adminLogin(username, password) {
  const response = await fetch(`http://localhost:8080${ADMIN_LOGIN_ENDPOINT}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    throw new Error("Admin login failed");
  }

  return response.json();
}


// ================= ADMIN ACTIONS =================
export const ADMIN_PROMOTE_USER = (id) =>
  securedFetch(`/api/admin/users/${id}/promote`, {
    method: "PUT"
  });

export const ADMIN_BLOCK_USER = (id) =>
  securedFetch(`/api/admin/users/${id}/block`, {
    method: "PUT"
  });
// ================= ADMIN ANALYTICS =================

export const fetchAdminMonthlyTrend = (username) =>
  securedFetch(`/api/admin/analytics/monthly-trend?username=${username}`);

export const fetchAdminIncomeExpense = () =>
  securedFetch("/api/admin/analytics/income-expense");

export const fetchAdminCategoryAnalytics = (username, start, end) =>
  securedFetch(
    `/api/admin/analytics/category-summary?username=${username}&startDate=${start}&endDate=${end}`
  );


 

/* USER ANALYTICS */
export const USER_MONTHLY_TREND =
  `${API_BASE_URL}/api/analytics/monthly-trend`;



// ================= CREATE ADMIN =================
export const createAdmin = async (payload) => {
  const response = await securedFetch("/api/admin/create-admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to create admin");
  }

  return response.json();
};



// ================= METRICS =================
export const fetchAdminMetrics = async () => {
  return securedFetch("/api/admin/metrics");
};

// ================= ANALYTICS =================
export const fetchMonthlyAnalytics = async () => {
  return securedFetch("/api/admin/analytics");
};

// ================= CATEGORY ANALYTICS =================
export const fetchCategoryAnalytics = async () => {
  return securedFetch("/api/admin/analytics/categories");
};


export const fetchGlobalCategoryAnalytics = async () => {
  return securedFetch("/api/admin/analytics/category-distribution");
};

// ================= ADMIN FORCE LOGOUT =================
export const ADMIN_FORCE_LOGOUT = (username) =>
  securedFetch(`/api/admin/users/${username}/force-logout`, {
    method: "POST"
  });


  export const ADMIN_UNBLOCK_USER = (id) =>
  securedFetch(`/api/admin/users/${id}/unblock`, {
    method: "PUT"
  });


  export const REPORTS_PDF_ENDPOINT = "/api/reports/transactions/pdf";
export const REPORTS_CSV_ENDPOINT = "/api/reports/transactions/csv";
export const REPORTS_EXCEL_ENDPOINT = "/api/reports/transactions/excel";
