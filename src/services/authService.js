import axios from 'axios';


const API_BASE_URL = process.env.REACT_APP_API_URL;


export const loginAdmin = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/admin/login`, { email, password });
  return response.data;
};


export const forgotPassword = async (email) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
  return response.data;
};
