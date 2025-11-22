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
  tea: data.tea,
  fechaTea: data.fecha_tea,
  moneda: data.moneda,
  createdAt: data.created_at,
});

export const bankService = {
  /**
   * Get all available banks with their configuration and current TEA from SBS
   * @param {Object} options - Query options
   * @param {string} [options.fecha] - Date to query TEA (YYYY-MM-DD). Uses current SBS date if not provided
   * @param {string} [options.moneda='PEN'] - Currency: 'PEN' (soles) or 'USD' (dollars)
   * @returns {Promise<Array>} List of banks with TEA
   */
  getAllBanks: async ({ fecha, moneda = 'PEN' } = {}) => {
    try {
      const params = { moneda };
      if (fecha) {
        params.fecha = fecha;
      }

      const response = await axios.get(API_BASE_URL, {
        params,
        headers: getAuthHeaders()
      });
      return response.data.map(mapBankFromApi);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get a specific bank by ID with current TEA from SBS
   * @param {string} id - Bank ID (UUID)
   * @param {Object} options - Query options
   * @param {string} [options.fecha] - Date to query TEA (YYYY-MM-DD). Uses current SBS date if not provided
   * @param {string} [options.moneda='PEN'] - Currency: 'PEN' (soles) or 'USD' (dollars)
   * @returns {Promise<Object>} Bank details with TEA
   */
  getBankById: async (id, { fecha, moneda = 'PEN' } = {}) => {
    try {
      const params = { moneda };
      if (fecha) {
        params.fecha = fecha;
      }

      const response = await axios.get(`${API_BASE_URL}/${id}`, {
        params,
        headers: getAuthHeaders()
      });
      return mapBankFromApi(response.data);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
