// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import { auth, db } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';

const Profile = () => {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  // 1️⃣ Load current user’s profile once on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const ref     = doc(db, 'Users', user.uid);
        const snap    = await getDoc(ref);
        const data    = snap.exists() ? snap.data() : {};
        setName(data.name    || user.displayName || '');
        setEmail(data.email  || user.email         || '');
        setAddress(data.address || '');
      } catch (err) {
        console.error('Error fetching profile:', err);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // 2️⃣ Prevent full‑page reload & merge in only changed fields
  const handleSave = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      toast.error('You must be logged in.');
      return;
    }

    try {
      const userRef = doc(db, 'Users', user.uid);
      await setDoc(
        userRef,
        {
          name,
          // email is immutable once set; you can omit it but merging is harmless
          email,
          address,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      toast.success('✅ Profile saved!', { position: 'top-right' });
    } catch (err) {
      console.error('Error saving profile:', err);
      toast.error('Could not save profile. Try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <p className="text-gray-400 text-xl animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="max-w-xl mx-auto mt-10 bg-gray-900 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>
        <form onSubmit={handleSave}>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 mb-4 bg-gray-800 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 bg-gray-800 rounded"
            value={email}
            disabled
          />
          <textarea
            placeholder="Delivery Address"
            className="w-full p-2 mb-4 bg-gray-800 rounded"
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-600 w-full p-2 rounded hover:bg-green-700"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
