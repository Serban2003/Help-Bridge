"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Define common user/helper types
type Role = "user" | "helper";

type AuthData = {
  role: Role;
  id: string | number;
};

interface AuthContextType {
  auth: AuthData | null;
  login: (data: AuthData) => void;
  logout: () => void;
  update: (data: AuthData) => void;
  loading: boolean;
  profileImageUrl: string;
  setProfileImageUrl: (url: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileImageUrl, setProfileImageUrl] = useState(
    "/images/default-avatar.jpg"
  );
  useEffect(() => {
    const loadAuth = async () => {
      const start = Date.now();
      const stored = localStorage.getItem("user");

      if (stored) {
        try {
          setAuth(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse auth from localStorage", e);
          localStorage.removeItem("user");
        }
      }

      const elapsed = Date.now() - start;
      const remaining = 1000 - elapsed;

      if (remaining > 0) {
        setTimeout(() => setLoading(false), remaining);
      } else {
        setLoading(false);
      }
    };

    loadAuth();
  }, []);

  const login = (data: AuthData) => {
    localStorage.setItem("user", JSON.stringify(data));
    setAuth(data);
  };

  const logout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    setAuth(null);

    // Reset profile image URL to default
    setProfileImageUrl("/images/default-avatar.jpg");

    // Redirect to home page
    window.location.href = "/";
  };

  const update = (data: AuthData) => {
    // Update user data in localStorage
    login(data);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, update, loading, profileImageUrl, setProfileImageUrl }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
