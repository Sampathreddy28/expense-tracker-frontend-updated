import { useState } from "react";
import { securedFetch } from "../../api/api";

const AdminCreateAdmin = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createAdmin = async () => {
    try {
      await securedFetch("/api/admin/create-admin", {
        method: "POST",
        body: JSON.stringify({ username, email, password })
      });

      alert("Admin created successfully");

      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="component-card">
      <h3>➕ Create New Admin</h3>

      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={createAdmin}>
        Create Admin
      </button>
    </div>
  );
};

export default AdminCreateAdmin;
    