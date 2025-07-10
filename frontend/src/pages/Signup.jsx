// src/pages/Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import logo from '../assets/Logo.jpg'

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      await updateProfile(user, { displayName: name });
      await setDoc(doc(db, 'Users', user.uid), {
        name,
        email: user.email,
        createdAt: new Date()
      });
      toast.success('Registered successfully!', { position: 'top-right' });
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error(err.message, { position: 'top-right' });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        {/* Left marketing panel */}
        <div className="hidden md:flex flex-col bg-gray-800 p-8 justify-center items-center">
          <img
            src={logo}
            alt="Jersey Hub Logo"
            className="w-32 mb-6"
          />
          <h2 className="text-3xl font-bold text-white mb-4">Join Jersey Hub</h2>
          <p className="text-gray-400 text-center">
            Create your account to track orders, save favorites, and get exclusive deals
            on all your favorite football jerseys.
          </p>
        </div>

        {/* Right signup form */}
        <div className="p-8">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h1>

          {error && (
            <div className="bg-red-800 text-red-300 p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

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

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded transition"
            >
              Sign Up
            </button>

            <p className="text-center text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-green-400 font-semibold hover:underline">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
