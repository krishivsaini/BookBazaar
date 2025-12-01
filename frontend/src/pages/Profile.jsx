import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaTachometerAlt, FaBox, FaHeart, FaSignOutAlt } from 'react-icons/fa';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 flex items-center gap-6 border border-gray-100">
          <div className="bg-blue-50 p-4 rounded-full">
            <FaUser className="text-4xl text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            to="/dashboard" 
            state={{ tab: 'overview' }}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-50 p-3 rounded-lg group-hover:bg-purple-100 transition-colors">
                <FaTachometerAlt className="text-xl text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            </div>
            <p className="text-gray-600 text-sm">View your account overview and recent activities.</p>
          </Link>

          <Link 
            to="/dashboard" 
            state={{ tab: 'orders' }}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors">
                <FaBox className="text-xl text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">My Orders</h2>
            </div>
            <p className="text-gray-600 text-sm">Track your orders and view purchase history.</p>
          </Link>

          <Link 
            to="/dashboard" 
            state={{ tab: 'wishlist' }}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-pink-50 p-3 rounded-lg group-hover:bg-pink-100 transition-colors">
                <FaHeart className="text-xl text-pink-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Wishlist</h2>
            </div>
            <p className="text-gray-600 text-sm">View and manage your saved books.</p>
          </Link>

          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to logout?')) {
                logout();
              }
            }}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group hover:-translate-y-1 text-left w-full"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-50 p-3 rounded-lg group-hover:bg-red-100 transition-colors">
                <FaSignOutAlt className="text-xl text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Logout</h2>
            </div>
            <p className="text-gray-600 text-sm">Sign out of your account securely.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
