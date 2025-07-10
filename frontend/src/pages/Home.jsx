// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import stadiumImg from '../assets/stadium.jpeg';
import Navbar from '../components/Navbar';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { FiShoppingCart } from 'react-icons/fi';

const Home = () => {
  const [topPicks, setTopPicks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopPicks = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const picks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTopPicks(picks);
      } catch (err) {
        console.error('Error fetching top picks:', err);
      }
    };

    fetchTopPicks();
  }, []);


  return (
    <div className="bg-black text-white min-h-screen font-sans">
    <Navbar />
      {/* Hero Section */}
      <section className="px-8 mt-6">
        <div className="relative rounded-xl overflow-hidden group">
          {/* Background Image: zoom & blur on hover */}
          <img
            src={stadiumImg}
            alt="Stadium"
            className="
              w-full h-[400px] object-cover
              transform transition-transform duration-500 ease-in-out
              group-hover:scale-110
              filter transition-filter duration-500 ease-in-out
              group-hover:blur-sm
            "
          />

          {/* Overlay Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-4xl font-extrabold text-white drop-shadow-lg">
              Gear Up for Glory
            </h2>
            <p className="mt-2 text-sm text-white drop-shadow">
              Unleash your passion with our exclusive collection of football jerseys.  
              <br className="hidden sm:block"/>
              Represent your team in style and comfort.
            </p>
            <Link to="/shop">
              <button className="
                mt-4 px-6 py-2 bg-white text-black hover:bg-green-300 font-semibold rounded-full
                shadow hover:shadow-lg transition-shadow duration-300
              ">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </section>


      {/* Top Picks Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          {/* Header & CTA */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">🔥 Top Picks</h2>
              <p className="text-gray-400 font-bold">
                Curated selections just for you – limited drops and fan favorites.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => navigate('/shop')}
                className="px-6 py-2 bg-white hover:bg-green-300 text-black font-semibold rounded-full shadow-md transition-colors"
              >
                Shop Now
              </button>
            </div>
          </div>

          {/* Item Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topPicks.length > 0 ? (
              topPicks.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-900 rounded-lg overflow-hidden group relative"
                >
                  {/* Badge */}
                  {item.tag && (
                    <span className={`absolute top-3 left-3 z-10 text-xs px-2 py-1 rounded-full font-bold
                      ${item.tag === 'HOT' ? 'bg-red-500 text-yellow'
                        : item.tag === 'NEW' ? 'bg-green-500 text-black'
                        : item.tag === 'PREMIUM' ? 'bg-yellow-600 text-black'
                        : 'bg-gray-700 text-white'}`}>
                      {item.tag}
                    </span>
                  )}

                  {/* Image + Hover */}
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={() => navigate(`/product/${item.id}`)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-2">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-green-400 font-bold text-lg">
                        ₹{item.price}
                      </span>
                      <button
                        onClick={() => navigate(`/product/${item.id}`)}
                        className="w-10 h-10 rounded-full bg-gray-800 hover:bg-green-500 hover:text-black flex items-center justify-center transition-colors"
                      >
                        <FiShoppingCart className="text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">Loading top picks...</p>
            )}
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="mt-16 text-sm text-gray-500 text-center border-t border-gray-800 py-6">
        <div className="flex justify-center space-x-6 mb-2">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
        <p>@2024 Jersey Hub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
