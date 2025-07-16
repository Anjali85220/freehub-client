import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, Trash2, Edit, DollarSign, Tag, Users, Award, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const [gigs, setGigs] = useState([]);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeTab, setActiveTab] = useState('gigs');
  const [searchTerm, setSearchTerm] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchGigs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/gigs', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      const data = await res.json();

      if (res.ok) {
        setGigs(data);
        setTotalOrders(data.length);
        setCompletedOrders(data.filter(gig => gig.status === 'completed').length);
      } else {
        toast.error(data.error || 'Failed to fetch gigs');
      }
    } catch (error) {
      console.error('Error fetching gigs:', error);
      toast.error('Error fetching gigs');
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/gigs/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (res.ok) {
        toast.success('Gig deleted');
        setGigs(prev => prev.filter(gig => gig._id !== id));
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete');
      }
    } catch (err) {
      toast.error('Error deleting gig');
    }
  };

  const handleOrderComplete = (id) => {
    setGigs(prev =>
      prev.map(gig => gig._id === id ? { ...gig, status: 'completed' } : gig)
    );
    setCompletedOrders(prev => prev + 1);
  };

  const calculateSuccessRate = () => {
    if (totalOrders === 0) return 0;
    return Math.round((completedOrders / totalOrders) * 100);
  };

  const filteredGigs = gigs.filter(gig =>
    gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gig.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-gray-900">FreelanceHub</h1>
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<Users className="text-emerald-600" />} label="Active Gigs" value={gigs.length} />
          <StatCard icon={<Award className="text-blue-600" />} label="Orders Completed" value={completedOrders} />
          <StatCard icon={<Shield className="text-purple-600" />} label="Success Rate" value={`${calculateSuccessRate()}%`} />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {['gigs', 'create'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  {tab === 'gigs' ? 'My Gigs' : 'Create New Gig'}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'gigs' && (
              <>
                {/* Search */}
                <div className="mb-6 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search your gigs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Gigs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGigs.map(gig => (
                    <div key={gig._id} className="bg-white border rounded-xl shadow-sm hover:shadow-md transition">
                      {gig.images?.[0] && (
                        <div className="aspect-w-16 aspect-h-9">
                          <img
                            src={gig.images[0]}
                            alt={gig.title}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/fallback.jpg'; // Add fallback.jpg inside public/
                            }}
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900">{gig.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{gig.desc}</p>
                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                          <span><DollarSign size={14} className="inline" /> ₹{gig.price}</span>
                          <span><Tag size={14} className="inline" /> {gig.category}</span>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button onClick={() => navigate(`/edit-gig/${gig._id}`)} className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-md flex-1 text-sm flex items-center justify-center gap-1">
                            <Edit size={14} /> Edit
                          </button>
                          <button onClick={() => handleDelete(gig._id)} className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md flex-1 text-sm flex items-center justify-center gap-1">
                            <Trash2 size={14} /> Delete
                          </button>
                          {gig.status !== 'completed' && (
                            <button onClick={() => handleOrderComplete(gig._id)} className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md flex-1 text-sm flex items-center justify-center gap-1">
                              <Award size={14} /> Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'create' && (
              <div className="flex justify-center">
                <button
                  onClick={() => navigate('/create-gig')}
                  className="bg-emerald-500 text-white px-5 py-3 rounded-lg hover:bg-emerald-600"
                >
                  Create New Gig
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
    <div className="flex items-center">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
