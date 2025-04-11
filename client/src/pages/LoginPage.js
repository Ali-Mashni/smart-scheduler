import React, { useState } from 'react';
import AuthLayout from '../components/AuthLayout .js';
import TextInput from '../components/TextInput.js';
import PrimaryButton from '../components/PrimaryButton.js';
import PasswordInput from '../components/PasswordInput';


const users = [
  { username: 'student', password: '123', role: 'student' },
  { username: 'admin', password: 'admin', role: 'admin' },
  { username: 'support', password: 'helpme', role: 'customer-service' },
];

export default function LoginPage({ setUser }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const found = users.find(
      (u) => u.username === form.username && u.password === form.password
    );
    if (found) {
      setUser(found);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <AuthLayout>
      {/* Left side image */}
      <div
        className="w-1/2 bg-cover bg-center hidden md:block"
        style={{
          backgroundImage:
            "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0ZmZzrDHegEhRmWCYE5aOKxYanYKgX5ehGw&s')",
        }}
      >
        <div className="h-full w-full bg-black bg-opacity-50 flex items-end p-8">
          <h2 className="text-lg font-semibold text-white">
            Organize Your Journey
          </h2>
        </div>
      </div>

      {/* Right side login form */}
      <div className="w-full md:w-1/2 bg-bgCard p-10">
        <h2 className="text-2xl font-bold mb-2">Log in</h2>
        <p className="text-sm text-gray-300 mb-6">Login to your account</p>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
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
        <div className="mt-4 text-sm text-gray-300">
          Don't have an account?{' '}
          <span className="text-accent hover:underline cursor-pointer">
            Create an account
          </span>
        </div>
      </div>
    </AuthLayout>
  );
}
