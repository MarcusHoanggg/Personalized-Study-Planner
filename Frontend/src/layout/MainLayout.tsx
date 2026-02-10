
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../services/auth";

export default function MainLayout() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-slate-50">
      <header className="bg-white dark:bg-slate-800 border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Study Planner</h1>

        <nav className="flex gap-6 text-sm font-medium">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "text-blue-600" : "")}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/calendar"
            className={({ isActive }) => (isActive ? "text-blue-600" : "")}
          >
            Calendar
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "text-blue-600" : "")}
          >
            Profile
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 border rounded"
          >
            Logout
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
            {user?.username?.[0]?.toUpperCase()}
          </div>
        </div>
      </header>

      {/* <main className="max-w-4xl mx-auto px-6 py-8"> */}
      <main className="w-full max-w-7xl mx-auto px-8 py-10">

        <Outlet />
      </main>
    </div>
  );
}
