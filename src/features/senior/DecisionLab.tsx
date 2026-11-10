import { useState } from 'preact/hooks';
import seniorChallenges from '../../content/senior/challenges.json';
import curriculum from '../../data/curriculum.json';
import { evaluateDecisionQuiz } from './engine/evaluate.mjs';

type Locale = 'es' | 'en' | 'ja' | 'zh' | 'pt' | 'fr';

export type SeniorResultRecord = {
  moduleId: string;
  challengeId: 'decision-lab';
  version: number;
  correct: number;
  score: number;
  answers: number[];
  completedAt: string;
  passed: boolean;
};

type Props = {
  moduleId: string;
  locale: Locale;
  previous?: SeniorResultRecord;
  save: (r: SeniorResultRecord) => void;
  reportOnly?: boolean;
};

const labels: Record<Locale, {
  heading: string;
  subtitle: string;
  context: string;
  langNotice: string;
  questionsCount: string;
  evaluate: string;
  retry: string;
  back: string;
  correct: string;
  incorrect: string;
  expected: string;
  savedNotice: string;
  viewReport: string;
  criteria: string;
  criteria1: string;
  criteria2: string;
  criteria3: string;
  criteria4: string;
  notFound: string;
  noResult: string;
}> = {
  es: {
    heading: 'Cuestionario de Decisiones Técnicas',
    subtitle: 'Evalúa decisiones de arquitectura e ingeniería con justificación técnica.',
    context: 'Contexto de producción',
    langNotice: 'Las preguntas técnicas están redactadas en español; los controles e interfaz respetan tu idioma.',
    questionsCount: 'Decisiones técnicas',
    evaluate: 'Evaluar decisiones',
    retry: 'Reintentar',
    back: 'Volver al módulo',
    correct: 'Decisión correcta',
    incorrect: 'Revisa esta decisión',
    expected: 'Respuesta esperada',
    savedNotice: 'Resultado verificado y guardado localmente.',
    viewReport: 'Ver reporte',
    criteria: 'Criterios de evaluación',
    criteria1: 'Respuestas verificadas sobre banco versionado',
    criteria2: 'Justificación detallada por alternativa',
    criteria3: 'Evaluación determinista (100% para aprobar)',
    criteria4: 'Sin backend ni ejecución simulada de Go',
    notFound: 'Cuestionario no encontrado',
    noResult: 'Aún no has enviado respuestas para este cuestionario.',
  },
  en: {
    heading: 'Technical Decision Quiz',
    subtitle: 'Evaluate architecture and engineering decisions with technical reasoning.',
    context: 'Production context',
    langNotice: 'Technical questions are written in Spanish; controls and interface follow your language.',
    questionsCount: 'Technical decisions',
    evaluate: 'Evaluate decisions',
    retry: 'Try again',
    back: 'Back to module',
    correct: 'Correct decision',
    incorrect: 'Review this decision',
    expected: 'Expected choice',
    savedNotice: 'Verified result saved locally.',
    viewReport: 'View report',
    criteria: 'Assessment criteria',
    criteria1: 'Answers verified against versioned bank',
    criteria2: 'Detailed justification per alternative',
    criteria3: 'Deterministic evaluation (100% to pass)',
    criteria4: 'No backend or fake Go runtime',
    notFound: 'Quiz not found',
    noResult: 'No quiz submission found yet.',
  },
  ja: {
    heading: '技術決定クイズ',
    subtitle: '技術的根拠に基づきアーキテクチャおよびエンジニアリングの決定を評価します。',
    context: '本番環境コンテキスト',
    langNotice: '設問本文はスペイン語です。操作項目はお選びの言語で表示されます。',
    questionsCount: '技術的意思決定',
    evaluate: '決定を評価',
    retry: 'やり直す',
    back: 'モジュールに戻る',
    correct: '正解',
    incorrect: '見直しが必要です',
    expected: '期待される選択肢',
    savedNotice: '検証済みの結果がローカルに保存されました。',
    viewReport: 'レポートを見る',
    criteria: '評価基準',
    criteria1: 'バージョン管理された解答集に基づく判定',
    criteria2: '各選択肢の詳細な根拠',
    criteria3: '決定論的評価（合格には100%が必要）',
    criteria4: 'バックエンドや偽のGo実行環境はありません',
    notFound: 'クイズが見つかりません',
    noResult: 'まだ回答が送信されていません。',
  },
  zh: {
    heading: '技术决策测试',
    subtitle: '结合技术依据评估系统架构与工程决策。',
    context: '生产上下文',
    langNotice: '技术题目原文为西班牙语，控制项与界面语言已适配当前语言。',
    questionsCount: '技术决策',
    evaluate: '评估决策',
    retry: '重试',
    back: '返回模块',
    correct: '决策正确',
    incorrect: '请复查此决策',
    expected: '推荐选项',
    savedNotice: '验证结果已保存至本地。',
    viewReport: '查看报告',
    criteria: '评估标准',
    criteria1: '基于版本化题库严格校验',
    criteria2: '提供每个选项的详细理由',
    criteria3: '确定性评分（100% 视为通过）',
    criteria4: '无后端，不伪造 Go 运行环境',
    notFound: '未找到相关题目',
    noResult: '尚未提交测试答案。',
  },
  pt: {
    heading: 'Questionário de Decisões Técnicas',
    subtitle: 'Avalie decisões de arquitetura e engenharia com justificativa técnica.',
    context: 'Contexto de produção',
    langNotice: 'As questões técnicas estão em espanhol; os controles respeitam o seu idioma.',
    questionsCount: 'Decisões técnicas',
    evaluate: 'Avaliar decisões',
    retry: 'Tentar novamente',
    back: 'Voltar ao módulo',
    correct: 'Decisão correta',
    incorrect: 'Reveja esta decisão',
    expected: 'Opção esperada',
    savedNotice: 'Resultado verificado e salvo localmente.',
    viewReport: 'Ver relatório',
    criteria: 'Critérios de avaliação',
    criteria1: 'Respostas verificadas contra banco versionado',
    criteria2: 'Justificativa detalhada por alternativa',
    criteria3: 'Avaliação determinística (100% para aprovação)',
    criteria4: 'Sem backend nem execução simulada de Go',
    notFound: 'Questionário não encontrado',
    noResult: 'Nenhuma resposta enviada ainda.',
  },
  fr: {
    heading: 'Quiz de Décisions Techniques',
    subtitle: 'Évaluez les choix d’architecture et d’ingénierie avec justifications techniques.',
    context: 'Contexte de production',
    langNotice: 'Les questions techniques sont rédigées en espagnol ; les commandes respectent votre langue.',
    questionsCount: 'Décisions techniques',
    evaluate: 'Évaluer les décisions',
    retry: 'Réessayer',
    back: 'Retour au module',
    correct: 'Bonne décision',
    incorrect: 'Décision à revoir',
    expected: 'Choix attendu',
    savedNotice: 'Résultat vérifié et enregistré localement.',
    viewReport: 'Voir le rapport',
    criteria: 'Critères d’évaluation',
    criteria1: 'Réponses vérifiées selon un référentiel versionné',
    criteria2: 'Justification technique par alternative',
    criteria3: 'Évaluation déterministe (100% pour valider)',
    criteria4: 'Sans backend ni simulateur trompeur de Go',
    notFound: 'Quiz introuvable',
    noResult: 'Aucune réponse soumise pour le moment.',
  },
};

const asset = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`;

export function DecisionLab({ moduleId, locale, previous, save, reportOnly = false }: Props) {
  const t = labels[locale] || labels.es;
  const ch = seniorChallenges.find(c => c.moduleId === moduleId);
  const m = curriculum.find(x => x.id === moduleId);

  const [answers, setAnswers] = useState<number[]>(() => ch ? ch.questions.map(() => -1) : []);
  const [evaluation, setEvaluation] = useState<ReturnType<typeof evaluateDecisionQuiz> | null>(() => {
    if (reportOnly && previous && ch) {
      try {
        return evaluateDecisionQuiz(ch, previous.answers);
      } catch {
        return null;
      }
    }
    return null;
  });

  if (!ch || !m) {
    return (
      <div class="content-page" role="alert">
        <h2>{t.notFound}</h2>
        <a class="text-link" href="#/senior">{t.back}</a>
      </div>
    );
  }

  const effectiveAnswers = reportOnly && previous ? previous.answers : answers;
  const isComplete = answers.length === ch.questions.length && answers.every(x => x >= 0);

  const finish = () => {
    try {
      const r = evaluateDecisionQuiz(ch, answers);
      setEvaluation(r);
      const record: SeniorResultRecord = {
        moduleId,
        challengeId: 'decision-lab',
        version: ch.version,
        correct: r.correct,
        score: r.score,
        answers: [...answers],
        completedAt: new Date().toISOString(),
        passed: r.passed,
      };
      save(record);
    } catch {
      setEvaluation(null);
    }
  };

  return (
    <div class="content-page senior-decision-lab">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="#/senior">Senior</a>
        <span>/</span>
        <a href={`#/senior/${moduleId}`}>{moduleId}</a>
        <span>/</span>
        <b>Decision Lab</b>
      </nav>

      <div class="page-heading">
        <span class="eyebrow small">SENIOR · {moduleId} · DECISION LAB</span>
        <h1>{m.title[locale]}</h1>
        <p>{t.subtitle}</p>
      </div>

      <div class="senior-lab-grid">
        <div class="senior-lab-main">
          <section class="card brief-card">
            <h2>{t.context}</h2>
            <p>{m.challenge?.scenario[locale]}</p>
            <p class="small-disclaimer">{t.langNotice}</p>
          </section>

          <section class="card senior-quiz-card">
            <h2>{t.questionsCount} · {ch.questions.length}</h2>

            {reportOnly && !previous && (
              <p class="notice" role="status">{t.noResult}</p>
            )}

            {ch.questions.map((q, index) => {
              const detail = evaluation?.details[index];
              return (
                <fieldset class="senior-question" disabled={reportOnly || !!evaluation} key={q.id}>
                  <legend>
                    <b>{index + 1}. {q.prompt}</b>
                  </legend>
                  <div class="senior-options">
                    {q.options.map((option, oi) => (
                      <label
                        class={`senior-option ${effectiveAnswers[index] === oi ? 'chosen' : ''}`}
                        key={oi}
                      >
                        <input
                          type="radio"
                          name={`${moduleId}-${q.id}`}
                          checked={effectiveAnswers[index] === oi}
                          onChange={() => setAnswers(a => a.map((v, i) => (i === index ? oi : v)))}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>

                  {evaluation && detail && (
                    <div class={`feedback ${detail.correct ? 'correct' : 'incorrect'}`} role="status">
                      <b>{detail.correct ? t.correct : t.incorrect}.</b> {q.explanation}
                      <p>
                        <b>{t.expected}:</b> {q.options[q.correct]}
                      </p>
                    </div>
                  )}
                </fieldset>
              );
            })}

            <div class="rubric-actions">
              <span>
                {answers.filter(x => x >= 0).length} / {ch.questions.length}
              </span>
              {!reportOnly && (
                <button
                  type="button"
                  class="btn btn-senior"
                  disabled={!isComplete || !!evaluation}
                  onClick={finish}
                >
                  {t.evaluate}
                </button>
              )}
              {!reportOnly && (
                <button
                  type="button"
                  class="btn btn-outline"
                  onClick={() => {
                    setAnswers(ch.questions.map(() => -1));
                    setEvaluation(null);
                  }}
                >
                  {t.retry}
                </button>
              )}
              <a class="text-link" href={`#/senior/${moduleId}`}>{t.back}</a>
            </div>

            {evaluation && (
              <div class="notice" role="status">
                <b>
                  {evaluation.score}% · {evaluation.correct}/{evaluation.total} {t.correct.toLowerCase()}.
                </b>{' '}
                {t.savedNotice}{' '}
                {!reportOnly && (
                  <a class="text-link" href={`#/senior/${moduleId}/decision-lab/result`}>
                    {t.viewReport} →
                  </a>
                )}
              </div>
            )}
          </section>
        </div>

        <aside class="senior-aside">
          <section class="card">
            <img class="gopher" src={asset('gophers/senior.png')} alt="" aria-hidden="true" style={{ maxHeight: '130px', margin: '0 auto' }} />
            <h3>{t.criteria}</h3>
            <ul class="rubric-list">
              <li>{t.criteria1}</li>
              <li>{t.criteria2}</li>
              <li>{t.criteria3}</li>
              <li>{t.criteria4}</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
