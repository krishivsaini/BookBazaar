import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBookOpen, FaUser, FaTachometerAlt, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBars, FaTimes, FaHome, FaHeart } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <FaBookOpen className="brand-icon" />
          <span className="brand-text">BookBazaar</span>
        </Link>

        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMobileMenu}>
            <FaHome className="nav-icon" />
            <span>Home</span>
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={closeMobileMenu}>
                <FaTachometerAlt className="nav-icon" />
                <span>Dashboard</span>
              </Link>
              <Link to="/wishlist" className="nav-link" onClick={closeMobileMenu}>
                <FaHeart className="nav-icon" />
                <span>Wishlist</span>
              </Link>
              <span className="nav-user">
                <FaUser className="user-icon" />
                <span className="user-name">{user.name}</span>
              </span>
              <button onClick={handleLogout} className="logout-btn">
                <FaSignOutAlt className="btn-icon" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={closeMobileMenu}>
                <FaSignInAlt className="nav-icon" />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="nav-link signup-link" onClick={closeMobileMenu}>
                <FaUserPlus className="nav-icon" />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
