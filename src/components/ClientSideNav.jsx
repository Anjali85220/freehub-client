import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ClientSideNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold">Client</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul>
          <li className="mb-4">
            <Link to="/client" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <span className="ml-3">Dashboard</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/client-profile" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <span className="ml-3">Profile</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/cart" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <span className="ml-3">Cart</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ClientSideNav;

