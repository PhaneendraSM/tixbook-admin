// src/services/artistService.js
import apiClient from "../helpers/apiHelper";

// export const list = () => apiClient.get('/api/artist');
export const list = async (page = 1, search = "", limit = 10) => {
  const response = await apiClient.get(`/api/artist`, {
    params: { page, search, limit },
});
  console.log(response.data);
 return response.data;
};

export const create = (data) => apiClient.post('/api/artist', data);
export const update = (id, data) => apiClient.put(`/api/artist/${id}`, data);
export const remove = (id) => apiClient.delete(`/api/artist/${id}`);
