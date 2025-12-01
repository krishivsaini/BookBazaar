import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import axios from '../utils/api';
import {
  FaBookOpen,
  FaShoppingCart,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSearch,
  FaCheckCircle,
  FaShoppingBag,
  FaChartLine,
  FaUsers,
  FaBox
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    price: '',
    discount: 0,
    stock: '',
    image: '',
    publisher: '',
    language: 'English',
    pages: '',
    isbn: '',
    format: 'Paperback',
    featured: false
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 'books') {
      fetchBooks();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/books?limit=100');
      setBooks(response.data.books || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const handleBookFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddBook = () => {
    setEditingBook(null);
    setBookForm({
      title: '',
      author: '',
      description: '',
      category: '',
      price: '',
      discount: 0,
      stock: '',
      image: '',
      publisher: '',
      language: 'English',
      pages: '',
      isbn: '',
      format: 'Paperback',
      featured: false
    });
    setShowBookModal(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      description: book.description,
      category: book.category,
      price: book.price,
      discount: book.discount || 0,
      stock: book.stock,
      image: book.image,
      publisher: book.publisher || '',
      language: book.language || 'English',
      pages: book.pages || '',
      isbn: book.isbn || '',
      format: book.format || 'Paperback',
      featured: book.featured || false
    });
    setShowBookModal(true);
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/books/${id}`);
        fetchBooks();
        toast.success('Book deleted successfully');
      } catch (error) {
        toast.error('Error deleting book');
      }
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await axios.put(`/books/${editingBook._id}`, bookForm);
      } else {
        await axios.post('/books', bookForm);
      }
      setShowBookModal(false);
      fetchBooks();
      toast.success(editingBook ? 'Book updated successfully' : 'Book added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving book');
    }
  };

  const handleOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/orders/${orderId}/status`, { status });
      fetchOrders();
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Error updating order status');
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats Calculation
  const totalSales = orders.reduce((sum, order) => sum + (order.isPaid ? order.totalPrice : 0), 0);
  const totalOrders = orders.length;
  const totalBooks = books.length;
  const lowStockBooks = books.filter(b => b.stock < 5).length;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row pt-16">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 md:min-h-screen">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FaChartLine className="text-blue-400" /> Admin Panel
          </h2>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'stats' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FaChartLine /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'books' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FaBookOpen /> Books
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'orders' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FaShoppingBag /> Orders
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FaUsers /> Users
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto h-[calc(100vh-4rem)]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'stats' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 text-green-600 rounded-full">
                    <FaShoppingCart />
                  </div>
                  <span className="text-sm font-bold text-gray-400">Total Sales</span>
                </div>
                <p className="text-3xl font-extrabold text-gray-900">${totalSales.toFixed(2)}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <FaBox />
                  </div>
                  <span className="text-sm font-bold text-gray-400">Total Orders</span>
                </div>
                <p className="text-3xl font-extrabold text-gray-900">{totalOrders}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                    <FaBookOpen />
                  </div>
                  <span className="text-sm font-bold text-gray-400">Total Books</span>
                </div>
                <p className="text-3xl font-extrabold text-gray-900">{totalBooks}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-100 text-red-600 rounded-full">
                    <FaCheckCircle />
                  </div>
                  <span className="text-sm font-bold text-gray-400">Low Stock</span>
                </div>
                <p className="text-3xl font-extrabold text-gray-900">{lowStockBooks}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'books' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900">Manage Books</h1>
              <button 
                onClick={handleAddBook}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/30"
              >
                <FaPlus /> Add New Book
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
              <div className="relative mb-6">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                      <th className="p-4 font-bold">Book</th>
                      <th className="p-4 font-bold">Category</th>
                      <th className="p-4 font-bold">Price</th>
                      <th className="p-4 font-bold">Stock</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredBooks.map((book) => (
                      <tr key={book._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <img 
                              src={book.image || 'https://via.placeholder.com/300x450?text=No+Cover'} 
                              alt={book.title} 
                              onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = 'https://via.placeholder.com/300x450?text=No+Cover';
                              }}
                              className="w-10 h-14 object-cover rounded shadow-sm" 
                            />
                            <div>
                              <p className="font-bold text-gray-900 line-clamp-1">{book.title}</p>
                              <p className="text-xs text-gray-500">{book.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">{book.category}</td>
                        <td className="p-4 font-bold text-gray-900">${book.price}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${book.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {book.stock} in stock
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEditBook(book)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              onClick={() => handleDeleteBook(book._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                      <th className="p-4 font-bold">Order ID</th>
                      <th className="p-4 font-bold">Customer</th>
                      <th className="p-4 font-bold">Date</th>
                      <th className="p-4 font-bold">Total</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-mono text-sm text-gray-500">#{order._id.slice(-6)}</td>
                        <td className="p-4">
                          <p className="font-bold text-gray-900">{order.user?.name || 'Guest'}</p>
                          <p className="text-xs text-gray-500">{order.user?.email}</p>
                        </td>
                        <td className="p-4 text-gray-600 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-bold text-gray-900">${order.totalPrice}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.isDelivered ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {order.isDelivered ? 'Delivered' : 'Processing'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {!order.isDelivered && (
                            <button 
                              onClick={() => handleOrderStatus(order._id, 'Delivered')}
                              className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-lg font-bold transition-colors"
                            >
                              Mark Delivered
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </div>

      {/* Book Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </h2>
              <button 
                onClick={() => setShowBookModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleBookSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={bookForm.title}
                    onChange={handleBookFormChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={bookForm.author}
                    onChange={handleBookFormChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={bookForm.category}
                    onChange={handleBookFormChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Science">Science</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="History">History</option>
                    <option value="Self-Help">Self-Help</option>
                    <option value="Comics">Comics</option>
                    <option value="Biography">Biography</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Romance">Romance</option>
                    <option value="Fantasy">Fantasy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={bookForm.price}
                    onChange={handleBookFormChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={bookForm.stock}
                    onChange={handleBookFormChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                    min="0"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={bookForm.image}
                    onChange={handleBookFormChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={bookForm.description}
                    onChange={handleBookFormChange}
                    rows="4"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  ></textarea>
                </div>
                
                <div className="col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={bookForm.featured}
                    onChange={handleBookFormChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm font-bold text-gray-700">Mark as Featured Book</label>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-6 py-2 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30"
                >
                  {editingBook ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
