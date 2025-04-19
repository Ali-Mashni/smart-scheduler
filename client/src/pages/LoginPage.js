import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ⬅️ import useNavigate
import TextInput from '../components/TextInput.js';
import PrimaryButton from '../components/PrimaryButton.js';
import PasswordInput from '../components/PasswordInput';
import loginImage from '../assets/Log_in_image.png';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';

const users = [
  { username: 'student', password: '123', role: 'student' },
  { username: 'admin', password: 'admin', role: 'admin' },
  { username: 'support', password: 'helpme', role: 'customer-service' },
];

export default function LoginPage({ setUser }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate(); // ⬅️ initialize navigate

  const handleLogin = (e) => {
    e.preventDefault();
    const found = users.find(
      (u) => u.username === form.username && u.password === form.password
    );
    if (found) {
      // setUser(found);

      // ⬇️ Navigate based on role
      if (found.role === 'student') {
        navigate('/student');
      } else if (found.role === 'admin') {
        navigate('/admin');
      } else if (found.role === 'customer-service') {
        navigate('/customer-service');
      }
    } else {
      setError('Invalid username or password');
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
                placeholder="Username"
                name="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
              <PasswordInput
                placeholder="Password"
                name="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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
