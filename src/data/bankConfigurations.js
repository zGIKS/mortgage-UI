/**
 * Configuraciones de bancos peruanos para créditos hipotecarios
 * Basado en datos del Fondo MiVivienda y SBS (2025)
 *
 * Fuentes:
 * - https://www.gob.pe/fondomivivienda
 * - https://www.sbs.gob.pe
 * - Tasas actualizadas marzo 2025
 */

export const bankConfigurations = [
  {
    id: 'bbva',
    name: 'BBVA',
    fullName: 'Banco BBVA Perú',
    logo: '/banks/bbva.png',
    config: {
      // Tasas (en formato decimal)
      tasa_anual: 0.0753, // 7.53% - Tasa más baja del mercado
      tipo_tasa: 'EFFECTIVE',

      // Seguros (tasas en formato decimal)
      seguro_desgravamen: 0.00028, // 0.028% mensual - Individual
      seguro_desgravamen_mancomunado: 0.00052, // 0.052% mensual - Mancomunado
      seguro_inmueble_anual: 0.0015, // 0.15% anual

      // Comisiones (montos fijos)
      comision_desembolso: 500,
      comision_evaluacion: 265, // Tasación estándar MiVivienda

      // Gastos mensuales
      gastos_administrativos: 30,
      portes: 15,

      // Configuración del préstamo
      dias_anio: 360,
      frecuencia: 'MENSUAL',
      frecuencia_pago: 30,

      // Límites
      cuota_inicial_minima: 0.10, // 10%
      plazo_minimo_anios: 5,
      plazo_maximo_anios: 30,
      monto_minimo: 64200,
      monto_maximo: 464200,
    },
    features: [
      'Tasa más baja del mercado',
      'Proceso 100% digital',
      'Desembolso rápido',
      'Sin penalidad por prepago'
    ],
    mivivienda: true,
  },
  {
    id: 'bcp',
    name: 'BCP',
    fullName: 'Banco de Crédito del Perú',
    logo: '/banks/bcp.png',
    config: {
      tasa_anual: 0.0862, // 8.62%
      tipo_tasa: 'EFFECTIVE',

      seguro_desgravamen: 0.00030, // 0.030% mensual
      seguro_desgravamen_mancomunado: 0.00055,
      seguro_inmueble_anual: 0.0018, // 0.18% anual

      comision_desembolso: 600,
      comision_evaluacion: 265,

      gastos_administrativos: 35,
      portes: 20,

      dias_anio: 360,
      frecuencia: 'MENSUAL',
      frecuencia_pago: 30,

      cuota_inicial_minima: 0.10,
      plazo_minimo_anios: 5,
      plazo_maximo_anios: 30,
      monto_minimo: 64200,
      monto_maximo: 464200,
    },
    features: [
      'Mayor red de agencias',
      'Atención preferencial',
      'Seguros con Rímac',
      'App móvil completa'
    ],
    mivivienda: true,
  },
  {
    id: 'interbank',
    name: 'Interbank',
    fullName: 'Interbank Perú',
    logo: '/banks/interbank.png',
    config: {
      tasa_anual: 0.0794, // 7.94%
      tipo_tasa: 'EFFECTIVE',

      seguro_desgravamen: 0.00028, // 0.028% mensual
      seguro_desgravamen_mancomunado: 0.00052,
      seguro_inmueble_anual: 0.0016, // 0.16% anual

      comision_desembolso: 550,
      comision_evaluacion: 265,

      gastos_administrativos: 32,
      portes: 18,

      dias_anio: 360,
      frecuencia: 'MENSUAL',
      frecuencia_pago: 30,

      cuota_inicial_minima: 0.10,
      plazo_minimo_anios: 5,
      plazo_maximo_anios: 30,
      monto_minimo: 64200,
      monto_maximo: 464200,
    },
    features: [
      'Segunda mejor tasa',
      'Proceso ágil',
      'Buenos seguros',
      'Atención personalizada'
    ],
    mivivienda: true,
  },
  {
    id: 'scotiabank',
    name: 'Scotiabank',
    fullName: 'Scotiabank Perú',
    logo: '/banks/scotiabank.png',
    config: {
      tasa_anual: 0.0800, // 8.00%
      tipo_tasa: 'EFFECTIVE',

      seguro_desgravamen: 0.00032, // 0.032% mensual
      seguro_desgravamen_mancomunado: 0.00058,
      seguro_inmueble_anual: 0.0017, // 0.17% anual

      comision_desembolso: 580,
      comision_evaluacion: 265,

      gastos_administrativos: 33,
      portes: 19,

      dias_anio: 360,
      frecuencia: 'MENSUAL',
      frecuencia_pago: 30,

      cuota_inicial_minima: 0.10,
      plazo_minimo_anios: 5,
      plazo_maximo_anios: 30,
      monto_minimo: 64200,
      monto_maximo: 464200,
    },
    features: [
      'Respaldo internacional',
      'Tasa competitiva',
      'Buen servicio',
      'Flexibilidad en pagos'
    ],
    mivivienda: true,
  },
  {
    id: 'gnb',
    name: 'GNB',
    fullName: 'Banco GNB Perú',
    logo: '/banks/gnb.png',
    config: {
      tasa_anual: 0.0790, // 7.90%
      tipo_tasa: 'EFFECTIVE',

      seguro_desgravamen: 0.00029, // 0.029% mensual
      seguro_desgravamen_mancomunado: 0.00053,
      seguro_inmueble_anual: 0.0015, // 0.15% anual

      comision_desembolso: 520,
      comision_evaluacion: 265,

      gastos_administrativos: 31,
      portes: 17,

      dias_anio: 360,
      frecuencia: 'MENSUAL',
      frecuencia_pago: 30,

      cuota_inicial_minima: 0.10,
      plazo_minimo_anios: 5,
      plazo_maximo_anios: 30,
      monto_minimo: 64200,
      monto_maximo: 464200,
    },
    features: [
      'Segunda mejor tasa del mercado',
      'Atención personalizada',
      'Proceso simple',
      'Bajos costos operativos'
    ],
    mivivienda: true,
  },
  {
    id: 'pichincha',
    name: 'Pichincha',
    fullName: 'Banco Pichincha Perú',
    logo: '/banks/pichincha.png',
    config: {
      tasa_anual: 0.0850, // 8.50%
      tipo_tasa: 'EFFECTIVE',

      seguro_desgravamen: 0.00031, // 0.031% mensual
      seguro_desgravamen_mancomunado: 0.00056,
      seguro_inmueble_anual: 0.0017,

      comision_desembolso: 560,
      comision_evaluacion: 265,

      gastos_administrativos: 34,
      portes: 18,

      dias_anio: 360,
      frecuencia: 'MENSUAL',
      frecuencia_pago: 30,

      cuota_inicial_minima: 0.10,
      plazo_minimo_anios: 5,
      plazo_maximo_anios: 30,
      monto_minimo: 64200,
      monto_maximo: 464200,
    },
    features: [
      'Respaldo ecuatoriano',
      'Buena atención',
      'Proceso tradicional',
      'Red de agencias'
    ],
    mivivienda: true,
  },
  {
    id: 'custom',
    name: 'Personalizado',
    fullName: 'Configuración Personalizada',
    logo: '/banks/custom.png',
    config: {
      tasa_anual: 0.09,
      tipo_tasa: 'NOMINAL',

      seguro_desgravamen: 0.0015,
      seguro_desgravamen_mancomunado: 0.0028,
      seguro_inmueble_anual: 0.0020,

      comision_desembolso: 500,
      comision_evaluacion: 300,

      gastos_administrativos: 50,
      portes: 20,

      dias_anio: 360,
      frecuencia: 'MENSUAL',
      frecuencia_pago: 30,

      cuota_inicial_minima: 0.10,
      plazo_minimo_anios: 5,
      plazo_maximo_anios: 30,
      monto_minimo: 50000,
      monto_maximo: 5000000,
    },
    features: [
      'Configura tus propios valores',
      'Sin restricciones',
      'Ideal para comparaciones',
      'Totalmente flexible'
    ],
    mivivienda: false,
  },
];

/**
 * Obtiene la configuración de un banco por su ID
 * @param {string} bankId - ID del banco
 * @returns {Object|null} Configuración del banco o null
 */
export const getBankConfigById = (bankId) => {
  return bankConfigurations.find(bank => bank.id === bankId) || null;
};

/**
 * Obtiene todos los bancos que ofrecen MiVivienda
 * @returns {Array} Lista de bancos con programa MiVivienda
 */
export const getMiviviendaBanks = () => {
  return bankConfigurations.filter(bank => bank.mivivienda);
};

/**
 * Obtiene el banco con la tasa más baja
 * @returns {Object} Banco con mejor tasa
 */
export const getBestRateBank = () => {
  return bankConfigurations
    .filter(bank => bank.id !== 'custom')
    .reduce((best, current) =>
      current.config.tasa_anual < best.config.tasa_anual ? current : best
    );
};

/**
 * Formatea los valores de la configuración para el formulario
 * @param {Object} config - Configuración del banco
 * @param {boolean} mancomunado - Si es seguro mancomunado
 * @returns {Object} Valores formateados para el formulario
 */
export const formatBankConfigForForm = (config, mancomunado = false) => {
  return {
    tasa_anual: config.tasa_anual * 100, // Convertir a porcentaje para mostrar
    tipo_tasa: config.tipo_tasa,
    seguro_desgravamen: (mancomunado ? config.seguro_desgravamen_mancomunado : config.seguro_desgravamen) * 100,
    seguro_inmueble_anual: config.seguro_inmueble_anual * 100,
    comision_desembolso: config.comision_desembolso,
    comision_evaluacion: config.comision_evaluacion,
    gastos_administrativos: config.gastos_administrativos,
    portes: config.portes,
    dias_anio: config.dias_anio,
    frecuencia: config.frecuencia,
    frecuencia_pago: config.frecuencia_pago,
  };
};
