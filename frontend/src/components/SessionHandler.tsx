import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export default function SessionHandler() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionExpired = () => {
      logout();

      toast.error("Session expired", {
        description: "Please login again to continue.",
      });

      navigate("/login", { replace: true });
    };

    window.addEventListener(
      "session-expired",
      handleSessionExpired,
    );

    return () => {
      window.removeEventListener(
        "session-expired",
        handleSessionExpired,
      );
    };
  }, [logout, navigate]);

  return null;
}