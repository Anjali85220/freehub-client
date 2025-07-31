import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Star,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Pause,
  Image as ImageIcon,
  Eye,
  TrendingUp
} from 'lucide-react';

const GigDetails = () => {
  const { gigId } = useParams();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/gigs/${gigId}`);
        if (response.data.success) {
          setGig(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch gig');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch gig');
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [gigId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'paused': return <Pause className="w-5 h-5 text-gray-500" />;
      case 'rejected': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const handlePurchase = async () => {
    if (!gig) return;
    setLoadingCheckout(true);
    try {
      const response = await axios.post('http://localhost:5000/api/orders/create-checkout-session', { gigId: gig._id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        alert('Failed to initiate checkout session');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to initiate checkout session');
    } finally {
      setLoadingCheckout(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Gig Not Found</h2>
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{gig.title}</h1>
              <div className="flex flex-wrap items-center mt-2 gap-2 md:gap-4">
                <span className="flex items-center text-sm md:text-base">
                  {getStatusIcon(gig.status)}
                  <span className="ml-1 capitalize">{gig.status}</span>
                </span>
                <span className="flex items-center text-sm md:text-base">
                  <span className="mr-1">₹</span>
                  {gig.price.toFixed(2)}
                </span>
                <span className="flex items-center text-sm md:text-base">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                  {gig.deliveryTime} day{gig.deliveryTime !== 1 ? 's' : ''} delivery
                </span>
                <span className="flex items-center text-sm md:text-base">
                  <Eye className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                  {gig.views} view{gig.views !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-full">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="ml-1 font-medium">
                {gig.rating?.toFixed(1) || '0.0'} ({gig.reviewCount || 0} review{gig.reviewCount !== 1 ? 's' : ''})
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-8">
                {gig.images?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {gig.images.map((image, index) => (
                      <div key={index} className="rounded-lg overflow-hidden bg-gray-100 aspect-video">
                        <img 
                          src={`http://localhost:5000${image}`} 
                          alt={`${gig.title} - ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading={index > 0 ? "lazy" : "eager"}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">About This Gig</h3>
                <p className="whitespace-pre-line text-gray-700">{gig.description}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Gig Details</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{gig.category}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span>{new Date(gig.updatedAt).toLocaleDateString()}</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => navigate(`/edit-gig/${gig._id}`)}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Edit This Gig
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={loadingCheckout}
                  className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
                >
                  {loadingCheckout ? 'Processing...' : 'Purchase'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetails;
