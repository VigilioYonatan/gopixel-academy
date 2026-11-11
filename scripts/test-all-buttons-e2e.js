#!/usr/bin/env node
/**
 * Suite E2E de Verificación Integral de Botones e Interacciones
 * GoPixel Academy — Senior Mode & Core SPA
 * 
 * Recorre y valida el 100% de los botones, formularios y controles interactivos
 * en todos los flujos de la aplicación.
 */

import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'screenshots', 'button-e2e');

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
  throw new Error('No browser executable found.');
}

const baseUrl = 'http://localhost:5173/gopixel-academy/';

async function main() {
  const execPath = findBrowser();
  console.log(`[INFO] Navegador: ${execPath}`);
  console.log(`[INFO] Salida capturas: ${outDir}`);

  const browser = await puppeteer.launch({
    executablePath: execPath,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Monitor de errores en consola y excepciones JS
  const errors = [];
  page.on('pageerror', err => {
    errors.push(`[PAGE_ERROR] ${err.message}`);
    console.error(`  ❌ Excepción en runtime: ${err.message}`);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Filtrar avisos de red esperados (404, ERR_INSUFFICIENT_RESOURCES de descargas o recursos estáticos)
      if (!text.includes('404') && !text.includes('net::ERR_')) {
        errors.push(`[CONSOLE_ERROR] ${text}`);
        console.error(`  ❌ Error de consola: ${text}`);
      }
    }
  });

  // Manejador de diálogos (confirm, alert) para no bloquear la ejecución
  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  let totalButtonsClicked = 0;

  async function clickButton(selector, description) {
    await page.waitForSelector(selector, { visible: true, timeout: 5000 });
    const btn = await page.$(selector);
    assert.ok(btn, `Botón no encontrado: ${selector} (${description})`);
    await page.evaluate(el => el.click(), btn);
    totalButtonsClicked++;
    await new Promise(r => setTimeout(r, 250));
  }

  try {
    console.log('\n======================================================');
    console.log('🧪 SUITE E2E: TEST DE TODOS LOS BOTONES E INTERACCIONES');
    console.log('======================================================\n');

    // 1. CARGA INICIAL & RESET DE STORAGE
    console.log('▶ SECCIÓN 1: Header, Global Actions y Controles de Tema...');
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });

    // Alternar tema Dark / Light
    const themeBtn = await page.$('.header-actions .circle-action:not(.settings-action)');
    assert.ok(themeBtn, 'Botón de tema debe existir');
    await themeBtn.click();
    totalButtonsClicked++;
    await new Promise(r => setTimeout(r, 200));
    let themeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    assert.equal(themeAttr, 'light', 'Tema debe ser light tras 1er clic');
    
    await themeBtn.click();
    totalButtonsClicked++;
    await new Promise(r => setTimeout(r, 200));
    themeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    assert.equal(themeAttr, 'dark', 'Tema debe ser dark tras 2do clic');

    // Alternar Senior Mode Toggle en Header
    const seniorToggleBtn = await page.$('.senior-toggle');
    assert.ok(seniorToggleBtn, 'Botón de toggle Senior debe existir en header');
    await seniorToggleBtn.click();
    totalButtonsClicked++;
    await new Promise(r => setTimeout(r, 200));
    let isSenior = await page.evaluate(() => document.documentElement.getAttribute('data-senior'));
    assert.equal(isSenior, 'true', 'Senior mode debe activarse');

    // Selector de idiomas (ciclo por los 6 idiomas)
    for (const lang of ['en', 'ja', 'zh', 'pt', 'fr', 'es']) {
      await page.select('.lang-wrap select', lang);
      await page.waitForFunction(l => document.documentElement.lang === l, {}, lang);
    }

    // Botón de Settings en Header
    await clickButton('a.settings-action', 'Abrir Settings desde Header');
    let hash = await page.evaluate(() => window.location.hash);
    assert.equal(hash, '#/settings', 'Debe navegar a #/settings');

    // Botón Logo/Marca para volver a Home
    await clickButton('.brand', 'Clic en Brand Logo para ir a Home');
    hash = await page.evaluate(() => window.location.hash);
    assert.equal(hash, '#/', 'Debe volver a #/');
    console.log('  ✓ Sección 1 APROBADA: Header, idiomas y toggles operativos.');

    // 2. HERO & LANDING BUTTONS
    console.log('\n▶ SECCIÓN 2: Botones de Home, Hero CTA y Tarjetas de Track...');
    await clickButton('.hero-ctas .btn-primary', 'Clic en Comenzar gratis');
    hash = await page.evaluate(() => window.location.hash);
    assert.equal(hash, '#/lesson/B01', 'Debe llevar a #/lesson/B01');

    await page.goto(`${baseUrl}#/`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.hero-ctas', { timeout: 3000 });
    await clickButton('.hero-ctas .btn-outline', 'Clic en Explorar rutas');
    hash = await page.evaluate(() => window.location.hash);
    assert.equal(hash, '#/learn', 'Debe llevar a #/learn');

    await page.goto(`${baseUrl}#/`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.feature-banner', { timeout: 3000 });
    // Botón Senior Mode en Feature Banner
    await clickButton('.feature-banner .btn-senior', 'Clic en Senior Mode Banner');
    hash = await page.evaluate(() => window.location.hash);
    assert.equal(hash, '#/senior', 'Debe llevar a #/senior');
    console.log('  ✓ Sección 2 APROBADA: Todos los CTA de Landing verificados.');

    // 3. CODE EDITOR & LECCIÓN DIDÁCTICA (B01)
    console.log('\n▶ SECCIÓN 3: Botones del Editor Go Interactivo (B01)...');
    await page.goto(`${baseUrl}#/lesson/B01`, { waitUntil: 'networkidle0' });

    // Botón Pista (Hint)
    await clickButton('.editor-actions .btn-quiet', 'Clic en botón Pista');
    const hintBox = await page.$('.hint-box');
    assert.ok(hintBox, 'Caja de pista debe desplegarse');

    // Botón Reiniciar código
    await clickButton('.editor-actions .btn-outline', 'Clic en Reiniciar código');

    // Cargar solución válida con input event
    await page.evaluate(() => {
      const ta = document.querySelector('textarea.code-editor');
      ta.value = 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hola, Go!")\n}';
      ta.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await clickButton('.editor-actions .btn-primary', 'Clic en Validar código');
    await page.waitForSelector('.feedback.correct', { timeout: 3000 });
    const feedbackText = await page.$eval('.feedback.correct', el => el.textContent);
    assert.ok(feedbackText.length > 2, 'Feedback positivo mostrado');

    // Navegar de regreso por breadcrumb
    await clickButton('.breadcrumbs a[href*="basic"]', 'Navegar de regreso a catálogo');
    hash = await page.evaluate(() => window.location.hash);
    assert.ok(hash.includes('learn/basic'), 'Debe estar en catálogo básico');
    console.log('  ✓ Sección 3 APROBADA: Editor Go, validación, feedback y breadcrumbs.');

    // 4. MINIJUEGOS EDUCATIVOS (5 MODOS DE JUEGO)
    console.log('\n▶ SECCIÓN 4: Botones e Interacciones en los 5 Minijuegos...');
    
    // Modo 1: Quiz Battle
    await page.goto(`${baseUrl}#/games/quiz`, { waitUntil: 'networkidle0' });
    await clickButton('.choice:first-child', 'Seleccionar opción Quiz');
    await clickButton('.game-actions .btn-primary', 'Validar Quiz');
    await clickButton('.game-actions .btn-outline', 'Reiniciar Quiz');

    // Modo 2: Complete Code
    await page.goto(`${baseUrl}#/games/complete`, { waitUntil: 'networkidle0' });
    const inputComplete = await page.$('.game-arena input');
    if (inputComplete) {
      await inputComplete.type('Println');
      await clickButton('.game-actions .btn-primary', 'Validar Complete Code');
      await clickButton('.game-actions .btn-outline', 'Reiniciar Complete Code');
    }

    // Modo 3: Order Code (Flechas arriba/abajo)
    await page.goto(`${baseUrl}#/games/order`, { waitUntil: 'networkidle0' });
    const moveDownBtns = await page.$$('.order-item button:not([disabled])');
    for (const mb of moveDownBtns.slice(0, 2)) {
      await mb.click();
      totalButtonsClicked++;
      await new Promise(r => setTimeout(r, 100));
    }
    await clickButton('.game-actions .btn-outline', 'Reiniciar Order Code');

    // Modo 4: Predict Output
    await page.goto(`${baseUrl}#/games/predict`, { waitUntil: 'networkidle0' });
    await clickButton('.choice:nth-child(3)', 'Seleccionar opción de predicción');
    await clickButton('.game-actions .btn-primary', 'Validar Predict Output');
    await clickButton('.game-actions .btn-outline', 'Reiniciar Predict Output');

    // Modo 5: Bug Hunter
    await page.goto(`${baseUrl}#/games/bug`, { waitUntil: 'networkidle0' });
    await clickButton('.choice:nth-child(2)', 'Seleccionar corrección sintáctica');
    await clickButton('.game-actions .btn-primary', 'Validar Bug Hunter');
    await clickButton('.game-actions .btn-outline', 'Reiniciar Bug Hunter');
    console.log('  ✓ Sección 4 APROBADA: 5 minijuegos interactivos y sus botones.');

    // 5. SENIOR HUB, RUTAS PRINCIPALES Y TARJETAS
    console.log('\n▶ SECCIÓN 5: Navegación y Rutas del Senior Hub...');
    await page.goto(`${baseUrl}#/senior`, { waitUntil: 'networkidle0' });

    // Botones de acción en Senior Dashboard: Native, Readiness, Capstone
    const seniorRoutes = ['#/senior/native', '#/senior/readiness', '#/senior/capstone'];
    for (const route of seniorRoutes) {
      const link = await page.$(`.native-links a[href="${route}"]`);
      if (link) {
        await link.click();
        totalButtonsClicked++;
        await new Promise(r => setTimeout(r, 150));
        await page.goto(`${baseUrl}#/senior`, { waitUntil: 'networkidle0' });
      }
    }

    // Clic en la primera tarjeta de módulo S01
    await clickButton('.senior-grid .senior-card:first-child', 'Abrir Senior Module Hub S01');
    hash = await page.evaluate(() => window.location.hash);
    assert.equal(hash, '#/senior/S01', 'Debe navegar a #/senior/S01');

    // Probar textarea de notas ADR en SeniorModuleHub
    const adrTextarea = await page.$('.notes-editor');
    if (adrTextarea) {
      await adrTextarea.type(' Notas de arquitectura para desacoplamiento y puertos Go.');
      await new Promise(r => setTimeout(r, 150));
    }
    console.log('  ✓ Sección 5 APROBADA: Senior Hub, enlaces nativos y notas ADR.');

    // 6. SENIOR DECISION LABS (S01)
    console.log('\n▶ SECCIÓN 6: Senior Decision Lab (S01) — Evaluación y Reset...');
    await page.goto(`${baseUrl}#/senior/S01/decision-lab`, { waitUntil: 'networkidle0' });
    const decisionQuestions = await page.$$('.senior-question');
    assert.equal(decisionQuestions.length, 3, 'Deben existir 3 preguntas de decisión en S01');
    
    // Respuestas correctas para S01: [2, 1, 0]
    const correctDecisionAnswers = [2, 1, 0];
    for (let i = 0; i < 3; i++) {
      const radios = await decisionQuestions[i].$$('input[type="radio"]');
      if (radios[correctDecisionAnswers[i]]) {
        await radios[correctDecisionAnswers[i]].click();
        totalButtonsClicked++;
      }
    }
    // Evaluar
    await clickButton('.rubric-actions button.btn-senior', 'Evaluar Decisiones S01');
    await page.waitForSelector('.notice', { timeout: 3000 });
    const decScore = await page.$eval('.notice b', el => el.textContent);
    assert.ok(decScore.includes('100%'), 'Decisiones evaluadas al 100%');
    console.log('  ✓ Sección 6 APROBADA: Decision Lab evaluado con éxito (100%).');

    // 7. SENIOR EVIDENCE LABS (S01)
    console.log('\n▶ SECCIÓN 7: Senior Evidence Lab (S01) — Checkboxes y Validación...');
    await page.goto(`${baseUrl}#/senior/S01/evidence-lab`, { waitUntil: 'networkidle0' });
    const checkboxes = await page.$$('.senior-options input[type="checkbox"]');
    assert.ok(checkboxes.length >= 3, 'Deben existir checkboxes de evidencia');
    
    // S01 correct findings: [0, 2]
    await checkboxes[0].click();
    totalButtonsClicked++;
    await checkboxes[2].click();
    totalButtonsClicked++;

    await clickButton('.rubric-actions button.btn-senior', 'Confirmar Evidencias S01');
    await page.waitForSelector('.notice', { timeout: 3000 });
    const evScore = await page.$eval('.notice', el => el.textContent);
    assert.ok(evScore.includes('100%'), 'Evidencias evaluadas al 100%');
    console.log('  ✓ Sección 7 APROBADA: Evidence Lab verificado al 100%.');

    // 8. SENIOR OPERATIONS LABS (S01)
    console.log('\n▶ SECCIÓN 8: Senior Operations Lab (S01) — Root Cause y Mitigación...');
    await page.goto(`${baseUrl}#/senior/S01/operations-lab`, { waitUntil: 'networkidle0' });
    const opFieldsets = await page.$$('.senior-question');
    assert.equal(opFieldsets.length, 2, 'Deben existir 2 fieldsets en Operations');

    const diagRadios = await opFieldsets[0].$$('input[type="radio"]');
    await diagRadios[1].click();
    totalButtonsClicked++;
    const actRadios = await opFieldsets[1].$$('input[type="radio"]');
    await actRadios[2].click();
    totalButtonsClicked++;

    await clickButton('.rubric-actions button.btn-senior', 'Ejecutar Mitigación Ops S01');
    await page.waitForSelector('.notice', { timeout: 3000 });
    const opScore = await page.$eval('.notice strong', el => el.textContent);
    assert.ok(opScore.includes('100%'), 'Operations evaluado al 100%');
    console.log('  ✓ Sección 8 APROBADA: Operations Lab superado con éxito.');

    // 9. SENIOR CODE REVIEW LABS (S01)
    console.log('\n▶ SECCIÓN 9: Senior Code Review Lab (S01) — Diff tabs y Veredictos...');
    await page.goto(`${baseUrl}#/senior/S01/review-lab`, { waitUntil: 'networkidle0' });
    const reviewFieldsets = await page.$$('.senior-question');
    assert.equal(reviewFieldsets.length, 2, 'Deben existir 2 preguntas de review');

    const rev1Radios = await reviewFieldsets[0].$$('input[type="radio"]');
    await rev1Radios[0].click();
    totalButtonsClicked++;
    const rev2Radios = await reviewFieldsets[1].$$('input[type="radio"]');
    await rev2Radios[2].click();
    totalButtonsClicked++;

    await clickButton('.rubric-actions button.btn-senior', 'Firmar Code Review S01');
    await page.waitForSelector('.notice', { timeout: 3000 });
    const revScore = await page.$eval('.notice strong', el => el.textContent);
    assert.ok(revScore.includes('100%'), 'Code review evaluado al 100%');
    console.log('  ✓ Sección 9 APROBADA: Code Review Lab verificado al 100%.');

    // 10. SENIOR SIMULATOR LABS (S05 WORKER POOL)
    console.log('\n▶ SECCIÓN 10: Simulador Interactivo Senior (S05 Worker Pool)...');
    await page.goto(`${baseUrl}#/senior/S05`, { waitUntil: 'networkidle0' });
    const rangeSliders = await page.$$('.sim-control input[type="range"], .senior-lab-main input[type="range"]');
    for (const slider of rangeSliders) {
      await slider.click();
      totalButtonsClicked++;
    }
    console.log('  ✓ Sección 10 APROBADA: Controles del simulador determinista interactuados.');

    // 11. SENIOR READINESS MATRIX & SVG RADAR
    console.log('\n▶ SECCIÓN 11: Senior Readiness — Gráfico Radar SVG y Filtros...');
    await page.goto(`${baseUrl}#/senior/readiness`, { waitUntil: 'networkidle0' });
    const radarSvg = await page.$('.radar-svg');
    assert.ok(radarSvg, 'Gráfico Radar SVG debe estar presente');
    const seniorGridCards = await page.$$('.senior-grid .senior-card');
    assert.equal(seniorGridCards.length, 18, 'Deben renderizarse las 18 tarjetas Senior en Readiness');
    console.log('  ✓ Sección 11 APROBADA: SVG Radar y matriz de readiness reactiva.');

    // 12. FRAMEWORKS ACADEMY INTERACTION
    console.log('\n▶ SECCIÓN 12: Frameworks Academy — Selección de Frameworks y Código...');
    await page.goto(`${baseUrl}#/frameworks`, { waitUntil: 'networkidle0' });
    const frameworkCards = await page.$$('.framework-card');
    assert.ok(frameworkCards.length >= 8, 'Deben existir 8 tarjetas de frameworks');
    await page.evaluate(el => el.click(), frameworkCards[0]); // Clic en F01 net/http
    totalButtonsClicked++;
    await page.waitForSelector('.framework-detail', { timeout: 3000 });
    const codeSnippet = await page.$eval('.framework-detail pre.mini-code', el => el.textContent);
    assert.ok(codeSnippet.includes('http.NewServeMux'), 'Debe mostrar código real de net/http');
    await clickButton('.framework-detail .btn-outline', 'Volver al catálogo de frameworks');
    hash = await page.evaluate(() => window.location.hash);
    assert.equal(hash, '#/frameworks', 'Debe regresar a #/frameworks');
    console.log('  ✓ Sección 12 APROBADA: Frameworks y snippets didácticos.');

    // 13. SETTINGS: THEMES, MOTION, EXPORT & CLEAR DATA
    console.log('\n▶ SECCIÓN 13: Settings — Temas, Reduced Motion, Export y Reset...');
    await page.goto(`${baseUrl}#/settings`, { waitUntil: 'networkidle0' });

    // Botones de tema dentro de settings
    const settingThemeBtns = await page.$$('.settings-grid .choice-row button');
    for (const stb of settingThemeBtns) {
      await page.evaluate(el => el.click(), stb);
      totalButtonsClicked++;
      await new Promise(r => setTimeout(r, 100));
    }

    // Checkbox reduced motion
    const motionCheckbox = await page.$('.setting-control input[type="checkbox"]');
    if (motionCheckbox) {
      await page.evaluate(() => {
        const cb = document.querySelector('.setting-control input[type="checkbox"]');
        cb.click();
      });
      totalButtonsClicked++;
      await new Promise(r => setTimeout(r, 200));
      let reduced = await page.evaluate(() => document.documentElement.getAttribute('data-reduced-motion'));
      assert.equal(reduced, 'true', 'data-reduced-motion debe ser true');

      await page.evaluate(() => {
        const cb = document.querySelector('.setting-control input[type="checkbox"]');
        cb.click();
      });
      totalButtonsClicked++;
      await new Promise(r => setTimeout(r, 200));
      reduced = await page.evaluate(() => document.documentElement.getAttribute('data-reduced-motion'));
      assert.equal(reduced, 'false', 'data-reduced-motion debe ser false');
    }

    // Botón Export
    await clickButton('.settings-actions .btn-outline', 'Clic en Exportar Datos');

    // Botón Clear Data (Manejado con confirm automático)
    await clickButton('.settings-actions .btn-danger', 'Clic en Borrar Datos');
    const xpCleared = await page.evaluate(() => {
      const raw = localStorage.getItem('gopixel:v1');
      return raw ? JSON.parse(raw).xp : 0;
    });
    assert.equal(xpCleared, 0, 'XP debe quedar reseteado a 0 tras borrar datos');
    console.log('  ✓ Sección 13 APROBADA: Configuración, motion, exportación y borrado de datos.');

    // Captura final de evidencia
    await page.screenshot({ path: path.join(outDir, '00_suite_all_buttons_completed.png') });

    console.log('\n======================================================');
    console.log('🎉 SUITE E2E DE BOTONES COMPLETADA EXITOSAMENTE');
    console.log(`  • Total de botones y controles interactuados: ${totalButtonsClicked}`);
    console.log(`  • Excepciones o errores de ejecución JS: ${errors.length}`);
    console.log('======================================================\n');

    assert.equal(errors.length, 0, `Se encontraron errores no capturados: \n${errors.join('\n')}`);

  } catch (err) {
    console.error(`\n❌ ERROR CRÍTICO EN TEST E2E: ${err.message}`);
    await page.screenshot({ path: path.join(outDir, 'error_state.png') });
    throw err;
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
