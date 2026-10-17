import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const DIST_INDEX = path.join(PROJECT_ROOT, 'dist/index.html');
const DIST_404 = path.join(PROJECT_ROOT, 'dist/404.html');

describe('Empirical Adversarial Stress Harness: Milestone 1 Remediation', () => {

  // =========================================================================
  // Suite 1: Production Artifacts & Asset Integrity
  // =========================================================================
  describe('Suite 1: Production Artifacts & Asset Integrity', () => {
    it('1.1: dist/index.html and dist/404.html exist and have valid DOCTYPE', () => {
      assert.ok(fs.existsSync(DIST_INDEX), 'dist/index.html must exist');
      assert.ok(fs.existsSync(DIST_404), 'dist/404.html must exist');

      const indexContent = fs.readFileSync(DIST_INDEX, 'utf8');
      const err404Content = fs.readFileSync(DIST_404, 'utf8');

      assert.match(indexContent, /^<!DOCTYPE html>/i, 'dist/index.html must start with <!DOCTYPE html>');
      assert.match(err404Content, /^<!DOCTYPE html>/i, 'dist/404.html must start with <!DOCTYPE html>');
    });

    it('1.2: All linked local scripts, stylesheets, and assets in dist/index.html exist on disk', () => {
      const indexContent = fs.readFileSync(DIST_INDEX, 'utf8');
      
      // Match scripts
      const scriptMatches = [...indexContent.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)];
      for (const m of scriptMatches) {
        const src = m[1];
        if (!src.startsWith('http')) {
          const filePath = path.join(PROJECT_ROOT, 'dist', src.replace(/^\//, ''));
          assert.ok(fs.existsSync(filePath), `Script src "${src}" must exist on disk at ${filePath}`);
        }
      }

      // Match stylesheets
      const linkMatches = [...indexContent.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi)];
      for (const m of linkMatches) {
        const href = m[1];
        if (!href.startsWith('http')) {
          const filePath = path.join(PROJECT_ROOT, 'dist', href.replace(/^\//, ''));
          assert.ok(fs.existsSync(filePath), `Stylesheet href "${href}" must exist on disk at ${filePath}`);
        }
      }

      // Match CV PDF download asset
      const cvPath = path.join(PROJECT_ROOT, 'public/Faycal_Rafa_CV_2026.pdf');
      const distCvPath = path.join(PROJECT_ROOT, 'dist/Faycal_Rafa_CV_2026.pdf');
      assert.ok(fs.existsSync(cvPath) || fs.existsSync(distCvPath), 'CV PDF must exist in public/ or dist/');
    });

    it('1.3: Built CSS distribution contains prefers-reduced-motion overrides', () => {
      const distAstroDir = path.join(PROJECT_ROOT, 'dist/_astro');
      assert.ok(fs.existsSync(distAstroDir), 'dist/_astro directory must exist');
      
      const cssFiles = fs.readdirSync(distAstroDir).filter(f => f.endsWith('.css'));
      assert.ok(cssFiles.length > 0, 'At least one compiled CSS bundle must exist in dist/_astro');

      let foundReducedMotion = false;
      for (const cssFile of cssFiles) {
        const cssContent = fs.readFileSync(path.join(distAstroDir, cssFile), 'utf8');
        if (cssContent.includes('prefers-reduced-motion')) {
          foundReducedMotion = true;
          assert.match(cssContent, /view-transition-(group|old|new)\(\*\)/, 'Must disable view transitions in CSS');
          assert.match(cssContent, /animation:\s*none\s*!important/, 'Must set animation: none !important');
        }
      }

      assert.ok(foundReducedMotion, 'Compiled CSS must include prefers-reduced-motion media query');
    });

    it('1.4: dist/index.html has zero conflicting theme click handlers in Navbar bundle', () => {
      const indexContent = fs.readFileSync(DIST_INDEX, 'utf8');
      
      // Look at script tags in dist/index.html
      const scripts = [...indexContent.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
      
      // Check Navbar inline script (which handles mobile menu and search)
      const navbarScript = scripts.find(s => s.includes('mobile-menu-toggle'));
      assert.ok(navbarScript, 'Navbar module script must be present in dist/index.html');

      // Crucial: Navbar script must NOT have any theme toggle button listeners
      assert.doesNotMatch(navbarScript, /theme-toggle-btn/, 'Navbar script must not attach to theme-toggle-btn');
      assert.doesNotMatch(navbarScript, /mobile-theme-toggle-btn/, 'Navbar script must not attach to mobile-theme-toggle-btn');
      assert.doesNotMatch(navbarScript, /data-theme-toggle/, 'Navbar script must not query data-theme-toggle');
    });
  });

  // =========================================================================
  // Suite 2: Theme Switching Determinism & Rapid Stress Fuzzing
  // =========================================================================
  describe('Suite 2: Theme Switching Determinism & Rapid Stress Fuzzing', () => {
    
    function createMockEnvironment({ systemDark = false, storageSecurityError = false, storageQuotaError = false } = {}) {
      const classList = new Set();
      const documentElement = {
        classList: {
          add: (c) => classList.add(c),
          remove: (c) => classList.delete(c),
          contains: (c) => classList.has(c),
          toggle: (c) => {
            if (classList.has(c)) { classList.delete(c); return false; }
            classList.add(c); return true;
          }
        }
      };

      const meta = { content: systemDark ? 'dark' : 'light' };
      const storage = {};
      const localStorage = {
        getItem: (k) => {
          if (storageSecurityError) {
            const err = new Error('SecurityError: The operation is insecure.');
            err.name = 'SecurityError';
            throw err;
          }
          return storage[k] || null;
        },
        setItem: (k, v) => {
          if (storageSecurityError) {
            const err = new Error('SecurityError: The operation is insecure.');
            err.name = 'SecurityError';
            throw err;
          }
          if (storageQuotaError) {
            const err = new Error('QuotaExceededError: Storage quota exceeded.');
            err.name = 'QuotaExceededError';
            throw err;
          }
          storage[k] = String(v);
        },
        removeItem: (k) => {
          delete storage[k];
        }
      };

      const eventsDispatched = [];
      const windowObj = {
        matchMedia: (query) => ({
          matches: query.includes('dark') ? systemDark : !systemDark,
          addEventListener: () => {}
        }),
        dispatchEvent: (evt) => eventsDispatched.push(evt)
      };

      function createButton(id) {
        let attrs = {};
        let icons = {
          sun: { hidden: true, classList: { remove: () => { icons.sun.hidden = false; }, add: () => { icons.sun.hidden = true; } } },
          moon: { hidden: false, classList: { remove: () => { icons.moon.hidden = false; }, add: () => { icons.moon.hidden = true; } } }
        };
        return {
          id,
          onclick: null,
          setAttribute: (k, v) => { attrs[k] = String(v); },
          getAttribute: (k) => attrs[k] ?? null,
          querySelector: (sel) => {
            if (sel.includes('sun')) return icons.sun;
            if (sel.includes('moon')) return icons.moon;
            return null;
          },
          _icons: icons
        };
      }

      const desktopBtn = createButton('theme-toggle-btn');
      const mobileBtn = createButton('mobile-theme-toggle-btn');
      const buttons = [desktopBtn, mobileBtn];

      const documentObj = {
        documentElement,
        querySelector: (sel) => {
          if (sel === 'meta[name="color-scheme"]') return meta;
          return null;
        },
        querySelectorAll: (sel) => {
          if (sel === '[data-theme-toggle]') return buttons;
          return [];
        }
      };

      // Implement Layout.astro runtime logic verbatim:
      function getResolvedTheme() {
        try {
          const stored = localStorage.getItem('theme');
          if (stored === 'dark' || stored === 'light') return stored;
        } catch (e) {}
        return windowObj.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      function updateToggleButtonsUI(isDark) {
        buttons.forEach((btn) => {
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
            const sys = windowObj.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            if (targetTheme === sys) localStorage.removeItem('theme');
            else localStorage.setItem('theme', targetTheme);
          } catch (e) {}
        }

        windowObj.dispatchEvent({ type: 'theme-changed', detail: { theme: targetTheme } });
        updateToggleButtonsUI(isDark);
      }

      function setupThemeToggles() {
        buttons.forEach((btn) => {
          btn.onclick = (e) => {
            if (e && e.preventDefault) e.preventDefault();
            const currentIsDark = documentElement.classList.contains('dark');
            const targetTheme = currentIsDark ? 'light' : 'dark';
            applyTheme(targetTheme, true);
          };
        });
        updateToggleButtonsUI(documentElement.classList.contains('dark'));
      }

      setupThemeToggles();

      return {
        documentElement,
        meta,
        storage,
        localStorage,
        windowObj,
        buttons,
        desktopBtn,
        mobileBtn,
        eventsDispatched,
        applyTheme,
        setupThemeToggles,
        getResolvedTheme
      };
    }

    it('2.1: 100 consecutive rapid toggles maintain strict state parity and emit alternating events', () => {
      const env = createMockEnvironment({ systemDark: false });

      // Start: light mode
      assert.equal(env.documentElement.classList.contains('dark'), false);
      assert.equal(env.desktopBtn.getAttribute('aria-checked'), 'false');
      assert.equal(env.mobileBtn.getAttribute('aria-checked'), 'false');

      for (let i = 1; i <= 100; i++) {
        const btnToClick = (i % 2 === 1) ? env.desktopBtn : env.mobileBtn;
        btnToClick.onclick({ preventDefault: () => {} });

        const shouldBeDark = (i % 2 === 1);
        const expectedTheme = shouldBeDark ? 'dark' : 'light';

        assert.equal(
          env.documentElement.classList.contains('dark'),
          shouldBeDark,
          `Iteration ${i}: classList.dark must match ${shouldBeDark}`
        );

        assert.equal(
          env.desktopBtn.getAttribute('aria-checked'),
          shouldBeDark ? 'true' : 'false',
          `Iteration ${i}: desktopBtn aria-checked must match`
        );
        assert.equal(
          env.mobileBtn.getAttribute('aria-checked'),
          shouldBeDark ? 'true' : 'false',
          `Iteration ${i}: mobileBtn aria-checked must match`
        );

        assert.equal(
          env.meta.content,
          expectedTheme,
          `Iteration ${i}: meta content must be ${expectedTheme}`
        );
      }

      assert.equal(env.eventsDispatched.length, 100, 'Must have dispatched exactly 100 theme-changed events');
      assert.equal(env.eventsDispatched[0].detail.theme, 'dark');
      assert.equal(env.eventsDispatched[1].detail.theme, 'light');
      assert.equal(env.eventsDispatched[99].detail.theme, 'light');
    });

    it('2.2: Theme toggle survives QuotaExceededError in localStorage without crashing', () => {
      const env = createMockEnvironment({ systemDark: false, storageQuotaError: true });

      // Click should still work without throwing
      assert.doesNotThrow(() => {
        env.desktopBtn.onclick({ preventDefault: () => {} });
      });

      // DOM was updated to dark even though localStorage failed
      assert.equal(env.documentElement.classList.contains('dark'), true);
      assert.equal(env.meta.content, 'dark');
      assert.equal(env.desktopBtn.getAttribute('aria-checked'), 'true');
      assert.equal(env.eventsDispatched.length, 1);
    });

    it('2.3: OS theme listener survives SecurityError and applies system dark mode', () => {
      const env = createMockEnvironment({ systemDark: false, storageSecurityError: true });

      // Verbatim OS theme listener from Layout.astro lines 206-216:
      const handleOsChange = (e) => {
        let hasCustomOverride = false;
        try {
          hasCustomOverride = Boolean(env.localStorage.getItem('theme'));
        } catch (err) {
          hasCustomOverride = false;
        }
        if (!hasCustomOverride) {
          env.applyTheme(e.matches ? 'dark' : 'light', false);
        }
      };

      // OS switches to dark
      assert.doesNotThrow(() => {
        handleOsChange({ matches: true });
      });

      assert.equal(env.documentElement.classList.contains('dark'), true, 'Dark class must be applied on OS dark change');
      assert.equal(env.meta.content, 'dark', 'Meta content must be dark');
      assert.equal(env.desktopBtn.getAttribute('aria-checked'), 'true', 'Buttons must update to dark');
    });
  });

  // =========================================================================
  // Helper: Mock Navbar DOM & Lifecycle
  // =========================================================================
  function createMockNavbarDOM({ omitMain = false, omitFooter = false } = {}) {
    const documentListeners = {};
    const windowListeners = {};

    const addListener = (target, evt, fn) => {
      if (!target[evt]) target[evt] = [];
      target[evt].push(fn);
    };

    const removeListener = (target, evt, fn) => {
      if (target[evt]) {
        target[evt] = target[evt].filter(f => f !== fn);
      }
    };

    const createElement = (id, tag = 'div') => {
      const classes = new Set();
      const attrs = {};
      const listeners = {};
      return {
        id,
        tagName: tag.toUpperCase(),
        classList: {
          add: (c) => classes.add(c),
          remove: (c) => classes.delete(c),
          contains: (c) => classes.has(c)
        },
        setAttribute: (k, v) => { attrs[k] = String(v); },
        getAttribute: (k) => attrs[k] ?? null,
        hasAttribute: (k) => Object.prototype.hasOwnProperty.call(attrs, k),
        removeAttribute: (k) => { delete attrs[k]; },
        addEventListener: (evt, fn) => {
          if (!listeners[evt]) listeners[evt] = [];
          listeners[evt].push(fn);
        },
        click: () => {
          if (listeners['click']) listeners['click'].forEach(fn => fn());
        },
        focusCalled: false,
        focus: function() { this.focusCalled = true; },
        querySelectorAll: (sel) => {
          if (sel === '.mobile-nav-link') return [createElement('link1', 'a'), createElement('link2', 'a')];
          return [];
        }
      };
    };

    const menuToggle = createElement('mobile-menu-toggle', 'button');
    const drawer = createElement('mobile-menu-drawer', 'div');
    drawer.classList.add('hidden');
    const backdrop = createElement('mobile-menu-backdrop', 'div');
    backdrop.classList.add('hidden');
    const iconHamburger = createElement('icon-hamburger', 'svg');
    const iconClose = createElement('icon-close', 'svg');
    iconClose.classList.add('hidden');

    const mainEl = omitMain ? null : createElement('main-content', 'main');
    const footerEl = omitFooter ? null : createElement('footer', 'footer');

    const body = {
      style: { overflow: '' }
    };

    const elements = {
      'mobile-menu-toggle': menuToggle,
      'mobile-menu-drawer': drawer,
      'mobile-menu-backdrop': backdrop,
      'icon-hamburger': iconHamburger,
      'icon-close': iconClose,
      'nav-search-btn': createElement('nav-search-btn', 'button'),
      'mobile-search-btn': createElement('mobile-search-btn', 'button')
    };

    const documentObj = {
      body,
      getElementById: (id) => elements[id] || null,
      querySelector: (sel) => {
        if (sel === 'main') return mainEl;
        if (sel === 'footer') return footerEl;
        return null;
      },
      addEventListener: (evt, fn) => addListener(documentListeners, evt, fn),
      removeEventListener: (evt, fn) => removeListener(documentListeners, evt, fn)
    };

    const windowObj = {
      addEventListener: (evt, fn) => addListener(windowListeners, evt, fn),
      removeEventListener: (evt, fn) => removeListener(windowListeners, evt, fn),
      dispatchEvent: () => {}
    };

    let activeKeydownHandler = null;
    let activeCloseMenu = null;
    let isMobileMenuOpen = false;

    function initNavbar() {
      const toggle = documentObj.getElementById('mobile-menu-toggle');
      const drw = documentObj.getElementById('mobile-menu-drawer');
      const bdp = documentObj.getElementById('mobile-menu-backdrop');
      const iHam = documentObj.getElementById('icon-hamburger');
      const iCls = documentObj.getElementById('icon-close');
      const mEl = documentObj.querySelector('main');
      const fEl = documentObj.querySelector('footer');

      let isOpen = false;
      isMobileMenuOpen = false;

      if (documentObj.body.style.overflow === 'hidden') {
        documentObj.body.style.overflow = '';
      }
      if (mEl?.hasAttribute('inert')) mEl.removeAttribute('inert');
      if (fEl?.hasAttribute('inert')) fEl.removeAttribute('inert');

      function openMenu() {
        isOpen = true;
        isMobileMenuOpen = true;
        toggle?.setAttribute('aria-expanded', 'true');
        drw?.classList.remove('hidden');
        bdp?.classList.remove('hidden');
        iHam?.classList.add('hidden');
        iCls?.classList.remove('hidden');
        if (mEl) mEl.setAttribute('inert', '');
        if (fEl) fEl.setAttribute('inert', '');
        documentObj.body.style.overflow = 'hidden';
      }

      function closeMenu() {
        isOpen = false;
        isMobileMenuOpen = false;
        toggle?.setAttribute('aria-expanded', 'false');
        drw?.classList.add('hidden');
        bdp?.classList.add('hidden');
        iHam?.classList.remove('hidden');
        iCls?.classList.add('hidden');
        if (mEl) mEl.removeAttribute('inert');
        if (fEl) fEl.removeAttribute('inert');
        documentObj.body.style.overflow = '';
      }

      activeCloseMenu = closeMenu;

      toggle?.addEventListener('click', () => {
        if (isOpen) closeMenu();
        else openMenu();
      });

      bdp?.addEventListener('click', closeMenu);

      const mobileLinks = drw?.querySelectorAll('.mobile-nav-link');
      mobileLinks?.forEach((link) => {
        link.addEventListener('click', closeMenu);
      });

      if (activeKeydownHandler) {
        documentObj.removeEventListener('keydown', activeKeydownHandler);
      }

      activeKeydownHandler = (e) => {
        if (e.key === 'Escape' && isOpen) {
          closeMenu();
          toggle?.focus();
        }
      };

      documentObj.addEventListener('keydown', activeKeydownHandler);
    }

    function simulateBeforeSwap() {
      if (activeCloseMenu) {
        activeCloseMenu();
        activeCloseMenu = null;
      }
      isMobileMenuOpen = false;
      documentObj.body.style.overflow = '';
      if (activeKeydownHandler) {
        documentObj.removeEventListener('keydown', activeKeydownHandler);
        activeKeydownHandler = null;
      }
    }

    function handleBreakpointChange(matchesDesktop) {
      if (matchesDesktop && isMobileMenuOpen && activeCloseMenu) {
        activeCloseMenu();
      }
    }

    return {
      documentObj,
      windowObj,
      menuToggle,
      drawer,
      backdrop,
      mainEl,
      footerEl,
      initNavbar,
      simulateBeforeSwap,
      handleBreakpointChange,
      documentListeners,
      isMobileMenuOpen: () => isMobileMenuOpen,
      get activeCloseMenu() { return activeCloseMenu; }
    };
  }

  // =========================================================================
  // Suite 3: Mobile Navigation Drawer & Accessibility Focus Trap Fuzzing
  // =========================================================================
  describe('Suite 3: Mobile Navigation Drawer & Accessibility Focus Trap Fuzzing', () => {

    it('3.1: Full mobile drawer open/close cycle locks/unlocks body and traps/untraps inert', () => {
      const nav = createMockNavbarDOM();
      nav.initNavbar();

      // Initially closed
      assert.equal(nav.menuToggle.getAttribute('aria-expanded'), null);
      assert.equal(nav.drawer.classList.contains('hidden'), true);
      assert.equal(nav.documentObj.body.style.overflow, '');

      // Open menu
      nav.menuToggle.click();

      assert.equal(nav.menuToggle.getAttribute('aria-expanded'), 'true');
      assert.equal(nav.drawer.classList.contains('hidden'), false);
      assert.equal(nav.backdrop.classList.contains('hidden'), false);
      assert.equal(nav.documentObj.body.style.overflow, 'hidden');
      assert.equal(nav.mainEl.hasAttribute('inert'), true, 'main must have inert');
      assert.equal(nav.footerEl.hasAttribute('inert'), true, 'footer must have inert');

      // Close menu by clicking backdrop
      nav.backdrop.click();

      assert.equal(nav.menuToggle.getAttribute('aria-expanded'), 'false');
      assert.equal(nav.drawer.classList.contains('hidden'), true);
      assert.equal(nav.backdrop.classList.contains('hidden'), true);
      assert.equal(nav.documentObj.body.style.overflow, '');
      assert.equal(nav.mainEl.hasAttribute('inert'), false, 'main inert must be removed');
      assert.equal(nav.footerEl.hasAttribute('inert'), false, 'footer inert must be removed');
    });

    it('3.2: Adversarial DOM: Navigation functions cleanly even if <main> and <footer> are absent', () => {
      const nav = createMockNavbarDOM({ omitMain: true, omitFooter: true });
      nav.initNavbar();

      // Must not throw when opening or closing
      assert.doesNotThrow(() => {
        nav.menuToggle.click(); // open
        nav.menuToggle.click(); // close
      });

      assert.equal(nav.documentObj.body.style.overflow, '');
    });

    it('3.3: Escape key dismisses open drawer and restores focus to toggle button', () => {
      const nav = createMockNavbarDOM();
      nav.initNavbar();

      // Open drawer
      nav.menuToggle.click();
      assert.equal(nav.documentObj.body.style.overflow, 'hidden');

      // Dispatch Escape keydown
      const keydownFns = nav.documentListeners['keydown'] || [];
      assert.equal(keydownFns.length, 1, 'Exactly one keydown listener');

      keydownFns[0]({ key: 'Escape' });

      assert.equal(nav.drawer.classList.contains('hidden'), true, 'Drawer closed on Escape');
      assert.equal(nav.documentObj.body.style.overflow, '', 'Overflow restored');
      assert.equal(nav.menuToggle.focusCalled, true, 'Focus returned to toggle button');

      // Fire Escape again while closed -> no-op
      nav.menuToggle.focusCalled = false;
      keydownFns[0]({ key: 'Escape' });
      assert.equal(nav.menuToggle.focusCalled, false, 'No focus call when already closed');
    });
  });

  // =========================================================================
  // Suite 4: ClientRouter Lifecycle & Memory Leak Stress
  // =========================================================================
  describe('Suite 4: ClientRouter Lifecycle & Memory Leak Stress', () => {
    it('4.1: 50 consecutive View Transitions maintain strictly <= 1 keydown listener', () => {
      const nav = createMockNavbarDOM();

      for (let navCount = 1; navCount <= 50; navCount++) {
        // Open drawer on some navigations to simulate leaving dirty state
        if (navCount % 3 === 0) {
          nav.menuToggle.click();
        }

        // Trigger astro:before-swap
        nav.simulateBeforeSwap();

        // Trigger astro:page-load
        nav.initNavbar();

        const keydownListeners = nav.documentListeners['keydown'] || [];
        assert.equal(
          keydownListeners.length,
          1,
          `Navigation #${navCount}: keydown listener count must be 1, found ${keydownListeners.length}`
        );

        assert.equal(
          nav.documentObj.body.style.overflow,
          '',
          `Navigation #${navCount}: body overflow must be cleared`
        );
      }
    });

    it('4.2: Calling initNavbar repeatedly without before-swap does not leak listeners', () => {
      const nav = createMockNavbarDOM();

      for (let i = 0; i < 20; i++) {
        nav.initNavbar();
      }

      const keydownListeners = nav.documentListeners['keydown'] || [];
      assert.equal(
        keydownListeners.length,
        1,
        `Duplicate initNavbar calls must clean up prior listener (expected 1, got ${keydownListeners.length})`
      );
    });
  });

  // =========================================================================
  // Suite 5: Responsive Viewport Breakpoint Desynchronization Stress
  // =========================================================================
  describe('Suite 5: Responsive Viewport Breakpoint Desynchronization Stress', () => {
    it('5.1: Expanding viewport to desktop automatically dismisses open mobile drawer', () => {
      const nav = createMockNavbarDOM();
      nav.initNavbar();

      // Open drawer on mobile
      nav.menuToggle.click();
      assert.equal(nav.isMobileMenuOpen(), true);
      assert.equal(nav.documentObj.body.style.overflow, 'hidden');

      // Resize to desktop (min-width: 768px matches)
      nav.handleBreakpointChange(true);

      assert.equal(nav.isMobileMenuOpen(), false, 'Drawer state must be false');
      assert.equal(nav.drawer.classList.contains('hidden'), true, 'Drawer must be hidden');
      assert.equal(nav.documentObj.body.style.overflow, '', 'Overflow must be cleared');
      assert.equal(nav.mainEl.hasAttribute('inert'), false, 'Inert must be removed from main');
      assert.equal(nav.footerEl.hasAttribute('inert'), false, 'Inert must be removed from footer');
    });

    it('5.2: 30 oscillating mobile/desktop resizes maintain consistent invariants', () => {
      const nav = createMockNavbarDOM();
      nav.initNavbar();

      for (let i = 0; i < 30; i++) {
        const shouldOpen = i % 2 === 0;
        if (shouldOpen) {
          nav.menuToggle.click();
        }

        // Oscillate desktop expansion
        nav.handleBreakpointChange(true);

        // Invariant: drawer must be closed after desktop breakpoint
        assert.equal(nav.drawer.classList.contains('hidden'), true);
        assert.equal(nav.documentObj.body.style.overflow, '');
        assert.equal(nav.mainEl.hasAttribute('inert'), false);
        assert.equal(nav.footerEl.hasAttribute('inert'), false);
      }
    });
  });
});
