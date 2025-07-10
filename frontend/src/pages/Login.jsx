// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { toast } from 'react-toastify';
import logo from '../assets/Logo.jpg'

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!', { position: 'top-right' });
      navigate('/profile');
    } catch (err) {
      console.error(err);
      setError('Invalid email or password.');
      toast.error(err.message, { position: 'top-right' });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        {/* Left side: Logo & marketing */}
        <div className="hidden md:flex flex-col bg-gray-800 p-8 justify-center items-center">
          <img
            src={logo}
            alt="Jersey Hub Logo"
            className="w-32 mb-6"
          />
          <h2 className="text-3xl font-bold text-white mb-4">Welcome Back!</h2>
          <p className="text-gray-400 text-center">
            Sign in to access your account, view orders, and continue exploring
            the best football jerseys at Jersey Hub.
          </p>
        </div>

        {/* Right side: Form */}
        <div className="p-8">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h1>

          {error && (
            <div className="bg-red-800 text-red-300 p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-1">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-black font-semibold w-full py-3 rounded transition"
              >
                Sign In
              </button>
            </div>

            <div className="text-center text-gray-400">
              New to Jersey Hub?{' '}
              <Link to="/register" className="text-green-400 font-semibold hover:underline">
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
