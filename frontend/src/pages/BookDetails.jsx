import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from '../utils/api';
import { FaStar, FaShoppingCart, FaHeart, FaArrowLeft, FaMinus, FaPlus, FaTruck, FaShieldAlt, FaUndo } from 'react-icons/fa';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
  });

  useEffect(() => {
    fetchBookDetails();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/books/${id}`);
      setBook(response.data);
      
      // Fetch related books (same category)
      if (response.data.category) {
        const relatedResponse = await axios.get('/books', {
          params: { category: response.data.category, limit: 4 }
        });
        setRelatedBooks(relatedResponse.data.books.filter(b => b._id !== id));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching book:', error);
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/reviews/${id}`);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    await addToCart(id, quantity);
  };

  const handleAddToWishlist = async () => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }
      await axios.post('/wishlist', { bookId: id });
      toast.success('Book added to wishlist!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const success = await addToCart(id, quantity);
    if (success) {
      navigate('/cart');
    }
  };

  const addRelatedToCart = async (relatedId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    await addToCart(relatedId);
  };

  const addRelatedToWishlist = async (relatedId) => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }
      await axios.post('/wishlist', { bookId: relatedId });
      toast.success('Book added to wishlist!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  const handleReviewChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.post(`/reviews/${id}`, reviewForm);
      setReviewForm({ rating: 5, title: '', comment: '' });
      fetchReviews();
      toast.success('Review submitted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Book not found</h2>
        <button 
          onClick={() => navigate('/books')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Books
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 font-medium transition-colors"
        >
          <FaArrowLeft /> Back to Books
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="p-8 md:p-12 bg-gray-50 flex items-center justify-center relative">
              <div className="relative w-full max-w-md aspect-[2/3] shadow-2xl rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-500">
                <img 
                  src={book.image || 'https://via.placeholder.com/300x450?text=No+Cover'} 
                  alt={book.title} 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://via.placeholder.com/300x450?text=No+Cover';
                  }}
                  className="w-full h-full object-cover"
                />
                {book.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full shadow-lg">
                    -{book.discount}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="p-8 md:p-12 flex flex-col">
              <div className="mb-auto">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-bold uppercase tracking-wide">
                    {book.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                    <FaStar /> {book.rating} ({reviews.length} reviews)
                  </div>
                </div>

                <h1 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight">{book.title}</h1>
                <p className="text-xl text-gray-500 mb-6">by <span className="text-gray-800 font-medium">{book.author}</span></p>

                <div className="flex items-end gap-4 mb-8">
                  <span className="text-5xl font-bold text-gray-900">${book.price}</span>
                  {book.originalPrice && (
                    <span className="text-xl text-gray-400 line-through mb-2">${book.originalPrice}</span>
                  )}
                </div>

                <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                  {book.description}
                </p>

                {/* Quantity & Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden w-fit">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-4 hover:bg-gray-100 transition-colors text-gray-600"
                    >
                      <FaMinus />
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-4 hover:bg-gray-100 transition-colors text-gray-600"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>

                  <button 
                    onClick={handleBuyNow}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/30"
                  >
                    Buy Now
                  </button>
                  
                  <button 
                    onClick={handleAddToWishlist}
                    className="p-4 border-2 border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                  >
                    <FaHeart className="text-xl" />
                  </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-100">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                      <FaTruck />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase">Free Shipping</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="p-3 bg-green-50 text-green-600 rounded-full">
                      <FaShieldAlt />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase">Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
                      <FaUndo />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase">Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <div className="flex border-b border-gray-200 mb-8">
            <button
              className={`pb-4 px-6 font-bold text-lg transition-colors relative ${
                activeTab === 'description' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('description')}
            >
              Description
              {activeTab === 'description' && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
            <button
              className={`pb-4 px-6 font-bold text-lg transition-colors relative ${
                activeTab === 'reviews' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({reviews.length})
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
            {activeTab === 'description' ? (
              <div className="prose max-w-none text-gray-600 leading-relaxed">
                <p>{book.description}</p>
                <p className="mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Review Form */}
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className={`text-2xl transition-colors ${
                              star <= reviewForm.rating ? 'text-amber-400' : 'text-gray-300'
                            }`}
                          >
                            <FaStar />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={reviewForm.title}
                        onChange={handleReviewChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Summarize your thoughts"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                      <textarea
                        name="comment"
                        value={reviewForm.comment}
                        onChange={handleReviewChange}
                        rows="4"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Share your experience"
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                  ) : (
                    reviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                              {review.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{review.user?.name || 'Anonymous'}</p>
                              <div className="flex text-amber-400 text-sm">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar key={i} className={i < review.rating ? '' : 'text-gray-200'} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-1">{review.title}</h4>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBooks.map((relatedBook) => (
                <div 
                  key={relatedBook._id} 
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img 
                      src={relatedBook.image} 
                      alt={relatedBook.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                      onClick={() => navigate(`/books/${relatedBook._id}`)}
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addRelatedToWishlist(relatedBook._id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <FaHeart />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 
                      className="font-bold text-gray-900 mb-1 line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => navigate(`/books/${relatedBook._id}`)}
                    >
                      {relatedBook.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{relatedBook.author}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-600">${relatedBook.price}</span>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <FaStar /> {relatedBook.rating}
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // We need a separate function or modify handleAddToCart to accept an ID
                        // Since handleAddToCart uses state 'quantity' and 'id' from params, we need a new function for related books
                        addRelatedToCart(relatedBook._id);
                      }}
                      className="w-full mt-4 bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-900 font-bold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <FaShoppingCart /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
