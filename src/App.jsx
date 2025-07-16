import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Forgot from './pages/Forgot';
import Dashboard from './pages/Dashboard';
import CreateGig from './pages/CreateGig';
import EditGig from './pages/EditGig';

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
        
        {/* Gig Management Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-gig" element={<CreateGig />} />
        <Route path="/edit-gig/:id" element={<EditGig />} />
      </Routes>
    </Router>
  );
};

export default App;