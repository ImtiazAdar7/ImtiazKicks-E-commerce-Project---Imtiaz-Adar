/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_URL from '../config';
const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, token, updateBalance } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [buyNowItem, setBuyNowItem] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  // Check for buy now item on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isBuyNow = params.get('buyNow') === 'true';
    
    if (isBuyNow) {
      const storedItem = localStorage.getItem('buyNowItem');
      if (storedItem) {
        setBuyNowItem(JSON.parse(storedItem));
        // Clear the buy now item from storage after reading
        localStorage.removeItem('buyNowItem');
      }
    }
  }, [location]);

  // Determine which items to display
  const displayItems = buyNowItem ? [buyNowItem] : cartItems;
  
  // Calculate total based on display items
  const calculateTotal = () => {
    if (buyNowItem) {
      return buyNowItem.price * buyNowItem.quantity;
    }
    return getCartTotal();
  };

  const total = calculateTotal();
  const hasEnoughBalance = user && user.balance >= total;

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  // Validate all address fields are filled
  const isAddressValid = () => {
    return (
      shippingAddress.street.trim() !== '' &&
      shippingAddress.city.trim() !== '' &&
      shippingAddress.state.trim() !== '' &&
      shippingAddress.zipCode.trim() !== '' &&
      shippingAddress.country.trim() !== ''
    );
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault(); // Prevent form submission
    
    // Check if address is valid
    if (!isAddressValid()) {
      toast.error('Please fill in all shipping address fields');
      return;
    }

    if (!hasEnoughBalance) {
      navigate('/deposit');
      return;
    }

    setLoading(true);
    try {
      // Prepare order items
      const orderItems = displayItems.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        size: item.selectedSize,
        color: item.selectedColor,
        quantity: item.quantity
      }));

      const response = await axios.post(`${API_URL}/orders`, {
        items: orderItems,
        shippingAddress
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      updateBalance(response.data.newBalance);
      
      // Clear appropriate storage
      if (buyNowItem) {
        // Just clear the buy now flag
        setBuyNowItem(null);
        toast.success('Order placed successfully!');
      } else {
        clearCart();
        toast.success('Order placed successfully!');
      }
      
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // Show empty state based on context
  if (displayItems.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <h2>{buyNowItem ? 'No item selected' : 'Your cart is empty'}</h2>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Checkout</h1>
      {buyNowItem && (
        <div className="checkout-badge">
          <span className="badge">Direct Purchase</span>
        </div>
      )}
      
      <div className="checkout-container">
        <div className="order-summary">
          <h2>Order Summary {buyNowItem && '(1 item)'}</h2>
          {displayItems.map(item => (
            <div key={`${item._id}-${item.selectedSize}-${item.selectedColor}`} className="checkout-item">
              <img src={item.images[0]} alt={item.name} className="checkout-item-image" />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-variant">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                <p className="item-quantity">Quantity: {item.quantity}</p>
                <p className="item-price">৳{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
          
          <div className="total-section">
            <h3>Total: ৳{total}</h3>
          </div>

          <div className="balance-info">
            <p>Your Balance: <strong>৳{user?.balance}</strong></p>
            {!hasEnoughBalance && (
              <p className="insufficient-balance">
                ⚠️ Insufficient balance. Please deposit ৳{total - user?.balance} more.
              </p>
            )}
          </div>
        </div>

        <div className="payment-section">
          <h2>Shipping Address</h2>
          
          <form onSubmit={handlePlaceOrder}>
            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                name="street"
                value={shippingAddress.street}
                onChange={handleInputChange}
                placeholder="Enter street address"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  required
                />
              </div>

              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ZIP Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={handleInputChange}
                  placeholder="Enter ZIP code"
                  required
                />
              </div>

              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                  placeholder="Enter country"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '20px' }}
            >
              {loading ? 'Processing...' : hasEnoughBalance ? 'Place Order' : 'Go to Deposit'}
            </button>
          </form>

          {buyNowItem && (
            <div className="checkout-note">
              <p>🛍️ This is a direct purchase. Only this item will be ordered.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;