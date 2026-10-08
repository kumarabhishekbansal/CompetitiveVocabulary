import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  fetchCurrentUser, 
  loginUser, 
  registerUser, 
  logoutUser 
} from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check existing session from HttpOnly cookie
  const checkAuth = useCallback(async () => {
    setLoading(true);
    const result = await fetchCurrentUser();
    if (result.success && result.user) {
      setUser(result.user);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (email, password) => {
    setError(null);
    const result = await loginUser({ email, password });
    if (result.success && result.user) {
      setUser(result.user);
      return { success: true };
    }
    const errMsg = result.error || 'Login failed';
    setError(errMsg);
    return { success: false, error: errMsg };
  };

  // Register handler
  const register = async (name, email, password) => {
    setError(null);
    const result = await registerUser({ name, email, password });
    if (result.success && result.user) {
      setUser(result.user);
      return { success: true };
    }
    const errMsg = result.error || 'Registration failed';
    setError(errMsg);
    return { success: false, error: errMsg };
  };

  // Logout handler
  const logout = async () => {
    await logoutUser();
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      checkAuth,
      clearError: () => setError(null)
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
