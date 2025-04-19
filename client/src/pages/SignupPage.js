import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TextInput from '../components/TextInput';
import PrimaryButton from '../components/PrimaryButton';
import PasswordInput from '../components/PasswordInput';
import signupImage from '../assets/SignUp_image.png';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';

export default function SignupPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' | 'error'

  const handleSignup = (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
  
    const { firstName, lastName, username, email, password, confirmPassword } = form;
  
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
      setMessage('All fields are required.');
      setMessageType('error');
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      return;
    }
  
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters.');
      setMessageType('error');
      return;
    }
  
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      return;
    }
  
    // ✅ Passed all validations
    console.log('Registered user:', form);
    setMessage('Account created successfully!');
    setMessageType('success');
  
    // 🔁 Clear form fields
    setForm({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };
  

  return (
    <div className="min-h-screen bg-bgMain text-white">
      <TopBar>
        <TopBarButton to="/">Home</TopBarButton>
        <TopBarButton to="/login">Login</TopBarButton>
        <TopBarButton to="/signup" active>Signup</TopBarButton>
      </TopBar>

      <div className="flex items-center justify-center px-4 py-10">
        <div className="flex w-full max-w-5xl rounded-2xl overflow-hidden shadow-lg bg-bgCard flex-col md:flex-row">
          
          {/* Left image */}
          <div className="w-full md:w-1/2 relative hidden md:block bg-[#181231]">
            <img
              src={signupImage}
              alt="Signup"
              className="w-full h-full object-contain"
            />
            <div className="absolute top-6 left-10 text-white">
              <h3 className="text-xl font-bold">Join Our Learning Community</h3>
              <p className="text-sm text-gray-300 mt-1">
                Manage courses, activities, and more
              </p>
            </div>
          </div>

          {/* Right form */}
          <div className="w-full md:w-1/2 p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-2">Create an account</h2>
            <p className="text-sm text-gray-300 mb-4">
              And Organize Your Academic Journey
            </p>

            {/* Message display */}
            {message && (
              <p
                className={`text-sm mb-4 ${
                  messageType === 'error' ? 'text-red-400' : 'text-green-400'
                }`}
              >
                {message}
              </p>
            )}

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <TextInput
                  placeholder="First name"
                  name="firstName"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />
                <TextInput
                  placeholder="Last name"
                  name="lastName"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />
              </div>

              <TextInput
                placeholder="Username"
                name="username"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
              />
              <TextInput
                placeholder="Email"
                name="email"
                type="text" // changed from 'email' to prevent browser popup
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
              <PasswordInput
                placeholder="Password"
                name="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
              <PasswordInput
                placeholder="Confirm Password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />

              <p className="text-sm text-gray-300 mb-4">
                Already have an account?{' '}
                <Link to="/login" className="text-accent hover:underline">
                  Log in
                </Link>
              </p>

              <PrimaryButton type="submit">Create Account</PrimaryButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
