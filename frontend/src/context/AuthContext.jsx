import React, { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await authApi.getCurrentUser();
      setUser(res.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    setUser(res.data.data);
    return res.data.data;
  };

  const register = async (payload) => {
    const res = await authApi.register(payload);
    setUser(res.data.data);
    return res.data.data;
  };

  const setupAdmin = async (payload) => {
    const res = await authApi.setupAdmin(payload);
    setUser(res.data.data);
    return res.data.data;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAdmin: user?.role === "admin",
    login,
    register,
    setupAdmin,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
