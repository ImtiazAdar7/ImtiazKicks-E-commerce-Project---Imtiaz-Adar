import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiX, FiShoppingCart } from 'react-icons/fi';

const CartSidebar = () => {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity,
    getCartTotal,
    getCartCount
  } = useCart();
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>
            <FiShoppingCart /> Your Cart ({getCartCount()})
          </h2>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>
            <FiX />
          </button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <button 
                className="btn btn-primary"
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item._id}-${item.selectedSize}-${item.selectedColor}`} className="cart-item">
                <img src={item.images[0]} alt={item.name} className="cart-item-image" />
                
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p className="item-variant">
                    Size: {item.selectedSize} | Color: {item.selectedColor}
                  </p>
                  <p className="item-price">৳{item.price}</p>
                  
                  <div className="cart-item-quantity">
                    <button 
                      onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item._id, item.selectedSize, item.selectedColor)}
                >
                  <FiX />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Subtotal:</span>
              <span>৳{getCartTotal()}</span>
            </div>
            
            {user && (
              <div className="cart-balance">
                <span>Your Balance:</span>
                <span>৳{user.balance}</span>
              </div>
            )}

            <button 
              className="btn btn-primary checkout-btn"
              onClick={handleCheckout}
            >
              {user ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;