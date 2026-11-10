import capstone from '../../content/senior/capstone.json';
type Locale='es'|'en'|'ja'|'zh'|'pt'|'fr';
const messages:Record<Locale,{heading:string;summary:string;run:string;download:string;back:string;boundaries:string;what:string;note:string}>={
 es:{heading:'Capstone de ingeniería Senior',summary:'Un sistema de pedidos local con código Go, HTTP, concurrencia y pruebas reales.',run:'Pruebas locales',download:'Descargar código y tests Go',back:'Volver a Senior',boundaries:'Límites del ejemplo',what:'Competencias y comprobaciones',note:'La descripción técnica original está en español. Esta página no ejecuta Go dentro del navegador.'},
 en:{heading:'Senior engineering capstone',summary:'A local ordering system with Go code, HTTP, concurrency and real tests.',run:'Local tests',download:'Download Go code and tests',back:'Back to Senior',boundaries:'Example limitations',what:'Skills and checks',note:'The original technical explanations are in Spanish. Go is not executed in your browser.'},
 ja:{heading:'Senior エンジニアリング総合課題',summary:'Go コード、HTTP、並行処理、実際のテストを使うローカル注文システム。',run:'ローカルテスト',download:'Go コードとテストをダウンロード',back:'Senior に戻る',boundaries:'サンプルの制限',what:'スキルと確認',note:'技術説明はスペイン語です。ブラウザで Go を実行しません。'},
 zh:{heading:'Senior 综合工程项目',summary:'包含 Go 代码、HTTP、并发和真实测试的本地订单系统。',run:'本地测试',download:'下载 Go 代码和测试',back:'返回 Senior',boundaries:'示例限制',what:'能力与检查',note:'技术说明为西班牙语。浏览器不运行 Go。'},
 pt:{heading:'Capstone de engenharia Senior',summary:'Sistema de pedidos local com Go, HTTP, concorrência e testes reais.',run:'Testes locais',download:'Baixar código Go e testes',back:'Voltar ao Senior',boundaries:'Limites do exemplo',what:'Competências e verificações',note:'As descrições técnicas estão em espanhol. Go não é executado no navegador.'},
 fr:{heading:'Projet intégrateur Senior',summary:'Système de commandes local avec Go, HTTP, concurrence et vrais tests.',run:'Tests locaux',download:'Télécharger le code Go et les tests',back:'Retour à Senior',boundaries:'Limites de l’exemple',what:'Compétences et contrôles',note:'Les descriptions techniques sont en espagnol. Go ne s’exécute pas dans ce navigateur.'}
};
export function SeniorCapstone({locale}:{locale:Locale}){
 const t=messages[locale]??messages.es;
 const base=import.meta.env.BASE_URL;
 return <section class="content-page senior-capstone" aria-labelledby="capstone-heading">
 <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="#/senior">Senior Mode</a><span>/</span><b>Capstone</b></nav>
 <header class="page-heading"><span class="eyebrow small">GO · REAL SOURCE · RACE DETECTOR</span><h1 id="capstone-heading">{t.heading}</h1><p>{t.summary}</p></header>
 {locale!=='es'&&<p class="notice" role="note">{t.note}</p>}
 <div class="capstone-flow"><span>HTTP /orders</span><span>JSON + Auth</span><span>Store + Mutex</span><span>Outbox</span></div>
 <section class="card"><h2>{t.what}</h2><div class="capstone-cards">{capstone.steps.map(s=><article class="capstone-step" key={s.id} lang="es"><span class="eyebrow small">{s.area}</span><h3>{s.title}</h3><p>{s.detail}</p><code>{s.test}</code></article>)}</div></section>
 <div class="senior-guide-grid"><section class="card"><h2>{t.run}</h2><pre class="mini-code"><code>{capstone.command}</code></pre><a class="btn btn-senior native-download" href={`${base}downloads/go-native-senior-labs.zip`} download>{t.download} ↓</a></section>
 <aside class="card" lang="es"><h2>{t.boundaries}</h2><ul>{capstone.boundaries.map((text,i)=><li key={i}>{text}</li>)}</ul></aside></div>
 <a href="#/senior" class="text-link">{t.back} →</a>
 </section>;
}
