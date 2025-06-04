// utils/authApi.js
import apiClient from './apiClient';

export const getUserNotes = async () => {
    const res = await apiClient.get('user-notes');
    return res;
}

export const createNote = async ({ title, body }) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);

    const res = await apiClient.post('/note', formData);
    return res;
}

export const updateNote = async ({ title, body, key }) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    formData.append('key', key);

    const res = await apiClient.post('update-note', formData);
    return res;
}

export const deleteNote = async ({ generatedKey }) => {
    const formData = new FormData();
    formData.append('key', generatedKey);

    const res = await apiClient.post('/delete-note', formData);
    return res;
};

