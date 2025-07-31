import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Splash from './pages/Splash';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Forgot from './pages/Forgot';
import Dashboard from './pages/FreelancerDashboard';
import CreateGig from './pages/CreateGig';
import EditGig from './pages/EditGig';
import GigDetails from './pages/GigDetails';
import ClientDashboard from './pages/ClientDashboard';
import ClientProfile from './pages/ClientProfile';
import Favorites from './pages/Favorites';
import FreelancerProfile from './pages/FreelancerProfile';
import OrdersDashboard from './pages/OrdersDashboard';
import FreelancerOrdersDashboard from './pages/FreelancerOrdersDashboard';
import Cart from './pages/Cart';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000/api'; // Adjust this to your backend URL
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        
        {/* Freelancer Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-gig" element={<CreateGig />} />
        <Route path="/edit-gig/:id" element={<EditGig />} />
        <Route path="/freelancer-profile" element={<FreelancerProfile />} />
        
        {/* Gig Routes */}
        <Route path="/gig/:gigId" element={<GigDetails />} />
        
        {/* Client Routes */}
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/client-profile" element={<ClientProfile />} />
        <Route path="/favorites" element={<Favorites />} />
        
        {/* Orders Route */}
        <Route path="/orders" element={<OrdersDashboard />} />
        <Route path="/freelancer-orders-dashboard" element={<FreelancerOrdersDashboard />} />
        {/* Cart Route */}
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
};

export default App;
