import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  username: string;
  role: "admin" | "counselor" | "viewer";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  const login = async (username: string, _password: string) => {
    // Try real API first, fallback to dummy auth
    try {
      const { login: apiLogin } = await import("@/lib/api");
      const res = await apiLogin({ username, password: _password });
      const { token: jwt, user: userData } = res.data;
      localStorage.setItem("token", jwt);
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(jwt);
      setUser(userData);
    } catch {
      // Dummy fallback: accept any credentials
      const dummyUser: User = {
        username,
        role: username.toLowerCase() === "admin" ? "admin" : "counselor",
      };
      const dummyToken = "dummy-jwt-token-" + Date.now();
      localStorage.setItem("token", dummyToken);
      localStorage.setItem("user", JSON.stringify(dummyUser));
      setToken(dummyToken);
      setUser(dummyUser);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
