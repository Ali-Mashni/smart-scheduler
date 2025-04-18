// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';

function App() {


  return (
    <Router>
      <Routes>
        {/* Default redirect to login */}
        <Route path="/" element={<HomePage />} />
        {/* Auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* You can add other pages here later */}
      </Routes>
    </Router>
  );
}

export default App;
