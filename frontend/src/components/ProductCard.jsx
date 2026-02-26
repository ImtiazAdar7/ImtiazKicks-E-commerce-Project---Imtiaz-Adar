import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    // Default to first size and color if available
    const defaultSize = product.sizes[0]?.size || 7;
    const defaultColor = product.colors[0]?.name || 'Default';
    
    addToCart(product, defaultSize, defaultColor, 1);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="product-image"
        />
      </Link>
      
      <div className="product-info">
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        
        <p className="product-brand">{product.brand}</p>
        <p className="product-price">৳{product.price}</p>
        
        <span className="product-category">{product.category}</span>
        
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;