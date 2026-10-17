# E2E Test Infrastructure & Philosophy: Faycal Rafa Developer Portfolio

## 1. Test Philosophy & Principles

The End-to-End (E2E) test suite for the Faycal Rafa Personal Developer Portfolio and BookReader Flagship Showcase is designed with a strict **opaque-box, specification-grounded, requirements-first** philosophy.

### Core Tenets
1. **Opaque-Box Independence**:
   - Tests evaluate external observable outputs, contracts, artifacts, rendered HTML structures, accessibility properties, and interactive behavior.
   - Tests do NOT couple to ephemeral internal implementation details or private component state.
   - Tests remain resilient to code refactorings while strictly enforcing contractual specifications.

2. **Authoritative Specification Grounding**:
   - Every single test expectation is derived strictly from authoritative sources:
     - `ORIGINAL_REQUEST.md` (Requirements R1, R2, R3, R4, Acceptance Criteria)
     - `PROJECT.md` (Feature Inventory F01–F09, Interface Contracts, Code Layout)
     - Specification Mining Survey Reports (`spec_miner_1` CV extraction, `spec_miner_2` BookReader v3.4.0 release analysis)
   - Zero facade tests: no tests are designed to trivially pass without exercising authentic logic and structural requirements.

3. **Multi-Mode Progressive Verifiability**:
   - **Static & Contract Mode**: Verifies repository structure, configuration files (`astro.config.mjs`, `tsconfig.json`, `package.json`), Astro Content Layer collections and Zod schemas, PDF and image asset integrity, sentence chunking algorithms, and component contracts.
   - **Build & Distribution Mode**: Verifies static build outputs in `dist/` (HTML validity, asset references, zero broken routes, inline FOUC scripts, metadata).
   - **Interactive Contract Mode**: Verifies Web Speech API controller contracts, Command Palette keyboard listeners, theme persistence, and modal dialog interactions.

4. **Zero-Dependency Native Execution**:
   - Built on standard Node.js native test runner (`node:test`) and strict assertion module (`node:assert/strict`).
   - Requires zero external npm testing packages, guaranteeing immediate execution in any standard Node 24+ environment without dependency bloat or version conflicts.

---

## 2. Test Suite Architecture & Tiers

The test suite is structured into 4 distinct tiers, totaling **126 test cases** (exceeding the >=115 threshold):

```
tests/
├── run_e2e.js                    # Unified test runner with tier filtering & colored reporter
└── e2e/
    ├── helpers.js                # Core test utilities, contracts, DOM/HTML inspection, chunker
    ├── tier1_features.test.js    # Tier 1: Feature Coverage (54 tests, 6 per feature F01-F09)
    ├── tier2_boundaries.test.js  # Tier 2: Boundary & Corner Cases (54 tests, 6 per feature F01-F09)
    ├── tier3_interactions.test.js# Tier 3: Cross-Feature Interactions (12 tests)
    └── tier4_scenarios.test.js   # Tier 4: Real-World User Journeys (6 tests)
```

### Tier Breakdown & Coverage Matrix

| Tier | Focus | Test Count | Target Scope |
|------|-------|------------|--------------|
| **Tier 1: Feature Coverage** | Primary happy-path behaviors & structural contracts | **54 tests** (6 per feature F01–F09) | Tooling, Theme & Layout, Hero & CV, Bento Skills, Career Timeline, Command Palette, Content Collections, BookReader Showcase, CI/CD |
| **Tier 2: Boundary & Corner Cases** | Edge cases, corrupt states, missing inputs, extreme viewports | **54 tests** (6 per feature F01–F09) | FOUC prevention, malformed theme storage, rapid toggle, long badges, missing URLs, regex in search, CJK/quote chunking, mobile zoom |
| **Tier 3: Cross-Feature Interactions** | Pairwise module interactions & state continuity | **12 tests** | Theme persistence across View Transitions, ⌘K navigation to projects, CV modal from BookReader, TTS resize, RTL language switch |
| **Tier 4: Real-World Scenarios** | End-to-end user journeys & persona workflows | **6 tests** | Recruiter verifying CV, Tech Lead evaluating architecture, Android Engineer downloading APK & running TTS, Contributor browsing hobby repo, A11y keyboard user, Mobile visitor |
| **Total** | | **126 tests** | Comprehensive system validation |

---

## 3. Test Runner Invocation

### Environment Setup
Ensure Node.js v24.19.0 is in your environment PATH:
```bash
export PATH="/home/faycal/.nvm/versions/node/v24.19.0/bin:$PATH"
```

### Running All Tests
To execute the complete 126-test suite across all 4 tiers:
```bash
node tests/run_e2e.js
```
or via native Node test runner:
```bash
node --test tests/e2e/*.test.js
```

### Running Specific Tiers
The runner supports running individual tiers using the `--tier` flag:
```bash
# Run Tier 1 Feature tests only (54 tests)
node tests/run_e2e.js --tier=1

# Run Tier 2 Boundary tests only (54 tests)
node tests/run_e2e.js --tier=2

# Run Tier 3 Interaction tests only (12 tests)
node tests/run_e2e.js --tier=3

# Run Tier 4 Scenario tests only (6 tests)
node tests/run_e2e.js --tier=4
```

### Diagnostic Verbosity
Add `--verbose` for detailed step-by-step diagnostic output:
```bash
node tests/run_e2e.js --verbose
```

---

## 4. Coverage Thresholds & Quality Gates

To ensure uncompromising software quality, the test runner enforces the following quality gates:

1. **Feature Coverage Gate**: 100% of features F01 through F09 must have at least 5 passing feature tests (our suite provides 6 per feature).
2. **Boundary Resilience Gate**: 100% of features must handle boundary, malformed, and edge conditions without unhandled exceptions or broken layouts.
3. **Cross-Feature Integrity Gate**: All pairwise transitions (theme state, route navigation, modal focus traps, Web Speech lifecycle) must execute cleanly.
4. **End-to-End Persona Journey Gate**: All 6 real-world persona journeys (Recruiter, Tech Lead, Android Engineer, Open-Source Contributor, A11y User, Mobile Visitor) must complete their designated user paths.
5. **Static Artifact Verification**:
   - `dist/index.html` must exist and be valid HTML with zero broken internal asset links.
   - `dist/projects/index.html` and `dist/projects/bookreader/index.html` must be generated.
   - `dist/404.html` must be present for graceful error handling.
   - Direct CV asset `Faycal_Rafa_CV_2026.pdf` must be present and byte-verified.
   - Official BookReader release APK link must point to `https://github.com/faycalrafa/free-novel-reader-tts-android/releases/download/v3.4.0/app-release.apk`.
