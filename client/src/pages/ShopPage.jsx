import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Components/Customer/Sidebar';
import ProductModal from '../Components/ProductModal';
import './ShopPage.css';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState({
    size: [],
    material: [],
    color: [],
    priceRange: []
  });

  const productTypes = ["All Products", "Tshirts", "Shirts", "Kurtas", "Formals", "Jeans", "Hoodies", "Sarees", "Nightwear"];

  // Fetch products from API
  const fetchProducts = async (pageNo = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/customers/products/${pageNo}`);

      if (response.data && response.data.products) {
        // Map backend fields to frontend expected fields
        const mappedProducts = response.data.products.map(p => ({
          id: p.id,
          name: p.product_name,
          price: p.sales_price,
          category: p.product_category || 'Tshirts',
          image: p.image_1,
          colors: p.colors ? (typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors) : ['White'],
          sizes: p.size ? (typeof p.size === 'string' ? JSON.parse(p.size) : p.size) : ['M', 'L'],
          material: p.material || 'Cotton'
        }));

        setProducts(mappedProducts);
        // Calculate total pages based on assumption of 20 per page
        setTotalPages(Math.ceil(response.data.totalProducts / 20) || 5);
        setCurrentPage(pageNo);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleFiltersChange = (newFilters) => {
    setAppliedFilters(newFilters);
  };

  const handleQuickAddToCart = async (e, product) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Please login to add items to cart');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/customers/cart/add',
        {
          productId: product.id,
          quantity: 1,
          color: product.colors[0],
          price: product.price,
          product_name: product.name,
          image: product.image
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        // Store product info for cart display
        const cartMeta = JSON.parse(localStorage.getItem('cartMeta') || '{}');
        cartMeta[product.id] = {
          name: product.name,
          image: product.image
        };
        localStorage.setItem('cartMeta', JSON.stringify(cartMeta));

        alert('Product added to cart!');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      if (error.response?.status === 401) {
        alert('Please login to add items to cart');
      } else {
        alert('Failed to add product to cart');
      }
    }
  };

  const getPriceRangeFilter = (price, ranges) => {
    if (ranges.length === 0) return true;

    return ranges.some(range => {
      if (range === "Under $25") return price < 25;
      if (range === "$25-$50") return price >= 25 && price <= 50;
      if (range === "$50-$100") return price >= 50 && price <= 100;
      if (range === "$100-$200") return price >= 100 && price <= 200;
      if (range === "Above $200") return price > 200;
      return true;
    });
  };

  const filteredProducts = products
    .filter(p => activeCategory === 'All Products' || p.category === activeCategory)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(p => {
      // Size filter
      if (appliedFilters.size.length > 0) {
        const hasMatchingSize = p.sizes?.some(size => appliedFilters.size.includes(size));
        if (!hasMatchingSize) return false;
      }

      // Material filter
      if (appliedFilters.material.length > 0) {
        const matches = appliedFilters.material.includes(p.material);
        if (!matches) return false;
      }

      // Color filter
      if (appliedFilters.color.length > 0) {
        const hasMatchingColor = p.colors?.some(color =>
          appliedFilters.color.some(filterColor =>
            color.toLowerCase() === filterColor.toLowerCase()
          )
        );
        if (!hasMatchingColor) return false;
      }

      // Price range filter
      if (appliedFilters.priceRange.length > 0) {
        const matches = getPriceRangeFilter(p.price, appliedFilters.priceRange);
        if (!matches) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="shop-page">
      <div className="shop-layout">
        <Sidebar onFiltersChange={handleFiltersChange} appliedFilters={appliedFilters} />

        <div className="shop-container">
          {/* Header */}
          <div className="shop-header">
            <div className="breadcrumb">
              <span> </span>
              <span className='mt-3'>All Products</span>
              {activeCategory !== 'All Products' && (
                <>
                  <span className="separator">/</span>
                  <span className="active">{activeCategory}</span>
                </>
              )}
            </div>
            <h1 className="shop-title">Discover Your Style</h1>
          </div>

          {/* Filters Bar */}
          <div className="filters-section">
            <div className="category-filters">
              {productTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveCategory(type)}
                  className={`category-btn ${activeCategory === type ? 'active' : ''}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Sort */}
          <div className="controls-bar">
            <div className="search-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="products-section">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading amazing products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="empty-state">
                <p>No products found</p>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="product-card"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                      <div className="product-overlay">
                        <button className="quick-view-btn">Quick View</button>
                        <button
                          className="add-to-cart-btn"
                          onClick={(e) => handleQuickAddToCart(e, product)}
                        >
                          Add to Cart
                        </button>
                      </div>
                      <span className="product-badge">New</span>
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-colors">
                        {product.colors.map((color, i) => (
                          <span
                            key={i}
                            className="color-dot"
                            style={{ background: color }}
                          />
                        ))}
                      </div>
                      <div className="product-footer">
                        <span className="product-price">${product.price}</span>
                        <button className="wishlist-btn">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Previous
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ShopPage;
