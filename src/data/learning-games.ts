export type Locale = 'es' | 'en' | 'ja' | 'zh' | 'pt' | 'fr';

export interface QuizChallenge {
  id: string;
  question: Record<Locale, string>;
  options: string[];
  correctAnswer: string;
  explanation: Record<Locale, string>;
}

export interface CompleteChallenge {
  id: string;
  title: Record<Locale, string>;
  snippet: string;
  expected: string;
  placeholder: string;
  hint: Record<Locale, string>;
  explanation: Record<Locale, string>;
}

export interface OrderChallenge {
  id: string;
  title: Record<Locale, string>;
  initialItems: string[];
  correctOrder: string[];
  explanation: Record<Locale, string>;
}

export interface PredictChallenge {
  id: string;
  title: Record<Locale, string>;
  snippet: string;
  options: string[];
  correctAnswer: string;
  explanation: Record<Locale, string>;
}

export interface BugOption {
  id: string;
  text: string;
}

export interface BugChallenge {
  id: string;
  question: Record<Locale, string>;
  snippet: string;
  options: BugOption[];
  correctAnswer: string;
  explanation: Record<Locale, string>;
}

export interface GameBank {
  quiz: QuizChallenge[];
  complete: CompleteChallenge[];
  order: OrderChallenge[];
  predict: PredictChallenge[];
  bug: BugChallenge[];
}

export const gameBank: GameBank = {
  quiz: [
    {
      id: 'q01',
      question: {
        es: '¿Qué palabra clave inicia una goroutine?',
        en: 'Which keyword launches a goroutine?',
        ja: 'Goroutineを起動するキーワードは何ですか？',
        zh: '哪个关键字启动 goroutine？',
        pt: 'Qual palavra-chave inicia uma goroutine?',
        fr: 'Quel mot-clé lance une goroutine ?',
      },
      options: ['go', 'spawn', 'async', 'thread'],
      correctAnswer: 'go',
      explanation: {
        es: 'La palabra clave "go" inicia una llamada de función como goroutine en segundo plano.',
        en: 'The "go" keyword launches a function call as a concurrent lightweight goroutine.',
        ja: 'キーワード「go」は関数呼び出しを並行ゴルーチンとして起動します。',
        zh: '关键字 "go" 将函数调用作为轻量级并发 goroutine 启动。',
        pt: 'A palavra-chave "go" inicia uma chamada de função como goroutine concorrente.',
        fr: 'Le mot-clé "go" lance un appel de fonction en tant que goroutine concurrente.',
      },
    },
    {
      id: 'q02',
      question: {
        es: '¿Cuál es el valor por defecto (zero value) de un tipo bool en Go?',
        en: 'What is the default zero value of a bool in Go?',
        ja: 'Go言語のbool型のゼロ値（初期値）は何ですか？',
        zh: 'Go 语言中 bool 类型的零值（默认值）是什么？',
        pt: 'Qual é o valor padrão (zero value) de um bool no Go?',
        fr: 'Quelle est la valeur par défaut (zero value) d\'un bool en Go ?',
      },
      options: ['false', 'true', 'nil', '0'],
      correctAnswer: 'false',
      explanation: {
        es: 'En Go, las variables no inicializadas toman su zero value; para bool es siempre false.',
        en: 'In Go, uninitialized variables receive their zero value; for bool it is always false.',
        ja: 'Goでは初期化されていない変数にはゼロ値が代入され、bool型は常にfalseです。',
        zh: '在 Go 中，未显式初始化的变量采用其零值；bool 始终为 false。',
        pt: 'No Go, variáveis não inicializadas recebem seu zero value; para bool é sempre false.',
        fr: 'En Go, les variables non initialisées prennent leur zero value ; pour bool c\'est false.',
      },
    },
    {
      id: 'q03',
      question: {
        es: '¿Qué función incorporada inicializa slices, maps y channels?',
        en: 'Which built-in function initializes slices, maps, and channels?',
        ja: 'スライス、マップ、チャネルを初期化する組み込み関数は何ですか？',
        zh: '用于初始化切片、映射和通道的内置函数是什么？',
        pt: 'Qual função embutida inicializa slices, maps e canais?',
        fr: 'Quelle fonction intégrée initialise les slices, maps et canaux ?',
      },
      options: ['make', 'new', 'init', 'alloc'],
      correctAnswer: 'make',
      explanation: {
        es: '"make" reserva e inicializa estructuras complejas (slice, map, chan) con su descriptor interno.',
        en: '"make" allocates and initializes complex reference structures (slices, maps, channels).',
        ja: '「make」はスライス、マップ、チャネルを内部ディスクリプタと共に初期化します。',
        zh: '"make" 分配并初始化切片、映射和通道的内部数据结构。',
        pt: '"make" aloca e inicializa estruturas de referência (slices, maps, canais).',
        fr: '"make" alloue et initialise les structures (slices, maps, canaux) avec leurs métadonnées.',
      },
    },
    {
      id: 'q04',
      question: {
        es: '¿Qué palabra clave pospone la ejecución de una llamada hasta que la función actual retorne?',
        en: 'Which keyword defers execution of a call until the surrounding function returns?',
        ja: '現在の関数がリターンするまで実行を遅延させるキーワードは何ですか？',
        zh: '哪个关键字将执行推迟到外层函数返回时？',
        pt: 'Qual palavra-chave adia a execução até que a função envolvente retorne?',
        fr: 'Quel mot-clé reporte l\'exécution d\'un appel jusqu\'au retour de la fonction ?',
      },
      options: ['defer', 'after', 'await', 'finally'],
      correctAnswer: 'defer',
      explanation: {
        es: '"defer" apila llamadas para ejecutarse en orden LIFO cuando la función contenedora finaliza.',
        en: '"defer" pushes calls onto a stack to be evaluated in LIFO order upon function exit.',
        ja: '「defer」は関数終了時にLIFO（後入れ先出し）順で実行されるよう呼び出しをスタックします。',
        zh: '"defer" 将函数调用推入栈中，在函数退出时按后进先出（LIFO）顺序执行。',
        pt: '"defer" empilha chamadas para serem executadas em ordem LIFO na saída da função.',
        fr: '"defer" empile les appels pour les exécuter dans l\'ordre LIFO à la sortie de la fonction.',
      },
    },
    {
      id: 'q05',
      question: {
        es: '¿Qué identificador genera números enteros secuenciales dentro de un bloque const?',
        en: 'Which identifier creates sequential integers inside a const declaration block?',
        ja: 'constブロック内で連続する整数を生成する識別子は何ですか？',
        zh: '在 const 声明块中生成自增连续整数的标识符是什么？',
        pt: 'Qual identificador gera inteiros sequenciais dentro de um bloco const?',
        fr: 'Quel identifiant génère des entiers séquentiels dans un bloc const ?',
      },
      options: ['iota', 'enum', 'sequence', 'auto'],
      correctAnswer: 'iota',
      explanation: {
        es: '"iota" es un generador de constantes sucesivas (0, 1, 2...) simplificando enums idiomáticos.',
        en: '"iota" is a predeclared identifier that represents successive untyped integer constants.',
        ja: '「iota」は0から始まる連続した整数定数を簡潔に定義するための定数ジェネレータです。',
        zh: '"iota" 是预声明的枚举计数器标识符，在 const 块中从 0 开始逐行递增。',
        pt: '"iota" é um gerador de constantes inteiras sucessivas (0, 1, 2...) para enums idiomáticos.',
        fr: '"iota" est un générateur de constantes successives (0, 1, 2...) idéal pour les énumérations.',
      },
    },
  ],

  complete: [
    {
      id: 'c01',
      title: {
        es: 'Completar impresión estándar',
        en: 'Complete standard print',
        ja: '標準出力の補完',
        zh: '补全标准输出',
        pt: 'Completar impressão padrão',
        fr: 'Compléter l\'impression standard',
      },
      snippet: 'package main\nimport "fmt"\nfunc main() {\n  fmt.____("Hola")\n}',
      expected: 'Println',
      placeholder: 'Println',
      hint: {
        es: 'Función de fmt para imprimir con salto de línea (PascalCase)',
        en: 'fmt function to print with newline (PascalCase)',
        ja: '改行付きで出力するfmtの関数（パスカルケース）',
        zh: 'fmt 包中带换行输出的函数（PascalCase）',
        pt: 'Função do pacote fmt que imprime com quebra de linha',
        fr: 'Fonction de fmt imprimant avec saut de ligne',
      },
      explanation: {
        es: 'fmt.Println imprime sus argumentos en la salida estándar seguidos de un salto de línea.',
        en: 'fmt.Println prints its arguments formatted to standard output with a trailing newline.',
        ja: 'fmt.Printlnは末尾に改行を付与して標準出力へ印字します。',
        zh: 'fmt.Println 将参数格式化输出到标准输出并在末尾添加换行符。',
        pt: 'fmt.Println formata argumentos para stdout seguidos de nova linha.',
        fr: 'fmt.Println écrit ses arguments sur la sortie standard avec un retour à la ligne.',
      },
    },
    {
      id: 'c02',
      title: {
        es: 'Definición de tipo compuesto',
        en: 'Composite struct definition',
        ja: '構造体型の定義',
        zh: '复合结构体定义',
        pt: 'Definição de struct composta',
        fr: 'Définition d\'une structure',
      },
      snippet: 'package main\n\ntype Usuario ____ {\n  Nombre string\n  Edad   int\n}',
      expected: 'struct',
      placeholder: 'struct',
      hint: {
        es: 'Palabra clave para tipos con campos con nombre',
        en: 'Keyword for types with named fields',
        ja: 'フィールドを持つ複合型を定義するキーワード',
        zh: '用于定义具名字段复合类型的关键字',
        pt: 'Palavra-chave para tipos com campos nomeados',
        fr: 'Mot-clé pour définir un type avec des champs nommés',
      },
      explanation: {
        es: 'En Go los registros de datos se crean mediante la palabra clave "struct".',
        en: 'In Go, custom composite record types are declared with the "struct" keyword.',
        ja: 'Goではフィールドを持つ複合レコード型を「struct」キーワードで定義します。',
        zh: '在 Go 中，自定义复合记录类型使用 "struct" 关键字进行声明。',
        pt: 'No Go, registros de dados compostos são declarados com a palavra-chave "struct".',
        fr: 'En Go, les structures de données personnalisées sont déclarées avec "struct".',
      },
    },
    {
      id: 'c03',
      title: {
        es: 'Creación de canal con búfer',
        en: 'Buffered channel creation',
        ja: 'バッファ付きチャネルの生成',
        zh: '创建带缓冲通道',
        pt: 'Criação de canal com buffer',
        fr: 'Création d\'un canal bufférisé',
      },
      snippet: 'package main\n\nfunc main() {\n  ch := make(____ int, 5)\n  ch <- 42\n}',
      expected: 'chan',
      placeholder: 'chan',
      hint: {
        es: 'Tipo de canal de comunicación en Go',
        en: 'Communication channel type keyword in Go',
        ja: 'Goの通信チャネル型を表すキーワード',
        zh: 'Go 语言通信通道类型的关键字',
        pt: 'Palavra-chave do tipo de canal de comunicação',
        fr: 'Mot-clé de type canal de communication en Go',
      },
      explanation: {
        es: '"chan" especifica el tipo canal. "make(chan int, 5)" crea un canal con capacidad para 5 enteros.',
        en: '"chan" designates a channel type. "make(chan int, 5)" creates a buffer of 5 ints.',
        ja: '「chan」はチャネル型を指定します。make(chan int, 5)で容量5のバッファ付きチャネルを作ります。',
        zh: '"chan" 指定通道类型。"make(chan int, 5)" 创建一个容量为 5 的整数缓冲通道。',
        pt: '"chan" especifica o tipo de canal. make(chan int, 5) aloca um buffer para 5 inteiros.',
        fr: '"chan" spécifie un canal. make(chan int, 5) crée un canal bufférisé de 5 entiers.',
      },
    },
    {
      id: 'c04',
      title: {
        es: 'Cierre seguro de recursos',
        en: 'Safe resource cleanup',
        ja: '安全なリソース解放',
        zh: '安全释放资源',
        pt: 'Liberação segura de recursos',
        fr: 'Nettoyage sécurisé des ressources',
      },
      snippet: 'package main\nimport "os"\n\nfunc leerConfig() {\n  f, _ := os.Open("app.json")\n  ____ f.Close()\n}',
      expected: 'defer',
      placeholder: 'defer',
      hint: {
        es: 'Posponer llamada al retorno de la función',
        en: 'Defer call until function returns',
        ja: '関数復帰時まで呼び出しを遅延させる命令',
        zh: '推迟到函数返回前执行的关键字',
        pt: 'Adiar execução para a saída da função',
        fr: 'Reporter l\'exécution à la sortie de la fonction',
      },
      explanation: {
        es: '"defer f.Close()" garantiza que el archivo se cierre al salir de la función, incluso si ocurre un error.',
        en: '"defer f.Close()" ensures the file descriptor is released when exiting the function scope.',
        ja: '「defer f.Close()」により、関数の終了時に確実にファイルが解放されます。',
        zh: '"defer f.Close()" 确保在退出函数作用域时即使发生 panic 也能可靠释放文件句柄。',
        pt: '"defer f.Close()" garante a liberação do arquivo na finalização da função.',
        fr: '"defer f.Close()" garantit la libération du descripteur à la fin de la fonction.',
      },
    },
    {
      id: 'c05',
      title: {
        es: 'Iteración de colecciones',
        en: 'Collection iteration',
        ja: 'コレクションの反復',
        zh: '集合遍历迭代',
        pt: 'Iteração de coleções',
        fr: 'Itération sur une collection',
      },
      snippet: 'package main\nimport "fmt"\n\nfunc main() {\n  items := []string{"Go", "Rust"}\n  for _, v := ____ items {\n    fmt.Println(v)\n  }\n}',
      expected: 'range',
      placeholder: 'range',
      hint: {
        es: 'Iterador universal sobre slices, maps y strings',
        en: 'Universal iterator for slices, maps, and strings',
        ja: 'スライスやマップを反復するイテレータ構文',
        zh: '切片、映射和字符串的迭代关键字',
        pt: 'Iterador sobre fatias, mapas e strings',
        fr: 'Itérateur universel sur les slices et maps',
      },
      explanation: {
        es: '"range" itera sobre colecciones retornando el índice (o clave) y una copia del elemento.',
        en: '"range" iterates over collections, returning index/key and a copy of the element value.',
        ja: '「range」はコレクションを走査し、インデックスと要素の値を提供します。',
        zh: '"range" 遍历集合元素，按序返回索引（或键）和元素值的副本。',
        pt: '"range" itera sobre coleções retornando índice e cópia do elemento.',
        fr: '"range" parcourt les collections en renvoyant l\'indice et la valeur de l\'élément.',
      },
    },
  ],

  order: [
    {
      id: 'o01',
      title: {
        es: 'Estructura básica de un programa',
        en: 'Basic program structure',
        ja: '基本プログラム構造',
        zh: '基本程序结构',
        pt: 'Estrutura básica do programa',
        fr: 'Structure de base d\'un programme',
      },
      initialItems: [
        'fmt.Println("Hola")',
        'func main() {',
        'package main',
        'import "fmt"',
        '}',
      ],
      correctOrder: [
        'package main',
        'import "fmt"',
        'func main() {',
        'fmt.Println("Hola")',
        '}',
      ],
      explanation: {
        es: 'Todo ejecutable Go declara primero package main, imports y el punto de entrada func main().',
        en: 'Every Go executable begins with package main, followed by imports and func main().',
        ja: 'Go実行ファイルは package main から始まり、import、func main() の順に記述します。',
        zh: 'Go 可执行文件必须以 package main 开头，紧随 import，最后是 main 入口函数。',
        pt: 'Todo executável Go declara package main, imports e a função de entrada func main().',
        fr: 'Tout binaire Go commence par package main, ses imports puis func main().',
      },
    },
    {
      id: 'o02',
      title: {
        es: 'Función con retorno de suma',
        en: 'Function with sum return',
        ja: '加算関数の宣言と戻り値',
        zh: '带返回值的求和函数',
        pt: 'Função com retorno de soma',
        fr: 'Fonction avec retour d\'addition',
      },
      initialItems: [
        'return a + b',
        'package main',
        'func sumar(a int, b int) int {',
        '}',
      ],
      correctOrder: [
        'package main',
        'func sumar(a int, b int) int {',
        'return a + b',
        '}',
      ],
      explanation: {
        es: 'El paquete se declara al inicio, luego la firma con tipos y el bloque de cuerpo con return.',
        en: 'The package header comes first, then the typed signature and the body with return.',
        ja: 'パッケージ宣言、型シグネチャを持つ関数宣言、そしてreturn文を含む本体ブロックの順です。',
        zh: '包声明置于首行，其次是带显式参数类型和返回值的签名，最后是包含 return 的函数体。',
        pt: 'O pacote vem no início, seguido da assinatura tipada e corpo com return.',
        fr: 'Le paquet est déclaré en tête, suivi de la signature typée et du corps avec return.',
      },
    },
    {
      id: 'o03',
      title: {
        es: 'Estructura e inicialización',
        en: 'Struct definition and instance',
        ja: '構造体定義とインスタンス化',
        zh: '结构体声明与实例化',
        pt: 'Definição de struct e instância',
        fr: 'Définition de structure et instance',
      },
      initialItems: [
        'p := Punto{X: 10, Y: 20}',
        'package main',
        'func main() {',
        'type Punto struct { X, Y int }',
        '}',
      ],
      correctOrder: [
        'package main',
        'type Punto struct { X, Y int }',
        'func main() {',
        'p := Punto{X: 10, Y: 20}',
        '}',
      ],
      explanation: {
        es: 'Definir el struct a nivel de paquete permite que func main() lo instancie con claridad.',
        en: 'Declaring the struct at package level allows func main() to instantiate it clearly.',
        ja: 'パッケージレベルで型を定義することで、func main()内で自然にインスタンス化できます。',
        zh: '在包级别声明 struct 类型，使得在 main 函数中实例化清晰明了。',
        pt: 'Declarar a struct no escopo do pacote permite que func main() a instancie diretamente.',
        fr: 'Déclarer la struct au niveau du paquet permet à main() de l\'instancier proprement.',
      },
    },
    {
      id: 'o04',
      title: {
        es: 'Canal y concurrencia',
        en: 'Channel and concurrency',
        ja: 'チャネルと並行通信',
        zh: '通道与并发通信',
        pt: 'Canal e concorrência',
        fr: 'Canal et concurrence',
      },
      initialItems: [
        'msg := <-ch',
        'ch := make(chan string)',
        'go func() { ch <- "ok" }()',
        'println(msg)',
      ],
      correctOrder: [
        'ch := make(chan string)',
        'go func() { ch <- "ok" }()',
        'msg := <-ch',
        'println(msg)',
      ],
      explanation: {
        es: 'Primero se crea el canal con make, luego la goroutine emisora y finalmente la recepción.',
        en: 'Initialize the channel with make, spawn the producer goroutine, then receive from it.',
        ja: 'makeでチャネルを初期化し、送信側goroutineを起動、最後に値を受信します。',
        zh: '先使用 make 初始化通道，再启动生产者 goroutine 发送数据，最后从通道接收。',
        pt: 'Primeiro aloca o canal com make, lança a goroutine produtora e depois recebe os dados.',
        fr: 'On initialise le canal avec make, lance la goroutine émettrice, puis on réceptionne.',
      },
    },
    {
      id: 'o05',
      title: {
        es: 'Patrón idiomático de apertura y error',
        en: 'Idiomatic open and error handling',
        ja: '慣用的なエラー確認とdefer',
        zh: '惯用错误检查与资源延迟释放',
        pt: 'Padrão idiomático de erro e defer',
        fr: 'Patron idiomatique de gestion d\'erreur',
      },
      initialItems: [
        'defer f.Close()',
        'if err != nil { return err }',
        'f, err := os.Open("data.csv")',
      ],
      correctOrder: [
        'f, err := os.Open("data.csv")',
        'if err != nil { return err }',
        'defer f.Close()',
      ],
      explanation: {
        es: '¡Regla de oro Go! Comprueba siempre err != nil ANTES de llamar defer f.Close() para evitar nil dereference.',
        en: 'Golden Go rule: check err != nil BEFORE defer f.Close() to prevent nil pointer panics.',
        ja: 'Goの黄金律: nil参照パニックを防ぐため、defer f.Close()の前に必ず err != nil を確認します。',
        zh: 'Go 黄金法则：在 defer f.Close() 之前必须先检查 err != nil，防止 nil 指针解引用 panic。',
        pt: 'Regra de ouro Go: verifique err != nil ANTES de defer f.Close() para evitar pânico de ponteiro nil.',
        fr: 'Règle d\'or en Go : vérifiez err != nil AVANT defer f.Close() pour éviter un panic sur pointeur nil.',
      },
    },
  ],

  predict: [
    {
      id: 'p01',
      title: {
        es: 'Operación aritmética combinada',
        en: 'Arithmetic assignment',
        ja: '複合算術演算',
        zh: '复合算术赋值',
        pt: 'Operação aritmética combinada',
        fr: 'Affectation arithmétique',
      },
      snippet: 'x := 2\nx *= 3\nfmt.Println(x)',
      options: ['4', '5', '6', '8'],
      correctAnswer: '6',
      explanation: {
        es: 'x inicia en 2 y luego x *= 3 multiplica su valor por 3 dando 6.',
        en: 'x starts at 2, then x *= 3 multiplies by 3, yielding 6.',
        ja: 'xは2で初期化され、x *= 3により3倍の6になります。',
        zh: 'x 初始为 2，执行 x *= 3 后乘以 3 得到 6。',
        pt: 'x inicia em 2 e x *= 3 multiplica por 3, resultando em 6.',
        fr: 'x vaut 2, puis x *= 3 multiplie par 3 pour donner 6.',
      },
    },
    {
      id: 'p02',
      title: {
        es: 'Longitud de un slice',
        en: 'Slice length',
        ja: 'スライスの長さ',
        zh: '切片长度',
        pt: 'Comprimento de slice',
        fr: 'Longueur d\'un slice',
      },
      snippet: 'nums := []int{10, 20, 30}\nfmt.Println(len(nums))',
      options: ['2', '3', '4', '30'],
      correctAnswer: '3',
      explanation: {
        es: 'len(nums) retorna la cantidad de elementos en el slice literal, que es 3.',
        en: 'len(nums) returns the element count of the literal slice, which is 3.',
        ja: 'len(nums)はリテラルスライスの要素数（3）を返します。',
        zh: 'len(nums) 返回切片字面量中的元素数量，结果为 3。',
        pt: 'len(nums) retorna a quantidade de itens na fatia, ou seja, 3.',
        fr: 'len(nums) renvoie le nombre d\'éléments dans le slice, soit 3.',
      },
    },
    {
      id: 'p03',
      title: {
        es: 'Orden de ejecución con defer LIFO',
        en: 'Defer LIFO execution order',
        ja: 'deferのLIFO実行順序',
        zh: 'defer 的 LIFO 后进先出顺序',
        pt: 'Ordem LIFO de chamadas defer',
        fr: 'Ordre d\'exécution LIFO de defer',
      },
      snippet: 'defer fmt.Print("A")\ndefer fmt.Print("B")\nfmt.Print("C")',
      options: ['ABC', 'CBA', 'CAB', 'BAC'],
      correctAnswer: 'CBA',
      explanation: {
        es: '"C" se imprime de inmediato; luego los defers se ejecutan en orden inverso (B y después A), produciendo CBA.',
        en: '"C" prints first; the deferred calls run in LIFO order (B then A), producing CBA.',
        ja: '「C」が即座に出力され、遅延されたdeferは逆順（B、A）で実行されるため「CBA」になります。',
        zh: '"C" 立即打印；随后注册的 defer 按照后进先出顺序执行（先 B 后 A），最终输出 CBA。',
        pt: '"C" imprime primeiro; as chamadas defer rodam em ordem LIFO (B depois A), gerando CBA.',
        fr: '"C" s\'affiche immédiatement ; les appels defer s\'exécutent en LIFO (B puis A), donnant CBA.',
      },
    },
    {
      id: 'p04',
      title: {
        es: 'División entre números enteros',
        en: 'Integer division truncation',
        ja: '整数同士の除算',
        zh: '整数除法截断',
        pt: 'Divisão inteira',
        fr: 'Division entière',
      },
      snippet: 'a := 7\nb := 2\nfmt.Println(a / b)',
      options: ['3.5', '3', '4', '3.0'],
      correctAnswer: '3',
      explanation: {
        es: 'En Go, la división entre dos enteros es siempre una división entera que trunca los decimales a 3.',
        en: 'In Go, division between two integers truncates any fractional part toward zero, giving 3.',
        ja: 'Goでは整数同士の除算は小数点以下が切り捨てられ、結果は3になります。',
        zh: '在 Go 中，两个整数相除执行整除运算，小数部分被截断，结果为 3。',
        pt: 'No Go, a divisão entre dois inteiros trunca as casas decimais para 3.',
        fr: 'En Go, la division entre deux entiers tronque la partie décimale, donnant 3.',
      },
    },
    {
      id: 'p05',
      title: {
        es: 'Zero value de punteros',
        en: 'Pointer zero value',
        ja: 'ポインタ型のゼロ値',
        zh: '指针类型的零值',
        pt: 'Zero value de ponteiro',
        fr: 'Valeur par défaut d\'un pointeur',
      },
      snippet: 'var p *int\nfmt.Println(p == nil)',
      options: ['true', 'false', '0', 'nil'],
      correctAnswer: 'true',
      explanation: {
        es: 'Los punteros no inicializados en Go tienen como zero value "nil", por lo que p == nil es true.',
        en: 'Uninitialized pointers in Go default to nil; evaluating p == nil returns true.',
        ja: '初期化されていないポインタのゼロ値はnilであるため、p == nil は true になります。',
        zh: '未显式分配的指针在 Go 中的零值为 nil，因此表达式 p == nil 返回 true。',
        pt: 'Ponteiros não inicializados no Go possuem zero value nil, logo p == nil é true.',
        fr: 'Les pointeurs non initialisés valent nil par défaut, donc p == nil retourne true.',
      },
    },
  ],

  bug: [
    {
      id: 'b01',
      question: {
        es: '¿Qué símbolo falta en fmt.Println("Hola" ?',
        en: 'What symbol is missing in fmt.Println("Hola" ?',
        ja: 'fmt.Println("Hola" に欠けている記号は何ですか？',
        zh: 'fmt.Println("Hola" 中缺少哪个符号？',
        pt: 'O que falta em fmt.Println("Hola" ?',
        fr: 'Que manque-t-il dans fmt.Println("Hola" ?',
      },
      snippet: 'fmt.Println("Hola"',
      options: [
        { id: 'semicolon', text: ';' },
        { id: 'parenthesis', text: ')' },
        { id: 'bracket', text: '}' },
        { id: 'quote', text: '"' },
      ],
      correctAnswer: 'parenthesis',
      explanation: {
        es: 'Falta cerrar el paréntesis de cierre ")" de la función fmt.Println.',
        en: 'The closing parenthesis ")" is missing for the fmt.Println function call.',
        ja: '関数呼び出しを閉じる括弧「)」が抜けています。',
        zh: '缺少 fmt.Println 函数调用的闭合右括号 ")"。',
        pt: 'Falta fechar o parêntese ")" da chamada de função.',
        fr: 'Il manque la parenthèse fermante ")" pour l\'appel de fonction.',
      },
    },
    {
      id: 'b02',
      question: {
        es: '¿Qué falta en la condición if x > 10 fmt.Println("Mayor") } ?',
        en: 'What is missing in if x > 10 fmt.Println("Mayor") } ?',
        ja: 'if x > 10 fmt.Println("Mayor") } に欠けているものは何ですか？',
        zh: 'if x > 10 fmt.Println("Mayor") } 中缺少什么？',
        pt: 'O que falta na condição if x > 10 fmt.Println("Mayor") } ?',
        fr: 'Que manque-t-il dans if x > 10 fmt.Println("Mayor") } ?',
      },
      snippet: 'if x > 10\n  fmt.Println("Mayor")\n}',
      options: [
        { id: 'bracket_open', text: '{' },
        { id: 'then', text: 'then' },
        { id: 'colon', text: ':' },
        { id: 'semicolon', text: ';' },
      ],
      correctAnswer: 'bracket_open',
      explanation: {
        es: 'En Go las llaves "{ }" son siempre obligatorias en bloques condicionales if.',
        en: 'In Go, curly braces "{ }" are strictly required for if block bodies.',
        ja: 'Go言語のifブロックでは中括弧「{ }」が必須です。開始の中括弧「{」が欠落しています。',
        zh: '在 Go 中，if 条件语句体必须强制包含大括号 "{ }"，此处缺少左大括号 "{"。',
        pt: 'No Go, chaves "{ }" são obrigatórias em blocos if. Falta a chave de abertura "{".',
        fr: 'En Go, les accolades "{ }" sont obligatoires sur les blocs if. L\'accolade "{" manque.',
      },
    },
    {
      id: 'b03',
      question: {
        es: '¿Cómo se debe corregir la declaración corta de nombre = "Gopher" ?',
        en: 'How to fix the local short variable declaration: nombre = "Gopher" ?',
        ja: 'ローカル変数宣言 nombre = "Gopher" を正しく直す記号は何ですか？',
        zh: '如何修正局部短变量声明：nombre = "Gopher"？',
        pt: 'Como corrigir a declaração curta: nombre = "Gopher" ?',
        fr: 'Comment corriger la déclaration courte : nombre = "Gopher" ?',
      },
      snippet: '// Inicializar nueva variable local:\nnombre = "Gopher"',
      options: [
        { id: 'colon_eq', text: ':=' },
        { id: 'let', text: 'let' },
        { id: 'auto', text: 'auto' },
        { id: 'pointer', text: '*' },
      ],
      correctAnswer: 'colon_eq',
      explanation: {
        es: 'En Go, para declarar e inicializar una nueva variable local con inferencia de tipo se usa ":=".',
        en: 'In Go, ":=" is the short variable declaration operator used to infer and initialize local variables.',
        ja: 'Goではローカル変数の型推論と新規宣言に「:=」演算子を使用します。',
        zh: '在 Go 中，局部新变量的类型推断与初始化必须使用短变量声明操作符 ":="。',
        pt: 'No Go, para declarar e inicializar variável local com inferência usa-se ":=".',
        fr: 'En Go, l\'opérateur ":=" est requis pour déclarer et initialiser une variable locale inférée.',
      },
    },
    {
      id: 'b04',
      question: {
        es: '¿Qué falta antes de enviar datos para evitar un bloqueo perpetuo (deadlock)?',
        en: 'What is missing before sending to avoid permanent deadlock?',
        ja: 'デッドロックを防ぎチャネル送信を成功させるために必要な初期化は何ですか？',
        zh: '发送数据前缺少什么初始化以防止死锁（deadlock）？',
        pt: 'O que falta antes de enviar dados para evitar deadlock perpétuo?',
        fr: 'Que manque-t-il avant l\'envoi pour éviter un deadlock permanent ?',
      },
      snippet: 'var ch chan int\nch <- 42 // canal nil causa deadlock',
      options: [
        { id: 'make_chan', text: 'ch = make(chan int, 1)' },
        { id: 'close_chan', text: 'close(ch)' },
        { id: 'go_send', text: 'go (ch <- 42)' },
        { id: 'ptr_chan', text: '&ch' },
      ],
      correctAnswer: 'make_chan',
      explanation: {
        es: 'Un canal declarado sin make es nil. Enviar o recibir de un canal nil bloquea para siempre.',
        en: 'A channel declared without make is nil; sending to a nil channel blocks indefinitely.',
        ja: 'make呼び出しを行わないチャネルはnilです。nilチャネルへの送受信は永久ブロックを引き起こします。',
        zh: '未经 make 初始化的通道为 nil。对 nil 通道执行发送或接收操作将永久阻塞造成死锁。',
        pt: 'Um canal sem make é nil. Enviar dados para canal nil bloqueia indefinidamente.',
        fr: 'Un canal sans make est nil. Tout envoi vers un canal nil bloque indéfiniment.',
      },
    },
    {
      id: 'b05',
      question: {
        es: '¿Por qué falla el siguiente código de constantes?',
        en: 'Why does the following constant code fail to compile?',
        ja: '次の定数コードがコンパイルエラーになる理由は何ですか？',
        zh: '以下常量代码编译失败的原因是什么？',
        pt: 'Por que o código de constante a seguir falha?',
        fr: 'Pourquoi ce code de constantes échoue-t-il à la compilation ?',
      },
      snippet: 'const Pi = 3.14\nPi = 3.14159',
      options: [
        { id: 'const_reassign', text: 'Las constantes son inmutables' },
        { id: 'type_float', text: 'Falta tipo float64' },
        { id: 'math_pkg', text: 'Se debe importar math' },
        { id: 'syntax_colon', text: 'Debe usarse :=' },
      ],
      correctAnswer: 'const_reassign',
      explanation: {
        es: 'En Go, las constantes definidas con "const" son valores inmutables en tiempo de compilación.',
        en: 'In Go, constants declared with "const" cannot be reassigned; they are compile-time immutable.',
        ja: 'Goの定数（const）はコンパイル時の不変値であり、再代入は許可されていません。',
        zh: 'Go 语言中使用 "const" 定义的常量是编译期不可变值，不能对其重新赋值。',
        pt: 'No Go, constantes são imutáveis em tempo de compilação e não podem ser reatribuídas.',
        fr: 'En Go, les constantes sont immuables au moment de la compilation et ne peuvent pas être réassignées.',
      },
    },
  ],
};
