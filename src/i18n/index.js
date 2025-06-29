import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import nl from './locales/nl.json'
import en from './locales/en.json'

const resources = {
  nl: {
    translation: nl
  },
  en: {
    translation: en
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'nl', // Default to Dutch
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  })

export default i18n