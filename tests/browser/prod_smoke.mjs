// Production smoke test: launch every extracted SCORM package in Chromium against a mock
// SCORM 1.2 API and prove that the shipped runtime is clean.
//
//   node tests/browser/prod_smoke.mjs <packages-root> <base-url> <out.json>
//
// <packages-root>/<package>/ holds an extracted ZIP and is served at <base-url>/<package>/.
// Fails on: any development feedback overlay trace, any request that leaves the package origin,
// uncaught page errors, or a runtime that never calls LMSInitialize.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const [root, base, out] = process.argv.slice(2);
if (!root || !base || !out) {
  console.error('usage: prod_smoke.mjs <packages-root> <base-url> <out.json>');
  process.exit(2);
}
const MARKERS = ['data-feedback-dev', 'glean-feedback-overlay', '/__feedback/', '__GLEAN_FEEDBACK__'];

function launchHref(dir) {
  const xml = fs.readFileSync(path.join(dir, 'imsmanifest.xml'), 'utf8');
  const m = xml.match(/<resource\b[^>]*adlcp:scormtype="sco"[^>]*href="([^"]+)"/i) || xml.match(/<resource\b[^>]*href="([^"]+)"/i);
  return m ? m[1] : 'index.html';
}

const mockApi = () => {
  const store = {};
  const calls = [];
  window.__SCORM_CALLS__ = calls;
  window.API = {
    LMSInitialize: () => { calls.push('LMSInitialize'); return 'true'; },
    LMSFinish: () => { calls.push('LMSFinish'); return 'true'; },
    LMSGetValue: (k) => { calls.push('get:' + k); return store[k] || ''; },
    LMSSetValue: (k, v) => { calls.push('set:' + k); store[k] = String(v); return 'true'; },
    LMSCommit: () => { calls.push('LMSCommit'); return 'true'; },
    LMSGetLastError: () => '0', LMSGetErrorString: () => '', LMSGetDiagnostic: () => '',
  };
};

const pkgs = fs.readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(root, d.name, 'imsmanifest.xml')))
  .map((d) => d.name).sort();
const browser = await chromium.launch();
const results = [];
for (const name of pkgs) {
  const failures = [];
  const warnings = [];
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.addInitScript(mockApi);
  const page = await context.newPage();
  const origin = new URL(base).origin;
  page.on('request', (req) => {
    const url = req.url();
    if (url.startsWith('data:') || url.startsWith('blob:') || url === 'about:blank') return;
    if (!url.startsWith(origin + '/')) failures.push('request leaves the package origin: ' + url);
    else if (!url.startsWith(`${base}/${name}/`)) failures.push('request outside the package folder: ' + url);
    if (url.includes('/__feedback/')) failures.push('request to the feedback dev API: ' + url);
  });
  page.on('requestfailed', (req) => warnings.push('request failed: ' + req.url()));
  page.on('pageerror', (err) => failures.push('page error: ' + String(err.message || err).slice(0, 200)));
  page.on('console', (msg) => { if (msg.type() === 'error') warnings.push('console error: ' + msg.text().slice(0, 200)); });
  const url = `${base}/${name}/${launchHref(path.join(root, name))}`;
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(400);
    const probe = await page.evaluate((markers) => ({
      host: !!document.querySelector('glean-feedback-overlay'),
      attr: document.querySelectorAll('[data-feedback-dev]').length,
      global: '__GLEAN_FEEDBACK__' in window,
      html: markers.filter((m) => document.documentElement.outerHTML.includes(m)),
      calls: window.__SCORM_CALLS__ || [],
      text: document.body ? document.body.innerText.trim().length : 0,
    }), MARKERS);
    if (probe.host) failures.push('feedback overlay element present');
    if (probe.attr) failures.push(`${probe.attr} element(s) carry data-feedback-dev`);
    if (probe.global) failures.push('feedback overlay global present');
    if (probe.html.length) failures.push('feedback markers in rendered page: ' + probe.html.join(', '));
    if (!probe.calls.includes('LMSInitialize')) failures.push('runtime never called LMSInitialize');
    if (!probe.text) failures.push('page rendered no text');
  } catch (err) {
    failures.push('launch failed: ' + String(err.message || err).slice(0, 200));
  }
  await context.close();
  results.push({ package: name, url, failures, warnings: [...new Set(warnings)].slice(0, 10) });
  console.log(`${failures.length ? 'FAIL' : 'PASS'}  ${name}${failures.length ? '  ' + failures[0] : ''}`);
}
await browser.close();
const failed = results.filter((r) => r.failures.length);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ generated: new Date().toISOString(), packages: results.length,
  failed: failed.length, results }, null, 2) + '\n');
console.log(`prod smoke: ${results.length} package(s), ${failed.length} failed`);
process.exit(failed.length || !results.length ? 1 : 0);
