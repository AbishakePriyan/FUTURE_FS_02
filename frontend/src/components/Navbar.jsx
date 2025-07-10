// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiSearch, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { auth, db } from '../firebase/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';


const Navbar = () => {
  const [search, setSearch] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        try {
          const userRef = doc(db, 'Users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserName(userSnap.data().name || '');
          }
        } catch (err) {
          console.error("Error fetching user name:", err);
        }
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setShowDropdown(false);
      setUserName('');
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const goTo = (path) => {
    setShowDropdown(false);
    setMobileMenuOpen(false);
    navigate(path);
  };

const handleSearch = async () => {
  const term = search.trim();
  if (!term) return;

  try {
    // 1️⃣ Fetch all products
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);

    // 2️⃣ Filter client‑side for name or description containing the term
    const matched = snapshot.docs.filter((doc) => {
      const data = doc.data();
      return (
        data.name?.toLowerCase().includes(term.toLowerCase()) ||
        data.description?.toLowerCase().includes(term.toLowerCase())
      );
    });

    if (matched.length > 0) {
      // 3️⃣ Only navigate if there are matches
      navigate(`/shop?query=${encodeURIComponent(term)}`);
      setSearch('');
      setMobileMenuOpen(false);
    } else {
      // 4️⃣ Otherwise show a toast
      toast.info(`No products found for "${term}"`, {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  } catch (err) {
    console.error('Search error:', err);
    toast.error('Failed to search products. Try again.');
  }
};


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <header className="bg-black text-white py-4 shadow relative z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">● Jersey Hub</Link>

        {/* Hamburger (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white text-2xl"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-md font-bold">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4 relative">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search"
              className="bg-gray-800 text-sm px-3 py-1 rounded-full pl-8"
            />
            <FiSearch className="absolute left-2 top-2 text-gray-400" />
          </div>

          {/* Cart */}
          <FiShoppingCart onClick={() => goTo('/cart')} className="text-xl cursor-pointer" />

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="rounded-full bg-gray-800 w-9 h-9 flex items-center justify-center hover:bg-gray-700"
            >
              {isLoggedIn && userName ? (
                <span className="text-white font-bold uppercase">{userName[0]}</span>
              ) : (
                <FiUser className="text-white text-xl" />
              )}
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-gray-900 text-white rounded-xl shadow-xl z-20 animate-fade-in">
                {isLoggedIn ? (
                  <div className="py-2">
                    <p className="px-4 py-2 text-sm text-gray-400">Hi, {userName || 'User'}</p>
                    <hr className="border-gray-700 my-1" />
                    <button
                      onClick={() => goTo('/profile')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition-all"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => goTo('/orders')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition-all"
                    >
                      My Orders
                    </button>
                    <hr className="border-gray-700 my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="py-2">
                    <button
                      onClick={() => goTo('/login')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition-all"
                    >
                      Login
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 px-6 py-4 space-y-4">
          {/* Mobile Search */}
          <div className="relative w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="w-full bg-gray-800 text-sm px-4 py-2 rounded-full pl-10"
            />
            <FiSearch
              className="absolute left-3 top-3 text-gray-400 cursor-pointer"
              onClick={handleSearch}
            />
          </div>

          {/* Links */}
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:text-yellow-400">Home</Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:text-yellow-400">Shop</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:text-yellow-400">About</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:text-yellow-400">Contact</Link>

          {/* Cart */}
          <div onClick={() => goTo('/cart')} className="text-white cursor-pointer">Go to Cart</div>

          {/* Profile */}
          {isLoggedIn ? (
            <div className="space-y-2">
              <button onClick={() => goTo('/profile')} className="block text-white w-full text-left">My Profile</button>
              <button onClick={() => goTo('/orders')} className="block text-white w-full text-left">My Orders</button>
              <button onClick={handleLogout} className="block text-red-500 w-full text-left">Logout</button>
            </div>
          ) : (
            <button onClick={() => goTo('/login')} className="block text-white w-full text-left">Login</button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
