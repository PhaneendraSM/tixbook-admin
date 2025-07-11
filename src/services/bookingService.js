import apiClient from "../helpers/apiHelper";

export const getAllBookings = async (page = 1, search = "", limit = 10) => {
  try {
    const response = await apiClient.get("/api/booking", {
      params: { page, search, limit },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getBookingById = (id) => apiClient.get(`/api/booking/${id}`);

export const deleteBooking = (id) => apiClient.delete(`/api/booking/${id}`);

// New function for admin booking
export const createBooking = async (bookingData) => {
  try {
    const response = await apiClient.post("/api/booking", bookingData);
    return response;
  } catch (error) {
    throw error;
  }
};



