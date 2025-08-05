import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getProducts, getProductCategories, createProduct, updateProduct, deleteProduct } from '../services/productService';
import { useCartWishlist } from '../components/CartWishlistContext';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [editingProduct, setEditingProduct] = useState(null);
  const [formState, setFormState] = useState({ title: '', price: '', description: '', category: '', image: '' });
  const [formError, setFormError] = useState('');

  const { addToCart, addToWishlist, cart, wishlist } = useCartWishlist();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getProductCategories()
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        return [...result].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...result].sort((a, b) => b.price - a.price);
      case 'name-asc':
        return [...result].sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return [...result].sort((a, b) => b.title.localeCompare(a.title));
      default:
        return result;
    }
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formState);
      } else {
        await createProduct(formState);
      }
      setFormState({ title: '', price: '', description: '', category: '', image: '' });
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      setFormError('Failed to save product.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormState({
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      fetchData();
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormState({ title: '', price: '', description: '', category: '', image: '' });
  };

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchData} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
          aria-label="Search products"
        />
        
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="category-select"
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={handleSortChange}
          className="sort-select"
          aria-label="Sort products"
        >
          <option value="default">Default Sort</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>
      <div className="crud-form-container component-container">
        <h2 className="title">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
        {formError && <div className="error-message">{formError}</div>}
        <form onSubmit={handleFormSubmit}>
          <input name="title" value={formState.title} onChange={handleFormChange} placeholder="Title" required />
          <input name="price" value={formState.price} onChange={handleFormChange} placeholder="Price" type="number" min="0" step="0.01" required />
          <input name="category" value={formState.category} onChange={handleFormChange} placeholder="Category" required />
          <input name="image" value={formState.image} onChange={handleFormChange} placeholder="Image URL" />
          <textarea name="description" value={formState.description} onChange={handleFormChange} placeholder="Description" required />
          <button type="submit" className="add-to-cart-btn">{editingProduct ? 'Update' : 'Create'}</button>
          {editingProduct && <button type="button" onClick={handleCancelEdit} className="add-to-wishlist-btn">Cancel</button>}
        </form>
      </div>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : filteredAndSortedProducts.length === 0 ? (
        <div className="no-results">
          <p>No products found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredAndSortedProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="product-image"
                  loading="lazy"
                />
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product)}
                >
                  {cart.find((item) => item.id === product.id) ? 'In Cart' : 'Add to Cart'}
                </button>
                <button 
                  className="add-to-wishlist-btn"
                  onClick={() => addToWishlist(product)}
                >
                  {wishlist.find((item) => item.id === product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
                <button onClick={() => handleEdit(product)} className="add-to-cart-btn">Edit</button>
                <button onClick={() => handleDelete(product.id)} className="add-to-wishlist-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
