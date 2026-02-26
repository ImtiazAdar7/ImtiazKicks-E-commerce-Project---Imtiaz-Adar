import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`);
      const products = response.data;
      
      // Group products by category
      const categoryMap = products.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = {
            name: product.category,
            count: 0,
            image: product.images[0],
            brands: new Set()
          };
        }
        acc[product.category].count++;
        acc[product.category].brands.add(product.brand);
        return acc;
      }, {});

      const categoryArray = Object.values(categoryMap).map(cat => ({
        ...cat,
        brands: Array.from(cat.brands)
      }));

      setCategories(categoryArray);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = {
    'Running': '🏃',
    'Basketball': '🏀',
    'Casual': '👟',
    'Training': '💪',
    'Lifestyle': '✨'
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="container">
      <div className="categories-header">
        <h1>Shop by Category</h1>
        <p>Browse our wide selection of footwear categories</p>
      </div>

      <div className="categories-grid">
        {categories.map(category => (
          <Link 
            to={`/products?category=${category.name}`} 
            key={category.name}
            className="category-card"
          >
            <div className="category-image">
              <img src={category.image} alt={category.name} />
              <div className="category-overlay">
                <span className="category-icon">{categoryIcons[category.name] || '👟'}</span>
              </div>
            </div>
            <div className="category-info">
              <h3>{category.name}</h3>
              <p>{category.count} Products</p>
              <div className="category-brands">
                {category.brands.slice(0, 3).map(brand => (
                  <span key={brand} className="brand-tag">{brand}</span>
                ))}
                {category.brands.length > 3 && <span className="brand-tag">+{category.brands.length - 3}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Featured Categories Section */}
      <div className="featured-section">
        <h2>Featured Collections</h2>
        <div className="featured-grid">
          <div className="featured-card large">
            <img src="https://images.unsplash.com/photo-1556906781-9a4129610a2c?w=500" alt="Running Collection" />
            <div className="featured-content">
              <h3>Running Collection</h3>
              <p>Performance shoes for every runner</p>
              <Link to="/products?category=Running" className="btn btn-primary">Shop Now</Link>
            </div>
          </div>
          <div className="featured-card">
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" alt="Casual Collection" />
            <div className="featured-content">
              <h3>Casual Styles</h3>
              <Link to="/products?category=Casual" className="btn btn-outline">Explore</Link>
            </div>
          </div>
          <div className="featured-card">
            <img src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500" alt="Basketball" />
            <div className="featured-content">
              <h3>Basketball</h3>
              <Link to="/products?category=Basketball" className="btn btn-outline">Explore</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;