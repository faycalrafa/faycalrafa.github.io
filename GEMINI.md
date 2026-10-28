# Project Guidelines & Workflow Rules

Whenever working on this project (`faycalrafa-portfolio` / `faycalrafa.github.io`), always strictly adhere to the following workflow:

## 1. Always Pull First
Before inspecting issues, modifying code, or starting any task:
```bash
git pull --rebase origin main
```
Ensure your local branch is strictly up-to-date with remote before making any changes.

## 2. Always Run Checks & Test Suite
After making changes and before committing:
```bash
# Ensure Node 24 is available in PATH
export PATH=$PATH:/home/faycal/.nvm/versions/node/v24.19.0/bin

# 1. Typecheck Astro components and scripts
npm run check

# 2. Run the full standalone E2E test suite (Tiers 1–4)
node tests/run_e2e.js

# 3. Verify static production build
npm run build
```
Do not proceed to push if any check or test fails. All 126+ tests must pass.

## 3. Always Commit and Push to Main
Every time work is completed on this project:
1. Stage modified files (`git add ...`).
2. Create a concise, conventional commit message (`git commit -m "..."`).
3. Push changes immediately to `origin main`:
```bash
git push origin main
```
This triggers the automatic GitHub Pages deployment pipeline.

## 4. Maximum File Size Rule
No single code file in `src/` (Astro, TypeScript, JavaScript) may exceed 500 lines of code.
Whenever a component or page grows near or beyond 500 lines:
- Break it down into cohesive, single-responsibility subcomponents or helper modules.
- Extract client scripts into dedicated controller files under `src/scripts/`.
- Extract data, configuration, and text strings into centralized files or locale chunks.
- Keep components focused and maintainable.

## 5. Multi-Language (i18n) & RTL Perfection Rules
Every page, component, modal, and interactive script must strictly adhere to internationalization and bidirectional rendering standards:

### A. Zero Untranslated Text Rule
- No user-visible string may be hardcoded without corresponding translation keys in the 3 official languages:
  1. English (`en`) - Default
  2. French (`fr`)
  3. Arabic (`ar`) - with family name strictly formatted as **"فيصل رافة"**.
- Text strings must be organized into centralized, domain-focused JSON chunks in `src/locales/` (`common`, `hero`, `career`, `projects`, `bookreader`, `textmorph`, `cv`, `contact`). Never create a single global monolithic file.
- All dynamic interactive elements (modals, search inputs, showcase screen selectors, toast messages) must update their labels when language changes via `lang-changed` events.

### B. Component-by-Component RTL Standards
Every component must look exceptional in both LTR and RTL:
1. **Typography**: Arabic pages must render with the Google Font `Cairo`, natural line-heights (`1.35`), and normalized letter-spacing.
2. **Directional Arrow & Icon Flipping**: Any navigation indicator pointing forward or backward (`→`, `←`, `&rarr;`, chevrons) must include `.arrow-icon` or `[data-rtl-flip]` to flip horizontally in RTL.
3. **Bidirectional Text Isolation**: All technical terms, code snippets, version numbers (e.g. `v3.5.4`), phone numbers (`+213...`), email addresses, and URLs must be wrapped with `unicode-bidi: isolate; direction: ltr; display: inline-block;` to prevent punctuation inversions.
4. **Asymmetric Spacing Mirroring**: Inputs, search boxes, and asymmetrical layout paddings (`pl-*` vs `pr-*`) must have corresponding RTL rules.
5. **Timeline & Laser Progress Bars**: Vertical progress tracks and beacon nodes (in `FeaturedProjects` and `CareerTimeline`) must anchor to the right in RTL (`right-*` / `left: auto`) with mirrored item indentation (`pr-*` / `pl-0`).
6. **Floating Controls & Menus**: Top-right floating controls (`#floating-lang-changer`, `#floating-projects-btn`) and dropdown menus must anchor to the left in RTL (`left: 1rem; right: auto;`) with `transform-origin: top left`.

