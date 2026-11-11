import { useMemo, useState } from 'preact/hooks';
import {
  inventoryScenario,
  retryStormScenario,
  sliceRetentionScenario,
  deliveryScenario,
  capacityScenario,
  idempotencyWindowScenario,
  dataRaceScenario,
  latencyPercentilesScenario,
  gracefulShutdownScenario,
} from './engine/simulations.mjs';
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
    s18Disclaimer: 'Modelo determinista; no representa métricas Go ni latencias de producción.',
    s03Title: 'S03 · Idempotencia y expiración TTL de caché',
    s03Subtitle: 'Modelo conceptual de deduplicación con ventana de expiración en segundos.',
    dupRate: 'Tasa de duplicados',
    ttlSeconds: 'TTL del caché (seg)',
    windowSeconds: 'Ventana de reintentos (seg)',
    uniqueReqs: 'Peticiones únicas',
    filteredDups: 'Duplicados filtrados',
    leakedDups: 'Duplicados filtrados a BD',
    dbWrites: 'Escrituras finales en BD',
    s03Disclaimer: 'Modelo conceptual determinista; en producción se requiere Redis SETNX o transacciones PostgreSQL.',
    s06Title: 'S06 · Condiciones de carrera vs sincronización atómica',
    s06Subtitle: 'Modelo conceptual de escrituras concurrentes sin mutex vs sync/atomic.',
    goroutines: 'Goroutines',
    iterations: 'Iteraciones por goroutine',
    syncMode: 'Modo de sincronización',
    syncNone: 'Sin sincronización (Race)',
    syncAtomic: 'sync/atomic (Atómico)',
    syncMutex: 'sync.Mutex (Exclusión mutua)',
    targetCount: 'Conteo esperado',
    finalCount: 'Conteo alcanzado',
    lostUpdates: 'Actualizaciones perdidas',
    raceDetected: 'Condición de carrera detectada (escrituras perdidas).',
    raceClean: 'Sin condición de carrera: sincronización segura.',
    s06Disclaimer: 'Modelo conceptual sin compilador Go. Ejecuta "go test -race" en tu terminal para validar código real.',
    s14Title: 'S14 · Latencia de cola P99 y presión de memoria',
    s14Subtitle: 'Impacto de las asignaciones de memoria y el GC pacer en los percentiles P50, P90 y P99.',
    baseLatency: 'Latencia base (ms)',
    allocsPerOp: 'Asignaciones por op',
    gogcPercent: 'GOGC (%)',
    p50Label: 'P50 (mediana)',
    p90Label: 'P90',
    p99Label: 'P99 (cola crítica)',
    jitterLabel: 'Jitter (P99 - P50)',
    s14Disclaimer: 'Modelo determinista didáctico; el GC real de Go depende de concurrencia de CPUs, memoria residente y pausas STW.',
    s15Title: 'S15 · Drenado de conexiones en Graceful Shutdown',
    s15Subtitle: 'Comparación entre terminación abrupta (SIGKILL) y drenado ordenado con http.Server.Shutdown(ctx).',
    inFlightReqs: 'Peticiones en vuelo',
    drainTimeout: 'Timeout de drenado (seg)',
    reqDuration: 'Duración de peticiones (seg)',
    shutdownStrat: 'Estrategia de apagado',
    stratGraceful: 'Graceful (Shutdown ordenado)',
    stratHard: 'Abrupto (SIGKILL inmediato)',
    drainedCleanly: 'Completadas con éxito',
    droppedConns: 'Conexiones caídas (502/RST)',
    zeroDowntime: 'Zero-Downtime: ninguna petición interrumpida.',
    downtimeOccurred: 'Caída de servicio: conexiones de clientes destruidas.',
    s15Disclaimer: 'Simulación didáctica; en Kubernetes o Linux se coordina con preStop hooks y balanceadores.',
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
    s18Disclaimer: 'Deterministic model; does not represent live Go metrics or production latencies.',
    s03Title: 'S03 · Idempotency and cache TTL expiration',
    s03Subtitle: 'Conceptual deduplication model with retry window and expiration.',
    dupRate: 'Duplicate rate',
    ttlSeconds: 'Cache TTL (sec)',
    windowSeconds: 'Retry window (sec)',
    uniqueReqs: 'Unique requests',
    filteredDups: 'Filtered duplicates',
    leakedDups: 'Leaked to DB',
    dbWrites: 'Total DB writes',
    s03Disclaimer: 'Conceptual deterministic model; production systems require Redis SETNX or PostgreSQL transactions.',
    s06Title: 'S06 · Data race vs atomic synchronization',
    s06Subtitle: 'Conceptual model of unsynchronized concurrent writes vs sync/atomic.',
    goroutines: 'Goroutines',
    iterations: 'Iterations per goroutine',
    syncMode: 'Sync mode',
    syncNone: 'No synchronization (Race)',
    syncAtomic: 'sync/atomic (Atomic)',
    syncMutex: 'sync.Mutex (Mutual exclusion)',
    targetCount: 'Expected count',
    finalCount: 'Reached count',
    lostUpdates: 'Lost updates',
    raceDetected: 'Data race detected (lost updates).',
    raceClean: 'Clean: race-free synchronization.',
    s06Disclaimer: 'Conceptual model without Go runtime. Run "go test -race" locally to verify real Go code.',
    s14Title: 'S14 · P99 tail latency and memory pressure',
    s14Subtitle: 'Impact of memory allocations and GC pacing on P50, P90, and P99 percentiles.',
    baseLatency: 'Base latency (ms)',
    allocsPerOp: 'Allocs per op',
    gogcPercent: 'GOGC (%)',
    p50Label: 'P50 (median)',
    p90Label: 'P90',
    p99Label: 'P99 (tail latency)',
    jitterLabel: 'Jitter (P99 - P50)',
    s14Disclaimer: 'Pedagogical deterministic model; real Go GC depends on core count, heap size, and STW pauses.',
    s15Title: 'S15 · Connection draining in Graceful Shutdown',
    s15Subtitle: 'Comparison between hard abort (SIGKILL) and clean draining with http.Server.Shutdown(ctx).',
    inFlightReqs: 'In-flight requests',
    drainTimeout: 'Drain timeout (sec)',
    reqDuration: 'Request duration (sec)',
    shutdownStrat: 'Shutdown strategy',
    stratGraceful: 'Graceful (Orderly drain)',
    stratHard: 'Hard abort (Immediate SIGKILL)',
    drainedCleanly: 'Completed cleanly',
    droppedConns: 'Dropped connections (502/RST)',
    zeroDowntime: 'Zero-Downtime: zero requests interrupted.',
    downtimeOccurred: 'Downtime: client connections abruptly severed.',
    s15Disclaimer: 'Pedagogical model; real deployments coordinate with Kubernetes preStop hooks and load balancers.',
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
    s18Disclaimer: '決定論的モデルであり、Goの測定値や本番遅延を示すものではありません。',
    s03Title: 'S03 · 冪等性とキャッシュTTLの有効期限',
    s03Subtitle: 'スライディングウィンドウと有効期限を持つ重複排除モデル。',
    dupRate: '重複率',
    ttlSeconds: 'キャッシュTTL（秒）',
    windowSeconds: 'リトライウィンドウ（秒）',
    uniqueReqs: '一意なリクエスト',
    filteredDups: '除外された重複',
    leakedDups: 'DBへ漏れた重複',
    dbWrites: 'DBへの最終書込数',
    s03Disclaimer: '決定論的モデルです。本番ではRedis SETNXやDBトランザクションが必要です。',
    s06Title: 'S06 · データレースとアトミック同期',
    s06Subtitle: '非同期並行書き込みとsync/atomicの比較モデル。',
    goroutines: 'Goroutines',
    iterations: '反復回数',
    syncMode: '同期モード',
    syncNone: '同期なし（レース）',
    syncAtomic: 'sync/atomic（アトミック）',
    syncMutex: 'sync.Mutex（排他制御）',
    targetCount: '期待値',
    finalCount: '達成値',
    lostUpdates: '失われた更新',
    raceDetected: 'データレース検出（更新の消失）。',
    raceClean: 'データレースなし：安全に同期。',
    s06Disclaimer: 'Goランタイムなしの概念モデルです。実コードは「go test -race」で検証してください。',
    s14Title: 'S14 · テール遅延 P99 とメモリ圧力',
    s14Subtitle: 'メモリ割り当てとGCが P50, P90, P99 遅延に与える影響。',
    baseLatency: '基本遅延 (ms)',
    allocsPerOp: '割り当て回数/op',
    gogcPercent: 'GOGC (%)',
    p50Label: 'P50（中央値）',
    p90Label: 'P90',
    p99Label: 'P99（テール遅延）',
    jitterLabel: 'ジッター (P99 - P50)',
    s14Disclaimer: '教育用決定論的モデルです。実際のGo GCはCPU数やヒープサイズに依存します。',
    s15Title: 'S15 · グレースフルシャットダウンの接続ドレイン',
    s15Subtitle: '強制終了 (SIGKILL) と http.Server.Shutdown(ctx) による正常ドレインの比較。',
    inFlightReqs: '処理中のリクエスト',
    drainTimeout: 'ドレイン猶予時間（秒）',
    reqDuration: 'リクエスト処理時間（秒）',
    shutdownStrat: 'シャットダウン戦略',
    stratGraceful: 'グレースフル（正常排空）',
    stratHard: '強制終了 (SIGKILL)',
    drainedCleanly: '正常完了',
    droppedConns: '切断された接続 (502/RST)',
    zeroDowntime: 'ゼロダウンタイム：中断されたリクエストなし。',
    downtimeOccurred: 'サービス中断：クライアント接続が切断されました。',
    s15Disclaimer: '教育用モデルです。本番ではKubernetes preStopフックやLBと連携します。',
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
    s18Disclaimer: '确定性模型；不代表 Go 生产环境性能指标或实际延迟。',
    s03Title: 'S03 · 幂等性与缓存 TTL 有效期',
    s03Subtitle: '带有滑动重试窗口与有效期的去重概念模型。',
    dupRate: '重复率',
    ttlSeconds: '缓存 TTL（秒）',
    windowSeconds: '重试窗口（秒）',
    uniqueReqs: '唯一请求',
    filteredDups: '已拦截重复',
    leakedDups: '穿透至数据库',
    dbWrites: '数据库最终写入',
    s03Disclaimer: '确定性概念模型；生产级系统需要 Redis SETNX 或数据库事务保证。',
    s06Title: 'S06 · 数据竞争与原子同步对比',
    s06Subtitle: '无锁并发写入与 sync/atomic 互斥对比模型。',
    goroutines: '并发协程数',
    iterations: '每协程迭代数',
    syncMode: '同步模式',
    syncNone: '无同步（数据竞争）',
    syncAtomic: 'sync/atomic（原子操作）',
    syncMutex: 'sync.Mutex（互斥锁）',
    targetCount: '期望计数',
    finalCount: '实际计数',
    lostUpdates: '丢失更新数',
    raceDetected: '检测到数据竞争（更新丢失）。',
    raceClean: '无竞争：安全同步。',
    s06Disclaimer: '概念模型。请在本地终端运行 "go test -race" 验证真实代码。',
    s14Title: 'S14 · P99 尾部延迟与内存压力',
    s14Subtitle: '内存分配与 GC 调优对 P50、P90、P99 延迟分位数的影响。',
    baseLatency: '基础延迟 (ms)',
    allocsPerOp: '每次操作分配数',
    gogcPercent: 'GOGC (%)',
    p50Label: 'P50 (中位数)',
    p90Label: 'P90',
    p99Label: 'P99 (尾部延迟)',
    jitterLabel: '抖动 (P99 - P50)',
    s14Disclaimer: '教学确定性模型；真实 Go GC 受 CPU 核心数、堆大小及 STW 暂停影响。',
    s15Title: 'S15 · 优雅停机中的连接排空',
    s15Subtitle: '硬杀进程 (SIGKILL) 与 http.Server.Shutdown(ctx) 优雅排空对比。',
    inFlightReqs: '处理中的飞行请求',
    drainTimeout: '排空超时时间（秒）',
    reqDuration: '请求耗时（秒）',
    shutdownStrat: '停机策略',
    stratGraceful: '优雅停机（顺序排空）',
    stratHard: '强制终止 (SIGKILL)',
    drainedCleanly: '顺利完成',
    droppedConns: '掉线连接 (502/RST)',
    zeroDowntime: '零宕机：无中断请求。',
    downtimeOccurred: '服务中断：客户端连接异常中断。',
    s15Disclaimer: '教学模型；生产部署通常配合 Kubernetes preStop 钩子及负载均衡器协同工作。',
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
    s18Disclaimer: 'Modelo determinístico; não representa métricas reais de Go ou latências de produção.',
    s03Title: 'S03 · Idempotência e expiração TTL de cache',
    s03Subtitle: 'Modelo conceitual de desduplicação com janela de retentativas e expiração.',
    dupRate: 'Taxa de duplicados',
    ttlSeconds: 'TTL do cache (seg)',
    windowSeconds: 'Janela de retentativas (seg)',
    uniqueReqs: 'Requisições únicas',
    filteredDups: 'Duplicados filtrados',
    leakedDups: 'Vazados para o BD',
    dbWrites: 'Gravações no banco',
    s03Disclaimer: 'Modelo conceitual determinístico; em produção exige Redis SETNX ou transações.',
    s06Title: 'S06 · Condições de corrida vs sincronização atômica',
    s06Subtitle: 'Modelo de escrita concorrente sem mutex vs sync/atomic.',
    goroutines: 'Goroutines',
    iterations: 'Iterações por goroutine',
    syncMode: 'Modo de sincronização',
    syncNone: 'Sem sincronização (Race)',
    syncAtomic: 'sync/atomic (Atômico)',
    syncMutex: 'sync.Mutex (Exclusão mútua)',
    targetCount: 'Contagem esperada',
    finalCount: 'Contagem alcançada',
    lostUpdates: 'Atualizações perdidas',
    raceDetected: 'Condição de corrida detectada (perdas).',
    raceClean: 'Sem corrida: sincronização segura.',
    s06Disclaimer: 'Modelo conceitual; execute "go test -race" localmente para verificar código real.',
    s14Title: 'S14 · Latência de cauda P99 e pressão de memória',
    s14Subtitle: 'Impacto das alocações e GC pacer nos percentis P50, P90 e P99.',
    baseLatency: 'Latência base (ms)',
    allocsPerOp: 'Alocações por op',
    gogcPercent: 'GOGC (%)',
    p50Label: 'P50 (mediana)',
    p90Label: 'P90',
    p99Label: 'P99 (cauda crítica)',
    jitterLabel: 'Jitter (P99 - P50)',
    s14Disclaimer: 'Modelo didático; o GC real do Go depende de CPUs e tamanho de heap.',
    s15Title: 'S15 · Drenagem de conexões em Graceful Shutdown',
    s15Subtitle: 'Comparação entre SIGKILL e drenagem limpa com http.Server.Shutdown(ctx).',
    inFlightReqs: 'Requisições em trânsito',
    drainTimeout: 'Timeout de drenagem (seg)',
    reqDuration: 'Duração da requisição (seg)',
    shutdownStrat: 'Estratégia de desligamento',
    stratGraceful: 'Graceful (Drenagem ordenada)',
    stratHard: 'Abrupto (SIGKILL imediato)',
    drainedCleanly: 'Concluídas com sucesso',
    droppedConns: 'Conexões perdidas (502/RST)',
    zeroDowntime: 'Zero-Downtime: nenhuma requisição interrompida.',
    downtimeOccurred: 'Queda de serviço: conexões de clientes interrompidas.',
    s15Disclaimer: 'Simulação didática; em Kubernetes coordena-se com hooks preStop e balanceadores.',
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
    s18Disclaimer: 'Modèle déterministe ; ne reflète pas les métriques Go ou latences de production.',
    s03Title: 'S03 · Idempotence et expiration TTL du cache',
    s03Subtitle: 'Modèle conceptuel de déduplication avec fenêtre et expiration.',
    dupRate: 'Taux de doublons',
    ttlSeconds: 'TTL du cache (sec)',
    windowSeconds: 'Fenêtre de réessais (sec)',
    uniqueReqs: 'Requêtes uniques',
    filteredDups: 'Doublons filtrés',
    leakedDups: 'Fuites vers la BD',
    dbWrites: 'Écritures réelles en BD',
    s03Disclaimer: 'Modèle déterministe ; la production requiert Redis SETNX ou transactions BD.',
    s06Title: 'S06 · Compétition de données vs synchronisation atomique',
    s06Subtitle: 'Modèle conceptuel d’écritures sans verrou vs sync/atomic.',
    goroutines: 'Goroutines',
    iterations: 'Itérations par goroutine',
    syncMode: 'Mode de synchronisation',
    syncNone: 'Sans synchronisation (Race)',
    syncAtomic: 'sync/atomic (Atomique)',
    syncMutex: 'sync.Mutex (Exclusion mutuelle)',
    targetCount: 'Total attendu',
    finalCount: 'Total atteint',
    lostUpdates: 'Mises à jour perdues',
    raceDetected: 'Compétition détectée (mises à jour perdues).',
    raceClean: 'Sans compétition : synchronisation sûre.',
    s06Disclaimer: 'Modèle conceptuel ; lancez "go test -race" localement pour valider le code réel.',
    s14Title: 'S14 · Latence de queue P99 et pression mémoire',
    s14Subtitle: 'Impact des allocations et du GC sur les percentiles P50, P90 et P99.',
    baseLatency: 'Latence de base (ms)',
    allocsPerOp: 'Allocations par op',
    gogcPercent: 'GOGC (%)',
    p50Label: 'P50 (médiane)',
    p90Label: 'P90',
    p99Label: 'P99 (latence de queue)',
    jitterLabel: 'Gigue (P99 - P50)',
    s14Disclaimer: 'Modèle pédagogique déterministe ; le GC réel dépend des cœurs et de la taille du tas.',
    s15Title: 'S15 · Drainage des connexions lors de l’arrêt ordonné',
    s15Subtitle: 'Comparaison entre arrêt forcé (SIGKILL) et drainage propre via Shutdown(ctx).',
    inFlightReqs: 'Requêtes en cours',
    drainTimeout: 'Délai de drainage (sec)',
    reqDuration: 'Durée des requêtes (sec)',
    shutdownStrat: 'Stratégie d’arrêt',
    stratGraceful: 'Ordonné (Drainage propre)',
    stratHard: 'Brutal (SIGKILL immédiat)',
    drainedCleanly: 'Terminées proprement',
    droppedConns: 'Connexions perdues (502/RST)',
    zeroDowntime: 'Zéro interruption : aucune requête rompue.',
    downtimeOccurred: 'Interruption de service : connexions brutalement fermées.',
    s15Disclaimer: 'Modèle pédagogique ; s’associe à des hooks preStop Kubernetes et répartiteurs.',
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

  // S03 State (Idempotency Window)
  const [s03Reqs, setS03Reqs] = useState(100);
  const [s03DupRate, setS03DupRate] = useState(30);
  const [s03Ttl, setS03Ttl] = useState(60);
  const [s03Win, setS03Win] = useState(60);
  const s03 = useMemo(() => idempotencyWindowScenario({ requests: s03Reqs, duplicateRate: s03DupRate, ttlSeconds: s03Ttl, windowSeconds: s03Win }), [s03Reqs, s03DupRate, s03Ttl, s03Win]);

  // S06 State (Data Race vs Atomic)
  const [s06Goro, setS06Goro] = useState(100);
  const [s06Iter, setS06Iter] = useState(10);
  const [s06Sync, setS06Sync] = useState<'none' | 'atomic' | 'mutex'>('none');
  const s06 = useMemo(() => dataRaceScenario({ goroutines: s06Goro, iterations: s06Iter, syncMode: s06Sync }), [s06Goro, s06Iter, s06Sync]);

  // S14 State (Latency Percentiles P99)
  const [s14Base, setS14Base] = useState(2);
  const [s14Allocs, setS14Allocs] = useState(15);
  const [s14Gogc, setS14Gogc] = useState(100);
  const s14 = useMemo(() => latencyPercentilesScenario({ baseLatencyMs: s14Base, allocsPerOp: s14Allocs, gogc: s14Gogc }), [s14Base, s14Allocs, s14Gogc]);

  // S15 State (Graceful Shutdown)
  const [s15InFlight, setS15InFlight] = useState(50);
  const [s15Drain, setS15Drain] = useState(5);
  const [s15Dur, setS15Dur] = useState(3);
  const [s15Strat, setS15Strat] = useState<'graceful' | 'hard'>('graceful');
  const s15 = useMemo(() => gracefulShutdownScenario({ inFlight: s15InFlight, drainTimeoutSec: s15Drain, reqDurationSec: s15Dur, strategy: s15Strat }), [s15InFlight, s15Drain, s15Dur, s15Strat]);

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

  if (moduleId === 'S03') {
    return (
      <section class="card worker-lab" aria-label="Simulador de ventana de idempotencia">
        <h2>{t.s03Title}</h2>
        <p class="muted">{t.s03Subtitle}</p>
        <div class="worker-controls">
          <label>
            {t.requests}: {s03Reqs}
            <input type="range" min="20" max="500" step="20" value={s03Reqs} onInput={e => setS03Reqs(Number(e.currentTarget.value))} />
          </label>
          <label>
            {t.dupRate}: {s03DupRate}%
            <input type="range" min="0" max="80" step="5" value={s03DupRate} onInput={e => setS03DupRate(Number(e.currentTarget.value))} />
          </label>
          <label>
            {t.ttlSeconds}: {s03Ttl}s
            <input type="range" min="10" max="180" step="10" value={s03Ttl} onInput={e => setS03Ttl(Number(e.currentTarget.value))} />
          </label>
          <label>
            {t.windowSeconds}: {s03Win}s
            <input type="range" min="10" max="180" step="10" value={s03Win} onInput={e => setS03Win(Number(e.currentTarget.value))} />
          </label>
        </div>
        <div class="worker-metrics">
          <span>{t.uniqueReqs}: <b>{s03.uniqueRequests}</b></span>
          <span>{t.filteredDups}: <b>{s03.filteredDuplicates}</b></span>
          <span>{t.leakedDups}: <b style={{ color: s03.isSafe ? 'var(--green)' : 'var(--red)' }}>{s03.leakedDuplicates}</b></span>
          <span>{t.dbWrites}: <b>{s03.dbWrites}</b></span>
        </div>
        <p class={s03.isSafe ? 'feedback correct' : 'feedback incorrect'}>
          {s03.isSafe ? 'TTL >= Ventana: Protección total contra doble escritura.' : 'TTL < Ventana: Fuga de duplicados detectada en la base de datos.'}
        </p>
        <p class="small-disclaimer">{t.s03Disclaimer}</p>
      </section>
    );
  }

  if (moduleId === 'S06') {
    return (
      <section class="card worker-lab" aria-label="Simulador de condiciones de carrera">
        <h2>{t.s06Title}</h2>
        <p class="muted">{t.s06Subtitle}</p>
        <div class="worker-controls">
          <label>
            {t.goroutines}: {s06Goro}
            <input type="range" min="10" max="300" step="10" value={s06Goro} onInput={e => setS06Goro(Number(e.currentTarget.value))} />
          </label>
          <label>
            {t.iterations}: {s06Iter}
            <input type="range" min="1" max="30" value={s06Iter} onInput={e => setS06Iter(Number(e.currentTarget.value))} />
          </label>
          <label>
            {t.syncMode}
            <select value={s06Sync} onChange={e => setS06Sync(e.currentTarget.value as 'none' | 'atomic' | 'mutex')}>
              <option value="none">{t.syncNone}</option>
              <option value="atomic">{t.syncAtomic}</option>
              <option value="mutex">{t.syncMutex}</option>
            </select>
          </label>
        </div>
        <div class="worker-metrics">
          <span>{t.targetCount}: <b>{s06.targetCount}</b></span>
          <span>{t.finalCount}: <b>{s06.finalCount}</b></span>
          <span>{t.lostUpdates}: <b style={{ color: s06.lostUpdates > 0 ? 'var(--red)' : 'var(--green)' }}>{s06.lostUpdates}</b></span>
        </div>
        <p class={s06.raceDetected ? 'feedback incorrect' : 'feedback correct'}>
          {s06.raceDetected ? t.raceDetected : t.raceClean}
        </p>
        <p class="small-disclaimer">{t.s06Disclaimer}</p>
      </section>
    );
  }

  if (moduleId === 'S14') {
    return (
      <section class="card worker-lab" aria-label="Simulador de latencia P99">
        <h2>{t.s14Title}</h2>
        <p class="muted">{t.s14Subtitle}</p>
        <div class="worker-controls">
          <label>
            {t.baseLatency}: {s14Base}ms
            <input type="range" min="1" max="20" value={s14Base} onInput={e => setS14Base(Number(e.currentTarget.value))} />
          </label>
          <label>
            {t.allocsPerOp}: {s14Allocs} allocs
            <input type="range" min="0" max="60" step="2" value={s14Allocs} onInput={e => setS14Allocs(Number(e.currentTarget.value))} />
          </label>
          <label>
            {t.gogcPercent}: {s14Gogc}%
            <input type="range" min="40" max="300" step="20" value={s14Gogc} onInput={e => setS14Gogc(Number(e.currentTarget.value))} />
          </label>
        </div>
        <div class="worker-metrics">
          <span>{t.p50Label}: <b>{s14.p50} ms</b></span>
          <span>{t.p90Label}: <b>{s14.p90} ms</b></span>
          <span>{t.p99Label}: <b style={{ color: s14.p99 > 15 ? 'var(--red)' : 'var(--green)' }}>{s14.p99} ms</b></span>
          <span>{t.jitterLabel}: <b>{s14.jitter} ms</b></span>
        </div>
        <p class={s14.allocsPerOp === 0 ? 'feedback correct' : s14.p99 > 15 ? 'feedback incorrect' : 'notice'}>
          {s14.allocsPerOp === 0
            ? 'Cero asignaciones: latencia plana sin pausas de Garbage Collection.'
            : `Presión de memoria: ${s14.allocsPerOp} allocs/op amplifican el percentil P99 por sobrecarga de GC.`}
        </p>
        <p class="small-disclaimer">{t.s14Disclaimer}</p>
      </section>
    );
  }

  if (moduleId === 'S15') {
    return (
      <section class="card worker-lab" aria-label="Simulador de graceful shutdown">
        <h2>{t.s15Title}</h2>
        <p class="muted">{t.s15Subtitle}</p>
        <div class="worker-controls">
          <label>
            {t.inFlightReqs}: {s15InFlight}
            <input type="range" min="10" max="200" step="10" value={s15InFlight} onInput={e => setS15InFlight(Number(e.currentTarget.value))} />
          </label>
          <label>
            {t.drainTimeout}: {s15Drain}s
            <input type="range" min="1" max="15" value={s15Drain} onInput={e => setS15Drain(Number(e.currentTarget.value))} />
          </label>
          <label>
            {t.reqDuration}: {s15Dur}s
            <input type="range" min="1" max="15" value={s15Dur} onInput={e => setS15Dur(Number(e.currentTarget.value))} />
          </label>
          <label>
            {t.shutdownStrat}
            <select value={s15Strat} onChange={e => setS15Strat(e.currentTarget.value as 'graceful' | 'hard')}>
              <option value="graceful">{t.stratGraceful}</option>
              <option value="hard">{t.stratHard}</option>
            </select>
          </label>
        </div>
        <div class="worker-metrics">
          <span>{t.drainedCleanly}: <b>{s15.drainedCleanly}</b></span>
          <span>{t.droppedConns}: <b style={{ color: s15.droppedConnections > 0 ? 'var(--red)' : 'var(--green)' }}>{s15.droppedConnections}</b></span>
        </div>
        <p class={s15.isZeroDowntime ? 'feedback correct' : 'feedback incorrect'}>
          {s15.isZeroDowntime ? t.zeroDowntime : t.downtimeOccurred}
        </p>
        <p class="small-disclaimer">{t.s15Disclaimer}</p>
      </section>
    );
  }

  return null;
}
