import axios from "axios";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const getAuthToken = () => {
  return (
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("adminToken")
  );
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Show toast message
      toast.error("Unauthorized access! Please log in with valid credentials.");

      // Clear tokens
      localStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminToken");

      // Redirect to login
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000); // delay to allow toast to show
    }
    return Promise.reject(error);
  }
);

export default apiClient;
