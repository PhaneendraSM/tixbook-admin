import apiClient from "../helpers/apiHelper";


export const list = async (page = 1, search = "", limit = 10) => {
    const response = await apiClient.get(`/api/events/media`, {
        params: { page, search, limit },
    });
    return response;
    }

export const create = (data) => apiClient.post('/api/events/media', data);
export const update = (id, data) => apiClient.put(`/api/events/media/${id}`, data);
export const remove = (id) => apiClient.delete(`/api/events/media/${id}`);
