import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";

interface AuthContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check local storage for persistence
    const storedAuth = localStorage.getItem("untitled-world-admin");
    if (storedAuth === "true") {
      setIsAdmin(true);
    }
  }, []);

  const login = (password: string) => {
    // Mock password check - simple and client-side only for prototype
    if (password === "admin123") {
      setIsAdmin(true);
      localStorage.setItem("untitled-world-admin", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("untitled-world-admin");
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
