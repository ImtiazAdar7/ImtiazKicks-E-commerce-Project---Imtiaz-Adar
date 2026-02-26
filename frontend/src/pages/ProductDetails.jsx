/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import API_URL from '../config';
const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      setProduct(response.data);
      setMainImage(response.data.images[0]);
      if (response.data.sizes.length > 0) {
        setSelectedSize(response.data.sizes[0].size);
      }
      if (response.data.colors.length > 0) {
        setSelectedColor(response.data.colors[0].name);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const validateSelection = () => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return false;
    }

    if (!selectedSize) {
      toast.error('Please select a size');
      return false;
    }

    if (!selectedColor) {
      toast.error('Please select a color');
      return false;
    }

    const sizeObj = product.sizes.find(s => s.size === selectedSize);
    if (!sizeObj || sizeObj.quantity === 0) {
      toast.error('Selected size is out of stock');
      return false;
    }

    return true;
  };

  const handleAddToCart = () => {
    if (!validateSelection()) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;

    // Create a single-item cart in localStorage for checkout
    const buyNowItem = {
      ...product,
      selectedSize,
      selectedColor,
      quantity,
      buyNow: true // Flag to indicate this is a direct purchase
    };
    
    // Store in localStorage for checkout
    localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
    
    // Navigate to checkout
    navigate('/checkout?buyNow=true');
  };

  const getStockStatus = () => {
    const sizeObj = product.sizes.find(s => s.size === selectedSize);
    if (!sizeObj) return 0;
    return sizeObj.quantity;
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container">
      <div className="product-details">
        <div className="product-gallery">
          <img src={mainImage} alt={product.name} className="main-image" />
          <div className="thumbnail-grid">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} ${index + 1}`}
                className={`thumbnail ${mainImage === img ? 'active' : ''}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="brand">{product.brand}</p>
          <p className="category">{product.category}</p>
          
          <div className="rating">
            <span className="stars">{'★'.repeat(Math.floor(product.rating))}</span>
            <span className="rating-value">{product.rating}</span>
            <span className="reviews">({product.numReviews} reviews)</span>
          </div>

          <p className="price">৳{product.price}</p>
          <p className="description">{product.description}</p>

          {/* Size Selection */}
          <div className="size-section">
            <h3>Select Size</h3>
            <div className="size-options">
              {product.sizes.map((size) => (
                <button
                  key={size.size}
                  className={`size-btn ${selectedSize === size.size ? 'selected' : ''} ${size.quantity === 0 ? 'out-of-stock' : ''}`}
                  onClick={() => setSelectedSize(size.size)}
                  disabled={size.quantity === 0}
                >
                  {size.size}
                  {size.quantity === 0 && <span className="stock-badge">Out of Stock</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="color-section">
            <h3>Select Color</h3>
            <div className="color-options">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  className={`color-btn ${selectedColor === color.name ? 'selected' : ''}`}
                  style={{ backgroundColor: color.hexCode }}
                  onClick={() => setSelectedColor(color.name)}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="quantity-section">
            <h3>Quantity</h3>
            <div className="quantity-controls">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="quantity-btn"
              >
                -
              </button>
              <span className="quantity-value">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="quantity-btn"
                disabled={quantity >= getStockStatus()}
              >
                +
              </button>
            </div>
            {selectedSize && (
              <p className="stock-info">{getStockStatus()} items available</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="btn btn-primary add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor || getStockStatus() === 0}
            >
              Add to Cart
            </button>
            <button 
              className="btn btn-success buy-now-btn"
              onClick={handleBuyNow}
              disabled={!selectedSize || !selectedColor || getStockStatus() === 0}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;