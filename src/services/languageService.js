// src/services/languageService.js
import apiClient from "../helpers/apiHelper";

export const list = () => apiClient.get('/api/language');
export const create = (data) => apiClient.post('/api/language', data);
export const update = (id, data) => apiClient.put(`/api/language/${id}`, data);
export const remove = (id) => apiClient.delete(`/api/language/${id}`);
