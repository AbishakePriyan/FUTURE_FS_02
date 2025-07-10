import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { db, auth } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { format } from 'date-fns';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderIds, setExpandedOrderIds] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

  // Get current user email
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUserEmail(user.email);
    });
    return () => unsub();
  }, []);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!userEmail) return;
      try {
        const snapshot = await getDocs(
          collection(db, 'orders', userEmail, 'userOrders')
        );
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })).sort((a, b) => b.createdAt - a.createdAt);
        setOrders(fetched);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };
    fetchOrders();
  }, [userEmail]);

  const toggleExpand = (orderId) => {
    setExpandedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 px-4 space-y-6 pb-16">
        <h1 className="text-3xl font-bold">My Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">You have no orders yet.</p>
        ) : (
          orders.map((order) => {
            const isExpanded = expandedOrderIds.includes(order.id);
            return (
              <div
                key={order.id}
                className="bg-gray-900 rounded-lg overflow-hidden shadow-lg"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center p-4 bg-gray-800">
                  <div>
                    <p className="font-semibold">Order #{order.id}</p>
                    <p className="text-sm text-gray-400">
                      {format(order.createdAt.toDate(), 'PPP p')}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      order.status === 'Delivered'
                        ? 'bg-green-500 text-black'
                        : order.status === 'Shipped'
                        ? 'bg-blue-500 text-black'
                        : 'bg-yellow-500 text-black'
                    }`}
                  >
                    {order.status || 'Processing'}
                  </span>
                </div>

                {/* Summary */}
                <div className="p-4">
                  <p className="text-gray-300 mb-2">
                    Total: <span className="text-green-400 font-semibold">₹{order.total.toFixed(2)}</span>
                  </p>
                  <p className="text-gray-300 mb-4">Address: {order.address}</p>

                  {/* Toggle Items */}
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="flex items-center text-sm text-yellow-400 hover:underline focus:outline-none"
                  >
                    {isExpanded ? 'Hide details' : 'View details'}
                    {isExpanded ? (
                      <FiChevronUp className="ml-1" />
                    ) : (
                      <FiChevronDown className="ml-1" />
                    )}
                  </button>

                  {/* Item List */}
                  {isExpanded && (
                    <ul className="mt-4 space-y-3">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}, Size: {item.selectedSize}
                            </p>
                          </div>
                          <p className="text-gray-300">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
