// src/pages/Cart.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { db, auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user's cart from Firestore
  const fetchUserCart = async (uid) => {
    try {
      const cartRef = collection(db, 'Users', uid, 'Cart');
      const snapshot = await getDocs(cartRef);
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setCart(items);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auth check on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserCart(user.uid);
      } else {
        setUserId(null);
        setCart([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 🧹 Remove item from cart
  const handleRemoveItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, 'Users', userId, 'Cart', itemId));
      setCart((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  // 🧼 Clear all cart items
  const handleClearCart = async () => {
    try {
      const cartRef = collection(db, 'Users', userId, 'Cart');
      const snapshot = await getDocs(cartRef);
      const deletions = snapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, 'Users', userId, 'Cart', docSnap.id))
      );
      await Promise.all(deletions);
      setCart([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <p className="text-gray-400">Loading cart...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center text-center px-4">
        <p className="text-xl font-semibold mb-4">Please log in to view your cart</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-300"
        >
          Go to Login
        </button>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-gray-400">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b border-gray-800 pb-4"
                >
                  <div className="flex items-center gap-6">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div>
                      <h2 className="font-semibold">{item.title}</h2>
                      <p>Quantity: {item.quantity}</p>
                      <p>Size: {item.selectedSize}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-lg font-medium">₹{item.price.toFixed(2)}</p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="bg-white text-black font-bold py-2 px-6 rounded-full hover:bg-gray-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-8">
              <div>
                <h2 className="text-xl font-semibold">Subtotal</h2>
                <p className="text-gray-400 text-sm">
                  Shipping & taxes calculated at checkout.
                </p>
              </div>
              <h2 className="text-xl font-bold">₹{subtotal.toFixed(2)}</h2>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleClearCart}
                className="bg-white text-black font-bold py-2 px-6 rounded-full hover:bg-gray-300"
              >
                Clear All
              </button>

              <button
                onClick={() => navigate('/checkout')}
                className="bg-white text-black font-bold py-2 px-6 rounded-full hover:bg-gray-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
