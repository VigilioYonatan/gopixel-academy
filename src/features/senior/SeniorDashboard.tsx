import curriculum from '../../data/curriculum.json';

type Locale = 'es' | 'en' | 'ja' | 'zh' | 'pt' | 'fr';

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

      <div class="senior-grid">
        {seniors.map(x => {
          const passCount = [
            seniorResults[x.id]?.passed,
            evidenceResults[x.id]?.passed,
            investigationResults[x.id]?.passed,
            operationsResults[x.id]?.passed,
            reviewResults[x.id]?.passed,
          ].filter(Boolean).length;

          const badgeText = passCount > 0 ? `${passCount}/5 ✓` : (seniorResults[x.id] ? `${seniorResults[x.id].score}%` : t.newBadge);

          return (
            <a class="senior-card" key={x.id} href={`#/senior/${x.id}`}>
              <div class="senior-card-top">
                <img class="pixel-icon" src={asset('icons/crown.svg')} width={20} height={20} alt="" aria-hidden="true" />
                <span>{x.id}</span>
                <span class="senior-kind">{badgeText}</span>
              </div>
              <h3>{x.title[locale]}</h3>
              <p>{x.challenge?.scenario[locale]}</p>
              <span class="text-link">{t.viewModule} ↗</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
