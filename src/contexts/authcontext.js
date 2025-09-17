"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated first
    setIsHydrated(true);

    const initializeAuth = async () => {
      const savedToken = sessionStorage.getItem("authToken");
      console.log("InitializeAuth - savedToken:", !!savedToken);

      if (savedToken) {
        console.log("Using saved token");
        setToken(savedToken);
        setIsAuthenticated(true);
        axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
        setLoading(false);
      } else {
        // Auto-login if no saved token
        console.log("No saved token, attempting auto-login");
        try {
          setLoading(true);
          const response = await axios.post("/api/auth-token");
          console.log("Auto-login successful");
          const { access_token: newToken } = response.data;
          setToken(newToken);
          setIsAuthenticated(true);
          sessionStorage.setItem("authToken", newToken);
          axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          setLoading(false);
        } catch (error) {
          console.error("Auto-login failed:", error);
          setLoading(false);
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/auth-token");
      const { access_token: newToken } = response.data;
      setToken(newToken);
      setIsAuthenticated(true);
      sessionStorage.setItem("authToken", newToken);

      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      throw "Login failed: " + (error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem("authToken");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        accessToken: token,
        isHydrated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
