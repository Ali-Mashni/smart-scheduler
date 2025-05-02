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

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { role } = JSON.parse(atob(token.split('.')[1]));
        setUser({ role });
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <TicketProvider>
      <FAQProvider>
        <Router>
          <Routes>
            {/* Home & Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/logout" element={<LogoutPage setUser={setUser} />} />

            {/* Student Area */}
            <Route
              path="/schedule"
              element={
                user?.role === 'student'
                  ? <StudentSchedulePage />
                  : <Navigate to="/login" replace />
              }
            />
            <Route path="/activityManagement" element={<ActivityManagementPage />} />
            <Route path="/performance" element={<PerformancePage />} />

            {/* Admin Area */}
            <Route
              path="/admin"
              element={
                user?.role === 'admin'
                  ? <AdminDashboard />
                  : <Navigate to="/login" replace />
              }
            />

            {/* Support-Agent Area */}
            <Route
              path="/customer-service"
              element={<CustomerServicePage />}
            />
            <Route
              path="/support"
              element={
                (user?.role === 'student' || user?.role === 'support')
                  ? <StudentSupportPage />
                  : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/faq-management"
              element={
                user?.role === 'support'
                  ? <FAQManagementPage />
                  : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/manage-requests"
              element={
                user?.role === 'support'
                  ? <ManageRequestsPage />
                  : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/request-progress"
              element={
                user?.role === 'support'
                  ? <RequestProgressPage />
                  : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/communication-dashboard"
              element={
                user?.role === 'support'
                  ? <CommunicationDashboardPage />
                  : <Navigate to="/login" replace />
              }
            />

            {/* Public FAQ */}
            <Route path="/FAQ" element={<FAQPage />} />

            {/* Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </FAQProvider>
    </TicketProvider>
  );
}
