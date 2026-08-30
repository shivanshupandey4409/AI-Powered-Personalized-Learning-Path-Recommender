import { NavLink, Outlet } from "react-router-dom";
import { BookOpen, LayoutDashboard, MessageCircle, Target, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/goal", "Create Goal", Target],
  ["/roadmaps", "My Paths", BookOpen],
  ["/assistant", "AI Assistant", MessageCircle],
  ["/profile", "Profile", User]
];

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">L</span> LearnPath AI</div>
        <nav>{links.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Icon size={18}/>{label}
          </NavLink>
        ))}</nav>
        <button className="logout" onClick={logout}><LogOut size={17}/> Logout</button>
      </aside>
      <main className="main">
        <header className="topbar">
          <div><span className="muted">Welcome back,</span> <strong>{user?.name}</strong></div>
          <div className="avatar">{user?.name?.[0]?.toUpperCase()}</div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
