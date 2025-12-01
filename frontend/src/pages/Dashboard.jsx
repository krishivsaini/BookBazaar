import { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import axios from '../utils/api';
import { 
  FaBookOpen, 
  FaShoppingCart, 
  FaStar, 
  FaUserCircle,
  FaCalendarAlt,
  FaHeart,
  FaTrophy,
  FaChartLine,
  FaBook,
  FaShoppingBag,
  FaClock,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimes,
  FaTrash
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistCount: 0,
    points: 0,
    recentActivity: []
  });

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
    if (location.state?.message) {
      toast.success(location.state.message);
    }
  }, [location]);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchOverviewData();
    } else if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'wishlist') {
      fetchWishlist();
    }
  }, [activeTab]);

  const fetchOverviewData = async () => {
    try {
      const [ordersRes, wishlistRes, profileRes] = await Promise.all([
        axios.get('/orders/my?limit=5'),
        axios.get('/wishlist'),
        axios.get('/auth/profile')
      ]);

      setStats({
        totalOrders: ordersRes.data.total,
        wishlistCount: wishlistRes.data.items.length,
        points: profileRes.data.points || 0,
        recentActivity: ordersRes.data.orders
      });
    } catch (error) {
      console.error('Error fetching overview data:', error);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/orders/my');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/wishlist');
      setWishlist(response.data.items || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
    setLoading(false);
  };

  const removeFromWishlist = async (bookId) => {
    try {
      await axios.delete(`/wishlist/${bookId}`);
      setWishlist(wishlist.filter(item => item.book._id !== bookId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error removing from wishlist');
    }
  };

  const moveToCart = async (bookId) => {
    try {
      await axios.post('/cart', { bookId, quantity: 1 });
      await removeFromWishlist(bookId);
      toast.success('Moved to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error moving to cart');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: { color: 'text-amber-500', bg: 'bg-amber-50', icon: FaClock },
      Processing: { color: 'text-blue-500', bg: 'bg-blue-50', icon: FaShoppingBag },
      Shipped: { color: 'text-indigo-500', bg: 'bg-indigo-50', icon: FaTruck },
      Delivered: { color: 'text-green-500', bg: 'bg-green-50', icon: FaCheckCircle },
      Cancelled: { color: 'text-red-500', bg: 'bg-red-50', icon: FaTimes }
    };

    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
        <Icon className="text-xs" />
        {status}
      </span>
    );
  };

  const getMembershipStatus = (points) => {
    if (points >= 500) return 'Gold Member';
    if (points >= 100) return 'Silver Member';
    return 'Bronze Member';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute w-[900px] h-[900px] bg-indigo-500/5 rounded-full -top-[400px] -right-[400px] blur-3xl animate-spin-slow pointer-events-none"></div>
      <div className="absolute w-[700px] h-[700px] bg-violet-500/5 rounded-full -bottom-[300px] -left-[300px] blur-3xl animate-spin-reverse-slow pointer-events-none"></div>

      {/* Hero Section */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl p-8 mb-8 flex flex-col md:flex-row justify-between items-center shadow-sm animate-fade-in-down">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 uppercase tracking-tight">
            Welcome Back, <span className="text-blue-600">{user?.name}</span>
          </h1>
          <p className="text-lg text-gray-500">Here's what's happening with your books today.</p>
        </div>
        <div className="text-6xl text-amber-400 animate-pulse">
          <HiSparkles />
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl backdrop-blur-sm">
                <FaUserCircle />
              </div>
              <h3 className="text-xl font-bold">{user?.name}</h3>
              <p className="text-blue-100 text-sm">{user?.email}</p>
            </div>
            <div className="p-4 space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  activeTab === 'overview' 
                    ? 'bg-blue-50 text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaChartLine /> Overview
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  activeTab === 'orders' 
                    ? 'bg-blue-50 text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaBox /> My Orders
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  activeTab === 'wishlist' 
                    ? 'bg-blue-50 text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaHeart /> Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                      <FaBookOpen className="text-xl" />
                    </div>
                    <span className="text-sm text-gray-400 font-medium">Total Orders</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.totalOrders}</h3>
                  <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
                    <FaChartLine /> View details
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-pink-100 text-pink-600 rounded-xl">
                      <FaHeart className="text-xl" />
                    </div>
                    <span className="text-sm text-gray-400 font-medium">Wishlist</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.wishlistCount}</h3>
                  <p className="text-sm text-gray-500 mt-2">Books saved</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                      <FaTrophy className="text-xl" />
                    </div>
                    <span className="text-sm text-gray-400 font-medium">Points</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.points}</h3>
                  <p className="text-sm text-amber-500 mt-2">{getMembershipStatus(stats.points)}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {stats.recentActivity.length > 0 ? (
                    stats.recentActivity.map((order) => (
                      <div key={order._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="p-3 bg-white rounded-full shadow-sm text-blue-500">
                          <FaBook />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Order #{order._id.slice(-6)} - {order.items.length} items
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="ml-auto font-bold text-blue-600">
                          ${order.totalAmount}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                  <FaBox className="mx-auto text-4xl text-gray-300 mb-4" />
                  <p className="text-gray-500">No orders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Order ID</p>
                          <p className="font-mono font-bold text-gray-900">#{order._id.slice(-6)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Date</p>
                          <div className="flex items-center gap-2 text-gray-900 font-medium">
                            <FaCalendarAlt className="text-gray-400" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Total</p>
                          <p className="font-bold text-blue-600">${order.totalAmount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Status</p>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                      <div className="p-6 bg-gray-50">
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                <span className="text-gray-700 font-medium">
                                  {item.book ? item.book.title : 'Book Unavailable'}
                                </span>
                                <span className="text-gray-400">x{item.quantity}</span>
                              </div>
                              <span className="text-gray-900 font-medium">${item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : wishlist.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                  <FaHeart className="mx-auto text-4xl text-gray-300 mb-4" />
                  <p className="text-gray-500">Your wishlist is empty</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlist.map((item) => {
                    if (!item.book) return null;
                    return (
                      <div key={item._id} className="bg-white rounded-2xl border border-gray-200 p-4 flex gap-4 hover:shadow-md transition-shadow group">
                        <div className="w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <img src={item.book.image} alt={item.book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{item.book.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">{item.book.author}</p>
                          <div className="flex items-center gap-1 text-amber-400 text-sm mb-auto">
                            <FaStar /> <span>{item.book.rating}</span>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <span className="font-bold text-blue-600">${item.book.price}</span>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => moveToCart(item.book._id)}
                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                title="Move to Cart"
                              >
                                <FaShoppingCart />
                              </button>
                              <button 
                                onClick={() => removeFromWishlist(item.book._id)}
                                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                title="Remove"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
