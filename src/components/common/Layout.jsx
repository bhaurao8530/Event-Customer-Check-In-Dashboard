import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";

function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <h2>Event Check-In</h2>
          <p>Customer management hub</p>
        </div>

        <nav className="nav-links">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/customers"
            end
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Customers
          </NavLink>
          <NavLink
            to="/qr-scanner"
            end
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            QR Scan
          </NavLink>
          <NavLink
            to="/booth-assignments"
            end
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Booth Assignments
          </NavLink>
          <NavLink
            to="/status-updates"
            end
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Status Updates
          </NavLink>
        </nav>

        <button className="secondary-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
