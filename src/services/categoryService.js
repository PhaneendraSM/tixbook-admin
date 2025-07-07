// src/services/categoryService.js
import apiClient from "../helpers/apiHelper";

export const list = () => apiClient.get('/api/category');
export const create = (data) => apiClient.post('/api/category', data);
export const update = (id, data) => apiClient.put(`/api/category/${id}`, data);
export const remove = (id) => apiClient.delete(`/api/category/${id}`);
