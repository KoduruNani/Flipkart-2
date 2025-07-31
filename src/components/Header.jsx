import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

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

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__left">
          <Link to="/" className="header__logo-link">
            <div className="header__logo-wrapper">
              <img 
                src="https://static-assets-web.flixcart.com/fk-p-linx/fk-cp-zion/img/flipkart-plus_8d85f4.png" 
                alt="Flipkart" 
                className="header__logo-img" 
              />
              <div className="header__branding">
                <span className="header__title">Flipkart <span className="header__lite">Lite</span></span>
                <span className="header__explore">
                  Explore <span className="header__plus">Plus</span>
                  <img 
                    src="https://static-assets-web.flixcart.com/fk-p-linx/fk-cp-zion/img/plus_aef861.png" 
                    className="header__plus-icon"
                    alt="Flipkart Plus Icon"
                  />
                </span>
              </div>
            </div>
          </Link>
          <nav className="header__nav">
            <Link to="/products" className="header__nav-link">Products</Link>
          </nav>
        </div>

        <div className="header__search">
          <div className="header__search-container">
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
                onClick={handleSearch}
                disabled={isSearching}
                aria-label="Search"
                type="submit"
              >
                <svg width="20" height="20" viewBox="0 0 17 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <g fill="#2874F1" fillRule="evenodd">
                    <path d="m11.618 9.897l4.225 4.212c.092.092.101.232.02.313l-1.465 1.46c-.081.081-.221.072-.314-.020l-4.216-4.203" />
                    <path d="m6.486 10.901c-2.42 0-4.381-1.956-4.381-4.368 0-2.413 1.961-4.369 4.381-4.369 2.42 0 4.381 1.956 4.381 4.369 0 2.413-1.961 4.368-4.381 4.368m0-10.835c-3.582 0-6.486 2.895-6.486 6.467 0 3.572 2.904 6.467 6.486 6.467 3.582 0 6.486-2.895 6.486-6.467 0-3.572-2.904-6.467-6.486-6.467" />
                  </g>
                </svg>
              </button>
            </form>
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
