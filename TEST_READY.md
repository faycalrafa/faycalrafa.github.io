# TEST_READY: Standalone Opaque-Box E2E Test Suite (Tiers 1–4)

**Status**: READY FOR MILESTONE VERIFICATION  
**Author**: `e2e_test_writer`  
**Date**: 2026-10-17  
**Total Test Cases**: 126 (Exceeds >=115 threshold requirement)  
**Execution Time**: ~60ms  
**Runtime**: Node.js v24.19.0 (Native `node:test` runner, zero external npm dependencies)  

---

## 1. Quick Start & Execution

### Environment Setup
```bash
export PATH="/home/faycal/.nvm/versions/node/v24.19.0/bin:$PATH"
```

### Run Entire Test Suite (All 4 Tiers — 126 Tests)
```bash
node tests/run_e2e.js
```
or via native Node.js test runner:
```bash
node --test tests/e2e/*.test.js
```

### Run Individual Tiers
```bash
# Tier 1: Feature Coverage (54 tests, F01-F09)
node tests/run_e2e.js --tier=1

# Tier 2: Boundary & Corner Cases (54 tests, F01-F09)
node tests/run_e2e.js --tier=2

# Tier 3: Cross-Feature Interactions (12 tests)
node tests/run_e2e.js --tier=3

# Tier 4: Real-World Scenarios (6 tests)
node tests/run_e2e.js --tier=4
```

### Verbose Mode
```bash
node tests/run_e2e.js --verbose
```

---

## 2. Test Architecture & Files Map

```
tests/
├── run_e2e.js                      # Unified CLI runner with colored reporting & exit codes
└── e2e/
    ├── helpers.js                  # Shared contracts, file helpers, AST/HTML inspection, chunker
    ├── tier1_features.test.js      # 54 tests covering Features F01–F09 primary behaviors
    ├── tier2_boundaries.test.js    # 54 tests covering Boundary & Corner conditions for F01–F09
    ├── tier3_interactions.test.js  # 12 tests covering Cross-Feature Pairwise Interactions
    └── tier4_scenarios.test.js     # 6 tests covering Real-World User Persona Journeys
```

---

## 3. Comprehensive Test Inventory & Checklist

### Tier 1: Feature Coverage (54 Tests)

#### F01: Project Foundation & Tooling (Milestone M1)
- [ ] `T1.F01.01`: Astro configuration (`astro.config.mjs`) exports static output (`output: 'static'`) and root domain URL (`https://faycalrafa.github.io`).
- [ ] `T1.F01.02`: TypeScript configuration (`tsconfig.json`) enforces strict type checking mode.
- [ ] `T1.F01.03`: Tailwind CSS v4 integration is configured via `@tailwindcss/vite` or global stylesheet.
- [ ] `T1.F01.04`: `package.json` defines required `build`, `check`, and `dev` scripts.
- [ ] `T1.F01.05`: Code layout conforms strictly to project layout (`src/pages`, `src/layouts`, `src/components`, `src/content`, `public`).
- [ ] `T1.F01.06`: Dependencies in `package.json` include Astro 5 framework.

#### F02: Design System, Layout & Theme (Milestone M1)
- [ ] `T1.F02.01`: Base layout (`Layout.astro` / `dist/index.html`) includes zero-FOUC inline theme script in `<head>`.
- [ ] `T1.F02.02`: Theme contract toggles `class="dark"` on `document.documentElement` and stores `'dark'` or `'light'` in `localStorage`.
- [ ] `T1.F02.03`: Astro `<ClientRouter />` (View Transitions) is integrated for smooth client-side SPA navigation.
- [ ] `T1.F02.04`: Navigation header (`Navbar.astro`) renders links to key sections (Home, Projects, CV, Skills).
- [ ] `T1.F02.05`: Footer (`Footer.astro`) renders social links for GitHub (`faycalrafa`), LinkedIn, and Email.
- [ ] `T1.F02.06`: Theme system dispatches custom `theme-changed` event upon toggle.

#### F03: Hero Section & CV Download/Viewer (Milestone M2)
- [ ] `T1.F03.01`: Hero displays Faycal Rafa's name, Senior Software Engineer, and Technical Lead titles.
- [ ] `T1.F03.02`: Availability status badge is visible in Hero with active status indicator.
- [ ] `T1.F03.03`: CV PDF asset exists in `public/` and is a valid `%PDF-` document (>50KB).
- [ ] `T1.F03.04`: Direct CV download CTA link references `Faycal_Rafa_CV_2026.pdf` with `download` attribute.
- [ ] `T1.F03.05`: CV modal viewer component provides inline PDF display (`<iframe>` / `<object>`).
- [ ] `T1.F03.06`: Hero includes primary call-to-action button linking directly to BookReader flagship (`/projects/bookreader`).

#### F04: Bento Grid Skills Matrix (Milestone M2)
- [ ] `T1.F04.01`: Bento Grid component is present with 4 distinct clusters (Frontend, Backend, Mobile, DevOps).
- [ ] `T1.F04.02`: Cluster 1 highlights TypeScript, Next.js, Svelte 5, Tailwind CSS, and Web APIs.
- [ ] `T1.F04.03`: Cluster 2 highlights NestJS, Node.js, Laravel, and Microservices.
- [ ] `T1.F04.04`: Cluster 3 highlights Android Kotlin, Jetpack Compose M3, AndroidX Media3, and Flutter.
- [ ] `T1.F04.05`: Cluster 4 highlights PostgreSQL, Docker, and GitHub Actions CI/CD.
- [ ] `T1.F04.06`: Bento layout utilizes modern responsive grid classes.

#### F05: Interactive Career Timeline (Milestone M2)
- [ ] `T1.F05.01`: Timeline includes all 7 authoritative companies from CV (AUTOQUAL, SABIL, Finnetude, InstaClean, Kabri, PIASSA, BFLN).
- [ ] `T1.F05.02`: AUTOQUAL entry displays current role and date 04/2026 – Present.
- [ ] `T1.F05.03`: SABIL Company entry displays Senior Software Engineer role and payment microservices.
- [ ] `T1.F05.04`: Finnetude entry displays Technical Lead role and stock trading platform.
- [ ] `T1.F05.05`: InstaClean, Kabri Auto, PIASSA DZ, and BFLN render authentic dates and responsibilities.
- [ ] `T1.F05.06`: Timeline renders interactive technology badges for career milestones.

#### F06: Command Palette (⌘K / Quick Nav) (Milestone M2)
- [ ] `T1.F06.01`: Command palette listens for `⌘K` (Meta+K) and `Ctrl+K` shortcuts.
- [ ] `T1.F06.02`: Command palette listens for `/` key shortcut.
- [ ] `T1.F06.03`: Command palette includes search input field.
- [ ] `T1.F06.04`: Palette includes quick action to toggle dark/light theme.
- [ ] `T1.F06.05`: Palette includes quick action to download or view CV.
- [ ] `T1.F06.06`: Palette closes on `Escape` key press.

#### F07: Flexible Hobby Projects System (Milestone M3)
- [ ] `T1.F07.01`: Content configuration (`src/content.config.ts`) defines `projects` collection with Zod schema.
- [ ] `T1.F07.02`: Zod schema enforces required fields and `category` enum including `'hobby'`.
- [ ] `T1.F07.03`: BookReader project markdown file is categorized as `'hobby'`.
- [ ] `T1.F07.04`: Dedicated `/projects` route exists and renders the archive of projects.
- [ ] `T1.F07.05`: Hobby projects display explicit "Hobby Project" badge.
- [ ] `T1.F07.06`: `/projects` route provides interactive category filtering.

#### F08: BookReader Android Flagship Showcase (Milestone M4)
- [ ] `T1.F08.01`: Dedicated `/projects/bookreader` route exists and renders the flagship showcase.
- [ ] `T1.F08.02`: Showcase displays 3D cushion squircle icon and `v3.4.0 • Latest` badge.
- [ ] `T1.F08.03`: Primary download CTA provides direct link to `app-release.apk` from GitHub release v3.4.0.
- [ ] `T1.F08.04`: Secondary download dropdown provides link to `update-latest.apk`.
- [ ] `T1.F08.05`: Interactive In-Browser TTS Simulator widget is embedded on the page.
- [ ] `T1.F08.06`: Architecture section covers Jetpack Compose M3, AndroidX Media3, Native TTS, and Scoped Storage AtomicFiles.

#### F09: Automated CI/CD & Git Deployment (Milestone M5)
- [ ] `T1.F09.01`: GitHub Actions deploy workflow exists at `.github/workflows/deploy.yml`.
- [ ] `T1.F09.02`: Workflow triggers on push to `main` branch.
- [ ] `T1.F09.03`: Workflow includes build step running `npm run build`.
- [ ] `T1.F09.04`: Workflow configures deployment to GitHub Pages.
- [ ] `T1.F09.05`: Static build output directory is configured as `dist/`.
- [ ] `T1.F09.06`: Astro configuration site matches `https://faycalrafa.github.io`.

---

### Tier 2: Boundary & Corner Cases (54 Tests)

#### F01 Boundaries
- [ ] `T2.F01.01`: Astro configuration handles missing optional environment variables gracefully.
- [ ] `T2.F01.02`: Public asset paths use absolute root or base-relative paths.
- [ ] `T2.F01.03`: `package.json` specifies Node engine compatibility supporting v24.
- [ ] `T2.F01.04`: Custom 404 page exists for graceful error handling (`src/pages/404.astro` / `dist/404.html`).
- [ ] `T2.F01.05`: TSConfig handles `strictNullChecks` without disabling safety flags.
- [ ] `T2.F01.06`: Generated distribution artifacts contain zero broken or 0-byte HTML files.

#### F02 Boundaries
- [ ] `T2.F02.01`: Dark mode fallback defaults gracefully to system preference when `localStorage` is empty.
- [ ] `T2.F02.02`: Corrupted `localStorage` theme value resets safely without crashing.
- [ ] `T2.F02.03`: Rapid successive theme toggles maintain consistency without race conditions.
- [ ] `T2.F02.04`: System `prefers-color-scheme` change listener handles dynamic OS theme changes.
- [ ] `T2.F02.05`: Mobile viewport (< 360px) responsive navbar avoids horizontal scroll overflow.
- [ ] `T2.F02.06`: Color scheme contrast meta tag is present in document head.

#### F03 Boundaries
- [ ] `T2.F03.01`: CV direct download CTA retains clean filename `Faycal_Rafa_CV_2026.pdf`.
- [ ] `T2.F03.02`: CV modal viewer displays fallback download button for browsers with PDF plugin disabled.
- [ ] `T2.F03.03`: CV modal supports `Escape` key dismissal and focus restoration.
- [ ] `T2.F03.04`: Hero section copy wraps gracefully on narrow 320px viewport without clipping.
- [ ] `T2.F03.05`: Availability badge handles long label without layout breaking.
- [ ] `T2.F03.06`: Bio blockquote or summary uses semantic paragraph typography.

#### F04 Boundaries
- [ ] `T2.F04.01`: Skill badges wrap cleanly using `flex-wrap` or `grid` with gaps.
- [ ] `T2.F04.02`: Bento grid handles high DPI / 4K zoom with `max-w-*` constraints.
- [ ] `T2.F04.03`: Skill clusters handle missing/empty categories gracefully.
- [ ] `T2.F04.04`: Hover interactions on skill cards use GPU-accelerated CSS `transform`/`opacity`.
- [ ] `T2.F04.05`: Bento grid card icons include accessible labels or SVG attributes (`aria-hidden`/`viewBox`).
- [ ] `T2.F04.06`: Skill category headings maintain semantic heading hierarchy (`h2`/`h3`).

#### F05 Boundaries
- [ ] `T2.F05.01`: Concurrent employment periods (Kabri Auto & InstaClean) render distinct cards.
- [ ] `T2.F05.02`: Current role badge ("04/2026 – Present") renders distinct visual indicator.
- [ ] `T2.F05.03`: Company without external URL renders cleanly without dead `href="#"`.
- [ ] `T2.F05.04`: Timeline connectors align vertically using CSS positioning and borders.
- [ ] `T2.F05.05`: Long role descriptions or bullet points render valid lists without layout overflow.
- [ ] `T2.F05.06`: Keyboard navigation: timeline items use accessible interactive elements.

#### F06 Boundaries
- [ ] `T2.F06.01`: Typing `/` inside input or textarea DOES NOT trigger command palette.
- [ ] `T2.F06.02`: Pressing `⌘K` or `Ctrl+K` while palette is open toggles it closed.
- [ ] `T2.F06.03`: Search query with no matching items displays an explicit empty state.
- [ ] `T2.F06.04`: Search query containing regex special characters does not crash matcher.
- [ ] `T2.F06.05`: Arrow key navigation stops at bounds or wraps cleanly without index error.
- [ ] `T2.F06.06`: Fast typing with special characters/accents filters safely.

#### F07 Boundaries
- [ ] `T2.F07.01`: Missing mandatory frontmatter field is rejected by Zod schema.
- [ ] `T2.F07.02`: Invalid category enum value is rejected by Zod schema.
- [ ] `T2.F07.03`: Non-existent project slug route redirects to 404.
- [ ] `T2.F07.04`: Project with optional URLs omitted renders card without dead CTA buttons.
- [ ] `T2.F07.05`: Project highlights array with empty items renders gracefully without blank bullets.
- [ ] `T2.F07.06`: Projects archive filter switches categories without reloading page.

#### F08 Boundaries
- [ ] `T2.F08.01`: TTS Simulator handles empty or whitespace input safely (produces 0 chunks).
- [ ] `T2.F08.02`: TTS Simulator preserves dialogue quotes with internal punctuation without splitting dialogue.
- [ ] `T2.F08.03`: TTS Simulator handles Arabic sentences with Arabic question mark (`؟`) and guillemets (`« »`).
- [ ] `T2.F08.04`: TTS Simulator protects decimal version numbers and abbreviations from splitting.
- [ ] `T2.F08.05`: TTS Simulator displays unsupported notice if `window.speechSynthesis` is missing.
- [ ] `T2.F08.06`: Direct APK download link strictly points to v3.4.0 `app-release.apk`.

#### F09 Boundaries
- [ ] `T2.F09.01`: GitHub Actions workflow uses pinned/stable action versions (`actions/checkout@v4`).
- [ ] `T2.F09.02`: Workflow grants minimal required permissions (`pages: write`, `id-token: write`).
- [ ] `T2.F09.03`: Build step verifies non-empty static export output.
- [ ] `T2.F09.04`: Astro site URL does not contain trailing slash that could break asset routing.
- [ ] `T2.F09.05`: Git repository ignores agent teamwork metadata directory or build caches.
- [ ] `T2.F09.06`: Clean git repository structure with zero dangling merge conflict markers.

---

### Tier 3: Cross-Feature Interactions (12 Tests)

- [ ] `T3.01`: **Theme Toggle + Page Navigation**: Theme persists across Astro View Transitions.
- [ ] `T3.02`: **Command Palette + Project Navigation**: `⌘K` palette navigates directly to `/projects/bookreader`.
- [ ] `T3.03`: **Hobby Projects Filter + Command Palette**: Hobby project items are indexed in palette with Hobby indicator.
- [ ] `T3.04`: **CV Download CTA from BookReader page**: Global Navbar provides CV modal/download across all routes.
- [ ] `T3.05`: **TTS Simulator Playback + Viewport Resize**: UI layout adapts without interrupting playback controls.
- [ ] `T3.06`: **Language Preset Switcher + Speech Chunking**: Presets for EN, AR, and FR chunk into valid sentence sets.
- [ ] `T3.07`: **Command Palette + Theme Action**: Palette triggers theme toggle and dispatches theme event.
- [ ] `T3.08`: **Dynamic Route + Base Layout SEO**: Project pages inherit common head metadata and title structure.
- [ ] `T3.09`: **404 Route + Navigation Recovery**: 404 page retains global Layout and navigation back to Home.
- [ ] `T3.10`: **Career Timeline + Skills Matrix Cross-links**: Skills in career timeline match Bento grid technologies.
- [ ] `T3.11`: **BookReader APK Download CTA + Dropdown**: Secondary dropdown does not trigger primary download link.
- [ ] `T3.12`: **View Transitions + Event Listener Re-binding**: Interactive scripts re-bind on `astro:page-load`.

---

### Tier 4: Real-World User Scenarios (6 Tests)

- [ ] `T4.01`: **Recruiter Persona Journey**: Verify senior role, timeline, and valid CV download.
- [ ] `T4.02`: **Engineering Lead Persona Journey**: Evaluate architecture, `⌘K` search, and deep-dive.
- [ ] `T4.03`: **Android Developer Persona Journey**: Verify release v3.4.0, download APK, and test TTS simulator.
- [ ] `T4.04`: **Open Source Contributor Persona Journey**: Filter hobby projects, check repo, and inspect highlights.
- [ ] `T4.05`: **Accessibility & Keyboard User Journey**: Keyboard-only navigation with shortcuts and high contrast.
- [ ] `T4.06`: **Mobile Visitor Journey**: Responsive layout, mobile navigation, and squircle graphics.

---

## 4. Progressive Verification Instructions for Implementation Milestones

As each development milestone (M1 through M5) completes, implementation agents or QA should run the test suite to verify milestone acceptance criteria:

| Milestone Under Test | Relevant Tests to Pass | Target Criteria |
|----------------------|------------------------|-----------------|
| **M1: Foundation, Layout & Theme** | `T1.F01.*`, `T1.F02.*`, `T2.F01.*`, `T2.F02.*`, `T3.01`, `T3.07`, `T3.12` | Astro 5 static config, Tailwind CSS v4, Layout with zero-FOUC theme, ClientRouter, Navbar/Footer |
| **M2: Portfolio Core Experience** | `T1.F03.*`, `T1.F04.*`, `T1.F05.*`, `T1.F06.*`, `T2.F03.*` - `T2.F06.*`, `T3.02`, `T3.04`, `T3.10`, `T4.01`, `T4.02`, `T4.05` | Hero with CV PDF, Bento Grid, 7-company timeline, Command Palette with ⌘K and / shortcuts |
| **M3: Content Collections & Archive** | `T1.F07.*`, `T2.F07.*`, `T3.03`, `T3.08`, `T4.04` | `src/content.config.ts`, Zod validation schema, explicit Hobby labeling, `/projects` route |
| **M4: BookReader Flagship Showcase** | `T1.F08.*`, `T2.F08.*`, `T3.05`, `T3.06`, `T3.11`, `T4.03`, `T4.06` | `/projects/bookreader` page, 3D squircle icon, v3.4.0 APK download CTA + dropdown, TTS simulator |
| **M5: CI/CD & GitHub Pages Deployment** | `T1.F09.*`, `T2.F09.*`, `T3.09` | `.github/workflows/deploy.yml`, static build to `dist/`, clean git repo |
| **M6: Final Hardening & 100% Pass** | **All 126 Tests (T1–T4)** | `node tests/run_e2e.js` exits with code 0 (126 passed, 0 failed) |
