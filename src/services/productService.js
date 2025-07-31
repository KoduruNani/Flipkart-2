const API_URL = 'https://fakestoreapi.com';

// Helper function for API calls with error handling
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return null; // For successful requests with no content
  } catch (error) {
    console.error(`API Request failed: ${error.message}`);
    throw new Error(`Failed to ${options.method || 'fetch'} data: ${error.message}`);
  }
};

// Get all products with optional limit
export const getProducts = async (limit = null) => {
  const endpoint = limit ? `/products?limit=${limit}` : '/products';
  return apiCall(endpoint);
};

// Get a single product by ID
export const getProductById = async (id) => {
  if (!id) throw new Error('Product ID is required');
  return apiCall(`/products/${id}`);
};

// Get all product categories
export const getProductCategories = async () => {
  return apiCall('/products/categories');
};

// Get products in a specific category
export const getProductsByCategory = async (category) => {
  if (!category) throw new Error('Category is required');
  return apiCall(`/products/category/${category}`);
};

// Create a new product
export const createProduct = async (productData) => {
  if (!productData) throw new Error('Product data is required');
  
  return apiCall('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

// Update a product
export const updateProduct = async (id, productData) => {
  if (!id) throw new Error('Product ID is required');
  if (!productData) throw new Error('Product data is required');

  return apiCall(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
};

// Delete a single product
export const deleteProduct = async (id) => {
  if (!id) throw new Error('Product ID is required');

  return apiCall(`/products/${id}`, {
    method: 'DELETE',
  });
};

// Batch delete products with rate limiting
export const batchDeleteProducts = async (productIds, options = {}) => {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    throw new Error('Product IDs array is required');
  }

  const {
    batchSize = 5,
    delayBetweenBatches = 1000,
    onProgress = null,
  } = options;

  const results = [];
  const batches = [];

  // Split into batches
  for (let i = 0; i < productIds.length; i += batchSize) {
    batches.push(productIds.slice(i, i + batchSize));
  }

  // Process each batch with delay
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const batchResults = await Promise.all(
      batch.map(id => deleteProduct(id).catch(error => ({ id, error })))
    );

    results.push(...batchResults);

    // Report progress if callback provided
    if (onProgress) {
      const progress = ((i + 1) / batches.length) * 100;
      onProgress(progress, results);
    }

    // Add delay between batches, except for the last batch
    if (i < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
  }

  return results;
};

// Search products by query
export const searchProducts = async (query) => {
  if (!query) throw new Error('Search query is required');
  
  const products = await getProducts();
  const searchTerms = query.toLowerCase().split(' ');
  
  return products.filter(product => {
    const searchText = `${product.title} ${product.description} ${product.category}`.toLowerCase();
    return searchTerms.every(term => searchText.includes(term));
  });
};
