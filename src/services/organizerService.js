import apiClient from "../helpers/apiHelper";

export const getOrganizer = async (page = 1, search = "", limit = 10) => {
  const response = await apiClient.get(`/api/organizer`, {
    params: { page, search, limit },
  });
  return response;
};

export const getOrganizerById = async (id) => {
  const response = await apiClient.get(`/api/organizer/${id}`);
  return response;
};

export const addOrganizer = async (organizerData) => {
  const response = await apiClient.post(`/api/organizer`, organizerData);
  return response;
};

export const updateOrganizer = async (id, organizerData) => {
  const response = await apiClient.put(`/api/organizer/${id}`, organizerData);
  return response;
};

export const disableOrganizer = async (id) => {
  const response = await apiClient.put(`/api/organizer/${id}/disable`);
  return response;
};

export const enableOrganizer = async (id) => {
  const response = await apiClient.put(`/api/organizer/${id}`, { isDisabled: false });
  return response;
}; 