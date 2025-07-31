const API_URL = 'https://fakestoreapi.com';

export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getProductCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/products/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteAllProducts = async () => {
  try {
    const products = await getProducts();
    for (const product of products) {
      await fetch(`${API_URL}/products/${product.id}`, {
        method: 'DELETE'
      });
    }
  } catch (error) {
    throw error;
  }
};
