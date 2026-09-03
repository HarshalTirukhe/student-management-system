import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { api } from "../services/api";

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

function getStoredUser(): User | null {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    const user = JSON.parse(storedUser);

    if (
      typeof user !== "object" ||
      user === null ||
      typeof user.id !== "number" ||
      typeof user.email !== "string" ||
      typeof user.role !== "string"
    ) {
      localStorage.removeItem("user");
      return null;
    }

    return user as User;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

function getStoredToken(): string | null {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(
    getStoredUser,
  );

  const [token, setToken] = useState<string | null>(
    getStoredToken,
  );

  const login = async (
    email: string,
    password: string,
  ) => {
    const data = await api.login(email, password);

    setUser(data.user);
    setToken(data.token);

    localStorage.setItem(
      "user",
      JSON.stringify(data.user),
    );

    localStorage.setItem("token", data.token);
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}