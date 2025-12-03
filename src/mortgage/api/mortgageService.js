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
  bono_techo_propio: data.bono_techo_propio || 0,
  cok: data.cok || 0,
  comision_desembolso: data.comision_desembolso || 0,
  comision_evaluacion: data.comision_evaluacion || 0,
  costos_mensuales_adicionales: data.costos_mensuales_adicionales || 0,
  cuota_inicial: data.cuota_inicial,
  dias_anio: data.dias_anio || 360,
  frecuencia: data.frecuencia || 'MENSUAL',
  frecuencia_pago: data.frecuencia_pago || 0,
  gastos_administrativos: data.gastos_administrativos || 0,
  meses_gracia: data.meses_gracia || 0,
  moneda: data.moneda || 'PEN',
  monto_prestamo: data.monto_prestamo,
  numero_anios: data.numero_anios || 0,
  plazo_meses: data.plazo_meses,
  portes: data.portes || 0,
  precio_venta: data.precio_venta,
  seguro_desgravamen: data.seguro_desgravamen || 0,
  seguro_inmueble_anual: data.seguro_inmueble_anual || 0,
  tasa_anual: data.tasa_anual,
  tasa_descuento: data.tasa_descuento || 0,
  tipo_gracia: data.tipo_gracia || 'NONE',
  tipo_tasa: data.tipo_tasa || 'NOMINAL'
});

/**
 * Maps frontend update request to API format
 */
const mapUpdateRequestToApi = (data) => ({
  bono_techo_propio: data.bono_techo_propio || 0,
  cok: data.cok || 0,
  comision_desembolso: data.comision_desembolso || 0,
  comision_evaluacion: data.comision_evaluacion || 0,
  costos_mensuales_adicionales: data.costos_mensuales_adicionales || 0,
  cuota_inicial: data.cuota_inicial,
  dias_anio: data.dias_anio || 360,
  frecuencia: data.frecuencia || 'MENSUAL',
  frecuencia_pago: data.frecuencia_pago || 0,
  gastos_administrativos: data.gastos_administrativos || 0,
  meses_gracia: data.meses_gracia || 0,
  moneda: data.moneda || 'PEN',
  monto_prestamo: data.monto_prestamo,
  numero_anios: data.numero_anios || 0,
  plazo_meses: data.plazo_meses,
  portes: data.portes || 0,
  precio_venta: data.precio_venta,
  seguro_desgravamen: data.seguro_desgravamen || 0,
  seguro_inmueble_anual: data.seguro_inmueble_anual || 0,
  tasa_anual: data.tasa_anual,
  tasa_descuento: data.tasa_descuento || 0,
  tipo_gracia: data.tipo_gracia || 'NONE',
  tipo_tasa: data.tipo_tasa || 'NOMINAL'
});

/**
 * Maps a single payment schedule item from API
 */
const mapPaymentScheduleItem = (item) => ({
  amortizacion: item.amortizacion,
  costos_adicionales: item.costos_adicionales,
  cuota: item.cuota,
  cuota_total: item.cuota_total,
  es_periodo_gracia: item.es_periodo_gracia,
  gastos_administrativos: item.gastos_administrativos,
  interes: item.interes,
  numero_anio: item.numero_anio,
  periodo: item.periodo,
  portes: item.portes,
  saldo_final: item.saldo_final,
  seguro_desgravamen: item.seguro_desgravamen,
  seguro_inmueble: item.seguro_inmueble,
  tasa_periodo: item.tasa_periodo,
  tipo_gracia: item.tipo_gracia
});

/**
 * Maps API response to frontend format
 */
const mapResponseFromApi = (data) => ({
  bono_techo_propio: data.bono_techo_propio,
  comision_desembolso: data.comision_desembolso,
  comision_evaluacion: data.comision_evaluacion,
  costos_mensuales_adicionales: data.costos_mensuales_adicionales,
  created_at: data.created_at,
  cronograma_pagos: data.cronograma_pagos?.map(mapPaymentScheduleItem) || [],
  cuota_fija: data.cuota_fija,
  cuota_inicial: data.cuota_inicial,
  cuota_total: data.cuota_total,
  cuotas_por_anio: data.cuotas_por_anio,
  dias_anio: data.dias_anio,
  frecuencia_pago: data.frecuencia_pago,
  gastos_administrativos: data.gastos_administrativos,
  id: data.id,
  meses_gracia: data.meses_gracia,
  moneda: data.moneda,
  monto_prestamo: data.monto_prestamo,
  numero_anios: data.numero_anios,
  numero_cuotas: data.numero_cuotas,
  plazo_meses: data.plazo_meses,
  portes: data.portes,
  precio_venta: data.precio_venta,
  saldo_financiar: data.saldo_financiar,
  seguro_desgravamen: data.seguro_desgravamen,
  seguro_inmueble_anual: data.seguro_inmueble_anual,
  tasa_anual: data.tasa_anual,
  tasa_periodo: data.tasa_periodo,
  tcea: data.tcea,
  tea: data.tea,
  tipo_gracia: data.tipo_gracia,
  tipo_tasa: data.tipo_tasa,
  tir: data.tir,
  tir_flujo: data.tir_flujo,
  total_cargos: data.total_cargos,
  total_gastos: data.total_gastos,
  total_intereses: data.total_intereses,
  total_pagado: data.total_pagado,
  total_pagado_con_cargos: data.total_pagado_con_cargos,
  total_seguros: data.total_seguros,
  user_id: data.user_id,
  van: data.van
});

/**
 * Maps API history item to frontend format
 */
const mapHistoryItemFromApi = (data) => ({
  id: data.id,
  user_id: data.user_id,
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
      console.log('📤 Sending to API:', JSON.stringify(apiRequest, null, 2));
      const response = await axios.post(`${API_BASE_URL}/calculate`, apiRequest, {
        headers: getAuthHeaders()
      });
      return mapResponseFromApi(response.data);
    } catch (error) {
      console.error('❌ API Error:', error.response?.data || error.message);
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
