import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Updated to /users/me
          const res = await API.get('/users/me');
          setUser(res.data.data);
          localStorage.setItem('user', JSON.stringify(res.data.data));
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    // Updated to /users/login
    const res = await API.post('/users/login', { email, password });
    const jwtToken = res.data?.data?.token || res.data?.data?.accessToken;
    const userData = res.data?.data?.user;

    if (jwtToken) {
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
    }
    return res.data;
  };

  const register = async (name, email, password) => {
    // Updated to /users/register
    const res = await API.post('/users/register', { name, email, password });
    const jwtToken = res.data?.data?.token || res.data?.data?.accessToken;
    const userData = res.data?.data?.user;

    if (jwtToken) {
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);