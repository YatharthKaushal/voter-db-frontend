import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { VoterProvider } from "./contexts/VoterContext";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import VotersPage from "./pages/voters/VotersPage";
import VotersPageOffline from "./pages/voters/VotersPageOffline";
import { VoterProviderOffline } from "./contexts/VoterContextOffline";
import { Toaster } from "react-hot-toast";
import Test from "./pages/Test";

function App() {
  return (
    <AuthProvider>
      <VoterProvider>
        <div>
          <Toaster />
        </div>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/dashboard\" replace />} />
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/voters"
              element={
                <Layout>
                  <VotersPage />
                </Layout>
              }
            />
            <Route
              path="/voters/new"
              element={
                <Layout>
                  <VotersPage />
                </Layout>
              }
            />
            <Route
              path="/voters/offline"
              element={
                // <VoterProviderOffline>
                // <Layout>
                <VotersPageOffline />
                // </Layout>
                // </VoterProviderOffline>
              }
            />
            <Route path="/test" element={<Test />} />
          </Routes>
        </Router>
      </VoterProvider>
    </AuthProvider>
  );
}

export default App;
