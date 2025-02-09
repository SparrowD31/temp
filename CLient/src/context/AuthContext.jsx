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

  // Updated to work with new storage mechanism
  const checkAuthStatus = async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }

      // Instead of decoding token client-side, validate with backend
      const response = await fetch('/api/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Token invalid');
      }

      const userData = await response.json();
      setUser(userData);
      setLoading(false);
    } catch (error) {
      logout(); // Clear invalid session
      setLoading(false);
    }
  };

  // Call checkAuthStatus when component mounts and when token changes
  useEffect(() => {
    checkAuthStatus();
    // Add event listener for storage changes
    window.addEventListener('storage', checkAuthStatus);
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email }); // Don't log password
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Important for CORS
      });

      const data = await response.json();
      console.log('Server response:', {
        status: response.status,
        ok: response.ok,
        data: data
      });

      if (!response.ok) {
        throw new Error(data.message || data.details || 'Login failed');
      }

      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear both localStorage and sessionStorage
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
        // Add other non-sensitive fields as needed
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
    isAuthenticated: !!user && !!sessionStorage.getItem('authToken'),
    isAdmin: user?.role === 'admin'
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