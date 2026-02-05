import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaBookOpen, FaUser, FaSignInAlt, FaUserPlus, FaBars, FaTimes, FaHome, FaShoppingCart } from 'react-icons/fa';

function Navbar() {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors" onClick={closeMobileMenu}>
            <FaBookOpen className="text-3xl" />
            <span>BookBazaar</span>
          </Link>

          <button className="md:hidden text-gray-600 hover:text-blue-600 text-2xl p-2 rounded-md focus:outline-none" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <div className={`md:flex items-center gap-6 ${isMobileMenuOpen ? 'absolute top-16 left-0 w-full bg-white shadow-lg flex flex-col p-4 gap-4 border-t border-gray-100' : 'hidden'}`}>
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors" onClick={closeMobileMenu}>
              <FaHome className="text-lg" />
              <span>Home</span>
            </Link>
            
            <Link to="/books" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors" onClick={closeMobileMenu}>
              <FaBookOpen className="text-lg" />
              <span>Books</span>
            </Link>
            
            {user && user.role !== 'admin' && (
              <Link to="/cart" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors" onClick={closeMobileMenu}>
                <div className="relative">
                  <FaShoppingCart className="text-lg" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </Link>
            )}
            
            {user ? (
              <Link 
                to={user.role === 'admin' ? "/admin" : "/profile"}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors w-full md:w-auto"
                onClick={closeMobileMenu}
              >
                <FaUser className="text-blue-500" />
                <span className="font-semibold">{user.name}</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors" onClick={closeMobileMenu}>
                  <FaSignInAlt className="text-lg" />
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg" onClick={closeMobileMenu}>
                  <FaUserPlus className="text-lg" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

