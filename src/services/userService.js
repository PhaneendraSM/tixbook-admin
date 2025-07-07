import apiClient from "../helpers/apiHelper";



export const getUsers = async (page = 1, search = "", limit = 10) => {
    try {
        const response = await apiClient.get("/api/user", {
            params: { page, search, limit },
        });
      return response;
    } catch (error) {
      throw error;
    }
  };
  

export const updateUser = async (id, data) => {
  const response = await apiClient.put(`/api/user/${id}`, data);
  return response;
};

export const deleteUsers = async (id) => {
  const response = await apiClient.delete(`/api/user/${id}`);
  return response;
};
