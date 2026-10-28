// src/scripts/textmorph-showcase.ts
// Interactive smartphone mockup and lightbox controller for TextMorph Showcase

import { APP_SCREENS, type AppScreen } from '../data/textmorph-screens';
import { t, getCurrentLang } from './i18n';

export function initAppShowcase(): void {
  const screens: AppScreen[] = APP_SCREENS;
  let activeIndex = 0;

  const screenImg = document.getElementById('mockup-screen-img') as HTMLImageElement | null;
  const incomingImg = document.getElementById('mockup-screen-incoming') as HTMLImageElement | null;
  const detailTag = document.getElementById('detail-tag');
  const detailNum = document.getElementById('detail-num');
  const detailTitle = document.getElementById('detail-title');
  const detailSubtitle = document.getElementById('detail-subtitle');
  const detailDesc = document.getElementById('detail-desc');
  const detailHighlights = document.getElementById('detail-highlights');
  const detailTech = document.getElementById('detail-tech');

  const tabButtons = document.querySelectorAll<HTMLElement>('.screen-tab-btn');
  const thumbnailCards = document.querySelectorAll<HTMLElement>('.thumbnail-card');
  const prevBtn = document.getElementById('btn-prev-screen');
  const nextBtn = document.getElementById('btn-next-screen');

  const phoneTrigger = document.getElementById('phone-screen-trigger');
  const lightbox = document.getElementById('screenshot-lightbox') as HTMLDialogElement | null;
  const lightboxImg = document.getElementById('lightbox-img') as HTMLImageElement | null;
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

  // Preload all Play Store images into browser memory
  screens.forEach((s) => {
    const img = new Image();
    img.src = s.image;
  });

  let isImageTransitioning = false;
  let transitionTimer: any = null;

  const mobileSnapCount = document.getElementById('mobile-snap-count');
  const mobileSnapHint = document.getElementById('mobile-snap-hint');
  const mobileSnapDot = document.getElementById('mobile-snap-dot');
  const mobileSnapUnlockBtn = document.getElementById('mobile-snap-unlock-btn');

  function updateMobileIndicator() {
    if (!mobileSnapCount) return;
    mobileSnapCount.textContent = `Screen ${activeIndex + 1} of ${screens.length}`;
    if (mobileSnapHint) {
      mobileSnapHint.textContent = activeIndex === screens.length - 1 ? 'Scroll down for architecture' : 'Swipe to change';
    }
    if (mobileSnapDot) {
      mobileSnapDot.className = activeIndex === screens.length - 1 ? 'h-2 w-2 rounded-full bg-slate-400' : 'h-2 w-2 rounded-full bg-slate-400 animate-pulse';
    }
    if (mobileSnapUnlockBtn) {
      if (activeIndex === screens.length - 1) {
        mobileSnapUnlockBtn.textContent = 'Continue ↓';
        mobileSnapUnlockBtn.onclick = () => {
          const nextSec = document.getElementById('features-heading');
          if (nextSec) nextSec.scrollIntoView({ behavior: 'smooth' });
        };
      } else {
        mobileSnapUnlockBtn.textContent = 'Next ↓';
        mobileSnapUnlockBtn.onclick = () => {
          setScreen(activeIndex + 1);
        };
      }
    }
  }

  function setScreen(index: number) {
    if (index < 0 || index >= screens.length || (index === activeIndex && !isImageTransitioning)) return;
    activeIndex = index;
    const data = screens[index];

    // Smooth Cross-fade on Smartphone Mockup
    if (screenImg && incomingImg && screenImg.getAttribute('src') !== data.image) {
      clearTimeout(transitionTimer);
      incomingImg.src = data.image;
      incomingImg.alt = data.title;
      incomingImg.classList.remove('opacity-0');
      incomingImg.classList.add('opacity-100');
      isImageTransitioning = true;

      transitionTimer = setTimeout(() => {
        screenImg.src = data.image;
        screenImg.alt = data.title;
        incomingImg.classList.remove('opacity-100');
        incomingImg.classList.add('opacity-0');
        isImageTransitioning = false;
      }, 260);
    } else if (screenImg && !incomingImg) {
      screenImg.src = data.image;
      screenImg.alt = data.title;
    }

    const lang = getCurrentLang();
    const screenKey = data.id.replace(/-/g, '_');
    const trTag = t(`textmorph.screens.${screenKey}.tag`, lang);
    const trTitle = t(`textmorph.screens.${screenKey}.title`, lang);
    const trSub = t(`textmorph.screens.${screenKey}.subtitle`, lang);
    const trDesc = t(`textmorph.screens.${screenKey}.desc`, lang);

    if (detailTag) detailTag.textContent = (trTag !== `textmorph.screens.${screenKey}.tag` ? trTag : null) || data.tag;
    if (detailNum) detailNum.textContent = `${data.num} / ${String(screens.length).padStart(2, '0')}`;
    if (detailTitle) detailTitle.textContent = (trTitle !== `textmorph.screens.${screenKey}.title` ? trTitle : null) || data.title;
    if (detailSubtitle) detailSubtitle.textContent = (trSub !== `textmorph.screens.${screenKey}.subtitle` ? trSub : null) || data.subtitle;
    if (detailDesc) detailDesc.textContent = (trDesc !== `textmorph.screens.${screenKey}.desc` ? trDesc : null) || data.description;
    if (detailTech) detailTech.textContent = data.tech;

    if (detailHighlights) {
      detailHighlights.innerHTML = data.highlights
        .map(
          (h) => `
            <li class="flex items-start gap-2.5">
              <svg class="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
              </svg>
              <span>${h}</span>
            </li>
          `
        )
        .join('');
    }

    // Update Tab Buttons Active Styling & Localized Title
    tabButtons.forEach((btn, i) => {
      const isSelected = i === index;
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      const scr = screens[i];
      if (scr) {
        const k = scr.id.replace(/-/g, '_');
        const tit = t(`textmorph.screens.${k}.title`, lang);
        const titleSpan = btn.querySelector('span:last-child');
        if (titleSpan && tit && tit !== `textmorph.screens.${k}.title`) titleSpan.textContent = tit;
      }
      btn.className = isSelected
        ? 'screen-tab-btn flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-slate-500 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 scale-102'
        : 'screen-tab-btn flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-slate-500 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 hover:scale-101';
    });

    // Update Thumbnail Strip Cards Active Styling & Localized Labels
    thumbnailCards.forEach((card, i) => {
      const scr = screens[i];
      if (scr) {
        const k = scr.id.replace(/-/g, '_');
        const tit = t(`textmorph.screens.${k}.title`, lang);
        const tg = t(`textmorph.screens.${k}.tag`, lang);
        const titEl = card.querySelector('.text-\\[11px\\]');
        const tgEl = card.querySelector('.text-\\[10px\\]');
        if (titEl && tit && tit !== `textmorph.screens.${k}.title`) titEl.textContent = tit;
        if (tgEl && tg && tg !== `textmorph.screens.${k}.tag`) tgEl.textContent = tg;
      }
      const isSelected = i === index;
      card.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      card.className = isSelected
        ? 'thumbnail-card group relative flex flex-col items-center gap-2 rounded-xl p-2 transition-all cursor-pointer ring-2 ring-slate-500 dark:ring-slate-400 bg-slate-500/10 dark:bg-slate-500/15 scale-103'
        : 'thumbnail-card group relative flex flex-col items-center gap-2 rounded-xl p-2 transition-all cursor-pointer opacity-70 hover:opacity-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60';
    });

    updateMobileIndicator();
  }

  // Bind tab buttons
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-screen-index') || '0', 10);
      setScreen(idx);
    });
  });

  // Bind thumbnail cards
  thumbnailCards.forEach((card) => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-screen-index') || '0', 10);
      setScreen(idx);
    });
  });

  // Navigation arrow buttons
  prevBtn?.addEventListener('click', () => {
    const nextIdx = activeIndex === 0 ? screens.length - 1 : activeIndex - 1;
    setScreen(nextIdx);
  });

  nextBtn?.addEventListener('click', () => {
    const nextIdx = activeIndex === screens.length - 1 ? 0 : activeIndex + 1;
    setScreen(nextIdx);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const showcase = document.getElementById('interactive-showcase');
    if (!showcase) return;
    const rect = showcase.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!isVisible) return;

    if (e.key === 'ArrowLeft') {
      const nextIdx = activeIndex === 0 ? screens.length - 1 : activeIndex - 1;
      setScreen(nextIdx);
    } else if (e.key === 'ArrowRight') {
      const nextIdx = activeIndex === screens.length - 1 ? 0 : activeIndex + 1;
      setScreen(nextIdx);
    }
  });

  // Lightbox functionality
  if (phoneTrigger && lightbox && lightboxImg) {
    phoneTrigger.addEventListener('click', () => {
      const currentData = screens[activeIndex];
      lightboxImg.src = currentData.image;
      lightboxImg.alt = currentData ? currentData.title : 'TextMorph Play Store Screenshot';
      if (lightboxTitle && currentData) {
        lightboxTitle.textContent = `${currentData.num} · ${currentData.title}`;
      }
      lightbox.showModal();
    });
  }

  if (lightboxCloseBtn && lightbox) {
    lightboxCloseBtn.addEventListener('click', () => lightbox.close());
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      const rect = lightbox.getBoundingClientRect();
      const isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      if (!isInDialog) {
        lightbox.close();
      }
    });
  }

  window.addEventListener('lang-changed', () => {
    setScreen(activeIndex);
  });

  updateMobileIndicator();
}

if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', initAppShowcase);
}
