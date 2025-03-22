import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000", // Docker service name
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    console.log('API Interceptor - Token:', token); // Debug log: token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Interceptor - Headers:', config.headers); // Debug log: headers with token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
