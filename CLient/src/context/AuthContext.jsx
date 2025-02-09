import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Initially set to false
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log('Auth State Updated:', {
      user,
      isAuthenticated,
      isAdmin: user?.role === 'admin'
    });
  }, [user, isAuthenticated]);

  // Updated to work with new storage mechanism
  const checkAuthStatus = async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        setUser(null);
        setIsAuthenticated(false); // If no token, ensure isAuthenticated is false
        return;
      }

      const existingUserData = localStorage.getItem('userData');
      const parsedExistingData = existingUserData ? JSON.parse(existingUserData) : null;

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      console.log('Decoded token:', decodedToken);

      const userData = {
        id: decodedToken.id || decodedToken.sub,
        email: decodedToken.email,
        name: parsedExistingData?.name || decodedToken.name,
        role: decodedToken.role,
        mobile: parsedExistingData?.mobile || decodedToken.mobile,
      };

      console.log('User data from token:', userData);

      setUser(userData);
      localStorage.setItem('userData', JSON.stringify(userData));
      setIsAuthenticated(true); // Token exists, set isAuthenticated to true
      setLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false); // On error, mark as not authenticated
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Environment:', import.meta.env.MODE);
      const apiUrl = import.meta.env.VITE_API_URL;
      console.log('API URL:', apiUrl);

      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      console.log('Raw response:', text);

      if (!text) {
        throw new Error('Empty response from server');
      }

      const data = JSON.parse(text);

      if (data.success) {
        sessionStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true); // Mark the user as authenticated on successful login
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('razorPayId');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false); // Ensure logged out state is properly handled
    setIsAdmin(false);
  };

  const updateUserProfile = async (userData) => {
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token || !user) throw new Error('Not authenticated');

      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedUser = await response.json();
      const normalizedUser = {
        id: updatedUser._id || updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role || user.role,
        mobile: updatedUser.mobile,
      };

      setUser(normalizedUser);
      localStorage.setItem('userData', JSON.stringify(normalizedUser));
      return normalizedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUserProfile,
    checkAuthStatus,
    isAuthenticated, // Directly returning the updated value
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
