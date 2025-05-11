import React, {createContext, useContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../lib/api';
import {useToast} from './ToastContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const {showError} = useToast();

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return null;

      const response = await api.get('/auth/me/');
      console.log('User data:', response.data);
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response);
      showError(error.response?.data?.message || 'Failed to fetch user data');
      return null;
    }
  };

  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login/', {
        login: username,
        password: password,
      });
      console.log('Login response:', response.data);
      const {token} = response.data;
      console.log('Token:', token);
      await AsyncStorage.setItem('token', token);
      await fetchUser();
      console.log('setted');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      console.log(error.response);
      showError(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
    } catch (error) {
      showError('Logout failed');
    }
  };

  const updateUser = async userData => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{user, loading, login, logout, fetchUser, updateUser}}>
      {children}
    </AuthContext.Provider>
  );
};
