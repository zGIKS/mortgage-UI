import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/banks`;

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

/**
 * Maps API bank response to frontend format
 */
const mapBankFromApi = (data) => ({
  id: data.id,
  name: data.name,
  rateType: data.rate_type,
  paymentFrequencyDays: data.payment_frequency_days,
  daysInYear: data.days_in_year,
  includesInflation: data.includes_inflation,
  createdAt: data.created_at,
});

export const bankService = {
  /**
   * Get all available banks with their configuration
   * @returns {Promise<Array>} List of banks
   */
  getAllBanks: async () => {
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: getAuthHeaders()
      });
      return response.data.map(mapBankFromApi);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get a specific bank by ID
   * @param {string} id - Bank ID (UUID)
   * @returns {Promise<Object>} Bank details
   */
  getBankById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`, {
        headers: getAuthHeaders()
      });
      return mapBankFromApi(response.data);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
