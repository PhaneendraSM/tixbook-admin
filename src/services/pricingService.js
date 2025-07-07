// src/services/categoryService.js
import apiClient from "../helpers/apiHelper";

export const list = () => apiClient.get('/api/pricing');
export const create = (data) => apiClient.post('/api/pricing', data);
export const update = (id, data) => apiClient.put(`/api/pricing/${id}`, data);
export const remove = (id) => apiClient.delete(`/api/pricing/${id}`);
