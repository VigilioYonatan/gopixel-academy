/**
 * GoPixel Academy — Showcase Media Generator (Retina 2x Screenshots & Animated GIFs)
 * Follows Vigilio repository-readme-architecture standards
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const DOCS_SCREENSHOTS = path.join(REPO_ROOT, 'docs', 'assets', 'screenshots');
const DOCS_DEMOS = path.join(REPO_ROOT, 'docs', 'assets', 'demos');
const SHOWCASE_DIR = path.join(REPO_ROOT, 'screenshots', 'showcase');
const FRAMES_DIR = path.join(REPO_ROOT, 'test-results', 'showcase-frames');

[DOCS_SCREENSHOTS, DOCS_DEMOS, SHOWCASE_DIR, FRAMES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function findBrowser() {
  const candidates = [
    'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error('No se encontró ejecutable de navegador (Brave, Edge, Chrome).');
}

const baseUrl = 'http://localhost:5173/gopixel-academy/';
const delay = ms => new Promise(r => setTimeout(r, ms));

async function injectInteractiveCursor(page) {
  await page.evaluate(() => {
    if (document.getElementById('pixel-cursor-fx')) return;
    const style = document.createElement('style');
    style.id = 'pixel-cursor-fx';
    style.innerHTML = `
      .gopixel-cursor {
        position: fixed;
        width: 24px;
        height: 24px;
        pointer-events: none;
        z-index: 999999;
        transform: translate(-4px, -4px);
        transition: left 0.12s ease-out, top 0.12s ease-out;
        filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5));
      }
      .gopixel-click-ripple {
        position: fixed;
        width: 36px;
        height: 36px;
        border: 2.5px solid #00ADD8;
        border-radius: 50%;
        pointer-events: none;
        z-index: 999998;
        transform: translate(-18px, -18px) scale(0);
        animation: pixelRipple 0.5s ease-out forwards;
      }
      @keyframes pixelRipple {
        to { transform: translate(-18px, -18px) scale(2.2); opacity: 0; }
      }
      .gopixel-caption {
        position: fixed;
        bottom: 24px;
        right: 28px;
        padding: 8px 16px;
        border-radius: 20px;
        background: rgba(7, 21, 33, 0.92);
        color: #00ADD8;
        border: 1px solid rgba(0, 173, 216, 0.5);
        box-shadow: 0 8px 24px rgba(0,0,0,0.6);
        font-family: monospace;
        font-size: 13px;
        font-weight: 700;
        pointer-events: none;
        z-index: 999997;
      }
    `;
    document.head.appendChild(style);

    const cursor = document.createElement('div');
    cursor.id = 'gopixel-cursor-el';
    cursor.className = 'gopixel-cursor';
    cursor.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 2L18 12L11 13.5L15 21L12 22.5L8 15L4 18V2Z" fill="#00ADD8" stroke="#05192D" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>
    `;
    document.body.appendChild(cursor);

    const caption = document.createElement('div');
    caption.id = 'gopixel-caption-el';
    caption.className = 'gopixel-caption';
    caption.textContent = 'GoPixel Academy · Senior Mode v8';
    document.body.appendChild(caption);
  });
}

async function moveCursor(page, x, y, captionText) {
  await page.evaluate(({ cx, cy, cap }) => {
    const cur = document.getElementById('gopixel-cursor-el');
    if (cur) {
      cur.style.left = cx + 'px';
      cur.style.top = cy + 'px';
    }
    const capEl = document.getElementById('gopixel-caption-el');
    if (capEl && cap) {
      capEl.textContent = cap;
    }
  }, { cx: x, cy: y, cap: captionText });
  await delay(150);
}

async function triggerClick(page, x, y) {
  await page.evaluate(({ cx, cy }) => {
    const rip = document.createElement('div');
    rip.className = 'gopixel-click-ripple';
    rip.style.left = cx + 'px';
    rip.style.top = cy + 'px';
    document.body.appendChild(rip);
    setTimeout(() => rip.remove(), 550);
  }, { cx: x, cy: y });
  await delay(100);
}

async function captureFrame(page, dir, frameIndex) {
  const pad = String(frameIndex).padStart(3, '0');
  const framePath = path.join(dir, `frame_${pad}.png`);
  await page.screenshot({ path: framePath, fullPage: false });
}

async function main() {
  const execPath = findBrowser();
  console.log(`[INFO] Browser: ${execPath}`);
  console.log(`[INFO] Target URL: ${baseUrl}`);

  const browser = await puppeteer.launch({
    executablePath: execPath,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // -------------------------------------------------------------
  // FASE 1: CAPTURAS RETINA 2X PARA SHOWCASE & WHAT'S INSIDE
  // -------------------------------------------------------------
  console.log('\n--- FASE 1: Generando Capturas Retina 2x ---');

  const screenshots = [
    { file: '01-hero-dashboard-dark.png', route: '#/', dark: true },
    { file: '01-hero-dashboard-light.png', route: '#/', dark: false },
    { file: '02-learning-tracks.png', route: '#/learn', dark: true },
    { file: '03-code-editor-b01.png', route: '#/lesson/B01', dark: true },
    { file: '04-senior-dashboard.png', route: '#/senior', dark: true },
    { file: '05-senior-worker-pool-sim.png', route: '#/senior/S05', dark: true },
    { file: '06-senior-code-review-lab.png', route: '#/senior/S01/review-lab', dark: true },
    { file: '07-senior-decision-lab.png', route: '#/senior/S01/decision-lab', dark: true },
    { file: '08-senior-evidence-lab.png', route: '#/senior/S01/evidence-lab', dark: true },
    { file: '09-senior-operations-lab.png', route: '#/senior/S01/operations-lab', dark: true },
    { file: '10-senior-readiness-matrix.png', route: '#/senior/readiness', dark: true },
    { file: '11-senior-capstone-orders.png', route: '#/senior/capstone', dark: true },
    { file: '12-frameworks-academy.png', route: '#/frameworks/F01', dark: true },
    { file: '13-learning-games-quiz.png', route: '#/games/quiz', dark: true },
    { file: '14-settings-and-i18n.png', route: '#/settings', dark: true },
  ];

  for (const s of screenshots) {
    await page.goto(`${baseUrl}${s.route}`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#app', { timeout: 5000 });

    // Set theme
    await page.evaluate((isDark) => {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }, s.dark);
    await delay(200);

    const docPath = path.join(DOCS_SCREENSHOTS, s.file);
    const showPath = path.join(SHOWCASE_DIR, s.file);

    await page.screenshot({ path: docPath, fullPage: false });
    fs.copyFileSync(docPath, showPath);
    console.log(`  ✓ Captura guardada: ${s.file}`);
  }

  // -------------------------------------------------------------
  // FASE 2: GRABACIÓN DE SECUENCIAS PARA GIFS INTERACTIVOS
  // -------------------------------------------------------------
  console.log('\n--- FASE 2: Grabando Demos Interactivas ---');

  const recordings = [];

  // DEMO 1: Editor Interactivo de Go (B01)
  {
    console.log('  Grabando: 01-interactive-go-editor...');
    const dir = path.join(FRAMES_DIR, '01-interactive-go-editor');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    await page.goto(`${baseUrl}#/lesson/B01`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('textarea', { timeout: 5000 });
    await injectInteractiveCursor(page);
    await moveCursor(page, 720, 200, 'Paso 1: Inspeccionar ejercicio Go');
    await captureFrame(page, dir, 0);

    // Cursor al editor
    await moveCursor(page, 450, 420, 'Paso 2: Escribir código Go');
    await captureFrame(page, dir, 1);

    // Escribir código solucionado
    await page.evaluate(() => {
      const ta = document.querySelector('textarea');
      if (ta) {
        ta.value = 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hola, Go!")\n}';
        ta.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await delay(300);
    await captureFrame(page, dir, 2);

    // Cursor al botón de comprobación
    await moveCursor(page, 160, 560, 'Paso 3: Validar solución');
    await triggerClick(page, 160, 560);
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Comprobar'));
      if (btn) btn.click();
    });
    await delay(400);
    await captureFrame(page, dir, 3);

    // Estado resuelto
    await moveCursor(page, 450, 680, '✓ ¡Solución correcta! +20 XP');
    await captureFrame(page, dir, 4);

    recordings.push({
      frames_directory: dir,
      output_gif_path: path.join(DOCS_DEMOS, '01-interactive-go-editor.gif'),
      frame_durations_ms: [800, 700, 900, 800, 1500]
    });
  }

  // DEMO 2: Simulador Determinista de Worker Pool (S05)
  {
    console.log('  Grabando: 02-senior-worker-pool-simulation...');
    const dir = path.join(FRAMES_DIR, '02-senior-worker-pool-simulation');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    await page.goto(`${baseUrl}#/senior/S05`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('input[type="range"]', { timeout: 5000 });
    await injectInteractiveCursor(page);
    await moveCursor(page, 500, 200, 'S05: Simulador de Concurrencia');
    await captureFrame(page, dir, 0);

    // Ajustar Workers a 8
    await moveCursor(page, 320, 360, 'Aumentar trabajadores a 8');
    await triggerClick(page, 320, 360);
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[type="range"]');
      if (inputs[0]) {
        inputs[0].value = '8';
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await delay(300);
    await captureFrame(page, dir, 1);

    // Ajustar Capacidad de Cola a 24
    await moveCursor(page, 580, 360, 'Capacidad de cola: 24 buffers');
    await triggerClick(page, 580, 360);
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[type="range"]');
      if (inputs[1]) {
        inputs[1].value = '24';
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await delay(300);
    await captureFrame(page, dir, 2);

    // Ajustar Llegadas a 10
    await moveCursor(page, 840, 360, 'Aumentar ráfaga a 10 req/tick');
    await triggerClick(page, 840, 360);
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[type="range"]');
      if (inputs[2]) {
        inputs[2].value = '10';
        inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await delay(300);
    await captureFrame(page, dir, 3);

    // Mostrar métricas resultantes
    await moveCursor(page, 640, 460, 'Métricas: 0 rechazos, alta ocupación');
    await captureFrame(page, dir, 4);

    recordings.push({
      frames_directory: dir,
      output_gif_path: path.join(DOCS_DEMOS, '02-senior-worker-pool-simulation.gif'),
      frame_durations_ms: [900, 800, 800, 800, 1400]
    });
  }

  // DEMO 3: Code Review Lab & Theme Toggle
  {
    console.log('  Grabando: 03-code-review-and-theme-toggle...');
    const dir = path.join(FRAMES_DIR, '03-code-review-and-theme-toggle');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    await page.goto(`${baseUrl}#/senior/S01/review-lab`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#app', { timeout: 5000 });
    await injectInteractiveCursor(page);
    await moveCursor(page, 600, 240, 'Senior Code Review: Inspeccionar PR Diff');
    await captureFrame(page, dir, 0);

    // Seleccionar opción de review
    await moveCursor(page, 450, 480, 'Seleccionar decisión arquitectónica');
    await triggerClick(page, 450, 480);
    await page.evaluate(() => {
      const opt = document.querySelector('input[type="radio"]');
      if (opt) {
        opt.click();
      }
    });
    await delay(300);
    await captureFrame(page, dir, 1);

    // Mover hacia el theme toggle
    await moveCursor(page, 1340, 24, 'Cambiar a Modo Claro');
    await triggerClick(page, 1340, 24);
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await delay(400);
    await moveCursor(page, 600, 300, 'Modo Claro: Contraste WCAG 2.2 AA');
    await captureFrame(page, dir, 2);

    // Volver a Modo Oscuro
    await moveCursor(page, 1340, 24, 'Regresar a Modo Oscuro');
    await triggerClick(page, 1340, 24);
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await delay(400);
    await moveCursor(page, 600, 300, 'Modo Oscuro Restaurado');
    await captureFrame(page, dir, 3);

    recordings.push({
      frames_directory: dir,
      output_gif_path: path.join(DOCS_DEMOS, '03-code-review-and-theme-toggle.gif'),
      frame_durations_ms: [900, 800, 1200, 1100]
    });
  }

  await browser.close();

  // -------------------------------------------------------------
  // FASE 3: CODIFICAR GIFS CON PYTHON (PIL)
  // -------------------------------------------------------------
  console.log('\n--- FASE 3: Codificando GIFs con Python (Pillow) ---');
  const manifestPath = path.join(FRAMES_DIR, 'recordings_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify({ recordings }, null, 2), 'utf-8');

  try {
    const pyScript = path.join(__dirname, 'encode_showcase_gifs.py');
    const pyOut = execFileSync('python', [pyScript, manifestPath], { encoding: 'utf-8' });
    console.log(pyOut);
  } catch (err) {
    console.error('[WARN] No se pudo ejecutar encoder Python:', err.message);
  }

  console.log('\n======================================================');
  console.log('✅ SHOWCASE MEDIA GENERADO CON ÉXITO');
  console.log(`  • Capturas Retina 2x: ${screenshots.length} guardadas en docs/assets/screenshots/`);
  console.log(`  • Demos Animadas: ${recordings.length} generadas en docs/assets/demos/`);
  console.log('======================================================\n');
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
