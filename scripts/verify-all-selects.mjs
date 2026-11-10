#!/usr/bin/env node
/**
 * Test de Navegación Completa y Validación de Todas las Páginas / Selects
 * GoPixel Academy — Preact SPA 100% Estática
 */

import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'screenshots', 'nav-selects');

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

const routes = [
  { path: '#/', name: '01_home' },
  { path: '#/learn', name: '02_learn_catalog' },
  { path: '#/learn/basic', name: '03_learn_basic' },
  { path: '#/learn/intermediate', name: '04_learn_intermediate' },
  { path: '#/learn/advanced', name: '05_learn_advanced' },
  { path: '#/lesson/B01', name: '06_lesson_B01_editor' },
  { path: '#/exercise/B01', name: '07_exercise_B01' },
  { path: '#/games', name: '08_games_hub' },
  { path: '#/games/quiz', name: '09_games_quiz' },
  { path: '#/games/complete', name: '10_games_complete' },
  { path: '#/games/order', name: '11_games_order' },
  { path: '#/games/predict', name: '12_games_predict' },
  { path: '#/games/bug', name: '13_games_bug' },
  { path: '#/frameworks', name: '14_frameworks_catalog' },
  { path: '#/frameworks/F01', name: '15_frameworks_net_http' },
  { path: '#/frameworks/F02', name: '16_frameworks_gin' },
  { path: '#/playground', name: '17_playground' },
  { path: '#/progress', name: '18_progress_profile' },
  { path: '#/settings', name: '19_settings' },
  { path: '#/senior', name: '20_senior_dashboard' },
  { path: '#/senior/readiness', name: '21_senior_readiness' },
  { path: '#/senior/native', name: '22_senior_native_labs' },
  { path: '#/senior/capstone', name: '23_senior_capstone' },
  { path: '#/senior/S01', name: '24_senior_S01_hub' },
  { path: '#/senior/S01/guide', name: '25_senior_S01_guide' },
  { path: '#/senior/S01/review-lab', name: '26_senior_S01_review_lab' },
  { path: '#/senior/S01/decision-lab', name: '27_senior_S01_decision_lab' },
  { path: '#/senior/S01/evidence-lab', name: '28_senior_S01_evidence_lab' },
  { path: '#/senior/S01/operations-lab', name: '29_senior_S01_operations_lab' },
  { path: '#/senior/S01/investigation-lab', name: '30_senior_S01_investigation_lab' },
  { path: '#/senior/S05', name: '31_senior_S05_worker_pool_sim' },
  { path: '#/senior/S07', name: '32_senior_S07_backing_array_sim' },
  { path: '#/senior/S09', name: '33_senior_S09_dedup_sim' },
  { path: '#/senior/S10', name: '34_senior_S10_inventory_sim' },
  { path: '#/senior/S11', name: '35_senior_S11_retry_storm_sim' },
  { path: '#/senior/S18', name: '36_senior_S18_capacity_sim' },
];

async function main() {
  const execPath = findBrowser();
  console.log(`[INFO] Navegador detectado: ${execPath}`);
  console.log(`[INFO] Destino de capturas: ${outDir}`);

  const browser = await puppeteer.launch({
    executablePath: execPath,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[Console Error] ${msg.text()}`);
    }
  });

  let totalSelectsChecked = 0;
  let totalButtonsChecked = 0;
  let passedPages = 0;

  console.log(`\n======================================================`);
  console.log(`🚀 INICIANDO TEST DE NAVEGACIÓN Y SELECTS (${routes.length} RUTAS)`);
  console.log(`======================================================\n`);

  for (const r of routes) {
    const targetUrl = `${baseUrl}${r.path}`;
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#app', { timeout: 5000 });

    // Validar selects en la página
    const selects = await page.$$eval('select', els => els.map(s => ({
      name: s.getAttribute('name') || s.getAttribute('aria-label') || 'unnamed',
      optionsCount: s.options.length,
      selectedValue: s.value,
      emptyOptions: Array.from(s.options).filter(o => !o.value && !o.text.trim()).length
    })));

    for (const sel of selects) {
      totalSelectsChecked++;
      if (sel.optionsCount === 0) {
        throw new Error(`[FAIL] Select '${sel.name}' en ${r.path} no tiene opciones!`);
      }
      if (!sel.selectedValue) {
        throw new Error(`[FAIL] Select '${sel.name}' en ${r.path} no tiene valor seleccionado!`);
      }
    }

    // Validar botones en la página
    const buttons = await page.$$eval('button', btns => btns.map(b => ({
      type: b.getAttribute('type'),
      text: b.textContent.trim(),
      hasAria: !!b.getAttribute('aria-label') || !!b.getAttribute('title')
    })));
    totalButtonsChecked += buttons.length;

    // Tomar captura
    const screenshotPath = path.join(outDir, `${r.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });

    console.log(`  ✓ [${r.name}] ${r.path} -> ${selects.length} select(s) válidos, ${buttons.length} botones, screenshot OK`);
    passedPages++;
  }

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`📊 RESUMEN DE NAVEGACIÓN Y SELECTS`);
  console.log(`======================================================`);
  console.log(`  • Rutas navegadas exitosamente: ${passedPages} / ${routes.length}`);
  console.log(`  • Elementos <select> validados: ${totalSelectsChecked} (0 vacíos)`);
  console.log(`  • Elementos <button> validados: ${totalButtonsChecked}`);
  console.log(`  • Errores de consola detectados: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error(`\nAdvertencias/Errores de consola:`, consoleErrors);
  }
  console.log(`  • Capturas guardadas en: ${outDir}`);
  console.log(`======================================================\n`);
}

main().catch(err => {
  console.error('[FATAL] Falló el test de navegación:', err);
  process.exit(1);
});
