// src/scripts/bookreader-showcase.ts
// Interactive smartphone mockup, gesture snapping, and latest release auto-hydration controller for BookReader

import { APP_SCREENS, type BookReaderScreen } from '../data/bookreader-screens';

declare global {
  interface Window {
    _bookreaderShowcaseCleanup?: () => void;
  }
}

export function initAppShowcase(): void {
  const screens: BookReaderScreen[] = APP_SCREENS;
  let activeIndex = 0;

  const screenImg = document.getElementById('mockup-screen-img') as HTMLImageElement | null;
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

  // Preload all screenshot images into browser memory to eliminate image decoding lag
  screens.forEach((s) => {
    const img = new Image();
    img.src = s.image;
  });

  const incomingImg = document.getElementById('mockup-screen-incoming') as HTMLImageElement | null;
  let isImageTransitioning = false;
  let transitionTimer: any = null;

  // Update mobile lock indicator if present
  const mobileSnapCount = document.getElementById('mobile-snap-count');
  const mobileSnapHint = document.getElementById('mobile-snap-hint');
  const mobileSnapDot = document.getElementById('mobile-snap-dot');
  const mobileSnapUnlockBtn = document.getElementById('mobile-snap-unlock-btn') as HTMLButtonElement | null;

  function updateMobileIndicator() {
    if (!mobileSnapCount) return;
    mobileSnapCount.textContent = `Screen ${activeIndex + 1} of ${screens.length}`;
    if (mobileSnapHint) {
      mobileSnapHint.textContent = activeIndex === screens.length - 1 ? 'Scroll down for architecture' : 'Scroll or swipe to change';
    }
    if (mobileSnapDot) {
      mobileSnapDot.className = activeIndex === screens.length - 1 ? 'h-2 w-2 rounded-full bg-emerald-400' : 'h-2 w-2 rounded-full bg-amber-400 animate-pulse';
    }
    if (mobileSnapUnlockBtn) {
      if (activeIndex === screens.length - 1) {
        mobileSnapUnlockBtn.textContent = 'Continue ↓';
        mobileSnapUnlockBtn.onclick = () => {
          const nextSec = document.getElementById('arch-heading') || document.getElementById('architecture-heading');
          if (nextSec) nextSec.scrollIntoView({ behavior: 'smooth' });
        };
      } else {
        mobileSnapUnlockBtn.textContent = 'Next ↓';
        mobileSnapUnlockBtn.onclick = () => {
          setScreen(activeIndex + 1, 'forward');
        };
      }
    }
  }

  function setScreen(index: number, direction?: 'forward' | 'backward') {
    if (index < 0) index = screens.length - 1;
    if (index >= screens.length) index = 0;
    if (index === activeIndex && !isImageTransitioning) return;

    const prevIndex = activeIndex;
    activeIndex = index;

    const data = screens[activeIndex];
    if (!data) return;

    const effectiveDirection = direction || (index >= prevIndex ? 'forward' : 'backward');

    // Smooth image transition without any black screen or flash
    if (screenImg && incomingImg) {
      if (transitionTimer) clearTimeout(transitionTimer);

      const isForward = effectiveDirection === 'forward';
      const slideInFrom = isForward ? '48px' : '-48px';
      const slideOutTo = isForward ? '-48px' : '48px';

      // Set incoming layer to new image
      incomingImg.src = data.image;
      incomingImg.alt = data.title;

      // Set initial un-transitioned position of incoming layer
      incomingImg.style.transition = 'none';
      incomingImg.style.opacity = '0';
      incomingImg.style.transform = `translateY(${slideInFrom}) scale(0.97)`;

      // Ensure active layer is visible
      screenImg.style.transition = 'none';
      screenImg.style.opacity = '1';
      screenImg.style.transform = 'translateY(0) scale(1)';

      // Force reflow
      void incomingImg.offsetHeight;

      // Cross-fade & snappy directional slide matching home snap feel
      isImageTransitioning = true;
      const animCurve = 'cubic-bezier(0.16, 1, 0.3, 1)';
      incomingImg.style.transition = `opacity 340ms ${animCurve}, transform 340ms ${animCurve}`;
      incomingImg.style.opacity = '1';
      incomingImg.style.transform = 'translateY(0) scale(1)';

      screenImg.style.transition = `opacity 340ms ${animCurve}, transform 340ms ${animCurve}`;
      screenImg.style.opacity = '0';
      screenImg.style.transform = `translateY(${slideOutTo}) scale(0.97)`;

      transitionTimer = setTimeout(() => {
        screenImg.src = data.image;
        screenImg.alt = data.title;
        screenImg.style.transition = 'none';
        screenImg.style.opacity = '1';
        screenImg.style.transform = 'none';

        incomingImg.style.transition = 'none';
        incomingImg.style.opacity = '0';
        incomingImg.style.transform = 'none';
        isImageTransitioning = false;
      }, 350);
    } else if (screenImg) {
      screenImg.src = data.image;
      screenImg.alt = data.title;
    }

    // Subtly transition details container in sync
    const detailsContainer = document.getElementById('screen-details-container');
    if (detailsContainer) {
      detailsContainer.style.opacity = '0.5';
      detailsContainer.style.transform = effectiveDirection === 'forward' ? 'translateY(4px)' : 'translateY(-4px)';
      setTimeout(() => {
        detailsContainer.style.opacity = '1';
        detailsContainer.style.transform = 'translateY(0)';
      }, 80);
    }

    // Update Details text
    if (detailTag) detailTag.textContent = data.tag;
    if (detailNum) detailNum.textContent = `Screen ${data.num} / 05`;
    if (detailTitle) detailTitle.textContent = data.title;
    if (detailSubtitle) detailSubtitle.textContent = data.subtitle;
    if (detailDesc) detailDesc.textContent = data.description;
    if (detailTech) detailTech.textContent = data.tech;

    // Update Highlights list
    if (detailHighlights) {
      detailHighlights.innerHTML = data.highlights
        .map(
          (h) => `
          <li class="flex items-start gap-2.5">
            <svg class="h-4 w-4 shrink-0 text-amber-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
            </svg>
            <span>${h}</span>
          </li>
        `
        )
        .join('');
    }

    // Update tab button styles
    tabButtons.forEach((btn, i) => {
      const isSelected = i === activeIndex;
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      if (isSelected) {
        btn.className = 'screen-tab-btn inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-500/50';
      } else {
        btn.className = 'screen-tab-btn inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none bg-white text-zinc-700 hover:bg-amber-50/80 border border-zinc-200 dark:bg-zinc-800/80 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-800';
      }
    });

    // Update thumbnail borders
    thumbnailCards.forEach((card, i) => {
      if (i === activeIndex) {
        card.className = 'thumbnail-card group relative rounded-xl border p-2 text-left transition-all cursor-pointer border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30';
      } else {
        card.className = 'thumbnail-card group relative rounded-xl border p-2 text-left transition-all cursor-pointer border-zinc-200/90 bg-white dark:border-zinc-800 dark:bg-zinc-900/60 hover:border-amber-400/60';
      }
    });

    // Sync mobile snap indicator
    updateMobileIndicator();
  }

  // Tab clicks
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index') || '0', 10);
      setScreen(idx, idx >= activeIndex ? 'forward' : 'backward');
    });
  });

  // Thumbnail clicks
  thumbnailCards.forEach((card) => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-thumbnail-index') || '0', 10);
      setScreen(idx, idx >= activeIndex ? 'forward' : 'backward');
    });
  });

  // Arrows
  prevBtn?.addEventListener('click', () => setScreen(activeIndex - 1, 'backward'));
  nextBtn?.addEventListener('click', () => setScreen(activeIndex + 1, 'forward'));

  // Lightbox open/close
  phoneTrigger?.addEventListener('click', () => {
    const cur = screens[activeIndex];
    if (lightbox && lightboxImg && cur) {
      lightboxImg.src = cur.image;
      lightboxImg.alt = cur.title;
      if (lightboxTitle) lightboxTitle.textContent = `${cur.num} · ${cur.title}`;
      lightbox.showModal();
    }
  });

  lightboxCloseBtn?.addEventListener('click', () => {
    lightbox?.close();
  });

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.close();
  });

  // ═══════════════════ CENTER-STOP & UNIVERSAL IN-PLACE SHOWCASE SNAPPING ═══════════════════
  const showcaseSection = document.getElementById('app-showcase-section') || document.getElementById('app-showcase-card') || phoneTrigger;

  let isWheelCooldown = false;
  const WHEEL_COOLDOWN_MS = 400;

  function isShowcaseCentered() {
    if (!showcaseSection) return false;
    const rect = showcaseSection.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    return Math.abs(sectionCenter - viewportCenter) < 180;
  }

  function snapCenterIfNeeded() {
    if (!showcaseSection) return;
    const rect = showcaseSection.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    const diff = sectionCenter - viewportCenter;
    if (Math.abs(diff) > 15 && Math.abs(diff) < 220) {
      window.scrollBy({ top: diff, behavior: 'smooth' });
    }
  }

  function onWindowWheel(e: WheelEvent) {
    if (!isShowcaseCentered()) return;

    if (e.deltaY > 15) {
      if (activeIndex < screens.length - 1) {
        e.preventDefault();
        snapCenterIfNeeded();
        if (!isWheelCooldown) {
          isWheelCooldown = true;
          setScreen(activeIndex + 1, 'forward');
          setTimeout(() => {
            isWheelCooldown = false;
          }, WHEEL_COOLDOWN_MS);
        }
      }
    } else if (e.deltaY < -15) {
      if (activeIndex > 0) {
        e.preventDefault();
        snapCenterIfNeeded();
        if (!isWheelCooldown) {
          isWheelCooldown = true;
          setScreen(activeIndex - 1, 'backward');
          setTimeout(() => {
            isWheelCooldown = false;
          }, WHEEL_COOLDOWN_MS);
        }
      }
    }
  }

  window.addEventListener('wheel', onWindowWheel, { passive: false });

  // Mobile Touch Swiping Controller
  let touchStartX = 0;
  let touchStartY = 0;
  let isTouchCooldown = false;
  const TOUCH_COOLDOWN_MS = 380;

  function onWindowTouchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }

  function onWindowTouchMove(e: TouchEvent) {
    if (!isShowcaseCentered() || e.touches.length !== 1) return;

    const deltaX = e.touches[0].clientX - touchStartX;
    const deltaY = e.touches[0].clientY - touchStartY;

    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 20) {
      if (deltaY < 0) {
        if (activeIndex < screens.length - 1) {
          e.preventDefault();
          snapCenterIfNeeded();
          if (!isTouchCooldown) {
            isTouchCooldown = true;
            setScreen(activeIndex + 1, 'forward');
            touchStartY = e.touches[0].clientY;
            setTimeout(() => {
              isTouchCooldown = false;
            }, TOUCH_COOLDOWN_MS);
          }
        }
      } else if (deltaY > 0) {
        if (activeIndex > 0) {
          e.preventDefault();
          snapCenterIfNeeded();
          if (!isTouchCooldown) {
            isTouchCooldown = true;
            setScreen(activeIndex - 1, 'backward');
            touchStartY = e.touches[0].clientY;
            setTimeout(() => {
              isTouchCooldown = false;
            }, TOUCH_COOLDOWN_MS);
          }
        }
      }
    }
  }

  function onWindowTouchEnd(e: TouchEvent) {
    if (!isShowcaseCentered() || e.changedTouches.length !== 1) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        setScreen(activeIndex + 1, 'forward');
      } else {
        setScreen(activeIndex - 1, 'backward');
      }
    }
  }

  window.addEventListener('touchstart', onWindowTouchStart, { passive: true });
  window.addEventListener('touchmove', onWindowTouchMove, { passive: false });
  window.addEventListener('touchend', onWindowTouchEnd, { passive: true });

  mobileSnapUnlockBtn?.addEventListener('click', () => {
    setScreen(activeIndex + 1, 'forward');
  });

  if (window._bookreaderShowcaseCleanup) {
    window._bookreaderShowcaseCleanup();
  }

  window._bookreaderShowcaseCleanup = () => {
    window.removeEventListener('wheel', onWindowWheel);
    window.removeEventListener('touchstart', onWindowTouchStart);
    window.removeEventListener('touchmove', onWindowTouchMove);
    window.removeEventListener('touchend', onWindowTouchEnd);
  };

  document.addEventListener('astro:before-swap', window._bookreaderShowcaseCleanup, { once: true });
  updateMobileIndicator();
}

// Live client-side auto-hydration for BookReader latest release
export function initLatestReleaseHydration(): void {
  const CACHE_KEY = 'bookreader_latest_release_cache';
  const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

  const versionText = document.getElementById('bookreader-version-text');
  const downloadBtn = document.getElementById('bookreader-download-apk');
  const sizeLabel = document.getElementById('bookreader-apk-size');
  const notesLink = document.getElementById('bookreader-release-notes');

  if (!versionText || !downloadBtn) return;

  function applyRelease(data: any) {
    if (!data) return;
    if (data.tag && versionText) {
      versionText.textContent = `${data.tag} · Latest`;
    }
    if (data.apkUrl && downloadBtn) {
      downloadBtn.setAttribute('href', data.apkUrl);
      downloadBtn.setAttribute('download', `BookReader-${data.tag}.apk`);
    }
    if (data.sizeMb && sizeLabel) {
      sizeLabel.textContent = data.sizeMb;
    }
    if (data.releaseUrl && notesLink) {
      notesLink.setAttribute('href', data.releaseUrl);
      notesLink.textContent = `${data.tag} Release Notes →`;
    }
  }

  // Check sessionStorage cache first
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS && parsed.data) {
        applyRelease(parsed.data);
        return;
      }
    }
  } catch {
    // Ignore storage errors in private browsing
  }

  // Asynchronously fetch latest release from GitHub API
  fetch('https://api.github.com/repos/faycalrafa/free-novel-reader-tts-android/releases/latest', {
    headers: { Accept: 'application/vnd.github.v3+json' },
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (!data || !data.tag_name) return;
      const apkAsset = Array.isArray(data.assets) ? data.assets.find((a: any) => a.name === 'app-release.apk') : null;
      const sizeMb = apkAsset && typeof apkAsset.size === 'number' ? `~${(apkAsset.size / (1024 * 1024)).toFixed(1)} MB` : '~20.1 MB';
      const releaseData = {
        tag: data.tag_name,
        apkUrl: apkAsset ? apkAsset.browser_download_url : `https://github.com/faycalrafa/free-novel-reader-tts-android/releases/download/${data.tag_name}/app-release.apk`,
        sizeMb,
        releaseUrl: data.html_url || `https://github.com/faycalrafa/free-novel-reader-tts-android/releases/tag/${data.tag_name}`,
      };

      applyRelease(releaseData);

      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: releaseData }));
      } catch {
        // Ignore quota issues
      }
    })
    .catch(() => {
      // Graceful fallback: prerendered SSG values remain active
    });
}
