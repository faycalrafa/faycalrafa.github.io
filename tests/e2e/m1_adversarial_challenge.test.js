import { test, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const DIST_INDEX = path.join(PROJECT_ROOT, 'dist/index.html');
const GLOBAL_CSS = path.join(PROJECT_ROOT, 'src/styles/global.css');
const LAYOUT_ASTRO = path.join(PROJECT_ROOT, 'src/layouts/Layout.astro');
const NAVBAR_ASTRO = path.join(PROJECT_ROOT, 'src/components/Navbar.astro');

describe('Adversarial Challenge: Milestone 1 Runtime Scripts', () => {

  // =========================================================================
  // Challenge 1: Conflicting Click Handlers & Double-Toggle Race Condition
  // =========================================================================
  describe('Challenge 1: Theme Toggle State Consistency & Conflicting Handlers', () => {
    
    it('CONFIRMED BUG: Navbar.astro + Layout.astro combined click handlers cause double-toggle cancellation', () => {
      const classList = new Set();
      const documentElement = {
        classList: {
          add: (cls) => classList.add(cls),
          remove: (cls) => classList.delete(cls),
          toggle: (cls) => {
            if (classList.has(cls)) {
              classList.delete(cls);
              return false;
            } else {
              classList.add(cls);
              return true;
            }
          },
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
      const matchMedia = (query) => ({
        matches: systemDark,
        addEventListener: () => {}
      });

      const eventsDispatched = [];
      const window = {
        matchMedia,
        dispatchEvent: (evt) => eventsDispatched.push(evt)
      };

      const buttonListeners = [];
      const buttonAttrs = {};
      const button = {
        id: 'theme-toggle-btn',
        onclick: null,
        addEventListener: (event, fn) => {
          if (event === 'click') buttonListeners.push(fn);
        },
        setAttribute: (k, v) => { buttonAttrs[k] = v; },
        getAttribute: (k) => buttonAttrs[k],
        querySelector: () => ({ classList: { add: () => {}, remove: () => {} } })
      };

      const document = {
        documentElement,
        getElementById: (id) => (id === 'theme-toggle-btn' ? button : null),
        querySelectorAll: (sel) => (sel === '[data-theme-toggle]' ? [button] : []),
        querySelector: (sel) => (sel === 'meta[name="color-scheme"]' ? meta : null),
        addEventListener: () => {}
      };

      // 1. Navbar.astro handler (dist/index.html line 45 / Navbar.astro line 323)
      function initNavbar() {
        const toggleBtns = [
          document.getElementById('theme-toggle-btn'),
          document.getElementById('mobile-theme-toggle-btn'),
        ].filter(Boolean);

        toggleBtns.forEach((btn) => {
          btn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            const theme = isDark ? 'dark' : 'light';
            try {
              localStorage.setItem('theme', theme);
              const m = document.querySelector('meta[name="color-scheme"]');
              if (m) m.setAttribute('content', theme);
            } catch (e) {}
            window.dispatchEvent({ type: 'theme-changed', detail: { theme } });
          });
        });
      }

      // 2. Layout.astro handler (dist/index.html line 106 / Layout.astro line 175)
      function applyTheme(targetTheme, persist = false) {
        const isDark = targetTheme === 'dark';
        if (isDark) documentElement.classList.add('dark');
        else documentElement.classList.remove('dark');

        if (meta) meta.content = targetTheme;

        if (persist) {
          try {
            const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            if (targetTheme === sys) localStorage.removeItem('theme');
            else localStorage.setItem('theme', targetTheme);
          } catch (e) {}
        }
        window.dispatchEvent({ type: 'theme-changed', detail: { theme: targetTheme } });
        button.setAttribute('aria-checked', isDark ? 'true' : 'false');
      }

      function setupThemeToggles() {
        const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
        toggleButtons.forEach((btn) => {
          btn.onclick = (e) => {
            if (e && e.preventDefault) e.preventDefault();
            const currentIsDark = document.documentElement.classList.contains('dark');
            const targetTheme = currentIsDark ? 'light' : 'dark';
            applyTheme(targetTheme, true);
          };
        });
      }

      // Both execute on astro:page-load
      initNavbar();
      setupThemeToggles();

      // Initial state: light mode
      assert.equal(documentElement.classList.contains('dark'), false);

      // Simulate click
      const clickEvent = { preventDefault: () => {} };
      if (button.onclick) button.onclick(clickEvent);
      for (const listener of buttonListeners) {
        listener(clickEvent);
      }

      // Assertions verifying that the double-toggle bug occurs:
      // The first handler toggled to dark, but the second handler toggled back to light!
      const darkClassPresent = documentElement.classList.contains('dark');
      const finalStoredTheme = localStorage.getItem('theme');
      const ariaChecked = button.getAttribute('aria-checked');

      // Double-toggle occurs:
      assert.equal(darkClassPresent, false, 'BUG: Dark class was removed by second handler');
      assert.equal(finalStoredTheme, 'light', 'BUG: Theme in localStorage was overwritten back to light');
      assert.equal(ariaChecked, 'true', 'BUG: aria-checked is true (dark) while page is actually light');
      assert.deepEqual(
        eventsDispatched.map(e => e.detail.theme),
        ['dark', 'light'],
        'BUG: Two contradictory events were fired in the same click'
      );
    });

    it('PROOF OF PROPOSED FIX: Removing duplicate Navbar.astro listener restores deterministic toggle', () => {
      const classList = new Set();
      const documentElement = {
        classList: {
          add: (cls) => classList.add(cls),
          remove: (cls) => classList.delete(cls),
          contains: (cls) => classList.has(cls)
        }
      };

      const meta = { content: 'light dark' };
      let storage = {};
      const localStorage = {
        getItem: (k) => storage[k] || null,
        setItem: (k, v) => { storage[k] = String(v); },
        removeItem: (k) => { delete storage[k]; }
      };

      let systemDark = false;
      const window = {
        matchMedia: () => ({ matches: systemDark }),
        dispatchEvent: () => {}
      };

      const button = {
        id: 'theme-toggle-btn',
        onclick: null,
        setAttribute: () => {},
        querySelector: () => null
      };

      const document = {
        documentElement,
        querySelectorAll: (sel) => (sel === '[data-theme-toggle]' ? [button] : []),
        querySelector: (sel) => (sel === 'meta[name="color-scheme"]' ? meta : null)
      };

      function applyTheme(targetTheme, persist = false) {
        const isDark = targetTheme === 'dark';
        if (isDark) documentElement.classList.add('dark');
        else documentElement.classList.remove('dark');
        if (meta) meta.content = targetTheme;
        if (persist) {
          const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          if (targetTheme === sys) localStorage.removeItem('theme');
          else localStorage.setItem('theme', targetTheme);
        }
      }

      function setupThemeToggles() {
        const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
        toggleButtons.forEach((btn) => {
          btn.onclick = (e) => {
            if (e && e.preventDefault) e.preventDefault();
            const currentIsDark = document.documentElement.classList.contains('dark');
            const targetTheme = currentIsDark ? 'light' : 'dark';
            applyTheme(targetTheme, true);
          };
        });
      }

      setupThemeToggles();

      // Click 1: Light -> Dark
      button.onclick({ preventDefault: () => {} });
      assert.equal(documentElement.classList.contains('dark'), true, 'Click 1 toggles to dark');
      assert.equal(localStorage.getItem('theme'), 'dark', 'Persists dark');

      // Click 2: Dark -> Light (matches system light, so clears stored item according to Modern Web Guidance)
      button.onclick({ preventDefault: () => {} });
      assert.equal(documentElement.classList.contains('dark'), false, 'Click 2 toggles to light');
      assert.equal(localStorage.getItem('theme'), null, 'Removes stored preference when matching system');
    });
  });

  // =========================================================================
  // Challenge 2: localStorage SecurityError / Private Browsing Fallback
  // =========================================================================
  describe('Challenge 2: localStorage SecurityError / Private Mode Fallback', () => {
    it('PASS: Inline Head Script in Layout.astro handles SecurityError safely', () => {
      const classList = new Set();
      const documentElement = {
        classList: {
          add: (cls) => classList.add(cls),
          remove: (cls) => classList.delete(cls),
          contains: (cls) => classList.has(cls)
        }
      };

      const localStorage = {
        getItem: () => {
          const err = new Error('The operation is insecure.');
          err.name = 'SecurityError';
          throw err;
        }
      };

      const window = {
        matchMedia: (query) => ({
          matches: query.includes('prefers-color-scheme: dark') // OS is dark
        })
      };

      const document = {
        documentElement,
        querySelector: () => null
      };

      // Inline head script logic
      let threw = false;
      try {
        (function () {
          try {
            const stored = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isDark = stored === 'dark' || (!stored && prefersDark);
            const meta = document.querySelector('meta[name="color-scheme"]');

            if (isDark) {
              document.documentElement.classList.add('dark');
              if (meta) meta.content = 'dark';
            } else {
              document.documentElement.classList.remove('dark');
              if (meta) meta.content = 'light';
            }
          } catch (e) {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
              document.documentElement.classList.add('dark');
            }
          }
        })();
      } catch (err) {
        threw = true;
      }

      assert.equal(threw, false, 'Inline head script handles SecurityError without throwing');
      assert.equal(documentElement.classList.contains('dark'), true, 'Falls back to OS dark mode');
    });

    it('CONFIRMED BUG: Layout.astro OS theme change listener swallows update on SecurityError', () => {
      let appliedTheme = null;
      function applyTheme(t) { appliedTheme = t; }

      const localStorage = {
        getItem: () => {
          const err = new Error('The operation is insecure.');
          err.name = 'SecurityError';
          throw err;
        }
      };

      // Verbatim OS listener from Layout.astro lines 206-212:
      const osChangeHandler = (e) => {
        try {
          if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light', false);
          }
        } catch (err) {}
      };

      // OS switches to dark
      osChangeHandler({ matches: true });

      // Verifying bug: appliedTheme is null because try block aborted
      assert.equal(
        appliedTheme,
        null,
        'BUG CONFIRMED: OS theme change was ignored because localStorage.getItem threw SecurityError'
      );
    });

    it('PROOF OF PROPOSED FIX: Handling SecurityError in OS theme listener allows system updates', () => {
      let appliedTheme = null;
      function applyTheme(t) { appliedTheme = t; }

      const localStorage = {
        getItem: () => {
          const err = new Error('The operation is insecure.');
          err.name = 'SecurityError';
          throw err;
        }
      };

      // Proposed fix for OS listener:
      const safeOsChangeHandler = (e) => {
        let hasCustomOverride = false;
        try {
          hasCustomOverride = Boolean(localStorage.getItem('theme'));
        } catch (err) {
          hasCustomOverride = false;
        }
        if (!hasCustomOverride) {
          applyTheme(e.matches ? 'dark' : 'light', false);
        }
      };

      safeOsChangeHandler({ matches: true });
      assert.equal(appliedTheme, 'dark', 'Properly applies dark theme when OS changes, even under SecurityError');
    });

    it('CONFIRMED BUG: Navbar.astro places meta.setAttribute after localStorage.setItem in try block', () => {
      let metaContent = 'light';
      const meta = {
        setAttribute: (k, v) => { if (k === 'content') metaContent = v; }
      };

      const localStorage = {
        setItem: () => {
          const err = new Error('The operation is insecure.');
          err.name = 'SecurityError';
          throw err;
        }
      };

      // Navbar.astro lines 326-332:
      try {
        localStorage.setItem('theme', 'dark');
        if (meta) meta.setAttribute('content', 'dark');
      } catch (e) {}

      // Verifying bug: metaContent was not updated
      assert.equal(
        metaContent,
        'light',
        'BUG CONFIRMED: meta color-scheme was skipped because localStorage.setItem threw before it'
      );
    });
  });

  // =========================================================================
  // Challenge 3: ClientRouter Lifecycle Re-Binding & Listener Leak
  // =========================================================================
  describe('Challenge 3: ClientRouter Lifecycle Re-Binding', () => {
    it('CONFIRMED BUG: Navbar.astro leaks keydown event listeners on document across ClientRouter page-loads', () => {
      const documentListeners = {
        keydown: []
      };

      const document = {
        addEventListener: (event, fn) => {
          if (documentListeners[event]) documentListeners[event].push(fn);
        },
        removeEventListener: (event, fn) => {
          if (documentListeners[event]) {
            documentListeners[event] = documentListeners[event].filter(f => f !== fn);
          }
        },
        getElementById: () => ({ addEventListener: () => {} }),
        querySelector: () => null,
        querySelectorAll: () => []
      };

      // Navbar.astro attach logic:
      function initNavbar() {
        const menuToggle = document.getElementById('mobile-menu-toggle');
        let isOpen = false;
        function closeMenu() { isOpen = false; }

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && isOpen) {
            closeMenu();
            menuToggle?.focus();
          }
        });
      }

      // 5 navigations via ClientRouter
      for (let nav = 1; nav <= 5; nav++) {
        initNavbar();
      }

      // Verifying listener accumulation bug:
      assert.equal(
        documentListeners.keydown.length,
        5,
        'BUG CONFIRMED: 5 duplicate keydown listeners accumulated on document'
      );
    });
  });

  // =========================================================================
  // Challenge 4: Reduced Motion Overrides
  // =========================================================================
  describe('Challenge 4: Reduced Motion Overrides', () => {
    it('PASS: global.css properly overrides View Transitions animations', () => {
      const cssContent = fs.readFileSync(GLOBAL_CSS, 'utf8');

      assert.match(
        cssContent,
        /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/,
        'Must contain prefers-reduced-motion media query'
      );

      assert.match(
        cssContent,
        /::view-transition-group\(\*\)[\s\S]*?animation:\s*none\s*!important/,
        'Must disable view-transition-group'
      );

      assert.match(
        cssContent,
        /::view-transition-old\(\*\)[\s\S]*?animation:\s*none\s*!important/,
        'Must disable view-transition-old'
      );

      assert.match(
        cssContent,
        /::view-transition-new\(\*\)[\s\S]*?animation:\s*none\s*!important/,
        'Must disable view-transition-new'
      );
    });

    it('PASS: html scroll-behavior is set to auto under prefers-reduced-motion', () => {
      const cssContent = fs.readFileSync(GLOBAL_CSS, 'utf8');
      assert.match(
        cssContent,
        /scroll-behavior:\s*auto\s*!important/,
        'scroll-behavior must be set to auto under prefers-reduced-motion'
      );
    });
  });
});
