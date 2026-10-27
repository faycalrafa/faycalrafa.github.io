// src/scripts/i18n.ts
// Universal i18n translation system for Faycal Rafa Portfolio
// Supports EN (default), FR (French), AR (Arabic with RTL)
// Compliant with Astro 5 ClientRouter, Tailwind CSS v4, and <= 500 lines rule.

import commonEn from '../locales/common.json';
import commonFr from '../locales/common-fr.json';
import commonAr from '../locales/common-ar.json';

import heroEn from '../locales/hero.json';
import heroFr from '../locales/hero-fr.json';
import heroAr from '../locales/hero-ar.json';

import careerEn from '../locales/career.json';
import careerFr from '../locales/career-fr.json';
import careerAr from '../locales/career-ar.json';

import projectsEn from '../locales/projects.json';
import projectsFr from '../locales/projects-fr.json';
import projectsAr from '../locales/projects-ar.json';

import textmorphEn from '../locales/textmorph.json';
import textmorphFr from '../locales/textmorph-fr.json';
import textmorphAr from '../locales/textmorph-ar.json';

import bookreaderEn from '../locales/bookreader.json';
import bookreaderFr from '../locales/bookreader-fr.json';
import bookreaderAr from '../locales/bookreader-ar.json';

import cvEn from '../locales/cv.json';
import cvFr from '../locales/cv-fr.json';
import cvAr from '../locales/cv-ar.json';

import contactEn from '../locales/contact.json';
import contactFr from '../locales/contact-fr.json';
import contactAr from '../locales/contact-ar.json';

export type Lang = 'en' | 'fr' | 'ar';

export const translations: Record<Lang, Record<string, any>> = {
  en: {
    common: commonEn,
    hero: heroEn,
    career: careerEn,
    projects: projectsEn,
    textmorph: textmorphEn,
    bookreader: bookreaderEn,
    cv: cvEn,
    contact: contactEn,
  },
  fr: {
    common: commonFr,
    hero: heroFr,
    career: careerFr,
    projects: projectsFr,
    textmorph: textmorphFr,
    bookreader: bookreaderFr,
    cv: cvFr,
    contact: contactFr,
  },
  ar: {
    common: commonAr,
    hero: heroAr,
    career: careerAr,
    projects: projectsAr,
    textmorph: textmorphAr,
    bookreader: bookreaderAr,
    cv: cvAr,
    contact: contactAr,
  },
};

export function getNestedValue(obj: any, path: string): string | undefined {
  if (!obj || !path) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  return typeof current === 'string' ? current : undefined;
}

export function t(key: string, lang: Lang = 'en'): string {
  const parts = key.split('.');
  const domain = parts[0];
  const subpath = parts.slice(1).join('.');

  const domainObj = translations[lang]?.[domain] || translations.en[domain];
  const value = getNestedValue(domainObj, subpath);
  if (value !== undefined) return value;

  // Fallback to English
  const enDomainObj = translations.en[domain];
  const fallback = getNestedValue(enDomainObj, subpath);
  return fallback || key;
}

export function getCurrentLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const paramLang = urlParams.get('lang') as Lang;
    if (paramLang && (paramLang === 'en' || paramLang === 'fr' || paramLang === 'ar')) {
      return paramLang;
    }
    const saved = localStorage.getItem('portfolio_lang') as Lang;
    if (saved && (saved === 'en' || saved === 'fr' || saved === 'ar')) {
      return saved;
    }
  } catch (e) {}
  return 'en';
}

export function setLang(lang: Lang): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('portfolio_lang', lang);
  } catch (e) {}

  document.documentElement.lang = lang;
  if (lang === 'ar') {
    document.documentElement.dir = 'rtl';
    document.documentElement.classList.add('rtl-layout');
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.classList.remove('rtl-layout');
  }

  applyTranslations(lang);
  updateActiveButtons(lang);
  window.dispatchEvent(new CustomEvent('lang-changed', { detail: { lang } }));
}

export function applyTranslations(lang: Lang): void {
  if (typeof document === 'undefined') return;

  // Text content replacements
  const textElements = document.querySelectorAll<HTMLElement>('[data-i18n]');
  textElements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      const translated = t(key, lang);
      if (translated) {
        el.textContent = translated;
      }
    }
  });

  // HTML content replacements
  const htmlElements = document.querySelectorAll<HTMLElement>('[data-i18n-html]');
  htmlElements.forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    if (key) {
      const translated = t(key, lang);
      if (translated) {
        el.innerHTML = translated;
      }
    }
  });

  // Aria-label replacements
  const ariaElements = document.querySelectorAll<HTMLElement>('[data-i18n-aria]');
  ariaElements.forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    if (key) {
      const translated = t(key, lang);
      if (translated) {
        el.setAttribute('aria-label', translated);
      }
    }
  });

  // Placeholder replacements
  const placeholderElements = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]');
  placeholderElements.forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) {
      const translated = t(key, lang);
      if (translated) {
        el.placeholder = translated;
      }
    }
  });
}

function updateActiveButtons(lang: Lang): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-lang-btn]');
  buttons.forEach((btn) => {
    const targetLang = btn.getAttribute('data-lang-btn');
    const isActive = targetLang === lang;
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    if (isActive) {
      btn.classList.add('bg-blue-600', 'text-white', 'dark:bg-blue-500');
      btn.classList.remove('text-zinc-400', 'hover:text-zinc-100', 'text-zinc-600', 'hover:text-zinc-900');
    } else {
      btn.classList.remove('bg-blue-600', 'text-white', 'dark:bg-blue-500');
      btn.classList.add('text-zinc-400', 'hover:text-zinc-100');
    }
  });
}

export function initI18n(): void {
  if (typeof window === 'undefined') return;

  const current = getCurrentLang();
  document.documentElement.lang = current;
  if (current === 'ar') {
    document.documentElement.dir = 'rtl';
    document.documentElement.classList.add('rtl-layout');
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.classList.remove('rtl-layout');
  }

  // Bind click handlers to language change buttons
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement)?.closest<HTMLButtonElement>('[data-lang-btn]');
    if (target) {
      const lang = target.getAttribute('data-lang-btn') as Lang;
      if (lang && (lang === 'en' || lang === 'fr' || lang === 'ar')) {
        setLang(lang);
      }
    }
  });

  applyTranslations(current);
  updateActiveButtons(current);
}

// ClientRouter lifecycle listeners
if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', () => {
    const current = getCurrentLang();
    document.documentElement.lang = current;
    if (current === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.classList.add('rtl-layout');
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.classList.remove('rtl-layout');
    }
    applyTranslations(current);
    updateActiveButtons(current);
  });
}
