import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PROJECT_ROOT = path.resolve(__dirname, '../..');
export const DIST_ROOT = path.join(PROJECT_ROOT, 'dist');
export const SRC_ROOT = path.join(PROJECT_ROOT, 'src');
export const PUBLIC_ROOT = path.join(PROJECT_ROOT, 'public');

/**
 * Checks if a relative file exists within PROJECT_ROOT
 */
export function fileExists(relPath) {
  const fullPath = path.isAbsolute(relPath) ? relPath : path.join(PROJECT_ROOT, relPath);
  return fs.existsSync(fullPath);
}

/**
 * Reads file content safely
 */
export function readFile(relPath) {
  const fullPath = path.isAbsolute(relPath) ? relPath : path.join(PROJECT_ROOT, relPath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, 'utf8');
}

/**
 * Reads and parses JSON file
 */
export function readJson(relPath) {
  const content = readFile(relPath);
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

/**
 * Retrieves HTML for a route from dist/ (if built) or falls back to reading src/pages/ template
 */
export function getRouteHtml(routePath) {
  const normalized = routePath.replace(/^\//, '').replace(/\/$/, '');
  const distCandidate1 = path.join(DIST_ROOT, normalized, 'index.html');
  const distCandidate2 = path.join(DIST_ROOT, `${normalized}.html`);
  const distCandidate3 = normalized === '' ? path.join(DIST_ROOT, 'index.html') : null;

  if (distCandidate3 && fs.existsSync(distCandidate3)) return fs.readFileSync(distCandidate3, 'utf8');
  if (fs.existsSync(distCandidate1)) return fs.readFileSync(distCandidate1, 'utf8');
  if (fs.existsSync(distCandidate2)) return fs.readFileSync(distCandidate2, 'utf8');

  // Fallback: search src/pages
  const srcCandidate1 = normalized === '' ? path.join(SRC_ROOT, 'pages/index.astro') : path.join(SRC_ROOT, `pages/${normalized}.astro`);
  const srcCandidate2 = path.join(SRC_ROOT, `pages/${normalized}/index.astro`);
  if (fs.existsSync(srcCandidate1)) return fs.readFileSync(srcCandidate1, 'utf8');
  if (fs.existsSync(srcCandidate2)) return fs.readFileSync(srcCandidate2, 'utf8');

  return null;
}

/**
 * Extracts all tags matching tagName (e.g. 'a', 'button', 'meta')
 */
export function extractTags(html, tagName) {
  if (!html) return [];
  const regex = new RegExp(`<${tagName}\\b[^>]*>(?:([\\s\\S]*?)<\\/${tagName}>)?`, 'gi');
  const matches = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    matches.push({
      full: match[0],
      inner: match[1] || '',
      attrs: parseAttributes(match[0])
    });
  }
  return matches;
}

/**
 * Simple HTML attribute parser
 */
export function parseAttributes(tagHtml) {
  const attrs = {};
  const attrRegex = /([a-zA-Z0-9_\-:@.]+)(?:=(?:"([^"]*)"|'([^']*)'|([^>\s]+)))?/g;
  let match;
  // skip tag name
  const firstSpace = tagHtml.indexOf(' ');
  if (firstSpace === -1) return attrs;
  const attrPart = tagHtml.substring(firstSpace, tagHtml.indexOf('>'));

  while ((match = attrRegex.exec(attrPart)) !== null) {
    const key = match[1];
    const val = match[2] ?? match[3] ?? match[4] ?? true;
    attrs[key] = val;
  }
  return attrs;
}

/**
 * Checks if HTML or component contains a specific text or regex
 */
export function containsText(source, textOrRegex) {
  if (!source) return false;
  if (typeof textOrRegex === 'string') {
    return source.includes(textOrRegex);
  }
  return textOrRegex.test(source);
}

/**
 * Reference Quote- and Punctuation-Aware Sentence Chunking Algorithm
 * Derived directly from BookReader Android Specification & spec_miner_2
 */
export function chunkTextIntoSentences(rawText) {
  if (!rawText || !rawText.trim()) return [];

  const ABBREVIATIONS = [
    'mr.', 'mrs.', 'ms.', 'dr.', 'prof.', 'sr.', 'jr.', 'vs.', 'etc.',
    'e.g.', 'i.e.', 'a.m.', 'p.m.', 'vol.', 'ch.', 'no.', 'fig.', 'al.'
  ];

  let text = rawText;

  // Step 1: Protect decimal & version numbers (e.g. 3.14, v3.4.0)
  text = text.replace(/(?<=\w|\b|^)\d+\.\d+(?:\.\d+)*(?=\b|\s|$|[.,!?])/g, (match) => {
    return match.replace(/\./g, '__DOT__');
  });

  // Step 2: Protect ellipses (... and …)
  text = text.replace(/\.{3}/g, '__ELLIPSIS__').replace(/…/g, '__ELLIPSIS_CHAR__');

  // Step 3: Protect common abbreviations
  for (const abbr of ABBREVIATIONS) {
    const escaped = abbr.replace(/\./g, '\\.');
    const regex = new RegExp('(?<=\\s|^)' + escaped + '(?=\\s|$|[.,!?])', 'gi');
    text = text.replace(regex, (match) => match.replace(/\./g, '__DOT__'));
  }

  // Protect initials (e.g. "J. K. Rowling")
  text = text.replace(/(?<=\s|^)[A-Z]\.(?=\s[A-Z]\.|\s[A-Z][a-z])/g, (match) => match.replace(/\./g, '__DOT__'));

  // Step 4: Sentence matching regex
  const sentencePattern = /[^.!?؟。！？\n\r]+(?:[.!?؟]+(?:\s*["'”’»」』）］｝)\]}]+)*(?=\s|$)|[。！？]+(?:\s*["'”’»」』）］｝)\]}]+)*)|[^.!?؟。！？\n\r]+$/gu;

  const chunks = [];
  let match;
  let index = 0;

  while ((match = sentencePattern.exec(text)) !== null) {
    let clean = match[0].trim();
    if (clean.length > 0) {
      clean = clean
        .replace(/__DOT__/g, '.')
        .replace(/__ELLIPSIS__/g, '...')
        .replace(/__ELLIPSIS_CHAR__/g, '…');

      const isDialogue = /^["'“‘«「『]/.test(clean) || /["'”’»」』]$/.test(clean);

      chunks.push({
        id: index++,
        text: clean,
        isDialogue,
        charStart: match.index,
        charEnd: match.index + match[0].length
      });
    }
  }

  return chunks.length > 0 ? chunks : [{
    id: 0,
    text: rawText.trim(),
    isDialogue: false,
    charStart: 0,
    charEnd: rawText.length
  }];
}

/**
 * Checks if a PDF buffer has a valid PDF header
 */
export function isValidPdfBuffer(buffer) {
  if (!buffer || buffer.length < 5) return false;
  return buffer.toString('utf8', 0, 5) === '%PDF-';
}
