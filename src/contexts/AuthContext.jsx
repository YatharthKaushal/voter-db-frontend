import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Custom debounce function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Use null for unknown auth state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL =
    import.meta.env.VITE_BACKEND_URL ||
    "https://voter-backend-y6hw.onrender.com/api";

  // Debounced fetchUserData
  const fetchUserData = debounce(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/auth/admin`);
      setUser(response.data);
      setIsLoggedIn(true);
    } catch (error) {
      toast.error("Authentication failed. Please login again.");
      logout();
    } finally {
      setLoading(false);
    }
  }, 300); // Debounce for 300ms

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUserData();
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        credentials,
        { withCredentials: true }
      );

      const token = response.data.token;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await fetchUserData();
    } catch (error) {
      toast.error("Login failed. Check credentials.");
      console.error("Login failed:", error);
      setLoading(false);
    }
  };

  const register = async (formData) => {
    try {
      setLoading(true);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (formData.email && formData.password) {
            const userData = {
              id: Date.now(),
              name: formData.fullName,
              email: formData.email,
              role: "user",
            };
            setUser(userData);
            setIsLoggedIn(true);
            resolve(userData);
          } else {
            reject(new Error("Registration failed"));
          }
          setLoading(false);
        }, 1000);
      });
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setIsLoggedIn(false);
    setLoading(false);
  };

  const value = {
    isLoggedIn,
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
