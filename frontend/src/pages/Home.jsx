import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from '../utils/api';
import { FaSearch, FaBookOpen, FaHeart, FaStar, FaUserPlus, FaChevronLeft, FaChevronRight, FaBook, FaSeedling, FaMask, FaFlask, FaUser, FaBriefcase, FaLaptop, FaLandmark, FaMagic } from 'react-icons/fa';

function Home() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [errorFeatured, setErrorFeatured] = useState(null);

  const categories = [
    { name: 'Fiction', icon: <FaBook />, color: 'bg-indigo-500' },
    { name: 'Non-Fiction', icon: <FaBookOpen />, color: 'bg-pink-500' },
    { name: 'Self-Help', icon: <FaSeedling />, color: 'bg-emerald-500' },
    { name: 'Comics', icon: <FaMask />, color: 'bg-amber-500' },
    { name: 'Science', icon: <FaFlask />, color: 'bg-blue-500' },
    { name: 'Biography', icon: <FaUser />, color: 'bg-violet-500' },
    { name: 'Mystery', icon: <FaSearch />, color: 'bg-red-500' },
    { name: 'Romance', icon: <FaHeart />, color: 'bg-rose-500' },
    { name: 'Business', icon: <FaBriefcase />, color: 'bg-gray-500' },
    { name: 'Technology', icon: <FaLaptop />, color: 'bg-cyan-500' },
    { name: 'History', icon: <FaLandmark />, color: 'bg-orange-500' },
    { name: 'Fantasy', icon: <FaMagic />, color: 'bg-purple-500' }
  ];

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        setLoadingFeatured(true);
        console.log('Fetching featured books...');
        const response = await axios.get('/books', {
          params: { sort: 'rating', limit: 5 }
        });
        console.log('Featured books response:', response.data);
        if (response.data.books && response.data.books.length > 0) {
          setFeaturedBooks(response.data.books);
        } else {
          setErrorFeatured('No featured books found');
        }
      } catch (error) {
        console.error('Error fetching featured books:', error);
        setErrorFeatured('Failed to load featured books');
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  useEffect(() => {
    if (featuredBooks.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredBooks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredBooks.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAddToCart = async (bookId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    await addToCart(bookId);
  };

  const handleAddToWishlist = async (bookId) => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }
      await axios.post('/wishlist', { bookId });
      toast.success('Book added to wishlist!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  const nextSlide = () => {
    if (featuredBooks.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % featuredBooks.length);
  };

  const prevSlide = () => {
    if (featuredBooks.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + featuredBooks.length) % featuredBooks.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center bg-gray-900 text-white px-4 py-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&h=1080&fit=crop" 
            alt="Library Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-800/60"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight animate-fade-in-up">
            Discover Your Next <span className="text-blue-400">Favorite Book</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Explore thousands of books across all genres. Your literary adventure starts here.
          </p>
          
          <form className="relative max-w-2xl mx-auto" onSubmit={handleSearch}>
            <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
            <input
              type="text"
              className="w-full py-5 pl-16 pr-40 text-lg text-gray-900 rounded-full shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all"
              placeholder="Search by title, author, or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-blue-500/50"
            >
              SEARCH
            </button>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-amber-500 mx-auto rounded-full"></div>
            <p className="mt-4 text-xl text-gray-600">Find your perfect read across diverse genres</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div 
                key={index} 
                onClick={() => navigate(`/books?category=${category.name}`)}
                className="group relative bg-white border border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${category.color.replace('bg-', 'bg-')}`}></div>
                <div className="text-5xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 drop-shadow-md">
                  {category.icon}
                </div>
                <h3 className={`text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors`}>
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Featured Books</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-amber-500 mx-auto rounded-full"></div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {loadingFeatured ? (
              <div className="h-[400px] flex items-center justify-center bg-white rounded-xl shadow-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : errorFeatured ? (
              <div className="h-[400px] flex items-center justify-center bg-white rounded-xl shadow-xl">
                <p className="text-red-500">{errorFeatured}</p>
              </div>
            ) : featuredBooks.length === 0 ? (
              <div className="h-[400px] flex items-center justify-center bg-white rounded-xl shadow-xl">
                <p className="text-gray-500">No featured books available.</p>
              </div>
            ) : (
              <>
                <button 
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-blue-600 hover:scale-110 transition-all"
                  onClick={prevSlide}
                >
                  <FaChevronLeft className="text-lg" />
                </button>
                
                <div className="overflow-hidden rounded-xl shadow-xl bg-white">
                  <div 
                    className="flex transition-transform duration-500 ease-out" 
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {featuredBooks.map((book) => (
                      <div key={book._id} className="w-full flex-shrink-0 flex flex-col md:flex-row h-[400px]">
                        <div className="md:w-5/12 h-48 md:h-full relative overflow-hidden">
                          <img 
                            src={book.image || 'https://via.placeholder.com/300x450?text=No+Cover'} 
                            alt={book.title} 
                            onError={(e) => {
                              e.target.onerror = null; 
                              e.target.src = 'https://via.placeholder.com/300x450?text=No+Cover';
                            }}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                          />
                          <button 
                            onClick={() => handleAddToWishlist(book._id)}
                            className="absolute top-3 right-3 bg-white/90 p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-md"
                          >
                            <FaHeart className="text-lg" />
                          </button>
                        </div>
                        <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-center bg-white">
                          <div className="flex items-center gap-1 text-amber-400 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={`text-sm ${i < Math.floor(book.rating) ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                            <span className="text-gray-500 text-xs ml-2 font-medium">({book.rating})</span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
                          <p className="text-lg text-gray-600 mb-4">{book.author}</p>
                          <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                            {book.description || "Experience this masterpiece that has captivated readers worldwide. A compelling story of emotion, adventure, and discovery."}
                          </p>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-2xl font-bold text-blue-600">${book.price}</span>
                            <button 
                              onClick={() => handleAddToCart(book._id)}
                              className="bg-gray-900 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md hover:shadow-blue-500/30 text-sm"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-blue-600 hover:scale-110 transition-all"
                  onClick={nextSlide}
                >
                  <FaChevronRight className="text-lg" />
                </button>
                
                <div className="flex justify-center gap-2 mt-6">
                  {featuredBooks.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <div className="inline-block p-4 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
              <FaUserPlus className="text-4xl" />
            </div>
            <h2 className="text-4xl font-bold mb-6">Join BookBazaar Today</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Create your account to unlock exclusive features, track your orders, and build your personal library. Start your reading journey with us!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="bg-white text-blue-600 font-bold py-4 px-10 rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                Sign Up Now
              </Link>
              <Link to="/login" className="bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-xl hover:bg-white/10 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
