import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { useUIStore } from '@/store/ui'

// Import translation files
import en from './locales/en/common.json'
import hi from './locales/hi/common.json'
import kn from './locales/kn/common.json'

const resources = {
  en: { common: en },
  hi: { common: hi },
  kn: { common: kn },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  })

// Listen for language changes from store
useUIStore.subscribe((state: { language: 'en' | 'hi' | 'kn' }) => {
  i18n.changeLanguage(state.language)
})

export default i18n
