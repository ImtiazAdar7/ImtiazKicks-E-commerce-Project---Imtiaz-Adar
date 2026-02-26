import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiDollarSign, FiCalendar, FiEdit2, FiSave, FiX, FiShoppingBag, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import API_URL from '../config';
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const Profile = () => {
  const { user, token, updateBalance } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    recentOrders: []
  });
  const [fetchingStats, setFetchingStats] = useState(true);

  // Check if user is regular user (not admin)
  const isRegularUser = user?.role !== 'admin';

  useEffect(() => {
    // Only fetch stats for regular users
    if (user && isRegularUser) {
      fetchUserStats();
    } else {
      setFetchingStats(false);
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setFetchingStats(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.put(
        `${API_URL}/users/profile`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update user in context
      updateBalance(response.data.balance);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h1>My Profile</h1>
        {user.role === 'admin' && (
          <div className="admin-badge-header">
            <span>👑 Administrator</span>
          </div>
        )}
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-card-header">
            <h2>Personal Information</h2>
            {!isEditing ? (
              <button 
                className="btn btn-outline"
                onClick={() => setIsEditing(true)}
              >
                <FiEdit2 /> Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button 
                  className="btn btn-outline"
                  onClick={() => {
                    setIsEditing(false);
                    setName(user.name);
                  }}
                >
                  <FiX /> Cancel
                </button>
              </div>
            )}
          </div>

          {!isEditing ? (
            <div className="profile-info">
              <div className="info-row">
                <FiUser className="info-icon" />
                <div>
                  <label>Full Name</label>
                  <p>{user.name}</p>
                </div>
              </div>
              
              <div className="info-row">
                <FiMail className="info-icon" />
                <div>
                  <label>Email Address</label>
                  <p>{user.email}</p>
                </div>
              </div>
              
              {/* Only show balance for regular users, not admin */}
              {isRegularUser && (
                <div className="info-row">
                  <FiDollarSign className="info-icon" />
                  <div>
                    <label>Current Balance</label>
                    <p className="balance">৳{user.balance}</p>
                  </div>
                </div>
              )}
              
              <div className="info-row">
                <FiCalendar className="info-icon" />
                <div>
                  <label>Member Since</label>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {user.role === 'admin' && (
                <div className="admin-quick-link">
                  <p>Go to <Link to="/admin">Admin Dashboard</Link> to manage users and orders.</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="profile-edit-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email (cannot be changed)</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="disabled-input"
                />
              </div>

              {/* Only show balance field for regular users in edit mode */}
              {isRegularUser && (
                <div className="form-group">
                  <label>Current Balance</label>
                  <input
                    type="text"
                    value={`৳${user.balance}`}
                    disabled
                    className="disabled-input"
                  />
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}
        </div>

        {/* Stats Cards - Only show for regular users */}
        {isRegularUser ? (
          <>
            <div className="profile-stats">
              <div className="stat-card">
                <FiShoppingBag className="stat-icon" />
                <div>
                  <h3>Total Orders</h3>
                  <p className="stat-number">{stats.totalOrders}</p>
                  {fetchingStats && <small>Loading...</small>}
                </div>
              </div>
              
              <div className="stat-card">
                <FiTrendingUp className="stat-icon" />
                <div>
                  <h3>Total Spent</h3>
                  <p className="stat-number">৳{stats.totalSpent}</p>
                  {fetchingStats && <small>Loading...</small>}
                </div>
              </div>
              
              <div className="stat-card">
                <FiCalendar className="stat-icon" />
                <div>
                  <h3>Member Since</h3>
                  <p className="stat-number">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Orders Section - Only for regular users with orders */}
            {stats.recentOrders && stats.recentOrders.length > 0 && (
              <div className="recent-orders-card">
                <h3>Recent Orders</h3>
                <div className="recent-orders-list">
                  {stats.recentOrders.map(order => (
                    <div key={order._id} className="recent-order-item">
                      <div className="order-info">
                        <span className="order-id">Order #{order._id.slice(-8)}</span>
                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="order-amount">
                        ৳{order.totalAmount}
                      </div>
                      <div className={`order-status ${order.orderStatus}`}>
                        {order.orderStatus}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* For Admin - Show a simple stat card with just the member since date */
          <div className="profile-stats">
            <div className="stat-card">
              <FiCalendar className="stat-icon" />
              <div>
                <h3>Member Since</h3>
                <p className="stat-number">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;