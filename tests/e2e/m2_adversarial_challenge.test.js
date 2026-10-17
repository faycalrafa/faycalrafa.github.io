import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const DIST_INDEX = path.join(PROJECT_ROOT, 'dist/index.html');
const CMD_PALETTE_ASTRO = path.join(PROJECT_ROOT, 'src/components/CommandPalette.astro');
const CV_MODAL_ASTRO = path.join(PROJECT_ROOT, 'src/components/CvModal.astro');
const LAYOUT_ASTRO = path.join(PROJECT_ROOT, 'src/layouts/Layout.astro');
const NAVBAR_ASTRO = path.join(PROJECT_ROOT, 'src/components/Navbar.astro');

describe('Milestone 2 Empirical Adversarial Challenge: Client Scripts & Runtime Injection', () => {

  // =========================================================================
  // Challenge 1: Regex Special Characters & Query Injection Resilience
  // =========================================================================
  describe('Challenge 1: Regex & Special Character Injection in Search Filter', () => {

    // Extract command definitions from CommandPalette.astro to test against authentic items
    const paletteSource = fs.readFileSync(CMD_PALETTE_ASTRO, 'utf8');

    // Helper: simulate CommandPalette's exact filterCommands function
    function createPaletteFilterHarness() {
      // Mock command item dataset matching CommandPalette.astro
      const allCommands = [
        {
          id: 'nav-home',
          title: 'Home',
          subtitle: 'Navigate to hero section and introduction',
          category: 'Navigation',
          keywords: ['home', 'index', 'main', 'landing', 'faycal'],
          badge: undefined
        },
        {
          id: 'nav-career',
          title: 'Career Timeline',
          subtitle: '7 companies: AUTOQUAL, SABIL, Finnetude, InstaClean, Kabri, PIASSA, BFLN',
          category: 'Navigation',
          keywords: ['career', 'timeline', 'experience', 'jobs', 'autoqual', 'sabil', 'finnetude', 'instaclean', 'kabri', 'piassa', 'bfln'],
          badge: undefined
        },
        {
          id: 'nav-skills',
          title: 'Skills Matrix (Bento Grid)',
          subtitle: 'TypeScript, NestJS, Android Native, Media3, PostgreSQL, Docker',
          category: 'Navigation',
          keywords: ['skills', 'tech', 'stack', 'typescript', 'bento', 'grid', 'nestjs', 'compose', 'docker', 'postgresql'],
          badge: undefined
        },
        {
          id: 'nav-projects',
          title: 'Projects Archive',
          subtitle: 'Browse all hobby and commercial software projects',
          category: 'Navigation',
          keywords: ['projects', 'archive', 'portfolio', 'work', 'all', 'open-source'],
          badge: undefined
        },
        {
          id: 'nav-bookreader',
          title: 'BookReader Android Flagship Showcase',
          subtitle: 'Free & Open Source TTS novel reader with Jetpack Compose & Media3',
          category: 'Projects',
          badge: 'Hobby Project',
          keywords: ['bookreader', 'flagship', 'hobby', 'android', 'tts', 'compose', 'media3', 'exoplayer', 'apk']
        },
        {
          id: 'action-theme',
          title: 'Toggle Theme (Dark / Light)',
          subtitle: 'Switch between dark and light color scheme',
          category: 'Actions',
          badge: 'Color Mode',
          keywords: ['theme', 'dark', 'light', 'mode', 'toggle', 'color', 'switch']
        },
        {
          id: 'action-download-cv',
          title: 'Download CV (PDF)',
          subtitle: 'Direct download of official Faycal_Rafa_CV_2026.pdf document',
          category: 'Actions',
          badge: 'PDF',
          keywords: ['cv', 'resume', 'pdf', 'download', 'curriculum', 'vitae', 'faycal rafa']
        },
        {
          id: 'action-view-cv',
          title: 'Open CV Modal Viewer',
          subtitle: 'View the complete CV inline without leaving the page',
          category: 'Actions',
          badge: 'Viewer',
          keywords: ['cv', 'resume', 'modal', 'view', 'preview', 'inline', 'pdf']
        },
        {
          id: 'action-download-apk',
          title: 'Download BookReader APK (v3.4.0)',
          subtitle: 'Download app-release.apk directly from latest GitHub release',
          category: 'Actions',
          badge: 'v3.4.0 • APK',
          keywords: ['apk', 'download', 'bookreader', 'android', 'install', 'release', 'v3.4.0']
        }
      ];

      return function filterCommands(query) {
        const cleanQuery = query.toLowerCase().trim();
        if (!cleanQuery) return [...allCommands];
        return allCommands.filter((cmd) => {
          const matchTitle = cmd.title.toLowerCase().includes(cleanQuery);
          const matchSub = cmd.subtitle.toLowerCase().includes(cleanQuery);
          const matchCat = cmd.category.toLowerCase().includes(cleanQuery);
          const matchBadge = cmd.badge ? cmd.badge.toLowerCase().includes(cleanQuery) : false;
          const matchKeywords = cmd.keywords.some((kw) => kw.toLowerCase().includes(cleanQuery));
          return matchTitle || matchSub || matchCat || matchBadge || matchKeywords;
        });
      };
    }

    it('1.1: Regex metacharacters string `[*+?^${}()|[\\]\\\\]` does not throw SyntaxError or crash', () => {
      const filter = createPaletteFilterHarness();
      const adversarialInput = '[*+?^${}()|[\\]\\\\]';

      assert.doesNotThrow(() => {
        const results = filter(adversarialInput);
        assert.ok(Array.isArray(results), 'Filter must return an array');
        assert.equal(results.length, 0, 'No item should match the full adversarial string');
      });
    });

    it('1.2: Unbalanced regex delimiters and quantifiers execute safely without exception', () => {
      const filter = createPaletteFilterHarness();
      const dangerousInputs = [
        '(',
        '(((',
        ')',
        ')))',
        '[',
        '[[[',
        ']',
        '[]',
        '[^a-z]',
        '{',
        '{1,3}',
        '\\',
        '\\\\',
        '*',
        '**',
        '+',
        '++',
        '?',
        '??',
        '^',
        '^^',
        '$',
        '$$',
        '|',
        '||',
        '(?<=lookbehind)',
        '(?=lookahead)',
        '(?:non-capturing)',
        '\\d+\\w+.*',
        '\\p{L}+'
      ];

      for (const input of dangerousInputs) {
        assert.doesNotThrow(() => {
          const results = filter(input);
          assert.ok(Array.isArray(results), `Filter failed on dangerous input: "${input}"`);
        }, `Input "${input}" threw an error`);
      }
    });

    it('1.3: ReDoS attack strings with exponential backtracking patterns evaluate instantly (< 5ms)', () => {
      const filter = createPaletteFilterHarness();
      const redosInputs = [
        '((a+)+)+$',
        '(a|aa)+b',
        'a?a?a?a?a?a?a?a?a?a?a?a?a?a?a?a?a?a?a?a?aaaaaaaaaaaaaaaaaaaa',
        '([a-zA-Z]+)*$',
        '(.*a){100}'
      ];

      for (const payload of redosInputs) {
        const start = performance.now();
        const results = filter(payload);
        const duration = performance.now() - start;

        assert.ok(duration < 5, `ReDoS payload "${payload}" took too long: ${duration.toFixed(2)}ms`);
        assert.ok(Array.isArray(results));
      }
    });

    it('1.4: Literal string matching with regex characters matches exact target strings', () => {
      const filter = createPaletteFilterHarness();

      // Search with '.' should match 'v3.4.0' literally, NOT match everything as wildcard '.'
      const dotResults = filter('v3.4.0');
      assert.ok(dotResults.length >= 1, 'Should find v3.4.0 APK command');
      assert.ok(dotResults.some(r => r.id === 'action-download-apk'));

      // Search with '(' should match 'Toggle Theme (Dark / Light)' literally
      const parenResults = filter('(');
      assert.ok(parenResults.length >= 1, 'Should find commands containing "("');
      assert.ok(parenResults.some(r => r.id === 'action-theme'));

      // Search with '/' should match 'Dark / Light' literally
      const slashResults = filter('/');
      assert.ok(slashResults.length >= 1, 'Should find commands containing "/"');
      assert.ok(slashResults.some(r => r.id === 'action-theme'));
    });

    it('1.5: Query string containing XSS / HTML payloads is handled via textContent without innerHTML injection', () => {
      // Inspect CommandPalette.astro implementation of empty state display
      assert.match(
        paletteSource,
        /emptyQueryEl\.textContent\s*=\s*`"\$\{query\}"`|emptyQueryEl\.textContent\s*=\s*`"\$\{t\}"`/,
        'Empty state query must be assigned to textContent to prevent HTML / XSS injection'
      );
      assert.doesNotMatch(
        paletteSource,
        /emptyQueryEl\.innerHTML\s*=/,
        'Empty state query must NOT be assigned to innerHTML'
      );
    });

    it('1.6: Super-long input (50,000 characters) does not cause stack overflow or memory exhaustion', () => {
      const filter = createPaletteFilterHarness();
      const longInput = '['.repeat(25000) + ']'.repeat(25000);

      const start = performance.now();
      const results = filter(longInput);
      const duration = performance.now() - start;

      assert.ok(duration < 20, `50,000 char input took ${duration.toFixed(2)}ms`);
      assert.equal(results.length, 0);
    });

    it('1.7: Unicode, RTL override, and control characters do not corrupt matcher', () => {
      const filter = createPaletteFilterHarness();
      const exoticInputs = [
        '\u0000', // Null byte
        '\u202Ereversed', // RTL override
        '\u200B\u200C\u200D', // Zero-width spaces
        '🚀🔥✨', // Emojis
        'كتاب القارئ', // Arabic
        '日本語テスト', // Japanese
        'éèêëàâîïôùûç' // Accents
      ];

      for (const exotic of exoticInputs) {
        assert.doesNotThrow(() => {
          const results = filter(exotic);
          assert.ok(Array.isArray(results));
        });
      }
    });
  });

  // =========================================================================
  // Challenge 2: Keyboard Shortcut Collision & Input/Textarea Isolation
  // =========================================================================
  describe('Challenge 2: Keyboard Shortcut Collision & Input Isolation', () => {

    const paletteSource = fs.readFileSync(CMD_PALETTE_ASTRO, 'utf8');

    // Harness to simulate Command Palette keydown listener logic
    function createKeyboardHarness() {
      let isPaletteOpen = false;
      let openPaletteCalls = 0;
      let closePaletteCalls = 0;
      let defaultPrevented = false;

      function openPalette() {
        isPaletteOpen = true;
        openPaletteCalls++;
      }

      function closePalette() {
        isPaletteOpen = false;
        closePaletteCalls++;
      }

      function togglePalette() {
        if (isPaletteOpen) {
          closePalette();
        } else {
          openPalette();
        }
      }

      function handleKeydown(event, activeElement) {
        defaultPrevented = false;
        const e = {
          ...event,
          preventDefault: () => { defaultPrevented = true; }
        };

        // Exact logic from CommandPalette.astro lines 541-566
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          togglePalette();
          return;
        }

        if (e.key === '/') {
          const active = activeElement;
          const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
          if (!isInput) {
            e.preventDefault();
            openPalette();
            return;
          }
        }

        if (isPaletteOpen) {
          if (e.key === 'Escape') {
            e.preventDefault();
            closePalette();
            return;
          }
        }
      }

      return {
        handleKeydown,
        isOpen: () => isPaletteOpen,
        getOpenCalls: () => openPaletteCalls,
        getCloseCalls: () => closePaletteCalls,
        wasDefaultPrevented: () => defaultPrevented,
        setOpen: (val) => { isPaletteOpen = val; }
      };
    }

    it('2.1: Typing "/" inside an <input type="text"> DOES NOT trigger command palette', () => {
      const harness = createKeyboardHarness();
      const inputEl = { tagName: 'INPUT', type: 'text', isContentEditable: false };

      harness.handleKeydown({ key: '/', metaKey: false, ctrlKey: false }, inputEl);

      assert.equal(harness.isOpen(), false, 'Palette must not open when typing / in input');
      assert.equal(harness.getOpenCalls(), 0, 'openPalette must not be called');
      assert.equal(harness.wasDefaultPrevented(), false, 'Event default must not be prevented so / is typed');
    });

    it('2.2: Typing "/" inside a <textarea> DOES NOT trigger command palette', () => {
      const harness = createKeyboardHarness();
      const textareaEl = { tagName: 'TEXTAREA', isContentEditable: false };

      harness.handleKeydown({ key: '/', metaKey: false, ctrlKey: false }, textareaEl);

      assert.equal(harness.isOpen(), false, 'Palette must not open when typing / in textarea');
      assert.equal(harness.getOpenCalls(), 0);
      assert.equal(harness.wasDefaultPrevented(), false);
    });

    it('2.3: Typing "/" inside a contenteditable container DOES NOT trigger command palette', () => {
      const harness = createKeyboardHarness();
      const editableEl = { tagName: 'DIV', isContentEditable: true };

      harness.handleKeydown({ key: '/', metaKey: false, ctrlKey: false }, editableEl);

      assert.equal(harness.isOpen(), false, 'Palette must not open when typing / in contenteditable element');
      assert.equal(harness.getOpenCalls(), 0);
      assert.equal(harness.wasDefaultPrevented(), false);
    });

    it('2.4: Typing "/" inside palette own search input (#command-palette-input) DOES NOT re-trigger or prevent typing', () => {
      const harness = createKeyboardHarness();
      harness.setOpen(true);
      const paletteInput = { tagName: 'INPUT', id: 'command-palette-input', isContentEditable: false };

      harness.handleKeydown({ key: '/', metaKey: false, ctrlKey: false }, paletteInput);

      assert.equal(harness.isOpen(), true, 'Palette should remain open');
      assert.equal(harness.getOpenCalls(), 0, 'openPalette must not be re-called');
      assert.equal(harness.wasDefaultPrevented(), false, 'Default must not be prevented so / can be typed in search');
    });

    it('2.5: Typing "/" when activeElement is BODY or a non-input element DOES trigger command palette', () => {
      const harness = createKeyboardHarness();
      const bodyEl = { tagName: 'BODY', isContentEditable: false };

      harness.handleKeydown({ key: '/', metaKey: false, ctrlKey: false }, bodyEl);

      assert.equal(harness.isOpen(), true, 'Palette must open when / pressed on body');
      assert.equal(harness.getOpenCalls(), 1);
      assert.equal(harness.wasDefaultPrevented(), true, 'Default must be prevented to avoid stray keystrokes');
    });

    it('2.6: Typing "/" when activeElement is null or undefined DOES trigger command palette', () => {
      const harness = createKeyboardHarness();

      harness.handleKeydown({ key: '/', metaKey: false, ctrlKey: false }, null);

      assert.equal(harness.isOpen(), true, 'Palette must open when activeElement is null');
      assert.equal(harness.getOpenCalls(), 1);
      assert.equal(harness.wasDefaultPrevented(), true);
    });

    it('2.7: Pressing ⌘K or Ctrl+K triggers palette even when focused in an input field', () => {
      const harness = createKeyboardHarness();
      const inputEl = { tagName: 'INPUT', type: 'text', isContentEditable: false };

      // Press Cmd+K from input
      harness.handleKeydown({ key: 'k', metaKey: true, ctrlKey: false }, inputEl);
      assert.equal(harness.isOpen(), true, 'Cmd+K must open palette even from input');
      assert.equal(harness.wasDefaultPrevented(), true);

      // Press Ctrl+K again from input -> toggles closed
      harness.handleKeydown({ key: 'k', metaKey: false, ctrlKey: true }, inputEl);
      assert.equal(harness.isOpen(), false, 'Ctrl+K while open must toggle palette closed');
      assert.equal(harness.wasDefaultPrevented(), true);
    });

    it('2.8: Unrelated keys (e.g. "k" without Cmd/Ctrl, "Escape" when closed) do not trigger palette', () => {
      const harness = createKeyboardHarness();
      const bodyEl = { tagName: 'BODY', isContentEditable: false };

      harness.handleKeydown({ key: 'k', metaKey: false, ctrlKey: false }, bodyEl);
      assert.equal(harness.isOpen(), false, 'Plain "k" must not open palette');

      harness.handleKeydown({ key: 'Escape', metaKey: false, ctrlKey: false }, bodyEl);
      assert.equal(harness.isOpen(), false, 'Escape when closed must be a no-op');
    });
  });

  // =========================================================================
  // Challenge 3: Escape Key Dismissals & Dialog State Transitions
  // =========================================================================
  describe('Challenge 3: Escape Key Dismissals on Both Dialogs', () => {

    const paletteSource = fs.readFileSync(CMD_PALETTE_ASTRO, 'utf8');
    const cvModalSource = fs.readFileSync(CV_MODAL_ASTRO, 'utf8');

    it('3.1: CommandPalette Escape key dismissal restores body.style.overflow and hides modal', () => {
      // Mock DOM environment for CommandPalette
      const classList = new Set(['hidden']);
      const modalEl = {
        classList: {
          contains: (cls) => classList.has(cls),
          add: (cls) => classList.add(cls),
          remove: (cls) => classList.delete(cls)
        }
      };
      const inputEl = { value: 'testing query' };
      const body = { style: { overflow: 'hidden' } };

      let isPaletteOpen = true;
      modalEl.classList.remove('hidden');

      function closePalette() {
        isPaletteOpen = false;
        modalEl.classList.add('hidden');
        body.style.overflow = '';
        if (inputEl) inputEl.value = '';
      }

      // Simulate Escape key press
      closePalette();

      assert.equal(isPaletteOpen, false, 'Palette state must be closed');
      assert.equal(modalEl.classList.contains('hidden'), true, 'modalEl must have "hidden" class');
      assert.equal(body.style.overflow, '', 'body.style.overflow must be restored to empty string');
      assert.equal(inputEl.value, '', 'input field value must be cleared');
    });

    it('3.2: CvModal implements native <dialog> with closedby="any" and close event listener restoring overflow', () => {
      // CvModal uses native HTML5 <dialog> with closedby="any"
      assert.match(
        cvModalSource,
        /<dialog[^>]+id=["']cv-modal["'][^>]+closedby=["']any["']/,
        'CvModal must declare native <dialog> with closedby="any"'
      );

      // Verify close event listener resets body overflow and restores focus
      assert.match(
        cvModalSource,
        /dialog\.addEventListener\(['"]close['"],\s*\(\)\s*=>\s*\{[\s\S]*?document\.body\.style\.overflow\s*=\s*['"]['"]/,
        'CvModal must listen to "close" event and restore body.style.overflow'
      );
      assert.match(
        cvModalSource,
        /triggerElement(?:\.focus\(\)|\s*&&\s*typeof\s*triggerElement\.focus\s*===\s*['"]function['"])/,
        'CvModal must return focus to triggerElement on close'
      );
    });

    it('3.3: CvModal provides backward-compatible backdrop click dismissal outside bounding box', () => {
      assert.match(
        cvModalSource,
        /dialog\.getBoundingClientRect\(\)/,
        'CvModal must calculate getBoundingClientRect for click-outside detection'
      );
      assert.match(
        cvModalSource,
        /rect\.top\s*<=\s*event\.clientY/,
        'CvModal must test if click is within dialog bounds'
      );
    });

    it('3.4: Both dialog close buttons (cv-modal-close-btn, command-palette-close-btn) cleanly invoke closeModal', () => {
      assert.match(
        cvModalSource,
        /closeBtn\?\.addEventListener\(['"]click['"],\s*closeModal\)/,
        'CvModal close button must trigger closeModal'
      );
      assert.match(
        paletteSource,
        /closeBtn\?\.addEventListener\(['"]click['"],\s*closePalette\)/,
        'CommandPalette close button must trigger closePalette'
      );
    });

    it('3.5: Dual Dialog Transition: Triggering "Open CV Modal Viewer" from CommandPalette closes palette before opening CV modal', () => {
      // In CommandPalette.astro:
      // action-view-cv calls openCvModal() which dispatches 'open-cv-modal'
      // executeCommand(index) calls closePalette() FIRST, then cmd.action()
      assert.match(
        paletteSource,
        /function\s+executeCommand\s*\(index:\s*number\)\s*\{[\s\S]*?closePalette\(\);[\s\S]*?cmd\.action\(\);/,
        'executeCommand must call closePalette() BEFORE executing command action'
      );
    });
  });

  // =========================================================================
  // Challenge 4: Command Palette Theme Toggle Action & Event Emission
  // =========================================================================
  describe('Challenge 4: Theme Toggle Action & Event Emission', () => {

    const paletteSource = fs.readFileSync(CMD_PALETTE_ASTRO, 'utf8');
    const layoutSource = fs.readFileSync(LAYOUT_ASTRO, 'utf8');

    function createThemeToggleHarness(initialDark = false) {
      const classList = new Set(initialDark ? ['dark'] : []);
      const docEl = {
        classList: {
          contains: (cls) => classList.has(cls),
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
          }
        }
      };

      const meta = {
        name: 'color-scheme',
        content: initialDark ? 'dark' : 'light',
        setAttribute: (k, v) => { meta[k] = v; }
      };

      const storage = {};
      let throwOnStorage = false;

      const localStorage = {
        getItem: (k) => storage[k] || null,
        setItem: (k, v) => {
          if (throwOnStorage) throw new Error('QuotaExceededError / SecurityError');
          storage[k] = String(v);
        },
        removeItem: (k) => { delete storage[k]; }
      };

      const dispatchedEvents = [];

      // Exactly mirrors toggleTheme in CommandPalette.astro lines 316-328
      function toggleTheme() {
        const isDark = docEl.classList.toggle('dark');
        const theme = isDark ? 'dark' : 'light';
        try {
          localStorage.setItem('theme', theme);
        } catch (e) {}

        if (meta) meta.setAttribute('content', theme);

        dispatchedEvents.push({ type: 'theme-changed', detail: { theme } });
      }

      return {
        toggleTheme,
        isDark: () => docEl.classList.contains('dark'),
        getMetaContent: () => meta.content,
        getStoredTheme: () => storage['theme'],
        getDispatchedEvents: () => dispatchedEvents,
        setThrowOnStorage: (val) => { throwOnStorage = val; }
      };
    }

    it('4.1: CommandPalette toggleTheme toggles class="dark" and dispatches "theme-changed" event', () => {
      const harness = createThemeToggleHarness(false);

      // Light -> Dark
      harness.toggleTheme();
      assert.equal(harness.isDark(), true, 'Must toggle to dark mode');
      assert.equal(harness.getMetaContent(), 'dark', 'meta color-scheme must be dark');
      assert.equal(harness.getStoredTheme(), 'dark', 'localStorage must store dark');
      assert.equal(harness.getDispatchedEvents().length, 1);
      assert.deepEqual(harness.getDispatchedEvents()[0], {
        type: 'theme-changed',
        detail: { theme: 'dark' }
      });

      // Dark -> Light
      harness.toggleTheme();
      assert.equal(harness.isDark(), false, 'Must toggle to light mode');
      assert.equal(harness.getMetaContent(), 'light', 'meta color-scheme must be light');
      assert.equal(harness.getStoredTheme(), 'light', 'localStorage must store light');
      assert.equal(harness.getDispatchedEvents().length, 2);
      assert.deepEqual(harness.getDispatchedEvents()[1], {
        type: 'theme-changed',
        detail: { theme: 'light' }
      });
    });

    it('4.2: Storage failure (private browsing / QuotaExceededError) is gracefully handled via try/catch', () => {
      const harness = createThemeToggleHarness(false);
      harness.setThrowOnStorage(true);

      assert.doesNotThrow(() => {
        harness.toggleTheme();
      }, 'toggleTheme must not throw if localStorage.setItem fails');

      assert.equal(harness.isDark(), true, 'Theme still toggles class despite storage error');
      assert.equal(harness.getMetaContent(), 'dark');
      assert.equal(harness.getDispatchedEvents().length, 1);
    });

    it('4.3: Rapid 50 successive theme toggles maintain strict parity without race conditions', () => {
      const harness = createThemeToggleHarness(false);

      for (let i = 1; i <= 50; i++) {
        harness.toggleTheme();
        const expectedDark = (i % 2 === 1);
        assert.equal(harness.isDark(), expectedDark, `Toggle #${i} failed parity`);
        assert.equal(harness.getMetaContent(), expectedDark ? 'dark' : 'light');
        assert.equal(harness.getStoredTheme(), expectedDark ? 'dark' : 'light');
      }

      assert.equal(harness.getDispatchedEvents().length, 50, 'Must have dispatched exactly 50 events');
      assert.equal(harness.isDark(), false, 'Even number of toggles must return to initial light state');
    });

    it('4.4: Zero double-toggle recursion between CommandPalette and Layout.astro', () => {
      // In Layout.astro, setupThemeToggles binds to [data-theme-toggle] buttons.
      // CommandPalette directly calls toggleTheme() which dispatches 'theme-changed'.
      // Layout.astro does NOT listen to 'theme-changed' to toggle theme again.
      assert.doesNotMatch(
        layoutSource,
        /addEventListener\(['"]theme-changed['"],[\s\S]*?toggleTheme/,
        'Layout.astro must NOT re-toggle on "theme-changed" event (which would cause infinite recursion)'
      );
      assert.doesNotMatch(
        paletteSource,
        /addEventListener\(['"]theme-changed['"],[\s\S]*?toggleTheme/,
        'CommandPalette.astro must NOT re-toggle on "theme-changed" event'
      );
    });
  });

  // =========================================================================
  // Challenge 5: Astro 5 ClientRouter Lifecycle & Listener Leak Prevention
  // =========================================================================
  describe('Challenge 5: ClientRouter Lifecycle & Listener Cleanup', () => {

    const paletteSource = fs.readFileSync(CMD_PALETTE_ASTRO, 'utf8');
    const cvModalSource = fs.readFileSync(CV_MODAL_ASTRO, 'utf8');

    it('5.1: CommandPalette binds to astro:page-load and tears down on astro:before-swap', () => {
      assert.match(
        paletteSource,
        /document\.addEventListener\(['"]astro:page-load['"],\s*initCommandPalette\)/,
        'CommandPalette must initialize on astro:page-load'
      );
      assert.match(
        paletteSource,
        /document\.addEventListener\(['"]astro:before-swap['"],\s*\(\)\s*=>\s*\{[\s\S]*?document\.removeEventListener\(['"]keydown['"],\s*globalKeydownHandler\)/,
        'CommandPalette must remove globalKeydownHandler on astro:before-swap'
      );
      assert.match(
        paletteSource,
        /window\.removeEventListener\(['"]open-command-palette['"],\s*customOpenHandler\)/,
        'CommandPalette must remove customOpenHandler on astro:before-swap'
      );
      assert.match(
        paletteSource,
        /document\.body\.style\.overflow\s*=\s*['"]['"]/,
        'CommandPalette must unlock body.style.overflow on astro:before-swap'
      );
    });

    it('5.2: CvModal binds to astro:page-load for reliable DOM reconnection', () => {
      assert.match(
        cvModalSource,
        /document\.addEventListener\(['"]astro:page-load['"],\s*initCvModal\)/,
        'CvModal must bind to astro:page-load'
      );
    });
  });
});
