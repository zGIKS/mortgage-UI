import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/mortgage`;

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
 * Maps frontend calculate request to API format
 */
const mapCalculateRequestToApi = (data) => ({
  banco_id: data.banco_id,
  precio_venta: data.precio_venta,
  cuota_inicial: data.cuota_inicial,
  monto_prestamo: data.monto_prestamo,
  bono_techo_propio: data.bono_techo_propio || 0,
  tea: data.tea,
  plazo_meses: data.plazo_meses,
  meses_gracia: data.meses_gracia || 0,
  tipo_gracia: data.tipo_gracia || 'NONE',
  moneda: data.moneda || 'PEN',
  tasa_descuento: data.tasa_descuento || 0,
});

/**
 * Maps frontend update request to API format
 */
const mapUpdateRequestToApi = (data) => ({
  banco_id: data.banco_id,
  precio_venta: data.precio_venta,
  cuota_inicial: data.cuota_inicial,
  monto_prestamo: data.monto_prestamo,
  bono_techo_propio: data.bono_techo_propio || 0,
  tea: data.tea,
  plazo_meses: data.plazo_meses,
  meses_gracia: data.meses_gracia || 0,
  tipo_gracia: data.tipo_gracia || 'NONE',
  moneda: data.moneda || 'PEN',
  tasa_descuento: data.tasa_descuento || 0,
  dias_anio: data.dias_anio,
  frecuencia_pago: data.frecuencia_pago,
  tipo_tasa: data.tipo_tasa || 'NOMINAL',
});

/**
 * Maps a single payment schedule item from API
 */
const mapPaymentScheduleItem = (item) => ({
  periodo: item.periodo,
  cuota: item.cuota,
  interes: item.interes,
  amortizacion: item.amortizacion,
  saldo_final: item.saldo_final,
  es_periodo_gracia: item.es_periodo_gracia,
});

/**
 * Maps API response to frontend format
 */
const mapResponseFromApi = (data) => ({
  id: data.id,
  user_id: data.user_id,
  banco_id: data.banco_id,
  banco_nombre: data.banco_nombre,
  precio_venta: data.precio_venta,
  cuota_inicial: data.cuota_inicial,
  monto_prestamo: data.monto_prestamo,
  saldo_financiar: data.saldo_financiar,
  bono_techo_propio: data.bono_techo_propio,
  tea: data.tea,
  tipo_tasa: data.tipo_tasa,
  plazo_meses: data.plazo_meses,
  meses_gracia: data.meses_gracia,
  tipo_gracia: data.tipo_gracia,
  moneda: data.moneda,
  dias_anio: data.dias_anio,
  frecuencia_pago: data.frecuencia_pago,
  tasa_periodo: data.tasa_periodo,
  cuota_fija: data.cuota_fija,
  total_intereses: data.total_intereses,
  total_pagado: data.total_pagado,
  tcea: data.tcea,
  tir: data.tir,
  van: data.van,
  created_at: data.created_at,
  cronograma_pagos: data.cronograma_pagos?.map(mapPaymentScheduleItem) || [],
});

/**
 * Maps API history item to frontend format
 */
const mapHistoryItemFromApi = (data) => ({
  id: data.id,
  user_id: data.user_id,
  banco_id: data.banco_id,
  banco_nombre: data.banco_nombre,
  precio_venta: data.precio_venta,
  monto_prestamo: data.monto_prestamo,
  cuota_fija: data.cuota_fija,
  plazo_meses: data.plazo_meses,
  moneda: data.moneda,
  tcea: data.tcea,
  created_at: data.created_at,
});

export const mortgageService = {
  /**
   * Calculate mortgage with French method
   * @param {Object} data - Mortgage calculation request
   * @returns {Promise<Object>} Mortgage calculation response
   */
  calculateMortgage: async (data) => {
    try {
      const apiRequest = mapCalculateRequestToApi(data);
      const response = await axios.post(`${API_BASE_URL}/calculate`, apiRequest, {
        headers: getAuthHeaders()
      });
      return mapResponseFromApi(response.data);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get mortgage calculation history for authenticated user
   * @param {number} [limit=50] - Maximum number of results
   * @param {number} [offset=0] - Offset for pagination
   * @returns {Promise<Array>} List of mortgage history items
   */
  getMortgageHistory: async (limit = 50, offset = 0) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/history`, {
        params: { limit, offset },
        headers: getAuthHeaders()
      });
      return response.data.map(mapHistoryItemFromApi);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get a specific mortgage calculation by ID
   * @param {number} id - Mortgage ID
   * @returns {Promise<Object>} Mortgage details with payment schedule
   */
  getMortgageById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`, {
        headers: getAuthHeaders()
      });
      return mapResponseFromApi(response.data);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update an existing mortgage calculation (recalculates all values)
   * @param {number} id - Mortgage ID
   * @param {Object} data - Mortgage update request
   * @returns {Promise<Object>} Updated mortgage response
   */
  updateMortgage: async (id, data) => {
    try {
      const apiRequest = mapUpdateRequestToApi(data);
      const response = await axios.put(`${API_BASE_URL}/${id}`, apiRequest, {
        headers: getAuthHeaders()
      });
      return mapResponseFromApi(response.data);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a mortgage calculation by ID
   * @param {number} id - Mortgage ID
   * @returns {Promise<boolean>} True if deletion was successful
   */
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
