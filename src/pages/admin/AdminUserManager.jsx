import { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminUserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const promoteUser = async (id) => {
    await api.put(`/api/admin/users/${id}/promote`);
    loadUsers();
  };

  const blockUser = async (id) => {
    await api.put(`/api/admin/users/${id}/block`);
    loadUsers();
  };

  const unblockUser = async (id) => {
    await api.put(`/api/admin/users/${id}/unblock`);
    loadUsers();
  };

  const forceLogoutUser = async (username) => {
    await api.post(
      `/api/admin/users/${username}/force-logout`
    );
    alert("User force logged out");
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="component-card">
      <h3>👑 Admin – User Management</h3>

      <table style={{ width: "100%", marginTop: 10 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            const isAdmin = user.roles?.some(
              (r) =>
                r.name === "ROLE_ADMIN" ||
                r === "ROLE_ADMIN"
            );

            return (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>
                  {user.roles
                    ?.map((r) => r.name || r)
                    .join(", ")}
                </td>

                <td>
                  {/* Promote */}
                  <button
                    onClick={() =>
                      promoteUser(user.id)
                    }
                    disabled={isAdmin}
                  >
                    Promote
                  </button>

                  {/* Block / Unblock */}
                  {!isAdmin &&
                    (user.enabled ? (
                      <button
                        onClick={() =>
                          blockUser(user.id)
                        }
                        style={{
                          marginLeft: 8,
                          color: "red"
                        }}
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          unblockUser(user.id)
                        }
                        style={{
                          marginLeft: 8,
                          color: "green"
                        }}
                      >
                        Unblock
                      </button>
                    ))}

                  {/* Force logout */}
                  <button
                    onClick={() =>
                      forceLogoutUser(
                        user.username
                      )
                    }
                    style={{ marginLeft: 8 }}
                  >
                    Force Logout
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserManager;
