import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_URL from '../config';
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      processing: '#f59e0b',
      confirmed: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order._id.slice(-8)}</h3>
                  <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="order-status" style={{ color: getStatusColor(order.orderStatus) }}>
                  {order.orderStatus.toUpperCase()}
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.product?.images?.[0]} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Size: {item.size} | Color: {item.color}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p className="item-price">৳{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="shipping-address">
                  <h4>Shipping Address:</h4>
                  <p>
                    {order.shippingAddress.street}, {order.shippingAddress.city},<br />
                    {order.shippingAddress.state} {order.shippingAddress.zipCode},<br />
                    {order.shippingAddress.country}
                  </p>
                </div>
                <div className="order-total">
                  <strong>Total: ৳{order.totalAmount}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;