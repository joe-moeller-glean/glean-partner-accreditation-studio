/**
 * Visual QA for AGT-101. Renders the real module in Chrome and captures
 * full-page and per-band screenshots so the design can be reviewed against
 * the reference screenshots.
 *
 * Run: node tools/agents/visual_qa_agt101.js
 */
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright-core");

const ROOT = path.join(__dirname, "..", "..");
const MOD = path.join(ROOT, "learning", "modules", "AGT-101");
const OUT = path.join(ROOT, "learning", "modules", "AGT-101", "qa", "visual");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// Minimal SCORM API so the module initialises exactly as it would in an LMS.
const SCORM_SHIM = `
  (function(){
    var d = {"cmi.core.lesson_status":"not attempted","cmi.core.student_name":"Reviewer, A"};
    window.API = {
      LMSInitialize:function(){return "true";},
      LMSFinish:function(){return "true";},
      LMSGetValue:function(k){return d[k]===undefined?"":String(d[k]);},
      LMSSetValue:function(k,v){d[k]=String(v);return "true";},
      LMSCommit:function(){return "true";},
      LMSGetLastError:function(){return "0";},
      LMSGetErrorString:function(){return "";},
      LMSGetDiagnostic:function(){return "";}
    };
  })();
`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const consoleErrors = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  page.on("pageerror", (e) => consoleErrors.push("pageerror: " + e.message));
  const failedRequests = [];
  page.on("requestfailed", (r) => failedRequests.push(r.url() + " " + (r.failure() || {}).errorText));

  await page.addInitScript(SCORM_SHIM);
  await page.goto("file://" + path.join(MOD, "index.html"));
  await page.waitForSelector(".band", { timeout: 5000 });
  await page.waitForTimeout(400);

  const bandCount = await page.locator(".band").count();
  console.log("bands rendered:", bandCount);

  // scroll the whole page so every reveal fires and every band is visited
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 250));
  });

  // full page
  await page.screenshot({ path: path.join(OUT, "full-page.png"), fullPage: true });

  // per-band captures
  const ids = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".band")).map((b) => b.id));
  for (let i = 0; i < ids.length; i++) {
    const loc = page.locator("#" + ids[i]);
    await loc.scrollIntoViewIfNeeded();
    await page.waitForTimeout(180);
    await loc.screenshot({ path: path.join(OUT, `band-${String(i + 1).padStart(2, "0")}-${ids[i].replace("band-", "")}.png`) });
  }

  // interaction states worth reviewing
  await page.locator(".hotspot__btn").nth(3).click();
  await page.waitForTimeout(200);
  await page.locator("#band-BAND-04").screenshot({ path: path.join(OUT, "state-hotspot-selected.png") });

  await page.locator(".tabs__tab").nth(1).click();
  await page.waitForTimeout(200);
  await page.locator("#band-BAND-05").screenshot({ path: path.join(OUT, "state-workflow-tab.png") });

  const dOpts = page.locator(".decision").first().locator(".pill");
  await dOpts.nth(1).click();
  await page.waitForTimeout(200);
  await page.locator("#band-BAND-06").screenshot({ path: path.join(OUT, "state-decision-feedback.png") });

  await page.locator(".sorter__card").first().locator(".sorter__opt").first().click();
  await page.waitForTimeout(200);
  await page.locator("#band-BAND-07").screenshot({ path: path.join(OUT, "state-sorter-answered.png") });

  await page.locator(".myth").first().locator(".pill").nth(1).click();
  await page.waitForTimeout(200);
  await page.locator("#band-BAND-08").screenshot({ path: path.join(OUT, "state-myth-revealed.png") });

  const boxes = page.locator(".risk__factor input");
  const n = await boxes.count();
  for (let i = 0; i < n; i++) await boxes.nth(i).check();
  await page.waitForTimeout(250);
  await page.locator("#band-BAND-09").screenshot({ path: path.join(OUT, "state-risk-enterprise.png") });

  await page.locator(".stepper__dot").nth(3).click();
  await page.waitForTimeout(200);
  await page.locator("#band-BAND-10").screenshot({ path: path.join(OUT, "state-stepper-stage4.png") });

  // quiz interaction
  await page.locator("#band-BAND-11").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.locator(".quiz__opt").first().click();
  await page.waitForTimeout(200);
  await page.locator("#band-BAND-11").screenshot({ path: path.join(OUT, "state-quiz-answered.png") });

  // mobile
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mob.addInitScript(SCORM_SHIM);
  await mob.goto("file://" + path.join(MOD, "index.html"));
  await mob.waitForSelector(".band");
  await mob.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await mob.waitForTimeout(300);
  await mob.screenshot({ path: path.join(OUT, "mobile-full.png"), fullPage: true });

  // layout diagnostics
  const diag = await page.evaluate(() => {
    const out = { overflow: [], tinyTargets: [], railVisible: false, docWidth: document.documentElement.scrollWidth, winWidth: window.innerWidth };
    document.querySelectorAll("*").forEach((n) => {
      const r = n.getBoundingClientRect();
      if (r.width > 0 && r.right > window.innerWidth + 2) {
        out.overflow.push(n.className || n.tagName);
      }
    });
    document.querySelectorAll("button, a").forEach((n) => {
      const r = n.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && (r.height < 24 || r.width < 24)) {
        out.tinyTargets.push((n.className || n.tagName) + " " + Math.round(r.width) + "x" + Math.round(r.height));
      }
    });
    const rail = document.querySelector(".rail");
    out.railVisible = rail ? getComputedStyle(rail).display !== "none" : false;
    return out;
  });

  const mobDiag = await mob.evaluate(() => {
    const out = { overflow: [], docWidth: document.documentElement.scrollWidth, winWidth: window.innerWidth };
    document.querySelectorAll("*").forEach((n) => {
      const r = n.getBoundingClientRect();
      if (r.width > 0 && r.right > window.innerWidth + 2) out.overflow.push(n.className || n.tagName);
    });
    return out;
  });

  console.log("\n--- desktop diagnostics ---");
  console.log("rail visible at 1440px:", diag.railVisible);
  console.log("horizontal overflow:", diag.docWidth > diag.winWidth ? `YES (${diag.docWidth} > ${diag.winWidth})` : "none");
  console.log("elements past viewport:", diag.overflow.length ? diag.overflow.slice(0, 5) : "none");
  console.log("touch targets under 24px:", diag.tinyTargets.length ? diag.tinyTargets.slice(0, 8) : "none");
  console.log("\n--- mobile diagnostics (390px) ---");
  console.log("horizontal overflow:", mobDiag.docWidth > mobDiag.winWidth ? `YES (${mobDiag.docWidth} > ${mobDiag.winWidth})` : "none");
  console.log("elements past viewport:", mobDiag.overflow.length ? mobDiag.overflow.slice(0, 5) : "none");
  console.log("\nconsole errors:", consoleErrors.length ? consoleErrors : "none");
  console.log("failed requests:", failedRequests.length ? failedRequests : "none");
  console.log("\nscreenshots ->", path.relative(ROOT, OUT));

  await browser.close();
})();
