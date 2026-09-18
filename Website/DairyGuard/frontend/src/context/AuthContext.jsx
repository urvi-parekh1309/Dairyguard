import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dairyguard_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('dairyguard_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists and verify profile
    if (token) {
      api.user.getProfile()
        .then((profile) => {
          setUser(profile);
          localStorage.setItem('dairyguard_user', JSON.stringify(profile));
        })
        .catch(() => {
          // If token expired or invalid, clear session
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials) => {
    const result = await api.auth.login(credentials);
    localStorage.setItem('dairyguard_token', result.token);
    localStorage.setItem('dairyguard_user', JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
    return result;
  };

  const signup = async (data) => {
    const result = await api.auth.signup(data);
    localStorage.setItem('dairyguard_token', result.token);
    localStorage.setItem('dairyguard_user', JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
    return result;
  };

  const logout = () => {
    api.auth.logout();
    localStorage.removeItem('dairyguard_token');
    localStorage.removeItem('dairyguard_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('dairyguard_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, signup, logout, updateUser }}>
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
