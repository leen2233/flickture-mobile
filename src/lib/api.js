import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://flickture-api.leen2233.me/api/v1/'; // Replace with your actual API URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the auth token
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Movie endpoints
export const getMovieDetails = async (tmdbId, type) => {
  const response = await api.get(`/movies/${tmdbId}/${type}`);
  return response.data;
};

export default api;
