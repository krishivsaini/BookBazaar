import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from '../utils/api';
import { FaSearch, FaFilter, FaStar, FaHeart, FaShoppingCart, FaTimes } from 'react-icons/fa';

const categories = [
  'Fiction',
  'Non-Fiction',
  'Self-Help',
  'Comics',
  'Science',
  'Biography',
  'Mystery',
  'Romance',
  'Fantasy',
  'History',
  'Technology',
  'Business',
];

const Books = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: [],
    minPrice: '',
    maxPrice: '',
    rating: '',
    search: '',
    sort: 'latest',
  });
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false); // Default hidden on mobile

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== searchInput) {
        setFilters(prev => ({ ...prev, search: searchInput }));
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, filters.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    const categoryParam = params.get('category');
    
    let newCategories = [];
    if (categoryParam) {
      newCategories = categoryParam.includes(',') ? categoryParam.split(',') : [categoryParam];
    }

    setSearchInput(search);
    setFilters(prev => ({
      ...prev,
      search,
      category: newCategories
    }));
  }, [location.search]);

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        ...(filters.category.length > 0 && { category: filters.category }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.rating && { rating: filters.rating }),
        ...(filters.search && { search: filters.search }),
        sort: filters.sort,
      };

      const response = await axios.get('/books', { params });
      setBooks(response.data.books);
      setTotalPages(response.data.pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    if (key === 'category') {
      setFilters(prev => {
        const currentCategories = prev.category;
        let newCategories;
        if (currentCategories.includes(value)) {
          newCategories = currentCategories.filter(c => c !== value);
        } else {
          newCategories = [...currentCategories, value];
        }
        return { ...prev, category: newCategories };
      });
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
    setPage(1); // Reset to first page on filter change
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

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Explore Books</h1>
            <p className="text-gray-500 mt-1">Find your next favorite read from our collection</p>
          </div>
          
          <button 
            className="md:hidden flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm text-gray-700 font-medium"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FaFilter className="text-blue-500" /> Filters
                </h2>
                <button 
                  className="lg:hidden text-gray-400 hover:text-gray-600"
                  onClick={() => setShowFilters(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Title, author..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    {filters.category.length > 0 && (
                      <button 
                        onClick={() => setFilters(prev => ({ ...prev, category: [] }))}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.category.length === 0}
                        onChange={() => setFilters(prev => ({ ...prev, category: [] }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className={`text-sm ${filters.category.length === 0 ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                        All Categories
                      </span>
                    </label>
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={filters.category.includes(cat)}
                          onChange={() => handleFilterChange('category', cat)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className={`text-sm ${filters.category.includes(cat) ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                  >
                    <option value="latest">Latest Arrivals</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
                    <div className="h-64 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No books found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {books.map((book) => (
                    <div key={book._id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="relative h-72 overflow-hidden bg-gray-100">
                        <img 
                          src={book.image || 'https://via.placeholder.com/300x450?text=No+Cover'} 
                          alt={book.title} 
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = 'https://via.placeholder.com/300x450?text=No+Cover';
                          }}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 group-hover:translate-x-0 z-10">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToWishlist(book._id);
                            }}
                            className="p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors"
                            title="Add to Wishlist"
                          >
                            <FaHeart />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-full uppercase tracking-wide">
                            {book.category}
                          </span>
                          <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                            <FaStar /> {book.rating}
                          </div>
                        </div>
                        
                        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          <Link to={`/books/${book._id}`}>{book.title}</Link>
                        </h3>
                        <p className="text-gray-500 text-sm mb-4">{book.author}</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="text-xl font-bold text-gray-900">${book.price}</span>
                          <button 
                            onClick={() => handleAddToCart(book._id)}
                            className="flex items-center gap-2 bg-gray-900 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm hover:shadow-blue-500/30"
                          >
                            <FaShoppingCart /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-lg border border-blue-100">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Books;
