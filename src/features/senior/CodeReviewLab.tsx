import { useState } from 'preact/hooks';
import reviews from '../../content/senior/code-reviews.json';
import curriculum from '../../data/curriculum.json';
import { gradeCodeReview } from './engine/code-review.mjs';
import type { ReviewRecord, ReviewGrade } from './engine/code-review.mjs';

type Language='es'|'en'|'ja'|'zh'|'pt'|'fr';
type Props={moduleId:string;locale:Language;previous?:ReviewRecord;save:(r:ReviewRecord)=>void;reportOnly?:boolean};
const copies:Record<Language,{heading:string;code:string;risks:string;evaluate:string;reset:string;results:string;back:string;correct:string;incorrect:string;disclaimer:string;languageNote:string;noResult:string;retake:string}>={
 es:{heading:'Code Review Senior',code:'Fragmento del pull request',risks:'Decisiones de revisión',evaluate:'Evaluar revisión',reset:'Reintentar',results:'Resultado',back:'Volver al módulo',correct:'Decisión correcta',incorrect:'Revisa tu criterio',disclaimer:'Ejercicio de análisis estático: el fragmento no se compila ni ejecuta aquí.',languageNote:'',noResult:'Todavía no hay una revisión registrada.',retake:'Volver a practicar'},
 en:{heading:'Senior Code Review',code:'Pull request excerpt',risks:'Review decisions',evaluate:'Grade review',reset:'Try again',results:'Result',back:'Back to module',correct:'Correct decision',incorrect:'Review needed',disclaimer:'Static review exercise: the snippet is not compiled or executed here.',languageNote:'Technical scenario text is in Spanish; controls are translated.',noResult:'No review submitted yet.',retake:'Practice again'},
 ja:{heading:'Senior コードレビュー',code:'プルリクエストのコード',risks:'レビュー判断',evaluate:'レビューを採点',reset:'やり直す',results:'結果',back:'モジュールに戻る',correct:'正解',incorrect:'見直しが必要',disclaimer:'静的レビュー演習です。ここではコードを実行しません。',languageNote:'技術的な本文はスペイン語で、操作項目のみ翻訳されています。',noResult:'提出済みの結果はありません。',retake:'再挑戦'},
 zh:{heading:'Senior 代码审查',code:'拉取请求代码片段',risks:'审查决策',evaluate:'评估审查',reset:'重试',results:'结果',back:'返回模块',correct:'正确',incorrect:'请复查',disclaimer:'静态审查练习：此处不编译或执行代码。',languageNote:'技术正文为西班牙语，操作界面已翻译。',noResult:'尚未提交审查。',retake:'再次练习'},
 pt:{heading:'Code Review Senior',code:'Trecho do pull request',risks:'Decisões de revisão',evaluate:'Avaliar revisão',reset:'Tentar novamente',results:'Resultado',back:'Voltar ao módulo',correct:'Decisão correta',incorrect:'Rever critério',disclaimer:'Exercício de análise estática: o código não é compilado aqui.',languageNote:'O texto técnico está em espanhol; os controles estão traduzidos.',noResult:'Ainda não há revisão registrada.',retake:'Praticar de novo'},
 fr:{heading:'Revue de code Senior',code:'Extrait de la demande de fusion',risks:'Décisions de revue',evaluate:'Évaluer la revue',reset:'Recommencer',results:'Résultat',back:'Retour au module',correct:'Bonne décision',incorrect:'À revoir',disclaimer:'Exercice de revue statique : le code n’est pas compilé ici.',languageNote:'Le scénario technique est en espagnol ; les commandes sont traduites.',noResult:'Aucune revue soumise.',retake:'Réessayer'}
};
export function CodeReviewLab({moduleId,locale,previous,save,reportOnly=false}:Props){
 const lab=reviews.find(x=>x.moduleId===moduleId);
 const t=copies[locale]??copies.es;
 const [answers,setAnswers]=useState<number[]>([-1,-1]);
 const [grade,setGrade]=useState<ReviewGrade|null>(null);
 const [prCopied, setPrCopied]=useState(false);
 if(!lab)return <section class="content-page" role="alert">404 · Review not found</section>;
 const selected=reportOnly?previous?.answers:answers;
 const evaluation=reportOnly&&previous?gradeCodeReview(lab,previous.answers):grade;
 const module=curriculum.find(x=>x.id===moduleId);
 const submit=()=>{try{const result=gradeCodeReview(lab,answers);const record:ReviewRecord={moduleId,challengeId:'code-review',version:lab.version,correct:result.correct,score:result.score,answers:[...answers],completedAt:new Date().toISOString(),passed:result.passed};save(record);setGrade(result)}catch{setGrade(null)}};
 const copyPrFeedback=()=>{
   if(!evaluation)return;
   const text=`### Code Review: ${lab.title}\n\n**Evaluación:** ${evaluation.score}% (${evaluation.correct}/2 decisiones correctas)\n**Dictamen:** ${evaluation.passed?'Aprobado (Cumple estándares de concurrencia y producción)':'Cambios requeridos'}\n\n**Recomendación de arquitectura:**\n${lab.practice}\n\n*GoPixel Academy · Senior Mode Review*`;
   navigator.clipboard?.writeText(text);
   setPrCopied(true);
   setTimeout(()=>setPrCopied(false),2000);
 };
 return <section class="content-page senior-code-review" aria-labelledby="review-title">
  <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="#/senior">Senior Mode</a><span>/</span><a href={`#/senior/${moduleId}`}>{moduleId}</a><span>/</span><b>{t.heading}</b></nav>
  <header class="page-heading"><span class="eyebrow small">{moduleId} · PEER REVIEW</span><h1 id="review-title">{module?.title[locale]??t.heading}</h1><p>{lab.title}</p></header>
  {t.languageNote&&<p class="notice" role="note">{t.languageNote}</p>}
  <div class="senior-lab-grid"><div class="senior-lab-main">
   <section class="card"><h2>{t.code}</h2><pre class="mini-code review-code"><code>{lab.code}</code></pre><p class="small-disclaimer">{t.disclaimer}</p></section>
   <section class="card"><h2>{t.risks}</h2>
    {lab.questions.map((q,qi)=><fieldset key={qi} class="senior-question" disabled={reportOnly||!!evaluation}>
     <legend><b>{qi+1}. {q.prompt}</b></legend><div class="senior-options">{q.options.map((option,index)=><label key={index} class={`senior-option ${selected?.[qi]===index?'chosen':''}`}><input type="radio" name={`${moduleId}-review-${qi}`} checked={selected?.[qi]===index} onChange={()=>setAnswers(v=>v.map((a,i)=>i===qi?index:a))}/><span>{option}</span></label>)}</div>
     {evaluation&&<div class={`feedback ${evaluation.details[qi].correct?'correct':'incorrect'}`} role="status"><b>{evaluation.details[qi].correct?t.correct:t.incorrect}.</b> {q.explanation}</div>}
    </fieldset>)}
    {reportOnly&&!previous&&<p class="notice" role="status">{t.noResult}</p>}
    <div class="rubric-actions">{!reportOnly&&<button type="button" class="btn btn-senior" onClick={submit} disabled={!!grade||answers.some(a=>a<0)}>{t.evaluate}</button>}{!reportOnly&&<button type="button" class="btn btn-outline" onClick={()=>{setAnswers([-1,-1]);setGrade(null)}}>{t.reset}</button>}<a class="text-link" href={`#/senior/${moduleId}`}>{t.back}</a></div>
    {evaluation&&<div class="notice" role="status"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}><strong>{t.results}: {evaluation.score}% · {evaluation.correct}/2</strong><button type="button" class="btn btn-outline" style={{minHeight:'32px',padding:'4px 10px',fontSize:'11px'}} onClick={copyPrFeedback}>{prCopied?'✓ Feedback copiado':'Copiar feedback de PR'}</button></div><p>{lab.practice}</p>{!reportOnly&&<a href={`#/senior/${moduleId}/review-lab/result`} class="text-link">{t.results} →</a>}</div>}
   </section></div><aside class="senior-aside"><section class="card"><h3>{t.results}</h3><p>{previous?`${previous.score}% · ${previous.correct}/2`:t.noResult}</p><p class="small-disclaimer">{lab.verification}</p><a href={`#/senior/${moduleId}/guide`} class="text-link">Go · Guide →</a></section></aside></div>
 </section>;
}
