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
