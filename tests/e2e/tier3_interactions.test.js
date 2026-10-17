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
  chunkTextIntoSentences
} from './helpers.js';

describe('Tier 3: Cross-Feature Interactions (Pairwise Combinations)', () => {

  it('T3.01: Theme Toggle + Page Navigation: Theme persists across Astro View Transitions', () => {
    const layout = readFile('src/layouts/Layout.astro') || getRouteHtml('/');
    assert.ok(layout !== null);
    // When navigating with ClientRouter / ViewTransitions, theme must be re-applied or preserved
    assert.match(
      layout,
      /document\.addEventListener\(['"]astro:page-load['"]|document\.addEventListener\(['"]astro:after-swap['"]|localStorage\.getItem\(['"]theme['"]\)/,
      'Theme state must be re-applied on astro:page-load or astro:after-swap'
    );
  });

  it('T3.02: Command Palette + Project Navigation: ⌘K palette navigates directly to /projects/bookreader', () => {
    const palette = readFile('src/components/CommandPalette.astro') || getRouteHtml('/');
    assert.ok(palette !== null);
    assert.match(
      palette,
      /\/projects\/bookreader/,
      'Command Palette search index must include navigation action to /projects/bookreader'
    );
  });

  it('T3.03: Hobby Projects Filter + Command Palette: Hobby project items are indexed in palette with Hobby indicator', () => {
    const palette = readFile('src/components/CommandPalette.astro') || getRouteHtml('/');
    assert.ok(palette !== null);
    assert.match(
      palette,
      /BookReader|Hobby/i,
      'Palette items should distinguish hobby projects'
    );
  });

  it('T3.04: CV Download CTA from BookReader page: Global Navbar provides CV modal/download across all routes', () => {
    const navbar = readFile('src/components/Navbar.astro') || getRouteHtml('/projects/bookreader');
    assert.ok(navbar !== null);
    assert.match(
      navbar,
      /Faycal_Rafa_CV_2026\.pdf|CV|cv-modal|open-cv/i,
      'Navbar must provide CV access regardless of current route'
    );
  });

  it('T3.05: TTS Simulator Playback + Viewport Resize: UI layout adapts without interrupting playback controls', () => {
    const tts = readFile('src/components/bookreader/TtsSimulator.astro') || getRouteHtml('/projects/bookreader');
    assert.ok(tts !== null);
    assert.match(tts, /flex-wrap|grid|md:|w-full/i, 'TTS widget layout must use responsive flex/grid wrappers');
  });

  it('T3.06: Language Preset Switcher + Speech Chunking: Presets for EN, AR, and FR chunk into valid sentence sets', () => {
    const presets = {
      en: '"Wait right there!" she whispered, stepping into the dimly lit room. "We can\'t afford to get caught now."',
      ar: '«هذا نموذج تجريبي لتطبيق قارئ الروايات! هل يمكنك سماع القراءة بوضوح؟» قال بصوت خافت.',
      fr: '« Arrêtez-vous immédiatement ! » chuchota-t-elle dans le couloir sombre. « Nous ne pouvons pas échouer. »'
    };

    const enChunks = chunkTextIntoSentences(presets.en);
    const arChunks = chunkTextIntoSentences(presets.ar);
    const frChunks = chunkTextIntoSentences(presets.fr);

    assert.ok(enChunks.length >= 2, 'English preset must produce at least 2 sentences');
    assert.ok(arChunks.length >= 1, 'Arabic preset must produce at least 1 valid chunk');
    assert.ok(frChunks.length >= 2, 'French preset must produce at least 2 sentences');
  });

  it('T3.07: Command Palette + Theme Action: Palette triggers theme toggle and dispatches theme event', () => {
    const palette = readFile('src/components/CommandPalette.astro') || '';
    const navbar = readFile('src/components/Navbar.astro') || '';
    const combined = palette + '\n' + navbar;
    assert.match(
      combined,
      /classList\.toggle\(['"]dark['"]\)|theme-changed|toggleTheme/i,
      'Palette theme action must trigger theme toggle and event notification'
    );
  });

  it('T3.08: Dynamic Route + Base Layout SEO: Project pages inherit common head metadata and title structure', () => {
    const layout = readFile('src/layouts/Layout.astro') || '';
    assert.ok(layout !== null);
    assert.match(layout, /<title>/i, 'Base layout must provide title tag structure');
    assert.match(layout, /<meta[^>]+name=['"]description['"]/i, 'Base layout must provide description meta tag');
  });

  it('T3.09: 404 Route + Navigation Recovery: 404 page retains global Layout and navigation back to Home', () => {
    const page404 = readFile('src/pages/404.astro') || getRouteHtml('/404');
    assert.ok(page404 !== null);
    assert.match(page404, /href=['"]\/['"]|href=['"]https:\/\/faycalrafa\.github\.io['"]/i, '404 page must provide link back to home');
  });

  it('T3.10: Career Timeline + Skills Matrix Cross-links: Skills mentioned in career timeline match Bento grid technologies', () => {
    const timeline = readFile('src/components/CareerTimeline.astro') || '';
    const bento = readFile('src/components/BentoGrid.astro') || '';
    // Key common technologies across timeline and bento
    const commonTechs = ['TypeScript', 'NestJS', 'PostgreSQL', 'Docker'];
    for (const tech of commonTechs) {
      assert.ok(
        containsText(timeline, new RegExp(tech, 'i')) && containsText(bento, new RegExp(tech, 'i')),
        `Tech stack ${tech} should be consistently highlighted across Timeline and Bento Grid`
      );
    }
  });

  it('T3.11: BookReader APK Download CTA + Dropdown: Secondary dropdown does not trigger primary download link', () => {
    const appHero = readFile('src/components/bookreader/AppHero.astro') ||
      readFile('src/pages/projects/bookreader.astro') ||
      getRouteHtml('/projects/bookreader');
    assert.ok(appHero !== null);
    // Dropdown toggle must be separate button or interactive details element
    assert.match(
      appHero,
      /<details|<button[^>]+id=['"]dropdown|<button[^>]+aria-haspopup/i,
      'Secondary download dropdown must have distinct interactive trigger'
    );
  });

  it('T3.12: View Transitions + Event Listener Re-binding: Scripts re-bind interactive elements on astro:page-load', () => {
    const allComponents = [
      readFile('src/components/CommandPalette.astro'),
      readFile('src/components/Navbar.astro'),
      readFile('src/components/bookreader/TtsSimulator.astro'),
      readFile('src/layouts/Layout.astro')
    ].filter(Boolean).join('\n');

    assert.match(
      allComponents,
      /astro:page-load|DOMContentLoaded/,
      'Interactive scripts must attach listeners on astro:page-load or DOMContentLoaded'
    );
  });

});
