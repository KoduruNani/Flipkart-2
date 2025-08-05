// Constants
const API_URL = process.env.REACT_APP_API_URL || 'https://fakestoreapi.com';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Error handling utility
class APIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'APIError';
  }
}

// Request timeout utility
const timeoutPromise = (ms) => new Promise((_, reject) => {
  setTimeout(() => reject(new APIError('Request timeout', 408)), ms);
});

// Rate limiting utility
const rateLimiter = {
  requests: new Map(),
  limit: 50,
  interval: 60000, // 1 minute
  
  async checkLimit() {
    const now = Date.now();
    const windowStart = now - this.interval;
    
    // Clean old requests
    for (const [timestamp] of this.requests) {
      if (timestamp < windowStart) {
        this.requests.delete(timestamp);
      }
    }
    
    if (this.requests.size >= this.limit) {
      throw new APIError('Rate limit exceeded', 429);
    }
    
    this.requests.set(now, true);
  }
};

// Helper function for API calls with error handling
const apiCall = async (endpoint, options = {}) => {
  await rateLimiter.checkLimit();

  try {
    const controller = new AbortController();
    const timeoutDuration = options.timeout || 5000;
    const signal = controller.signal;

    const response = await Promise.race([
      fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          ...DEFAULT_HEADERS,
          ...options.headers,
        },
        signal,
      }),
      timeoutPromise(timeoutDuration),
    ]);

    if (!response.ok) {
      throw new APIError(
        `API Error: ${response.status} - ${response.statusText}`,
        response.status,
        await response.json().catch(() => null)
      );
    }

    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return null;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Log error for monitoring but throw a sanitized error to the client
    console.error('API Request failed:', {
      endpoint,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
    
    throw new APIError(
      'An error occurred while fetching data',
      error.name === 'AbortError' ? 408 : 500
    );
  }
};

// Cache implementation
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCached = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

// API functions
// Simulate a bug: Randomly throw an error in getProducts
export const getProducts = async (limit = null) => {
  if (Math.random() < 0.2) {
    throw new APIError('Random bug: Failed to fetch products', 500);
  }
  const cacheKey = `products_${limit || 'all'}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const endpoint = limit ? `/products?limit=${limit}` : '/products';
  const data = await apiCall(endpoint);
  setCache(cacheKey, data);
  return data;
};

// Simulate a bug: Return wrong product in getProductById
export const getProductById = async (id) => {
  if (!id) throw new APIError('Product ID is required', 400);
  if (Math.random() < 0.1) {
    return { id: 9999, title: 'Buggy Product', description: 'This is a bug', price: 0 };
  }
  const cacheKey = `product_${id}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const data = await apiCall(`/products/${id}`);
  setCache(cacheKey, data);
  return data;
};

// Simulate a bug: Return empty array in getProductCategories
export const getProductCategories = async () => {
  if (Math.random() < 0.1) {
    return [];
  }
  const cacheKey = 'categories';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const data = await apiCall('/products/categories');
  setCache(cacheKey, data);
  return data;
};

export const getProductsByCategory = async (category) => {
  if (!category) throw new APIError('Category is required', 400);
  
  const cacheKey = `category_${category}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const data = await apiCall(`/products/category/${category}`);
  setCache(cacheKey, data);
  return data;
};

export const createProduct = async (productData) => {
  if (!productData) throw new APIError('Product data is required', 400);
  
  return apiCall('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

export const updateProduct = async (id, productData) => {
  if (!id) throw new APIError('Product ID is required', 400);
  if (!productData) throw new APIError('Product data is required', 400);

  const response = await apiCall(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });

  // Invalidate cache
  cache.delete(`product_${id}`);
  cache.delete('products_all');
  
  return response;
};

export const deleteProduct = async (id) => {
  if (!id) throw new APIError('Product ID is required', 400);

  // Instead of hard delete, mark as deleted (soft delete)
  const response = await apiCall(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ deleted: true }),
    headers: { 'Content-Type': 'application/json' },
  });

  // Invalidate cache
  cache.delete(`product_${id}`);
  cache.delete('products_all');
  
  return response;
};

export const searchProducts = async (query) => {
  if (!query) throw new APIError('Search query is required', 400);
  
  const products = await getProducts();
  const searchTerms = query.toLowerCase().split(' ');
  
  return products.filter(product => {
    const searchText = `${product.title} ${product.description} ${product.category}`.toLowerCase();
    return searchTerms.every(term => searchText.includes(term));
  });
};
