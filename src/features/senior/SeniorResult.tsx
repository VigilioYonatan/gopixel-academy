import curriculum from '../../data/curriculum.json';
import seniorChallenges from '../../content/senior/challenges.json';
import evidenceLabs from '../../content/senior/evidence-labs.json';
import type { SeniorResultRecord } from './DecisionLab';
import type { EvidenceResultRecord } from './EvidenceLab';

type Locale = 'es' | 'en' | 'ja' | 'zh' | 'pt' | 'fr';

type SeniorResultProps = {
  moduleId: string;
  locale: Locale;
  challengeType?: 'decision-lab' | 'evidence-lab';
  seniorResults: Record<string, SeniorResultRecord>;
  evidenceResults: Record<string, EvidenceResultRecord>;
  notes: Record<string, string>;
};

const labels: Record<Locale, {
  evidenceReportEyebrow: string;
  quizReportEyebrow: string;
  evidenceHeading: string;
  quizHeading: string;
  evidenceSubtitle: string;
  quizSubtitle: string;
  recalculatedNotice: string;
  quizScopeNotice: string;
  expected: string;
  notExpected: string;
  yourChoice: string;
  notRecorded: string;
  correct: string;
  incorrect: string;
  retakeEvidence: string;
  retakeQuiz: string;
  backToSenior: string;
  backToModule: string;
  noEvidenceResult: string;
  noQuizResult: string;
  adrNote: string;
  characters: string;
  unrated: string;
  notFound: string;
}> = {
  es: {
    evidenceReportEyebrow: 'SENIOR · INFORME DE EVIDENCIAS',
    quizReportEyebrow: 'SENIOR · RESULTADO DEL CUESTIONARIO',
    evidenceHeading: 'Informe de análisis de evidencias',
    quizHeading: 'Evaluación técnica objetiva',
    evidenceSubtitle: 'La puntuación se recalcula contra la clave versionada.',
    quizSubtitle: 'Evaluación de decisiones de diseño; no compila Go ni mide producción.',
    recalculatedNotice: 'La puntuación se verifica contra el banco versionado de respuestas y refleja únicamente decisiones sobre el escenario estático.',
    quizScopeNotice: 'Esta evaluación comprueba respuestas a preguntas de diseño; NO verifica código Go, benchmarks, seguridad de producción ni arquitectura desplegada.',
    expected: 'Esperado',
    notExpected: 'No esperado',
    yourChoice: 'Tu elección',
    notRecorded: 'No registrada',
    correct: 'Correcto',
    incorrect: 'Incorrecto',
    retakeEvidence: 'Repetir laboratorio de evidencias',
    retakeQuiz: 'Repetir cuestionario',
    backToSenior: 'Volver a Senior',
    backToModule: 'Volver al módulo',
    noEvidenceResult: 'No hay evaluación de evidencias guardada para este módulo.',
    noQuizResult: 'Aún no has enviado respuestas para este cuestionario.',
    adrNote: 'Nota ADR local',
    characters: 'caracteres',
    unrated: 'no calificados',
    notFound: 'Módulo o evaluación no encontrada',
  },
  en: {
    evidenceReportEyebrow: 'SENIOR · EVIDENCE LAB REPORT',
    quizReportEyebrow: 'SENIOR · QUIZ RESULTS',
    evidenceHeading: 'Evidence Analysis Report',
    quizHeading: 'Objective Technical Assessment',
    evidenceSubtitle: 'Score is recomputed against the versioned key.',
    quizSubtitle: 'Design decision assessment; does not compile Go or measure production.',
    recalculatedNotice: 'Score is strictly verified against the versioned answer key and reflects only static scenario decisions.',
    quizScopeNotice: 'This assessment checks answers to design questions; it does NOT test compiled Go, benchmarks, or live infrastructure.',
    expected: 'Expected',
    notExpected: 'Not expected',
    yourChoice: 'Your choice',
    notRecorded: 'Not recorded',
    correct: 'Correct',
    incorrect: 'Incorrect',
    retakeEvidence: 'Retake evidence lab',
    retakeQuiz: 'Retake quiz',
    backToSenior: 'Back to Senior',
    backToModule: 'Back to module',
    noEvidenceResult: 'No saved evidence assessment for this module.',
    noQuizResult: 'No quiz submission has been recorded yet.',
    adrNote: 'Local ADR note',
    characters: 'characters',
    unrated: 'unscored',
    notFound: 'Module or assessment not found',
  },
  ja: {
    evidenceReportEyebrow: 'SENIOR · 証拠分析レポート',
    quizReportEyebrow: 'SENIOR · クイズ結果',
    evidenceHeading: '証拠分析レポート',
    quizHeading: '客観的技術評価',
    evidenceSubtitle: 'スコアはバージョン管理された正解に基づき再計算されます。',
    quizSubtitle: '設計上の判断を評価するものであり、Goのコンパイルや本番測定は行いません。',
    recalculatedNotice: 'スコアはバージョン管理された回答集に対して検証され、静的シナリオの判断のみを反映します。',
    quizScopeNotice: 'この評価は設計問題への回答を確認するものであり、Goの実行やベンチマークを検証するものではありません。',
    expected: '期待される選択',
    notExpected: '非推奨',
    yourChoice: 'あなたの選択',
    notRecorded: '未記録',
    correct: '正解',
    incorrect: '不正解',
    retakeEvidence: '証拠ラボを再試行',
    retakeQuiz: 'クイズを再試行',
    backToSenior: 'Senior に戻る',
    backToModule: 'モジュールに戻る',
    noEvidenceResult: '保存された証拠評価はありません。',
    noQuizResult: 'まだ回答が送信されていません。',
    adrNote: 'ローカル ADR ノート',
    characters: '文字',
    unrated: '採点対象外',
    notFound: 'モジュールまたは評価が見つかりません',
  },
  zh: {
    evidenceReportEyebrow: 'SENIOR · 证据分析报告',
    quizReportEyebrow: 'SENIOR · 测试成绩单',
    evidenceHeading: '证据分析评估报告',
    quizHeading: '客观技术决策评估',
    evidenceSubtitle: '分数基于版本化答案库重新校验计算。',
    quizSubtitle: '仅评估系统设计决策，不编译 Go 代码，不测量生产指标。',
    recalculatedNotice: '分数严格对比版本化题库重新核算，仅反映针对静态场景的工程决策。',
    quizScopeNotice: '本测评仅检验设计与决策能力，不替代真实编译、性能压测或生产部署验证。',
    expected: '期望选项',
    notExpected: '非期望选项',
    yourChoice: '你的选择',
    notRecorded: '未记录',
    correct: '正确',
    incorrect: '错误',
    retakeEvidence: '重测证据实验室',
    retakeQuiz: '重新测试',
    backToSenior: '返回 Senior 模式',
    backToModule: '返回模块',
    noEvidenceResult: '该模块尚未保存证据评估记录。',
    noQuizResult: '尚未记录测试答案。',
    adrNote: '本地 ADR 笔记',
    characters: '字符',
    unrated: '不计入成绩',
    notFound: '未找到模块或测试记录',
  },
  pt: {
    evidenceReportEyebrow: 'SENIOR · RELATÓRIO DE EVIDÊNCIAS',
    quizReportEyebrow: 'SENIOR · RESULTADO DO QUIZ',
    evidenceHeading: 'Relatório de análise de evidências',
    quizHeading: 'Avaliação técnica objetiva',
    evidenceSubtitle: 'A pontuação é recalculada contra o gabarito versionado.',
    quizSubtitle: 'Avaliação de decisões de design; não compila Go nem mede produção.',
    recalculatedNotice: 'A pontuação é checada contra o banco versionado e reflete apenas decisões do cenário estático.',
    quizScopeNotice: 'Esta avaliação valida respostas conceituais de design; NÃO substitui compilação Go nem testes reais.',
    expected: 'Esperado',
    notExpected: 'Não esperado',
    yourChoice: 'Sua escolha',
    notRecorded: 'Não registrada',
    correct: 'Correto',
    incorrect: 'Incorreto',
    retakeEvidence: 'Repetir laboratório de evidências',
    retakeQuiz: 'Repetir questionário',
    backToSenior: 'Voltar ao Senior',
    backToModule: 'Voltar ao módulo',
    noEvidenceResult: 'Nenhuma avaliação de evidências salva para este módulo.',
    noQuizResult: 'Nenhuma resposta enviada ainda.',
    adrNote: 'Nota ADR local',
    characters: 'caracteres',
    unrated: 'não pontuados',
    notFound: 'Módulo ou avaliação não encontrada',
  },
  fr: {
    evidenceReportEyebrow: 'SENIOR · RAPPORT DE PREUVES',
    quizReportEyebrow: 'SENIOR · RÉSULTAT DU QUIZ',
    evidenceHeading: 'Rapport d’analyse des preuves',
    quizHeading: 'Évaluation technique objective',
    evidenceSubtitle: 'La note est recalculée selon le référentiel versionné.',
    quizSubtitle: 'Évaluation des décisions d’architecture ; ne compile pas Go ni la production.',
    recalculatedNotice: 'Le score est vérifié selon le barème versionné et reflète uniquement les choix sur scénario statique.',
    quizScopeNotice: 'Cette évaluation contrôle les choix de conception ; elle NE teste PAS de code Go compilé ni d’infrastructure réelle.',
    expected: 'Attendu',
    notExpected: 'Non attendu',
    yourChoice: 'Votre choix',
    notRecorded: 'Non enregistré',
    correct: 'Correct',
    incorrect: 'Incorrect',
    retakeEvidence: 'Recommencer le lab de preuves',
    retakeQuiz: 'Recommencer le quiz',
    backToSenior: 'Retour à Senior',
    backToModule: 'Retour au module',
    noEvidenceResult: 'Aucune évaluation de preuves enregistrée pour ce module.',
    noQuizResult: 'Aucune réponse soumise pour ce quiz.',
    adrNote: 'Note ADR locale',
    characters: 'caractères',
    unrated: 'non notés',
    notFound: 'Module ou évaluation introuvable',
  },
};

export function SeniorResult({
  moduleId,
  locale,
  challengeType,
  seniorResults,
  evidenceResults,
  notes,
}: SeniorResultProps) {
  const t = labels[locale] || labels.es;
  const m = curriculum.find(x => x.id === moduleId && x.track === 'senior');
  const ch = seniorChallenges.find(c => c.moduleId === moduleId);
  const ev = evidenceLabs.find(e => e.moduleId === moduleId);

  if (!m) {
    return (
      <div class="content-page" role="alert">
        <h2>{t.notFound}</h2>
        <a class="text-link" href="#/senior">{t.backToSenior}</a>
      </div>
    );
  }

  // Determine whether this is evidence-lab or decision-lab
  const isEvidence = challengeType === 'evidence-lab' || window.location.hash.includes('evidence-lab');

  if (isEvidence && ev) {
    const er = evidenceResults[moduleId];
    return (
      <div class="content-page senior-result-view">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <a href="#/senior">Senior</a>
          <span>/</span>
          <a href={`#/senior/${moduleId}`}>{moduleId}</a>
          <span>/</span>
          <b>Evidence Lab Report</b>
        </nav>

        <div class="page-heading">
          <span class="eyebrow small">{t.evidenceReportEyebrow}</span>
          <h1>{m.title[locale]}</h1>
          <p>{ev.title}</p>
        </div>

        <section class="card">
          <h2>
            {er
              ? `${er.score}% · ${er.correct}/${ev.findings.length} ${t.correct.toLowerCase()}`
              : t.noEvidenceResult}
          </h2>
          <p class="notice" role="status">{t.recalculatedNotice}</p>

          {er &&
            ev.findings.map((finding, i) => {
              const userSelected = er.selections.includes(i);
              const isExpected = ev.correctFindings.includes(i);
              const match = userSelected === isExpected;

              return (
                <p class={match ? 'feedback correct' : 'feedback incorrect'} key={i}>
                  {match ? '✓' : '✗'} {finding} — {isExpected ? t.expected : t.notExpected}
                </p>
              );
            })}

          <div class="rubric-actions">
            <a class="btn btn-senior" href={`#/senior/${moduleId}/evidence-lab`}>
              {t.retakeEvidence}
            </a>
            <a class="btn btn-outline" href={`#/senior/${moduleId}`}>
              {t.backToModule}
            </a>
          </div>
        </section>
      </div>
    );
  }

  const record = seniorResults[moduleId];

  return (
    <div class="content-page senior-result-view">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="#/senior">Senior</a>
        <span>/</span>
        <a href={`#/senior/${moduleId}`}>{moduleId}</a>
        <span>/</span>
        <b>Quiz Report</b>
      </nav>

      <div class="page-heading">
        <span class="eyebrow small">{t.quizReportEyebrow}</span>
        <h1>{m.title[locale]}</h1>
        <p>{t.quizSubtitle}</p>
      </div>

      <section class="card">
        <h2>
          {record && ch
            ? `${record.score}% · ${record.correct}/${ch.questions.length} ${t.correct.toLowerCase()}`
            : t.noQuizResult}
        </h2>
        <p class="notice" role="status">{t.quizScopeNotice}</p>

        {record &&
          ch?.questions.map((q, i) => {
            const isCorrect = record.answers[i] === q.correct;
            const chosenText = q.options[record.answers[i]] || t.notRecorded;

            return (
              <div class="senior-result-row" key={q.id}>
                <b>{i + 1}. {q.prompt}</b>
                <p class={isCorrect ? 'feedback correct' : 'feedback incorrect'}>
                  {isCorrect ? `✓ ${t.correct}` : `✗ ${t.incorrect}`} — {q.explanation}
                </p>
                <p>
                  <b>{t.yourChoice}:</b> {chosenText}
                </p>
              </div>
            );
          })}

        <p class="muted">
          {t.adrNote}: {(notes[moduleId] || '').length} {t.characters} ({t.unrated}).
        </p>

        <div class="rubric-actions">
          <a class="btn btn-senior" href={`#/senior/${moduleId}/decision-lab`}>
            {t.retakeQuiz}
          </a>
          <a class="btn btn-outline" href={`#/senior/${moduleId}`}>
            {t.backToModule}
          </a>
        </div>
      </section>
    </div>
  );
}
