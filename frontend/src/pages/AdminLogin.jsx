import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiLock, FiMail, FiShield } from 'react-icons/fi';
import axios from 'axios';
import API_URL from '../config';
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Admin login attempt for:', email);
      console.log('Password length:', password.length);
      
      const response = await axios.post(`${API_URL}/auth/admin/login`, {
        email: email.trim(),
        password: password
      });
      
      console.log('Admin login successful! Response:', response.data);
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      toast.success(`Welcome Admin, ${user.name}!`);
      navigate('/admin');
      
    } catch (error) {
      console.error('Admin login error - Full error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        toast.error('Invalid email or password');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Admin only.');
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Is backend running?');
      } else {
        toast.error(error.response?.data?.message || 'Admin login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-icon">
          <FiShield />
        </div>
        <h2>Admin Login</h2>
        <p>Secure administrator access only</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FiMail /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FiLock /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary admin-login-btn" 
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Access Admin Panel'}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link to="/login">Regular User Login</Link>
          <span> | </span>
          <Link to="/">Back to Store</Link>
        </div>

        <div className="admin-demo">
          <p>Demo Admin:</p>
          <code>admin.imtiaz@gmail.com</code>
          <code>imtiazadar1234</code>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;