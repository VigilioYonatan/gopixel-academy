import { useState } from 'preact/hooks';
import curriculum from '../../data/curriculum.json';

type Locale = 'es' | 'en' | 'ja' | 'zh' | 'pt' | 'fr';
type SeniorCategory = 'all' | 'concurrency' | 'resilience' | 'performance' | 'architecture' | 'operations';
type StatusFilter = 'all' | 'completed' | 'progress' | 'idle';

const statusLabels: Record<StatusFilter, Record<Locale, string>> = {
  all: { es: 'Todos', en: 'All', ja: 'すべて', zh: '全部', pt: 'Todos', fr: 'Tous' },
  completed: { es: 'Completados', en: 'Completed', ja: '完了', zh: '已完成', pt: 'Concluídos', fr: 'Complétés' },
  progress: { es: 'En progreso', en: 'In progress', ja: '進行中', zh: '进行中', pt: 'Em progresso', fr: 'En cours' },
  idle: { es: 'Sin iniciar', en: 'Not started', ja: '未着手', zh: '未开始', pt: 'Não iniciado', fr: 'Non commencé' },
};

const moduleCategories: Record<string, SeniorCategory> = {
  S01: 'concurrency',
  S02: 'concurrency',
  S03: 'resilience',
  S04: 'performance',
  S05: 'resilience',
  S06: 'concurrency',
  S07: 'performance',
  S08: 'architecture',
  S09: 'concurrency',
  S10: 'resilience',
  S11: 'operations',
  S12: 'operations',
  S13: 'architecture',
  S14: 'performance',
  S15: 'operations',
  S16: 'performance',
  S17: 'operations',
  S18: 'architecture',
};

const categoryLabels: Record<SeniorCategory, Record<Locale, string>> = {
  all: {
    es: 'Todos',
    en: 'All',
    ja: 'すべて',
    zh: '全部',
    pt: 'Todos',
    fr: 'Tous',
  },
  concurrency: {
    es: 'Concurrencia & Memoria',
    en: 'Concurrency & Memory',
    ja: '並行処理 & メモリ',
    zh: '并发与内存',
    pt: 'Concorrência & Memória',
    fr: 'Concurrence & Mémoire',
  },
  resilience: {
    es: 'Fiabilidad & APIs',
    en: 'Resilience & APIs',
    ja: '信頼性 & API',
    zh: '韧性与 API',
    pt: 'Confiabilidade & APIs',
    fr: 'Résilience & APIs',
  },
  performance: {
    es: 'Rendimiento & Profiling',
    en: 'Performance & Profiling',
    ja: '性能 & プロファイリング',
    zh: '性能与调优',
    pt: 'Desempenho & Profiling',
    fr: 'Performance & Profilage',
  },
  architecture: {
    es: 'Arquitectura & Dominio',
    en: 'Architecture & Domain',
    ja: 'アーキテクチャ & ドメイン',
    zh: '架构与领域',
    pt: 'Arquitetura & Domínio',
    fr: 'Architecture & Domaine',
  },
  operations: {
    es: 'Operaciones & Seguridad',
    en: 'Operations & Security',
    ja: '運用 & セキュリティ',
    zh: '运维与安全',
    pt: 'Operações & Segurança',
    fr: 'Opérations & Sécurité',
  },
};

type SeniorDashboardProps = {
  locale: Locale;
  seniorResults: Record<string, { score: number; passed: boolean }>;
  evidenceResults: Record<string, { score: number; passed: boolean }>;
  investigationResults: Record<string, { score: number; passed: boolean }>;
  operationsResults: Record<string, { score: number; passed: boolean }>;
  reviewResults: Record<string, { score: number; passed: boolean }>;
};

const labels: Record<Locale, {
  eyebrow: string;
  title: string;
  subtitle: string;
  statScenarios: string;
  statQuestions: string;
  statEvidence: string;
  statInvestigations: string;
  statOperations: string;
  statReviews: string;
  statSimulators: string;
  statNative: string;
  statCompleted: string;
  nativeBtn: string;
  readinessBtn: string;
  capstoneBtn: string;
  notice: string;
  viewModule: string;
  newBadge: string;
}> = {
  es: {
    eyebrow: '✦ SENIOR ENGINEERING LAB',
    title: 'Senior Mode',
    subtitle: 'Arquitectura, concurrencia, resiliencia y fiabilidad de sistemas backend en Go.',
    statScenarios: '18 ESCENARIOS',
    statQuestions: '54 PREGUNTAS TÉCNICAS',
    statEvidence: '18 LABS DE EVIDENCIAS',
    statInvestigations: '18 INVESTIGACIONES',
    statOperations: '18 LABS OPERATIVOS',
    statReviews: '18 CODE REVIEWS',
    statSimulators: '6 SIMULADORES',
    statNative: '18 LABS GO NATIVOS',
    statCompleted: 'ACTIVIDADES COMPLETADAS',
    nativeBtn: 'Go real · 18 laboratorios ↓',
    readinessBtn: 'Mapa de competencias →',
    capstoneBtn: 'Capstone Go real →',
    notice: 'Evaluación técnica objetiva y determinista. No compila Go en el navegador ni certifica capacidad profesional.',
    viewModule: 'Ver módulo',
    newBadge: 'NUEVO',
  },
  en: {
    eyebrow: '✦ SENIOR ENGINEERING LAB',
    title: 'Senior Mode',
    subtitle: 'Architecture, concurrency, resilience, and reliability for Go backend systems.',
    statScenarios: '18 SCENARIOS',
    statQuestions: '54 TECHNICAL QUESTIONS',
    statEvidence: '18 EVIDENCE LABS',
    statInvestigations: '18 INVESTIGATIONS',
    statOperations: '18 OPERATIONS LABS',
    statReviews: '18 CODE REVIEWS',
    statSimulators: '6 SIMULATORS',
    statNative: '18 NATIVE GO LABS',
    statCompleted: 'COMPLETED ACTIVITIES',
    nativeBtn: 'Native Go · 18 labs ↓',
    readinessBtn: 'Competency map →',
    capstoneBtn: 'Native Go capstone →',
    notice: 'Objective and deterministic assessment. Does not compile Go inside the browser or certify professional skill.',
    viewModule: 'View module',
    newBadge: 'NEW',
  },
  ja: {
    eyebrow: '✦ シニアエンジニアリングラボ',
    title: 'Senior Mode',
    subtitle: 'Go バックエンドシステムのアーキテクチャ、並行処理、回復性、信頼性。',
    statScenarios: '18のシナリオ',
    statQuestions: '54の技術設問',
    statEvidence: '18の証拠ラボ',
    statInvestigations: '18の調査ラボ',
    statOperations: '18の運用ラボ',
    statReviews: '18のコードレビュー',
    statSimulators: '6のシミュレーター',
    statNative: '18のネイティブラボ',
    statCompleted: '完了した活動',
    nativeBtn: 'リアル Go · 18ラボ ↓',
    readinessBtn: 'スキルマップ →',
    capstoneBtn: 'キャップストーン →',
    notice: '客観的かつ決定論的な教育評価です。ブラウザ上でGoをコンパイルするものではなく、資格認定でもありません。',
    viewModule: 'モジュールを見る',
    newBadge: '新規',
  },
  zh: {
    eyebrow: '✦ 高级工程实验室',
    title: 'Senior Mode',
    subtitle: 'Go 后端系统的架构设计、并发模型、韧性与可靠性工程。',
    statScenarios: '18 个生产场景',
    statQuestions: '54 道技术问题',
    statEvidence: '18 个证据实验室',
    statInvestigations: '18 个调查分析',
    statOperations: '18 个运维实验室',
    statReviews: '18 个代码审查',
    statSimulators: '6 个交互模拟器',
    statNative: '18 个原生实验',
    statCompleted: '已完成活动',
    nativeBtn: '真实 Go · 18 原生实验 ↓',
    readinessBtn: '能力地图 →',
    capstoneBtn: 'Go 毕业设计项目 →',
    notice: '客观确定性技术评估。不在浏览器中编译 Go 代码，亦不代表专业资质认证。',
    viewModule: '查看模块',
    newBadge: '未完成',
  },
  pt: {
    eyebrow: '✦ SENIOR ENGINEERING LAB',
    title: 'Senior Mode',
    subtitle: 'Arquitetura, concorrência, resiliência e confiabilidade de sistemas Go.',
    statScenarios: '18 CENÁRIOS',
    statQuestions: '54 QUESTÕES TÉCNICAS',
    statEvidence: '18 LABS DE EVIDÊNCIAS',
    statInvestigations: '18 INVESTIGAÇÕES',
    statOperations: '18 LABS OPERACIONAIS',
    statReviews: '18 CODE REVIEWS',
    statSimulators: '6 SIMULADORES',
    statNative: '18 LABS GO NATIVOS',
    statCompleted: 'ATIVIDADES COMPLETAS',
    nativeBtn: 'Go real · 18 laboratórios ↓',
    readinessBtn: 'Mapa de competências →',
    capstoneBtn: 'Capstone Go real →',
    notice: 'Avaliação técnica objetiva e determinística. Não compila Go no navegador nem certifica capacidade profissional.',
    viewModule: 'Ver módulo',
    newBadge: 'NOVO',
  },
  fr: {
    eyebrow: '✦ LABORATOIRE INGÉNIERIE SENIOR',
    title: 'Senior Mode',
    subtitle: 'Architecture, concurrence, résilience et fiabilité des systèmes backend en Go.',
    statScenarios: '18 SCÉNARIOS',
    statQuestions: '54 QUESTIONS TECHNIQUES',
    statEvidence: '18 LABS DE PREUVES',
    statInvestigations: '18 INVESTIGATIONS',
    statOperations: '18 LABS OPÉRATIONNELS',
    statReviews: '18 REVUES DE CODE',
    statSimulators: '6 SIMULATEURS',
    statNative: '18 LABS GO NATIFS',
    statCompleted: 'ACTIVITÉS COMPLÉTÉES',
    nativeBtn: 'Go natif · 18 laboratoires ↓',
    readinessBtn: 'Carte des compétences →',
    capstoneBtn: 'Projet Capstone Go →',
    notice: 'Évaluation technique objective et déterministe. Ne compile pas Go dans le navigateur et ne certifie pas de compétences professionnelles.',
    viewModule: 'Voir le module',
    newBadge: 'NOUVEAU',
  },
};

const asset = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`;

export function SeniorDashboard({
  locale,
  seniorResults,
  evidenceResults,
  investigationResults,
  operationsResults,
  reviewResults,
}: SeniorDashboardProps) {
  const t = labels[locale] || labels.es;
  const seniors = curriculum.filter(m => m.track === 'senior');
  const [activeCategory, setActiveCategory] = useState<SeniorCategory>('all');
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('all');

  const categories: SeniorCategory[] = ['all', 'concurrency', 'resilience', 'performance', 'architecture', 'operations'];
  const statusFilters: StatusFilter[] = ['all', 'completed', 'progress', 'idle'];

  const getPassCount = (id: string) => [
    seniorResults[id]?.passed,
    evidenceResults[id]?.passed,
    investigationResults[id]?.passed,
    operationsResults[id]?.passed,
    reviewResults[id]?.passed,
  ].filter(Boolean).length;

  const filteredSeniors = seniors.filter(s => {
    const categoryMatches = activeCategory === 'all' || moduleCategories[s.id] === activeCategory;
    const count = getPassCount(s.id);
    const statusMatches =
      activeStatus === 'all' ||
      (activeStatus === 'completed' && count === 5) ||
      (activeStatus === 'progress' && count > 0 && count < 5) ||
      (activeStatus === 'idle' && count === 0);
    return categoryMatches && statusMatches;
  });

  const totalFinished =
    Object.keys(seniorResults).length +
    Object.keys(evidenceResults).length +
    Object.keys(investigationResults).length +
    Object.keys(operationsResults).length +
    Object.keys(reviewResults).length;

  return (
    <div class="content-page senior-dashboard-view">
      <div class="senior-hero">
        <div>
          <span class="eyebrow">{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
          <div class="senior-stats">
            <span>{t.statScenarios}</span>
            <span>{t.statQuestions}</span>
            <span>{t.statEvidence}</span>
            <span>{t.statInvestigations}</span>
            <span>{t.statOperations}</span>
            <span>{t.statReviews}</span>
            <span>{t.statSimulators}</span>
            <span>{t.statNative}</span>
            <span>{totalFinished}/90 {t.statCompleted}</span>
          </div>
        </div>
        <img class="gopher" src={asset('gophers/senior.png')} alt="" aria-hidden="true" />
      </div>

      <div class="native-links">
        <a class="btn btn-senior" href="#/senior/native">{t.nativeBtn}</a>
        <a class="btn btn-outline" href="#/senior/readiness">{t.readinessBtn}</a>
        <a class="btn btn-senior" href="#/senior/capstone">{t.capstoneBtn}</a>
      </div>

      <div class="notice" role="status">{t.notice}</div>

      <div class="senior-filter-container">
        {/* Status Filter Tabs (Image 2 style) */}
        <div class="senior-status-tabs" role="tablist" aria-label="Filtro por estado">
          {statusFilters.map(st => {
            const count = st === 'all'
              ? seniors.length
              : st === 'completed'
              ? seniors.filter(s => getPassCount(s.id) === 5).length
              : st === 'progress'
              ? seniors.filter(s => { const c = getPassCount(s.id); return c > 0 && c < 5; }).length
              : seniors.filter(s => getPassCount(s.id) === 0).length;
            const label = statusLabels[st][locale] || statusLabels[st].es;
            return (
              <button
                key={st}
                type="button"
                role="tab"
                aria-selected={activeStatus === st}
                class={`senior-status-tab ${activeStatus === st ? 'active' : ''}`}
                onClick={() => setActiveStatus(st)}
              >
                <span>{label}</span>
                <span class="filter-count">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Domain Categories */}
        <div class="category-filter-bar" role="tablist" aria-label="Categorías Senior">
          {categories.map(cat => {
            const count = cat === 'all' ? seniors.length : seniors.filter(s => moduleCategories[s.id] === cat).length;
            const label = categoryLabels[cat][locale] || categoryLabels[cat].es;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                class={`category-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span>{label}</span>
                <span class="filter-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div class="senior-grid senior-grid-v2">
        {filteredSeniors.map(x => {
          const passCount = getPassCount(x.id);

          return (
            <a class="senior-card senior-card-v2" key={x.id} href={`#/senior/${x.id}`}>
              <div class="senior-card-badge-row">
                <span class="senior-gate-badge">
                  <b class="gate-id">{x.id}</b>
                  <span class="gate-count">{passCount}/5 {locale === 'es' ? 'gates' : locale === 'en' ? 'gates' : locale === 'ja' ? 'gates' : locale === 'zh' ? '关卡' : locale === 'pt' ? 'gates' : 'gates'}</span>
                </span>
              </div>
              <h3 class="senior-card-title">{x.title[locale]}</h3>
              <p class="senior-card-scenario">{x.challenge?.scenario[locale]}</p>
              <div class="senior-card-action">
                <span class={`status-link ${passCount === 5 ? 'done' : passCount > 0 ? 'progress' : 'idle'}`}>
                  {passCount === 5
                    ? `✓ ${locale === 'es' ? 'Completado' : locale === 'en' ? 'Completed' : locale === 'ja' ? '完了' : locale === 'zh' ? '已完成' : locale === 'pt' ? 'Concluído' : 'Complété'} →`
                    : passCount > 0
                    ? `⏳ ${locale === 'es' ? 'En progreso' : locale === 'en' ? 'In progress' : locale === 'ja' ? '進行中' : locale === 'zh' ? '进行中' : locale === 'pt' ? 'Em progresso' : 'En cours'} (${passCount}/5) →`
                    : `☐ ${locale === 'es' ? 'No iniciado' : locale === 'en' ? 'Not started' : locale === 'ja' ? '未着手' : locale === 'zh' ? '未开始' : locale === 'pt' ? 'Não iniciado' : 'Non commencé'} →`}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
