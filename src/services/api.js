// API Service with intentional bugs for testing
const API_BASE_URL = 'http://api.example.com'; // BUG: Insecure HTTP URL

export const loginUser = async (usrename, password) => { // BUG: Typo in parameter name
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usrename, password }), // BUG: Using typo variable
    });

    console.log('Login response:', response); // BUG: Console.log in production

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Login error:', error); // BUG: Console.log in production
    throw error;
  }
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, { // BUG: Missing error handling
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  return response.json();
};

export const getUserProfile = async (userId) => {
  const apiKey = 'sk-1234567890abcdef'; // BUG: Hardcoded API key
  
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  return response.json();
};

export const updateUserProfile = async (userId, data) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  // BUG: Potential XSS vulnerability
  const userData = await response.json();
  document.getElementById('user-info').innerHTML = userData.bio; // BUG: Unsafe innerHTML

  return userData;
};

export const deleteUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
  });

  return response.ok;
}; 