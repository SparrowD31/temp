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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Add debug logging to track auth state
  useEffect(() => {
    console.log('Auth State Updated:', {
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    });
  }, [user]);

  const checkAuthStatus = async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // First try to get existing userData from localStorage
      const existingUserData = localStorage.getItem('userData');
      const parsedExistingData = existingUserData ? JSON.parse(existingUserData) : null;

      // Decode the JWT token to get user data including role
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      console.log('Decoded token:', decodedToken);

      // Merge existing data with token data, preferring existing data for certain fields
      const userData = {
        id: decodedToken.id || decodedToken.sub,
        email: decodedToken.email,
        name: parsedExistingData?.name || decodedToken.name,
        role: decodedToken.role,
        mobile: parsedExistingData?.mobile || decodedToken.mobile,
      };

      console.log('User data from token:', userData);
      
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.role === 'admin');
      localStorage.setItem('userData', JSON.stringify(userData));
      setLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
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
      console.log('Login attempt for:', email);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const text = await response.text();
      console.log('Raw response:', text);

      if (!text) {
        throw new Error('Empty response from server');
      }

      const data = JSON.parse(text);
      
      if (data.token) {
        // First set the token
        sessionStorage.setItem('authToken', data.token);
        
        // Then set user data
        const userData = {
          ...data.user,
          id: data.user._id || data.user.id // Ensure we have a consistent id field
        };
        
        // Update localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Update state
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.role === 'admin');
        
        console.log('Login successful, user state updated:', userData);
        
        // Trigger a manual check of auth status
        await checkAuthStatus();
        
        return data;
      } else {
        throw new Error(data.message || 'Login failed');
      }
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
    setIsAuthenticated(false);
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
      setIsAuthenticated(true);
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
    isAuthenticated,
    isAdmin
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