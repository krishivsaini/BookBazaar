import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBookOpen, FaTags, FaShippingFast, FaLock, FaArrowRight, FaTachometerAlt } from 'react-icons/fa';
import './Home.css';

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>Welcome to BookBazaar</h1>
        <p className="hero-subtitle">Your one-stop destination for buying and selling books</p>
        <div className="hero-buttons">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary">
              <FaTachometerAlt className="btn-icon" />
              <span>Go to Dashboard</span>
              <FaArrowRight className="arrow-icon" />
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary">
                <span>Get Started</span>
                <FaArrowRight className="arrow-icon" />
              </Link>
              <Link to="/login" className="btn btn-secondary">
                <span>Login</span>
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose BookBazaar?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaBookOpen />
            </div>
            <h3>Wide Selection</h3>
            <p>Browse thousands of books across all genres</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaTags />
            </div>
            <h3>Best Prices</h3>
            <p>Get the best deals on new and used books</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaShippingFast />
            </div>
            <h3>Fast Delivery</h3>
            <p>Quick and reliable shipping to your doorstep</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaLock />
            </div>
            <h3>Secure Payments</h3>
            <p>Safe and encrypted payment processing</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
