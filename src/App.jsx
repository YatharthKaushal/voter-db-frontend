import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { VoterProvider } from './contexts/VoterContext';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import VotersPage from './pages/voters/VotersPage';

function App() {
  return (
    <AuthProvider>
      <VoterProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/dashboard\" replace />} />
            <Route path="/dashboard" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />
            <Route path="/voters" element={
              <Layout>
                <VotersPage />
              </Layout>
            } />
            <Route path="/voters/new" element={
              <Layout>
                <VotersPage />
              </Layout>
            } />
          </Routes>
        </Router>
      </VoterProvider>
    </AuthProvider>
  );
}

export default App;