"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id?: string;
  username: string;
  email?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User, remember?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken =
      typeof window !== "undefined"
        ? localStorage.getItem("token") || sessionStorage.getItem("token")
        : null;

    if (!savedToken) {
      setLoading(false);
      return;
    }

    setToken(savedToken);

    // Verify token with backend
    fetch("http://localhost:5000/profile", {
      headers: {
        Authorization: `Bearer ${savedToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid session");
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          setUser({ username: "Trader" });
        }
      })
      .catch((err) => {
        console.warn("Auth check failed or backend unreachable:", err);
        // Fallback dummy user if backend is offline so user can demo app
        setUser({ username: "Demo User", email: "demo@stockguru.com" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (jwt: string, userData: User, remember = true) => {
    setToken(jwt);
    setUser(userData);
    if (remember) {
      localStorage.setItem("token", jwt);
    } else {
      sessionStorage.setItem("token", jwt);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
