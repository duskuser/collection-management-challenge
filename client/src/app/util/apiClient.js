// utils/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:4000/api',
    validateStatus: () => true, // Always return a response, handle errors manually
});

// Optional: Add token to requests automatically if present
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default apiClient;
