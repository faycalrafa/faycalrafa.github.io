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
  // Update badge labels
  const badges = document.querySelectorAll<HTMLElement>('[data-current-lang-badge]');
  badges.forEach((badge) => {
    badge.textContent = lang.toUpperCase();
  });

  const fullLabels = document.querySelectorAll<HTMLElement>('[data-current-lang-full]');
  fullLabels.forEach((label) => {
    label.textContent = lang === 'ar' ? 'العربية' : lang === 'fr' ? 'Français' : 'English';
  });

  // Update button states and active dots
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-lang-btn]');
  buttons.forEach((btn) => {
    const targetLang = btn.getAttribute('data-lang-btn');
    const isActive = targetLang === lang;
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');

    const dot = btn.querySelector<HTMLElement>('.active-dot');
    if (dot) {
      if (isActive) {
        dot.classList.remove('opacity-0');
        dot.classList.add('opacity-100');
      } else {
        dot.classList.remove('opacity-100');
        dot.classList.add('opacity-0');
      }
    }

    if (isActive) {
      btn.classList.add('text-blue-500', 'font-bold');
      btn.classList.remove('text-zinc-300', 'text-zinc-700');
    } else {
      btn.classList.remove('text-blue-500', 'font-bold');
      btn.classList.add('text-zinc-300');
    }
  });
}

export function closeAllLangDropdowns(): void {
  const dropdowns = document.querySelectorAll<HTMLElement>('[data-lang-dropdown]');
  dropdowns.forEach((dd) => {
    const menu = dd.querySelector<HTMLElement>('[data-lang-menu]');
    const trigger = dd.querySelector<HTMLButtonElement>('[data-lang-dropdown-trigger]');
    const chevron = dd.querySelector<HTMLElement>('[data-lang-chevron]');
    if (menu) menu.classList.add('hidden');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    if (chevron) chevron.classList.remove('rotate-180');
  });
}

export function toggleLangDropdown(dropdownEl: HTMLElement): void {
  const menu = dropdownEl.querySelector<HTMLElement>('[data-lang-menu]');
  const trigger = dropdownEl.querySelector<HTMLButtonElement>('[data-lang-dropdown-trigger]');
  const chevron = dropdownEl.querySelector<HTMLElement>('[data-lang-chevron]');
  if (!menu) return;

  const isClosed = menu.classList.contains('hidden');
  closeAllLangDropdowns();

  if (isClosed) {
    menu.classList.remove('hidden');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    if (chevron) chevron.classList.add('rotate-180');
  }
}

let handlersAttached = false;

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

  applyTranslations(current);
  updateActiveButtons(current);

  if (!handlersAttached) {
    handlersAttached = true;

    // Dropdown trigger toggles & menu item clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      // 1. Dropdown Trigger Click
      const trigger = target?.closest<HTMLButtonElement>('[data-lang-dropdown-trigger]');
      if (trigger) {
        e.stopPropagation();
        const dropdown = trigger.closest<HTMLElement>('[data-lang-dropdown]');
        if (dropdown) toggleLangDropdown(dropdown);
        return;
      }

      // 2. Language Option Click
      const btn = target?.closest<HTMLButtonElement>('[data-lang-btn]');
      if (btn) {
        const lang = btn.getAttribute('data-lang-btn') as Lang;
        if (lang && (lang === 'en' || lang === 'fr' || lang === 'ar')) {
          setLang(lang);
          closeAllLangDropdowns();
        }
        return;
      }

      // 3. Click outside closes dropdowns
      if (!target.closest('[data-lang-dropdown]')) {
        closeAllLangDropdowns();
      }
    });

    // Escape key closes dropdowns
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllLangDropdowns();
      }
    });
  }
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
    closeAllLangDropdowns();
  });
}
