import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.get('/auth/me');
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data.data;
    localStorage.setItem('token', token);
    setUser(user);
    return user;
  };

  const register = async (userData) => {
    // Map frontend fields to backend fields
    const backendData = {
      email: userData.email,
      password: userData.password,
      role: userData.user_type === 'job_seeker' ? 'jobseeker' : 'employer', // Map job_seeker to jobseeker
    };

    // Add role-specific fields
    if (userData.user_type === 'job_seeker') {
      // Split name into firstName and lastName
      const nameParts = (userData.name || '').trim().split(' ');
      backendData.firstName = nameParts[0] || '';
      backendData.lastName = nameParts.slice(1).join(' ') || '';
      backendData.phone = userData.phone || '';
    } else if (userData.user_type === 'employer') {
      backendData.companyName = userData.company_name || '';
      backendData.companyDescription = userData.company_description || '';
      backendData.phone = userData.phone || '';
    }

    const response = await api.post('/auth/register', backendData);
    const { token, user } = response.data.data;
    localStorage.setItem('token', token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isJobSeeker: user?.role === 'jobseeker',
    isEmployer: user?.role === 'employer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
