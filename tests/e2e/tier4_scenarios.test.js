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
  containsText,
  chunkTextIntoSentences,
  isValidPdfBuffer
} from './helpers.js';

describe('Tier 4: Real-World User Scenarios (End-to-End Persona Journeys)', () => {

  it('T4.01: Recruiter Persona Journey: Verify senior role, timeline, and valid CV download', () => {
    // 1. Recruiter checks Hero on home page
    const hero = readFile('src/components/Hero.astro') || getRouteHtml('/');
    assert.ok(hero !== null, 'Hero must be rendered');
    assert.match(hero, /Senior\s+Software\s+Engineer/i, 'Recruiter finds Senior Software Engineer title');
    assert.match(hero, /Available/i, 'Recruiter confirms current availability badge');

    // 2. Recruiter inspects career timeline
    const timeline = readFile('src/components/CareerTimeline.astro') || getRouteHtml('/');
    assert.ok(timeline !== null);
    assert.match(timeline, /AUTOQUAL/i, 'Recruiter verifies current position at AUTOQUAL');
    assert.match(timeline, /SABIL/i, 'Recruiter verifies previous position at SABIL Company');
    assert.match(timeline, /Finnetude/i, 'Recruiter verifies Tech Lead position at Finnetude');

    // 3. Recruiter initiates CV download
    const cvPath = path.join(PUBLIC_ROOT, 'Faycal_Rafa_CV_2026.pdf');
    assert.ok(fs.existsSync(cvPath), 'CV PDF file must be immediately downloadable');
    const buffer = fs.readFileSync(cvPath);
    assert.ok(isValidPdfBuffer(buffer), 'Downloaded CV must be a valid authentic PDF document');
  });

  it('T4.02: Engineering Lead Persona Journey: Evaluate architecture, ⌘K search, and deep-dive', () => {
    // 1. Engineering Lead inspects skills in Bento Grid
    const bento = readFile('src/components/BentoGrid.astro') || getRouteHtml('/');
    assert.ok(bento !== null);
    assert.match(bento, /TypeScript/i, 'Verifies TypeScript expertise');
    assert.match(bento, /Microservices/i, 'Verifies microservices backend architecture');

    // 2. Uses Command Palette to jump to BookReader
    const palette = readFile('src/components/CommandPalette.astro') || getRouteHtml('/');
    assert.ok(palette !== null);
    assert.match(palette, /\/projects\/bookreader/, 'Palette has direct route to BookReader flagship showcase');

    // 3. Inspects BookReader architecture deep-dive
    const arch = readFile('src/components/bookreader/Architecture.astro') ||
      readFile('src/pages/projects/bookreader.astro') ||
      getRouteHtml('/projects/bookreader');
    assert.ok(arch !== null);
    assert.match(arch, /Media3|ExoPlayer/i, 'Verifies AndroidX Media3 implementation');
    assert.match(arch, /AtomicFile|Mutex/i, 'Verifies thread-safe Scoped Storage with AtomicFiles');
  });

  it('T4.03: Android Developer Persona Journey: Verify release v3.4.0, download APK, and test TTS simulator', () => {
    // 1. Navigates to BookReader showcase
    const showcase = readFile('src/pages/projects/bookreader.astro') ||
      readFile('src/components/bookreader/AppHero.astro') ||
      getRouteHtml('/projects/bookreader');
    assert.ok(showcase !== null);
    assert.match(showcase, /v3\.4\.0/i, 'Verifies latest stable release badge v3.4.0');

    // 2. Checks APK download CTA
    assert.match(showcase, /app-release\.apk/, 'Finds primary CTA for app-release.apk download');

    // 3. Tests Arabic TTS preset simulation
    const arabicPhrase = '«هذا نموذج تجريبي لتطبيق قارئ الروايات! هل يمكنك سماع القراءة بوضوح؟» قال بصوت خافت.';
    const chunks = chunkTextIntoSentences(arabicPhrase);
    assert.ok(chunks.length >= 1, 'Sentence chunker parses Arabic phrase properly');

    // 4. Verifies TTS Simulator controls
    const tts = readFile('src/components/bookreader/TtsSimulator.astro') || getRouteHtml('/projects/bookreader');
    assert.ok(tts !== null);
    assert.match(tts, /rate|speed/i, 'TTS widget provides speech rate adjustments');
  });

  it('T4.04: Open Source Contributor Persona Journey: Filter hobby projects, check repo, and inspect highlights', () => {
    // 1. Contributor opens /projects
    const projectsPage = readFile('src/pages/projects/index.astro') || getRouteHtml('/projects');
    assert.ok(projectsPage !== null);

    // 2. Checks Hobby Project distinction
    assert.match(projectsPage, /Hobby/i, 'Finds explicit Hobby Projects categorization');

    // 3. Reviews repository link for BookReader
    const bookreaderContent = readFile('src/content/projects/bookreader.md') ||
      readFile('src/pages/projects/bookreader.astro') ||
      getRouteHtml('/projects/bookreader');
    assert.ok(bookreaderContent !== null);
    assert.match(
      bookreaderContent,
      /github\.com\/faycalrafa\/free-novel-reader-tts-android/,
      'Finds GitHub open source repository link'
    );
  });

  it('T4.05: Accessibility & Keyboard User Journey: Keyboard-only navigation with shortcuts and high contrast', () => {
    // 1. Palette shortcut availability
    const palette = readFile('src/components/CommandPalette.astro') || getRouteHtml('/');
    assert.ok(palette !== null);
    assert.match(palette, /key\s*===\s*['"]\/['"]|key\s*===\s*['"]k['"]/i, 'Keyboard shortcuts (/, ⌘K, Ctrl+K) supported');

    // 2. Accessible dismiss
    assert.match(palette, /Escape/i, 'Dialog supports Escape key dismiss');

    // 3. Dark mode support for high contrast reading
    const layout = readFile('src/layouts/Layout.astro') || getRouteHtml('/');
    assert.ok(layout !== null);
    assert.match(layout, /dark/i, 'Dark mode high contrast theme is supported');
  });

  it('T4.06: Mobile Visitor Journey: Responsive layout, mobile navigation, and squircle graphics', () => {
    // 1. Mobile responsive layout container
    const navbar = readFile('src/components/Navbar.astro') || getRouteHtml('/');
    assert.ok(navbar !== null);
    assert.match(navbar, /md:|sm:|hidden|block/i, 'Navbar supports responsive collapsing layout');

    // 2. Bento grid mobile stacking
    const bento = readFile('src/components/BentoGrid.astro') || getRouteHtml('/');
    assert.ok(bento !== null);
    assert.match(bento, /grid-cols-1|flex-col|gap-/i, 'Bento Grid collapses into single column on mobile');

    // 3. 3D squircle icon asset responsiveness
    const bookreader = readFile('src/components/bookreader/AppHero.astro') ||
      readFile('src/pages/projects/bookreader.astro') ||
      getRouteHtml('/projects/bookreader');
    assert.ok(bookreader !== null);
    assert.match(bookreader, /img|svg|squircle/i, 'BookReader showcase renders responsive icon graphic');
  });

});
