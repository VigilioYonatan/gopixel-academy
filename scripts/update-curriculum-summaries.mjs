import fs from 'node:fs';

const summaries = {
  B01: {
    es: "Estructura de paquetes, función main, salida estándar fmt y compilación Go.",
    en: "Package structure, main function, fmt standard output and Go compilation.",
    ja: "パッケージ構造、main関数、fmt標準出力、Goのコンパイル。",
    zh: "包结构、main 函数、fmt 标准输出和 Go 编译。",
    pt: "Estrutura de pacotes, função main, saída padrão fmt e compilação Go.",
    fr: "Structure des paquets, fonction main, sortie standard fmt et compilation Go."
  },
  B02: {
    es: "Declaración con var y :=, inferencia de tipos, zero values y constantes con iota.",
    en: "Declarations with var and :=, type inference, zero values and constants with iota.",
    ja: "varと:=による変数宣言、型推論、ゼロ値、iotaを用いた定数定義。",
    zh: "使用 var 和 := 进行变量声明、类型推断、零值以及使用 iota 的常量定义。",
    pt: "Declaração com var e :=, inferência de tipos, zero values e constantes com iota.",
    fr: "Déclaration avec var et :=, inférence de types, valeurs par défaut et constantes avec iota."
  },
  B03: {
    es: "Enteros, flotantes, booleanos, strings UTF-8, conversiones de tipos y alias.",
    en: "Integers, floats, booleans, UTF-8 strings, explicit type conversions and aliases.",
    ja: "整数、浮動小数点、真偽値、UTF-8文字列、明示的な型変換とエイリアス。",
    zh: "整数、浮点数、布尔值、UTF-8 字符串、显式类型转换及类型别名。",
    pt: "Inteiros, pontos flutuantes, booleanos, strings UTF-8, conversão de tipos e apelidos.",
    fr: "Entiers, flottants, booléens, chaînes UTF-8, conversions explicites et alias de types."
  },
  B04: {
    es: "Sentencias if con inicialización, bucle for unificado, switch y control de flujo.",
    en: "If statements with short initialization, unified for loop, switch, and control flow.",
    ja: "初期化ステートメント付きif、統一されたforループ、switch、制御フロー。",
    zh: "带有简短初始化的 if 语句、统一的 for 循环、switch 及流程控制。",
    pt: "Declarações if com inicialização curta, laço for unificado, switch e controle de fluxo.",
    fr: "Instructions if avec initialisation courte, boucle for unifiée, switch et flux de contrôle."
  },
  B05: {
    es: "Retornos múltiples, valores nombrados, parámetros variádicos y funciones anónimas.",
    en: "Multiple return values, named returns, variadic parameters and anonymous closures.",
    ja: "複数の戻り値、名前付き戻り値、可変長引数、無名関数とクロージャ。",
    zh: "多返回值、命名返回值、可变参数及匿名闭包函数。",
    pt: "Múltiplos retornos, retornos nomeados, parâmetros variádicos e funções anônimas.",
    fr: "Valeurs de retour multiples, retours nommés, paramètres variadiques et fermetures."
  },
  B06: {
    es: "Slices vs arrays, puntero de cabecera, len, cap, make y comportamiento de append.",
    en: "Slices vs arrays, slice header pointer, len, cap, make and append reallocation.",
    ja: "スライスと配列の差異、ヘッダーポインタ、len、cap、make、appendの再割り当て動作。",
    zh: "切片与数组的区别、切片底层指针、len、cap、make 以及 append 扩容机制。",
    pt: "Diferença entre slices e arrays, ponteiro de cabeçalho, len, cap, make e append.",
    fr: "Différences entre slices et tableaux, pointeur d'en-tête, len, cap, make et append."
  },
  B07: {
    es: "Estructura hash map, clave-valor, operador comma-ok, iteración no determinista y delete.",
    en: "Hash map internals, key-value lookup, comma-ok idiom, non-deterministic iteration and delete.",
    ja: "ハッシュマップの仕組み、キーと値、comma-ok構文、非決定的な反復、delete関数。",
    zh: "哈希表结构、键值查找、comma-ok 惯用语法、无序遍历及 delete 函数。",
    pt: "Estrutura de hash maps, chave-valor, idioma comma-ok, iteração e delete.",
    fr: "Structure de table de hachage, clé-valeur, syntaxe comma-ok, itération et delete."
  },
  B08: {
    es: "Definición de estructuras, inicialización por campos, tags JSON y composición por embebido.",
    en: "Struct definition, field tags for JSON, field initialization and composition via embedding.",
    ja: "構造体の定義、フィールド初期化、JSONタグ、埋め込みによる合成。",
    zh: "结构体定义、字段初始化、JSON 标签以及通过组合嵌入复用代码。",
    pt: "Definição de structs, inicialização de campos, tags JSON e composição por embutimento.",
    fr: "Définition de structures, balises JSON, initialisation des champs et composition intégrée."
  },
  B09: {
    es: "Operadores & y *, semántica de memoria, paso por valor vs puntero y ausencia de aritmética.",
    en: "Address-of (&) and dereference (*) operators, pass-by-value semantics and pointer safety.",
    ja: "アドレス演算子(&)と間接参照(*)、値渡しセマンティクス、ポインタ安全性。",
    zh: "取地址(&)与解引用(*)运算符、值传递语义、指针安全性与无指针算术。",
    pt: "Operadores & e *, semântica de passagem por valor vs ponteiro e segurança de memória.",
    fr: "Opérateurs & et *, sémantique de passage par valeur vs pointeur et sécurité mémoire."
  },
  B10: {
    es: "Receptores por valor y puntero, interfaces implícitas, desacoplamiento y duck typing estático.",
    en: "Value vs pointer receivers, implicit interface implementation and static duck typing.",
    ja: "値レシーバとポインタレシーバ、暗黙的なインターフェース実装、静的ダックタイピング。",
    zh: "值接收者与指针接收者、隐式接口实现、解耦与静态鸭子类型。",
    pt: "Receptores por valor e ponteiro, implementação implícita de interfaces e desacoplamento.",
    fr: "Récepteurs par valeur et pointeur, implémentation implicite d'interfaces et typage canard."
  },
  B11: {
    es: "Tipo error como valor explícito, defer para limpieza de recursos, panic y recover controlado.",
    en: "Error type as explicit value, defer for deterministic cleanup, panic and guarded recover.",
    ja: "明示的な値としてのerror型、確実なリソース解放のためのdefer、panicとrecover。",
    zh: "作为显式值的 error 类型、用于确定性资源清理的 defer、panic 与受控 recover。",
    pt: "Tipo error como valor explícito, defer para limpeza de recursos, panic e recover.",
    fr: "Type error comme valeur explicite, defer pour le nettoyage, panic et recover contrôlé."
  },
  B12: {
    es: "Proyecto integrador: cuentas bancarias con depósitos, retiros validados, balances y tests.",
    en: "Capstone project: bank account ledger with deposits, validated withdrawals, and unit tests.",
    ja: "基礎総合プロジェクト：入出金バリデーション、残高照会、単体テスト付き銀行口座システム。",
    zh: "基础综合项目：带有充值、提现校验、余额查询及单元测试的微型银行账户系统。",
    pt: "Projeto integrador: contas bancárias com depósitos, saques validados, saldos e testes.",
    fr: "Projet intégrateur : grand livre bancaire avec dépôts, retraits validés et tests unitaires."
  },
  S01: {
    es: "Eliminar complejidad accidental, interfaces mínimas, flat code y refactorización idiomática.",
    en: "Eliminating accidental complexity, minimal interfaces, flat code, and idiomatic refactoring.",
    ja: "偶発的複雑さの排除、最小限のインターフェース、平坦なコード、慣用的なリファクタリング。",
    zh: "消除偶然复杂度、极简接口、扁平代码与惯用 Go 重构实践。",
    pt: "Eliminar complexidade acidental, interfaces mínimas, código plano e refatoração idiomática.",
    fr: "Élimination de la complexité accidentelle, interfaces minimales et refactorisation idiomatique."
  },
  S02: {
    es: "Inversión de dependencias, desacoplamiento de capas, puertos y adaptadores en sistemas Go.",
    en: "Dependency inversion, clean domain isolation, ports and adapters in Go enterprise systems.",
    ja: "依存性逆転の原則、クリーンなドメイン分離、Go製エンタープライズでのポート＆アダプタ。",
    zh: "依赖倒置原则、领域层完全解耦、Go 企业级系统中的端口与适配器架构。",
    pt: "Inversão de dependências, isolamento de domínio limpo, portas e adaptadores em Go.",
    fr: "Inversion de dépendance, isolation propre du domaine, ports et adaptateurs en Go."
  },
  S03: {
    es: "Contratos REST y RPC robustos, idempotencia, claves de request, versionado y error handling.",
    en: "Robust REST & RPC contracts, idempotency keys, request tracing, versioning, and error codes.",
    ja: "堅牢なREST・RPC規約、冪等性キー、リクエスト追跡、バージョニングとエラーハンドリング。",
    zh: "健壮的 REST 与 RPC 契约、幂等性键、请求追踪、API 版本控制与结构化错误码。",
    pt: "Contratos REST e RPC robustos, chaves de idempotência, versionamento e tratamento de erros.",
    fr: "Contrats d'API REST et RPC robustes, clés d'idempotence, versionnage et gestion d'erreurs."
  },
  S04: {
    es: "Entidades ricas, value objects, invariantes estrictas y transiciones de estado deterministas.",
    en: "Rich domain entities, immutable value objects, strict invariants, and state machines.",
    ja: "リッチなドメインエンティティ、値オブジェクト、厳格な不変条件、決定論的ステートマシン。",
    zh: "富领域实体、不可变值对象、严格领域不变量与确定性状态机转换。",
    pt: "Entidades de domínio ricas, value objects imutáveis, invariantes estritas e máquinas de estado.",
    fr: "Entités riches, value objects immuables, invariants stricts et transitions d'états."
  },
  S05: {
    es: "Worker pools con backpressure, límites de saturación, canales bounded y cancelación limpia.",
    en: "Worker pools with backpressure, saturation ceilings, bounded channels, and graceful drain.",
    ja: "バックプレッシャー付きワーカープール、飽和限界値、有界チャネル、安全なグレースフルドレイン。",
    zh: "具备背压机制的 Worker Pool、并发饱和阈值、有界通道与平滑退出排空。",
    pt: "Worker pools com backpressure, limites de saturação, canais limitados e drenagem graciosa.",
    fr: "Worker pools avec contre-pression, plafonds de saturation et arrêt gracieux."
  },
  S06: {
    es: "Semántica happens-before, operaciones sync/atomic, orden de memoria y prevención de data races.",
    en: "Go happens-before guarantee, sync/atomic primitives, memory reordering, and race prevention.",
    ja: "Goのhappens-before保証、sync/atomicプリミティブ、メモリ並べ替え、データレース防止。",
    zh: "Go happens-before 原则、sync/atomic 原语、内存重排分析与数据竞争消除。",
    pt: "Garantia happens-before, primitivas sync/atomic, reordenação de memória e prevenção de data races.",
    fr: "Garantie happens-before, primitives sync/atomic, réordonnancement mémoire et prévention des data races."
  },
  S07: {
    es: "Análisis de escape, retención de punteros, comportamiento del Garbage Collector y GOMAXPROCS.",
    en: "Escape analysis (-gcflags -m), pointer retention, Garbage Collector pacing, and GOMAXPROCS.",
    ja: "エスケープ解析、ポインタ保持、ガベージコレクタのペーシング、GOMAXPROCSチューニング。",
    zh: "逃逸分析诊断、堆指针驻留机制、三色垃圾回收器调步算法与 GOMAXPROCS 调优。",
    pt: "Análise de escape, retenção de ponteiros, ritmo do Garbage Collector e ajuste de GOMAXPROCS.",
    fr: "Analyse d'échappement, rétention des pointeurs, rythme du Garbage Collector et GOMAXPROCS."
  },
  S08: {
    es: "Perfiles pprof de CPU/memoria, benchmarks de asignaciones por op y latencias percentiles p99.",
    en: "CPU & heap pprof analysis, allocation benchmarks (b.ReportAllocs), and p99 latency tuning.",
    ja: "CPUおよびヒープのpprofプロファイリング、アロケーションベンチマーク、p99レイテンシ改善。",
    zh: "CPU 与堆内存 pprof 火焰图分析、内存分配基准测试及 p99 延迟极端优化。",
    pt: "Perfis pprof de CPU/memória, benchmarks de alocação por operação e otimização de latência p99.",
    fr: "Profils pprof CPU et mémoire, benchmarks d'allocation et réduction de la latence p99."
  },
  S09: {
    es: "Garantías de entrega at-least-once, desduplicación, compensación de transacciones y outbox pattern.",
    en: "At-least-once delivery guarantees, deduplication, transactional outbox, and compensations.",
    ja: "少なくとも1回の到達保証、重複排除、トランザクショナルアウトボックス、補償トランザクション。",
    zh: "至少一次投递保证、幂等去重表、本地事务发件箱模式与分布式补偿事务。",
    pt: "Garantias at-least-once, desduplicação, padrão transactional outbox e transações de compensação.",
    fr: "Garanties au moins une fois, déduplication, motif Transactional Outbox et compensations."
  },
  S10: {
    es: "Niveles de aislamiento SQL, contención de locks, deadlocks y consistencia eventual vs estricta.",
    en: "SQL isolation levels, row lock contention, deadlocks, and eventual vs strong consistency.",
    ja: "SQLトランザクション分離レベル、行ロック競合、デッドロック回避、結果整合性と強整合性。",
    zh: "SQL 事务隔离级别、行锁争用排查、死锁预防以及最终一致性与强一致性权衡。",
    pt: "Níveis de isolamento SQL, contenção de locks, deadlocks e consistência eventual vs forte.",
    fr: "Niveaux d'isolation SQL, contention des verrous, impasses et cohérence à terme vs forte."
  },
  S11: {
    es: "Circuit breaker, retries con exponential backoff y jitter, timeouts de context y fail-safe.",
    en: "Circuit breakers, exponential backoff with jitter, strict context timeouts, and fail-safe fallbacks.",
    ja: "サーキットブレーカー、ジッター付き指数バックオフ再試行、コンテキストタイムアウト。",
    zh: "熔断器模式、带全抖动的指数退避重试、严格的 Context 超时与降级容错。",
    pt: "Circuit breakers, retentativas com backoff exponencial e jitter, timeouts e fail-safe.",
    fr: "Coupe-circuits, retentatives avec temporisation exponentielle et gigue, et timeouts stricts."
  },
  S12: {
    es: "Validación defensiva de inputs, sanitización SQL/NoSQL, control de cabeceras HTTP y zero trust.",
    en: "Defensive input validation, injection prevention, cryptographic hashing, and zero trust policies.",
    ja: "防御的入力検証、SQL・NoSQLインジェクション防止、暗号学的ハッシュ、ゼロトラスト方針。",
    zh: "防御性输入校验、SQL与NoSQL注入防护、抗碰撞加密哈希与服务端零信任原则。",
    pt: "Validação defensiva de entradas, prevenção de injeção, hashing seguro e zero trust.",
    fr: "Validation défensive des entrées, prévention des injections et politiques zéro confiance."
  },
  S13: {
    es: "Fuzzing nativo en Go, tests deterministas de concurrencia, flag -race y simulación de fallos.",
    en: "Native Go fuzzing (testing.F), deterministic concurrency testing, -race detector, and chaos mocks.",
    ja: "ネイティブGoファジング、決定論的並行テスト、-race検出器、障害注入モック。",
    zh: "原生 Go 模糊测试 (testing.F)、确定性并发测试、-race 竞态检测与故障注入模拟。",
    pt: "Fuzzing nativo em Go, testes determinísticos de concorrência, flag -race e injeção de falhas.",
    fr: "Fuzzing natif en Go, tests déterministes de concurrence, détecteur -race et simulations."
  },
  S14: {
    es: "Logs estructurados con slog, métricas RED/USE, trazas distribuidas y runbooks de guardia.",
    en: "Structured logging with slog, RED/USE metrics, distributed tracing, and on-call runbooks.",
    ja: "slogによる構造化ログ、RED/USEメトリクス、分散トレーシング、オンコール用ランブック。",
    zh: "使用 slog 的结构化日志、RED/USE 监控指标体系、分布式链路追踪与值班故障应急手册。",
    pt: "Logs estruturados com slog, métricas RED/USE, rastreamento distribuído e runbooks de plantão.",
    fr: "Journalisation structurée avec slog, métriques RED/USE, traçage distribué et runbooks d'astreinte."
  },
  S15: {
    es: "Compilación multi-etapa Docker scratch, healthchecks k8s, rolling updates y graceful shutdown.",
    en: "Scratch-based multi-stage Docker builds, Kubernetes probes, rolling updates, and graceful shutdown.",
    ja: "マルチステージDocker scratchビルド、Kubernetesプローブ、ローリングアップデート、正常終了。",
    zh: "基于 scratch 的极简多阶段 Docker 构建、K8s 探针配置、滚动发布与优雅停机排空。",
    pt: "Builds Docker scratch multi-estágio, probes de Kubernetes, rolling updates e graceful shutdown.",
    fr: "Builds Docker scratch multi-étapes, sondes Kubernetes, déploiements continus et arrêt gracieux."
  },
  S16: {
    es: "Evolución de esquemas backward-compatible, expand & contract, migraciones online y deuda técnica.",
    en: "Backward-compatible schema migrations, expand-and-contract pattern, and technical debt retirement.",
    ja: "後方互換性のあるスキーマ移行、expand and contractパターン、無停止移行、技術的負債解消。",
    zh: "向后兼容的数据库结构演进、扩充与收缩 (Expand & Contract) 双写迁移与技术债务清偿。",
    pt: "Migrações de esquema compatíveis com versões anteriores, padrão expand & contract e dívida técnica.",
    fr: "Migrations de schéma rétrocompatibles, motif expand-and-contract et gestion de la dette."
  },
  S17: {
    es: "Redacción de ADRs (Architecture Decision Records), trade-offs de ingeniería y code review mentor.",
    en: "Writing Architecture Decision Records (ADRs), technical trade-off evaluation, and senior review.",
    ja: "アーキテクチャ決定記録 (ADR) の策定、技術的トレードオフの評価、シニアコードレビュー指導。",
    zh: "架构决策记录 (ADR) 规范撰写、技术权衡评估矩阵以及资深工程代码审查指导。",
    pt: "Redação de ADRs (Architecture Decision Records), avaliação de trade-offs e mentoria de code review.",
    fr: "Rédaction d'ADR (Architecture Decision Records), compromis techniques et revue de code de mentor."
  },
  S18: {
    es: "Defensa arquitectónica completa: throughput, latencia p99, failover multi-región y consistencia.",
    en: "Comprehensive System Design capstone: SLA/SLO sizing, multi-region failover, and trade-off defense.",
    ja: "総合システム設計キャップストーン：SLA/SLOサイジング、マルチリージョン障害復旧、設計防衛。",
    zh: "高级系统架构毕业考评：SLA/SLO 容量核算、多可用区故障容灾架构设计与权衡答辩。",
    pt: "Defesa arquitetural completa: dimensionamento SLA/SLO, failover multirregião e consistência.",
    fr: "Défense architecturale complète : dimensionnement SLA/SLO, basculement multirégion et cohérence."
  }
};

const curriculumPath = 'src/data/curriculum.json';
const list = JSON.parse(fs.readFileSync(curriculumPath, 'utf8'));

for (const item of list) {
  if (summaries[item.id]) {
    item.summary = summaries[item.id];
  }
}

fs.writeFileSync(curriculumPath, JSON.stringify(list, null, 2) + '\n', 'utf8');
console.log('Successfully updated curriculum summaries!');
