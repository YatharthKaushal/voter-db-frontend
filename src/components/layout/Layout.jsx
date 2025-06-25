import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../contexts/AuthContext";

const Layout = ({ children }) => {
  const location = useLocation();
  const { isLoggedIn, loading } = useAuth();

  // Enhanced loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="p-8 text-center text-gray-500">
          <div
            className="animate-spin rounded-full h-12 w-12 border-4 border-y-emerald-700 border-x-emerald-300 mx-auto"
            key={0}
          ></div>
          <p className="mt-4 text-emerald-700 font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    console.log(location.pathname);
  }, []);
  // Redirect to login if not authenticated
  if (isLoggedIn === false) {
    if (location.pathname !== "/voters/offline")
      return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-16">
        <main className="px-4 py-8 sm:px-6 lg:px-8 mt-12 lg:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
