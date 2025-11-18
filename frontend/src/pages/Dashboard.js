import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  FaBookOpen, 
  FaShoppingCart, 
  FaStar, 
  FaUserCircle,
  FaEnvelope,
  FaCalendarAlt,
  FaHeart,
  FaTrophy,
  FaChartLine,
  FaBook,
  FaShoppingBag,
  FaClock
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const stats = [
    { icon: FaBookOpen, value: '0', label: 'Books Listed', color: '#6366f1', bgColor: 'rgba(99, 102, 241, 0.1)' },
    { icon: FaShoppingCart, value: '0', label: 'Total Orders', color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)' },
    { icon: FaHeart, value: '0', label: 'Wishlist Items', color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.1)' },
    { icon: FaStar, value: '0', label: 'Reviews Given', color: '#fbbf24', bgColor: 'rgba(251, 191, 36, 0.1)' },
  ];

  const recentActivity = [
    { icon: FaBook, text: 'Browse our collection of books', time: 'Start exploring', color: '#6366f1' },
    { icon: FaShoppingBag, text: 'Add books to your cart', time: 'Shop now', color: '#8b5cf6' },
    { icon: FaHeart, text: 'Create your wishlist', time: 'Save favorites', color: '#ec4899' },
  ];

  const quickActions = [
    { icon: FaBookOpen, label: 'Browse Books', color: '#6366f1' },
    { icon: FaShoppingCart, label: 'My Orders', color: '#8b5cf6' },
    { icon: FaHeart, label: 'Wishlist', color: '#ec4899' },
    { icon: FaTrophy, label: 'Achievements', color: '#fbbf24' },
  ];

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Your personalized BookBazaar dashboard</p>
        </div>
        <div className="hero-illustration">
          <HiSparkles className="sparkle-icon" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-container">
        <h2 className="section-title">
          <FaChartLine className="title-icon" />
          Your Stats
        </h2>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card" style={{ '--stat-color': stat.color, '--stat-bg': stat.bgColor }}>
              <div className="stat-icon-wrapper">
                <stat.icon className="stat-icon" />
              </div>
              <div className="stat-details">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Profile Card */}
        <div className="info-card profile-card">
          <div className="card-header">
            <h2>
              <FaUserCircle className="header-icon" />
              Profile Information
            </h2>
          </div>
          <div className="profile-content">
            <div className="profile-avatar">
              <FaUserCircle className="avatar-icon" />
            </div>
            <div className="profile-details">
              <div className="detail-item">
                <FaUserCircle className="detail-icon" />
                <div className="detail-text">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{user?.name}</span>
                </div>
              </div>
              <div className="detail-item">
                <FaEnvelope className="detail-icon" />
                <div className="detail-text">
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">{user?.email}</span>
                </div>
              </div>
              <div className="detail-item">
                <FaCalendarAlt className="detail-icon" />
                <div className="detail-text">
                  <span className="detail-label">Account Type</span>
                  <span className="detail-value">{user?.role || 'Reader'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="info-card activity-card">
          <div className="card-header">
            <h2>
              <FaClock className="header-icon" />
              Quick Actions
            </h2>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon" style={{ backgroundColor: `${activity.color}20`, color: activity.color }}>
                  <activity.icon />
                </div>
                <div className="activity-content">
                  <p className="activity-text">{activity.text}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      {/* <div className="welcome-card">
        <div className="welcome-header">
          <HiSparkles className="celebration-icon" />
          <h2>Authentication System Active!</h2>
        </div>
        <p className="welcome-text">
          Congratulations! Your login and signup functionality is working perfectly.
          This is your protected dashboard that only authenticated users can access.
        </p>
        <div className="next-steps-container">
          <h3 className="steps-title">Next Steps in Your Journey:</h3>
          <div className="steps-grid">
            <div className="step-item">
              <FaCheckCircle className="step-icon" />
              <span>Add book listing functionality</span>
            </div>
            <div className="step-item">
              <FaCheckCircle className="step-icon" />
              <span>Implement search and filtering</span>
            </div>
            <div className="step-item">
              <FaCheckCircle className="step-icon" />
              <span>Create shopping cart system</span>
            </div>
            <div className="step-item">
              <FaCheckCircle className="step-icon" />
              <span>Add payment integration</span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Quick Action Buttons */}
      <div className="quick-actions">
        <h2 className="section-title">
          <FaTrophy className="title-icon" />
          Quick Actions
        </h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <button key={index} className="action-button" style={{ '--action-color': action.color }}>
              <action.icon className="action-icon" />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
