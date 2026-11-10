#!/usr/bin/env node
/**
 * Suite Master E2E — Quality Gates de Usuario Real con Persistencia en localStorage
 * GoPixel Academy — Preact SPA 100% Estática
 */

import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'screenshots', 'master-e2e');

fs.mkdirSync(outDir, { recursive: true });

function findBrowser() {
  const candidates = [
    'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
    'C:\\Program Files (x86)\\Microsoft\\EdgeCore\\157.0.4341.42\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error('No browser executable found (Brave, Edge, Chrome).');
}

const baseUrl = 'http://localhost:5173/gopixel-academy/';

async function getStoredPrefs(page) {
  return await page.evaluate(() => {
    const raw = localStorage.getItem('gopixel:v1');
    return raw ? JSON.parse(raw) : null;
  });
}

async function main() {
  const execPath = findBrowser();
  console.log(`[INFO] Navegador: ${execPath}`);
  console.log(`[INFO] Screenshots E2E: ${outDir}`);

  const browser = await puppeteer.launch({
    executablePath: execPath,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  console.log(`\n======================================================`);
  console.log(`🛡️  EJECUTANDO SUITE MASTER E2E (7 QUALITY GATES)`);
  console.log(`======================================================\n`);

  // Limpiar localStorage inicial
  await page.goto(baseUrl, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });

  // -----------------------------------------------------------------
  // GATE 1: Preferencias Globales (Dark/Light + Idioma + Senior Toggle)
  // -----------------------------------------------------------------
  console.log(`▶ Gate 1: Validación de Tema, Idioma y Senior Toggle...`);
  const themeBtn = await page.waitForSelector('.header-actions .circle-action:not(.settings-action)', { timeout: 4000 });
  await themeBtn.click();
  await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'light');

  // Cambiar idioma a inglés
  await page.select('.lang-wrap select', 'en');
  await page.waitForFunction(() => document.documentElement.lang === 'en');

  // Alternar Senior toggle
  const seniorToggle = await page.waitForSelector('.senior-toggle');
  await seniorToggle.click();
  await page.waitForFunction(() => document.documentElement.getAttribute('data-senior') === 'true');

  let prefs = await getStoredPrefs(page);
  assert.equal(prefs.theme, 'light', 'Theme must be light in storage');
  assert.equal(prefs.locale, 'en', 'Locale must be en in storage');
  assert.equal(prefs.seniorEnabled, true, 'Senior enabled must be true');

  await page.screenshot({ path: path.join(outDir, 'gate1_preferences.png') });
  console.log(`  ✓ Gate 1 APROBADO: Preferencias persistidas correctamente.`);

  // Restaurar idioma español y dark para el resto de tests
  await page.select('.lang-wrap select', 'es');
  await page.waitForFunction(() => document.documentElement.lang === 'es');
  await themeBtn.click();
  await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'dark');

  // -----------------------------------------------------------------
  // GATE 2: Editor Interactivo de Go (Lección B01)
  // -----------------------------------------------------------------
  console.log(`\n▶ Gate 2: Interacción con Editor Go y Validación de Sintaxis...`);
  await page.goto(`${baseUrl}#/lesson/B01`, { waitUntil: 'networkidle0' });
  const editor = await page.waitForSelector('textarea.code-editor');

  // Ingresar código correcto en el editor
  await editor.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  await page.evaluate(() => {
    const ta = document.querySelector('textarea.code-editor');
    ta.value = 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hola, Go!")\n}';
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  });

  // Hacer click en probar código
  const runBtn = await page.waitForSelector('.editor-actions button.btn-primary');
  await runBtn.click();

  // Esperar feedback positivo
  await page.waitForSelector('.feedback.correct', { timeout: 3000 });

  prefs = await getStoredPrefs(page);
  assert.ok(prefs.completed.includes('B01'), 'B01 must be marked completed');
  assert.ok(prefs.xp >= 20, 'XP must be at least 20');

  await page.screenshot({ path: path.join(outDir, 'gate2_editor_b01.png') });
  console.log(`  ✓ Gate 2 APROBADO: Editor interactivo validó solución, sumó XP y persistió B01.`);

  // -----------------------------------------------------------------
  // GATE 3: Minijuegos de Aprendizaje (Quiz Battle)
  // -----------------------------------------------------------------
  console.log(`\n▶ Gate 3: Minijuegos Educativos (Quiz Battle)...`);
  await page.goto(`${baseUrl}#/games/quiz`, { waitUntil: 'networkidle0' });

  // Seleccionar la opción 'go'
  const choiceBtn = await page.waitForSelector('button.choice:first-child');
  await choiceBtn.click();

  // Click en validar (buscar botón primario con texto Validar)
  const buttons = await page.$$('button.btn-primary');
  let validateBtn = null;
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Validar')) { validateBtn = b; break; }
  }
  if (!validateBtn && buttons.length > 0) validateBtn = buttons[buttons.length - 1];
  assert.ok(validateBtn, 'Validate button must exist');
  await validateBtn.click();

  // Esperar feedback
  await page.waitForSelector('.feedback.correct', { timeout: 3000 });

  prefs = await getStoredPrefs(page);
  assert.ok(prefs.gameWins.includes('quiz'), 'Quiz win must be recorded in storage');
  assert.ok(prefs.xp >= 35, 'XP increased after minigame win');

  await page.screenshot({ path: path.join(outDir, 'gate3_quiz_minigame.png') });
  console.log(`  ✓ Gate 3 APROBADO: Minijuego completado y victoria registrada.`);

  // -----------------------------------------------------------------
  // GATE 4: Senior Decision Lab (Arquitectura S01)
  // -----------------------------------------------------------------
  console.log(`\n▶ Gate 4: Senior Decision Lab (3 Decisiones Arquitectónicas)...`);
  await page.goto(`${baseUrl}#/senior/S01/decision-lab`, { waitUntil: 'networkidle0' });

  // En S01, las respuestas correctas del banco son [2, 1, 0]
  const decisionAnswers = [2, 1, 0];
  const fieldsets = await page.$$('.senior-question');
  assert.equal(fieldsets.length, 3, 'Must have 3 decision questions');

  for (let i = 0; i < 3; i++) {
    const targetIndex = decisionAnswers[i];
    const radios = await fieldsets[i].$$('input[type="radio"]');
    await radios[targetIndex].click();
  }

  const submitDecisionBtn = await page.waitForSelector('.rubric-actions button.btn-senior');
  await submitDecisionBtn.click();

  await page.waitForSelector('.notice', { timeout: 3000 });
  const scoreText = await page.$eval('.notice b', el => el.textContent);
  assert.ok(scoreText.includes('100%'), `Score must be 100%, got: ${scoreText}`);

  prefs = await getStoredPrefs(page);
  assert.ok(prefs.seniorResults['S01'], 'S01 must exist in seniorResults');
  assert.equal(prefs.seniorResults['S01'].score, 100);
  assert.equal(prefs.seniorResults['S01'].passed, true);

  await page.screenshot({ path: path.join(outDir, 'gate4_decision_lab.png') });
  console.log(`  ✓ Gate 4 APROBADO: Decision Lab evaluado 100% y persistido.`);

  // -----------------------------------------------------------------
  // GATE 5: Senior Evidence Lab (Análisis Técnico S01)
  // -----------------------------------------------------------------
  console.log(`\n▶ Gate 5: Senior Evidence Lab (Análisis de Evidencias)...`);
  await page.goto(`${baseUrl}#/senior/S01/evidence-lab`, { waitUntil: 'networkidle0' });

  // S01 evidence lab correct findings son [0, 2]
  const checkboxes = await page.$$('.senior-options input[type="checkbox"]');
  assert.ok(checkboxes.length >= 3, `Must have at least 3 findings, got: ${checkboxes.length}`);
  await checkboxes[0].click();
  await checkboxes[2].click();

  const evaluateEvidenceBtn = await page.waitForSelector('.rubric-actions button.btn-senior');
  await evaluateEvidenceBtn.click();

  await page.waitForSelector('.notice', { timeout: 3000 });
  const evidenceScore = await page.$eval('.notice h3, .notice strong, .notice', el => el.textContent);
  assert.ok(evidenceScore.includes('100%'), `Evidence score must be 100%, got: ${evidenceScore}`);

  prefs = await getStoredPrefs(page);
  assert.ok(prefs.evidenceResults['S01'], 'S01 must exist in evidenceResults');
  assert.equal(prefs.evidenceResults['S01'].score, 100);
  assert.equal(prefs.evidenceResults['S01'].passed, true);

  await page.screenshot({ path: path.join(outDir, 'gate5_evidence_lab.png') });
  console.log(`  ✓ Gate 5 APROBADO: Evidence Lab resuelto al 100% y registrado.`);

  // -----------------------------------------------------------------
  // GATE 6: Senior Operations Lab (Incidente de Producción S01)
  // -----------------------------------------------------------------
  console.log(`\n▶ Gate 6: Senior Operations Lab (Diagnóstico + Mitigación)...`);
  await page.goto(`${baseUrl}#/senior/S01/operations-lab`, { waitUntil: 'networkidle0' });

  // S01 operations correct diagnosis=1, action=2
  const opFieldsets = await page.$$('.senior-question');
  assert.equal(opFieldsets.length, 2, 'Must have diagnosis and action fieldsets');

  const diagRadios = await opFieldsets[0].$$('input[type="radio"]');
  await diagRadios[1].click();
  const actRadios = await opFieldsets[1].$$('input[type="radio"]');
  await actRadios[2].click();

  const submitOpBtn = await page.waitForSelector('.rubric-actions button.btn-senior');
  await submitOpBtn.click();

  await page.waitForSelector('.notice', { timeout: 3000 });
  const opScore = await page.$eval('.notice strong', el => el.textContent);
  assert.ok(opScore.includes('100%'), `Operations score must be 100%, got: ${opScore}`);

  prefs = await getStoredPrefs(page);
  assert.ok(prefs.operationsResults['S01'], 'S01 must exist in operationsResults');
  assert.equal(prefs.operationsResults['S01'].score, 100);
  assert.equal(prefs.operationsResults['S01'].passed, true);

  await page.screenshot({ path: path.join(outDir, 'gate6_operations_lab.png') });
  console.log(`  ✓ Gate 6 APROBADO: Operations Lab superado con éxito.`);

  // -----------------------------------------------------------------
  // GATE 7: Senior Code Review Lab & Readiness Matrix
  // -----------------------------------------------------------------
  console.log(`\n▶ Gate 7: Senior Code Review Lab & Matriz de Readiness...`);
  await page.goto(`${baseUrl}#/senior/S01/review-lab`, { waitUntil: 'networkidle0' });

  // S01 code review correct decisions son [0, 2]
  const reviewFieldsets = await page.$$('.senior-question');
  assert.equal(reviewFieldsets.length, 2, 'Must have 2 review questions');

  const rev1Radios = await reviewFieldsets[0].$$('input[type="radio"]');
  await rev1Radios[0].click();
  const rev2Radios = await reviewFieldsets[1].$$('input[type="radio"]');
  await rev2Radios[2].click();

  const submitReviewBtn = await page.waitForSelector('.rubric-actions button.btn-senior');
  await submitReviewBtn.click();

  await page.waitForSelector('.notice', { timeout: 3000 });
  const reviewScore = await page.$eval('.notice strong', el => el.textContent);
  assert.ok(reviewScore.includes('100%'), `Review score must be 100%, got: ${reviewScore}`);

  prefs = await getStoredPrefs(page);
  assert.ok(prefs.reviewResults['S01'], 'S01 must exist in reviewResults');
  assert.equal(prefs.reviewResults['S01'].score, 100);

  // Navegar a la matriz de readiness y verificar reflejo en UI
  await page.goto(`${baseUrl}#/senior/readiness`, { waitUntil: 'networkidle0' });
  const s01Card = await page.waitForSelector('.senior-grid .senior-card');
  const s01Text = await page.evaluate(el => el.textContent, s01Card);
  assert.ok(s01Text.includes('S01'), 'S01 must be in readiness cards');
  assert.ok(s01Text.includes('4/5'), `S01 must reflect 4/5 passed labs, got: ${s01Text}`);

  await page.screenshot({ path: path.join(outDir, 'gate7_readiness_matrix.png') });
  console.log(`  ✓ Gate 7 APROBADO: Code Review 100% y reflejado en Readiness Matrix (4/5 labs).`);

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`🎉 SUITE MASTER E2E COMPLETADA CON ÉXITO TOTAL (7/7 GATES)`);
  console.log(`======================================================`);
  console.log(`  • Todas las interacciones de usuario reales validadas.`);
  console.log(`  • Persistencia estricta en localStorage['gopixel:v1'] comprobada.`);
  console.log(`  • Capturas de evidencia en: ${outDir}`);
  console.log(`======================================================\n`);
}

main().catch(err => {
  console.error('[FATAL] Falló la Suite Master E2E:', err);
  process.exit(1);
});
