// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import StudentSchedulePage from './pages/schedulePage';
import PerformancePage from './pages/Performance';
import ActivityManagementPage from './pages/ActivityManagementPage';
function App() {
  

  return (
    <Router>
      <Routes>
        {/* Default redirect to login */}
        <Route path="/" element={<HomePage />} />        
        {/* Auth pages */}
        {/* the change*/}
        <Route path="/login" element={<LoginPage  />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* You can add other pages here later */}
        <Route path="/schedule" element={<StudentSchedulePage />} />
        <Route path="/activityManagement" element={<ActivityManagementPage />} />
        <Route path="/performance" element={<PerformancePage />} />
      </Routes>
    </Router>
  );
}

export default App;
