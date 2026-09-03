import { Link, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { Button } from "#components/ui/button";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isStudentsPage = location.pathname.startsWith("/students");

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        {/* Logo */}
        <div className="flex flex-col gap-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
          <Link
            to="/dashboard"
            className="text-center text-lg font-semibold tracking-tight sm:text-left"
          >
            Student Management
          </Link>



          {/* Right side */}
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {/* Students */}
            <Link
              to="/students"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isStudentsPage
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              Students
            </Link>

            {/* User information */}
            <div className="hidden items-center gap-2 lg:flex">
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>

              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                {user?.role}
              </span>
            </div>

            <ThemeToggle />

            {/* Logout */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;