import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BANK_RATES_API_URL || 'http://127.0.0.1:8082';

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD restando un día
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
const getYesterdayDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formatea la fecha para mostrar en la UI
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada (DD/MM/YYYY)
 */
const formatDateForDisplay = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

/**
 * Obtiene las tasas de interés bancarias para créditos hipotecarios
 * @param {string} currency - Moneda: 'mn' o 'usd' (por defecto 'mn')
 * @returns {Promise<Object>} Datos de tasas bancarias
 */
export const bankRatesService = {
  /**
   * Obtiene las tasas hipotecarias de los bancos
   * @param {string} currency - 'mn' o 'usd'
   * @returns {Promise<Object>}
   */
  getMortgageRates: async (currency = 'mn') => {
    try {
      const date = getYesterdayDate();

      console.log('Fetching bank rates with params:', { date, currency });

      const response = await axios.get(`${API_BASE_URL}/rates`, {
        params: {
          date: date,
          currency: currency
        }
      });

      console.log('API Response:', response.data);

      // Encontrar la moneda correcta en la respuesta
      const currencyCode = currency.toUpperCase();
      const currencyData = response.data.currencies?.find(
        c => c.code === currencyCode
      );

      if (!currencyData) {
        throw new Error(`No se encontraron datos para la moneda ${currencyCode}`);
      }

      // Encontrar las tasas hipotecarias
      const mortgageRow = currencyData.rows?.find(
        row => row.credit_type === 'Hipotecarios'
      );

      if (!mortgageRow) {
        throw new Error('No se encontraron datos de créditos hipotecarios');
      }

      // Obtener todos los bancos que tengan tasa
      const bankRates = Object.entries(mortgageRow.rates)
        .filter(([name, rate]) => rate !== null && rate !== undefined)
        .map(([name, rate]) => ({
          name,
          rate,
          hasRate: true
        }));

      return {
        date: response.data.date,
        formattedDate: formatDateForDisplay(response.data.date),
        currency: currencyCode,
        banks: bankRates,
        note: response.data.note
      };

    } catch (error) {
      console.error('Error fetching bank rates:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.detail || 'Error al obtener las tasas bancarias');
      }
      throw error;
    }
  },

  /**
   * Obtiene las tasas en moneda nacional (soles)
   * @returns {Promise<Object>}
   */
  getMNRates: async () => {
    return bankRatesService.getMortgageRates('mn');
  },

  /**
   * Obtiene las tasas en dólares
   * @returns {Promise<Object>}
   */
  getUSDRates: async () => {
    return bankRatesService.getMortgageRates('usd');
  }
};
