import { useState } from 'preact/hooks';
import evidenceLabsRaw from '../../content/senior/evidence-labs.json';
import curriculum from '../../data/curriculum.json';
import { evaluateEvidenceLab } from './engine/evidence.mjs';
import type { EvidenceLab as EvidenceLabType } from './engine/evidence.mjs';

const evidenceLabs = evidenceLabsRaw as unknown as EvidenceLabType[];

type Locale = 'es' | 'en' | 'ja' | 'zh' | 'pt' | 'fr';

export type EvidenceResultRecord = {
  moduleId: string;
  challengeId: 'evidence-lab';
  version: number;
  correct: number;
  score: number;
  selections: number[];
  completedAt: string;
  passed: boolean;
};

type Props = {
  moduleId: string;
  locale: Locale;
  previous?: EvidenceResultRecord;
  save: (r: EvidenceResultRecord) => void;
  reportOnly?: boolean;
};

const labels: Record<Locale, {
  heading: string;
  scenarioAndEvidence: string;
  disclaimer: string;
  selectPrompt: string;
  selectHelp: string;
  validate: string;
  retry: string;
  back: string;
  recommended: string;
  notRecommended: string;
  scoreSummary: string;
  viewResult: string;
  sidebarTitle: string;
  sidebarDesc: string;
  sidebarVersion: string;
  notFound: string;
  noResult: string;
}> = {
  es: {
    heading: 'Laboratorio de Evidencias',
    scenarioAndEvidence: 'Escenario y evidencia del incidente',
    disclaimer: 'Caso educativo estático. No ejecuta Go ni reproduce un incidente de producción real.',
    selectPrompt: 'Selecciona TODAS las actuaciones válidas',
    selectHelp: 'Marca las medidas técnicamente justificadas por la evidencia. Las recomendaciones infundadas restan acierto.',
    validate: 'Validar análisis',
    retry: 'Repetir',
    back: 'Volver al módulo',
    recommended: 'Recomendado',
    notRecommended: 'No recomendado',
    scoreSummary: 'decisiones correctas',
    viewResult: 'Ver resultado guardado',
    sidebarTitle: 'Laboratorio de Evidencias',
    sidebarDesc: 'Análisis de trazas, métricas, perfiles y logs de producción.',
    sidebarVersion: 'Las respuestas se verifican con una clave versionada y determinista.',
    notFound: 'Laboratorio de evidencias no encontrado',
    noResult: 'Aún no se ha completado este laboratorio.',
  },
  en: {
    heading: 'Evidence Lab',
    scenarioAndEvidence: 'Incident scenario and evidence',
    disclaimer: 'Static educational case study. Does not execute Go or replicate a live production incident.',
    selectPrompt: 'Select ALL valid technical actions',
    selectHelp: 'Check actions technically supported by the evidence. Unsound recommendations count as errors.',
    validate: 'Validate analysis',
    retry: 'Retry',
    back: 'Back to module',
    recommended: 'Recommended',
    notRecommended: 'Not recommended',
    scoreSummary: 'correct decisions',
    viewResult: 'View saved result',
    sidebarTitle: 'Evidence Lab',
    sidebarDesc: 'Production traces, metrics, profiles, and log analysis.',
    sidebarVersion: 'Responses are validated against a versioned, deterministic key.',
    notFound: 'Evidence lab not found',
    noResult: 'No submission found for this lab yet.',
  },
  ja: {
    heading: '証拠分析ラボ',
    scenarioAndEvidence: 'インシデントのシナリオと証拠',
    disclaimer: '静的な教育ケーススタディです。Goの実行や本番障害の再現は行いません。',
    selectPrompt: '有効な技術的対応をすべて選択してください',
    selectHelp: '証拠に基づき技術的に正当化される対策を選択してください。不適切な推奨事項は減点対象となります。',
    validate: '分析を検証',
    retry: 'やり直す',
    back: 'モジュールに戻る',
    recommended: '推奨',
    notRecommended: '非推奨',
    scoreSummary: '件の正しい判断',
    viewResult: '保存された結果を見る',
    sidebarTitle: '証拠分析ラボ',
    sidebarDesc: '本番トレース、メトリクス、プロファイル、ログの分析。',
    sidebarVersion: '回答はバージョン管理された決定論的キーにより検証されます。',
    notFound: '証拠ラボが見つかりません',
    noResult: 'このラボはまだ完了していません。',
  },
  zh: {
    heading: '证据分析实验室',
    scenarioAndEvidence: '事件场景与现场证据',
    disclaimer: '静态教学案例分析。不执行 Go 代码，亦不重现真实生产事故。',
    selectPrompt: '选择所有有效的技术应对措施',
    selectHelp: '勾选由证据技术支撑的措施。未被证据支持的盲目建议将判定为错误。',
    validate: '验证分析',
    retry: '重试',
    back: '返回模块',
    recommended: '推荐方案',
    notRecommended: '非推荐方案',
    scoreSummary: '项决策正确',
    viewResult: '查看已保存结果',
    sidebarTitle: '证据实验室',
    sidebarDesc: '生产追踪数据、系统指标、性能剖析图与日志分析。',
    sidebarVersion: '答案通过版本化确定性答题卡严格比对校验。',
    notFound: '未找到证据实验室',
    noResult: '尚未完成此实验室。',
  },
  pt: {
    heading: 'Laboratório de Evidências',
    scenarioAndEvidence: 'Cenário e evidências do incidente',
    disclaimer: 'Estudo de caso estático. Não executa Go nem reproduz um incidente de produção.',
    selectPrompt: 'Selecione TODAS as ações técnicas válidas',
    selectHelp: 'Marque medidas tecnicamente justificadas pela evidência. Recomendações incorretas contam como erro.',
    validate: 'Validar análise',
    retry: 'Repetir',
    back: 'Voltar ao módulo',
    recommended: 'Recomendado',
    notRecommended: 'Não recomendado',
    scoreSummary: 'decisões corretas',
    viewResult: 'Ver resultado salvo',
    sidebarTitle: 'Laboratório de Evidências',
    sidebarDesc: 'Análise de rastreamento, métricas, perfis e logs de produção.',
    sidebarVersion: 'Respostas verificadas por chave determinística versionada.',
    notFound: 'Laboratório de evidências não encontrado',
    noResult: 'Nenhum resultado registrado ainda.',
  },
  fr: {
    heading: 'Laboratoire de Preuves',
    scenarioAndEvidence: 'Scénario et preuves de l’incident',
    disclaimer: 'Étude de cas pédagogique statique. N’exécute pas Go ni un incident de production réel.',
    selectPrompt: 'Sélectionnez TOUTES les actions techniques valides',
    selectHelp: 'Cochez les mesures étayées par les preuves. Les recommandations injustifiées comptent comme erreurs.',
    validate: 'Valider l’analyse',
    retry: 'Réessayer',
    back: 'Retour au module',
    recommended: 'Recommandé',
    notRecommended: 'Non recommandé',
    scoreSummary: 'décisions correctes',
    viewResult: 'Consulter le résultat',
    sidebarTitle: 'Laboratoire de Preuves',
    sidebarDesc: 'Analyse de traces, métriques, profils et journaux de production.',
    sidebarVersion: 'Les réponses sont validées selon un barème versionné déterministe.',
    notFound: 'Laboratoire de preuves introuvable',
    noResult: 'Aucune soumission pour ce laboratoire.',
  },
};

const asset = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`;

export function EvidenceLab({ moduleId, locale, previous, save, reportOnly = false }: Props) {
  const t = labels[locale] || labels.es;
  const ev = evidenceLabs.find(e => e.moduleId === moduleId);
  const m = curriculum.find(x => x.id === moduleId);

  const [selected, setSelected] = useState<number[]>([]);
  const [evaluation, setEvaluation] = useState<ReturnType<typeof evaluateEvidenceLab> | null>(() => {
    if (reportOnly && previous && ev) {
      try {
        return evaluateEvidenceLab(ev, previous.selections);
      } catch {
        return null;
      }
    }
    return null;
  });

  if (!ev || !m) {
    return (
      <div class="content-page" role="alert">
        <h2>{t.notFound}</h2>
        <a class="text-link" href="#/senior">{t.back}</a>
      </div>
    );
  }

  const effectiveSelections = reportOnly && previous ? previous.selections : selected;

  const toggle = (i: number) => {
    setSelected(v => (v.includes(i) ? v.filter(x => x !== i) : [...v, i]));
  };

  const finish = () => {
    try {
      const result = evaluateEvidenceLab(ev, selected);
      setEvaluation(result);
      const record: EvidenceResultRecord = {
        moduleId,
        challengeId: 'evidence-lab',
        version: ev.version,
        correct: result.correct,
        score: result.score,
        selections: [...selected],
        completedAt: new Date().toISOString(),
        passed: result.passed,
      };
      save(record);
    } catch {
      setEvaluation(null);
    }
  };

  return (
    <div class="content-page senior-evidence-lab">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="#/senior">Senior</a>
        <span>/</span>
        <a href={`#/senior/${moduleId}`}>{moduleId}</a>
        <span>/</span>
        <b>Evidence Lab</b>
      </nav>

      <div class="page-heading">
        <span class="eyebrow small">SENIOR · {moduleId} · {ev.kind.toUpperCase()}</span>
        <h1>{m.title[locale]}</h1>
        <p>{ev.title}</p>
      </div>

      <div class="senior-lab-grid">
        <div class="senior-lab-main">
          <section class="card">
            <h2>{t.scenarioAndEvidence}</h2>
            <p>{m.challenge?.scenario[locale]}</p>
            <pre class="mini-code">
              <code>{ev.evidence}</code>
            </pre>
            <p class="small-disclaimer">{t.disclaimer}</p>
          </section>

          <section class="card">
            <h2>{t.selectPrompt}</h2>
            <p class="muted">{t.selectHelp}</p>

            {reportOnly && !previous && (
              <p class="notice" role="status">{t.noResult}</p>
            )}

            <div class="senior-options">
              {ev.findings.map((finding, i) => (
                <label
                  class={`senior-option ${effectiveSelections.includes(i) ? 'chosen' : ''}`}
                  key={i}
                >
                  <input
                    type="checkbox"
                    disabled={reportOnly || !!evaluation}
                    checked={effectiveSelections.includes(i)}
                    onChange={() => toggle(i)}
                  />
                  <span>{finding}</span>
                </label>
              ))}
            </div>

            <div class="rubric-actions">
              {!reportOnly && (
                <button
                  type="button"
                  class="btn btn-senior"
                  disabled={!!evaluation}
                  onClick={finish}
                >
                  {t.validate}
                </button>
              )}
              {!reportOnly && (
                <button
                  type="button"
                  class="btn btn-outline"
                  onClick={() => {
                    setSelected([]);
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
                <h3>
                  {evaluation.score}% · {evaluation.correct}/{evaluation.total} {t.scoreSummary}
                </h3>
                {ev.findings.map((f, i) => {
                  const match = evaluation.expected.includes(i) === effectiveSelections.includes(i);
                  const isExp = evaluation.expected.includes(i);
                  return (
                    <p class={match ? 'feedback correct' : 'feedback incorrect'} key={i}>
                      {match ? '✓' : '✗'} {f} — {isExp ? t.recommended : t.notRecommended}
                    </p>
                  );
                })}
                <p>{ev.explanation}</p>
                {!reportOnly && (
                  <a class="text-link" href={`#/senior/${moduleId}/evidence-lab/result`}>
                    {t.viewResult} →
                  </a>
                )}
              </div>
            )}
          </section>
        </div>

        <aside class="senior-aside">
          <section class="card">
            <img class="gopher" src={asset('gophers/senior.png')} alt="" aria-hidden="true" style={{ maxHeight: '130px', margin: '0 auto' }} />
            <h3>{t.sidebarTitle}</h3>
            <p>{ev.kind} · {t.sidebarDesc}</p>
            <p class="small-disclaimer">{t.sidebarVersion}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
