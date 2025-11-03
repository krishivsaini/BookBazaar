import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  FaBookOpen, 
  FaShoppingCart, 
  FaStar, 
  FaUserCircle,
  FaEnvelope,
  FaCalendarAlt,
  FaCheckCircle
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
      </div>

      <div className="dashboard-content">
        <div className="info-card">
          <h2><FaUserCircle className="section-icon" /> Your Profile</h2>
          <div className="profile-info">
            <p>
              <FaUserCircle className="info-icon" />
              <strong>Name:</strong> {user?.name}
            </p>
            <p>
              <FaEnvelope className="info-icon" />
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <FaCalendarAlt className="info-icon" />
              <strong>Role:</strong> {user?.role}
            </p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><FaBookOpen /></div>
            <div className="stat-content">
              <h3>0</h3>
              <p>Books Listed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><FaShoppingCart /></div>
            <div className="stat-content">
              <h3>0</h3>
              <p>Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><FaStar /></div>
            <div className="stat-content">
              <h3>0</h3>
              <p>Reviews</p>
            </div>
          </div>
        </div>

        <div className="welcome-message">
          <h2><HiSparkles className="celebration-icon" /> Authentication System Active!</h2>
          <p>
            Congratulations! Your login and signup functionality is working perfectly.
            This is your protected dashboard that only authenticated users can access.
          </p>
          <div className="next-steps">
            <h3>Next Steps:</h3>
            <ul>
              <li><FaCheckCircle className="check-icon" /> Add book listing functionality</li>
              <li><FaCheckCircle className="check-icon" /> Implement search and filtering</li>
              <li><FaCheckCircle className="check-icon" /> Create shopping cart system</li>
              <li><FaCheckCircle className="check-icon" /> Add payment integration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
