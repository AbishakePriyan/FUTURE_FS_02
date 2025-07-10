import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/firebaseConfig';
import { collection, getDocs, addDoc, doc, getDoc , deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const Checkout = () => {
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('');
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('upi');

  const user = auth.currentUser;

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const docRef = doc(db, 'Users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setAddress(userData.address || '');
        }
      } catch (err) {
        console.error('Error fetching address:', err);
      }
    };

    const fetchCart = async () => {
      try {
        const cartSnapshot = await getDocs(collection(db, 'Users', user.uid, 'Cart'));
        const cartItems = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCart(cartItems);

        const total = cartItems.reduce(
          (acc, item) => acc + item.price * item.quantity, 0
        );
        setSubtotal(total);
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    };

    if (user) {
      fetchAddress();
      fetchCart();
    }
  }, [user]);

  const handlePlaceOrder = async () => {
    if (!user) {
          toast.success("You must be logged in to place an order.",{
           position: "top-right",
        });
      return;
    }

    if (!address || !payment) {
        toast.success("Please fill all details.!",{
           position: "top-right",
        });
      return;
    }

    const orderData = {
      id: `ORDER-${Date.now()}`,
      items: cart,
      address,
      payment,
      total: subtotal,
      createdAt: new Date(),
    };

    try {
      // Save order in Firestore
      await addDoc(collection(db, 'orders', user.email, 'userOrders'), orderData);

      // ✅ Clear cart from Firestore
      const cartSnapshot = await getDocs(collection(db, 'Users', user.uid, 'Cart'));
      for (const docSnap of cartSnapshot.docs) {
        const docRef = doc(db, 'Users', user.uid, 'Cart', docSnap.id);
        await deleteDoc(docRef);
      }

        toast.success("✅ Order placed successfully!",{
           position: "top-right",
        });
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
        toast.success("Something went wrong. Please try again.",{
           position: "top-right",
        });
    }
  };

return (
  <div className="min-h-screen bg-black text-white p-8">
    <h1 className="text-3xl font-bold mb-8">Checkout</h1>

    <div className="max-w-3xl mx-auto space-y-8">

      {/* 1. Order Summary */}
      <div className="bg-gray-900 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cart.map(item => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4"
          >
            <div className="flex items-center space-x-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded" />
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                <p className="text-sm text-gray-400">Size: {item.selectedSize}</p>
              </div>
            </div>
            <p className="font-semibold text-green-400">
              ₹{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}

        <div className="flex justify-between items-center pt-4">
          <span className="font-semibold">Subtotal</span>
          <span className="text-lg font-bold">₹{subtotal.toFixed(2)}</span>
        </div>
      </div>


      {/* Delivery Address */}
      <div>
        <label className="block mb-2 font-medium">Delivery Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          className="w-full p-3 rounded bg-gray-900 border border-gray-700"
        />
      </div>

{/* 2. Payment Method */}
<div className="bg-gray-900 rounded-lg p-6 space-y-6">
  <h2 className="text-xl font-semibold mb-2">Choose a Payment Method</h2>

  <div className="grid grid-cols-2 gap-4">
    {/* Credit / Debit Card */}
    <button
      onClick={() => setSelectedMethod('card')}
      className={`flex items-center p-4 rounded-lg border ${
        selectedMethod === 'card' ? 'border-green-500' : 'border-gray-700'
      } hover:border-green-500 transition`}
    >
      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Card" className="w-6 h-6 mr-3" />
      Card
    </button>

    {/* UPI / Netbanking */}
    <button
      onClick={() => setSelectedMethod('upi')}
      className={`flex items-center p-4 rounded-lg border ${
        selectedMethod === 'upi' ? 'border-green-500' : 'border-gray-700'
      } hover:border-green-500 transition`}
    >
      <img src="https://w7.pngwing.com/pngs/845/180/png-transparent-unified-payments-interface-bhim-national-payments-corporation-of-india-wallets-text-trademark-logo.png" alt="UPI" className="w-6 h-6 mr-3" />
      UPI / Netbanking
    </button>

    {/* Wallets */}
    <button
      onClick={() => setSelectedMethod('wallet')}
      className={`flex items-center p-4 rounded-lg border ${
        selectedMethod === 'wallet' ? 'border-green-500' : 'border-gray-700'
      } hover:border-green-500 transition`}
    >
      <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="Wallet" className="w-6 h-6 mr-3" />
      Wallets
    </button>

    {/* Cash on Delivery */}
    <button
      onClick={() => setSelectedMethod('cod')}
      className={`flex items-center p-4 rounded-lg border ${
        selectedMethod === 'cod' ? 'border-green-500' : 'border-gray-700'
      } hover:border-green-500 transition`}
    >
      <img src="https://img.icons8.com/ios-filled/50/ffffff/cod.png" alt="COD" className="w-6 h-6 mr-3" />
      Cash on Delivery
    </button>
  </div>

  {/* Detail Entry */}
  <div>
    <label className="block mb-1 font-medium">
      {selectedMethod === 'card' && 'Cardholder Name'}
      {selectedMethod === 'upi' && 'Your UPI ID'}
      {selectedMethod === 'wallet' && 'Wallet Account Email'}
      {selectedMethod === 'cod' && 'Confirm Address for COD'}
    </label>
    <input
      type="text"
      value={payment}
      onChange={e => setPayment(e.target.value)}
      placeholder={
        selectedMethod === 'card'
          ? 'Your card Name'
          : selectedMethod === 'upi'
          ? 'yourupi@bank'
          : selectedMethod === 'wallet'
          ? 'you@example.com'
          : 'Enter Your Address Again'
      }
      className="w-full p-3 rounded bg-gray-800 border border-gray-700"
    />
  </div>
</div>


      {/* Final Total & Place Order */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
        <h2 className="text-xl font-semibold">Total: ₹{subtotal.toFixed(2)}</h2>
        <button
          onClick={handlePlaceOrder}
          className="bg-white text-black font-bold py-2 px-6 rounded-full hover:bg-yellow-400 transition-colors"
        >
          Place Order
        </button>
      </div>
    </div>
  </div>
);

};

export default Checkout;
