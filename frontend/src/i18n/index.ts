import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './es.json';
import en from './en.json';

/**
 * Internacionalizacion. Patron: textos nuevos o migrados usan t('clave') con el catalogo de es.json/en.json;
 * los pendientes siguen en español (idioma base) hasta migrarse. Variables de mercado: {{zone}}, {{zones}}, {{taxId}}.
 */
export const LANGUAGES = [{ code: 'es', label: 'Español' }, { code: 'en', label: 'English' }] as const;
const KEY = 'rm:lang';

const initial = (() => {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved && LANGUAGES.some((l) => l.code === saved)) return saved;
  } catch { /* sin storage */ }
  return 'es';
})();

i18n.use(initReactI18next).init({
  resources: { es: { translation: es }, en: { translation: en } },
  lng: initial,
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
});

document.documentElement.lang = initial;
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  try { localStorage.setItem(KEY, lng); } catch { /* ignore */ }
});

export default i18n;
