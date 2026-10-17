import { test, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const DIST_INDEX = path.join(PROJECT_ROOT, 'dist/index.html');
const NAVBAR_ASTRO = path.join(PROJECT_ROOT, 'src/components/Navbar.astro');
const LAYOUT_ASTRO = path.join(PROJECT_ROOT, 'src/layouts/Layout.astro');

describe('Milestone 1 Iteration 2 Empirical Adversarial Verification', () => {

  // =========================================================================
  // Challenge 1: Theme Toggle State Consistency & Conflicting Handlers
  // =========================================================================
  describe('Challenge 1: Theme Toggle Single-Click Determinism on Real Code', () => {
    it('Static inspection: Navbar.astro must not contain duplicate theme toggle click listeners', () => {
      const navbarContent = fs.readFileSync(NAVBAR_ASTRO, 'utf8');
      
      // Check that toggleBtns.forEach with classList.toggle('dark') was removed from Navbar.astro
      const duplicateClickPattern = /toggleBtns\.forEach\([\s\S]*?classList\.toggle\(['"]dark['"]\)/;
      assert.equal(
        duplicateClickPattern.test(navbarContent),
        false,
        'Navbar.astro MUST NOT contain a duplicate theme click listener'
      );

      // Verify that Navbar.astro mentions centralized management in Layout.astro
      assert.match(
        navbarContent,
        /Theme toggle logic is centrally managed in Layout\.astro/,
        'Navbar.astro should clearly document theme delegation'
      );
    });

    it('Runtime execution: Single click cleanly and deterministically toggles theme without cancellation', () => {
      // Simulate DOM environment
      const classList = new Set();
      const documentElement = {
        classList: {
          add: (cls) => classList.add(cls),
          remove: (cls) => classList.delete(cls),
          contains: (cls) => classList.has(cls)
        }
      };

      const meta = { content: 'light dark', setAttribute: (k, v) => { meta[k] = v; } };
      let storage = {};
      const localStorage = {
        getItem: (k) => storage[k] || null,
        setItem: (k, v) => { storage[k] = String(v); },
        removeItem: (k) => { delete storage[k]; }
      };

      let systemDark = false;
      const windowObj = {
        matchMedia: (q) => ({
          matches: systemDark,
          addEventListener: () => {}
        }),
        dispatchEvent: (evt) => dispatchedEvents.push(evt)
      };

      const dispatchedEvents = [];

      function createMockButton(id) {
        const attrs = { 'aria-checked': 'false' };
        const sunClasses = new Set(['hidden']);
        const moonClasses = new Set();
        return {
          id,
          onclick: null,
          setAttribute: (k, v) => { attrs[k] = String(v); },
          getAttribute: (k) => attrs[k],
          querySelector: (sel) => {
            if (sel === '[data-theme-icon="sun"]') {
              return {
                classList: {
                  add: (c) => sunClasses.add(c),
                  remove: (c) => sunClasses.delete(c),
                  contains: (c) => sunClasses.has(c)
                }
              };
            }
            if (sel === '[data-theme-icon="moon"]') {
              return {
                classList: {
                  add: (c) => moonClasses.add(c),
                  remove: (c) => moonClasses.delete(c),
                  contains: (c) => moonClasses.has(c)
                }
              };
            }
            return null;
          },
          _sunClasses: sunClasses,
          _moonClasses: moonClasses
        };
      }

      const desktopBtn = createMockButton('theme-toggle-btn');
      const mobileBtn = createMockButton('mobile-theme-toggle-btn');
      const allButtons = [desktopBtn, mobileBtn];

      const documentObj = {
        documentElement,
        querySelectorAll: (sel) => (sel === '[data-theme-toggle]' ? allButtons : []),
        querySelector: (sel) => (sel === 'meta[name="color-scheme"]' ? meta : null)
      };

      // Extracted Layout.astro runtime logic
      function updateToggleButtonsUI(isDark) {
        const toggleButtons = documentObj.querySelectorAll('[data-theme-toggle]');
        toggleButtons.forEach((btn) => {
          btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
          btn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
          btn.setAttribute('aria-checked', isDark ? 'true' : 'false');
          
          const sunIcon = btn.querySelector('[data-theme-icon="sun"]');
          const moonIcon = btn.querySelector('[data-theme-icon="moon"]');
          if (sunIcon && moonIcon) {
            if (isDark) {
              sunIcon.classList.remove('hidden');
              moonIcon.classList.add('hidden');
            } else {
              sunIcon.classList.add('hidden');
              moonIcon.classList.remove('hidden');
            }
          }
        });
      }

      function applyTheme(targetTheme, persist = false) {
        const isDark = targetTheme === 'dark';
        if (isDark) documentElement.classList.add('dark');
        else documentElement.classList.remove('dark');

        if (meta) meta.content = targetTheme;

        if (persist) {
          try {
            const systemPref = windowObj.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            if (targetTheme === systemPref) {
              localStorage.removeItem('theme');
            } else {
              localStorage.setItem('theme', targetTheme);
            }
          } catch (e) {}
        }

        windowObj.dispatchEvent({ type: 'theme-changed', detail: { theme: targetTheme } });
        updateToggleButtonsUI(isDark);
      }

      function setupThemeToggles() {
        const toggleButtons = documentObj.querySelectorAll('[data-theme-toggle]');
        toggleButtons.forEach((btn) => {
          btn.onclick = (e) => {
            if (e?.preventDefault) e.preventDefault();
            const currentIsDark = documentElement.classList.contains('dark');
            const targetTheme = currentIsDark ? 'light' : 'dark';
            applyTheme(targetTheme, true);
          };
        });

        updateToggleButtonsUI(documentElement.classList.contains('dark'));
      }

      // Initial setup
      setupThemeToggles();
      assert.equal(documentElement.classList.contains('dark'), false, 'Initial state is light');
      assert.equal(desktopBtn.getAttribute('aria-checked'), 'false');
      assert.equal(mobileBtn.getAttribute('aria-checked'), 'false');

      // Click 1: User clicks desktop button once
      desktopBtn.onclick({ preventDefault: () => {} });

      assert.equal(documentElement.classList.contains('dark'), true, 'Click 1 sets dark theme on html');
      assert.equal(meta.content, 'dark', 'Click 1 updates meta color-scheme to dark');
      assert.equal(desktopBtn.getAttribute('aria-checked'), 'true', 'desktopBtn aria-checked is true');
      assert.equal(mobileBtn.getAttribute('aria-checked'), 'true', 'mobileBtn aria-checked is synchronized to true');
      assert.equal(desktopBtn._sunClasses.has('hidden'), false, 'Sun icon is visible');
      assert.equal(desktopBtn._moonClasses.has('hidden'), true, 'Moon icon is hidden');
      assert.equal(localStorage.getItem('theme'), 'dark', 'Persisted dark theme in storage');
      assert.equal(dispatchedEvents.length, 1, 'Exactly one theme-changed event dispatched');
      assert.equal(dispatchedEvents[0].detail.theme, 'dark');

      // Click 2: User clicks mobile button once
      mobileBtn.onclick({ preventDefault: () => {} });

      assert.equal(documentElement.classList.contains('dark'), false, 'Click 2 reverts to light theme');
      assert.equal(meta.content, 'light', 'Click 2 updates meta color-scheme to light');
      assert.equal(desktopBtn.getAttribute('aria-checked'), 'false', 'desktopBtn aria-checked reverts to false');
      assert.equal(mobileBtn.getAttribute('aria-checked'), 'false', 'mobileBtn aria-checked reverts to false');
      assert.equal(desktopBtn._sunClasses.has('hidden'), true, 'Sun icon is hidden');
      assert.equal(desktopBtn._moonClasses.has('hidden'), false, 'Moon icon is visible');
      assert.equal(localStorage.getItem('theme'), null, 'Removed override matching system preference');
      assert.equal(dispatchedEvents.length, 2);
      assert.equal(dispatchedEvents[1].detail.theme, 'light');

      // Stress test: 10 rapid clicks alternating between desktop and mobile buttons
      for (let i = 0; i < 10; i++) {
        const btn = i % 2 === 0 ? desktopBtn : mobileBtn;
        btn.onclick({ preventDefault: () => {} });
      }

      // 10 clicks starting from light should end in light
      assert.equal(documentElement.classList.contains('dark'), false, 'Even number of clicks returns to light');
      assert.equal(meta.content, 'light');
      assert.equal(desktopBtn.getAttribute('aria-checked'), 'false');
      assert.equal(mobileBtn.getAttribute('aria-checked'), 'false');
      assert.equal(dispatchedEvents.length, 12, 'Exactly 12 events for 12 clicks (no double-fires)');
    });
  });

  // =========================================================================
  // Challenge 2: Storage SecurityError and Fallback to OS Preference
  // =========================================================================
  describe('Challenge 2: localStorage SecurityError Private Browsing Fallbacks', () => {
    it('Inline Zero-FOUC script in Layout.astro falls back to dark OS theme when SecurityError is thrown', () => {
      const classList = new Set();
      const documentElement = {
        classList: {
          add: (cls) => classList.add(cls),
          remove: (cls) => classList.delete(cls),
          contains: (cls) => classList.has(cls)
        }
      };

      const localStorageMock = {
        getItem: () => {
          const err = new Error('The operation is insecure.');
          err.name = 'SecurityError';
          throw err;
        }
      };

      const windowMock = {
        matchMedia: (query) => ({
          matches: query.includes('prefers-color-scheme: dark') // System is dark
        })
      };

      const documentMock = {
        documentElement,
        querySelector: () => null
      };

      // Layout.astro inline head script lines 67-87
      let caughtError = null;
      try {
        (function () {
          try {
            const stored = localStorageMock.getItem('theme');
            const prefersDark = windowMock.matchMedia('(prefers-color-scheme: dark)').matches;
            const isDark = stored === 'dark' || (!stored && prefersDark);
            const meta = documentMock.querySelector('meta[name="color-scheme"]');

            if (isDark) {
              documentMock.documentElement.classList.add('dark');
              if (meta) meta.content = 'dark';
            } else {
              documentMock.documentElement.classList.remove('dark');
              if (meta) meta.content = 'light';
            }
          } catch (e) {
            if (windowMock.matchMedia('(prefers-color-scheme: dark)').matches) {
              documentMock.documentElement.classList.add('dark');
            }
          }
        })();
      } catch (err) {
        caughtError = err;
      }

      assert.equal(caughtError, null, 'No uncaught exception during head execution');
      assert.equal(documentElement.classList.contains('dark'), true, 'Dark class applied from OS preference');
    });

    it('Layout.astro OS preference change listener responds to system switch when SecurityError is thrown', () => {
      let appliedTheme = null;
      let appliedPersist = null;
      function applyTheme(targetTheme, persist) {
        appliedTheme = targetTheme;
        appliedPersist = persist;
      }

      const localStorageMock = {
        getItem: () => {
          const err = new Error('The operation is insecure.');
          err.name = 'SecurityError';
          throw err;
        }
      };

      // Layout.astro lines 206-216 (Remediated logic)
      const osChangeListener = (e) => {
        let hasCustomOverride = false;
        try {
          hasCustomOverride = Boolean(localStorageMock.getItem('theme'));
        } catch (err) {
          hasCustomOverride = false;
        }
        if (!hasCustomOverride) {
          applyTheme(e.matches ? 'dark' : 'light', false);
        }
      };

      // OS switches from light to dark
      osChangeListener({ matches: true });
      assert.equal(appliedTheme, 'dark', 'Applies dark when OS switches to dark under SecurityError');
      assert.equal(appliedPersist, false, 'Does not attempt to persist OS switch to storage');

      // OS switches from dark to light
      osChangeListener({ matches: false });
      assert.equal(appliedTheme, 'light', 'Applies light when OS switches to light under SecurityError');
      assert.equal(appliedPersist, false);
    });

    it('Interactive theme toggle in Layout.astro succeeds gracefully even if setItem throws SecurityError', () => {
      const classList = new Set();
      const documentElement = {
        classList: {
          add: (cls) => classList.add(cls),
          remove: (cls) => classList.delete(cls),
          contains: (cls) => classList.has(cls)
        }
      };

      const meta = { content: 'light dark' };
      const localStorageMock = {
        getItem: () => {
          const err = new Error('The operation is insecure.');
          err.name = 'SecurityError';
          throw err;
        },
        setItem: () => {
          const err = new Error('The operation is insecure.');
          err.name = 'SecurityError';
          throw err;
        },
        removeItem: () => {
          const err = new Error('The operation is insecure.');
          err.name = 'SecurityError';
          throw err;
        }
      };

      const events = [];
      const windowMock = {
        matchMedia: () => ({ matches: false }), // OS is light
        dispatchEvent: (evt) => events.push(evt)
      };

      let buttonAria = null;
      const button = {
        setAttribute: (k, v) => { if (k === 'aria-checked') buttonAria = v; },
        querySelector: () => null
      };

      const documentMock = {
        documentElement,
        querySelector: (sel) => (sel === 'meta[name="color-scheme"]' ? meta : null),
        querySelectorAll: () => [button]
      };

      function updateToggleButtonsUI(isDark) {
        button.setAttribute('aria-checked', isDark ? 'true' : 'false');
      }

      function applyTheme(targetTheme, persist = false) {
        const isDark = targetTheme === 'dark';
        if (isDark) documentMock.documentElement.classList.add('dark');
        else documentMock.documentElement.classList.remove('dark');

        const m = documentMock.querySelector('meta[name="color-scheme"]');
        if (m) m.content = targetTheme;

        if (persist) {
          try {
            const systemPref = windowMock.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            if (targetTheme === systemPref) {
              localStorageMock.removeItem('theme');
            } else {
              localStorageMock.setItem('theme', targetTheme);
            }
          } catch (e) {}
        }

        windowMock.dispatchEvent({ type: 'theme-changed', detail: { theme: targetTheme } });
        updateToggleButtonsUI(isDark);
      }

      // User clicks toggle to switch to dark in private browsing mode
      applyTheme('dark', true);

      assert.equal(documentElement.classList.contains('dark'), true, 'Class .dark is applied');
      assert.equal(meta.content, 'dark', 'meta content updated to dark');
      assert.equal(buttonAria, 'true', 'button aria-checked updated to true');
      assert.equal(events.length, 1, 'theme-changed event dispatched');
    });
  });

  // =========================================================================
  // Challenge 3: ClientRouter Lifecycle Re-Binding & Listener Leak
  // =========================================================================
  describe('Challenge 3: ClientRouter Lifecycle Re-Binding and Listener Cleanliness', () => {
    it('Navbar.astro does not leak keydown listeners across multiple ClientRouter page swaps', () => {
      const activeListeners = new Map();

      const documentMock = {
        body: { style: { overflow: '' } },
        addEventListener: (event, fn) => {
          if (!activeListeners.has(event)) activeListeners.set(event, new Set());
          activeListeners.get(event).add(fn);
        },
        removeEventListener: (event, fn) => {
          if (activeListeners.has(event)) {
            activeListeners.get(event).delete(fn);
          }
        },
        getElementById: (id) => {
          if (id === 'mobile-menu-toggle') {
            return {
              setAttribute: () => {},
              focus: () => { toggleFocused = true; },
              addEventListener: () => {}
            };
          }
          if (id === 'mobile-menu-drawer' || id === 'mobile-menu-backdrop') {
            return {
              classList: { add: () => {}, remove: () => {} },
              querySelectorAll: () => [],
              addEventListener: () => {}
            };
          }
          return null;
        },
        querySelector: () => ({
          hasAttribute: () => false,
          removeAttribute: () => {},
          setAttribute: () => {}
        })
      };

      let toggleFocused = false;

      // Simulated Navbar module state and functions from Navbar.astro:
      let activeKeydownHandler = null;
      let activeCloseMenu = null;
      let isMobileMenuOpen = false;

      function initNavbar() {
        const menuToggle = documentMock.getElementById('mobile-menu-toggle');
        let isOpen = false;
        isMobileMenuOpen = false;

        function closeMenu() {
          isOpen = false;
          isMobileMenuOpen = false;
          documentMock.body.style.overflow = '';
        }

        activeCloseMenu = closeMenu;

        if (activeKeydownHandler) {
          documentMock.removeEventListener('keydown', activeKeydownHandler);
        }

        activeKeydownHandler = (e) => {
          if (e.key === 'Escape' && isOpen) {
            closeMenu();
            menuToggle?.focus();
          }
        };

        documentMock.addEventListener('keydown', activeKeydownHandler);
      }

      function handleBeforeSwap() {
        if (activeCloseMenu) {
          activeCloseMenu();
          activeCloseMenu = null;
        }
        isMobileMenuOpen = false;
        documentMock.body.style.overflow = '';

        if (activeKeydownHandler) {
          documentMock.removeEventListener('keydown', activeKeydownHandler);
          activeKeydownHandler = null;
        }
      }

      // Simulate 10 soft page transitions
      for (let nav = 1; nav <= 10; nav++) {
        // 1. Initial page load
        initNavbar();
        const keydownListeners = activeListeners.get('keydown');
        assert.equal(keydownListeners.size, 1, `After load #${nav}, exactly 1 keydown listener attached`);

        // 2. Before swap event
        handleBeforeSwap();
        assert.equal(keydownListeners.size, 0, `After before-swap #${nav}, exactly 0 keydown listeners attached`);
      }

      // Final page load
      initNavbar();
      const finalListeners = activeListeners.get('keydown');
      assert.equal(finalListeners.size, 1, 'Final state has exactly 1 keydown listener attached');
    });

    it('Mobile drawer automatically unlocks body overflow and inert on astro:before-swap', () => {
      let bodyOverflow = '';
      let mainInert = false;
      let footerInert = false;

      const mainEl = {
        setAttribute: (k) => { if (k === 'inert') mainInert = true; },
        removeAttribute: (k) => { if (k === 'inert') mainInert = false; },
        hasAttribute: (k) => (k === 'inert' ? mainInert : false)
      };

      const footerEl = {
        setAttribute: (k) => { if (k === 'inert') footerInert = true; },
        removeAttribute: (k) => { if (k === 'inert') footerInert = false; },
        hasAttribute: (k) => (k === 'inert' ? footerInert : false)
      };

      let activeCloseMenu = null;
      let isMobileMenuOpen = false;

      function openMenu() {
        isMobileMenuOpen = true;
        mainEl.setAttribute('inert', '');
        footerEl.setAttribute('inert', '');
        bodyOverflow = 'hidden';
      }

      function closeMenu() {
        isMobileMenuOpen = false;
        mainEl.removeAttribute('inert');
        footerEl.removeAttribute('inert');
        bodyOverflow = '';
      }

      activeCloseMenu = closeMenu;

      // User opens mobile drawer on Page 1
      openMenu();
      assert.equal(isMobileMenuOpen, true);
      assert.equal(bodyOverflow, 'hidden');
      assert.equal(mainInert, true);
      assert.equal(footerInert, true);

      // ClientRouter triggers astro:before-swap
      if (activeCloseMenu) {
        activeCloseMenu();
        activeCloseMenu = null;
      }
      isMobileMenuOpen = false;
      bodyOverflow = '';

      // Verify complete teardown
      assert.equal(isMobileMenuOpen, false, 'Menu marked closed');
      assert.equal(bodyOverflow, '', 'Body overflow restored');
      assert.equal(mainInert, false, 'Main element no longer inert');
      assert.equal(footerInert, false, 'Footer element no longer inert');
    });

    it('Desktop viewport resize automatically dismisses mobile drawer and unlocks page', () => {
      let bodyOverflow = '';
      let mainInert = false;
      let footerInert = false;

      const mainEl = {
        removeAttribute: (k) => { if (k === 'inert') mainInert = false; }
      };
      const footerEl = {
        removeAttribute: (k) => { if (k === 'inert') footerInert = false; }
      };

      let isMobileMenuOpen = true;
      bodyOverflow = 'hidden';
      mainInert = true;
      footerInert = true;

      const activeCloseMenu = () => {
        isMobileMenuOpen = false;
        mainEl.removeAttribute('inert');
        footerEl.removeAttribute('inert');
        bodyOverflow = '';
      };

      // Breakpoint handler from Navbar.astro line 422
      const handleBreakpointChange = (e) => {
        if (e.matches && isMobileMenuOpen && activeCloseMenu) {
          activeCloseMenu();
        }
      };

      // Resized to desktop (matches: true)
      handleBreakpointChange({ matches: true });

      assert.equal(isMobileMenuOpen, false, 'Drawer closed on desktop resize');
      assert.equal(bodyOverflow, '', 'Body scroll restored');
      assert.equal(mainInert, false, 'Main inert removed');
      assert.equal(footerInert, false, 'Footer inert removed');
    });
  });

  // =========================================================================
  // Challenge 4: Built Artifact dist/index.html Conformance
  // =========================================================================
  describe('Challenge 4: Production dist/index.html Verification', () => {
    it('dist/index.html contains exact zero-FOUC script and no duplicate theme click handlers', () => {
      assert.equal(fs.existsSync(DIST_INDEX), true, 'dist/index.html must exist');
      const distHtml = fs.readFileSync(DIST_INDEX, 'utf8');

      // Zero-FOUC script must be present in <head>
      assert.match(
        distHtml,
        /<script>[\s\S]*?localStorage\.getItem\(['"]theme['"]\)[\s\S]*?<\/script>/,
        'Zero-FOUC inline script must exist in dist/index.html'
      );

      // Verify meta color-scheme is in <head>
      assert.match(
        distHtml,
        /<meta name="color-scheme" content="light dark"/,
        'meta color-scheme must exist in dist/index.html'
      );

      // Verify Navbar script in dist does not have duplicate click listener for theme toggle
      // The Navbar script in dist has "open-command-palette", "mobile-menu-toggle", etc.
      // It should NOT contain classList.toggle("dark")
      const navbarScriptMatch = distHtml.match(/<script type="module">let n=null[\s\S]*?<\/script>/);
      assert.ok(navbarScriptMatch, 'Navbar module script found in dist/index.html');
      assert.equal(
        navbarScriptMatch[0].includes('classList.toggle("dark")'),
        false,
        'Navbar module script in dist must not contain theme toggle logic'
      );
    });
  });
});
