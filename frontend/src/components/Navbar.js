import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBookOpen, FaUser, FaTachometerAlt, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="navbar-brand">
          <FaBookOpen className="brand-icon" />
          <span className="brand-text">BookBazaar</span>
        </Link>
                <div className="nav-menu">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                <FaTachometerAlt className="nav-icon" />
                <span>Dashboard</span>
              </Link>
              <span className="nav-user">
                <FaUser className="user-icon" />
                <span>{user.name}</span>
              </span>
              <button onClick={handleLogout} className="logout-btn">
                <FaSignOutAlt className="btn-icon" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <FaSignInAlt className="nav-icon" />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="nav-link signup-link">
                <FaUserPlus className="nav-icon" />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
