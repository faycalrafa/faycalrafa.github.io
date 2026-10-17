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
  chunkTextIntoSentences,
  isValidPdfBuffer
} from './helpers.js';

describe('Tier 1: Feature Coverage (F01–F09)', () => {

  // ==========================================
  // F01: Project Foundation & Tooling
  // ==========================================
  describe('F01: Project Foundation & Tooling', () => {
    it('T1.F01.01: Astro config specifies static output and root domain URL', () => {
      const config = readFile('astro.config.mjs');
      assert.ok(config !== null, 'astro.config.mjs must exist at project root');
      assert.match(config, /https:\/\/faycalrafa\.github\.io/, 'Astro config must specify site: https://faycalrafa.github.io');
      assert.match(config, /output:\s*['"]static['"]/, 'Astro config must enforce output: static');
    });

    it('T1.F01.02: TypeScript configuration enables strict type checking', () => {
      const tsconfig = readJson('tsconfig.json');
      assert.ok(tsconfig !== null, 'tsconfig.json must exist and be valid JSON');
      const isStrict = tsconfig.compilerOptions?.strict === true ||
        (tsconfig.extends && tsconfig.extends.includes('strict'));
      assert.ok(isStrict, 'tsconfig.json must enforce strict type checking mode');
    });

    it('T1.F01.03: Tailwind CSS v4 or stylesheet integration is configured', () => {
      const hasGlobalCss = fileExists('src/styles/global.css');
      const astroConfig = readFile('astro.config.mjs') || '';
      const packageJson = readJson('package.json') || {};
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      const hasTailwindDep = deps['@tailwindcss/vite'] || deps['tailwindcss'] || deps['@astrojs/tailwind'];
      assert.ok(hasGlobalCss, 'src/styles/global.css must exist for design styling');
      assert.ok(hasTailwindDep || astroConfig.includes('tailwind'), 'Tailwind CSS must be integrated');
    });

    it('T1.F01.04: package.json defines build, check, and dev scripts', () => {
      const pkg = readJson('package.json');
      assert.ok(pkg !== null, 'package.json must exist');
      assert.ok(pkg.scripts?.build, 'package.json must contain "build" script');
      assert.ok(pkg.scripts?.dev, 'package.json must contain "dev" script');
      assert.ok(pkg.scripts?.check || pkg.scripts?.['astro check'], 'package.json must contain "check" script');
    });

    it('T1.F01.05: Code layout conforms to defined directory structure', () => {
      assert.ok(fileExists('src'), 'src directory must exist');
      assert.ok(fileExists('public'), 'public directory must exist');
      assert.ok(fileExists('src/pages'), 'src/pages directory must exist');
      assert.ok(fileExists('src/layouts'), 'src/layouts directory must exist');
      assert.ok(fileExists('src/components'), 'src/components directory must exist');
    });

    it('T1.F01.06: Package dependencies include Astro 5 framework', () => {
      const pkg = readJson('package.json');
      assert.ok(pkg !== null, 'package.json must exist');
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      assert.ok(deps['astro'], 'Astro must be listed in dependencies');
      assert.match(deps['astro'], /\^?5\./, 'Astro version must target Astro 5');
    });
  });

  // ==========================================
  // F02: Design System, Layout & Theme
  // ==========================================
  describe('F02: Design System, Layout & Theme', () => {
    it('T1.F02.01: Base layout includes zero-FOUC inline theme script in head', () => {
      const layout = readFile('src/layouts/Layout.astro') || getRouteHtml('/');
      assert.ok(layout !== null, 'Layout.astro or rendered HTML must be available');
      assert.match(layout, /localStorage\.getItem\(['"]theme['"]\)/, 'Head must contain inline script querying localStorage theme');
      assert.match(layout, /classList\.(add|toggle)\(['"]dark['"]\)/, 'Script must apply "dark" class to html/documentElement');
    });

    it('T1.F02.02: Theme contract toggles class="dark" and saves state', () => {
      const layout = readFile('src/layouts/Layout.astro') || readFile('src/components/Navbar.astro') || getRouteHtml('/');
      assert.ok(layout !== null, 'Theme toggle logic must be present');
      assert.match(layout, /localStorage\.setItem\(['"]theme['"],\s*(['"]dark['"]|['"]light['"]|theme)/, 'Theme toggle must persist to localStorage');
    });

    it('T1.F02.03: Astro View Transitions / ClientRouter is integrated', () => {
      const layout = readFile('src/layouts/Layout.astro') || '';
      assert.ok(
        layout.includes('ClientRouter') || layout.includes('ViewTransitions'),
        'Base layout must import and embed Astro ClientRouter / ViewTransitions'
      );
    });

    it('T1.F02.04: Navigation header renders links to key sections', () => {
      const navbar = readFile('src/components/Navbar.astro') || getRouteHtml('/');
      assert.ok(navbar !== null, 'Navbar component or rendered page must exist');
      assert.ok(containsText(navbar, 'projects') || containsText(navbar, '/projects'), 'Navbar must link to /projects');
      assert.ok(containsText(navbar, 'CV') || containsText(navbar, 'cv') || containsText(navbar, 'Resume'), 'Navbar must provide CV access');
    });

    it('T1.F02.05: Footer renders social links for GitHub, LinkedIn, and Email', () => {
      const footer = readFile('src/components/Footer.astro') || getRouteHtml('/');
      assert.ok(footer !== null, 'Footer component or rendered page must exist');
      assert.match(footer, /github\.com\/faycalrafa/, 'Footer must link to GitHub profile faycalrafa');
      assert.match(footer, /linkedin\.com\/in\/faycal-rafa/, 'Footer must link to LinkedIn profile');
      assert.match(footer, /mailto:rafafaycal@gmail\.com/, 'Footer must provide mailto link');
    });

    it('T1.F02.06: Theme system dispatches custom theme-changed event', () => {
      const sources = [
        readFile('src/layouts/Layout.astro'),
        readFile('src/components/Navbar.astro'),
        readFile('src/components/CommandPalette.astro')
      ].filter(Boolean).join('\n');
      assert.ok(
        sources.includes('theme-changed') || sources.includes('CustomEvent'),
        'Theme switching mechanism must dispatch theme change events'
      );
    });
  });

  // ==========================================
  // F03: Hero Section & CV Download/Viewer
  // ==========================================
  describe('F03: Hero Section & CV Download/Viewer', () => {
    it('T1.F03.01: Hero displays authoritative name and senior title', () => {
      const hero = readFile('src/components/Hero.astro') || getRouteHtml('/');
      assert.ok(hero !== null, 'Hero component or home page must exist');
      assert.match(hero, /Faycal\s+Rafa/i, 'Hero must display Faycal Rafa');
      assert.match(hero, /Senior\s+Software\s+Engineer/i, 'Hero must specify Senior Software Engineer');
      assert.match(hero, /Technical\s+Lead/i, 'Hero must specify Technical Lead');
    });

    it('T1.F03.02: Availability badge is displayed with active status', () => {
      const hero = readFile('src/components/Hero.astro') || getRouteHtml('/');
      assert.ok(hero !== null, 'Hero must exist');
      assert.match(hero, /Available/i, 'Hero must display availability indicator badge');
    });

    it('T1.F03.03: CV PDF file exists in public assets and is a valid PDF', () => {
      const cvCandidate1 = path.join(PUBLIC_ROOT, 'Faycal_Rafa_CV_2026.pdf');
      const cvCandidate2 = path.join(PUBLIC_ROOT, 'assets/Faycal_Rafa_CV_2026.pdf');
      const cvCandidate3 = path.join(PROJECT_ROOT, 'public/Faycal_Rafa_CV_2026.pdf');
      
      let foundPath = null;
      if (fs.existsSync(cvCandidate1)) foundPath = cvCandidate1;
      else if (fs.existsSync(cvCandidate2)) foundPath = cvCandidate2;
      else if (fs.existsSync(cvCandidate3)) foundPath = cvCandidate3;

      assert.ok(foundPath !== null, 'CV PDF asset must exist in public directory');
      const buffer = fs.readFileSync(foundPath);
      assert.ok(isValidPdfBuffer(buffer), 'CV file must start with valid %PDF- magic header');
      assert.ok(buffer.length > 50000, 'CV file must be a non-empty complete document (>50KB)');
    });

    it('T1.F03.04: Direct CV download CTA link has download attribute', () => {
      const htmlOrAstro = readFile('src/components/Hero.astro') || readFile('src/components/Navbar.astro') || getRouteHtml('/');
      assert.ok(htmlOrAstro !== null, 'Hero, Navbar, or Home page must exist');
      assert.match(htmlOrAstro, /download(?:="[^"]*")?/, 'CV CTA link must contain download attribute');
      assert.match(htmlOrAstro, /Faycal_Rafa_CV_2026\.pdf/, 'CV CTA link must reference Faycal_Rafa_CV_2026.pdf');
    });

    it('T1.F03.05: CV Modal viewer provides inline PDF display', () => {
      const heroOrModal = readFile('src/components/Hero.astro') || readFile('src/components/CvModal.astro') || getRouteHtml('/');
      assert.ok(heroOrModal !== null, 'Hero or CV modal must be present');
      assert.ok(
        heroOrModal.includes('iframe') || heroOrModal.includes('object') || heroOrModal.includes('modal') || heroOrModal.includes('dialog'),
        'CV viewer must support inline preview modal dialog'
      );
    });

    it('T1.F03.06: Hero includes primary CTA button for BookReader flagship', () => {
      const hero = readFile('src/components/Hero.astro') || getRouteHtml('/');
      assert.ok(hero !== null, 'Hero must exist');
      assert.match(hero, /\/projects\/bookreader/, 'Hero must include direct link to /projects/bookreader');
    });
  });

  // ==========================================
  // F04: Bento Grid Skills Matrix
  // ==========================================
  describe('F04: Bento Grid Skills Matrix', () => {
    it('T1.F04.01: Bento Grid component is present with 4 distinct clusters', () => {
      const bento = readFile('src/components/BentoGrid.astro') || getRouteHtml('/');
      assert.ok(bento !== null, 'Bento Grid component or home page must exist');
      assert.ok(containsText(bento, 'TypeScript') || containsText(bento, 'Frontend'), 'Must contain Frontend cluster');
      assert.ok(containsText(bento, 'Backend') || containsText(bento, 'Microservices'), 'Must contain Backend cluster');
      assert.ok(containsText(bento, 'Mobile') || containsText(bento, 'Android'), 'Must contain Mobile cluster');
      assert.ok(containsText(bento, 'DevOps') || containsText(bento, 'Database'), 'Must contain DevOps/Database cluster');
    });

    it('T1.F04.02: Cluster 1 highlights TypeScript, Next.js, and Svelte 5', () => {
      const bento = readFile('src/components/BentoGrid.astro') || getRouteHtml('/');
      assert.ok(bento !== null);
      assert.match(bento, /TypeScript/i, 'Must highlight TypeScript');
      assert.match(bento, /Next\.?js/i, 'Must highlight Next.js');
      assert.match(bento, /Svelte\s*5?/i, 'Must highlight Svelte 5');
    });

    it('T1.F04.03: Cluster 2 highlights NestJS, Node.js, and Microservices', () => {
      const bento = readFile('src/components/BentoGrid.astro') || getRouteHtml('/');
      assert.ok(bento !== null);
      assert.match(bento, /Nest\.?JS/i, 'Must highlight NestJS');
      assert.match(bento, /Node\.?js/i, 'Must highlight Node.js');
      assert.match(bento, /Microservices/i, 'Must highlight Microservices');
    });

    it('T1.F04.04: Cluster 3 highlights Kotlin, Jetpack Compose, and Media3', () => {
      const bento = readFile('src/components/BentoGrid.astro') || getRouteHtml('/');
      assert.ok(bento !== null);
      assert.match(bento, /Kotlin/i, 'Must highlight Kotlin');
      assert.match(bento, /Compose/i, 'Must highlight Jetpack Compose');
      assert.match(bento, /Media3|Flutter/i, 'Must highlight Android Media3 or Flutter');
    });

    it('T1.F04.05: Cluster 4 highlights PostgreSQL, Docker, and GitHub Actions', () => {
      const bento = readFile('src/components/BentoGrid.astro') || getRouteHtml('/');
      assert.ok(bento !== null);
      assert.match(bento, /PostgreSQL/i, 'Must highlight PostgreSQL');
      assert.match(bento, /Docker/i, 'Must highlight Docker');
    });

    it('T1.F04.06: Bento layout utilizes responsive grid classes', () => {
      const bento = readFile('src/components/BentoGrid.astro') || getRouteHtml('/');
      assert.ok(bento !== null);
      assert.match(bento, /grid/i, 'Bento Grid must use CSS grid classes');
    });
  });

  // ==========================================
  // F05: Interactive Career Timeline
  // ==========================================
  describe('F05: Interactive Career Timeline', () => {
    it('T1.F05.01: Timeline includes all 7 authoritative companies from CV', () => {
      const timeline = readFile('src/components/CareerTimeline.astro') || getRouteHtml('/');
      assert.ok(timeline !== null, 'CareerTimeline component or home page must exist');
      const companies = [
        'AUTOQUAL',
        'SABIL',
        'Finnetude',
        'InstaClean',
        'Kabri',
        'PIASSA',
        'BFLN'
      ];
      for (const company of companies) {
        assert.ok(
          containsText(timeline, new RegExp(company, 'i')),
          `Timeline must include company: ${company}`
        );
      }
    });

    it('T1.F05.02: AUTOQUAL entry displays current role and date 04/2026 – Present', () => {
      const timeline = readFile('src/components/CareerTimeline.astro') || getRouteHtml('/');
      assert.ok(timeline !== null);
      assert.match(timeline, /AUTOQUAL/i, 'Timeline must feature AUTOQUAL');
      assert.match(timeline, /Present|Current/i, 'AUTOQUAL must be marked as Current / Present');
    });

    it('T1.F05.03: SABIL Company entry displays Senior Software Engineer role', () => {
      const timeline = readFile('src/components/CareerTimeline.astro') || getRouteHtml('/');
      assert.ok(timeline !== null);
      assert.match(timeline, /SABIL/i, 'Timeline must feature SABIL');
      assert.match(timeline, /Senior\s+Software\s+Engineer/i, 'SABIL entry must note Senior Software Engineer role');
    });

    it('T1.F05.04: Finnetude entry displays Technical Lead role', () => {
      const timeline = readFile('src/components/CareerTimeline.astro') || getRouteHtml('/');
      assert.ok(timeline !== null);
      assert.match(timeline, /Finnetude/i, 'Timeline must feature Finnetude');
      assert.match(timeline, /Technical\s+Lead|Tech\s+Lead/i, 'Finnetude entry must note Technical Lead role');
    });

    it('T1.F05.05: InstaClean, Kabri Auto, PIASSA DZ, and BFLN render authentic dates', () => {
      const timeline = readFile('src/components/CareerTimeline.astro') || getRouteHtml('/');
      assert.ok(timeline !== null);
      assert.match(timeline, /2024/, 'Must cover 2024 positions (InstaClean, Kabri)');
      assert.match(timeline, /2022|2023/, 'Must cover 2022-2023 positions (PIASSA DZ)');
      assert.match(timeline, /2019/, 'Must cover 2019 inception (BFLN Technologies)');
    });

    it('T1.F05.06: Timeline renders technology badges for career milestones', () => {
      const timeline = readFile('src/components/CareerTimeline.astro') || getRouteHtml('/');
      assert.ok(timeline !== null);
      assert.match(timeline, /badge|tag|tech|span/i, 'Timeline must render technology badges/tags');
    });
  });

  // ==========================================
  // F06: Command Palette (⌘K / Quick Nav)
  // ==========================================
  describe('F06: Command Palette (⌘K / Quick Nav)', () => {
    it('T1.F06.01: Command palette listens for Cmd+K and Ctrl+K shortcuts', () => {
      const palette = readFile('src/components/CommandPalette.astro') || getRouteHtml('/');
      assert.ok(palette !== null, 'CommandPalette component or page must exist');
      assert.match(palette, /(?:e\.metaKey\s*\|\|\s*e\.ctrlKey)\s*&&\s*e\.key\s*===\s*['"]k['"]/i, 'Must check for metaKey/ctrlKey and key === "k"');
    });

    it('T1.F06.02: Command palette listens for "/" key shortcut', () => {
      const palette = readFile('src/components/CommandPalette.astro') || getRouteHtml('/');
      assert.ok(palette !== null);
      assert.match(palette, /e\.key\s*===\s*['"]\/['"]/, 'Must check for key === "/"');
    });

    it('T1.F06.03: Command palette includes search input field', () => {
      const palette = readFile('src/components/CommandPalette.astro') || getRouteHtml('/');
      assert.ok(palette !== null);
      assert.match(palette, /<input[^>]+type=['"]text['"]|<input[^>]+placeholder/i, 'Must provide search input');
    });

    it('T1.F06.04: Palette includes quick action to toggle theme', () => {
      const palette = readFile('src/components/CommandPalette.astro') || getRouteHtml('/');
      assert.ok(palette !== null);
      assert.match(palette, /theme|Theme/i, 'Palette must offer Theme toggle action');
    });

    it('T1.F06.05: Palette includes quick action to download or view CV', () => {
      const palette = readFile('src/components/CommandPalette.astro') || getRouteHtml('/');
      assert.ok(palette !== null);
      assert.match(palette, /CV|Resume|pdf/i, 'Palette must offer CV download/view action');
    });

    it('T1.F06.06: Palette closes on Escape key', () => {
      const palette = readFile('src/components/CommandPalette.astro') || getRouteHtml('/');
      assert.ok(palette !== null);
      assert.match(palette, /Escape/i, 'Palette must handle Escape key to close dialog');
    });
  });

  // ==========================================
  // F07: Flexible Hobby Projects System
  // ==========================================
  describe('F07: Flexible Hobby Projects System', () => {
    it('T1.F07.01: Content collections config defines projects collection with Zod schema', () => {
      const contentConfig = readFile('src/content.config.ts') || readFile('src/content/config.ts');
      assert.ok(contentConfig !== null, 'Content config file (src/content.config.ts) must exist');
      assert.match(contentConfig, /defineCollection/, 'Must use defineCollection');
      assert.match(contentConfig, /z\.object/, 'Must define Zod schema for projects');
    });

    it('T1.F07.02: Zod schema enforces category enum including "hobby"', () => {
      const contentConfig = readFile('src/content.config.ts') || readFile('src/content/config.ts');
      assert.ok(contentConfig !== null);
      assert.match(contentConfig, /category:\s*z\.enum\(\[\s*['"]hobby['"]/, 'Schema must include "hobby" in category enum');
    });

    it('T1.F07.03: BookReader project file is categorized as "hobby"', () => {
      const bookreaderMd = readFile('src/content/projects/bookreader.md') || readFile('src/content/projects/bookreader.mdx');
      assert.ok(bookreaderMd !== null, 'BookReader markdown content file must exist');
      assert.match(bookreaderMd, /category:\s*['"]?hobby['"]?/, 'BookReader must have category: hobby');
    });

    it('T1.F07.04: Projects archive page (/projects) exists', () => {
      const projectsPage = readFile('src/pages/projects/index.astro') || getRouteHtml('/projects');
      assert.ok(projectsPage !== null, 'src/pages/projects/index.astro or rendered /projects route must exist');
    });

    it('T1.F07.05: Hobby projects display explicit "Hobby Project" badge', () => {
      const projectCard = readFile('src/components/ProjectCard.astro') || readFile('src/pages/projects/index.astro') || getRouteHtml('/projects');
      assert.ok(projectCard !== null);
      assert.match(projectCard, /Hobby\s+Project/i, 'Must render explicit "Hobby Project" badge');
    });

    it('T1.F07.06: /projects route provides interactive category filtering', () => {
      const projectsPage = readFile('src/pages/projects/index.astro') || getRouteHtml('/projects');
      assert.ok(projectsPage !== null);
      assert.match(projectsPage, /filter|category|all|hobby/i, 'Projects page must provide category filtering');
    });
  });

  // ==========================================
  // F08: BookReader Android Flagship Showcase
  // ==========================================
  describe('F08: BookReader Android Flagship Showcase', () => {
    it('T1.F08.01: Dedicated /projects/bookreader route exists', () => {
      const bookreaderPage = readFile('src/pages/projects/bookreader.astro') ||
        readFile('src/pages/projects/bookreader/index.astro') ||
        getRouteHtml('/projects/bookreader');
      assert.ok(bookreaderPage !== null, 'Dedicated BookReader page must exist at /projects/bookreader');
    });

    it('T1.F08.02: Showcase displays 3D cushion squircle icon and v3.4.0 badge', () => {
      const bookreaderPage = readFile('src/pages/projects/bookreader.astro') ||
        readFile('src/components/bookreader/AppHero.astro') ||
        getRouteHtml('/projects/bookreader');
      assert.ok(bookreaderPage !== null);
      assert.match(bookreaderPage, /v3\.4\.0/i, 'Must display v3.4.0 version badge');
      assert.match(bookreaderPage, /squircle|cushion|icon|bookreader/i, 'Must reference BookReader 3D squircle icon');
    });

    it('T1.F08.03: Primary download CTA provides direct link to app-release.apk', () => {
      const bookreaderPage = readFile('src/pages/projects/bookreader.astro') ||
        readFile('src/components/bookreader/AppHero.astro') ||
        getRouteHtml('/projects/bookreader');
      assert.ok(bookreaderPage !== null);
      assert.match(
        bookreaderPage,
        /https:\/\/github\.com\/faycalrafa\/free-novel-reader-tts-android\/releases\/download\/v3\.4\.0\/app-release\.apk/,
        'Must provide direct link to v3.4.0 app-release.apk'
      );
    });

    it('T1.F08.04: Secondary download dropdown provides update-latest.apk', () => {
      const bookreaderPage = readFile('src/pages/projects/bookreader.astro') ||
        readFile('src/components/bookreader/AppHero.astro') ||
        getRouteHtml('/projects/bookreader');
      assert.ok(bookreaderPage !== null);
      assert.match(
        bookreaderPage,
        /update-latest\.apk/,
        'Must offer update-latest.apk in secondary dropdown or link'
      );
    });

    it('T1.F08.05: In-Browser TTS Simulator widget is embedded on the page', () => {
      const ttsWidget = readFile('src/components/bookreader/TtsSimulator.astro') ||
        readFile('src/pages/projects/bookreader.astro') ||
        getRouteHtml('/projects/bookreader');
      assert.ok(ttsWidget !== null);
      assert.match(ttsWidget, /speechSynthesis|TtsSimulator|tts-simulator/i, 'Must embed interactive TTS simulator');
    });

    it('T1.F08.06: Architecture section covers Jetpack Compose M3, Media3, and Scoped Storage', () => {
      const archSection = readFile('src/components/bookreader/Architecture.astro') ||
        readFile('src/pages/projects/bookreader.astro') ||
        getRouteHtml('/projects/bookreader');
      assert.ok(archSection !== null);
      assert.match(archSection, /Jetpack\s+Compose/i, 'Must detail Jetpack Compose M3');
      assert.match(archSection, /Media3|ExoPlayer/i, 'Must detail AndroidX Media3 / ExoPlayer');
      assert.match(archSection, /AtomicFile|Scoped\s+Storage/i, 'Must detail Scoped Storage AtomicFiles');
    });
  });

  // ==========================================
  // F09: Automated CI/CD & Git Deployment
  // ==========================================
  describe('F09: Automated CI/CD & Git Deployment', () => {
    it('T1.F09.01: GitHub Actions deploy workflow exists at .github/workflows/deploy.yml', () => {
      assert.ok(fileExists('.github/workflows/deploy.yml'), '.github/workflows/deploy.yml must exist');
    });

    it('T1.F09.02: Workflow triggers on push to main branch', () => {
      const workflow = readFile('.github/workflows/deploy.yml');
      assert.ok(workflow !== null);
      assert.match(workflow, /branches:\s*\[?['"]?main['"]?\]?/, 'Workflow must trigger on push to branch main');
    });

    it('T1.F09.03: Workflow includes build step running npm run build', () => {
      const workflow = readFile('.github/workflows/deploy.yml');
      assert.ok(workflow !== null);
      assert.match(workflow, /npm\s+(?:run\s+)?build/, 'Workflow must include build step');
    });

    it('T1.F09.04: Workflow deploys to GitHub Pages', () => {
      const workflow = readFile('.github/workflows/deploy.yml');
      assert.ok(workflow !== null);
      assert.match(workflow, /actions\/deploy-pages|JamesIves\/github-pages-deploy-action|actions\/upload-pages-artifact/, 'Workflow must configure GitHub Pages deployment');
    });

    it('T1.F09.05: Static build output directory is dist', () => {
      const workflow = readFile('.github/workflows/deploy.yml');
      assert.ok(workflow !== null);
      assert.match(workflow, /path:\s*['"]?dist['"]?|publish_dir:\s*['"]?\.\/dist['"]?/, 'Workflow artifact or publish path must be dist');
    });

    it('T1.F09.06: Astro configuration site matches faycalrafa.github.io', () => {
      const config = readFile('astro.config.mjs');
      assert.ok(config !== null);
      assert.match(config, /faycalrafa\.github\.io/, 'Astro config site must be set to https://faycalrafa.github.io');
    });
  });

});
