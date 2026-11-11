// Frameworks Academy full curriculum for GoPixel Academy (F01-F08)
// 5 structured study units per framework in 6 languages.

export type Locale = 'es' | 'en' | 'ja' | 'zh' | 'pt' | 'fr';

export const frameworkCurriculum: Record<string, {
  subtitle: Record<Locale, string>;
  units: Record<Locale, string[]>;
}> = {
  F01: {
    subtitle: {
      es: 'Servidor HTTP estándar, multiplexor y middlewares',
      en: 'Standard HTTP server, multiplexing & middleware',
      ja: '標準HTTPサーバー、マルチプレクサとミドルウェア',
      zh: '标准库 HTTP 服务端、多路复用与中间件',
      pt: 'Servidor HTTP padrão, multiplexador e middleware',
      fr: 'Serveur HTTP standard, multiplexeur et intergiciels',
    },
    units: {
      es: [
        '1. Introducción a net/http y arquitectura cliente/servidor',
        '2. Flujo básico y enrutamiento con ServeMux (Go 1.22+)',
        '3. Testing de handlers con net/http/httptest',
        '4. Errores, timeouts y propagación de context.Context',
        '5. Proyecto: API REST modular con net/http puro'
      ],
      en: [
        '1. Introduction to net/http and client/server architecture',
        '2. Core routing and multiplexing with ServeMux (Go 1.22+)',
        '3. Handler testing and benchmarks with httptest',
        '4. Errors, timeouts and context.Context propagation',
        '5. Capstone: Modular REST service with pure net/http'
      ],
      ja: [
        '1. net/http とクライアント／サーバー構成の基礎',
        '2. ServeMux (Go 1.22+) によるルーティングと多重化',
        '3. httptest によるハンドラーテストとベンチマーク',
        '4. エラー処理、タイムアウト、コンテキスト伝播',
        '5. 総合課題：純粋な net/http によるモジュール型REST API'
      ],
      zh: [
        '1. net/http 基础与客户端/服务端架构',
        '2. 基于 ServeMux (Go 1.22+) 的现代模式路由与分发',
        '3. 使用 net/http/httptest 进行单元测试与压测',
        '4. 错误处理、超时控制与 context.Context 传播',
        '5. 综合实战：基于纯标准库的模块化 REST 服务'
      ],
      pt: [
        '1. Introdução a net/http e arquitetura cliente/servidor',
        '2. Roteamento básico com ServeMux (Go 1.22+)',
        '3. Testes de handlers com net/http/httptest',
        '4. Erros, timeouts e propagação de contexto',
        '5. Projeto: API REST modular com net/http nativo'
      ],
      fr: [
        '1. Introduction à net/http et architecture client/serveur',
        '2. Routage et multiplexage avec ServeMux (Go 1.22+)',
        '3. Tests de gestionnaires avec net/http/httptest',
        '4. Erreurs, délais d\'attente et contexte',
        '5. Projet : API REST modulaire en net/http pur'
      ]
    }
  },
  F02: {
    subtitle: {
      es: 'API REST moderna de alto rendimiento y validación',
      en: 'High-performance REST API & payload validation',
      ja: '高パフォーマンスなREST APIとバリデーション',
      zh: '高性能 REST API 与结构体绑定验证',
      pt: 'API REST de alto desempenho e validação',
      fr: 'API REST haute performance et validation',
    },
    units: {
      es: [
        '1. Introducción a Gin: radix tree y ciclo de vida de peticiones',
        '2. Flujo básico: routers, grupos de rutas y serialización JSON',
        '3. Testing de endpoints y benchmarking de rutas Gin',
        '4. Errores, validación con validator/v10 y middlewares de seguridad',
        '5. Proyecto: Microservicio de órdenes con Gin y Docker'
      ],
      en: [
        '1. Introduction to Gin: radix tree & request lifecycle',
        '2. Core routing: groups, parameter binding & JSON responses',
        '3. Endpoint testing and benchmark suites for Gin routes',
        '4. Errors, struct validation with validator/v10 & security middleware',
        '5. Capstone: Production order microservice with Gin & Docker'
      ],
      ja: [
        '1. Gin の紹介：基底木ルーターとリクエストライフサイクル',
        '2. 基本フロー：ルートグループとJSONバインディング',
        '3. エンドポイントのテストとベンチマークスイート',
        '4. エラー処理、構造体バリデーション、セキュリティミドルウェア',
        '5. 総合課題：Gin と Docker を用いた注文マイクロサービス'
      ],
      zh: [
        '1. Gin 入门：基数树路由引擎与请求生命周期',
        '2. 核心路由：路由分组、参数绑定与高效 JSON 渲染',
        '3. Gin 路由的自动化测试与性能基准评测',
        '4. 统一错误处理、validator/v10 验证与安全防御中间件',
        '5. 综合实战：容器化高性能订单微服务'
      ],
      pt: [
        '1. Introdução ao Gin: radix tree e ciclo da requisição',
        '2. Roteamento básico, grupos e serialização JSON',
        '3. Testes de endpoints e benchmarks no Gin',
        '4. Erros, validação com validator/v10 e middlewares',
        '5. Projeto: Microsserviço de pedidos com Gin e Docker'
      ],
      fr: [
        '1. Introduction à Gin : radix tree et cycle de requête',
        '2. Routage fondamental, groupes et réponses JSON',
        '3. Tests d\'endpoints et suites de benchmarks Gin',
        '4. Gestion des erreurs, validation et intergiciels de sécurité',
        '5. Projet : Microservice de commandes avec Gin et Docker'
      ]
    }
  },
  F03: {
    subtitle: {
      es: 'Enrutador composable y 100% compatible con net/http',
      en: 'Composable router 100% compatible with net/http',
      ja: 'net/http と100%互換のコンポーザブルルーター',
      zh: '100% 兼容标准库的可组合轻量路由器',
      pt: 'Roteador composável e 100% compatível com net/http',
      fr: 'Routeur composable et 100% compatible net/http',
    },
    units: {
      es: [
        '1. Introducción a Chi: filosofía de diseño y compatibilidad stdlib',
        '2. Flujo básico: subrouters, middlewares nativos y URL params',
        '3. Testing idiomático sin adaptadores propietarios',
        '4. Errores, middleware de compresión y rate limiting',
        '5. Proyecto: Gateway de autenticación y proxy reverso con Chi'
      ],
      en: [
        '1. Introduction to Chi: philosophy & standard library compatibility',
        '2. Core routing: subrouters, URL params & standard middleware chains',
        '3. Idiomatic testing without proprietary mock adapters',
        '4. Errors, gzip compression & rate-limiting middleware',
        '5. Capstone: Auth gateway & reverse proxy with Chi'
      ],
      ja: [
        '1. Chi の紹介：標準ライブラリ完全互換の設計哲学',
        '2. サブルーター、標準ミドルウェアチェーン、URLパラメータ',
        '3. 独自アダプター不要の慣用的なテスト手法',
        '4. エラー制御、圧縮、レート制限ミドルウェア',
        '5. 総合課題：Chi による認証ゲートウェイとリバースプロキシ'
      ],
      zh: [
        '1. Chi 架构概览：标准库无缝兼容的极简设计哲学',
        '2. 核心路由：嵌套子路由、URL 提取与标准中间件链',
        '3. 无需私有 Mock 适配器的标准 HTTP 测试实践',
        '4. 错误处理、Gzip 压缩与令牌桶限流中间件',
        '5. 综合实战：基于 Chi 的认证网关与微服务反向代理'
      ],
      pt: [
        '1. Introdução ao Chi: filosofia e compatibilidade stdlib',
        '2. Subroteadores, middlewares padrão e parâmetros de URL',
        '3. Testes idiomáticos sem dependências proprietárias',
        '4. Erros, compressão e rate limiting com Chi',
        '5. Projeto: Gateway de autenticação e proxy reverso'
      ],
      fr: [
        '1. Introduction à Chi : philosophie et compatibilité standard',
        '2. Sous-routeurs, paramètres d\'URL et chaîne d\'intergiciels',
        '3. Tests idiomatiques sans adaptateurs propriétaires',
        '4. Gestion des erreurs, compression et limitation de débit',
        '5. Projet : Passerelle d\'authentification avec Chi'
      ]
    }
  },
  F04: {
    subtitle: {
      es: 'Framework minimalista con WebSockets y OpenAPI',
      en: 'Minimalist framework with WebSockets & OpenAPI',
      ja: 'WebSocketとOpenAPIを備えた軽量フレームワーク',
      zh: '集成 WebSocket 与 OpenAPI 的轻快企业级框架',
      pt: 'Framework minimalista com WebSockets e OpenAPI',
      fr: 'Framework minimaliste avec WebSockets et OpenAPI',
    },
    units: {
      es: [
        '1. Introducción a Echo: arquitectura rápida y context extensible',
        '2. Flujo básico: enrutamiento, binder personalizado y plantillas',
        '3. Testing de handlers con mock de echo.Context',
        '4. Errores centralizados, CORS y autenticación JWT',
        '5. Proyecto: Sistema de notificaciones en tiempo real con WebSockets'
      ],
      en: [
        '1. Introduction to Echo: high speed & extensible context',
        '2. Core routing: custom binding, rendering & static routes',
        '3. Handler testing using mock echo.Context environments',
        '4. Centralized error handling, CORS & JWT security middleware',
        '5. Capstone: Real-time notification service with WebSockets'
      ],
      ja: [
        '1. Echo の紹介：高速設計と拡張可能なコンテキスト',
        '2. ルーティング、カスタムバインダー、テンプレート描画',
        '3. mock echo.Context によるハンドラーの単体テスト',
        '4. 一元化エラーハンドリング、CORS、JWT認証',
        '5. 総合課題：WebSocket によるリアルタイム通知サービス'
      ],
      zh: [
        '1. Echo 架构特点：极速吞吐与可扩展 Context 引擎',
        '2. 核心路由：自定义参数绑定器、数据校验与模板渲染',
        '3. 基于 Mock echo.Context 的高仿真测试体系',
        '4. 全局集中异常捕获、CORS 策略与 JWT 安全中间件',
        '5. 综合实战：基于 Echo WebSocket 的实时消息通知中台'
      ],
      pt: [
        '1. Introdução ao Echo: alto desempenho e contexto extensível',
        '2. Roteamento, binding customizado e templates',
        '3. Testes com mock de echo.Context',
        '4. Tratamento de erros centralizado, CORS e JWT',
        '5. Projeto: Serviço de notificações em tempo real com WebSockets'
      ],
      fr: [
        '1. Introduction à Echo : haute performance et contexte extensible',
        '2. Routage fondamental, liaison de données et modèles',
        '3. Tests de gestionnaires avec mock de echo.Context',
        '4. Gestion centralisée des erreurs, CORS et sécurité JWT',
        '5. Projet : Service de notifications en temps réel avec WebSockets'
      ]
    }
  },
  F05: {
    subtitle: {
      es: 'Extremo rendimiento y cero asignaciones sobre fasthttp',
      en: 'Zero allocation & extreme performance on fasthttp',
      ja: 'fasthttpベースのゼロアロケーション極限性能',
      zh: '基于 fasthttp 的零内存分配极致性能引擎',
      pt: 'Desempenho extremo e zero alocações sobre fasthttp',
      fr: 'Haute performance et zéro allocation sur fasthttp',
    },
    units: {
      es: [
        '1. Introducción a Fiber: fasthttp, zero-alloc y modelo de memoria',
        '2. Flujo básico: enrutamiento estilo Express y context mutable',
        '3. Testing de rendimiento y auditoría de asignaciones heap',
        '4. Errores, límites de subprocesos y middlewares de prefork',
        '5. Proyecto: Ingestion API de telemetría de ultra baja latencia'
      ],
      en: [
        '1. Introduction to Fiber: fasthttp engine & zero-alloc principles',
        '2. Core routing: Express-like syntax & mutable memory context',
        '3. Performance benchmarks & memory heap profile auditing',
        '4. Error handling, thread boundaries & prefork concurrency',
        '5. Capstone: Ultra low-latency telemetry ingestion pipeline'
      ],
      ja: [
        '1. Fiber の紹介：fasthttp とゼロアロケーションの原則',
        '2. 基本フロー：Express風ルーティングと可変コンテキスト',
        '3. 性能ベンチマークとヒープメモリ割り当て監査',
        '4. エラー処理、スレッド境界、prefork並行処理',
        '5. 総合課題：超低遅延テレメトリ収集パイプライン'
      ],
      zh: [
        '1. Fiber 深度解析：fasthttp 引擎底层机制与零内存分配原则',
        '2. 核心路由：Express 风格语义与内存复用上下文',
        '3. 极限性能压测、堆内存分配审计与 Profiling',
        '4. 错误边界处理、协程隔离与 prefork 多核加速',
        '5. 综合实战：超低延迟海量指标吞吐上报服务'
      ],
      pt: [
        '1. Introdução ao Fiber: motor fasthttp e alocação zero',
        '2. Roteamento estilo Express e contexto mutável',
        '3. Testes de estresse e auditoria de heap allocations',
        '4. Erros, isolamento de concorrência e prefork',
        '5. Projeto: Pipeline de ingestão de telemetria ultrarrápido'
      ],
      fr: [
        '1. Introduction à Fiber : moteur fasthttp et zéro allocation',
        '2. Routage style Express et gestion de contexte mutable',
        '3. Benchmarks de performance et audit du tas de mémoire',
        '4. Gestion des erreurs, limites de threads et prefork',
        '5. Projet : Pipeline d\'ingestion télémétrique à très faible latence'
      ]
    }
  },
  F06: {
    subtitle: {
      es: 'Persistencia SQL, mapeo relacional y transacciones',
      en: 'SQL persistence, relational mapping & transactions',
      ja: 'SQL永続化、リレーショナルマッピング、トランザクション',
      zh: 'SQL 持久化、关系型对象映射与事务安全',
      pt: 'Persistência SQL, mapeamento relacional e transações',
      fr: 'Persistance SQL, mapping relationnel et transactions',
    },
    units: {
      es: [
        '1. Introducción a database/sql, pools de conexión y drivers',
        '2. Flujo básico: sqlx (NamedQuery, StructScan) vs GORM ORM',
        '3. Testing con testcontainers-go y bases de datos reales en CI',
        '4. Transacciones ACID, row locking (SELECT FOR UPDATE) y deadlocks',
        '5. Proyecto: Sistema bancario con transferencias transaccionales'
      ],
      en: [
        '1. Introduction to database/sql, driver pooling & connection tuning',
        '2. Core persistence: sqlx (StructScan) vs full-featured GORM',
        '3. Integration testing with testcontainers-go & real PostgreSQL',
        '4. ACID transactions, row locks (SELECT FOR UPDATE) & isolation',
        '5. Capstone: Double-entry transactional ledger & ledger audit'
      ],
      ja: [
        '1. database/sql の紹介：コネクションプールとドライバ設計',
        '2. 永続化フロー：sqlx (StructScan) と GORM の比較選定',
        '3. testcontainers-go と本番PostgreSQLによる統合テスト',
        '4. ACIDトランザクション、行ロック (FOR UPDATE)、分離レベル',
        '5. 総合課題：厳格な残高台帳とトランザクション決済基盤'
      ],
      zh: [
        '1. database/sql 深入剖析：连接池调优与数据库驱动架构',
        '2. 核心持久化：轻量级 sqlx (StructScan) 与 GORM 选型权衡',
        '3. 基于 testcontainers-go 的本地真实容器化集成测试',
        '4. ACID 事务、行级锁 (SELECT FOR UPDATE) 与防死锁策略',
        '5. 综合实战：高并发金融级复式记账账本系统'
      ],
      pt: [
        '1. Introdução a database/sql, pool de conexões e drivers',
        '2. Persistência básica: sqlx vs ORM GORM',
        '3. Testes integrados com testcontainers-go e PostgreSQL',
        '4. Transações ACID, locks de linha e prevenção de deadlocks',
        '5. Projeto: Livro razão contábil transacional em Go'
      ],
      fr: [
        '1. Introduction à database/sql, pool de connexions et pilotes',
        '2. Persistance : comparaison pratique entre sqlx et GORM',
        '3. Tests d\'intégration réels avec testcontainers-go',
        '4. Transactions ACID, verrous de lignes et niveaux d\'isolation',
        '5. Projet : Grand livre comptable transactionnel en Go'
      ]
    }
  },
  F07: {
    subtitle: {
      es: 'RPC binario de alta velocidad sobre HTTP/2 y Protobuf',
      en: 'High-speed binary RPC over HTTP/2 & Protobuf',
      ja: 'HTTP/2 と Protobuf による高速バイナリRPC',
      zh: '基于 HTTP/2 与 Protobuf 的高速二进制 RPC 通信',
      pt: 'RPC binário de alta velocidade sobre HTTP/2 e Protobuf',
      fr: 'RPC binaire haute vitesse sur HTTP/2 et Protobuf',
    },
    units: {
      es: [
        '1. Introducción a gRPC: Protocol Buffers v3, protoc y esquemas .proto',
        '2. Flujo básico: Unary RPC, Server Streaming y Client Streaming',
        '3. Testing de servicios gRPC con bufconn in-memory',
        '4. Errores con google.golang.org/grpc/status e interceptores',
        '5. Proyecto: Servicio de cotizaciones y streaming bidireccional'
      ],
      en: [
        '1. Introduction to gRPC: Protocol Buffers v3, protoc & .proto contracts',
        '2. Core RPC patterns: Unary, Server Streaming & Client Streaming',
        '3. Unit testing gRPC services using in-memory bufconn listeners',
        '4. Rich error handling with status codes & unary/stream interceptors',
        '5. Capstone: High-frequency market data bidirectional streaming'
      ],
      ja: [
        '1. gRPC の紹介：Protocol Buffers v3、protoc、.proto 定義',
        '2. 基本パターン：単一RPC、サーバー／クライアントストリーミング',
        '3. メモリ内 bufconn を用いた gRPC 単体テスト',
        '4. grpc/status によるエラーモデルとインターセプター設計',
        '5. 総合課題：高頻度クォートの双方向ストリーミング基盤'
      ],
      zh: [
        '1. gRPC 基础：Protocol Buffers v3 语法规范与 protoc 编译链',
        '2. 核心通信模型：一元调用、服务端流式与双向流式通信',
        '3. 基于内存通道 bufconn 的毫秒级 gRPC 服务端单测',
        '4. 结构化错误状态码 status 及前后置拦截器 (Interceptors) 链',
        '5. 综合实战：高频金融行情双向实时流式传输引擎'
      ],
      pt: [
        '1. Introdução a gRPC: Protocol Buffers v3 e contratos .proto',
        '2. Padrões RPC: Unary, Server Streaming e Client Streaming',
        '3. Testes unitários com bufconn em memória',
        '4. Tratamento de erros ricos com status e interceptors',
        '5. Projeto: Streaming bidirecional de cotações em tempo real'
      ],
      fr: [
        '1. Introduction à gRPC : Protocol Buffers v3 et contrats .proto',
        '2. Modèles RPC : Unary, flux serveur et flux client',
        '3. Tests unitaires gRPC avec connexions mémoire bufconn',
        '4. Codes de statut structurés et intercepteurs de flux',
        '5. Projet : Moteur de flux bidirectionnel de cotations en direct'
      ]
    }
  },
  F08: {
    subtitle: {
      es: 'Diseño de microservicios, service mesh y resiliencia',
      en: 'Microservices architecture, service mesh & resilience',
      ja: 'マイクロサービス設計、サービスメッシュ、回復性',
      zh: '分布式微服务架构、服务网格与高可用韧性',
      pt: 'Arquitetura de microsserviços, service mesh e resiliência',
      fr: 'Architecture microservices, maillage de services et résilience',
    },
    units: {
      es: [
        '1. Introducción a microservicios en Go: bounded contexts y DDD',
        '2. Comunicación inter-servicio: HTTP/JSON, gRPC y eventos asíncronos',
        '3. Testing de contratos con Pact y trazabilidad distribuida',
        '4. Resiliencia: circuit breakers, outbox pattern y service discovery',
        '5. Proyecto: Plataforma de comercio electrónico con arquitectura distribuida'
      ],
      en: [
        '1. Introduction to Go microservices: bounded contexts & Clean Architecture',
        '2. Inter-service protocols: REST, gRPC & asynchronous event buses',
        '3. Contract testing with consumer-driven mocks & distributed tracing',
        '4. Distributed resilience: circuit breakers, transactional outbox & discovery',
        '5. Capstone: Full e-commerce backend platform with microservices'
      ],
      ja: [
        '1. Go によるマイクロサービス入門：境界づけられたコンテキストとDDD',
        '2. サービス間通信：REST、gRPC、イベント駆動非同期バス',
        '3. 契約テストと分散トレーシング（OpenTelemetry）',
        '4. 回復性設計：サーキットブレーカー、Transactional Outbox',
        '5. 総合課題：分散型マイクロサービス電子商取引プラットフォーム'
      ],
      zh: [
        '1. Go 微服务设计模式：限界上下文 (Bounded Context) 与清晰分层',
        '2. 跨服务通信范式：同步 REST/gRPC 与异步消息事件总线',
        '3. 消费者驱动契约测试 (Pact) 与 OpenTelemetry 全链路追踪',
        '4. 分布式韧性治理：熔断器、本地事务外发箱 (Outbox) 与服务注册',
        '5. 综合实战：企业级微服务分布式电商中台系统'
      ],
      pt: [
        '1. Microsserviços em Go: bounded contexts e Clean Architecture',
        '2. Comunicação entre serviços: REST, gRPC e mensageria assíncrona',
        '3. Testes de contrato e rastreamento distribuído',
        '4. Resiliência: circuit breakers, padrão outbox e service discovery',
        '5. Projeto: Plataforma de e-commerce distribuída completa'
      ],
      fr: [
        '1. Microservices en Go : contextes délimités et Clean Architecture',
        '2. Communication inter-services : REST, gRPC et bus d\'événements',
        '3. Tests de contrat et traçabilité distribuée',
        '4. Résilience distribuée : disjoncteurs, modèle outbox et découverte',
        '5. Projet : Plateforme e-commerce distribuée complète en Go'
      ]
    }
  }
};
