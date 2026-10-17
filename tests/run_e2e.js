#!/usr/bin/env node
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const TIERS = {
  1: {
    name: 'Tier 1: Feature Coverage (F01–F09)',
    file: path.join(__dirname, 'e2e/tier1_features.test.js'),
    expectedTests: 54
  },
  2: {
    name: 'Tier 2: Boundary & Corner Cases (F01–F09)',
    file: path.join(__dirname, 'e2e/tier2_boundaries.test.js'),
    expectedTests: 54
  },
  3: {
    name: 'Tier 3: Cross-Feature Interactions',
    file: path.join(__dirname, 'e2e/tier3_interactions.test.js'),
    expectedTests: 12
  },
  4: {
    name: 'Tier 4: Real-World User Scenarios',
    file: path.join(__dirname, 'e2e/tier4_scenarios.test.js'),
    expectedTests: 6
  }
};

// ANSI colors
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';
const GRAY = '\x1b[90m';

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    tiers: [1, 2, 3, 4],
    verbose: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (arg.startsWith('--tier=')) {
      const tierNum = parseInt(arg.split('=')[1], 10);
      if (TIERS[tierNum]) options.tiers = [tierNum];
    } else if (arg === '-t' && args[i + 1]) {
      const tierNum = parseInt(args[++i], 10);
      if (TIERS[tierNum]) options.tiers = [tierNum];
    }
  }

  return options;
}

function printHelp() {
  console.log(`
${BOLD}Faycal Rafa Portfolio — Standalone E2E Test Runner${RESET}

Usage:
  node tests/run_e2e.js [options]

Options:
  --tier=<1|2|3|4>   Run tests for a specific tier only (default: all)
  -t <1|2|3|4>       Short alias for --tier
  --verbose, -v      Show full raw test assertions output
  --help, -h         Show this help guide

Tiers:
  Tier 1: Feature Coverage (54 test cases covering F01–F09)
  Tier 2: Boundary & Corner Cases (54 test cases covering F01–F09)
  Tier 3: Cross-Feature Interactions (12 test cases)
  Tier 4: Real-World Scenarios (6 test cases)
  Total:  126 test cases
`);
}

function runTier(tierNumber, verbose) {
  return new Promise((resolve) => {
    const tierConfig = TIERS[tierNumber];
    const nodeBin = process.execPath;
    const testFile = tierConfig.file;

    const child = spawn(nodeBin, ['--test', testFile], {
      cwd: PROJECT_ROOT,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (d) => {
      stdout += d.toString();
      if (verbose) process.stdout.write(d);
    });

    child.stderr.on('data', (d) => {
      stderr += d.toString();
      if (verbose) process.stderr.write(d);
    });

    child.on('close', (code) => {
      // Parse output counts
      const passMatch = stdout.match(/ℹ pass (\d+)/);
      const failMatch = stdout.match(/ℹ fail (\d+)/);
      const totalMatch = stdout.match(/ℹ tests (\d+)/);

      const pass = passMatch ? parseInt(passMatch[1], 10) : 0;
      const fail = failMatch ? parseInt(failMatch[1], 10) : 0;
      const total = totalMatch ? parseInt(totalMatch[1], 10) : 0;

      resolve({
        tierNumber,
        name: tierConfig.name,
        expected: tierConfig.expectedTests,
        total,
        pass,
        fail,
        exitCode: code,
        stdout,
        stderr
      });
    });
  });
}

async function main() {
  const options = parseArgs();

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  console.log(`\n${BOLD}${CYAN}======================================================================${RESET}`);
  console.log(`${BOLD}${CYAN}   Faycal Rafa Portfolio — Standalone Opaque-Box E2E Test Suite      ${RESET}`);
  console.log(`${CYAN}   Authoritative ground: ORIGINAL_REQUEST.md & PROJECT.md (Tiers 1–4)${RESET}`);
  console.log(`${CYAN}======================================================================${RESET}\n`);

  console.log(`${GRAY}Node.js runtime: ${process.version} (${process.execPath})${RESET}`);
  console.log(`${GRAY}Working directory: ${PROJECT_ROOT}${RESET}`);
  console.log(`${GRAY}Selected tiers: ${options.tiers.join(', ')}${RESET}\n`);

  let totalExpected = 0;
  let totalExecuted = 0;
  let totalPassed = 0;
  let totalFailed = 0;

  const results = [];

  for (const tierNum of options.tiers) {
    const tierConfig = TIERS[tierNum];
    totalExpected += tierConfig.expectedTests;
    process.stdout.write(`${BOLD}Running ${tierConfig.name}...${RESET} `);

    const result = await runTier(tierNum, options.verbose);
    results.push(result);
    totalExecuted += result.total;
    totalPassed += result.pass;
    totalFailed += result.fail;

    if (result.exitCode === 0) {
      console.log(`${GREEN}${BOLD}PASSED${RESET} (${result.pass}/${result.total} tests)`);
    } else {
      console.log(`${RED}${BOLD}FAILED / PENDING${RESET} (${result.pass} passed, ${result.fail} failed)`);
    }
  }

  console.log(`\n${BOLD}----------------------------------------------------------------------${RESET}`);
  console.log(`${BOLD}                       TEST SUITE EXECUTION SUMMARY                   ${RESET}`);
  console.log(`${BOLD}----------------------------------------------------------------------${RESET}`);

  for (const r of results) {
    const statusColor = r.exitCode === 0 ? GREEN : YELLOW;
    const statusText = r.exitCode === 0 ? 'READY / PASS' : 'FAIL / PENDING';
    console.log(
      `  ${statusColor}●${RESET} ${r.name.padEnd(46)} ` +
      `[Pass: ${String(r.pass).padStart(2)} | Fail: ${String(r.fail).padStart(2)} | Total: ${String(r.total).padStart(2)}/${r.expected}] ` +
      `${statusColor}${statusText}${RESET}`
    );
  }

  console.log(`${BOLD}----------------------------------------------------------------------${RESET}`);
  console.log(
    `Total Tests Designed & Executed: ${BOLD}${totalExecuted}${RESET} (Expected: >=115, Suite Total: 126)\n` +
    `  ${GREEN}Passed: ${totalPassed}${RESET}\n` +
    `  ${RED}Failed / Pending Implementation: ${totalFailed}${RESET}`
  );

  if (totalFailed > 0) {
    console.log(`\n${YELLOW}${BOLD}[NOTICE for Implementation Milestones (M1–M5)]${RESET}`);
    console.log(
      `${YELLOW}Pending failures are due to portfolio source code and static dist files\n` +
      `not yet built by development agents. When M1–M5 agents implement their milestones,\n` +
      `re-run \`node tests/run_e2e.js\` to verify 100% test passing.${RESET}\n`
    );
    process.exit(1);
  } else {
    console.log(`\n${GREEN}${BOLD}✓ All ${totalPassed} tests passed! Suite is 100% verified.${RESET}\n`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Test runner encountered an unhandled error:', err);
  process.exit(1);
});
