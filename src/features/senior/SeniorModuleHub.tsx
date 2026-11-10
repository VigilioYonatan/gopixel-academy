import curriculum from '../../data/curriculum.json';
import seniorChallenges from '../../content/senior/challenges.json';
import { SeniorSimulationLab } from './SeniorSimulationLab';

type Locale = 'es' | 'en' | 'ja' | 'zh' | 'pt' | 'fr';

type SeniorModuleHubProps = {
  moduleId: string;
  locale: Locale;
  notes: Record<string, string>;
  updateNote: (id: string, note: string) => void;
  seniorResults: Record<string, { score: number; passed: boolean }>;
  evidenceResults: Record<string, { score: number; passed: boolean }>;
  investigationResults: Record<string, { score: number; passed: boolean }>;
  operationsResults: Record<string, { score: number; passed: boolean }>;
  reviewResults: Record<string, { score: number; passed: boolean }>;
};

const labels: Record<Locale, {
  scenarioTitle: string;
  notice: string;
  btnQuiz: string;
  btnEvidence: string;
  btnInvestigation: string;
  btnOperations: string;
  btnReview: string;
  btnGuide: string;
  btnNative: string;
  outcomesHeading: string;
  adrHeading: string;
  adrLabel: string;
  adrPlaceholder: string;
  adrNotice: string;
  asideTitle: string;
  notEvaluated: string;
  passedBadge: string;
  failedBadge: string;
  viewResult: string;
  nativeCardTitle: string;
  nativeCardDesc: string;
  notFound: string;
  back: string;
}> = {
  es: {
    scenarioTitle: 'Escenario de producción',
    notice: 'Laboratorio de conocimientos: decisiones objetivas, evidencias de incidentes, revisión de código y reflexiones ADR. No compila Go en el navegador.',
    btnQuiz: 'Cuestionario →',
    btnEvidence: 'Laboratorio de evidencias →',
    btnInvestigation: 'Investigación por etapas →',
    btnOperations: 'Laboratorio operativo →',
    btnReview: 'Revisar código Go →',
    btnGuide: 'Estudiar guía técnica →',
    btnNative: 'Práctica Go real (descarga) →',
    outcomesHeading: 'Lo que vas a investigar',
    adrHeading: 'Architecture Decision Record · Reflexión técnica',
    adrLabel: 'Describe alternativas, riesgos y cómo validarías tu solución en producción:',
    adrPlaceholder: 'Contexto del problema, alternativas consideradas, decisión adoptada, trade-offs y plan de verificación...',
    adrNotice: 'Autoguardado local en navegador. Estas notas no se califican automáticamente ni alteran la puntuación.',
    asideTitle: 'Progreso del módulo',
    notEvaluated: 'Pendiente',
    passedBadge: 'Completado (100%)',
    failedBadge: 'Por revisar',
    viewResult: 'Ver resultado ↗',
    nativeCardTitle: 'Laboratorio Go nativo',
    nativeCardDesc: 'Código fuente Go y pruebas unitarias descargables para ejecutar con go test localmente.',
    notFound: 'Módulo Senior no encontrado',
    back: 'Volver a Senior',
  },
  en: {
    scenarioTitle: 'Production Scenario',
    notice: 'Knowledge lab: objective decisions, incident evidence, code review, and ADR notes. Does not compile Go in the browser.',
    btnQuiz: 'Quiz →',
    btnEvidence: 'Evidence Lab →',
    btnInvestigation: 'Step-by-step Investigation →',
    btnOperations: 'Operations Lab →',
    btnReview: 'Revisar código Go →',
    btnGuide: 'Estudiar guía técnica →',
    btnNative: 'Native Go lab (download) →',
    outcomesHeading: 'What you will investigate',
    adrHeading: 'Architecture Decision Record · Technical Reflection',
    adrLabel: 'Describe alternatives, trade-offs, and validation strategy:',
    adrPlaceholder: 'Problem context, considered alternatives, chosen decision, trade-offs, and verification plan...',
    adrNotice: 'Auto-saved locally in browser. ADR notes are unscored and do not change your quiz points.',
    asideTitle: 'Module Progress',
    notEvaluated: 'Pending',
    passedBadge: 'Completed (100%)',
    failedBadge: 'Needs review',
    viewResult: 'View result ↗',
    nativeCardTitle: 'Native Go Lab',
    nativeCardDesc: 'Authentic Go code and test suites to execute locally via go test.',
    notFound: 'Senior module not found',
    back: 'Back to Senior',
  },
  ja: {
    scenarioTitle: '本番環境シナリオ',
    notice: '知識ラボ：客観的な判断、障害証拠、コードレビュー、ADR記録。ブラウザでGoをコンパイルしません。',
    btnQuiz: '設問クイズ →',
    btnEvidence: '証拠分析ラボ →',
    btnInvestigation: '段階的調査 →',
    btnOperations: '運用ラボ →',
    btnReview: 'Revisar código Go →',
    btnGuide: 'Estudiar guía técnica →',
    btnNative: 'リアルGo実習（ダウンロード） →',
    outcomesHeading: '調査・学習のポイント',
    adrHeading: 'アーキテクチャ決定記録 (ADR)',
    adrLabel: '代替案、リスク、本番での検証手順を記述してください：',
    adrPlaceholder: '課題の背景、検討した代替案、決定内容、トレードオフ、検証計画...',
    adrNotice: 'ブラウザに自動保存されます。このノートは自動採点の対象外です。',
    asideTitle: 'モジュールの進捗',
    notEvaluated: '未完了',
    passedBadge: '合格 (100%)',
    failedBadge: '要見直し',
    viewResult: '結果を見る ↗',
    nativeCardTitle: 'ネイティブ Go ラボ',
    nativeCardDesc: 'ローカルで go test を実行するための本物の Go ソースコードとテスト群です。',
    notFound: 'シニアモジュールが見つかりません',
    back: 'Senior に戻る',
  },
  zh: {
    scenarioTitle: '生产场景描述',
    notice: '知识实验室：客观决策、现场证据分析、代码审查与 ADR 架构反思。不直接在浏览器中编译 Go 代码。',
    btnQuiz: '技术决策问答 →',
    btnEvidence: '证据分析实验室 →',
    btnInvestigation: '分步技术调查 →',
    btnOperations: '运维事件处理 →',
    btnReview: 'Revisar código Go →',
    btnGuide: 'Estudiar guía técnica →',
    btnNative: '原生 Go 实验（下载） →',
    outcomesHeading: '核心研究要点',
    adrHeading: '架构决策记录 (ADR) · 深度反思',
    adrLabel: '陈述备选方案、技术权衡及生产验证策略：',
    adrPlaceholder: '问题背景、权衡的备选方案、采纳的决策、trade-offs 及验证方案...',
    adrNotice: '浏览器本地自动保存。ADR 笔记不进行自动机器评分，不影响测试得分。',
    asideTitle: '本模块完成度',
    notEvaluated: '未完成',
    passedBadge: '已通过 (100%)',
    failedBadge: '需复查',
    viewResult: '查看结果 ↗',
    nativeCardTitle: '原生 Go 实验包',
    nativeCardDesc: '包含真实的 Go 源码和自动化测试用例，供在本地环境中通过 go test 运行验证。',
    notFound: '未找到该 Senior 模块',
    back: '返回 Senior 模式',
  },
  pt: {
    scenarioTitle: 'Cenário de produção',
    notice: 'Laboratório de conhecimento: decisões técnicas, análise de incidentes, code review e notas ADR. Sem compilar Go no navegador.',
    btnQuiz: 'Questionário →',
    btnEvidence: 'Laboratório de evidências →',
    btnInvestigation: 'Investigação por etapas →',
    btnOperations: 'Laboratório operacional →',
    btnReview: 'Revisar código Go →',
    btnGuide: 'Estudiar guía técnica →',
    btnNative: 'Prática Go real (download) →',
    outcomesHeading: 'O que você vai investigar',
    adrHeading: 'Architecture Decision Record · Reflexão técnica',
    adrLabel: 'Descreva alternativas, riscos e validação da solução:',
    adrPlaceholder: 'Contexto do problema, alternativas, decisão tomada, trade-offs e plano de testes...',
    adrNotice: 'Salvo localmente no navegador. Notas ADR não alteram a pontuação automática.',
    asideTitle: 'Progresso no módulo',
    notEvaluated: 'Pendente',
    passedBadge: 'Concluído (100%)',
    failedBadge: 'Rever',
    viewResult: 'Ver resultado ↗',
    nativeCardTitle: 'Laboratório Go nativo',
    nativeCardDesc: 'Código Go real e suíte de testes para executar com go test no seu computador.',
    notFound: 'Módulo Senior não encontrado',
    back: 'Voltar ao Senior',
  },
  fr: {
    scenarioTitle: 'Scénario de production',
    notice: 'Laboratoire de compétences : décisions d’architecture, analyse d’incidents, revue de code et notes ADR. Ne compile pas Go dans le navigateur.',
    btnQuiz: 'Quiz de décisions →',
    btnEvidence: 'Laboratoire de preuves →',
    btnInvestigation: 'Investigation par étapes →',
    btnOperations: 'Laboratoire opérationnel →',
    btnReview: 'Revisar código Go →',
    btnGuide: 'Estudiar guía técnica →',
    btnNative: 'Pratique Go réelle (téléchargement) →',
    outcomesHeading: 'Objectifs d’investigation',
    adrHeading: 'Architecture Decision Record · Réflexion technique',
    adrLabel: 'Décrivez les alternatives, compromis et stratégie de validation :',
    adrPlaceholder: 'Contexte du problème, alternatives étudiées, décision retenue, compromis et plan de vérification...',
    adrNotice: 'Enregistrement local automatique. Les notes ADR ne modifient pas la note chiffrée.',
    asideTitle: 'Progression du module',
    notEvaluated: 'En attente',
    passedBadge: 'Validé (100%)',
    failedBadge: 'À revoir',
    viewResult: 'Voir le résultat ↗',
    nativeCardTitle: 'Laboratoire Go natif',
    nativeCardDesc: 'Code source Go et tests automatisés à exécuter en local avec go test.',
    notFound: 'Module Senior introuvable',
    back: 'Retour à Senior',
  },
};

const asset = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`;

export function SeniorModuleHub({
  moduleId,
  locale,
  notes,
  updateNote,
  seniorResults,
  evidenceResults,
  investigationResults,
  operationsResults,
  reviewResults,
}: SeniorModuleHubProps) {
  const t = labels[locale] || labels.es;
  const m = curriculum.find(x => x.id === moduleId && x.track === 'senior');
  const ch = seniorChallenges.find(c => c.moduleId === moduleId);

  if (!m || !ch) {
    return (
      <div class="content-page" role="alert">
        <h2>{t.notFound}</h2>
        <a class="text-link" href="#/senior">{t.back}</a>
      </div>
    );
  }

  const note = notes[moduleId] || '';
  const hasSimulator = ['S05', 'S07', 'S09', 'S10', 'S11', 'S18'].includes(moduleId);

  return (
    <div class="content-page senior-module-hub">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="#/senior">Senior</a>
        <span>/</span>
        <b>{m.id}</b>
      </nav>

      <div class="page-heading">
        <span class="eyebrow small">SENIOR · {m.id}</span>
        <h1>{m.title[locale]}</h1>
        <p>{m.challenge?.kind.toUpperCase()}</p>
      </div>

      <div class="senior-lab-grid">
        <div class="senior-lab-main">
          {/* Production Scenario Card */}
          <section class="card">
            <div class="panel-title">
              <img class="pixel-icon" src={asset('icons/crown.svg')} width={20} height={20} alt="" aria-hidden="true" />
              <b>{t.scenarioTitle}</b>
            </div>
            <p class="brief-lead">{m.challenge?.scenario[locale]}</p>
            <div class="notice" role="note">{t.notice}</div>

            {/* Activities Action Bar */}
            <div class="hero-ctas" style={{ marginTop: '20px' }}>
              <a class="btn btn-senior" href={`#/senior/${moduleId}/decision-lab`}>
                {t.btnQuiz}
              </a>
              <a class="btn btn-outline" href={`#/senior/${moduleId}/evidence-lab`}>
                {t.btnEvidence}
              </a>
              <a class="btn btn-senior" href={`#/senior/${moduleId}/investigation-lab`}>
                {t.btnInvestigation}
              </a>
              <a class="btn btn-outline" href={`#/senior/${moduleId}/operations-lab`}>
                {t.btnOperations}
              </a>
              <a class="btn btn-outline" href={`#/senior/${moduleId}/review-lab`}>
                Revisar código Go →
              </a>
              <a class="btn btn-senior" href={`#/senior/${moduleId}/guide`}>
                Estudiar guía técnica →
              </a>
              <a class="btn btn-senior" href={`#/senior/${moduleId}/native`}>
                {t.btnNative}
              </a>
            </div>
          </section>

          {/* Interactive Deterministic Simulator (S05, S07, S09, S10, S11, S18) */}
          {hasSimulator && (
            <SeniorSimulationLab moduleId={moduleId} locale={locale} />
          )}

          {/* Learning Outcomes */}
          <section class="card">
            <h3>{t.outcomesHeading}</h3>
            <ol class="senior-outcomes">
              {ch.learningPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ol>
          </section>

          {/* ADR Reflection */}
          <section class="card notes-card">
            <h3>{t.adrHeading}</h3>
            <label for="senior-adr">{t.adrLabel}</label>
            <textarea
              id="senior-adr"
              class="notes-editor"
              maxLength={12000}
              value={note}
              onInput={e => updateNote(moduleId, (e.currentTarget as HTMLTextAreaElement).value)}
              placeholder={t.adrPlaceholder}
            />
            <p class="small-disclaimer">{t.adrNotice}</p>
          </section>
        </div>

        {/* Sidebar */}
        <aside class="senior-aside">
          <section class="card">
            <img class="gopher" src={asset('gophers/architecture.png')} alt="" aria-hidden="true" style={{ maxHeight: '130px', margin: '0 auto' }} />
            <h3>{t.asideTitle}</h3>
            <ul class="rubric-list">
              <li>
                <span>Decision Lab:</span>
                <b>{seniorResults[moduleId] ? `${seniorResults[moduleId].score}%` : t.notEvaluated}</b>
              </li>
              <li>
                <span>Evidence Lab:</span>
                <b>{evidenceResults[moduleId] ? `${evidenceResults[moduleId].score}%` : t.notEvaluated}</b>
              </li>
              <li>
                <span>Investigation:</span>
                <b>{investigationResults[moduleId] ? `${investigationResults[moduleId].score}%` : t.notEvaluated}</b>
              </li>
              <li>
                <span>Operations Lab:</span>
                <b>{operationsResults[moduleId] ? `${operationsResults[moduleId].score}%` : t.notEvaluated}</b>
              </li>
              <li>
                <span>Code Review:</span>
                <b>{reviewResults[moduleId] ? `${reviewResults[moduleId].score}%` : t.notEvaluated}</b>
              </li>
            </ul>

            <div style={{ marginTop: '16px' }}>
              <a class="text-link" href={`#/senior/${moduleId}/decision-lab`}>
                {t.viewResult}
              </a>
            </div>
          </section>

          <section class="card">
            <h3>{t.nativeCardTitle}</h3>
            <p class="small-disclaimer">{t.nativeCardDesc}</p>
            <a class="btn btn-outline" href={`#/senior/${moduleId}/native`} style={{ marginTop: '10px' }}>
              labs-native/{moduleId.toLowerCase()} ↗
            </a>
          </section>
        </aside>
      </div>
    </div>
  );
}
