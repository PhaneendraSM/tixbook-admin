// src/services/genreService.js
import apiClient from "../helpers/apiHelper";

export const list = () => apiClient.get('/api/genre');
export const create = (data) => apiClient.post('/api/genre', data);
export const update = (id, data) => apiClient.put(`/api/genre/${id}`, data);
export const remove = (id) => apiClient.delete(`/api/genre/${id}`);
