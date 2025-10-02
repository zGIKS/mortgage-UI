import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import shared translations
import sharedEn from './locales/en/shared.json';
import sharedEs from './locales/es/shared.json';

// Import IAM translations
import iamEn from '../../iam/infrastructure/i18n/locales/en/iam.json';
import iamEs from '../../iam/infrastructure/i18n/locales/es/iam.json';

// Import Mortgage translations
import mortgageEn from '../../mortgage/infrastructure/i18n/locales/en/mortgage.json';
import mortgageEs from '../../mortgage/infrastructure/i18n/locales/es/mortgage.json';

const resources = {
  en: {
    shared: sharedEn,
    iam: iamEn,
    mortgage: mortgageEn
  },
  es: {
    shared: sharedEs,
    iam: iamEs,
    mortgage: mortgageEs
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    lng: 'es', // Fuerza el idioma inicial a español
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
      convertDetectedLanguage: (lng) => {
        // Solo permitir idiomas soportados, por defecto español
        return ['es', 'en'].includes(lng) ? lng : 'es';
      }
    },

    defaultNS: 'shared',
    ns: ['shared', 'iam', 'mortgage']
  });

export default i18n;