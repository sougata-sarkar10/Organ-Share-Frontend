"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  getUserType,
  setCurrentUser,
  logout as logoutUser,
  authenticateUser,
} from "@/lib/storage";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserTypeState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = getCurrentUser();
    const savedUserType = getUserType();

    if (savedUser && savedUserType) {
      setUser(savedUser);
      setUserTypeState(savedUserType);
    }

    setLoading(false);
  }, []);

  const login = async (email, password, type) => {
    try {
      const authenticatedUser = authenticateUser(email, password, type);

      if (authenticatedUser) {
        setUser(authenticatedUser);
        setUserTypeState(type);
        setCurrentUser(authenticatedUser, type);
        return { success: true, user: authenticatedUser };
      } else {
        return { success: false, error: "Invalid credentials" };
      }
    } catch (error) {
      return { success: false, error: "Login failed" };
    }
  };

  const logout = () => {
    setUser(null);
    setUserTypeState(null);
    logoutUser();
  };

  const value = {
    user,
    userType,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
