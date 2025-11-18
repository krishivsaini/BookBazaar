import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaBookOpen, FaHeart, FaStar, FaUserPlus, FaChevronLeft, FaChevronRight, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Home.css';

function Home() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = [
    { name: 'Fiction', icon: '📚', color: '#6366f1' },
    { name: 'Non-Fiction', icon: '📖', color: '#ec4899' },
    { name: 'Self-Help', icon: '🌱', color: '#10b981' },
    { name: 'Comics', icon: '🦸', color: '#f59e0b' },
    { name: 'Science', icon: '🔬', color: '#3b82f6' },
    { name: 'Biography', icon: '👤', color: '#8b5cf6' },
    { name: 'Mystery', icon: '🔍', color: '#ef4444' },
    { name: 'Romance', icon: '💝', color: '#f43f5e' }
  ];

  const featuredBooks = [
    {
      id: 1,
      title: 'The Midnight Library',
      author: 'Matt Haig',
      price: '$24.99',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'
    },
    {
      id: 2,
      title: 'Atomic Habits',
      author: 'James Clear',
      price: '$19.99',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop'
    },
    {
      id: 3,
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      price: '$22.99',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop'
    },
    {
      id: 4,
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      price: '$18.99',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredBooks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredBooks.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredBooks.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredBooks.length) % featuredBooks.length);
  };

  const getSlideClass = (index) => {
    if (index === currentSlide) return 'active';
    if (index === (currentSlide + 1) % featuredBooks.length) return 'next';
    if (index === (currentSlide - 1 + featuredBooks.length) % featuredBooks.length) return 'prev';
    return '';
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Discover Your Next Favorite Book</h1>
          <p className="hero-subtitle">Explore thousands of books across all genres. Your literary adventure starts here.</p>
          <form className="search-container" onSubmit={handleSearch}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, author, or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">Search</button>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Browse by Category</h2>
          <p>Find your perfect read across diverse genres</p>
        </div>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-card" style={{ '--category-color': category.color }}>
              <h3 className="category-name">{category.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Books Carousel */}
      <section className="featured-section">
        <h2 className="section-title">Featured Books</h2>
        <div className="carousel-container">
          <button className="carousel-button prev" onClick={prevSlide}>
            <FaChevronLeft />
          </button>
          <div className="carousel-track">
            {featuredBooks.map((book, index) => (
              <div key={book.id} className={`carousel-slide ${getSlideClass(index)}`}>
                <div className="book-card">
                  <div className="book-image-container">
                    <img src={book.image} alt={book.title} className="book-image" />
                    <button className="wishlist-button">
                      <FaHeart />
                    </button>
                  </div>
                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">{book.author}</p>
                    <div className="book-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={`star ${i < Math.floor(book.rating) ? 'filled' : ''}`} />
                      ))}
                      <span className="rating-text">({book.rating})</span>
                    </div>
                    <div className="book-footer">
                      <span className="book-price">{book.price}</span>
                      <button className="add-to-cart-btn">Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-button next" onClick={nextSlide}>
            <FaChevronRight />
          </button>
          <div className="carousel-dots">
            {featuredBooks.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="cta-section">
          <div className="cta-content">
            <FaUserPlus className="cta-icon" />
            <h2 className="cta-title">Join BookBazaar Today</h2>
            <p className="cta-text">
              Create your account to unlock exclusive features, track your orders, and build your personal library. Start your reading journey with us!
            </p>
            <div className="cta-buttons">
              <Link to="/signup" className="cta-button primary">Sign Up Now</Link>
              <Link to="/login" className="cta-button secondary">Sign In</Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <FaBookOpen className="footer-logo" />
              <h3>BookBazaar</h3>
            </div>
            <p className="footer-description">
              Your premier destination for discovering, buying, and selling books. Join our community of book lovers today.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link"><FaFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link"><FaInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link"><FaLinkedin /></a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Categories</h4>
            <ul className="footer-links">
              <li><Link to="/fiction">Fiction</Link></li>
              <li><Link to="/non-fiction">Non-Fiction</Link></li>
              <li><Link to="/self-help">Self-Help</Link></li>
              <li><Link to="/science">Science</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/returns">Return Policy</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 BookBazaar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
