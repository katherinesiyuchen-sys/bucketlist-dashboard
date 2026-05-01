import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const active = (path) =>
    pathname === path || pathname.startsWith(path + "/") ? "active" : "";

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand" style={{ textDecoration: "none" }}>
        <div>Bucketlist</div>
        <div>Dashboard</div>
      </Link>
      <div className="navbar-links">
        <Link to="/dashboard" className={active("/dashboard")}>My Dashboard</Link>
        <Link to="/goals/new" className={active("/goals/new")}>Add Goals</Link>
        <Link to="/achievements" className={active("/achievements")}>Achievements</Link>
        <button className="btn-logout" onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  );
}
