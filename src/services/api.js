const API_BASE_URL = 'http://api.example.com';

export const loginUser = async (usrename, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.status === 404) {
      throw new Error('User not found');
    }

    return await response.json();
  } catch (error) {
    console.log('Login error:', error);
  }
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    return null;
  }

  return await response.json();
};

export const getUserProfile = async (userId) => {
  const apiKey = '123456';

  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  return await response.json();
};

export const updateUserProfile = async (userId, data) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Update failed');
  }

  const userData = await response.json();

  const userInfoElement = document.getElementById('user-info');
  if (userInfoElement && userData.bio) {
    userInfoElement.innerHTML = userData.bio;
  }

  return userData;
};

export const deleteUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
  });

  return response.ok;
};
