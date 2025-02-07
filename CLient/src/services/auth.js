import { createAsyncThunk } from '@reduxjs/toolkit';

// Set the base URL for API requests
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
console.log('Base URL:', baseUrl); // Log the base URL for debugging

// Login function
export const loginUser = async (credentials) => {
  try {
    const loginUrl = `${baseUrl}/api/auth/login`;
    console.log('Attempting login with URL:', loginUrl);
    console.log('Request payload:', credentials);

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    // Log the response status and body
    console.log('Response Status:', response.status);
    const text = await response.text();
    console.log('Raw response:', text);

    // Handle 503 Service Unavailable
    if (response.status === 503) {
      console.error('Service unavailable. Please try again later.');
      throw new Error('Service unavailable. Please try again later.');
    }

    // Check if the response is OK
    if (!response.ok) {
      console.error('Login failed with status:', response.status, 'Response:', text);
      throw new Error('Login failed: ' + text);
    }

    // Check if the response is empty
    if (!text) {
      console.error('Empty response from server. Status:', response.status);
      throw new Error('Empty response from server');
    }

    // Try to parse the response as JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse response:', text);
      throw new Error('Invalid JSON response from server');
    }

    // Store user data and token
    sessionStorage.setItem('authToken', data.token);
    localStorage.setItem('userData', JSON.stringify(data.user));

    return data;
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    throw error;
  }
};

// Register function
export const registerUser = async (userData) => {
  try {
    const registerUrl = `${baseUrl}/api/auth/register`;
    console.log('Attempting registration with URL:', registerUrl);

    const response = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Utility functions
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('userData');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = () => {
  return sessionStorage.getItem('authToken');
};

export const logout = () => {
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('user');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// Get authenticated user data
export const getAuthenticatedUser = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user data');
    }

    return await response.json();
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};