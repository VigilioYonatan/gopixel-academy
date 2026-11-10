import { useState } from 'preact/hooks';
import investigations from '../../content/senior/investigations.json';
import { gradeInvestigation } from './engine/investigation.mjs';

type RecordResult = {moduleId:string;challengeId:'investigation-lab';version:number;correct:number;score:number;answers:number[];completedAt:string;passed:boolean};
type Props={moduleId:string; locale:string; save:(record:RecordResult)=>void; previous?:RecordResult; reportOnly?:boolean};
const localized:Record<string,Record<string,string>>={
 es:{stage:'Investigación por etapas',notice:'Caso en español: analiza decisiones con consecuencias explicadas. No ejecuta Go.',evaluate:'Evaluar investigación',retry:'Reiniciar',previous:'Resultado anterior',expected:'Decisión recomendada',back:'Volver al módulo'},
 en:{stage:'Step-by-step investigation',notice:'Spanish case study: static technical reasoning, not live Go execution.',evaluate:'Evaluate investigation',retry:'Restart',previous:'Previous result',expected:'Recommended decision',back:'Back to module'},
 ja:{stage:'段階的な技術調査',notice:'スペイン語の教材です。Goの実行ではありません。',evaluate:'回答を評価',retry:'やり直す',previous:'前回の結果',expected:'推奨される判断',back:'モジュールに戻る'},
 zh:{stage:'分步技术调查',notice:'西班牙语案例：静态技术推理，不执行 Go。',evaluate:'评估答案',retry:'重新开始',previous:'建议决策',expected:'建议决策',back:'返回模块'},
 pt:{stage:'Investigação por etapas',notice:'Caso em espanhol: análise técnica estática, sem executar Go.',evaluate:'Avaliar',retry:'Reiniciar',previous:'Resultado anterior',expected:'Decisão recomendada',back:'Voltar ao módulo'},
 fr:{stage:'Investigation étape par étape',notice:'Cas en espagnol : analyse statique, sans exécution Go.',evaluate:'Évaluer',retry:'Recommencer',previous:'Résultat précédent',expected:'Décision recommandée',back:'Retour au module'}
};
export function InvestigationLab({moduleId,locale,save,previous,reportOnly=false}:Props){
 const lab=investigations.find(v=>v.moduleId===moduleId);
 const labels=localized[locale]||localized.es;
 const [answers,setAnswers]=useState<number[]>([-1,-1,-1]);
 const [result,setResult]=useState<ReturnType<typeof gradeInvestigation>|null>(null);
 if(!lab)return <p role="alert">Investigation not found</p>;
 if(reportOnly) return <div class="content-page senior-investigation"><nav class="breadcrumbs"><a href="#/senior">Senior</a><span>/</span><a href={`#/senior/${moduleId}`}>{moduleId}</a></nav><div class="page-heading"><span class="eyebrow small">SENIOR · RESULTADO</span><h1>{lab.title}</h1></div><section class="card"><h2>{previous?`${previous.score}% · ${previous.correct}/3`:'No hay resultado guardado'}</h2><p class="notice">{labels.notice}</p>{previous&&lab.steps.map((step,i)=><div class="senior-result-row" key={step.id}><b>{i+1}. {step.prompt}</b><p class={previous.answers[i]===step.correct?'feedback correct':'feedback incorrect'}>{previous.answers[i]===step.correct?'✓':'✗'} {step.options[previous.answers[i]]}</p><p><b>{labels.expected}:</b> {step.options[step.correct]}</p><p>{step.explanation}</p></div>)}<a class="text-link" href={`#/senior/${moduleId}/investigation-lab`}>{labels.retry} →</a></section></div>;
 const evaluate=()=>{try{const r=gradeInvestigation(lab,answers);setResult(r);save({moduleId,challengeId:'investigation-lab',version:lab.version,correct:r.correct,score:r.score,answers:[...answers],passed:r.passed,completedAt:new Date().toISOString()})}catch{setResult(null)}};
 return <div class="content-page senior-investigation"><nav class="breadcrumbs"><a href="#/senior">Senior</a><span>/</span><a href={`#/senior/${moduleId}`}>{moduleId}</a><span>/</span><b>{labels.stage}</b></nav>
 <div class="page-heading"><span class="eyebrow small">SENIOR · {moduleId}</span><h1>{lab.title}</h1><p>{lab.brief}</p></div>
 <section class="card"><h2>{labels.stage}</h2><p class="notice">{labels.notice}</p>{previous&&<p class="muted">{labels.previous}: {previous.score}%</p>}
 {lab.steps.map((step,i)=><fieldset class="senior-question" disabled={!!result} key={step.id}><legend><b>{i+1}. {step.prompt}</b></legend><div class="senior-options">{step.options.map((opt,oi)=><label class={`senior-option ${answers[i]===oi?'chosen':''}`} key={oi}><input type="radio" name={step.id} checked={answers[i]===oi} onChange={()=>setAnswers(a=>a.map((v,j)=>j===i?oi:v))}/><span>{opt}</span></label>)}</div>{result&&<div class={`feedback ${result.details[i].correct?'correct':'incorrect'}`}><b>{result.details[i].correct?'✓':'✗'} {labels.expected}: {step.options[step.correct]}</b><p>{step.explanation}</p></div>}</fieldset>)}
 <div class="rubric-actions"><button type="button" class="btn btn-senior" disabled={!!result||answers.some(v=>v<0)} onClick={evaluate}>{labels.evaluate}</button><button type="button" class="btn btn-outline" onClick={()=>{setAnswers([-1,-1,-1]);setResult(null)}}>{labels.retry}</button><a class="text-link" href={`#/senior/${moduleId}`}>{labels.back}</a></div>{result&&<div class="notice" role="status">{result.score}% · {result.correct}/{result.total} · {result.verification}</div>}</section></div>;
}
