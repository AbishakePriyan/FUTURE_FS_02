// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams , useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { db, auth } from '../firebase/firebaseConfig';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, updateDoc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams(); // Firestore document ID from the URL
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const goTo = useNavigate();

  const fetchProduct = async () => {
    try {
      const docRef = doc(db, 'products', id); // Use doc ID from URL
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() }); // Set product with Firestore doc ID
      } else {
        console.error('❌ Product not found in Firestore');
      }
    } catch (err) {
      console.error('🔥 Error fetching product:', err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.success("Please log in to add items to your cart.",{
          position: "top-right",
        });
        goTo('/login');
        return;
      }

      try {
        const userCartRef = collection(db, 'Users', auth.currentUser.uid, 'Cart');

        // Query: Check if product with same ID and size is already in cart
        const q = query(
          userCartRef,
          where('productId', '==', product.id),
          where('selectedSize', '==', selectedSize)
        );

        const existing = await getDocs(q);

        if (!existing.empty) {
          // ✅ Already exists, update the quantity
          const existingDoc = existing.docs[0];
          const docRef = doc(db, 'Users', auth.currentUser.uid, 'Cart', existingDoc.id);

          await updateDoc(docRef, {
            quantity: existingDoc.data().quantity + quantity,
          });

        toast.success("🛒 Cart updated!",{
          position: "top-right",
        });
        } else {
          // ➕ New item
          await addDoc(userCartRef, {
            productId: product.id,
            title: product.name,
            image: product.image,
            price: product.price,
            selectedSize,
            quantity,
            addedAt: serverTimestamp(),
          });

        toast.success("✅ Added to cart!",{
           position: "top-right",
        });
        }

      } catch (error) {
        console.error('❌ Error adding to cart:', error);
        toast.success("Failed to add to cart.",{
           position: "top-right",
        });
      }
    });   
  };  


  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <p className="text-gray-400 text-xl animate-pulse">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 mt-10 px-4">
        <img
          src={product.image}
          alt={product.name}
          className="rounded-lg w-full md:w-1/2"
        />

        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold">{product.name}</h2>
          <p className="text-gray-400">{product.description}</p>
          <p className="text-xl font-semibold">₹{product.price}</p>

          <div className="mt-4">
            <p className="mb-2 font-medium">Size</p>
            <div className="flex gap-2">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-1 rounded-full border ${
                    selectedSize === size
                      ? 'bg-white text-black'
                      : 'text-white border-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="block mb-1 font-medium">Quantity</label>
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-24 px-3 py-1 rounded bg-gray-900 border border-gray-700"
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={handleAddToCart}
            className="mt-6 bg-white text-black font-semibold px-6 py-2 rounded-full hover:bg-gray-300"
          >
            Add to Cart
          </button>
          <button
            onClick={() => goTo('/cart')}
            className="mt-6 bg-white text-black font-semibold px-6 py-2 rounded-full hover:bg-gray-300"
          >
            View Cart
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
