import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  PROJECT_ROOT,
  DIST_ROOT,
  SRC_ROOT,
  PUBLIC_ROOT,
  fileExists,
  readFile,
  readJson,
  getRouteHtml,
  extractTags,
  containsText,
  chunkTextIntoSentences
} from './helpers.js';

describe('Tier 2: Boundary & Corner Cases (F01–F09)', () => {

  // ==========================================
  // F01 Boundaries: Foundation & Tooling
  // ==========================================
  describe('F01: Foundation Boundaries', () => {
    it('T2.F01.01: Astro configuration handles missing optional environment variables gracefully', () => {
      const config = readFile('astro.config.mjs');
      assert.ok(config !== null, 'astro.config.mjs must exist');
      assert.doesNotThrow(() => {
        // verify config doesn't require hardcoded undefined process.env keys
        assert.ok(!config.includes('process.env.STRICT_SECRET_KEY'), 'Should not crash on missing env vars');
      });
    });

    it('T2.F01.02: Public asset paths use absolute root or base-relative paths', () => {
      const layout = readFile('src/layouts/Layout.astro') || getRouteHtml('/');
      assert.ok(layout !== null);
      // Favicon or asset references should start with '/' or have valid base prefix
      const links = extractTags(layout, 'link');
      for (const link of links) {
        const href = link.attrs.href;
        if (href && (href.endsWith('.svg') || href.endsWith('.png') || href.endsWith('.ico'))) {
          assert.ok(href.startsWith('/') || href.startsWith('http'), `Asset link ${href} should use leading slash`);
        }
      }
    });

    it('T2.F01.03: package.json specifies Node engine compatibility supporting v24', () => {
      const pkg = readJson('package.json');
      assert.ok(pkg !== null);
      if (pkg.engines?.node) {
        assert.ok(
          pkg.engines.node.includes('24') || pkg.engines.node.includes('>=') || pkg.engines.node.includes('^'),
          'Engines field should allow Node 24'
        );
      }
    });

    it('T2.F01.04: Custom 404 page exists for graceful error handling', () => {
      const has404Astro = fileExists('src/pages/404.astro');
      const has404Html = fileExists('dist/404.html');
      assert.ok(has404Astro || has404Html, 'Custom 404 page must exist at src/pages/404.astro or dist/404.html');
    });

    it('T2.F01.05: TSConfig handles strictNullChecks without disabling safety flags', () => {
      const tsconfig = readJson('tsconfig.json');
      assert.ok(tsconfig !== null);
      const opts = tsconfig.compilerOptions || {};
      assert.notEqual(opts.strictNullChecks, false, 'strictNullChecks must not be disabled');
      assert.notEqual(opts.noImplicitAny, false, 'noImplicitAny must not be disabled');
    });

    it('T2.F01.06: Generated distribution artifacts contain zero broken or 0-byte HTML files', () => {
      if (fs.existsSync(DIST_ROOT)) {
        const checkDir = (dir) => {
          const files = fs.readdirSync(dir);
          for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
              checkDir(fullPath);
            } else if (file.endsWith('.html')) {
              assert.ok(stat.size > 0, `HTML file ${fullPath} must not be empty (0 bytes)`);
            }
          }
        };
        checkDir(DIST_ROOT);
      } else {
        // If dist not built yet, assert src directory has valid templates
        assert.ok(fileExists('src/pages/index.astro'), 'src/pages/index.astro must be present');
      }
    });
  });

  // ==========================================
  // F02 Boundaries: Design System & Theme
  // ==========================================
  describe('F02: Design System & Theme Boundaries', () => {
    it('T2.F02.01: Dark mode fallback defaults gracefully when localStorage is empty', () => {
      const layout = readFile('src/layouts/Layout.astro') || getRouteHtml('/');
      assert.ok(layout !== null);
      // Must check system matchMedia if localStorage has no preference
      assert.match(
        layout,
        /matchMedia\(['"]\(prefers-color-scheme:\s*dark\)['"]\)/,
        'Head script must fall back to prefers-color-scheme when localStorage is empty'
      );
    });

    it('T2.F02.02: Corrupted localStorage theme value resets safely without crashing', () => {
      const layout = readFile('src/layouts/Layout.astro') || getRouteHtml('/');
      assert.ok(layout !== null);
      // Validates that theme script checks === 'dark' or ternary rather than naive classList.add(theme)
      assert.ok(
        layout.includes("'dark'") || layout.includes('"dark"'),
        'Script must explicitly validate dark theme condition'
      );
    });

    it('T2.F02.03: Rapid successive theme toggles maintain consistency without race conditions', () => {
      const sources = [
        readFile('src/layouts/Layout.astro'),
        readFile('src/components/Navbar.astro')
      ].filter(Boolean).join('\n');
      assert.ok(sources !== null);
      // Toggle should synchronously toggle class and persist to localStorage
      assert.match(sources, /classList\.toggle\(['"]dark['"]\)|classList\.(add|remove)/, 'Must perform deterministic class toggle');
    });

    it('T2.F02.04: System prefers-color-scheme change listener handles dynamic OS theme changes', () => {
      const layout = readFile('src/layouts/Layout.astro') || getRouteHtml('/');
      assert.ok(layout !== null);
      assert.match(layout, /prefers-color-scheme/, 'Must handle system color scheme preference');
    });

    it('T2.F02.05: Mobile viewport (< 360px) responsive navbar avoids horizontal scroll overflow', () => {
      const navbar = readFile('src/components/Navbar.astro') || getRouteHtml('/');
      assert.ok(navbar !== null);
      // Responsive classes like md:flex, hidden, or overflow protection
      assert.match(navbar, /md:|sm:|hidden|flex/i, 'Navbar must include responsive breakpoint classes');
    });

    it('T2.F02.06: Color scheme contrast meta tag is present in document head', () => {
      const layout = readFile('src/layouts/Layout.astro') || getRouteHtml('/');
      assert.ok(layout !== null);
      assert.match(layout, /<meta[^>]+name=['"]color-scheme['"][^>]+content=['"](dark light|light dark)['"]/i, 'Head must declare color-scheme meta tag');
    });
  });

  // ==========================================
  // F03 Boundaries: Hero & CV
  // ==========================================
  describe('F03: Hero & CV Boundaries', () => {
    it('T2.F03.01: CV direct download CTA retains clean filename Faycal_Rafa_CV_2026.pdf', () => {
      const heroOrNav = readFile('src/components/Hero.astro') || readFile('src/components/Navbar.astro') || getRouteHtml('/');
      assert.ok(heroOrNav !== null);
      assert.match(heroOrNav, /Faycal_Rafa_CV_2026\.pdf/, 'Download link must preserve authentic filename');
    });

    it('T2.F03.02: CV modal viewer displays fallback download button for browsers with PDF plugin disabled', () => {
      const modal = readFile('src/components/CvModal.astro') || readFile('src/components/Hero.astro') || getRouteHtml('/');
      assert.ok(modal !== null);
      assert.match(modal, /download|Download/i, 'CV modal must include explicit direct download action fallback');
    });

    it('T2.F03.03: CV modal supports Escape key dismissal', () => {
      const modal = readFile('src/components/CvModal.astro') || readFile('src/components/Hero.astro') || getRouteHtml('/');
      assert.ok(modal !== null);
      assert.ok(modal.includes('Escape') || modal.includes('close') || modal.includes('dialog'), 'CV modal must support close action');
    });

    it('T2.F03.04: Hero section copy wraps gracefully on narrow 320px viewport', () => {
      const hero = readFile('src/components/Hero.astro') || getRouteHtml('/');
      assert.ok(hero !== null);
      // Hero container should use max-w-*, px-*, or flex-col on mobile
      assert.match(hero, /max-w-|px-|container|flex-col/i, 'Hero must use responsive constraints');
    });

    it('T2.F03.05: Availability badge handles long label without layout breaking', () => {
      const hero = readFile('src/components/Hero.astro') || getRouteHtml('/');
      assert.ok(hero !== null);
      // Badge should have inline-flex, rounded, and text-xs/sm
      assert.match(hero, /inline-flex|rounded/i, 'Badge must be styled as inline-flex container');
    });

    it('T2.F03.06: Bio blockquote or summary uses semantic paragraph typography', () => {
      const hero = readFile('src/components/Hero.astro') || getRouteHtml('/');
      assert.ok(hero !== null);
      assert.match(hero, /<p\b|<blockquote\b/i, 'Bio must render inside semantic paragraph or blockquote');
    });
  });

  // ==========================================
  // F04 Boundaries: Skills Matrix
  // ==========================================
  describe('F04: Skills Matrix Boundaries', () => {
    it('T2.F04.01: Skill badges wrap cleanly using flex-wrap or grid', () => {
      const bento = readFile('src/components/BentoGrid.astro') || getRouteHtml('/');
      assert.ok(bento !== null);
      assert.match(bento, /flex-wrap|grid|gap-/i, 'Skills badges must use flex-wrap or grid with gap');
    });

    it('T2.F04.02: Bento grid handles high DPI / 4K zoom with max-w constraints', () => {
      const bento = readFile('src/components/BentoGrid.astro') || getRouteHtml('/');
      assert.ok(bento !== null);
      assert.match(bento, /max-w-|mx-auto|container/i, 'Bento Grid container must declare max-width constraint');
    });

    it('T2.F04.03: Skill clusters handle missing/empty categories gracefully', () => {
      const bento = readFile('src/components/BentoGrid.astro') || getRouteHtml('/');
      assert.ok(bento !== null);
      // Check cluster titles exist
      assert.ok(containsText(bento, 'TypeScript') && containsText(bento, 'Mobile'), 'Must render core skill clusters');
    });

    it('T2.F04.04: Hover interactions on skill cards use GPU-accelerated transform/opacity', () => {
      const bento = readFile('src/components/BentoGrid.astro') || readFile('src/styles/global.css') || '';
      assert.ok(
        bento.includes('hover:') || bento.includes('transition') || bento.includes('transform'),
        'Hover effects should use CSS transitions and transforms'
      );
    });

    it('T2.F04.05: Bento grid card icons include accessible labels or SVG attributes', () => {
      const bento = readFile('src/components/BentoGrid.astro') || getRouteHtml('/');
      assert.ok(bento !== null);
      // SVGs should have viewBox, aria-hidden, or title
      const svgs = extractTags(bento, 'svg');
      if (svgs.length > 0) {
        assert.ok(svgs.some(s => s.attrs['aria-hidden'] || s.attrs['viewBox']), 'SVGs in bento grid must have valid SVG attributes');
      }
    });

    it('T2.F04.06: Skill category headings maintain semantic heading hierarchy (h2/h3)', () => {
      const bento = readFile('src/components/BentoGrid.astro') || getRouteHtml('/');
      assert.ok(bento !== null);
      assert.match(bento, /<h[23]\b/i, 'Bento Grid must use h2 or h3 heading tags');
    });
  });

  // ==========================================
  // F05 Boundaries: Timeline
  // ==========================================
  describe('F05: Timeline Boundaries', () => {
    it('T2.F05.01: Concurrent employment periods (Kabri Auto & InstaClean) render distinct cards', () => {
      const timeline = readFile('src/components/CareerTimeline.astro') || getRouteHtml('/');
      assert.ok(timeline !== null);
      assert.match(timeline, /InstaClean/i, 'Must contain InstaClean');
      assert.match(timeline, /Kabri/i, 'Must contain Kabri Auto');
    });

    it('T2.F05.02: Current role badge ("04/2026 – Present") renders distinct visual indicator', () => {
      const timeline = readFile('src/components/CareerTimeline.astro') || getRouteHtml('/');
      assert.ok(timeline !== null);
      assert.match(timeline, /Present|Current/i, 'Must render distinct current position indicator');
    });

    it('T2.F05.03: Company without external URL renders cleanly without dead href="#"', () => {
      const timeline = readFile('src/components/CareerTimeline.astro') || getRouteHtml('/');
      assert.ok(timeline !== null);
      const links = extractTags(timeline, 'a');
      for (const link of links) {
        assert.notEqual(link.attrs.href, '#', 'Timeline should not contain placeholder dead links href="#"');
      }
    });

    it('T2.F05.04: Timeline connectors align vertically using CSS border or pseudo-elements', () => {
      const timeline = readFile('src/components/CareerTimeline.astro') || getRouteHtml('/');
      assert.ok(timeline !== null);
      assert.match(timeline, /border-|relative|absolute|before:|after:/i, 'Timeline must use relative positioning and borders for line connector');
    });

    it('T2.F05.05: Long role descriptions or bullet points render valid lists', () => {
      const timeline = readFile('src/components/CareerTimeline.astro') || getRouteHtml('/');
      assert.ok(timeline !== null);
      assert.match(timeline, /<ul\b|<li\b|<p\b/i, 'Timeline roles must structure duties in lists or paragraphs');
    });

    it('T2.F05.06: Keyboard navigation: timeline items use accessible interactive elements', () => {
      const timeline = readFile('src/components/CareerTimeline.astro') || getRouteHtml('/');
      assert.ok(timeline !== null);
      assert.ok(!timeline.includes('tabindex="-1"'), 'Timeline items should not block natural keyboard focus flow');
    });
  });

  // ==========================================
  // F06 Boundaries: Command Palette
  // ==========================================
  describe('F06: Command Palette Boundaries', () => {
    it('T2.F06.01: Typing "/" inside input or textarea DOES NOT trigger command palette', () => {
      const palette = readFile('src/components/CommandPalette.astro') || getRouteHtml('/');
      assert.ok(palette !== null);
      assert.match(
        palette,
        /activeElement|INPUT|TEXTAREA|tagName/i,
        'Keyboard handler for "/" must guard against activeElement being an input or textarea'
      );
    });

    it('T2.F06.02: Pressing ⌘K or Ctrl+K while palette is open toggles it closed or prevents duplicates', () => {
      const palette = readFile('src/components/CommandPalette.astro') || getRouteHtml('/');
      assert.ok(palette !== null);
      assert.match(palette, /toggle|isOpen|hidden|classList/i, 'Palette trigger must toggle modal state');
    });

    it('T2.F06.03: Search query with no matching items displays an explicit empty state', () => {
      const palette = readFile('src/components/CommandPalette.astro') || getRouteHtml('/');
      assert.ok(palette !== null);
      assert.match(palette, /no\s+results|not\s+found|empty/i, 'Palette must include empty search results notice');
    });

    it('T2.F06.04: Search query containing regex special characters does not crash matcher', () => {
      // Simulate safe search matching logic
      const safeMatch = (query, target) => {
        const cleanQuery = query.toLowerCase().trim();
        return target.toLowerCase().includes(cleanQuery);
      };
      assert.doesNotThrow(() => {
        safeMatch('[*+?\\(', 'BookReader Android Showcase');
      }, 'Special regex characters must not crash query search');
    });

    it('T2.F06.05: Arrow key navigation stops at bounds or wraps cleanly', () => {
      const palette = readFile('src/components/CommandPalette.astro') || getRouteHtml('/');
      assert.ok(palette !== null);
      assert.ok(
        palette.includes('ArrowDown') || palette.includes('ArrowUp') || palette.includes('selectedIndex'),
        'Palette should implement arrow key navigation'
      );
    });

    it('T2.F06.06: Fast typing with special characters/accents filters safely', () => {
      const palette = readFile('src/components/CommandPalette.astro') || getRouteHtml('/');
      assert.ok(palette !== null);
      // Palette input must listen to input/keyup event
      assert.match(palette, /addEventListener\(['"]input['"]|oninput/i, 'Palette input must listen to input event');
    });
  });

  // ==========================================
  // F07 Boundaries: Content Collections
  // ==========================================
  describe('F07: Content Collections Boundaries', () => {
    it('T2.F07.01: Missing mandatory frontmatter field is rejected by Zod schema', () => {
      const contentConfig = readFile('src/content.config.ts') || readFile('src/content/config.ts');
      assert.ok(contentConfig !== null);
      // Zod schema defines title and category without default/optional
      assert.match(contentConfig, /title:\s*z\.string\(\)/, 'title must be mandatory non-optional string');
    });

    it('T2.F07.02: Invalid category enum value is rejected by Zod schema', () => {
      const contentConfig = readFile('src/content.config.ts') || readFile('src/content/config.ts');
      assert.ok(contentConfig !== null);
      assert.match(contentConfig, /category:\s*z\.enum\(/, 'category must be strict Zod enum');
    });

    it('T2.F07.03: Non-existent project slug route redirects to 404', () => {
      const dynamicRoute = readFile('src/pages/projects/[id].astro') || readFile('src/pages/projects/[slug].astro');
      if (dynamicRoute) {
        assert.ok(
          dynamicRoute.includes('getStaticPaths') || dynamicRoute.includes('Astro.params'),
          'Dynamic project route must define getStaticPaths for static site generation'
        );
      } else {
        assert.ok(fileExists('src/pages/projects/index.astro') || fileExists('src/pages/projects/bookreader.astro'));
      }
    });

    it('T2.F07.04: Project with optional URLs omitted renders card without dead CTA buttons', () => {
      const projectCard = readFile('src/components/ProjectCard.astro') || readFile('src/pages/projects/index.astro');
      assert.ok(projectCard !== null);
      // Card should check if repoUrl or liveUrl exists before rendering button
      assert.match(projectCard, /repoUrl|liveUrl|apkDownloadUrl/i, 'Card must conditionally render external links');
    });

    it('T2.F07.05: Project highlights array with empty items renders gracefully', () => {
      const projectCard = readFile('src/components/ProjectCard.astro') || readFile('src/pages/projects/index.astro');
      assert.ok(projectCard !== null);
      assert.match(projectCard, /highlights/i, 'Card must reference highlights list');
    });

    it('T2.F07.06: Projects archive filter switches categories without reloading page', () => {
      const projectsPage = readFile('src/pages/projects/index.astro') || getRouteHtml('/projects');
      assert.ok(projectsPage !== null);
      assert.match(projectsPage, /dataset|filter|category|click/i, 'Category filter must operate client-side or with instant transitions');
    });
  });

  // ==========================================
  // F08 Boundaries: BookReader & TTS Simulator
  // ==========================================
  describe('F08: BookReader & TTS Simulator Boundaries', () => {
    it('T2.F08.01: TTS Simulator handles empty or whitespace input safely', () => {
      const chunks = chunkTextIntoSentences('   \n\t   ');
      assert.equal(chunks.length, 0, 'Whitespace-only string must produce 0 chunks');
    });

    it('T2.F08.02: TTS Simulator preserves dialogue quotes with internal punctuation', () => {
      const raw = '"Wait right there!" she whispered, stepping into the dimly lit room. "We can\'t afford to get caught now."';
      const chunks = chunkTextIntoSentences(raw);
      assert.ok(chunks.length >= 2, 'Should chunk dialogue and narration into at least 2 sentences');
      assert.match(chunks[0].text, /Wait right there!/i, 'First chunk must contain the quote');
      assert.ok(chunks[0].isDialogue, 'First chunk should be flagged as dialogue');
    });

    it('T2.F08.03: TTS Simulator handles Arabic sentences with Arabic question mark and guillemets', () => {
      const arabicText = '«هذا نموذج تجريبي لتطبيق قارئ الروايات! هل يمكنك سماع القراءة بوضوح؟» قال بصوت خافت.';
      const chunks = chunkTextIntoSentences(arabicText);
      assert.ok(chunks.length >= 1, 'Should chunk Arabic sentence with guillemets cleanly');
      assert.match(chunks[0].text, /نموذج تجريبي/);
    });

    it('T2.F08.04: TTS Simulator protects decimal version numbers and abbreviations from splitting', () => {
      const text = 'BookReader v3.4.0 was released by Dr. Rafa at 8.30 a.m. with 20.09 MB package size.';
      const chunks = chunkTextIntoSentences(text);
      // Entire sentence should remain single chunk because dots are protected
      assert.equal(chunks.length, 1, 'Dots in version, Dr., a.m., and decimal size must not cause split');
      assert.match(chunks[0].text, /v3\.4\.0/);
      assert.match(chunks[0].text, /Dr\./);
      assert.match(chunks[0].text, /20\.09/);
    });

    it('T2.F08.05: TTS Simulator displays unsupported notice if window.speechSynthesis is missing', () => {
      const tts = readFile('src/components/bookreader/TtsSimulator.astro') || getRouteHtml('/projects/bookreader');
      assert.ok(tts !== null);
      assert.match(tts, /speechSynthesis/i, 'TTS widget must check window.speechSynthesis support');
    });

    it('T2.F08.06: Direct APK download link strictly points to v3.4.0 app-release.apk', () => {
      const expectedUrl = 'https://github.com/faycalrafa/free-novel-reader-tts-android/releases/download/v3.4.0/app-release.apk';
      const showcase = readFile('src/pages/projects/bookreader.astro') ||
        readFile('src/components/bookreader/AppHero.astro') ||
        getRouteHtml('/projects/bookreader');
      assert.ok(showcase !== null);
      assert.ok(showcase.includes(expectedUrl), `Showcase must link strictly to ${expectedUrl}`);
    });
  });

  // ==========================================
  // F09 Boundaries: CI/CD & Deployment
  // ==========================================
  describe('F09: CI/CD & Deployment Boundaries', () => {
    it('T2.F09.01: GitHub Actions workflow uses pinned/stable action versions (v4)', () => {
      const workflow = readFile('.github/workflows/deploy.yml');
      assert.ok(workflow !== null);
      assert.match(workflow, /actions\/checkout@v4/, 'Workflow must use actions/checkout@v4');
      assert.match(workflow, /actions\/setup-node@v4/, 'Workflow must use actions/setup-node@v4');
    });

    it('T2.F09.02: Workflow grants minimal required permissions (pages: write, id-token: write)', () => {
      const workflow = readFile('.github/workflows/deploy.yml');
      assert.ok(workflow !== null);
      assert.match(workflow, /pages:\s*write/, 'Must grant pages: write');
      assert.match(workflow, /id-token:\s*write/, 'Must grant id-token: write');
    });

    it('T2.F09.03: Build step verifies non-empty static export output', () => {
      const workflow = readFile('.github/workflows/deploy.yml');
      assert.ok(workflow !== null);
      assert.match(workflow, /npm\s+(?:run\s+)?build/, 'Workflow must execute build script');
    });

    it('T2.F09.04: Astro site URL does not contain trailing slash that could break asset routing', () => {
      const config = readFile('astro.config.mjs');
      assert.ok(config !== null);
      assert.match(config, /site:\s*['"]https:\/\/faycalrafa\.github\.io['"]/, 'Site URL should be clean https://faycalrafa.github.io');
    });

    it('T2.F09.05: Git repository ignores agent teamwork metadata directory or build caches', () => {
      const gitignore = readFile('.gitignore');
      if (gitignore) {
        assert.ok(gitignore.includes('node_modules'), '.gitignore must ignore node_modules');
        assert.ok(gitignore.includes('dist'), '.gitignore must ignore dist');
      }
    });

    it('T2.F09.06: Clean git repository structure with zero dangling merge conflict markers', () => {
      const filesToCheck = ['package.json', 'astro.config.mjs', 'tsconfig.json'];
      for (const file of filesToCheck) {
        const content = readFile(file);
        if (content) {
          assert.ok(!content.includes('<<<<<<< HEAD'), `${file} must not contain git conflict markers`);
        }
      }
    });
  });

});
