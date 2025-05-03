import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextInput from '../components/TextInput.js';
import PrimaryButton from '../components/PrimaryButton.js';
import PasswordInput from '../components/PasswordInput.js';
import loginImage from '../assets/Log_in_image.png';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import api from '../api';

export default function LoginPage({ setUser }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const { id, role } = JSON.parse(atob(token.split('.')[1]));
      setUser({ id, role });
      if (role === 'student') return navigate('/schedule');
      if (role === 'admin') return navigate('/admin');
      if (role === 'support') return navigate('/faq-management');
    } catch {
      localStorage.removeItem('token'); // Clean up if token is corrupted
    }
  }
}, [navigate, setUser]);


  const handleLogin = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/api/auth/login', {
        email: form.email,
        password: form.password
      });

      const { token } = res.data;
      localStorage.setItem('token', token);

      const payload = JSON.parse(atob(token.split('.')[1]));
      const { id, role } = payload;
      setUser({ id, role });


      if (role === 'student') navigate('/schedule');
      else if (role === 'admin') navigate('/admin');
      else if (role === 'support') navigate('/faq-management');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed. Please check your credentials.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-bgMain text-white">
      <TopBar>
        <TopBarButton to="/">Home</TopBarButton>
        <TopBarButton to="/login" active>Login</TopBarButton>
        <TopBarButton to="/signup">Signup</TopBarButton>
      </TopBar>

      <div className="flex items-center justify-center px-4 min-h-[calc(100vh-64px)]">
        <div className="flex w-full max-w-5xl rounded-2xl overflow-hidden shadow-lg bg-bgCard flex-col md:flex-row">
          <div className="w-full md:w-1/2 relative hidden md:block bg-[#181231]">
            <img
              src={loginImage}
              alt="Login"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-10 text-white">
              <h2 className="text-2xl font-semibold">Organize Your Journey</h2>
            </div>
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-2">Log in</h2>
            <p className="text-sm text-gray-300 mb-10">Login to your account</p>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <form onSubmit={handleLogin} className="space-y-6">
              <TextInput
                placeholder="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <PasswordInput
                placeholder="Password"
                name="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <PrimaryButton type="submit">Log In</PrimaryButton>
            </form>

            <div className="mt-6 text-sm text-gray-300">
              Don't have an account?{' '}
              <Link to="/signup" className="text-accent hover:underline">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
