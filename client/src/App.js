import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import StudentSchedulePage from './pages/schedulePage';
import PerformancePage from './pages/Performance';
import ActivityManagementPage from './pages/ActivityManagementPage';
import CustomerServicePage from './pages/CustomerServicePage';
import StudentSupportPage from './pages/StudentSupportPage';

import ManageRequestsPage from './pages/ManageRequestsPage';
import FAQManagementPage from './pages/FAQManagementPage';
import RequestProgressPage from './pages/RequestProgressPage';
import CommunicationDashboardPage from './pages/CommunicationDashboardPage';

import FAQ from './pages/FAQPage';
import AdminDashboard from './pages/AdminDashboard';

import { TicketProvider } from './context/TicketContext';
import { FAQProvider } from './context/FAQContext';

function App() {
  return (
    <TicketProvider>
      <FAQProvider>
        <Router>
          <Routes>
            {/* Default redirect to login */}
            <Route path="/" element={<HomePage />} />
            
            {/* Auth pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Admin Dashboard */}
            <Route path="/admin" element={<AdminDashboard />} />
            

            {/* Other pages */}
            <Route path="/schedule" element={<StudentSchedulePage />} />
            <Route path="/FAQ" element={<FAQ />} />
            <Route path="/activityManagement" element={<ActivityManagementPage />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/support" element={<StudentSupportPage />} />
            <Route path="/customer-service" element={<CustomerServicePage />} />
            {/* <Route path="/escalated-tickets" element={<EscalatedTicketsPage />} /> */}
            <Route path="/manage-requests" element={<ManageRequestsPage />} />
            <Route path="/faq-management" element={<FAQManagementPage />} />
            <Route path="/request-progress" element={<RequestProgressPage />} />
            <Route path="/communication-dashboard" element={<CommunicationDashboardPage />} />
          </Routes>
        </Router>
      </FAQProvider>
    </TicketProvider>
  );
}

export default App;
