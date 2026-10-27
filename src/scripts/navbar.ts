// src/scripts/navbar.ts
// Interactive handlers resilient to Astro 5 ClientRouter view transitions

let activeKeydownHandler: ((e: KeyboardEvent) => void) | null = null;
let activeCloseMenu: (() => void) | null = null;
let isMobileMenuOpen = false;

export function initNavbar(): void {
  // 1. Command Palette trigger
  const searchBtns = [
    document.getElementById('nav-search-btn'),
    document.getElementById('mobile-search-btn'),
  ].filter(Boolean);

  searchBtns.forEach((btn) => {
    btn?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('open-command-palette'));
    });
  });

  // 2. Mobile Menu Toggle logic
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-menu-drawer');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  const iconHamburger = document.getElementById('icon-hamburger');
  const iconClose = document.getElementById('icon-close');
  const mainEl = document.querySelector('main');
  const footerEl = document.querySelector('footer');

  let isOpen = false;
  isMobileMenuOpen = false;

  // Defensive reset of any leftover locks on page transition
  if (document.body.style.overflow === 'hidden') {
    document.body.style.overflow = '';
  }
  if (mainEl?.hasAttribute('inert')) {
    mainEl.removeAttribute('inert');
  }
  if (footerEl?.hasAttribute('inert')) {
    footerEl.removeAttribute('inert');
  }

  function openMenu() {
    isOpen = true;
    isMobileMenuOpen = true;
    menuToggle?.setAttribute('aria-expanded', 'true');
    drawer?.classList.remove('hidden');
    backdrop?.classList.remove('hidden');
    iconHamburger?.classList.add('hidden');
    iconClose?.classList.remove('hidden');
    if (mainEl) mainEl.setAttribute('inert', '');
    if (footerEl) footerEl.setAttribute('inert', '');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isOpen = false;
    isMobileMenuOpen = false;
    menuToggle?.setAttribute('aria-expanded', 'false');
    drawer?.classList.add('hidden');
    backdrop?.classList.add('hidden');
    iconHamburger?.classList.remove('hidden');
    iconClose?.classList.add('hidden');
    if (mainEl) mainEl.removeAttribute('inert');
    if (footerEl) footerEl.removeAttribute('inert');
    document.body.style.overflow = '';
  }

  activeCloseMenu = closeMenu;

  menuToggle?.addEventListener('click', () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop?.addEventListener('click', closeMenu);

  // Close on navigation link clicks inside mobile menu
  const mobileLinks = drawer?.querySelectorAll('.mobile-nav-link');
  mobileLinks?.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Dismiss on Escape key: Clean up previous keydown listener to prevent accumulation
  if (activeKeydownHandler) {
    document.removeEventListener('keydown', activeKeydownHandler);
  }

  activeKeydownHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
      menuToggle?.focus();
    }
  };

  document.addEventListener('keydown', activeKeydownHandler);
}

// Viewport breakpoint resize listener (min-width: 768px)
if (typeof window !== 'undefined' && window.matchMedia) {
  const desktopMedia = window.matchMedia('(min-width: 768px)');
  const handleBreakpointChange = (e: MediaQueryListEvent | MediaQueryList) => {
    if (e.matches && isMobileMenuOpen && activeCloseMenu) {
      activeCloseMenu();
    }
  };

  if (desktopMedia.addEventListener) {
    desktopMedia.addEventListener('change', handleBreakpointChange);
  } else if ('addListener' in desktopMedia) {
    (desktopMedia as any).addListener(handleBreakpointChange);
  }

  window.addEventListener('resize', () => {
    if (desktopMedia.matches && isMobileMenuOpen && activeCloseMenu) {
      activeCloseMenu();
    }
  });
}

// Teardown and reset on Astro View Transitions before document swap
if (typeof document !== 'undefined') {
  document.addEventListener('astro:before-swap', () => {
    if (activeCloseMenu) {
      activeCloseMenu();
      activeCloseMenu = null;
    }
    isMobileMenuOpen = false;
    document.body.style.overflow = '';

    if (activeKeydownHandler) {
      document.removeEventListener('keydown', activeKeydownHandler);
      activeKeydownHandler = null;
    }
  });

  document.addEventListener('astro:page-load', initNavbar);
}
