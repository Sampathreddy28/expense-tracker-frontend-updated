import "./Navbar.css";

const Navbar = ({ isAdmin, onLogout }) => {
  return (
    <nav className="navbar">
      <h2 className="navbar-title">Dashboard</h2>

      <div className="navbar-right">
        {isAdmin && <span className="navbar-role">Admin</span>}

        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
