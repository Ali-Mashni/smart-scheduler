// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
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


            <Route path="/FAQ" element={<FAQ />} />

            {/* You can add other pages here later */}
            <Route path="/schedule" element={<StudentSchedulePage />} />
            <Route path="/activityManagement" element={<ActivityManagementPage />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/support" element={<StudentSupportPage />} />


            <Route path="/customer-service" element={<CustomerServicePage />} />
            <Route path="/escalated-tickets" element={<EscalatedTicketsPage />} />
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
