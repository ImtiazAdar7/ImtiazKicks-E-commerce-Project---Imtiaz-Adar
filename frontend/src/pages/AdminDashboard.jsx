import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUsers, FiShoppingBag, FiDollarSign, FiPackage } from 'react-icons/fi';
import API_URL from '../config';
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  const AccessDenied = () => (
    <div className="container">
      <div className="access-denied">
        <h2>⛔ Access Denied</h2>
        <p>You don't have permission to view this page.</p>
        <p>This area is restricted to administrators only.</p>
        <button 
          className="btn btn-primary" 
          onClick={() => window.location.href = '/'}
        >
          Return to Home
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [usersRes, ordersRes] = await Promise.all([
        axios.get(`${API_URL}/users/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/users/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setUsers(usersRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const updateUserBalance = async (userId, newBalance) => {
    try {
      await axios.put(
        `${API_URL}/users/admin/users/${userId}/balance`,
        { balance: newBalance },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Balance updated');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Failed to update balance');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(
        `${API_URL}/users/admin/orders/${orderId}`,
        { orderStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Order status updated');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  // Check if user is admin - using role instead of isAdmin
  if (!user || user?.role !== 'admin') {
    return <AccessDenied />;
  }

  if (loading) {
    return <div className="spinner"></div>;
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalProducts = orders.reduce((sum, order) => 
    sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user.name} 👑</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <FiUsers className="stat-icon" />
          <div>
            <h3>Total Users</h3>
            <p className="stat-number">{users.length}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <FiShoppingBag className="stat-icon" />
          <div>
            <h3>Total Orders</h3>
            <p className="stat-number">{orders.length}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <FiDollarSign className="stat-icon" />
          <div>
            <h3>Total Revenue</h3>
            <p className="stat-number">৳{totalRevenue}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <FiPackage className="stat-icon" />
          <div>
            <h3>Products Sold</h3>
            <p className="stat-number">{totalProducts}</p>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users Management
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Orders Management
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="users-table">
          <h2>Users</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Balance</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>৳{u.balance}</td>
                  <td>
                    <span className={`role-badge ${u.role}`}>
                      {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {/* Only show Adjust Balance button for regular users, not for admin */}
                    {u.role !== 'admin' ? (
                      <button 
                        className="btn btn-small"
                        onClick={() => {
                          const newBalance = prompt('Enter new balance:', u.balance);
                          if (newBalance) updateUserBalance(u._id, Number(newBalance));
                        }}
                      >
                        Adjust Balance
                      </button>
                    ) : (
                      <span className="no-action">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="orders-table">
          <h2>Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-8)}</td>
                  <td>{order.user?.name || 'N/A'}</td>
                  <td>৳{order.totalAmount}</td>
                  <td>
                    <span className={`status-badge ${order.orderStatus}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select 
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="processing">Processing</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;