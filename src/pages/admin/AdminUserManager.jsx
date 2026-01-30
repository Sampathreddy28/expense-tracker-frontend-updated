import { useEffect, useState } from "react";
import {
  securedFetch,
  ADMIN_PROMOTE_USER,
  ADMIN_BLOCK_USER,
  ADMIN_UNBLOCK_USER,
  ADMIN_FORCE_LOGOUT
} from "../../api/api";

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
      const data = await securedFetch("/api/admin/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const promoteUser = async (id) => {
    await ADMIN_PROMOTE_USER(id);
    loadUsers();
  };

  const blockUser = async (id) => {
    await ADMIN_BLOCK_USER(id);
    loadUsers();
  };

  const unblockUser = async (id) => {
    await ADMIN_UNBLOCK_USER(id);
    loadUsers();
  };
const forceLogout = async (username) => {
  await ADMIN_FORCE_LOGOUT(username);
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
          {users.map(user => {
            const isAdmin = user.roles?.some(
              r => r.name === "ROLE_ADMIN" || r === "ROLE_ADMIN"
            );

            return (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.roles?.map(r => r.name || r).join(", ")}</td>

                <td>
                  {/* Promote */}
                  <button
                    onClick={() => promoteUser(user.id)}
                    disabled={isAdmin}
                  >
                    Promote
                  </button>

                  {/* Block / Unblock (NON ADMINS ONLY) */}
                  {!isAdmin && (
                    user.enabled ? (
                      <button
                        onClick={() => blockUser(user.id)}
                        style={{ marginLeft: 8, color: "red" }}
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        onClick={() => unblockUser(user.id)}
                        style={{ marginLeft: 8, color: "green" }}
                      >
                        Unblock
                      </button>
                    )
                  )}

                  {/* Force Logout */}
                  <button
                    onClick={() => forceLogout(user.username)}
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
