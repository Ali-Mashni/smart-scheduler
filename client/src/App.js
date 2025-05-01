// client/src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import SignupPage from './pages/SignupPage';

import StudentSchedulePage from './pages/schedulePage';
import ActivityManagementPage from './pages/ActivityManagementPage';
import PerformancePage from './pages/Performance';

import CustomerServicePage from './pages/CustomerServicePage';
import StudentSupportPage from './pages/StudentSupportPage';

import FAQPage from './pages/FAQPage';
import FAQManagementPage from './pages/FAQManagementPage';

import ManageRequestsPage from './pages/ManageRequestsPage';
import RequestProgressPage from './pages/RequestProgressPage';
import CommunicationDashboardPage from './pages/CommunicationDashboardPage';

import AdminDashboard from './pages/AdminDashboard';

import { TicketProvider } from './context/TicketContext';
import { FAQProvider } from './context/FAQContext';
import UserContext from './context/UserContext';

function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const { id, role } = payload;
        setUser({ id, role });
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <UserContext.Provider value={user}>
    <TicketProvider>
      <FAQProvider>
        <Router>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/logout" element={<LogoutPage setUser={setUser} />} />
            <Route path="/FAQ" element={<FAQPage />} />

            {/* Student-only Pages */}
            <Route
              path="/schedule"
              element={
                <ProtectedRoute user={user} allowedRoles={['student']}>
                  <StudentSchedulePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/activityManagement"
              element={
                <ProtectedRoute user={user} allowedRoles={['student']}>
                  <ActivityManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/performance"
              element={
                <ProtectedRoute user={user} allowedRoles={['student']}>
                  <PerformancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/support"
              element={
                <ProtectedRoute user={user} allowedRoles={['student', 'support']}>
                  <StudentSupportPage />
                </ProtectedRoute>
              }
            />

            {/* Admin-only Pages */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute user={user} allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Support-only Pages */}
            <Route
              path="/customer-service"
              element={
                <ProtectedRoute user={user} allowedRoles={['student']}>
                  <CustomerServicePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faq-management"
              element={
                <ProtectedRoute user={user} allowedRoles={['support']}>
                  <FAQManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-requests"
              element={
                <ProtectedRoute user={user} allowedRoles={['support']}>
                  <ManageRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/request-progress"
              element={
                <ProtectedRoute user={user} allowedRoles={['support']}>
                  <RequestProgressPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/communication-dashboard"
              element={
                <ProtectedRoute user={user} allowedRoles={['support']}>
                  <CommunicationDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </FAQProvider>
    </TicketProvider>
    </UserContext.Provider>
  );
}
