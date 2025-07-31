import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2 } from 'lucide-react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const removeFromCart = (gigId) => {
    const updatedCart = cartItems.filter(item => item._id !== gigId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      setError('Cart is empty');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      // Place orders sequentially for all gigs in cart
      for (const gig of cartItems) {
        await axios.post('/orders/create-checkout-session', { gigId: gig._id }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      setSuccessMessage('Orders placed successfully!');
      localStorage.removeItem('cart');
      setCartItems([]);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to place orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-12">
        <h2 className="text-3xl font-semibold mb-6 flex items-center text-gray-800">
          <ShoppingCart className="w-8 h-8 mr-3 text-blue-600" />
          Your Cart
        </h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-center py-10">Your cart is empty.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {cartItems.map((gig) => (
              <li key={gig._id} className="flex justify-between items-center py-4">
                <div>
                  <p className="text-lg font-medium text-gray-900">{gig.title}</p>
                  <p className="text-sm text-gray-500">₹{gig.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => removeFromCart(gig._id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label="Remove from cart"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
        {successMessage && <p className="text-green-600 mt-4 text-center">{successMessage}</p>}
        <div className="flex gap-4 mt-8">
          <button
            onClick={placeOrder}
            disabled={loading || cartItems.length === 0}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
          <button
            onClick={() => navigate('/client')}
            className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
