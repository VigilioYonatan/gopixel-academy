import {useState} from 'preact/hooks';
import rawLabs from '../../content/senior/operations-labs.json';
import {gradeOperations} from './engine/operations.mjs';
import type {OperationsLab as OperationsLabType, OperationsRecord} from './engine/operations.mjs';
const labs = rawLabs as unknown as OperationsLabType[];
type Props={moduleId:string;locale:string;previous?:OperationsRecord;save:(record:OperationsRecord)=>void;reportOnly?:boolean};
const labels:Record<string,Record<string,string>>={
 es:{title:'Laboratorio operativo',evidence:'Evidencia del incidente',diagnosis:'Diagnóstico',action:'Mitigación',submit:'Evaluar hipótesis',retry:'Intentar otra vez',back:'Volver al módulo',results:'Resultado anterior',note:'Análisis estático educativo: no se ejecuta código Go ni servicios de producción.',correct:'Correcto',incorrect:'Por revisar'},
 en:{title:'Operations lab',evidence:'Incident evidence',diagnosis:'Diagnosis',action:'Mitigation',submit:'Evaluate hypotheses',retry:'Try again',back:'Back to module',results:'Previous result',note:'Static educational reasoning: no Go code or production services are executed.',correct:'Correct',incorrect:'Review needed'},
 ja:{title:'運用ラボ',evidence:'インシデントの証拠',diagnosis:'原因の診断',action:'対応策',submit:'仮説を評価',retry:'もう一度',back:'モジュールに戻る',results:'前回の結果',note:'静的な教育演習です。Goコードや本番環境は実行しません。',correct:'正解',incorrect:'要確認'},
 zh:{title:'运维实验室',evidence:'事件证据',diagnosis:'原因诊断',action:'缓解措施',submit:'评估假设',retry:'再试一次',back:'返回模块',results:'上次结果',note:'静态教学推理：不执行 Go 代码或生产服务。',correct:'正确',incorrect:'需要复查'},
 pt:{title:'Laboratório operacional',evidence:'Evidência do incidente',diagnosis:'Diagnóstico',action:'Mitigação',submit:'Avaliar hipóteses',retry:'Tentar novamente',back:'Voltar ao módulo',results:'Resultado anterior',note:'Exercício estático: não executa Go nem serviços de produção.',correct:'Correto',incorrect:'Rever'},
 fr:{title:'Laboratoire opérationnel',evidence:'Preuves de l’incident',diagnosis:'Diagnostic',action:'Atténuation',submit:'Évaluer les hypothèses',retry:'Réessayer',back:'Retour au module',results:'Résultat précédent',note:'Exercice statique : aucun code Go ni service de production n’est exécuté.',correct:'Correct',incorrect:'À revoir'}
};
export function OperationsLab({moduleId,locale,previous,save,reportOnly=false}:Props){
 const lab=labs.find(v=>v.moduleId===moduleId);
 const t=labels[locale]||labels.es;
 const [answers,setAnswers]=useState<number[]>([-1,-1]);
 const [score,setScore]=useState<ReturnType<typeof gradeOperations>|null>(null);
 if(!lab)return <div role="alert">Lab not found</div>;
 const selected=reportOnly?previous?.answers:answers;
 const evaluation=reportOnly&&previous?gradeOperations(lab,previous.answers):score;
 const evaluate=()=>{try{const result=gradeOperations(lab,answers);setScore(result);save({moduleId,challengeId:'operations-lab',version:lab.version,correct:result.correct,score:result.score,answers:[...answers],passed:result.passed,completedAt:new Date().toISOString()})}catch{setScore(null)}};
 return <div class="content-page senior-operations">
 <nav class="breadcrumbs"><a href="#/senior">Senior</a><span>/</span><a href={`#/senior/${moduleId}`}>{moduleId}</a><span>/</span><b>{t.title}</b></nav>
 <div class="page-heading"><span class="eyebrow small">{lab.kind.toUpperCase()} · {moduleId}</span><h1>{lab.title}</h1><p>{lab.brief}</p></div>
 <div class="senior-lab-grid"><div class="senior-lab-main"><section class="card"><h2>{t.evidence}</h2><pre class="mini-code">{lab.evidence}</pre><p class="small-disclaimer">{t.note} {locale!=='es' ? 'The technical case text is currently supplied in Spanish. / Caso en español.' : ''}</p></section>
 <section class="card"><h2>{t.title}</h2>{reportOnly&&!previous&&<p class="notice" role="status">{t.results}: —</p>}{([lab.diagnoses,lab.actions] as string[][]).map((options,step)=><fieldset class="senior-question" disabled={reportOnly||!!evaluation} key={step}><legend><b>{step===0?t.diagnosis:t.action}</b></legend><div class="senior-options">{options.map((option,index)=><label class={`senior-option ${selected?.[step]===index?'chosen':''}`} key={index}><input type="radio" name={`${moduleId}-operations-${step}`} checked={selected?.[step]===index} onChange={()=>setAnswers(prev=>prev.map((v,i)=>i===step?index:v))}/><span>{option}</span></label>)}</div>{evaluation&&<p class={evaluation.details[step]?'feedback correct':'feedback incorrect'}>{evaluation.details[step]?t.correct:t.incorrect} · {options[step===0?lab.diagnosisCorrect:lab.actionCorrect]}</p>}</fieldset>)}
 <div class="rubric-actions">{!reportOnly&&<button type="button" class="btn btn-senior" disabled={!!score||answers.some(v=>v<0)} onClick={evaluate}>{t.submit}</button>}{!reportOnly&&<button type="button" class="btn btn-outline" onClick={()=>{setAnswers([-1,-1]);setScore(null)}}>{t.retry}</button>}<a class="text-link" href={`#/senior/${moduleId}`}>{t.back}</a></div>{evaluation&&<div class="notice" role="status"><strong>{evaluation.score}% · {evaluation.correct}/2</strong><p>{lab.explanation}</p>{!reportOnly&&<a href={`#/senior/${moduleId}/operations-lab/result`} class="text-link">{t.results} →</a>}</div>}</section></div>
 <aside class="senior-aside"><section class="card"><h3>{t.results}</h3><p>{previous?`${previous.score}% · ${previous.correct}/2`:'—'}</p><p class="small-disclaimer">{t.note} {locale!=='es' ? 'The technical case text is currently supplied in Spanish. / Caso en español.' : ''}</p></section></aside></div></div>;
}
