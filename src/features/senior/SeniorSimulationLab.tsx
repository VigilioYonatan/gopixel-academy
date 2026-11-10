import { useMemo, useState } from 'preact/hooks';
import { inventoryScenario, retryStormScenario, sliceRetentionScenario, deliveryScenario, capacityScenario } from './engine/simulations.mjs';
import { simulateWorkerPool } from './engine/worker-pool.mjs';

type Locale = 'es' | 'en' | 'ja' | 'zh' | 'pt' | 'fr';

const simTexts: Record<Locale, Record<string, string>> = {
  es: {
    s05Title: 'S05 · Simulador de worker pool · Modelo determinista',
    s05Subtitle: 'No ejecuta goroutines Go ni mide rendimiento real. Simula una cola acotada y trabajadores con duración fija de tres pasos.',
    workers: 'Trabajadores',
    queueCap: 'Capacidad de cola',
    arrivalRate: 'Llegadas por paso',
    arrived: 'recibidos',
    completed: 'completados',
    rejected: 'rechazados',
    peakQueue: 'cola máxima',
    utilization: 'ocupación modelada',
    s05Disclaimer: 'Aumenta la capacidad para absorber ráfagas, o aumenta los trabajadores para procesar más rápidamente. Analiza también el costo en recursos y la latencia.',
    
    s07Title: 'S07 · Retención de backing array',
    s07Subtitle: 'Modelo conceptual de una subslice que conserva su array subyacente.',
    backingSize: 'Tamaño del backing array',
    copyNeeded: 'Copiar los 100 bytes necesarios',
    modeledRetained: 'Memoria modelada retenida',
    excessRetained: 'Exceso retenido',
    s07Disclaimer: 'Modelo simplificado sin GC, encabezados ni asignaciones reales. Para validar usa pprof fuera del navegador.',
    
    s09Title: 'S09 · Mensajes duplicados',
    s09Subtitle: 'Modelo de entrega al menos una vez, con reprocesamiento.',
    origEvents: 'Eventos originales',
    replayMessages: 'Mensajes repetidos',
    idempotentConsumer: 'Consumidor idempotente',
    deliveries: 'Entregas',
    effects: 'Efectos',
    duplicateEffects: 'Efectos duplicados',
    s09Disclaimer: 'No ejecuta broker, base de datos ni red. La idempotencia real requiere almacenamiento y garantías de concurrencia.',
    
    s10Title: 'S10 · Consistencia del inventario',
    s10Subtitle: 'Modelo determinista que compara lecturas concurrentes sin control y actualización atómica. No conecta a PostgreSQL.',
    initStock: 'Stock inicial',
    concurrentBuyers: 'Compradores simultáneos',
    atomicUpdate: 'Actualización atómica',
    confirmedOps: 'Operaciones confirmadas',
    finalStock: 'Saldo final',
    overselling: 'Sobreventa',
    invariantFailed: 'Invariante incumplida: stock negativo.',
    invariantKept: 'Invariante mantenida: stock no negativo.',
    s10Disclaimer: 'Simulación conceptual; las bases de datos reales exigen transacciones, locks o updates condicionales según el caso.',
    
    s11Title: 'S11 · Tormenta de reintentos',
    s11Subtitle: 'Modelo por generaciones con fallos deterministas. El modo acotado limita a un reintento. No mide latencia ni ejecuta HTTP.',
    requests: 'Solicitudes',
    failuresPerGen: 'Fallos por generación',
    maxRetries: 'Reintentos máximos',
    boundedPolicy: 'Política de reintentos acotada',
    totalAttempts: 'Intentos totales',
    retries: 'Reintentos',
    amplification: 'Amplificación',
    unresolved: 'Sin resolver',
    s11Disclaimer: 'El backoff+jitter real distribuye intentos a lo largo del tiempo; aquí solo se representa el presupuesto de reintentos.',
    
    s18Title: 'S18 · Capacidad y backpressure',
    s18Subtitle: 'Cola acotada con llegadas y servicio constantes durante 12 pasos.',
    arrivalsPerStep: 'Llegadas por paso',
    processedPerStep: 'Procesados por paso',
    processed: 'Procesados',
    queued: 'En cola',
    s18Disclaimer: 'Modelo determinista; no representa métricas Go ni latencias de producción.'
  },
  en: {
    s05Title: 'S05 · Worker pool simulator · Deterministic model',
    s05Subtitle: 'Does not run Go goroutines or measure actual performance. Simulates a bounded queue with workers running a fixed three-step task.',
    workers: 'Workers',
    queueCap: 'Queue capacity',
    arrivalRate: 'Arrivals per tick',
    arrived: 'received',
    completed: 'completed',
    rejected: 'rejected',
    peakQueue: 'peak queue',
    utilization: 'modeled utilization',
    s05Disclaimer: 'Increase capacity to absorb bursts, or increase workers to process faster. Consider resource cost and latency trade-offs.',
    
    s07Title: 'S07 · Backing array retention',
    s07Subtitle: 'Conceptual model of a subslice that keeps its underlying array in memory.',
    backingSize: 'Backing array size',
    copyNeeded: 'Copy the needed 100 bytes',
    modeledRetained: 'Modeled retained memory',
    excessRetained: 'Excess retained',
    s07Disclaimer: 'Simplified model without GC overhead, headers or real allocations. To validate, use pprof outside the browser.',
    
    s09Title: 'S09 · Duplicate messages',
    s09Subtitle: 'At-least-once delivery model with reprocessing.',
    origEvents: 'Original events',
    replayMessages: 'Replayed messages',
    idempotentConsumer: 'Idempotent consumer',
    deliveries: 'Deliveries',
    effects: 'Effects',
    duplicateEffects: 'Duplicate effects',
    s09Disclaimer: 'Does not execute broker, database, or network. Real idempotency requires persistent storage and concurrency safety.',
    
    s10Title: 'S10 · Inventory consistency',
    s10Subtitle: 'Deterministic model comparing unsynchronized reads to atomic updates. Does not connect to PostgreSQL.',
    initStock: 'Initial stock',
    concurrentBuyers: 'Concurrent buyers',
    atomicUpdate: 'Atomic update',
    confirmedOps: 'Confirmed orders',
    finalStock: 'Final stock',
    overselling: 'Oversold',
    invariantFailed: 'Invariant violated: negative stock.',
    invariantKept: 'Invariant maintained: stock remains non-negative.',
    s10Disclaimer: 'Conceptual simulation; production databases require transactions, row locks, or conditional updates.',
    
    s11Title: 'S11 · Retry storm',
    s11Subtitle: 'Generational model with deterministic failures. Bounded mode caps retries to prevent cascading failure. Does not run HTTP.',
    requests: 'Requests',
    failuresPerGen: 'Failures per generation',
    maxRetries: 'Max retries',
    boundedPolicy: 'Bounded retry budget',
    totalAttempts: 'Total attempts',
    retries: 'Retries',
    amplification: 'Amplification',
    unresolved: 'Unresolved',
    s11Disclaimer: 'Real backoff with jitter spreads load over time; this model illustrates the retry budget.',
    
    s18Title: 'S18 · Capacity and backpressure',
    s18Subtitle: 'Bounded queue with constant arrival and service rates over 12 ticks.',
    arrivalsPerStep: 'Arrivals per tick',
    processedPerStep: 'Processed per tick',
    processed: 'Processed',
    queued: 'Queued',
    s18Disclaimer: 'Deterministic model; does not represent live Go metrics or production latencies.'
  },
  ja: {
    s05Title: 'S05 · ワーカープールシミュレーター（決定論的モデル）',
    s05Subtitle: '実際のGo goroutine実行ではなく、有限キューと3ステップ処理のモデルです。',
    workers: 'ワーカー数',
    queueCap: 'キュー容量',
    arrivalRate: 'ステップごとの到着数',
    arrived: '受信',
    completed: '完了',
    rejected: '拒否',
    peakQueue: '最大キュー長',
    utilization: '稼働率',
    s05Disclaimer: '容量を増やすとバーストを吸収し、ワーカーを増やすと処理が高速化します。リソースと遅延のトレードオフを検討してください。',
    s07Title: 'S07 · 配列保持モデル',
    s07Subtitle: '部分スライスが元配列全体をメモリに保持する概念モデルです。',
    backingSize: '元配列サイズ',
    copyNeeded: '必要な100バイトをコピーする',
    modeledRetained: '保持メモリ',
    excessRetained: '余剰保持メモリ',
    s07Disclaimer: 'GCやアロケーションを簡略化したモデルです。本番検証にはpprofを使用してください。',
    s09Title: 'S09 · 重複メッセージ',
    s09Subtitle: '再処理を伴う少なくとも1回の配信モデル。',
    origEvents: '元のイベント',
    replayMessages: '再送メッセージ',
    idempotentConsumer: '冪等なコンシューマー',
    deliveries: '配信数',
    effects: '実行効果数',
    duplicateEffects: '重複効果数',
    s09Disclaimer: 'メッセージブローカーやDBは実行しません。本番の冪等性には永続化と排他制御が必要です。',
    s10Title: 'S10 · 在庫の一貫性',
    s10Subtitle: '非同期読み取りとアトミック更新を比較する決定論的モデル。',
    initStock: '初期在庫',
    concurrentBuyers: '同時購入者数',
    atomicUpdate: 'アトミック更新',
    confirmedOps: '確定注文数',
    finalStock: '最終在庫',
    overselling: '過剰販売数',
    invariantFailed: '不変条件違反：在庫がマイナスです。',
    invariantKept: '不変条件維持：在庫は非負です。',
    s10Disclaimer: '教育用シミュレーションです。本番環境ではトランザクションや行ロックが必要です。',
    s11Title: 'S11 · リトライストーム',
    s11Subtitle: '決定論的障害におけるリトライ増幅モデル。',
    requests: 'リクエスト数',
    failuresPerGen: '失敗率',
    maxRetries: '最大リトライ数',
    boundedPolicy: '制限付きリトライ方針',
    totalAttempts: '総試行数',
    retries: 'リトライ数',
    amplification: '増幅率',
    unresolved: '未解決数',
    s11Disclaimer: '実際のバックオフとジッターは負荷を時間分散します。ここではリトライ予算を示しています。',
    s18Title: 'S18 · 容量とバックプレッシャー',
    s18Subtitle: '12ステップにわたる有限キューと処理能力のモデル。',
    arrivalsPerStep: '到着数／ステップ',
    processedPerStep: '処理数／ステップ',
    processed: '処理済み',
    queued: '待機中',
    s18Disclaimer: '決定論的モデルであり、Goの測定値や本番遅延を示すものではありません。'
  },
  zh: {
    s05Title: 'S05 · 工作池模拟器 · 确定性模型',
    s05Subtitle: '不执行真实 Go 协程，模拟有界队列与固定3步时长的处理模型。',
    workers: '工作协程数',
    queueCap: '队列容量',
    arrivalRate: '每步到达数',
    arrived: '已接收',
    completed: '已完成',
    rejected: '已拒绝',
    peakQueue: '峰值排队',
    utilization: '模拟利用率',
    s05Disclaimer: '增加容量可吸收突发流量，增加工作协程可加快处理。权衡资源消耗与延迟。',
    s07Title: 'S07 · 底层数组内存保留',
    s07Subtitle: '子切片引用导致底层大数组无法释放的概念模型。',
    backingSize: '底层数组大小',
    copyNeeded: '复制所需的 100 字节',
    modeledRetained: '保留内存',
    excessRetained: '多余保留内存',
    s07Disclaimer: '简化教学模型，未包含 GC 开销。实际性能验证请在本地使用 pprof。',
    s09Title: 'S09 · 重复消息处理',
    s09Subtitle: '至少一次投递与重试模型。',
    origEvents: '原始事件数',
    replayMessages: '重发消息数',
    idempotentConsumer: '启用幂等消费',
    deliveries: '投递次数',
    effects: '产生效果次数',
    duplicateEffects: '重复效果次数',
    s09Disclaimer: '未运行消息中间件或数据库。生产级幂等需要持久化存储与并发控制。',
    s10Title: 'S10 · 库存一致性模型',
    s10Subtitle: '比较非受控并发读取与原子更新的确定性模型。',
    initStock: '初始库存',
    concurrentBuyers: '并发购买人数',
    atomicUpdate: '原子更新',
    confirmedOps: '确认订单数',
    finalStock: '最终库存',
    overselling: '超卖数',
    invariantFailed: '违反不变量：库存出现负数。',
    invariantKept: '保持不变量：库存非负。',
    s10Disclaimer: '概念模拟；生产数据库需要事务、行级锁或条件更新。',
    s11Title: 'S11 · 重试风暴',
    s11Subtitle: '分代确定性失败与重试放大模型。',
    requests: '请求总数',
    failuresPerGen: '每代失败率',
    maxRetries: '最大重试次数',
    boundedPolicy: '有界重试预算策略',
    totalAttempts: '总尝试次数',
    retries: '重试次数',
    amplification: '放大倍数',
    unresolved: '未解决请求',
    s11Disclaimer: '实际退避加抖动会在时间维度上分散负载；本模型展示重试预算消耗。',
    s18Title: 'S18 · 容量与背压',
    s18Subtitle: '12 步恒定流入与处理速率的有界队列模型。',
    arrivalsPerStep: '每步流入',
    processedPerStep: '每步处理',
    processed: '已处理',
    queued: '排队中',
    s18Disclaimer: '确定性模型；不代表 Go 生产环境性能指标或实际延迟。'
  },
  pt: {
    s05Title: 'S05 · Simulador de worker pool · Modelo determinístico',
    s05Subtitle: 'Não executa goroutines Go nem mede desempenho real. Simula fila limitada e workers com duração fixa de três passos.',
    workers: 'Workers',
    queueCap: 'Capacidade da fila',
    arrivalRate: 'Chegadas por passo',
    arrived: 'recebidos',
    completed: 'concluídos',
    rejected: 'rejeitados',
    peakQueue: 'fila máxima',
    utilization: 'ocupação modelada',
    s05Disclaimer: 'Aumente a capacidade para absorver rajadas ou adicione workers para processar mais rápido. Considere custos de recursos e latência.',
    s07Title: 'S07 · Retenção de array subjacente',
    s07Subtitle: 'Modelo conceitual de uma subslice que retém seu array subjacente na memória.',
    backingSize: 'Tamanho do array',
    copyNeeded: 'Copiar os 100 bytes necessários',
    modeledRetained: 'Memória retida modelada',
    excessRetained: 'Excesso retido',
    s07Disclaimer: 'Modelo simplificado sem custos de GC ou cabeçalhos. Para validar, use pprof fora do navegador.',
    s09Title: 'S09 · Mensagens duplicadas',
    s09Subtitle: 'Modelo de entrega pelo menos uma vez, com reprocessamento.',
    origEvents: 'Eventos originais',
    replayMessages: 'Mensagens repetidas',
    idempotentConsumer: 'Consumidor idempotente',
    deliveries: 'Entregas',
    effects: 'Efeitos',
    duplicateEffects: 'Efeitos duplicados',
    s09Disclaimer: 'Não executa broker, banco de dados ou rede. Idempotência real exige armazenamento persistente e concorrência segura.',
    s10Title: 'S10 · Consistência do estoque',
    s10Subtitle: 'Modelo determinístico comparando leituras não sincronizadas com atualização atômica.',
    initStock: 'Estoque inicial',
    concurrentBuyers: 'Compradores simultâneos',
    atomicUpdate: 'Atualização atômica',
    confirmedOps: 'Pedidos confirmados',
    finalStock: 'Estoque final',
    overselling: 'Sobrevenda',
    invariantFailed: 'Invariante violada: estoque negativo.',
    invariantKept: 'Invariante mantida: estoque não negativo.',
    s10Disclaimer: 'Simulação conceitual; bancos em produção requerem transações ou travas de linha.',
    s11Title: 'S11 · Tempestade de retentativas',
    s11Subtitle: 'Modelo geracional de falhas determinísticas com amplificação.',
    requests: 'Requisições',
    failuresPerGen: 'Falhas por geração',
    maxRetries: 'Retentativas máximas',
    boundedPolicy: 'Política limitada de retentativas',
    totalAttempts: 'Tentativas totais',
    retries: 'Retentativas',
    amplification: 'Amplificação',
    unresolved: 'Não resolvidos',
    s11Disclaimer: 'Backoff com jitter distribui a carga no tempo; aqui é mostrado o orçamento de retentativas.',
    s18Title: 'S18 · Capacidade e backpressure',
    s18Subtitle: 'Fila limitada com chegada e taxa de serviço constantes em 12 passos.',
    arrivalsPerStep: 'Chegadas por passo',
    processedPerStep: 'Processados por passo',
    processed: 'Processados',
    queued: 'Na fila',
    s18Disclaimer: 'Modelo determinístico; não representa métricas reais de Go ou latências de produção.'
  },
  fr: {
    s05Title: 'S05 · Simulateur de pool d’exécutants · Modèle déterministe',
    s05Subtitle: 'N’exécute pas de goroutines Go. Simule une file d’attente bornée et des travailleurs à tâche fixe de trois étapes.',
    workers: 'Exécutants',
    queueCap: 'Capacité de la file',
    arrivalRate: 'Arrivées par étape',
    arrived: 'reçus',
    completed: 'terminés',
    rejected: 'rejetés',
    peakQueue: 'file maximale',
    utilization: 'taux d’occupation',
    s05Disclaimer: 'Augmentez la capacité pour absorber les pics ou le nombre d’exécutants pour traiter plus vite.',
    s07Title: 'S07 · Rétention du tableau sous-jacent',
    s07Subtitle: 'Modèle conceptuel d’une sous-tranche conservant son tableau sous-jacent en mémoire.',
    backingSize: 'Taille du tableau',
    copyNeeded: 'Copier les 100 octets nécessaires',
    modeledRetained: 'Mémoire modélisée retenue',
    excessRetained: 'Excédent retenu',
    s07Disclaimer: 'Modèle simplifié sans allocations réelles. Utilisez pprof hors navigateur pour valider.',
    s09Title: 'S09 · Messages dupliqués',
    s09Subtitle: 'Modèle de livraison au moins une fois avec retriatement.',
    origEvents: 'Événements originaux',
    replayMessages: 'Messages rejoués',
    idempotentConsumer: 'Consommateur idempotent',
    deliveries: 'Livraisons',
    effects: 'Effets produits',
    duplicateEffects: 'Effets dupliqués',
    s09Disclaimer: 'N’exécute aucun broker ni base de données. L’idempotence réelle exige stockage et atomicité.',
    s10Title: 'S10 · Cohérence des stocks',
    s10Subtitle: 'Modèle déterministe comparant lectures concurrentes sans verrou et mise à jour atomique.',
    initStock: 'Stock initial',
    concurrentBuyers: 'Acheteurs simultanés',
    atomicUpdate: 'Mise à jour atomique',
    confirmedOps: 'Commandes confirmées',
    finalStock: 'Stock final',
    overselling: 'Survente',
    invariantFailed: 'Invariant violé : stock négatif.',
    invariantKept: 'Invariant respecté : stock non négatif.',
    s10Disclaimer: 'Simulation conceptuelle ; les bases réelles exigent transactions ou verrous.',
    s11Title: 'S11 · Tempête de réessais',
    s11Subtitle: 'Modèle générationnel de pannes et d’amplification de charge.',
    requests: 'Requêtes',
    failuresPerGen: 'Échecs par génération',
    maxRetries: 'Réessais maximaux',
    boundedPolicy: 'Politique de réessais bornée',
    totalAttempts: 'Tentatives totales',
    retries: 'Réessais',
    amplification: 'Amplification',
    unresolved: 'Non résolus',
    s11Disclaimer: 'Le backoff avec gigue étale la charge dans le temps ; ce modèle illustre le budget de réessais.',
    s18Title: 'S18 · Capacité et contre-pression',
    s18Subtitle: 'File bornée avec flux constant d’arrivées et de traitement sur 12 étapes.',
    arrivalsPerStep: 'Arrivées par étape',
    processedPerStep: 'Traités par étape',
    processed: 'Traités',
    queued: 'En attente',
    s18Disclaimer: 'Modèle déterministe ; ne reflète pas les métriques Go ou latences de production.'
  }
};

/** Teaching-only models. Values are calculated, never billed as real Go performance. */
export function SeniorSimulationLab({ moduleId, locale = 'es' }: { moduleId: string; locale?: string }) {
  const lang = (simTexts[locale as Locale] ? locale : 'es') as Locale;
  const t = simTexts[lang];

  // S05 State
  const [workerCount, setWorkerCount] = useState(4);
  const [queueCapacity, setQueueCapacity] = useState(12);
  const [arrivalRate, setArrivalRate] = useState(6);
  const workerSim = useMemo(
    () => simulateWorkerPool({ workers: workerCount, capacity: queueCapacity, arrivalPerTick: arrivalRate, serviceTicks: 3, ticks: 30 }),
    [workerCount, queueCapacity, arrivalRate]
  );

  // S07 State
  const [backing, setBacking] = useState(1000);
  const [copy, setCopy] = useState(false);

  // S09 State
  const [events, setEvents] = useState(20);
  const [replays, setReplays] = useState(3);
  const [idempotent, setIdempotent] = useState(false);

  // S18 State
  const [incoming, setIncoming] = useState(20);
  const [service, setService] = useState(10);
  const [capacity, setCapacity] = useState(40);

  // S10 State
  const [stock, setStock] = useState(1);
  const [customers, setCustomers] = useState(3);
  const [atomic, setAtomic] = useState(false);
  const inv = useMemo(() => inventoryScenario({ stock, customers, mode: atomic ? 'atomic' : 'unsafe' }), [stock, customers, atomic]);

  // S11 State
  const [requests, setRequests] = useState(100);
  const [failures, setFailures] = useState(50);
  const [retries, setRetries] = useState(3);
  const [bounded, setBounded] = useState(false);
  const storm = useMemo(() => retryStormScenario({ requests, failurePercent: failures, maxRetries: retries, policy: bounded ? 'bounded' : 'immediate' }), [requests, failures, retries, bounded]);

  if (moduleId === 'S05') {
    return (
      <section class="card worker-lab" aria-label="Simulador de worker pool">
        <h2>{t.s05Title}</h2>
        <p class="muted">{t.s05Subtitle}</p>
        <div class="worker-controls">
          <label>
            {t.workers}: {workerCount}
            <input type="range" min="1" max="16" value={workerCount} onInput={e => setWorkerCount(Number(e.currentTarget.value))} />
          </label>
          <label>
            {t.queueCap}: {queueCapacity}
            <input type="range" min="0" max="100" value={queueCapacity} onInput={e => setQueueCapacity(Number(e.currentTarget.value))} />
          </label>
          <label>
            {t.arrivalRate}: {arrivalRate}
            <input type="range" min="1" max="20" value={arrivalRate} onInput={e => setArrivalRate(Number(e.currentTarget.value))} />
          </label>
        </div>
        <div class="worker-metrics">
          <span><b>{workerSim.arrived}</b> {t.arrived}</span>
          <span><b>{workerSim.completed}</b> {t.completed}</span>
          <span><b>{workerSim.rejected}</b> {t.rejected}</span>
          <span><b>{workerSim.peakQueue}</b> {t.peakQueue}</span>
          <span><b>{workerSim.utilization}%</b> {t.utilization}</span>
        </div>
        <p class="small-disclaimer">{t.s05Disclaimer}</p>
      </section>
    );
  }

  if (moduleId === 'S07') {
    const r = sliceRetentionScenario({ backingBytes: backing * 1000, retainedBytes: 100, copy });
    return (
      <section class="card worker-lab" aria-label="Simulador de retención de memoria">
        <h2>{t.s07Title}</h2>
        <p class="muted">{t.s07Subtitle}</p>
        <div class="worker-controls">
          <label>
            {t.backingSize}: {backing} KB
            <input type="range" min="100" max="10000" step="100" value={backing} onInput={e => setBacking(Number(e.currentTarget.value))} />
          </label>
          <label>
            {t.copyNeeded}
            <input type="checkbox" checked={copy} onChange={e => setCopy(e.currentTarget.checked)} />
          </label>
        </div>
        <div class="worker-metrics">
          <span>{t.modeledRetained}: <b>{r.modeledRetained.toLocaleString()} B</b></span>
          <span>{t.excessRetained}: <b>{r.extraBytes.toLocaleString()} B</b></span>
        </div>
        <p class="small-disclaimer">{t.s07Disclaimer}</p>
      </section>
    );
  }

  if (moduleId === 'S09') {
    const r = deliveryScenario({ events, replays, idempotent });
    return (
      <section class="card worker-lab" aria-label="Simulador de mensajes duplicados">
        <h2>{t.s09Title}</h2>
        <p class="muted">{t.s09Subtitle}</p>
        <div class="worker-controls">
          <label>
            {t.origEvents}: {events}
            <input type="range" min="1" max="100" value={events} onInput={e => { const n = Number(e.currentTarget.value); setEvents(n); setReplays(v => Math.min(v, n)); }} />
          </label>
          <label>
            {t.replayMessages}: {replays}
            <input type="range" min="0" max={events} value={replays} onInput={e => setReplays(Number(e.currentTarget.value))} />
          </label>
          <label>
            {t.idempotentConsumer}
            <input type="checkbox" checked={idempotent} onChange={e => setIdempotent(e.currentTarget.checked)} />
          </label>
        </div>
        <div class="worker-metrics">
          <span>{t.deliveries}: <b>{r.deliveries}</b></span>
          <span>{t.effects}: <b>{r.effects}</b></span>
          <span>{t.duplicateEffects}: <b>{r.duplicateEffects}</b></span>
        </div>
        <p class="small-disclaimer">{t.s09Disclaimer}</p>
      </section>
    );
  }

  if (moduleId === 'S18') {
    const r = capacityScenario({ arrivalsPerTick: incoming, servedPerTick: service, capacity, ticks: 12 });
    return (
      <section class="card worker-lab" aria-label="Simulador de capacidad y backpressure">
        <h2>{t.s18Title}</h2>
        <p class="muted">{t.s18Subtitle}</p>
        <div class="worker-controls">
          <label>
            {t.arrivalsPerStep}: {incoming}
            <input type="range" min="0" max="80" value={incoming} onInput={e => setIncoming(Number(e.currentTarget.value))} />
          </label>
          <label>
            {t.processedPerStep}: {service}
            <input type="range" min="0" max="80" value={service} onInput={e => setService(Number(e.currentTarget.value))} />
          </label>
          <label>
            {t.queueCap}: {capacity}
            <input type="range" min="0" max="200" value={capacity} onInput={e => setCapacity(Number(e.currentTarget.value))} />
          </label>
        </div>
        <div class="worker-metrics">
          <span>{t.processed}: <b>{r.completed}</b></span>
          <span>{t.queued}: <b>{r.queued}</b></span>
          <span>{t.rejected}: <b>{r.rejected}</b></span>
        </div>
        <p class="small-disclaimer">{t.s18Disclaimer}</p>
      </section>
    );
  }

  if (moduleId === 'S10') {
    return (
      <section class="card worker-lab" aria-label="Simulador de inventario">
        <h2>{t.s10Title}</h2>
        <p class="muted">{t.s10Subtitle}</p>
        <div class="worker-controls">
          <label>
            {t.initStock}: {stock}
            <input type="range" min="0" max="12" value={stock} onInput={e => setStock(Number(e.currentTarget.value))} />
          </label>
          <label>
            {t.concurrentBuyers}: {customers}
            <input type="range" min="1" max="15" value={customers} onInput={e => setCustomers(Number(e.currentTarget.value))} />
          </label>
          <label>
            <span>{t.atomicUpdate}</span>
            <input type="checkbox" checked={atomic} onChange={e => setAtomic(e.currentTarget.checked)} />
          </label>
        </div>
        <div class="worker-metrics">
          <span>{t.confirmedOps}: <b>{inv.fulfilled}</b></span>
          <span>{t.finalStock}: <b>{inv.finalStock}</b></span>
          <span>{t.overselling}: <b>{inv.oversold}</b></span>
        </div>
        <p class={inv.violatesInvariant ? 'feedback incorrect' : 'feedback correct'}>
          {inv.violatesInvariant ? t.invariantFailed : t.invariantKept}
        </p>
        <p class="small-disclaimer">{t.s10Disclaimer}</p>
      </section>
    );
  }

  if (moduleId === 'S11') {
    return (
      <section class="card worker-lab" aria-label="Simulador de reintentos">
        <h2>{t.s11Title}</h2>
        <p class="muted">{t.s11Subtitle}</p>
        <div class="worker-controls">
          <label>
            {t.requests}: {requests}
            <input type="range" min="10" max="300" step="10" value={requests} onInput={e => setRequests(Number(e.currentTarget.value))} />
          </label>
          <label>
            {t.failuresPerGen}: {failures}%
            <input type="range" min="0" max="100" step="10" value={failures} onInput={e => setFailures(Number(e.currentTarget.value))} />
          </label>
          <label>
            {t.maxRetries}: {retries}
            <input type="range" min="0" max="6" value={retries} onInput={e => setRetries(Number(e.currentTarget.value))} />
          </label>
          <label>
            {t.boundedPolicy}
            <input type="checkbox" checked={bounded} onChange={e => setBounded(e.currentTarget.checked)} />
          </label>
        </div>
        <div class="worker-metrics">
          <span>{t.totalAttempts}: <b>{storm.attempts}</b></span>
          <span>{t.retries}: <b>{storm.retryAttempts}</b></span>
          <span>{t.amplification}: <b>{storm.amplification}×</b></span>
          <span>{t.unresolved}: <b>{storm.unresolved}</b></span>
        </div>
        <p class="small-disclaimer">{t.s11Disclaimer}</p>
      </section>
    );
  }

  return null;
}
