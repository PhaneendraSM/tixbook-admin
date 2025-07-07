import apiClient from "../helpers/apiHelper";


export const getAdmin = async (page = 1, search = "", limit = 10) => {
  const response = await apiClient.get(`/api/admin`, {
    params: { page, search, limit },
});
  
  return response;
};

export const addAdmin = async (adminData) => {
  const response = await apiClient.post(`/api/admin`, adminData);
  return response;
};

export const updateAdmin = async (id, adminData) => {
  const response = await apiClient.put(`/api/admin/${id}`, adminData);
  return response;
};

export const deleteAdmin = async (id) => {
  const response = await apiClient.delete(`/api/admin/${id}`);
  return response;
};


export const addCategory = async (categoryData) => {
  const response = await apiClient.post(`/api/category`, categoryData);
  return response;
};

export const updateCategory = async (id, categoryData) => {
  const response = await apiClient.put(`/api/category/${id}`, categoryData);
  return response;
};

export const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/api/category/${id}`);
  return response;
};

export const addArtists = async (artistsData) => {
  const response = await apiClient.post(`/api/artist`, artistsData);
  return response;
};

export const updateArtists = async (id, artistsData) => {
  const response = await apiClient.put(`/api/artist/${id}`, artistsData);
  return response;
};

export const deleteArtists = async (id) => {
  const response = await apiClient.delete(`/api/artist/${id}`);
  return response;
};

export const addLanguage = async (languageData) => {
  const response = await apiClient.post(`/api/language`, languageData);
  return response;
}

export const updateLanguage = async (id, languageData) => {
  const response = await apiClient.put(`/api/language/${id}`, languageData);
  return response;
};

export const deleteLanguage = async (id) => {
  const response = await apiClient.delete(`/api/language/${id}`);
  return response;
}

export const addGenre = async (genreData) => {
  const response = await apiClient.post(`/api/genre`, genreData);
  return response;
};    

export const updateGenre = async (id, genreData) => {
  const response = await apiClient.put(`/api/genre/${id}`, genreData);
  return response;
} ; 

export const deleteGenre = async (id) => {  
  const response = await apiClient.delete(`/api/genre/${id}`);
  return response;
} ;

export const getAllArtists = async (page = 1, search = "", limit = 10) => {
  const response = await apiClient.get(`/api/artist`, {
    params: { page, search, limit },
  });
  return response;
} ; 

export const getAllCategorys = async (page = 1, search = "", limit = 10) => {
  const response = await apiClient.get(`/api/category`, {
    params: { page, search, limit },
  });
  return response;
} ;

export const getAllLanguages = async (page = 1, search = "", limit = 10) => { 
  const response = await apiClient.get(`/api/language`, {
    params: { page, search, limit },
  });
  return response;
} ;   

export const getAllGenres = async (page = 1, search = "", limit = 10) => {
  const response = await apiClient.get(`/api/genre`, {
    params: { page, search, limit },
  });
  return response;
} ;

export const getAllAdmins = async (page = 1, search = "", limit = 10) => {
  const response = await apiClient.get(`/api/admin`, {
    params: { page, search, limit },
  });
  return response;
} ;
