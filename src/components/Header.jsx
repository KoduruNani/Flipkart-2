import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchProducts } from '../services/productService';
import { FLIPKART_LOGO_URL, FLIPKART_PLUS_ICON_URL } from '../config';
import './Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    // Close search results when clicking outside
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery || isSearching) return;

    try {
      setIsSearching(true);
      const results = await searchProducts(trimmedQuery);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__left">
          <Link to="/" className="header__logo-link">
            <div className="header__logo-wrapper">
              <img 
                src={FLIPKART_LOGO_URL}
                alt="Flipkart" 
                className="header__logo-img" 
              />
              <div className="header__branding">
                <span className="header__title">Flipkart <span className="header__lite">Lite</span></span>
                <span className="header__explore">
                  Explore <span className="header__plus">Plus</span>
                  <img 
                    src={FLIPKART_PLUS_ICON_URL}
                    className="header__plus-icon"
                    alt="Flipkart Plus Icon"
                  />
                </span>
              </div>
            </div>
          </Link>
          <nav className="header__nav">
            <Link to="/products" className="header__nav-link">Products</Link>
            <Link to="/cart" className="header__nav-link">Cart</Link>
            <Link to="/wishlist" className="header__nav-link">Wishlist</Link>
          </nav>
        </div>

        <div className="header__search">
          <div className="header__search-container" ref={resultsRef}>
            <form onSubmit={handleSearch} role="search">
              <input 
                type="search" 
                placeholder="Search for products, brands and more" 
                className="header__search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
                disabled={isSearching}
              />
              <button 
                className="header__search-button"
                type="submit"
                disabled={isSearching}
                aria-label="Search"
              >
                <svg width="20" height="20" viewBox="0 0 17 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <g fill="#2874F1" fillRule="evenodd">
                    <path d="m11.618 9.897l4.225 4.212c.092.092.101.232.02.313l-1.465 1.46c-.081.081-.221.072-.314-.020l-4.216-4.203" />
                    <path d="m6.486 10.901c-2.42 0-4.381-1.956-4.381-4.368 0-2.413 1.961-4.369 4.381-4.369 2.42 0 4.381 1.956 4.381 4.369 0 2.413-1.961 4.368-4.381 4.368m0-10.835c-3.582 0-6.486 2.895-6.486 6.467 0 3.572 2.904 6.467 6.486 6.467 3.582 0 6.486-2.895 6.486-6.467 0-3.572-2.904-6.467-6.486-6.467" />
                  </g>
                </svg>
              </button>
            </form>
            {showResults && (
              <div className="header__search-results">
                {isSearching ? (
                  <div className="header__search-loading">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="header__search-result-item"
                      onClick={() => setShowResults(false)}
                    >
                      <img src={product.image} alt={product.title} className="header__search-result-image" />
                      <div className="header__search-result-info">
                        <h4>{product.title}</h4>
                        <p>${product.price}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="header__search-no-results">No products found</div>
                )}
              </div>
            )}
          </div>
        </div>

        <nav className="header__nav" aria-label="Main navigation">
          <Link to="/login" className="header__nav-link">Login</Link>
          <Link to="/register" className="header__nav-link">Register</Link>
          <Link to="/cart" className="header__nav-link">Cart</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
