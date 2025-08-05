// API Service - Fixed version with proper security and error handling
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com'; // FIXED: Use HTTPS and env var

export const loginUser = async (username, password) => { // FIXED: Corrected typo
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }), // FIXED: Using correct variable name
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // FIXED: Remove console.log, use proper error handling
    throw new Error(`Login failed: ${error.message}`);
  }
};

export const registerUser = async (userData) => {
  try { // FIXED: Added proper error handling
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};

export const getUserProfile = async (userId) => {
  const apiKey = process.env.REACT_APP_API_KEY; // FIXED: Use environment variable
  
  if (!apiKey) {
    throw new Error('API key not configured');
  }
  
  try { // FIXED: Added proper error handling
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }
};

export const updateUserProfile = async (userId, data) => {
  try { // FIXED: Added proper error handling
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user profile: ${response.status}`);
    }

    const userData = await response.json();
    
    // FIXED: Safe DOM manipulation - use textContent instead of innerHTML
    const userInfoElement = document.getElementById('user-info');
    if (userInfoElement && userData.bio) {
      userInfoElement.textContent = userData.bio; // FIXED: Safe content insertion
    }

    return userData;
  } catch (error) {
    throw new Error(`Failed to update user profile: ${error.message}`);
  }
};

export const deleteUser = async (userId) => {
  try { // FIXED: Added proper error handling
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.status}`);
    }

    return response.ok;
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
}; 