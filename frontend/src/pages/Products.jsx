import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import API_URL from '../config';
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Running', 'Basketball', 'Casual', 'Training', 'Lifestyle'];
  const brands = ['All', 'Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance'];

  const filteredProducts = products.filter(product => {
    if (filters.category && filters.category !== 'All' && product.category !== filters.category) return false;
    if (filters.brand && filters.brand !== 'All' && product.brand !== filters.brand) return false;
    if (filters.minPrice && product.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && product.price > Number(filters.maxPrice)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(filters.sort) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="container">
      <div className="products-header">
        <h1>All Products</h1>
        <p>Discover our collection of premium footwear</p>
      </div>

      <div className="products-layout">
        {/* Sidebar Filters */}
        <div className="filters-sidebar">
          <h3>Filters</h3>
          
          <div className="filter-section">
            <h4>Category</h4>
            {categories.map(cat => (
              <label key={cat} className="filter-option">
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={filters.category === (cat === 'All' ? '' : cat)}
                  onChange={(e) => setFilters({...filters, category: e.target.value === 'All' ? '' : e.target.value})}
                />
                {cat}
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h4>Brand</h4>
            {brands.map(brand => (
              <label key={brand} className="filter-option">
                <input
                  type="radio"
                  name="brand"
                  value={brand}
                  checked={filters.brand === (brand === 'All' ? '' : brand)}
                  onChange={(e) => setFilters({...filters, brand: e.target.value === 'All' ? '' : e.target.value})}
                />
                {brand}
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              />
            </div>
          </div>

          <button 
            className="btn btn-outline clear-filters"
            onClick={() => setFilters({
              category: '',
              brand: '',
              minPrice: '',
              maxPrice: '',
              sort: 'newest'
            })}
          >
            Clear Filters
          </button>
        </div>

        {/* Products Grid */}
        <div className="products-content">
          <div className="products-toolbar">
            <p>{sortedProducts.length} products found</p>
            <select 
              value={filters.sort}
              onChange={(e) => setFilters({...filters, sort: e.target.value})}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <div className="products-grid">
            {sortedProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="no-products">
              <h3>No products found</h3>
              <p>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;