import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import API_URL from '../config';
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: ''
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
  const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance'];

  const filteredProducts = products.filter(product => {
    if (filters.category && filters.category !== 'All' && product.category !== filters.category) return false;
    if (filters.brand && product.brand !== filters.brand) return false;
    if (filters.minPrice && product.price < filters.minPrice) return false;
    if (filters.maxPrice && product.price > filters.maxPrice) return false;
    return true;
  });

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="container">
      {/* Hero Section */}
      <section style={{ 
        textAlign: 'center', 
        padding: '60px 20px',
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
        color: 'white',
        borderRadius: '10px',
        margin: '20px 0'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Welcome to ImtiazKicks</h1>
        <p style={{ fontSize: '18px' }}>Discover the latest collection of premium footwear</p>
      </section>

      {/* Filters */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '10px',
        margin: '20px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <select 
            value={filters.category} 
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="form-control"
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>
            ))}
          </select>

          <select 
            value={filters.brand} 
            onChange={(e) => setFilters({...filters, brand: e.target.value})}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          <input 
            type="number" 
            placeholder="Min Price (৳)"
            value={filters.minPrice}
            onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />

          <input 
            type="number" 
            placeholder="Max Price (৳)"
            value={filters.maxPrice}
            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>No products found</h3>
        </div>
      )}
    </div>
  );
};

export default Home;