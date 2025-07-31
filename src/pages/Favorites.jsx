import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  User, 
  Clock, 
  Eye, 
  Package, 
  Image as ImageIcon 
} from 'lucide-react';
import { getUserFavorites, addOrder } from '../services/gigService';
import axios from 'axios';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await getUserFavorites();
      if (response.data.success) {
        setFavorites(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch favorites');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (gigId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await axios.post('/orders', { gigId });
      navigate('/orders');
    } catch (err) {
      setError('Failed to add to cart');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const baseUrl = 'http://localhost:5000';
    if (!imagePath.startsWith('/')) {
      imagePath = `/${imagePath}`;
    }
    return `${baseUrl}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <Heart className="w-16 h-16 mb-4" />
        <p className="text-xl">You have no favorite gigs yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Favorite Gigs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((gig) => (
            <div key={gig._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="relative h-48 rounded-t-lg overflow-hidden bg-gray-100">
                {gig.images && gig.images.length > 0 ? (
                  <img
                    src={getImageUrl(gig.images[0])}
                    alt={gig.title || 'Gig image'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                    <ImageIcon className="w-12 h-12" />
                    <span className="text-sm mt-2">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{gig.title || 'Untitled Gig'}</h3>
                <div className="flex items-center mb-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium text-gray-900">{(gig.rating || 0).toFixed(1)}</span>
                  <span className="ml-1 text-sm text-gray-600">({gig.reviewCount || 0})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">Starting at</span>
                    <span className="ml-1 text-lg font-bold text-gray-900">₹{gig.price || 0}</span>
                  </div>
                  <button
                    onClick={() => addToCart(gig._id)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {gig.deliveryTime || 0} days delivery
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
