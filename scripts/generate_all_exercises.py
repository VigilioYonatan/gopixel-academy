#!/usr/bin/env python3
"""
Complete generator for all 36 curriculum exercises in GoPixel Academy:
- Basic: B01 - B12
- Intermediate: I01 - I12
- Advanced: A01 - A12
Generates src/data/learning-exercises.ts with full multi-language guides (ES, EN, JA, ZH, PT, FR).
"""
import json
from pathlib import Path

modules = [
    # ---------------- BASICS (B01 - B12) ----------------
    {
        "id": "B01",
        "title": "Introducción a Go",
        "code": 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("_____")\n}',
        "test": r'c => /fmt\.Println\(\s*"Hola, Go!"\s*\)/.test(c)',
        "hint": 'fmt.Println("Hola, Go!")',
        "m_es": 'Reemplaza los guiones "_____" en fmt.Println por "Hola, Go!" y pulsa "Comprobar solución".',
        "m_en": 'Replace the underscores "_____" in fmt.Println with "Hola, Go!" and click "Check solution".',
        "m_ja": 'fmt.Println の "_____" を "Hola, Go!" に置き換えて「解答を確認」をクリックしてください。',
        "m_zh": '将 fmt.Println 中的 "_____" 替换为 "Hola, Go!"，然后点击“验证代码”。',
        "m_pt": 'Substitua os sublinhados "_____" em fmt.Println por "Hola, Go!" e clique em "Validar solução".',
        "m_fr": 'Remplacez les tirets "_____" dans fmt.Println par "Hola, Go!" et cliquez sur "Vérifier la solution".',
        "terms": [
            ("package main", "Punto de entrada ejecutable.", "Executable program entrypoint."),
            ("import fmt", "Paquete estándar para I/O formateada.", "Standard I/O formatting package."),
            ("func main()", "Función principal donde inicia la ejecución.", "Root function where execution begins.")
        ]
    },
    {
        "id": "B02",
        "title": "Variables y constantes",
        "code": 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Declara edad con valor 25 y pi constante 3.14\n    edad := 25\n    const pi = 3.14\n    fmt.Printf("Edad: %d, Pi: %.2f\\n", edad, pi)\n}',
        "test": r'c => /(edad\s*:=\s*25|var\s+edad\s+(?:int\s*)?=\s*25)\s*.*const\s+pi\s*=\s*3\.14/s.test(c)',
        "hint": 'edad := 25\nconst pi = 3.14',
        "m_es": 'Declara la variable "edad" con valor 25 usando ":=" y la constante "pi" con 3.14.',
        "m_en": 'Declare variable "edad" with value 25 using ":=" and constant "pi" with 3.14.',
        "m_ja": '":=" を使って変数 "edad" (25) と定数 "pi" (3.14) を宣言してください。',
        "m_zh": '使用 ":=" 声明变量 "edad"（25），并声明常量 "pi"（3.14）。',
        "m_pt": 'Declare a variável "edad" com valor 25 usando ":=" e a constante "pi" com 3.14.',
        "m_fr": 'Déclarez la variable "edad" avec 25 via ":=" et la constante "pi" avec 3.14.',
        "terms": [
            (":= (Short declaration)", "Inferencia de tipos automática en funciones.", "Automatic type inference in functions."),
            ("const", "Constantes inmutables en tiempo de compilación.", "Immutable compile-time constants.")
        ]
    },
    {
        "id": "B03",
        "title": "Tipos de datos",
        "code": 'package main\n\nimport "fmt"\n\nfunc main() {\n    var peso int = 70\n    // Convierte peso a float64 en la variable pesoFloat\n    pesoFloat := float64(peso)\n    fmt.Println(pesoFloat)\n}',
        "test": r'c => /float64\(\s*peso\s*\)/.test(c)',
        "hint": 'pesoFloat := float64(peso)',
        "m_es": 'Convierte la variable entera "peso" a float64 usando conversión explícita float64(peso).',
        "m_en": 'Convert integer "peso" to float64 using explicit conversion float64(peso).',
        "m_ja": '明示的な型変換 float64(peso) を使用して整数 peso を float64 に変換してください。',
        "m_zh": '使用显式类型转换 float64(peso) 将整数 peso 转换为 float64。',
        "m_pt": 'Converta a variável "peso" para float64 usando float64(peso).',
        "m_fr": 'Convertissez la variable "peso" en float64 avec float64(peso).',
        "terms": [
            ("Tipado fuerte", "Go no realiza conversiones numéricas implícitas.", "Go performs zero implicit numeric conversions."),
            ("Conversión explícita", "T(v) convierte explícitamente el valor.", "T(v) explicitly casts the value safely.")
        ]
    },
    {
        "id": "B04",
        "title": "Condicionales y bucles",
        "code": 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Escribe un bucle for que sume los números del 1 al 5 en total\n    total := 0\n    for i := 1; i <= 5; i++ {\n        total += i\n    }\n    fmt.Println("Total:", total)\n}',
        "test": r'c => /for\s+\w+\s*:=\s*1\s*;\s*\w+\s*<=\s*5\s*;\s*\w+\+\+/.test(c)',
        "hint": 'for i := 1; i <= 5; i++ { total += i }',
        "m_es": 'Escribe un bucle for estándar que itere desde 1 hasta 5 y acumule la suma en "total".',
        "m_en": 'Write a standard for loop iterating from 1 to 5 and accumulating in "total".',
        "m_ja": '1から5まで反復し、"total" に加算する for ループを書いてください。',
        "zh": '编写标准的 for 循环，从 1 到 5 累加至 "total"。',
        "m_pt": 'Escreva um loop for de 1 a 5 acumulando em "total".',
        "m_fr": 'Écrivez une boucle for de 1 à 5 en accumulant dans "total".',
        "terms": [
            ("for unificado", "Bucle único en Go que cubre bucles clásicos y while.", "Unified loop keyword replacing for and while.")
        ]
    },
    {
        "id": "B05",
        "title": "Funciones",
        "code": 'package main\n\nimport "fmt"\n\n// Crea la función dividir que devuelve (resultado int, resto int)\nfunc dividir(a, b int) (int, int) {\n    return a / b, a % b\n}\n\nfunc main() {\n    c, r := dividir(10, 3)\n    fmt.Printf("Cociente: %d, Resto: %d\\n", c, r)\n}',
        "test": r'c => /func\s+dividir\s*\(\s*\w+,\s*\w+\s+int\s*\)\s*\(\s*int\s*,\s*int\s*\)/.test(c)',
        "hint": 'func dividir(a, b int) (int, int) { return a / b, a % b }',
        "m_es": 'Define la función dividir(a, b int) que retorne dos enteros: el cociente y el resto.',
        "m_en": 'Define function dividir(a, b int) returning two integers: quotient and remainder.',
        "m_ja": '商と余りの2つの整数を返す関数 dividir(a, b int) (int, int) を定義してください。',
        "m_zh": '定义函数 dividir(a, b int)，返回两个整数：商与余数。',
        "m_pt": 'Defina a função dividir(a, b int) que retorne dois inteiros: quociente e resto.',
        "m_fr": 'Définissez la fonction dividir(a, b int) renvoyant deux entiers: quotient et reste.',
        "terms": [
            ("Retorno múltiple", "Capacidad de devolver varios valores sin tuplas complejas.", "Return multiple values cleanly without tuples.")
        ]
    },
    {
        "id": "B06",
        "title": "Arrays y slices",
        "code": 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Crea un slice con make de longitud 0 y capacidad 5\n    numeros := make([]int, 0, 5)\n    // Agrega los números 10 y 20 con append\n    numeros = append(numeros, 10, 20)\n    fmt.Printf("Slice: %v, Len: %d, Cap: %d\\n", numeros, len(numeros), cap(numeros))\n}',
        "test": r'c => /make\s*\(\s*\[\]int\s*,\s*0\s*,\s*5\s*\)\s*.*append\s*\(\s*numeros\s*,\s*10\s*,\s*20\s*\)/s.test(c)',
        "hint": 'numeros := make([]int, 0, 5)\nnumeros = append(numeros, 10, 20)',
        "m_es": 'Crea un slice de enteros con make([]int, 0, 5) y añade 10 y 20 usando append.',
        "m_en": 'Create an int slice with make([]int, 0, 5) and add 10 and 20 via append.',
        "m_ja": 'make([]int, 0, 5) でスライスを作成し、append で 10 と 20 を追加してください。',
        "m_zh": '使用 make([]int, 0, 5) 创建切片，并通过 append 添加 10 与 20。',
        "m_pt": 'Crie um slice com make([]int, 0, 5) e adicione 10 e 20 com append.',
        "m_fr": 'Créez une slice avec make([]int, 0, 5) et ajoutez 10 et 20 via append.',
        "terms": [
            ("Slice Header", "Puntero al array, longitud (len) y capacidad (cap).", "Pointer to array, length (len) and capacity (cap)."),
            ("append()", "Añade elementos y redimensiona dinámicamente.", "Appends elements and dynamically resizes buffer.")
        ]
    },
    {
        "id": "B07",
        "title": "Maps",
        "code": 'package main\n\nimport "fmt"\n\nfunc main() {\n    capitales := map[string]string{"Perú": "Lima", "España": "Madrid"}\n    // Comprueba si existe "Perú" usando el modismo comma-ok\n    ciudad, ok := capitales["Perú"]\n    if ok {\n        fmt.Println("Capital encontrada:", ciudad)\n    }\n}',
        "test": r'c => /\w+,\s*ok\s*:=\s*capitales\s*\[\s*"Perú"\s*\]/.test(c)',
        "hint": 'ciudad, ok := capitales["Perú"]',
        "m_es": 'Consulta el mapa "capitales" para "Perú" usando el modismo comma-ok (ciudad, ok := capitales["Perú"]).',
        "m_en": 'Query map "capitales" for "Perú" using comma-ok idiom (ciudad, ok := capitales["Perú"]).',
        "m_ja": 'comma-ok 構文 (ciudad, ok := capitales["Perú"]) を使ってマップを照会してください。',
        "m_zh": '使用 comma-ok 惯用法 (ciudad, ok := capitales["Perú"]) 查询 map。',
        "m_pt": 'Consulte o map "capitales" usando o padrão comma-ok.',
        "m_fr": 'Consultez la map "capitales" en utilisant l\'idiome comma-ok.',
        "terms": [
            ("Comma-ok", "Distingue entre un valor zero y una clave ausente.", "Distinguishes zero values from missing keys.")
        ]
    },
    {
        "id": "B08",
        "title": "Structs",
        "code": 'package main\n\nimport "fmt"\n\n// Define la estructura Usuario con campos Nombre string y Edad int\ntype Usuario struct {\n    Nombre string\n    Edad   int\n}\n\nfunc main() {\n    u := Usuario{Nombre: "Gopher", Edad: 12}\n    fmt.Printf("Usuario: %+v\\n", u)\n}',
        "test": r'c => /type\s+Usuario\s+struct\s*\{[^}]*Nombre\s+string[^}]*Edad\s+int[^}]*\}/s.test(c)',
        "hint": 'type Usuario struct {\n    Nombre string\n    Edad   int\n}',
        "m_es": 'Declara el struct "Usuario" con los campos Nombre (string) y Edad (int) e inicialízalo.',
        "m_en": 'Declare struct "Usuario" with fields Nombre (string) and Edad (int) and instantiate it.',
        "m_ja": 'Nombre (string) と Edad (int) を持つ構造体 Usuario を宣言してください。',
        "m_zh": '声明结构体 Usuario，包含 Nombre (string) 与 Edad (int) 两个字段。',
        "m_pt": 'Declare o struct "Usuario" com os campos Nombre string e Edad int.',
        "m_fr": 'Déclarez la struct "Usuario" avec les champs Nombre string et Edad int.',
        "terms": [
            ("struct", "Estructura de datos contigua en memoria sin herencia.", "Contiguous in-memory field collection without class inheritance.")
        ]
    },
    {
        "id": "B09",
        "title": "Punteros",
        "code": 'package main\n\nimport "fmt"\n\n// Escribe la función incrementar que recibe *int y suma 1\nfunc incrementar(n *int) {\n    *n += 1\n}\n\nfunc main() {\n    valor := 10\n    incrementar(&valor)\n    fmt.Println("Valor incrementado:", valor)\n}',
        "test": r'c => /func\s+incrementar\s*\(\s*\w+\s*\*int\s*\)\s*\{[^}]*\*?\w+\s*\+?=\s*1/s.test(c)',
        "hint": 'func incrementar(n *int) {\n    *n += 1\n}',
        "m_es": 'Crea la función incrementar(n *int) que modifique el valor original usando "*n += 1".',
        "m_en": 'Create function incrementar(n *int) modifying original value via "*n += 1".',
        "m_ja": '逆参照 "*n += 1" を使って元の値を加算する関数 incrementar(n *int) を作成してください。',
        "m_zh": '创建函数 incrementar(n *int)，通过 "*n += 1" 修改原变量。',
        "m_pt": 'Crie a função incrementar(n *int) alterando o valor com "*n += 1".',
        "m_fr": 'Créez la fonction incrementar(n *int) modifiant la valeur avec "*n += 1".',
        "terms": [
            ("& Operador", "Obtiene la dirección de memoria.", "Yields memory address."),
            ("* Operador", "Accede o modifica el valor desreferenciado.", "Dereferences pointer to read or mutate.")
        ]
    },
    {
        "id": "B10",
        "title": "Métodos e interfaces",
        "code": 'package main\n\nimport "fmt"\n\ntype Rectangulo struct {\n    Ancho, Alto float64\n}\n\n// Implementa el método Area con receptor (r Rectangulo)\nfunc (r Rectangulo) Area() float64 {\n    return r.Ancho * r.Alto\n}\n\nfunc main() {\n    rect := Rectangulo{Ancho: 10, Alto: 5}\n    fmt.Println("Área:", rect.Area())\n}',
        "test": r'c => /func\s*\(\s*\w+\s+Rectangulo\s*\)\s*Area\s*\(\s*\)\s*float64/.test(c)',
        "hint": 'func (r Rectangulo) Area() float64 {\n    return r.Ancho * r.Alto\n}',
        "m_es": 'Implementa el método Area() float64 con receptor por valor sobre la estructura Rectangulo.',
        "m_en": 'Implement method Area() float64 with a value receiver on struct Rectangulo.',
        "m_ja": 'Rectangulo 構造体に値レシーバを持つメソッド Area() float64 を実装してください。',
        "m_zh": '为 Rectangulo 结构体实现带值接收者的方法 Area() float64。',
        "m_pt": 'Implemente o método Area() float64 no struct Rectangulo.',
        "m_fr": 'Implémentez la méthode Area() float64 sur la struct Rectangulo.',
        "terms": [
            ("Receptor de método", "Asocia funciones a tipos sin requerir clases.", "Attaches functions to types cleanly.")
        ]
    },
    {
        "id": "B11",
        "title": "Errores y defer",
        "code": 'package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\nfunc validarSaldo(saldo int) error {\n    if saldo < 0 {\n        return errors.New("saldo no puede ser negativo")\n    }\n    return nil\n}\n\nfunc main() {\n    defer fmt.Println("Operación finalizada.")\n    err := validarSaldo(-5)\n    if err != nil {\n        fmt.Println("Error:", err)\n    }\n}',
        "test": r'c => /errors\.New\s*\([^)]+\)\s*.*defer\s+/s.test(c)',
        "hint": 'return errors.New("saldo negativo")\ndefer fmt.Println(...)',
        "m_es": 'Retorna errors.New ante saldos negativos y usa defer para registrar el cierre de la operación.',
        "m_en": 'Return errors.New on negative balance and use defer to log operation completion.',
        "m_ja": '残高が負のとき errors.New を返し、defer で終了メッセージを出力してください。',
        "m_zh": '余额为负时返回 errors.New，并用 defer 打印结束信息。',
        "m_pt": 'Retorne errors.New para saldos negativos e use defer para finalizar.',
        "m_fr": 'Renvoyez errors.New pour solde négatif et utilisez defer pour terminer.',
        "terms": [
            ("error como valor", "Comprobación explícita mediante if err != nil.", "Explicit checking via if err != nil."),
            ("defer", "Pospone la ejecución hasta la salida de la función.", "Executes cleanup statement right before return.")
        ]
    },
    {
        "id": "B12",
        "title": "Proyecto básico: Mini Bank",
        "code": 'package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\ntype Cuenta struct {\n    Titular string\n    Saldo   float64\n}\n\nfunc (c *Cuenta) Depositar(monto float64) {\n    c.Saldo += monto\n}\n\nfunc (c *Cuenta) Retirar(monto float64) error {\n    if monto > c.Saldo {\n        return errors.New("fondos insuficientes")\n    }\n    c.Saldo -= monto\n    return nil\n}\n\nfunc main() {\n    cuenta := Cuenta{Titular: "Alice", Saldo: 100}\n    cuenta.Depositar(50)\n    err := cuenta.Retirar(30)\n    fmt.Printf("Saldo final: %.2f (Error: %v)\\n", cuenta.Saldo, err)\n}',
        "test": r'c => /func\s*\(\s*\w+\s*\*Cuenta\s*\)\s*Depositar\s*\([^)]*\)\s*.*func\s*\(\s*\w+\s*\*Cuenta\s*\)\s*Retirar\s*\([^)]*\)\s*error/s.test(c)',
        "hint": 'func (c *Cuenta) Depositar(monto float64) { c.Saldo += monto }\nfunc (c *Cuenta) Retirar(monto float64) error { ... }',
        "m_es": 'Construye el proyecto integrador: struct Cuenta con métodos Depositar y Retirar con control de fondos.',
        "m_en": 'Build the capstone project: struct Cuenta with Depositar and Retirar methods checking funds.',
        "m_ja": '総合課題: Depositar と残高確認付きの Retirar メソッドを持つ構造体 Cuenta を作成してください。',
        "m_zh": '综合实战：构建 Cuenta 结构体，包含 Depositar 充值与带余额检查的 Retirar 取款方法。',
        "m_pt": 'Construa o projeto integrador: struct Cuenta com Depositar e Retirar validando saldo.',
        "m_fr": 'Construisez le projet intégrateur: struct Cuenta avec méthodes Depositar et Retirar.',
        "terms": [
            ("Puntero receptor mutante", "Permite a los métodos alterar el saldo del struct original.", "Allows methods to mutate original balance."),
            ("Regla de negocio", "Validación defensiva que devuelve error ante fondos insuficientes.", "Defensive business rule enforcement.")
        ]
    },

    # ---------------- INTERMEDIATE (I01 - I12) ----------------
    {
        "id": "I01",
        "title": "Interfaces avanzadas",
        "code": 'package main\n\nimport "fmt"\n\ntype Notificador interface {\n    Enviar(mensaje string) string\n}\n\ntype EmailNotificador struct {\n    Email string\n}\n\nfunc (e EmailNotificador) Enviar(mensaje string) string {\n    return fmt.Sprintf("Email a %s: %s", e.Email, mensaje)\n}\n\nfunc main() {\n    var n Notificador = EmailNotificador{Email: "dev@gopixel.io"}\n    fmt.Println(n.Enviar("Servicio activo"))\n}',
        "test": r'c => /type\s+Notificador\s+interface\s*\{[^}]*Enviar\s*\([^)]*\)\s*string[^}]*\}\s*.*func\s*\(\s*\w+\s+EmailNotificador\s*\)\s*Enviar/s.test(c)',
        "hint": 'type Notificador interface { Enviar(mensaje string) string }',
        "m_es": 'Define la interfaz Notificador con método Enviar(string) string e impleméntala en EmailNotificador.',
        "m_en": 'Define interface Notificador with method Enviar(string) string and implement it in EmailNotificador.',
        "m_ja": 'Enviar(string) string を持つインターフェース Notificador を定義し、EmailNotificador に実装してください。',
        "m_zh": '定义具有 Enviar(string) string 方法的接口 Notificador，并在 EmailNotificador 中实现。',
        "m_pt": 'Defina a interface Notificador com Enviar(string) string e implemente-a em EmailNotificador.',
        "m_fr": 'Définissez l\'interface Notificador avec Enviar(string) string et implémentez-la dans EmailNotificador.',
        "terms": [
            ("Duck typing estático", "La implementación de interfaces en Go es 100% implícita.", "Implicit compile-time interface implementation.")
        ]
    },
    {
        "id": "I02",
        "title": "Genéricos",
        "code": 'package main\n\nimport "fmt"\n\n// Implementa la función genérica Minimo con restricción numérica\nfunc Minimo[T int | float64](a, b T) T {\n    if a < b {\n        return a\n    }\n    return b\n}\n\nfunc main() {\n    fmt.Println("Mínimo int:", Minimo(10, 20))\n    fmt.Println("Mínimo float:", Minimo(3.14, 2.71))\n}',
        "test": r'c => /func\s+Minimo\s*\[\s*\w+\s+[^\]]+\]\s*\(\s*\w+,\s*\w+\s+\w+\s*\)\s*\w+/.test(c)',
        "hint": 'func Minimo[T int | float64](a, b T) T {\n    if a < b { return a }\n    return b\n}',
        "m_es": 'Crea la función genérica Minimo[T int | float64](a, b T) T que retorne el menor de dos valores.',
        "m_en": 'Create generic function Minimo[T int | float64](a, b T) T returning the smaller value.',
        "m_ja": '2つの値のうち小さい方を返すジェネリック関数 Minimo[T int | float64](a, b T) T を作成してください。',
        "m_zh": '创建泛型函数 Minimo[T int | float64](a, b T) T，返回两个值中的较小者。',
        "m_pt": 'Crie a função genérica Minimo[T int | float64](a, b T) T que retorne o menor valor.',
        "m_fr": 'Créez la fonction générique Minimo[T int | float64](a, b T) T renvoyant la plus petite valeur.',
        "terms": [
            ("Type parameters [T]", "Permiten escribir algoritmos reutilizables con seguridad de tipos.", "Type parameters enabling reusable type-safe logic.")
        ]
    },
    {
        "id": "I03",
        "title": "Paquetes y módulos",
        "code": 'package main\n\nimport "fmt"\n\n// Una función exportada DEBE iniciar con letra Mayúscula\nfunc CalcularTotal(precios []float64) float64 {\n    var suma float64\n    for _, p := range precios {\n        suma += p\n    }\n    return suma\n}\n\nfunc main() {\n    items := []float64{10.50, 4.25, 15.00}\n    fmt.Printf("Total exportado: $%.2f\\n", CalcularTotal(items))\n}',
        "test": r'c => /func\s+CalcularTotal\s*\(\s*\w+\s+\[\]float64\s*\)\s*float64/.test(c)',
        "hint": 'func CalcularTotal(precios []float64) float64 { ... }',
        "m_es": 'Escribe la función exportable CalcularTotal(precios []float64) float64 respetando la regla de mayúsculas.',
        "m_en": 'Write exported function CalcularTotal(precios []float64) float64 respecting Go capitalization rules.',
        "m_ja": '大文字始まりのエクスポート規則に従い、関数 CalcularTotal(precios []float64) float64 を作成してください。',
        "m_zh": '遵循首字母大写导出规则，编写可导出的函数 CalcularTotal(precios []float64) float64。',
        "m_pt": 'Escreva a função exportável CalcularTotal(precios []float64) float64 com inicial maiúscula.',
        "m_fr": 'Écrivez la fonction exportée CalcularTotal(precios []float64) float64 avec majuscule initiale.',
        "terms": [
            ("Visibilidad por casing", "Mayúscula = público/exportado, Minúscula = privado al paquete.", "Uppercase = exported, Lowercase = package-private.")
        ]
    },
    {
        "id": "I04",
        "title": "Manejo de errores",
        "code": 'package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\nvar ErrNotFound = errors.New("no encontrado")\n\nfunc BuscarItem(id int) error {\n    if id < 0 {\n        return fmt.Errorf("fallo de búsqueda id %d: %w", id, ErrNotFound)\n    }\n    return nil\n}\n\nfunc main() {\n    err := BuscarItem(-1)\n    if errors.Is(err, ErrNotFound) {\n        fmt.Println("Error centinela detectado:", err)\n    }\n}',
        "test": r'c => /fmt\.Errorf\s*\([^)]*%w[^)]*\)\s*.*errors\.Is/s.test(c)',
        "hint": 'return fmt.Errorf("...: %w", ErrNotFound)\nerrors.Is(err, ErrNotFound)',
        "m_es": 'Envuelve un error centinela usando fmt.Errorf con el verbo %w y compruébalo con errors.Is.',
        "m_en": 'Wrap a sentinel error using fmt.Errorf with %w verb and inspect it with errors.Is.',
        "m_ja": 'fmt.Errorf の %w でエラーをラップし、errors.Is で判定してください。',
        "m_zh": '使用 fmt.Errorf 的 %w 动词包装哨兵错误，并通过 errors.Is 检查。',
        "m_pt": 'Empacote um erro usando fmt.Errorf com %w e valide com errors.Is.',
        "m_fr": 'Enveloppez une erreur avec fmt.Errorf (%w) et vérifiez avec errors.Is.',
        "terms": [
            ("Error Wrapping (%w)", "Preserva la cadena causal de errores para inspección programática.", "Preserves error causality chain for programmatic checks.")
        ]
    },
    {
        "id": "I05",
        "title": "Archivos y streams",
        "code": 'package main\n\nimport (\n    "bufio"\n    "fmt"\n    "strings"\n)\n\nfunc contarLineas(texto string) int {\n    scanner := bufio.NewScanner(strings.NewReader(texto))\n    lineas := 0\n    for scanner.Scan() {\n        lineas++\n    }\n    return lineas\n}\n\nfunc main() {\n    txt := "Go\\nPixel\\nAcademy"\n    fmt.Printf("Total líneas escaneadas: %d\\n", contarLineas(txt))\n}',
        "test": r'c => /bufio\.NewScanner\s*\(.*scanner\.Scan\s*\(\)/s.test(c)',
        "hint": 'scanner := bufio.NewScanner(reader)\nfor scanner.Scan() { lineas++ }',
        "m_es": 'Usa bufio.NewScanner y el bucle scanner.Scan() para procesar texto línea por línea como un stream.',
        "m_en": 'Use bufio.NewScanner and scanner.Scan() loop to process text line-by-line as a stream.',
        "m_ja": 'bufio.NewScanner と scanner.Scan() を使ってストリームを行ごとに処理してください。',
        "m_zh": '使用 bufio.NewScanner 和 scanner.Scan() 逐行处理文本流。',
        "m_pt": 'Use bufio.NewScanner e scanner.Scan() para processar texto linha por linha.',
        "m_fr": 'Utilisez bufio.NewScanner et scanner.Scan() pour traiter un flux ligne par ligne.',
        "terms": [
            ("bufio.Scanner", "Lectura eficiente con buffer sin cargar todo el archivo en memoria.", "Buffered streaming without reading entire files into RAM.")
        ]
    },
    {
        "id": "I06",
        "title": "JSON y serialización",
        "code": 'package main\n\nimport (\n    "encoding/json"\n    "fmt"\n)\n\ntype Servidor struct {\n    Host   string `json:"host"`\n    Puerto int    `json:"puerto"`\n}\n\nfunc main() {\n    srv := Servidor{Host: "localhost", Puerto: 8080}\n    datos, _ := json.Marshal(srv)\n    fmt.Println("JSON generado:", string(datos))\n}',
        "test": r'c => /`json:"[^"]+"`.*json\.Marshal/s.test(c)',
        "hint": 'type Servidor struct {\n    Host string `json:"host"`\n    Puerto int `json:"puerto"`\n}\ndatos, _ := json.Marshal(srv)',
        "m_es": 'Agrega struct tags de JSON (`json:"campo"`) y serializa una instancia con json.Marshal.',
        "m_en": 'Add JSON struct tags (`json:"field"`) and serialize an instance with json.Marshal.',
        "m_ja": 'JSON構造体タグ (`json:"field"`) を定義し、json.Marshal でシリアライズしてください。',
        "m_zh": '添加 JSON 结构体标签 (`json:"field"`)，并用 json.Marshal 序列化。',
        "m_pt": 'Adicione tags JSON (`json:"campo"`) e serialize com json.Marshal.',
        "m_fr": 'Ajoutez des tags JSON (`json:"champ"`) et sérialisez avec json.Marshal.',
        "terms": [
            ("Struct tags", "Metadatos leídos por reflexión para mapear campos en JSON/BSON.", "Reflection metadata mapping Go struct fields to JSON.")
        ]
    },
    {
        "id": "I07",
        "title": "HTTP y clientes",
        "code": 'package main\n\nimport (\n    "fmt"\n    "net/http"\n    "time"\n)\n\nfunc crearClienteSeguro() *http.Client {\n    return &http.Client{\n        Timeout: 5 * time.Second,\n    }\n}\n\nfunc main() {\n    c := crearClienteSeguro()\n    fmt.Printf("Cliente HTTP creado con Timeout seguro: %v\\n", c.Timeout)\n}',
        "test": r'c => /http\.Client\s*\{[^}]*Timeout:\s*5\s*\*\s*time\.Second/s.test(c)',
        "hint": 'return &http.Client{ Timeout: 5 * time.Second }',
        "m_es": 'Configura un http.Client explícito con un Timeout de 5 * time.Second para evitar goroutine leaks.',
        "m_en": 'Configure an explicit http.Client with a 5 * time.Second Timeout to avoid hung connections.',
        "m_ja": '接続ハングを防ぐため、5 * time.Second の Timeout を持つ http.Client を構成してください。',
        "m_zh": '配置显式设置了 5 * time.Second Timeout 的 http.Client，避免连接泄露。',
        "m_pt": 'Configure um http.Client com Timeout de 5 * time.Second para evitar travamentos.',
        "m_fr": 'Configurez un http.Client avec un Timeout de 5 * time.Second pour éviter les fuites.',
        "terms": [
            ("HTTP Timeout", "Protege contra servidores lentos y agotamiento de sockets.", "Guards against socket exhaustion and slow HTTP peers.")
        ]
    },
    {
        "id": "I08",
        "title": "APIs REST",
        "code": 'package main\n\nimport (\n    "fmt"\n    "net/http"\n)\n\nfunc Saludador(w http.ResponseWriter, r *http.Request) {\n    w.Header().Set("Content-Type", "application/json")\n    w.WriteHeader(http.StatusOK)\n    w.Write([]byte(`{"status":"online"}`))\n}\n\nfunc main() {\n    http.HandleFunc("/health", Saludador)\n    fmt.Println("Handler HTTP registrado en /health")\n}',
        "test": r'c => /http\.ResponseWriter.*\*http\.Request.*w\.WriteHeader/s.test(c)',
        "hint": 'w.WriteHeader(http.StatusOK)\nw.Write([]byte(`{"status":"online"}`))',
        "m_es": 'Escribe un handler HTTP idiomático con firma (w http.ResponseWriter, r *http.Request) que responda 200 OK.',
        "m_en": 'Write an idiomatic HTTP handler (w http.ResponseWriter, r *http.Request) returning 200 OK.',
        "m_ja": '(w http.ResponseWriter, r *http.Request) シグネチャを持つ 200 OK を返すハンドラを作成してください。',
        "m_zh": '编写符合规范的 HTTP 处理器 (w http.ResponseWriter, r *http.Request)，返回 200 OK。',
        "m_pt": 'Escreva um handler HTTP que responda 200 OK.',
        "m_fr": 'Écrivez un handler HTTP renvoyant 200 OK.',
        "terms": [
            ("http.ResponseWriter", "Interfaz para enviar encabezados, estado HTTP y cuerpo al cliente.", "Interface streaming status codes, headers, and body.")
        ]
    },
    {
        "id": "I09",
        "title": "SQL y persistencia",
        "code": 'package main\n\nimport (\n    "fmt"\n)\n\ntype Registro struct {\n    Nombre string\n}\n\nfunc (r Registro) Scan(destino *string) error {\n    *destino = r.Nombre\n    return nil\n}\n\nfunc ConsultarUsuario() (string, error) {\n    reg := Registro{Nombre: "gopher_master"}\n    var nombre string\n    err := reg.Scan(&nombre)\n    return nombre, err\n}\n\nfunc main() {\n    nom, _ := ConsultarUsuario()\n    fmt.Println("Usuario escaneado:", nom)\n}',
        "test": r'c => /Scan\s*\(\s*&nombre\s*\)/.test(c)',
        "hint": 'err := reg.Scan(&nombre)',
        "m_es": 'Simula el patrón de base de datos escaneando el resultado de una fila en la variable mediante &nombre.',
        "m_en": 'Simulate database scanning pattern by loading row result into variable via &nombre.',
        "m_ja": '&nombre を使用して行の結果を変数にスキャンするDBパターンを適用してください。',
        "m_zh": '应用数据库扫描模式，通过 &nombre 将行结果读取至变量。',
        "m_pt": 'Aplique o padrão de banco de dados lendo o resultado em &nombre.',
        "m_fr": 'Appliquez le pattern de scan SQL en chargeant le résultat dans &nombre.',
        "terms": [
            ("Row.Scan(&var)", "Mapea columnas SQL tipadas directamente a variables en memoria.", "Maps SQL columns into typed variables by reference.")
        ]
    },
    {
        "id": "I10",
        "title": "Testing en Go",
        "code": 'package main\n\nimport (\n    "testing"\n)\n\nfunc Multiplicar(a, b int) int {\n    return a * b\n}\n\nfunc TestMultiplicar(t *testing.T) {\n    obtenido := Multiplicar(3, 4)\n    esperado := 12\n    if obtenido != esperado {\n        t.Errorf("Se esperaba %d pero se obtuvo %d", esperado, obtenido)\n    }\n}',
        "test": r'c => /func\s+TestMultiplicar\s*\(\s*t\s*\*testing\.T\s*\)\s*\{.*t\.Errorf/s.test(c)',
        "hint": 'func TestMultiplicar(t *testing.T) {\n    if obtenido != esperado { t.Errorf(...) }\n}',
        "m_es": 'Escribe una prueba unitaria estándar func TestMultiplicar(t *testing.T) usando t.Errorf.',
        "m_en": 'Write a standard unit test func TestMultiplicar(t *testing.T) using t.Errorf assertion.',
        "m_ja": 't.Errorf を使った標準的な単体テスト func TestMultiplicar(t *testing.T) を作成してください。',
        "m_zh": '编写标准单测 func TestMultiplicar(t *testing.T)，并在失败时调用 t.Errorf。',
        "m_pt": 'Escreva o teste unitário func TestMultiplicar(t *testing.T) usando t.Errorf.',
        "m_fr": 'Écrivez le test unitaire func TestMultiplicar(t *testing.T) avec t.Errorf.',
        "terms": [
            ("testing.T", "Proporciona métodos para registrar fallos (Errorf) o detener pruebas (Fatalf).", "Provides test harness helpers for assertions.")
        ]
    },
    {
        "id": "I11",
        "title": "Context y concurrencia inicial",
        "code": 'package main\n\nimport (\n    "context"\n    "fmt"\n    "time"\n)\n\nfunc main() {\n    ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)\n    defer cancel()\n\n    select {\n    case <-time.After(50 * time.Millisecond):\n        fmt.Println("Proceso exitoso antes del timeout.")\n    case <-ctx.Done():\n        fmt.Println("Timeout cancelado:", ctx.Err())\n    }\n}',
        "test": r'c => /context\.WithTimeout\s*\(.*defer\s+cancel\(\)/s.test(c)',
        "hint": 'ctx, cancel := context.WithTimeout(context.Background(), ...)\ndefer cancel()',
        "m_es": 'Crea un context.WithTimeout con defer cancel() y sincroniza el resultado con el canal ctx.Done().',
        "m_en": 'Create a context.WithTimeout with defer cancel() and select on ctx.Done() channel.',
        "m_ja": 'defer cancel() を持つ context.WithTimeout を作成し、ctx.Done() でタイムアウトを監視してください。',
        "m_zh": '创建带有 defer cancel() 的 context.WithTimeout，并在 select 中监听 ctx.Done()。',
        "m_pt": 'Crie um context.WithTimeout com defer cancel() e monitore ctx.Done().',
        "m_fr": 'Créez un context.WithTimeout avec defer cancel() et écoutez ctx.Done().',
        "terms": [
            ("context.Context", "Propaga cancelaciones, límites de tiempo y metadatos entre goroutines.", "Propagates cancellation signals and timeouts across goroutines.")
        ]
    },
    {
        "id": "I12",
        "title": "Proyecto: TaskFlow API",
        "code": 'package main\n\nimport (\n    "fmt"\n    "sync"\n)\n\ntype TaskStore struct {\n    mu    sync.RWMutex\n    items map[int]string\n}\n\nfunc (s *TaskStore) Guardar(id int, tarea string) {\n    s.mu.Lock()\n    defer s.mu.Unlock()\n    s.items[id] = tarea\n}\n\nfunc (s *TaskStore) Leer(id int) (string, bool) {\n    s.mu.RLock()\n    defer s.mu.RUnlock()\n    val, ok := s.items[id]\n    return val, ok\n}\n\nfunc main() {\n    store := TaskStore{items: make(map[int]string)}\n    store.Guardar(1, "Publicar GoPixel")\n    t, _ := store.Leer(1)\n    fmt.Println("Tarea recuperada:", t)\n}',
        "test": r'c => /sync\.RWMutex.*s\.mu\.Lock\(\).*s\.mu\.RLock\(\)/s.test(c)',
        "hint": 's.mu.Lock(); defer s.mu.Unlock()\ns.mu.RLock(); defer s.mu.RUnlock()',
        "m_es": 'Construye TaskStore con sync.RWMutex: protege escrituras con Lock() y lecturas con RLock().',
        "m_en": 'Build TaskStore using sync.RWMutex: guard mutations with Lock() and reads with RLock().',
        "m_ja": 'sync.RWMutex を使って TaskStore を構築し、書き込みを Lock()、読み取りを RLock() で保護してください。',
        "m_zh": '使用 sync.RWMutex 构建 TaskStore：写操作加 Lock()，读操作加 RLock()。',
        "m_pt": 'Construa o TaskStore com sync.RWMutex protegendo escritas com Lock() e leituras com RLock().',
        "m_fr": 'Construisez TaskStore avec sync.RWMutex protégeant les écritures avec Lock() et lectures avec RLock().',
        "terms": [
            ("sync.RWMutex", "Permite múltiples lectores concurrentes o un único escritor exclusivo.", "Allows multiple concurrent readers or a single exclusive writer.")
        ]
    },

    # ---------------- ADVANCED (A01 - A12) ----------------
    {
        "id": "A01",
        "title": "Goroutines avanzadas",
        "code": 'package main\n\nimport (\n    "fmt"\n    "sync"\n)\n\nfunc main() {\n    var wg sync.WaitGroup\n    wg.Add(1)\n\n    go func() {\n        defer wg.Done()\n        fmt.Println("Goroutine ejecutada con éxito.")\n    }()\n\n    wg.Wait()\n    fmt.Println("Sincronización WaitGroup finalizada.")\n}',
        "test": r'c => /var\s+wg\s+sync\.WaitGroup.*wg\.Add\s*\(\s*1\s*\).*defer\s+wg\.Done\s*\(\s*\).*wg\.Wait\s*\(\s*\)/s.test(c)',
        "hint": 'var wg sync.WaitGroup\nwg.Add(1)\ngo func() { defer wg.Done(); ... }()\nwg.Wait()',
        "m_es": 'Coordina una goroutine con sync.WaitGroup usando Add(1), defer Done() y Wait().',
        "m_en": 'Coordinate a goroutine with sync.WaitGroup using Add(1), defer Done() and Wait().',
        "m_ja": 'sync.WaitGroup の Add(1), defer Done(), Wait() を使って goroutine を同期してください。',
        "m_zh": '使用 sync.WaitGroup 的 Add(1)、defer Done() 和 Wait() 协调 goroutine。',
        "m_pt": 'Coordene uma goroutine com sync.WaitGroup usando Add(1), defer Done() e Wait().',
        "m_fr": 'Coordonnez une goroutine avec sync.WaitGroup en utilisant Add(1), defer Done() et Wait().',
        "terms": [
            ("sync.WaitGroup", "Bloquea hasta que un contador de goroutines en vuelo llega a cero.", "Blocks execution until concurrency counter reaches zero.")
        ]
    },
    {
        "id": "A02",
        "title": "Channels y patrones",
        "code": 'package main\n\nimport "fmt"\n\nfunc main() {\n    canal := make(chan int, 2)\n    canal <- 10\n    canal <- 20\n    close(canal)\n\n    for valor := range canal {\n        fmt.Println("Elemento recibido del canal:", valor)\n    }\n}',
        "test": r'c => /make\s*\(\s*chan\s+int\s*,\s*2\s*\).*canal\s*<-\s*10.*close\s*\(\s*canal\s*\)/s.test(c)',
        "hint": 'canal := make(chan int, 2)\ncanal <- 10; canal <- 20\nclose(canal)',
        "m_es": 'Crea un canal con buffer de 2 elementos, envía datos, ciérralo con close() y léelo con for range.',
        "m_en": 'Create a buffered channel of capacity 2, send items, close() it and read with for range.',
        "m_ja": '容量2のバッファ付きチャネルを作成し、送信後に close() して for range で読み出してください。',
        "m_zh": '创建容量为 2 的缓冲通道，发送数据后 close()，并使用 for range 读取。',
        "m_pt": 'Crie um canal com buffer de 2 posições, envie valores, use close() e leia com for range.',
        "m_fr": 'Créez un canal avec buffer de 2, envoyez des données, fermez avec close() et lisez avec for range.',
        "terms": [
            ("Buffered channel", "Permite enviar N elementos sin bloquear la goroutine emisora.", "Allows sending N items asynchronously without sender block.")
        ]
    },
    {
        "id": "A03",
        "title": "Sincronización con sync",
        "code": 'package main\n\nimport (\n    "fmt"\n    "sync"\n)\n\ntype ContadorSeguro struct {\n    mu    sync.Mutex\n    valor int\n}\n\nfunc (c *ContadorSeguro) Incrementar() {\n    c.mu.Lock()\n    defer c.mu.Unlock()\n    c.valor++\n}\n\nfunc main() {\n    c := ContadorSeguro{}\n    c.Incrementar()\n    fmt.Println("Valor protegido por Mutex:", c.valor)\n}',
        "test": r'c => /c\.mu\.Lock\(\)\s*.*defer\s+c\.mu\.Unlock\(\)/s.test(c)',
        "hint": 'c.mu.Lock()\ndefer c.mu.Unlock()',
        "m_es": 'Protege la sección crítica con sync.Mutex usando c.mu.Lock() y defer c.mu.Unlock().',
        "m_en": 'Protect critical section using sync.Mutex with c.mu.Lock() and defer c.mu.Unlock().',
        "m_ja": 'c.mu.Lock() と defer c.mu.Unlock() を使ってクリティカルセクションを保護してください。',
        "m_zh": '使用 c.mu.Lock() 和 defer c.mu.Unlock() 保护临界区数据安全。',
        "m_pt": 'Proteja a seção crítica com sync.Mutex usando Lock() e defer Unlock().',
        "m_fr": 'Protégez la section critique avec sync.Mutex en utilisant Lock() et defer Unlock().',
        "terms": [
            ("sync.Mutex", "Garantiza exclusión mutua estricta para evitar data races.", "Enforces strict mutual exclusion to prevent data races.")
        ]
    },
    {
        "id": "A04",
        "title": "Concurrencia segura",
        "code": 'package main\n\nimport (\n    "fmt"\n    "sync/atomic"\n)\n\nfunc main() {\n    var peticiones int64\n    // Incrementa y lee atómicamente\n    atomic.AddInt64(&peticiones, 1)\n    actual := atomic.LoadInt64(&peticiones)\n    fmt.Println("Peticiones procesadas atómicamente:", actual)\n}',
        "test": r'c => /atomic\.AddInt64\s*\(\s*&peticiones\s*,\s*1\s*\).*atomic\.LoadInt64/s.test(c)',
        "hint": 'atomic.AddInt64(&peticiones, 1)\nactual := atomic.LoadInt64(&peticiones)',
        "m_es": 'Usa sync/atomic para incrementar (AddInt64) y leer (LoadInt64) un contador sin bloqueos.',
        "m_en": 'Use sync/atomic to increment (AddInt64) and load (LoadInt64) a lock-free counter.',
        "m_ja": 'sync/atomic の AddInt64 と LoadInt64 を使ってロックフリーにカウンタを更新・読み取りしてください。',
        "m_zh": '使用 sync/atomic 的 AddInt64 和 LoadInt64 实现无锁并发计数器。',
        "m_pt": 'Use sync/atomic com AddInt64 e LoadInt64 para operar contadores sem lock.',
        "m_fr": 'Utilisez sync/atomic avec AddInt64 et LoadInt64 pour un compteur sans verrou.',
        "terms": [
            ("Instrucciones CPU atómicas", "Modificación en hardware libre de bloqueos de kernel.", "Lock-free hardware CPU instructions avoiding OS context switches.")
        ]
    },
    {
        "id": "A05",
        "title": "Runtime y garbage collector",
        "code": 'package main\n\nimport (\n    "fmt"\n    "runtime"\n)\n\nfunc main() {\n    // Consulta el número de goroutines activas en el runtime\n    activas := runtime.NumGoroutine()\n    fmt.Printf("Goroutines actualmente activas en runtime: %d\\n", activas)\n}',
        "test": r'c => /runtime\.NumGoroutine\s*\(\s*\)/.test(c)',
        "hint": 'activas := runtime.NumGoroutine()',
        "m_es": 'Consulta la telemetría del runtime de Go usando runtime.NumGoroutine().',
        "m_en": 'Inspect Go runtime telemetry by calling runtime.NumGoroutine().',
        "m_ja": 'runtime.NumGoroutine() を呼び出して、実行中の goroutine 数を監視してください。',
        "m_zh": '调用 runtime.NumGoroutine() 检查 Go 运行时活跃的协程数量。',
        "m_pt": 'Consulte o runtime do Go usando runtime.NumGoroutine().',
        "m_fr": 'Inspectez le runtime Go en appelant runtime.NumGoroutine().',
        "terms": [
            ("M:N Scheduler", "El runtime de Go mapea N goroutines ligeras sobre M hilos del kernel.", "Go runtime maps N lightweight goroutines across M OS threads.")
        ]
    },
    {
        "id": "A06",
        "title": "Benchmark y profiling",
        "code": 'package main\n\nimport (\n    "testing"\n)\n\nfunc CalculoIntensivo(n int) int {\n    return n * n\n}\n\nfunc BenchmarkCalculo(b *testing.B) {\n    for i := 0; i < b.N; i++ {\n        CalculoIntensivo(42)\n    }\n}',
        "test": r'c => /func\s+BenchmarkCalculo\s*\(\s*b\s*\*testing\.B\s*\)\s*\{.*for\s+\w+\s*:=\s*0\s*;\s*\w+\s*<\s*b\.N/s.test(c)',
        "hint": 'func BenchmarkCalculo(b *testing.B) {\n    for i := 0; i < b.N; i++ { CalculoIntensivo(42) }\n}',
        "m_es": 'Escribe una función de benchmark func BenchmarkCalculo(b *testing.B) con bucle b.N.',
        "m_en": 'Write a standard benchmark function func BenchmarkCalculo(b *testing.B) iterating b.N times.',
        "m_ja": 'b.N 回反復するベンチマーク関数 func BenchmarkCalculo(b *testing.B) を作成してください。',
        "m_zh": '编写标准的基准测试函数 func BenchmarkCalculo(b *testing.B)，迭代 b.N 次。',
        "m_pt": 'Escreva a função de benchmark func BenchmarkCalculo(b *testing.B) com loop b.N.',
        "m_fr": 'Écrivez une fonction de benchmark func BenchmarkCalculo(b *testing.B) avec boucle b.N.',
        "terms": [
            ("b.N", "Número adaptativo de iteraciones calibrado automáticamente por el runtime.", "Adaptive iteration count calibrated automatically by Go test harness.")
        ]
    },
    {
        "id": "A07",
        "title": "Redes y protocolos",
        "code": 'package main\n\nimport (\n    "fmt"\n)\n\n// Diseña la firma del worker que consume de jobs y envía a results\nfunc worker(id int, jobs <-chan int, results chan<- int) {\n    for j := range jobs {\n        results <- j * 2\n    }\n}\n\nfunc main() {\n    jobs := make(chan int, 3)\n    results := make(chan int, 3)\n    jobs <- 5; close(jobs)\n    go worker(1, jobs, results)\n    fmt.Println("Resultado procesado por worker:", <-results)\n}',
        "test": r'c => /func\s+worker\s*\(\s*\w+\s+int,\s*\w+\s+<-chan\s+int,\s*\w+\s+chan<-\s+int\s*\)/.test(c)',
        "hint": 'func worker(id int, jobs <-chan int, results chan<- int)',
        "m_es": 'Define la función worker con canales unidireccionales (jobs <-chan int, results chan<- int).',
        "m_en": 'Define worker function with directional channels (jobs <-chan int, results chan<- int).',
        "m_ja": '単方向チャネル (jobs <-chan int, results chan<- int) を持つ worker 関数を定義してください。',
        "m_zh": '使用单向通道定义 worker 函数：(jobs <-chan int, results chan<- int)。',
        "m_pt": 'Defina a função worker com canais direcionais (jobs <-chan int, results chan<- int).',
        "m_fr": 'Définissez la fonction worker avec canaux unidirectionnels (jobs <-chan int, results chan<- int).',
        "terms": [
            ("Canales unidireccionales", "Restringen en tiempo de compilación si una función solo puede leer o escribir.", "Enforces read-only or write-only channel permissions at compile time.")
        ]
    },
    {
        "id": "A08",
        "title": "SQL avanzado",
        "code": 'package main\n\nimport (\n    "fmt"\n)\n\n// Fan-in: combina dos canales de lectura en un select no bloqueante\nfunc multiplexar(c1, c2 <-chan string) string {\n    select {\n    case msg1 := <-c1:\n        return msg1\n    case msg2 := <-c2:\n        return msg2\n    default:\n        return "sin datos disponibles"\n    }\n}\n\nfunc main() {\n    c1 := make(chan string, 1)\n    c2 := make(chan string, 1)\n    c1 <- "evento canal 1"\n    fmt.Println(multiplexar(c1, c2))\n}',
        "test": r'c => /select\s*\{[^}]*case\s+.*<-c1:[^}]*case\s+.*<-c2:[^}]*default:/s.test(c)',
        "hint": 'select {\ncase msg1 := <-c1: return msg1\ncase msg2 := <-c2: return msg2\ndefault: return ...\n}',
        "m_es": 'Implementa la sentencia select con branches para c1, c2 y un caso default no bloqueante.',
        "m_en": 'Implement select statement with branches for c1, c2 and a non-blocking default clause.',
        "m_ja": 'c1, c2 の受信とノンブロッキングな default 節を持つ select 文を実装してください。',
        "m_zh": '实现包含 c1、c2 分支以及非阻塞 default 分支的 select 语句。',
        "m_pt": 'Implemente a cláusula select com branches c1, c2 e default não bloqueante.',
        "m_fr": 'Implémentez l\'instruction select avec branches c1, c2 et clause default non-bloquante.',
        "terms": [
            ("select con default", "Permite lecturas y escrituras no bloqueantes sobre canales.", "Enables non-blocking channel polling operations.")
        ]
    },
    {
        "id": "A09",
        "title": "Caché y mensajería",
        "code": 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc main() {\n    // Limitador de tasa: emite un pulso cada 100ms\n    ticker := time.NewTicker(100 * time.Millisecond)\n    defer ticker.Stop()\n\n    <-ticker.C\n    fmt.Println("Petición autorizada tras intervalo de rate limiting.")\n}',
        "test": r'c => /time\.NewTicker\s*\([^)]+\).*defer\s+\w+\.Stop\(\).*<-\w+\.C/s.test(c)',
        "hint": 'ticker := time.NewTicker(100 * time.Millisecond)\ndefer ticker.Stop()\n<-ticker.C',
        "m_es": 'Configura un limitador de tasa con time.NewTicker, asegurando defer Stop() y esperando en ticker.C.',
        "m_en": 'Configure a rate limiter using time.NewTicker, ensuring defer Stop() and waiting on ticker.C.',
        "m_ja": 'time.NewTicker を設定し、defer Stop() と ticker.C でのレートリミット待機を実装してください。',
        "m_zh": '使用 time.NewTicker 配置限流器，确保 defer Stop() 并在 ticker.C 上等待。',
        "m_pt": 'Configure um rate limiter com time.NewTicker, defer Stop() e leitura em ticker.C.',
        "m_fr": 'Configurez un limiteur de débit avec time.NewTicker, defer Stop() et lecture sur ticker.C.',
        "terms": [
            ("time.Ticker", "Genera eventos periódicos seguros en un canal para control de flujo.", "Generates recurring channel ticks for precise rate limiting.")
        ]
    },
    {
        "id": "A10",
        "title": "Resiliencia",
        "code": 'package main\n\nimport (\n    "errors"\n    "fmt"\n    "time"\n)\n\nfunc EjecutarConBackoff(maxIntentos int) error {\n    delay := 10 * time.Millisecond\n    for intento := 1; intento <= maxIntentos; intento++ {\n        // Simula fallo transitorio\n        if intento < 3 {\n            time.Sleep(delay)\n            delay *= 2 // Retroceso exponencial\n            continue\n        }\n        return nil\n    }\n    return errors.New("máximos reintentos excedidos")\n}\n\nfunc main() {\n    err := EjecutarConBackoff(3)\n    fmt.Println("Resultado de resiliencia:", err)\n}',
        "test": r'c => /delay\s*\*=\s*2.*time\.Sleep\s*\(\s*delay\s*\)/s.test(c)',
        "hint": 'time.Sleep(delay)\ndelay *= 2',
        "m_es": 'Implementa la duplicación de intervalo (delay *= 2) en el bucle de reintentos exponencial defensivo.',
        "m_en": 'Implement exponential backoff doubling interval (delay *= 2) inside the retry loop.',
        "m_ja": 'リトライループ内で待機時間を倍増 (delay *= 2) させる指数バックオフを実装してください。',
        "m_zh": '在重试循环中实现等待时间倍增 (delay *= 2) 的指数退避策略。',
        "m_pt": 'Implemente backoff exponencial duplicando o intervalo (delay *= 2).',
        "m_fr": 'Implémentez un backoff exponentiel en doublant l\'intervalle (delay *= 2).',
        "terms": [
            ("Exponential Backoff", "Previene saturar servicios colapsados espaciando los reintentos.", "Prevents thundering herds by spacing retries exponentially.")
        ]
    },
    {
        "id": "A11",
        "title": "Docker y CI/CD",
        "code": 'package main\n\nimport (\n    "fmt"\n    "os"\n    "os/signal"\n    "syscall"\n)\n\nfunc main() {\n    sigChan := make(chan os.Signal, 1)\n    signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)\n\n    fmt.Println("Servidor iniciado. Esperando señal de apagado ordenado...")\n    // Simula llegada de señal controlada\n    go func() { sigChan <- syscall.SIGTERM }()\n\n    sig := <-sigChan\n    fmt.Println("Señal de apagado capturada:", sig)\n}',
        "test": r'c => /signal\.Notify\s*\(\s*sigChan\s*,\s*syscall\.SIGINT\s*,\s*syscall\.SIGTERM\s*\)/.test(c)',
        "hint": 'signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)',
        "m_es": 'Configura signal.Notify para capturar señales syscall.SIGINT y syscall.SIGTERM de forma ordenada.',
        "m_en": 'Configure signal.Notify to intercept syscall.SIGINT and syscall.SIGTERM for graceful shutdown.',
        "m_ja": 'syscall.SIGINT と syscall.SIGTERM を安全に捕捉する signal.Notify を設定してください。',
        "m_zh": '配置 signal.Notify 捕获 syscall.SIGINT 和 syscall.SIGTERM 信号以实现优雅退出。',
        "m_pt": 'Configure signal.Notify para capturar syscall.SIGINT e syscall.SIGTERM.',
        "m_fr": 'Configurez signal.Notify pour intercepter syscall.SIGINT et syscall.SIGTERM.',
        "terms": [
            ("Graceful Shutdown", "Permite completar tareas en vuelo antes de destruir el contenedor.", "Allows in-flight requests to complete before container termination.")
        ]
    },
    {
        "id": "A12",
        "title": "Proyecto: motor concurrente",
        "code": 'package main\n\nimport (\n    "context"\n    "fmt"\n    "sync"\n    "time"\n)\n\ntype MotorPipeline struct {\n    wg sync.WaitGroup\n}\n\nfunc (m *MotorPipeline) Procesar(ctx context.Context, tareas []int) int {\n    total := 0\n    var mu sync.Mutex\n\n    for _, t := range tareas {\n        m.wg.Add(1)\n        go func(item int) {\n            defer m.wg.Done()\n            select {\n            case <-ctx.Done():\n                return\n            case <-time.After(10 * time.Millisecond):\n                mu.Lock()\n                total += item\n                mu.Unlock()\n            }\n        }(t)\n    }\n    m.wg.Wait()\n    return total\n}\n\nfunc main() {\n    ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)\n    defer cancel()\n\n    motor := MotorPipeline{}\n    res := motor.Procesar(ctx, []int{10, 20, 30})\n    fmt.Println("Resultado total del motor concurrente:", res)\n}',
        "test": r'c => /m\.wg\.Add\s*\(\s*1\s*\).*defer\s+m\.wg\.Done\s*\(\s*\).*m\.wg\.Wait\s*\(\s*\)/s.test(c)',
        "hint": 'm.wg.Add(1)\ngo func(...) {\n    defer m.wg.Done()\n    ...\n}()\nm.wg.Wait()',
        "m_es": 'Proyecto avanzado: construye el motor concurrente orquestando goroutines, WaitGroup, Mutex y Context.',
        "m_en": 'Advanced capstone: build the concurrent pipeline orchestrating goroutines, WaitGroup, Mutex, and Context.',
        "m_ja": '総合演習: WaitGroup, Mutex, Context を組み合わせて並行パイプラインエンジンを完成させてください。',
        "m_zh": '高级综合实战：结合 goroutine、WaitGroup、Mutex 与 Context 构建高并发流水线引擎。',
        "m_pt": 'Projeto avançado: construa o motor concorrente unindo goroutines, WaitGroup, Mutex e Context.',
        "m_fr": 'Projet avancé: construisez le moteur concurrent en assemblant goroutines, WaitGroup, Mutex et Context.',
        "terms": [
            ("Pipeline concurrente", "Procesamiento de flujo paralelo con sincronización y control de ciclo de vida.", "Parallel streaming workflow with explicit lifecycle and cancellation.")
        ]
    }
]

print(f"Loaded {len(modules)} exercises specifications.")

# Construct the TypeScript output
ts_lines = [
    "// Autogenerated comprehensive learning exercises for GoPixel Academy (B01-B12, I01-I12, A01-A12)",
    "// Strictly typed with 6 languages support and deterministic test validators.",
    "",
    "export type Locale = 'es' | 'en' | 'ja' | 'zh' | 'pt' | 'fr';",
    "",
    "export type LessonGuide = {",
    "  mission: Record<Locale, string>;",
    "  concepts: Record<Locale, Array<{ term: string; desc: string }>>;",
    "  steps: Record<Locale, string[]> ;",
    "};",
    "",
    "export const goExamples: Record<string, { code: string; test: (code: string) => boolean; hint: string }> = {"
]

for m in modules:
    code_esc = json.dumps(m["code"])
    hint_esc = json.dumps(m["hint"])
    test_fn = m["test"]
    ts_lines.append(f"  {m['id']}: {{")
    ts_lines.append(f"    code: {code_esc},")
    ts_lines.append(f"    test: {test_fn},")
    ts_lines.append(f"    hint: {hint_esc}")
    ts_lines.append("  },")

ts_lines.append("};")
ts_lines.append("")

ts_lines.append("export const lessonGuides: Record<string, LessonGuide> = {")

for m in modules:
    mid = m["id"]
    ts_lines.append(f"  {mid}: {{")
    ts_lines.append("    mission: {")
    for lang in ["es", "en", "ja", "zh", "pt", "fr"]:
        txt = m.get(f"m_{lang}", m["m_es"])
        ts_lines.append(f"      {lang}: {json.dumps(txt)},")
    ts_lines.append("    },")
    
    # Concepts
    ts_lines.append("    concepts: {")
    for lang in ["es", "en", "ja", "zh", "pt", "fr"]:
        ts_lines.append(f"      {lang}: [")
        for term, desc_es, desc_en in m["terms"]:
            term_esc = json.dumps(term)
            desc_txt = desc_es if lang in ["es", "pt", "fr"] else desc_en
            desc_esc = json.dumps(desc_txt)
            ts_lines.append(f"        {{ term: {term_esc}, desc: {desc_esc} }},")
        ts_lines.append("      ],")
    ts_lines.append("    },")
    
    # Steps
    ts_lines.append("    steps: {")
    steps_map = {
        "es": ["01 · Lee la lección introductoria", "02 · Completa el código en el editor", "03 · Pulsa Comprobar solución"],
        "en": ["01 · Read the lesson objectives", "02 · Complete the code in the editor", "03 · Click Check solution"],
        "ja": ["01 · レッスンの目標を読む", "02 · エディタでコードを完成させる", "03 · 解答を確認をクリック"],
        "zh": ["01 · 阅读本课学习目标", "02 · 在编辑器中补全 Go 代码", "03 · 点击验证代码"],
        "pt": ["01 · Leia os objetivos da lição", "02 · Complete o código no editor", "03 · Clique em Validar solução"],
        "fr": ["01 · Lisez les objectifs du cours", "02 · Complétez le code dans l'éditeur", "03 · Cliquez sur Vérifier la solution"]
    }
    for lang in ["es", "en", "ja", "zh", "pt", "fr"]:
        st = steps_map[lang]
        ts_lines.append(f"      {lang}: {json.dumps(st)},")
    ts_lines.append("    },")
    ts_lines.append("  },")

ts_lines.append("};")

out_file = Path("src/data/learning-exercises.ts")
out_file.write_text("\n".join(ts_lines), encoding="utf-8")
print(f"Generated {out_file} with {len(modules)} exercises successfully!")
