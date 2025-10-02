import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/mortgage';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

export const mortgageService = {
  calculateMortgage: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculate`, data, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMortgageHistory: async (limit = 50, offset = 0) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/history`, {
        params: { limit, offset },
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMortgageById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateMortgage: async (id, data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, data, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteMortgage: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: getAuthHeaders()
      });
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
