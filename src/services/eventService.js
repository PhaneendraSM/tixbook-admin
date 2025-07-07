import apiClient from "../helpers/apiHelper";


export const getEvents = async (page = 1, search = "", limit = 10) => {
  const response = await apiClient.get(`/api/events`, {
    params: { page, search, limit },
});
  
  return response;
};

export const addEvent = async (eventData) => {
  const response = await apiClient.post(`/api/events`, eventData);
  return response;
};

export const updateEvent = async (id, eventData) => {
  const response = await apiClient.put(`/api/events/${id}`, eventData);
  return response;
};

export const deleteEvent = async (id) => {
  const response = await apiClient.delete(`/api/events/${id}`);
  return response;
};

export const getEventById = async (id) => {
  const response = await apiClient.get(`/api/events/${id}`);
  return response.data;
};

export const publishEventById = async (id, data) => {
  const response = await apiClient.put(`/api/events/${id}/publish`, data);
  return response.data;
};

export const getSeatingPlan = async (page = 1, search = "", limit = 10) => {
  const response = await apiClient.get(`/api/seating`, {
    params: { page, search, limit }
  });
  return response.data;
};

export const getSeatingPlanById = async (id) => {
  const response = await apiClient.get(`/api/seating?id=${id}`);
  return response.data;
};

export const deleteSeatingPlanById = async (id) => {
  const response = await apiClient.delete(`/api/seating?id=${id}`);
  return response;
};

export const seatingPlan = async (id, data) => {
  const response = await apiClient.post(`/api/seating`, data);
  return response;
};

export const updateSeatingPlan = async (id, data) => {
  const response = await apiClient.put(`/api/seating?id=${id}`, data);
  return response;
};
