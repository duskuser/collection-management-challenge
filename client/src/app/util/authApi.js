// utils/authApi.js
import apiClient from './apiClient';

export const signupUser = async ({ email, username, password }) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);

    const res = await apiClient.post('/signup', formData);
    return res;
};

export const loginUser = async ({ email, password }) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const res = await apiClient.post('/login', formData);
    return res;
};

export const fetchAuthenticatedUser = async () => {
    const res = await apiClient.get('/authenticated_user');
    return res;
};

export const hasUserToken = () => {
    return Boolean(localStorage.getItem('token'));
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};