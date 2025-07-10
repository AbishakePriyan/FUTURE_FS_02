// src/pages/Shop.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const Shop = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(items);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Football Jerseys</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900 p-4 rounded-lg shadow hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <Link to={`/product/${item.id}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded mb-3"
                />
                <p className="text-xs text-green-400 font-semibold">{item.tag}</p>
                <h2 className="text-lg font-semibold mt-1">{item.name}</h2>
                <p className="text-yellow-400 text-sm">★ {item.rating}</p>
              </Link>

              <div className="flex items-center justify-between mt-2">
                <p className="text-lg font-bold text-green-400">₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
