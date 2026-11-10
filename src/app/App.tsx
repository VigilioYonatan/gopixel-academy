import { useEffect, useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import curriculum from '../data/curriculum.json';
import seniorChallenges from '../content/senior/challenges.json';
import evidenceLabs from '../content/senior/evidence-labs.json';
import investigations from '../content/senior/investigations.json';
import operationsLabs from '../content/senior/operations-labs.json';
import { OperationsLab } from '../features/senior/OperationsLab';
import { NativeLabCatalog, SeniorReadiness } from '../features/senior/NativeLabCatalog';
import { SeniorGuide } from '../features/senior/SeniorGuide';
import { CodeReviewLab } from '../features/senior/CodeReviewLab';
import { SeniorCapstone } from '../features/senior/SeniorCapstone';
import { SeniorDashboard } from '../features/senior/SeniorDashboard';
import { SeniorModuleHub } from '../features/senior/SeniorModuleHub';
import { DecisionLab } from '../features/senior/DecisionLab';
import { EvidenceLab } from '../features/senior/EvidenceLab';
import { SeniorResult } from '../features/senior/SeniorResult';
import reviewCases from '../content/senior/code-reviews.json';
import { verifyReviewRecord } from '../features/senior/engine/code-review.mjs';
import type { ReviewRecord, ReviewCase } from '../features/senior/engine/code-review.mjs';
import { verifiedOperationsRecord } from '../features/senior/engine/operations.mjs';
import type { OperationsRecord, OperationsLab as OperationsLabType } from '../features/senior/engine/operations.mjs';
import { InvestigationLab } from '../features/senior/InvestigationLab';
import { verifiedInvestigationRecord } from '../features/senior/engine/investigation.mjs';
import type { Investigation } from '../features/senior/engine/investigation.mjs';
import { verifiedEvidenceRecord } from '../features/senior/engine/evidence.mjs';
import type { EvidenceLab as EvidenceLabType } from '../features/senior/engine/evidence.mjs';
import { validSeniorRecord } from '../features/senior/engine/evaluate.mjs';
import es from '../i18n/es.json';
import en from '../i18n/en.json';
import ja from '../i18n/ja.json';
import zh from '../i18n/zh.json';
import pt from '../i18n/pt.json';
import fr from '../i18n/fr.json';

type Locale = 'es' | 'en' | 'ja' | 'zh' | 'pt' | 'fr';
type Theme = 'dark' | 'light';
type RouteTrack = 'basic' | 'intermediate' | 'advanced' | 'senior' | 'frameworks';
type Localized = Record<Locale, string>;
type Module = { id: string; slug: string; track: RouteTrack; title: Localized; summary: Localized; status: string;
  tools?: string[]; challenge?: { kind: string; scenario: Localized; criteria: string[] } };
const modules = curriculum as Module[];
const dictionaries: Record<Locale, Record<string,string>> = { es, en, ja, zh, pt, fr };
const locales: { id: Locale; flag: string; label: string }[] = [
  {id:'es',flag:'🇪🇸',label:'Español'}, {id:'en',flag:'🇬🇧',label:'English'},
  {id:'ja',flag:'🇯🇵',label:'日本語'}, {id:'zh',flag:'🇨🇳',label:'中文'},
  {id:'pt',flag:'🇧🇷',label:'Português'}, {id:'fr',flag:'🇫🇷',label:'Français'},
];
const trackStyles: Record<RouteTrack,{icon:string;className:string}> = {
  basic:{icon:'book',className:'green'},intermediate:{icon:'layers',className:'blue'},
  advanced:{icon:'rocket',className:'orange'},senior:{icon:'crown',className:'gold'},
  frameworks:{icon:'framework',className:'purple'}
};
const tracks: RouteTrack[] = ['basic','intermediate','advanced','senior'];
type SeniorResultRecord = {moduleId:string;challengeId:'decision-lab';version:number;correct:number;score:number;answers:number[];completedAt:string;passed:boolean};
type EvidenceResultRecord = {moduleId:string;challengeId:'evidence-lab';version:number;correct:number;score:number;selections:number[];completedAt:string;passed:boolean};
type InvestigationResultRecord = {moduleId:string;challengeId:'investigation-lab';version:number;correct:number;score:number;answers:number[];completedAt:string;passed:boolean};
type DecisionChallenge = {moduleId:string;challengeId:string;version:number;questions:{id:string;prompt:string;options:string[];correct:number;explanation:string}[];learningPoints:string[];type:string;verification:string};
const challengeBank = seniorChallenges as DecisionChallenge[];
const evidenceBank = evidenceLabs as unknown as EvidenceLabType[];
const operationsBank = operationsLabs as unknown as OperationsLabType[];
const reviewBank = reviewCases as unknown as ReviewCase[];
const investigationBank = investigations as unknown as Investigation[];
const getEvidence = (id: string) => evidenceBank.find(c => c.moduleId===id);
const getChallenge = (id: string) => challengeBank.find(c=>c.moduleId===id);

const asset=(path:string)=>`${import.meta.env.BASE_URL}assets/${path}`;
const goExamples: Record<string,{code:string;test:(code:string)=>boolean;hint:string}> = {
 B01:{code:'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("_____")\n}',test:c=>/fmt\.Println\(\s*"Hola, Go!"\s*\)/.test(c),hint:'fmt.Println("Hola, Go!")'},
 B02:{code:'package main\n\nfunc main() {\n    // Crea la variable edad con valor 25\n}',test:c=>/(edad\s*:=\s*25|var\s+edad\s+(?:int\s*)?=\s*25)/.test(c),hint:'edad := 25'},
 B03:{code:'package main\n\nfunc main() {\n    // Declara nombre como string\n}',test:c=>/(var\s+nombre\s+string|nombre\s*:=\s*"[^"]+")/.test(c),hint:'var nombre string = "Gopher"'},
 B04:{code:'package main\n\nfunc main() {\n    // Repite una acción 3 veces\n}',test:c=>/for\s+\w+\s*:=\s*0\s*;\s*\w+\s*<\s*3\s*;/.test(c),hint:'for i := 0; i < 3; i++ { }'},
 B05:{code:'package main\n\n// Crea la función sumar que devuelve un int\n',test:c=>/func\s+sumar\s*\([^)]*\)\s*int\s*\{[\s\S]*return\s+\w+\s*\+\s*\w+/.test(c),hint:'func sumar(a int, b int) int { return a + b }'},
};

type LessonGuide = {
  mission: Record<Locale, string>;
  concepts: Record<Locale, Array<{ term: string; desc: string }>>;
  steps: Record<Locale, string[]>;
};

const lessonGuides: Record<string, LessonGuide> = {
  B01: {
    mission: {
      es: 'Reemplaza los guiones "_____" en fmt.Println por "Hola, Go!" y pulsa "Comprobar solución".',
      en: 'Replace the underscores "_____" in fmt.Println with "Hola, Go!" and click "Check solution".',
      ja: 'fmt.Println の "_____" を "Hola, Go!" に置き換えて「解答を確認」をクリックしてください。',
      zh: '将 fmt.Println 中的 "_____" 替换为 "Hola, Go!"，然后点击“验证代码”。',
      pt: 'Substitua os sublinhados "_____" em fmt.Println por "Hola, Go!" e clique em "Validar solução".',
      fr: 'Remplacez les tirets "_____" dans fmt.Println par "Hola, Go!" et cliquez sur "Vérifier la solution".'
    },
    concepts: {
      es: [
        { term: 'package main', desc: 'Indica a Go que este archivo es un programa ejecutable independiente, no una biblioteca.' },
        { term: 'import "fmt"', desc: 'Importa el paquete estándar de formateo para imprimir texto en la consola.' },
        { term: 'func main()', desc: 'Función principal y punto de entrada donde inicia la ejecución del programa.' },
        { term: 'fmt.Println(...)', desc: 'Imprime el mensaje en la salida estándar seguido de un salto de línea.' }
      ],
      en: [
        { term: 'package main', desc: 'Tells Go that this file is an executable program entry point, not a library.' },
        { term: 'import "fmt"', desc: 'Imports the standard formatting package to print output to the terminal.' },
        { term: 'func main()', desc: 'The main function and entry point where execution begins.' },
        { term: 'fmt.Println(...)', desc: 'Prints the message to standard output followed by a newline.' }
      ],
      ja: [
        { term: 'package main', desc: 'このファイルが独立した実行可能プログラムであることを示します。' },
        { term: 'import "fmt"', desc: 'ターミナルに出力するための標準フォーマットパッケージをインポートします。' },
        { term: 'func main()', desc: 'Goプログラムの実行が開始されるメインエントリーポイント関数です。' },
        { term: 'fmt.Println(...)', desc: '標準出力に文字列を出力し、末尾に改行を追加します。' }
      ],
      zh: [
        { term: 'package main', desc: '声明此文件为独立的可执行程序，而非共享库。' },
        { term: 'import "fmt"', desc: '导入用于格式化终端输出的标准库 fmt。' },
        { term: 'func main()', desc: 'Go 程序运行的唯一主入口函数。' },
        { term: 'fmt.Println(...)', desc: '向终端标准输出打印文本并自动换行。' }
      ],
      pt: [
        { term: 'package main', desc: 'Informa que este arquivo é um programa executável independente.' },
        { term: 'import "fmt"', desc: 'Importa o pacote padrão para imprimir dados no console.' },
        { term: 'func main()', desc: 'Ponto de entrada obrigatório onde o programa começa a rodar.' },
        { term: 'fmt.Println(...)', desc: 'Imprime a mensagem no terminal com quebra de linha.' }
      ],
      fr: [
        { term: 'package main', desc: 'Indique un programme exécutable autonome et non une bibliothèque.' },
        { term: 'import "fmt"', desc: 'Importe le paquet standard de formatage pour afficher du texte.' },
        { term: 'func main()', desc: 'Point d\'entrée principal où commence l\'exécution du programme.' },
        { term: 'fmt.Println(...)', desc: 'Affiche le message sur la console avec un saut de ligne.' }
      ]
    },
    steps: {
      es: [
        '1. Lee los conceptos clave de la lección arriba.',
        '2. En el editor main.go, haz clic sobre "_____".',
        '3. Escribe "Hola, Go!" (mantén las comillas dobles).',
        '4. Pulsa el botón "Comprobar solución" para ganar XP.'
      ],
      en: [
        '1. Review the key concepts explained above.',
        '2. In the main.go editor, click inside the quotes.',
        '3. Type "Hola, Go!" (keeping the double quotes).',
        '4. Click "Check solution" to earn XP and advance.'
      ],
      ja: [
        '1. 上記の基本構文と概念を確認します。',
        '2. main.go エディタ内の "_____" をクリックします。',
        '3. "Hola, Go!" と入力します（ダブルクォーテーションを保持）。',
        '4. 「解答を確認」ボタンを押してXPを獲得します。'
      ],
      zh: [
        '1. 阅读上方的核心语法概念。',
        '2. 在下方 main.go 编辑器中点击 "_____"。',
        '3. 输入 "Hola, Go!"（保留双引号）。',
        '4. 点击“验证代码”提交以获得 XP 奖励。'
      ],
      pt: [
        '1. Leia os conceitos fundamentais acima.',
        '2. No editor main.go, clique em "_____".',
        '3. Digite "Hola, Go!" (mantendo as aspas duplas).',
        '4. Clique em "Validar solução" para ganhar XP.'
      ],
      fr: [
        '1. Lisez les concepts clés ci-dessus.',
        '2. Dans l\'éditeur main.go, cliquez sur "_____".',
        '3. Écrivez "Hola, Go!" (en gardant les guillemets).',
        '4. Cliquez sur "Vérifier la solution" pour gagner des XP.'
      ]
    }
  },
  B02: {
    mission: {
      es: 'Dentro de func main(), declara la variable edad con el valor 25 (ejemplo: edad := 25) y pulsa "Comprobar solución".',
      en: 'Inside func main(), declare the variable edad with value 25 (e.g. edad := 25) and click "Check solution".',
      ja: 'func main() 内で、値 25 を持つ変数 edad を宣言し（例: edad := 25）、「解答を確認」をクリックしてください。',
      zh: '在 func main() 中声明值为 25 的变量 edad（例如: edad := 25），然后点击“验证代码”。',
      pt: 'Dentro de func main(), declare a variável edad com o valor 25 (ex: edad := 25) e clique em "Validar solução".',
      fr: 'Dans func main(), déclarez la variable edad avec la valeur 25 (ex : edad := 25) et cliquez sur "Vérifier la solution".'
    },
    concepts: {
      es: [
        { term: 'var edad int = 25', desc: 'Declaración formal con palabra reservada var y tipo explícito.' },
        { term: 'edad := 25', desc: 'Declaración corta (short declaration) con inferencia automática de tipo.' }
      ],
      en: [
        { term: 'var edad int = 25', desc: 'Standard variable declaration with var keyword and explicit type.' },
        { term: 'edad := 25', desc: 'Short declaration syntax with inferred type (inside functions).' }
      ],
      ja: [
        { term: 'var edad int = 25', desc: 'varキーワードと型指定による明示的な変数宣言。' },
        { term: 'edad := 25', desc: '型推論を伴う短い宣言構文（関数内限定）。' }
      ],
      zh: [
        { term: 'var edad int = 25', desc: '使用 var 关键字的标准显式类型变量声明。' },
        { term: 'edad := 25', desc: '具备类型推断的简短声明语法（仅限函数内部使用）。' }
      ],
      pt: [
        { term: 'var edad int = 25', desc: 'Declaração formal com palavra-chave var e tipo explícito.' },
        { term: 'edad := 25', desc: 'Declaração curta com tipo inferido automaticamente.' }
      ],
      fr: [
        { term: 'var edad int = 25', desc: 'Déclaration explicite avec le mot-clé var et le type.' },
        { term: 'edad := 25', desc: 'Déclaration courte avec inférence automatique de type.' }
      ]
    },
    steps: {
      es: [
        '1. Usa := para declarar e inicializar en un solo paso.',
        '2. Escribe edad := 25 dentro de main().',
        '3. Pulsa "Comprobar solución".'
      ],
      en: [
        '1. Use := to declare and assign in one step.',
        '2. Write edad := 25 inside main().',
        '3. Click "Check solution".'
      ],
      ja: [
        '1. := を使って1行で宣言と初期化を行います。',
        '2. main() 内に edad := 25 と記述します。',
        '3. 「解答を確認」をクリックします。'
      ],
      zh: [
        '1. 使用 := 一步完成声明与赋值。',
        '2. 在 main() 内部编写 edad := 25。',
        '3. 点击“验证代码”。'
      ],
      pt: [
        '1. Use := para declarar e atribuir em uma linha.',
        '2. Escreva edad := 25 dentro de main().',
        '3. Clique em "Validar solução".'
      ],
      fr: [
        '1. Utilisez := pour déclarer et assigner en un seul pas.',
        '2. Écrivez edad := 25 dans main().',
        '3. Cliquez sur "Vérifier la solution".'
      ]
    }
  },
  B03: {
    mission: {
      es: 'Declara una variable llamada nombre de tipo string (ejemplo: var nombre string = "Gopher") y pulsa "Comprobar solución".',
      en: 'Declare a variable named nombre of type string (e.g. var nombre string = "Gopher") and click "Check solution".',
      ja: 'string型の変数 nombre を宣言し（例: var nombre string = "Gopher"）、「解答を確認」をクリックしてください。',
      zh: '声明一个 string 类型的变量 nombre（例如: var nombre string = "Gopher"），然后点击“验证代码”。',
      pt: 'Declare uma variável chamada nombre do tipo string (ex: var nombre string = "Gopher") e clique em "Validar solução".',
      fr: 'Déclarez une variable appelée nombre de type string (ex : var nombre string = "Gopher") et cliquez sur "Vérifier la solution".'
    },
    concepts: {
      es: [
        { term: 'string', desc: 'Cadena de texto inmutable codificada en UTF-8 nativo.' },
        { term: 'Tipado estático', desc: 'Las variables no pueden cambiar de tipo tras ser creadas.' }
      ],
      en: [
        { term: 'string', desc: 'Immutable sequence of UTF-8 encoded bytes.' },
        { term: 'Static typing', desc: 'Variables cannot change types once declared.' }
      ],
      ja: [
        { term: 'string', desc: 'UTF-8エンコードされた不変の文字列型です。' },
        { term: '静的型付け', desc: '宣言された変数の型を後から変更することはできません。' }
      ],
      zh: [
        { term: 'string', desc: '以 UTF-8 编码存储的原生不可变字符串类型。' },
        { term: '静态类型', desc: '变量一旦声明类型，生命周期内无法更改。' }
      ],
      pt: [
        { term: 'string', desc: 'Sequência imutável de bytes em UTF-8.' },
        { term: 'Tipagem estática', desc: 'O tipo da variável não pode mudar após declarada.' }
      ],
      fr: [
        { term: 'string', desc: 'Chaîne de texte immuable encodée en UTF-8.' },
        { term: 'Typage statique', desc: 'Le type ne peut pas être modifié après déclaration.' }
      ]
    },
    steps: {
      es: [
        '1. Escribe var nombre string = "Gopher" dentro de main().',
        '2. Pulsa "Comprobar solución".'
      ],
      en: [
        '1. Write var nombre string = "Gopher" inside main().',
        '2. Click "Check solution".'
      ],
      ja: [
        '1. main() 内に var nombre string = "Gopher" と記述します。',
        '2. 「解答を確認」をクリックします。'
      ],
      zh: [
        '1. 在 main() 中编写: var nombre string = "Gopher"。',
        '2. 点击“验证代码”。'
      ],
      pt: [
        '1. Escreva var nombre string = "Gopher" dentro de main().',
        '2. Clique em "Validar solução".'
      ],
      fr: [
        '1. Écrivez var nombre string = "Gopher" dans main().',
        '2. Cliquez sur "Vérifier la solution".'
      ]
    }
  },
  B04: {
    mission: {
      es: 'Escribe un bucle for que itere 3 veces (ejemplo: for i := 0; i < 3; i++ { }) y pulsa "Comprobar solución".',
      en: 'Write a for loop that iterates 3 times (e.g. for i := 0; i < 3; i++ { }) and click "Check solution".',
      ja: '3回反復する for ループを記述し（例: for i := 0; i < 3; i++ { }）、「解答を確認」をクリックしてください。',
      zh: '编写一个迭代 3 次的 for 循环（例如: for i := 0; i < 3; i++ { }），然后点击“验证代码”。',
      pt: 'Escreva um laço for que itere 3 vezes (ex: for i := 0; i < 3; i++ { }) e clique em "Validar solução".',
      fr: 'Écrivez une boucle for qui itère 3 fois (ex : for i := 0; i < 3; i++ { }) et cliquez sur "Vérifier la solution".'
    },
    concepts: {
      es: [
        { term: 'for unificado', desc: 'En Go solo existe for; sustituye a while y do-while.' },
        { term: 'for init; cond; post', desc: 'Tres componentes separados por punto y coma sin paréntesis.' }
      ],
      en: [
        { term: 'Unified for', desc: 'In Go there is only for; it replaces while and do-while.' },
        { term: 'for init; cond; post', desc: 'Three components separated by semicolons without parentheses.' }
      ],
      ja: [
        { term: '統一された for', desc: 'Goにはwhileがなく、forループのみが存在します。' },
        { term: 'for init; cond; post', desc: '丸括弧なしでセミコロンで区切られた3つの要素。' }
      ],
      zh: [
        { term: '唯一循环关键字', desc: 'Go 语言只有 for，涵盖了所有循环场景。' },
        { term: 'for init; cond; post', desc: '用分号隔开的三段式结构，条件无需圆括号。' }
      ],
      pt: [
        { term: 'for unificado', desc: 'O Go possui apenas a palavra for para todos os laços.' },
        { term: 'for init; cond; post', desc: 'Três blocos separados por ponto e vírgula sem parênteses.' }
      ],
      fr: [
        { term: 'for unifié', desc: 'En Go, il n\'y a que for ; il remplace while et do-while.' },
        { term: 'for init; cond; post', desc: 'Trois composants séparés par des points-virgules sans parenthèses.' }
      ]
    },
    steps: {
      es: [
        '1. Escribe for i := 0; i < 3; i++ { } dentro de main().',
        '2. Pulsa "Comprobar solución".'
      ],
      en: [
        '1. Write for i := 0; i < 3; i++ { } inside main().',
        '2. Click "Check solution".'
      ],
      ja: [
        '1. main() 内に for i := 0; i < 3; i++ { } と記述します。',
        '2. 「解答を確認」をクリックします。'
      ],
      zh: [
        '1. 在 main() 中编写: for i := 0; i < 3; i++ { }。',
        '2. 点击“验证代码”。'
      ],
      pt: [
        '1. Escreva for i := 0; i < 3; i++ { } dentro de main().',
        '2. Clique em "Validar solução".'
      ],
      fr: [
        '1. Écrivez for i := 0; i < 3; i++ { } dans main().',
        '2. Cliquez sur "Vérifier la solution".'
      ]
    }
  },
  B05: {
    mission: {
      es: 'Crea una función llamada sumar que sume dos enteros (ejemplo: func sumar(a int, b int) int { return a + b }) y pulsa "Comprobar solución".',
      en: 'Create a function named sumar adding two ints (e.g. func sumar(a int, b int) int { return a + b }) and click "Check solution".',
      ja: '2つの整数を足す関数 sumar を定義し（例: func sumar(a int, b int) int { return a + b }）、「解答を確認」をクリックしてください。',
      zh: '创建函数 sumar 计算两个整数之和（例如: func sumar(a int, b int) int { return a + b }），然后点击“验证代码”。',
      pt: 'Crie uma função chamada sumar somando dois inteiros (ex: func sumar(a int, b int) int { return a + b }) e clique em "Validar solução".',
      fr: 'Créez une fonction sumar additionnant deux entiers (ex : func sumar(a int, b int) int { return a + b }) et cliquez sur "Vérifier la solution".'
    },
    concepts: {
      es: [
        { term: 'func nombre(...) tipo', desc: 'Firma de función en Go; el tipo devuelto se indica al final.' },
        { term: 'return', desc: 'Devuelve el resultado de la función al invocador.' }
      ],
      en: [
        { term: 'func name(...) type', desc: 'Function signature; return type is placed at the end.' },
        { term: 'return', desc: 'Returns the result value from the function.' }
      ],
      ja: [
        { term: 'func 関数名(...) 戻り値型', desc: 'Goの関数定義。戻り値の型は末尾に指定します。' },
        { term: 'return', desc: '関数から呼び出し元へ値を返却します。' }
      ],
      zh: [
        { term: 'func name(...) type', desc: 'Go 函数签名，返回值类型置于形参列表之后。' },
        { term: 'return', desc: '返回函数的执行结果。' }
      ],
      pt: [
        { term: 'func nome(...) tipo', desc: 'Definição de função; tipo de retorno é colocado no final.' },
        { term: 'return', desc: 'Retorna o resultado da função.' }
      ],
      fr: [
        { term: 'func nom(...) type', desc: 'Signature de fonction ; le type de retour est à la fin.' },
        { term: 'return', desc: 'Renvoie le résultat de la fonction.' }
      ]
    },
    steps: {
      es: [
        '1. Escribe: func sumar(a int, b int) int { return a + b }',
        '2. Pulsa "Comprobar solución".'
      ],
      en: [
        '1. Write: func sumar(a int, b int) int { return a + b }',
        '2. Click "Check solution".'
      ],
      ja: [
        '1. func sumar(a int, b int) int { return a + b } と記述します。',
        '2. 「解答を確認」をクリックします。'
      ],
      zh: [
        '1. 编写: func sumar(a int, b int) int { return a + b }。',
        '2. 点击“验证代码”。'
      ],
      pt: [
        '1. Escreva: func sumar(a int, b int) int { return a + b }',
        '2. Clique em "Validar solução".'
      ],
      fr: [
        '1. Écrivez : func sumar(a int, b int) int { return a + b }',
        '2. Cliquez sur "Vérifier la solution".'
      ]
    }
  }
};
export const initialPrefs = {theme:'dark' as Theme,locale:'es' as Locale,seniorEnabled:false,reducedMotion:false,completed:[] as string[],xp:0,
 notes:{} as Record<string,string>,drafts:{} as Record<string,string>,gameWins:[] as string[],seniorResults:{} as Record<string,SeniorResultRecord>,evidenceResults:{} as Record<string,EvidenceResultRecord>,investigationResults:{} as Record<string,InvestigationResultRecord>,operationsResults:{} as Record<string,OperationsRecord>,reviewResults:{} as Record<string,ReviewRecord>};
type Prefs = typeof initialPrefs;
function loadPrefs(): Prefs { try { const raw=localStorage.getItem('gopixel:v1'); if(raw){return sanitizePrefs(JSON.parse(raw));}} catch{} return {...initialPrefs}; }
// Strict storage boundary: never trust imported or browser-stored JSON.
function sanitizePrefs(v: unknown): Prefs {
 if (!v || typeof v !== 'object' || Array.isArray(v)) return {...initialPrefs};
 const a=v as Record<string, unknown>;
 const isLocale=(x:unknown):x is Locale=>typeof x==='string'&&['es','en','ja','zh','pt','fr'].includes(x);
 const isMap=(x:unknown):x is Record<string,unknown>=>!!x && typeof x==='object'&&!Array.isArray(x);
 const boundedStrings=(x:unknown)=>Object.fromEntries(Object.entries(isMap(x)?x:{}).filter(([k,v])=>k.length<=100 && !['__proto__','constructor','prototype'].includes(k) && typeof v==='string').slice(0,150).map(([k,v])=>[k,(v as string).slice(0,30000)]));
 const uniqueIDs=(x:unknown)=>Array.isArray(x)? [...new Set(x.filter(v=>typeof v==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(v)))].slice(0,300) as string[]:[];
 return {
  theme:a.theme==='light'?'light':'dark',locale:isLocale(a.locale)?a.locale:'es',seniorEnabled:a.seniorEnabled===true,reducedMotion:a.reducedMotion===true,
  completed:uniqueIDs(a.completed),xp:typeof a.xp==='number'&&Number.isFinite(a.xp)?Math.max(0,Math.min(100000,a.xp)):0,
  notes:boundedStrings(a.notes),drafts:boundedStrings(a.drafts),gameWins:uniqueIDs(a.gameWins),
  seniorResults:Object.fromEntries(Object.entries(isMap(a.seniorResults)?a.seniorResults:{}).filter(([id,r])=>/^S(0[1-9]|1[0-8])$/.test(id)&&validSeniorRecord(r,id,getChallenge(id))).map(([id,r])=>[id,r]).slice(0,18)) as Record<string,SeniorResultRecord>,
  evidenceResults:Object.fromEntries(Object.entries(isMap(a.evidenceResults)?a.evidenceResults:{}).filter(([id,r])=>/^S(0[1-9]|1[0-8])$/.test(id)&&verifiedEvidenceRecord(r,getEvidence(id))).slice(0,18)) as Record<string,EvidenceResultRecord>,
  investigationResults:Object.fromEntries(Object.entries(isMap(a.investigationResults)?a.investigationResults:{}).filter(([id,r])=>/^S(0[1-9]|1[0-8])$/.test(id)&&verifiedInvestigationRecord(r,investigationBank.find(v=>v.moduleId===id))).slice(0,18)) as Record<string,InvestigationResultRecord>,
  operationsResults:Object.fromEntries(Object.entries(isMap(a.operationsResults)?a.operationsResults:{}).filter(([id,r])=>/^S(0[1-9]|1[0-8])$/.test(id)&&verifiedOperationsRecord(r,operationsBank.find(v=>v.moduleId===id))).slice(0,18)) as Record<string,OperationsRecord>,
  reviewResults:Object.fromEntries(Object.entries(isMap(a.reviewResults)?a.reviewResults:{}).filter(([id,r])=>/^S(0[1-9]|1[0-8])$/.test(id)&&verifyReviewRecord(r,reviewBank.find(v=>v.moduleId===id))).slice(0,18)) as Record<string,ReviewRecord>,
 };
}
function useHash(): string {
 const [value,setValue]=useState(()=>window.location.hash || '#/');
 useEffect(()=>{const fn=()=>setValue(window.location.hash || '#/');window.addEventListener('hashchange',fn);return()=>window.removeEventListener('hashchange',fn)},[]);
 return value;
}
function Icon({name,size=24}: {name:string;size?:number}) { return <img class="pixel-icon" src={asset(`icons/${name}.svg`)} width={size} height={size} alt="" aria-hidden="true" />; }
function Gopher({name='welcome',className=''}:{name?:string;className?:string}) {return <img class={`gopher ${className}`} src={asset(`gophers/${name}.png`)} alt="" aria-hidden="true" />;}
function Card({children,className=''}:{children:ComponentChildren;className?:string}) {return <section class={`card ${className}`}>{children}</section>}
function Button({children,kind='primary',onClick,disabled=false}:{children:ComponentChildren;kind?:'primary'|'outline'|'quiet'|'senior';onClick?:()=>void;disabled?:boolean}) {return <button type="button" class={`btn btn-${kind}`} disabled={disabled} onClick={onClick}>{children}</button>}
function routeTo(path:string) {window.location.hash=`#/${path}`;window.scrollTo({top:0,behavior:'auto'});}
function getRoute(hash:string) {return hash.replace(/^#\/?/,'').split('/').filter(Boolean)}

export function App() {
 const [prefs,setPrefs]=useState<Prefs>(loadPrefs);
 const hash=useHash();
 const parts=getRoute(hash);
 const page=parts[0]||'home';
 const t=(key:string)=>dictionaries[prefs.locale][key]||key;
 const update=(patch:Partial<Prefs>)=>setPrefs(p=>({...p,...patch}));
 useEffect(()=>{for(const name of ['dark','light','senior']) document.documentElement.style.setProperty(`--landscape-${name}`, `url("${import.meta.env.BASE_URL}assets/backgrounds/landscape-${name}.svg")`);document.documentElement.setAttribute('data-theme',prefs.theme);document.documentElement.setAttribute('data-senior',String(prefs.seniorEnabled));document.documentElement.lang=prefs.locale;document.documentElement.setAttribute('data-reduced-motion',String(prefs.reducedMotion));try{localStorage.setItem('gopixel:v1',JSON.stringify(prefs))}catch{};},[prefs]);

 const pct=Math.min(100,Math.round(100*prefs.completed.filter(id=>/^[BIA]\d\d$/.test(id)).length/36));
 const mark=(id:string)=>setPrefs(p=>p.completed.includes(id)?p:{...p,completed:[...p.completed,id],xp:p.xp+20});
 const updateDraft=(id:string,code:string)=>setPrefs(p=>({...p,drafts:{...p.drafts,[id]:code}}));
 const updateNote=(id:string,note:string)=>setPrefs(p=>({...p,notes:{...p.notes,[id]:note}}));
 const hasRoute=(name:string)=>page===name;
 return <div class="app-shell">
   <header class="site-header">
    <a class="brand" href="#/" aria-label="GoPixel Academy"><img src={asset('favicon.png')} alt="" width="36" height="36"/><span>Go<span class="brand-cyan">Pixel</span><small>ACADEMY</small></span></a>
    <nav class="primary-nav" aria-label="Main navigation">
      {(['home','learn','games','frameworks','senior'] as const).map(k=><a href={`#/${k==='home'?'':k}`} class={hasRoute(k)?'active':''}><Icon name={{home:'home',learn:'book',games:'quiz',frameworks:'framework',senior:'crown'}[k]} size={18}/><span>{t(k)}</span></a>)}
    </nav>
    <div class="header-actions">
      <label class="lang-wrap"><span class="visually-hidden">{t('language')}</span><select aria-label={t('language')} value={prefs.locale} onChange={e=>update({locale:(e.currentTarget as HTMLSelectElement).value as Locale})}>{locales.map(l=><option value={l.id}>{l.flag} {l.label}</option>)}</select></label>
      <button type="button" class="circle-action" title={t('theme')} aria-label={t('theme')} onClick={()=>update({theme:prefs.theme==='dark'?'light':'dark'})}><Icon name={prefs.theme==='dark'?'sun':'moon'} size={19}/></button>
      <button type="button" class={`senior-toggle ${prefs.seniorEnabled?'on':''}`} aria-pressed={prefs.seniorEnabled} onClick={()=>update({seniorEnabled:!prefs.seniorEnabled})}><Icon name="crown" size={18}/><span>{t('senior')}</span><span class="toggle-knob"/></button>
      <a class="circle-action settings-action" href="#/settings" title={t('settings')} aria-label={t('settings')}><Icon name="settings" size={18}/></a>
    </div>
   </header>
   <main id="main" class="main-content">
    {page==='home'&&<Home t={t} pct={pct}/>}
    {page==='learn'&&parts.length<3&&<Catalog t={t} locale={prefs.locale} completed={prefs.completed} track={parts[1] as RouteTrack|undefined}/>}
    {page==='learn'&&parts.length>=3&&<Lesson t={t} locale={prefs.locale} id={parts[2]} prefs={prefs} updateDraft={updateDraft} mark={mark}/>}
    {page==='lesson'&&<Lesson t={t} locale={prefs.locale} id={parts[1]||'B01'} prefs={prefs} updateDraft={updateDraft} mark={mark}/>}
    {page==='exercise'&&<Lesson t={t} locale={prefs.locale} id={(parts[1]||'B01').split('-')[0]} prefs={prefs} updateDraft={updateDraft} mark={mark}/>}
    {page==='games'&&<Games t={t} locale={prefs.locale} prefs={prefs} update={update} initialMode={parts[1]}/>}
    {page==='senior'&&parts[1]==='native'&&parts.length===2&&<NativeLabCatalog locale={prefs.locale}/>}
    {page==='senior'&&parts[1]==='readiness'&&parts.length===2&&<SeniorReadiness locale={prefs.locale} records={prefs}/>}
    {page==='senior'&&parts[1]==='capstone'&&parts.length===2&&<SeniorCapstone locale={prefs.locale}/>}
    {page==='senior'&&parts.length===3&&parts[2]==='guide'&&<SeniorGuide moduleId={parts[1]} locale={prefs.locale}/>}
    {page==='senior'&&parts.length===3&&parts[2]==='review-lab'&&<CodeReviewLab key={parts[1]} moduleId={parts[1]} locale={prefs.locale} previous={prefs.reviewResults[parts[1]]} save={rec=>setPrefs(p=>({...p,reviewResults:{...p.reviewResults,[rec.moduleId]:rec}}))}/>}
    {page==='senior'&&parts.length===4&&parts[2]==='review-lab'&&parts[3]==='result'&&<CodeReviewLab reportOnly key={parts[1]} moduleId={parts[1]} locale={prefs.locale} previous={prefs.reviewResults[parts[1]]} save={rec=>setPrefs(p=>({...p,reviewResults:{...p.reviewResults,[rec.moduleId]:rec}}))}/>}
    {page==='senior'&&parts.length===3&&parts[2]==='native'&&<NativeLabCatalog locale={prefs.locale} activeModule={parts[1]}/>}
    {page==='senior'&&parts.length===3&&parts[2]==='operations-lab'&&<OperationsLab key={parts[1]} moduleId={parts[1]} locale={prefs.locale} previous={prefs.operationsResults[parts[1]]} save={rec=>setPrefs(p=>({...p,operationsResults:{...p.operationsResults,[rec.moduleId]:rec}}))}/>}
    {page==='senior'&&parts.length===4&&parts[2]==='operations-lab'&&parts[3]==='result'&&<OperationsLab reportOnly key={parts[1]} moduleId={parts[1]} locale={prefs.locale} previous={prefs.operationsResults[parts[1]]} save={rec=>setPrefs(p=>({...p,operationsResults:{...p.operationsResults,[rec.moduleId]:rec}}))}/>}
    {page==='senior'&&parts.length===3&&parts[2]==='investigation-lab'&&<InvestigationLab key={parts[1]} moduleId={parts[1]} locale={prefs.locale} previous={prefs.investigationResults[parts[1]]} save={rec=>setPrefs(p=>({...p,investigationResults:{...p.investigationResults,[rec.moduleId]:rec}}))}/>}
    {page==='senior'&&parts.length===4&&parts[2]==='investigation-lab'&&parts[3]==='result'&&<InvestigationLab reportOnly key={parts[1]} moduleId={parts[1]} locale={prefs.locale} previous={prefs.investigationResults[parts[1]]} save={rec=>setPrefs(p=>({...p,investigationResults:{...p.investigationResults,[rec.moduleId]:rec}}))}/>}
    {page==='senior'&&parts.length===3&&parts[2]==='decision-lab'&&<DecisionLab key={parts[1]} moduleId={parts[1]} locale={prefs.locale} previous={prefs.seniorResults[parts[1]]} save={rec=>setPrefs(p=>({...p,seniorResults:{...p.seniorResults,[rec.moduleId]:rec}}))}/>}
    {page==='senior'&&parts.length===4&&parts[2]==='decision-lab'&&parts[3]==='result'&&<SeniorResult moduleId={parts[1]} locale={prefs.locale} challengeType="decision-lab" seniorResults={prefs.seniorResults} evidenceResults={prefs.evidenceResults} notes={prefs.notes}/>}
    {page==='senior'&&parts.length===3&&parts[2]==='evidence-lab'&&<EvidenceLab key={parts[1]} moduleId={parts[1]} locale={prefs.locale} previous={prefs.evidenceResults[parts[1]]} save={rec=>setPrefs(p=>({...p,evidenceResults:{...p.evidenceResults,[rec.moduleId]:rec}}))}/>}
    {page==='senior'&&parts.length===4&&parts[2]==='evidence-lab'&&parts[3]==='result'&&<SeniorResult moduleId={parts[1]} locale={prefs.locale} challengeType="evidence-lab" seniorResults={prefs.seniorResults} evidenceResults={prefs.evidenceResults} notes={prefs.notes}/>}
    {page==='senior'&&parts.length===2&&/^S(0[1-9]|1[0-8])$/.test(parts[1])&&<SeniorModuleHub key={parts[1]} moduleId={parts[1]} locale={prefs.locale} notes={prefs.notes} updateNote={updateNote} seniorResults={prefs.seniorResults} evidenceResults={prefs.evidenceResults} investigationResults={prefs.investigationResults} operationsResults={prefs.operationsResults} reviewResults={prefs.reviewResults}/>}
    {page==='senior'&&parts.length===1&&<SeniorDashboard locale={prefs.locale} seniorResults={prefs.seniorResults} evidenceResults={prefs.evidenceResults} investigationResults={prefs.investigationResults} operationsResults={prefs.operationsResults} reviewResults={prefs.reviewResults}/>}
    {/* Senior activities: 'Revisar código Go' (#/senior/:id/review-lab) | 'Estudiar guía técnica' (#/senior/:id/guide) */}
    {page==='senior'&&parts.length>=4&&!(parts[3]==='result'&&['decision-lab','evidence-lab','investigation-lab','operations-lab','review-lab'].includes(parts[2]))&&<MissingPage t={t}/>}
    {page==='frameworks'&&<Frameworks t={t} locale={prefs.locale} id={parts[1]}/>}
    {page==='playground'&&<PlaygroundInfo t={t}/>}
    {page==='progress'&&<Progress t={t} prefs={prefs} locale={prefs.locale}/>}
    {page==='settings'&&<Settings t={t} prefs={prefs} update={update} reset={()=>setPrefs({...initialPrefs})}/>}
    {page==='about'&&<About t={t}/>}
    {page==='credits'&&<Credits t={t}/>}
    {(page==='404'||!['home','learn','lesson','exercise','games','senior','frameworks','playground','progress','settings','about','credits'].includes(page))&&<MissingPage t={t}/>}
   </main>
   <footer class="site-footer"><div class="footer-inner"><span>© GoPixel Academy · <a href="https://go.dev/brand" target="_blank" rel="noreferrer">Gopher © Renee French (CC BY 4.0)</a></span><span>{t('notOfficial')}</span><div class="footer-links"><a href="#/progress">{t('progress')}</a><a href="#/about">About</a><a href="#/credits">Credits</a><a href="#/settings">{t('settings')}</a></div></div></footer>
 </div>;
}

function Home({t,pct}:{t:(k:string)=>string;pct:number}) {
 return <><div class="hero">
  <div class="hero-stars" aria-hidden="true">✦ &nbsp; · &nbsp; ✧ &nbsp; · &nbsp; ✦</div>
  <div class="hero-copy"><div class="eyebrow"><span class="dot"/>{t('heroEyebrow')}</div><h1>Go<span>Pixel</span><br/>Academy</h1><p class="hero-title">{t('heroTitle')}</p><p class="hero-subtitle">{t('heroSubtitle')}</p><div class="hero-ctas"><Button onClick={()=>routeTo('lesson/B01')}><Icon name="play" size={21}/>{t('start')}</Button><Button kind="outline" onClick={()=>routeTo('learn')}>{t('explore')} →</Button></div><div class="hero-metrics"><span><b>54</b> Go</span><span><b>18</b> Senior</span><span><b>8</b> Frameworks</span><span><b>6</b> 🌐</span></div></div>
  <div class="hero-art"><div class="hero-orbit"/><Gopher name="coding" className="hero-gopher"/><div class="code-float"><span>● ● ● &nbsp; main.go</span><code>func main() {'{'}<br/> &nbsp;fmt.Println("Go!")<br/>{'}'}</code></div></div>
  </div><section class="section"><div class="section-heading"><div><span class="eyebrow small">LEARNING MAP</span><h2>{t('featured')}</h2></div><a href="#/learn" class="text-link">{t('showAll')} →</a></div><div class="track-grid">{tracks.map(track=><TrackCard track={track} t={t} pct={pct}/>)}</div></section><section class="feature-banner"><div><span class="eyebrow">SENIOR MODE</span><h2>Think beyond syntax.</h2><p>{t('briefHint')}</p><Button kind="senior" onClick={()=>routeTo('senior')}><Icon name="crown" size={18}/>{t('senior')}</Button></div><Gopher name="senior"/></section></>;
}
function TrackCard({track,t,pct}:{track:RouteTrack;t:(k:string)=>string;pct:number}) {
 const i=trackStyles[track]; const count=track==='senior'?18:12;
 return <a class={`track-card ${i.className}`} href={`#/${track==='senior'?'senior':`learn/${track}`}`}><div class="track-top"><span class="track-icon"><Icon name={i.icon} size={29}/></span><span class="track-count">{count} MODULES</span></div><h3>{t(track==='basic'?'basic':track==='intermediate'?'intermediate':track==='advanced'?'advanced':'senior')}</h3><p>{track==='senior'?'Production labs · architecture':track==='advanced'?'Concurrency · performance':track==='intermediate'?'APIs · databases · testing':'Syntax · functions · structs'}</p><div class="track-bottom"><div class="progress-bar"><i style={{width:`${track==='basic'?pct:0}%`}}/></div><span>↗</span></div></a>
}
function Catalog({t,locale,completed,track}:{t:(k:string)=>string;locale:Locale;completed:string[];track?:RouteTrack}) {
 const selected=track&&tracks.includes(track)?track:'basic';const records=modules.filter(m=>m.track===selected);
 return <div class="content-page"><PageHeading eyebrow="GO LEARNING" title={t('featured')} subtitle="54 modules · 4 tracks"/><div class="catalog-layout"><aside class="catalog-aside"><div class="aside-label">{t('learn')}</div>{tracks.map(k=><a class={`aside-link ${selected===k?'selected':''}`} href={`#/learn/${k}`}><Icon name={trackStyles[k].icon} size={20}/>{t(k)} <b>{k==='senior'?'18':'12'}</b></a>)}<div class="aside-gopher"><Gopher name="reading"/><span>One step at a time.</span></div></aside><div class="catalog-main"><div class="catalog-head"><h2>{t(selected)}</h2><p>{records[0]?.summary[locale]}</p></div><div class="module-grid">{records.map(m=><a class="module-card" href={selected==='senior'?`#/senior/${m.id}`:`#/lesson/${m.id}`}><div class="module-card-top"><span class="mono id">{m.id}</span>{completed.includes(m.id)?<span class="status done">✓ {t('completed')}</span>:<span class="status">{m.status==='implemented'?t('preview'):t('planned')}</span>}</div><h3>{m.title[locale]}</h3><p>{m.summary[locale]}</p><span class="module-arrow">↗</span></a>)}</div></div></div></div>;
}
function PageHeading({eyebrow,title,subtitle}:{eyebrow:string;title:string;subtitle?:string}) {return <div class="page-heading"><span class="eyebrow small">{eyebrow}</span><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div>}
function Lesson({t,locale,id,prefs,updateDraft,mark}:{t:(k:string)=>string;locale:Locale;id:string;prefs:Prefs;updateDraft:(id:string,v:string)=>void;mark:(id:string)=>void}) {
 const m=modules.find(m=>m.id===id&&m.track!=='senior');const spec=goExamples[id];const guide=lessonGuides[id];const [feedback,setFeedback]=useState<'correct'|'incorrect'|null>(null);const [showHint,setShowHint]=useState(false);
 const [localCode,setLocalCode]=useState<string>(prefs.drafts[id]??spec?.code??'');
 useEffect(()=>{setLocalCode(prefs.drafts[id]??goExamples[id]?.code??'');setFeedback(null);setShowHint(false)},[id]);
 if(!m)return <div class="content-page"><PageHeading eyebrow="404" title="Module not found"/><Button onClick={()=>routeTo('learn')}>{t('back')}</Button></div>;
 return <div class="content-page lesson-page"><div class="breadcrumbs"><a href="#/learn">{t('learn')}</a><span>/</span><a href={`#/learn/${m.track}`}>{t(m.track)}</a><span>/</span><b>{m.id}</b></div><PageHeading eyebrow={`${t('lesson')} ${m.id}`} title={m.title[locale]} subtitle={m.summary[locale]}/><div class="lesson-layout"><div class="lesson-main"><Card className="lesson-intro"><div class="lesson-intro-head"><div><h2>{t('objectives')}</h2><p>{m.summary[locale]}</p></div><div class="lesson-intro-art"><Gopher name={spec?'reading':'architecture'}/></div></div>{guide?.concepts[locale]&&<div class="concept-grid">{guide.concepts[locale].map(c=><div class="concept-item" key={c.term}><code>{c.term}</code><p>{c.desc}</p></div>)}</div>}{!spec&&<p class="notice">{t('contentPlan')}</p>}</Card>{guide?.mission[locale]&&<div class="lesson-mission"><div class="lesson-mission-title"><Icon name="check" size={18}/><span>{locale==='es'?'🎯 Tu Misión':locale==='en'?'🎯 Your Mission':locale==='ja'?'🎯 ミッション':locale==='zh'?'🎯 当前任务':locale==='pt'?'🎯 Sua Missão':'🎯 Votre Mission'}</span></div><p>{guide.mission[locale]}</p></div>}<Card className="editor-card"><div class="panel-title"><span><Icon name="terminal" size={18}/> main.go</span><span class="tag info">{spec?t('preview'):t('planned')}</span></div>{spec?<><textarea aria-label={t('code')} spellcheck={false} class="code-editor" value={localCode} onInput={e=>{const v=(e.currentTarget as HTMLTextAreaElement).value;setLocalCode(v);updateDraft(id,v);setFeedback(null)}} /><div class="editor-actions"><Button onClick={()=>{const pass=spec.test(localCode);setFeedback(pass?'correct':'incorrect');if(pass)mark(id)}}><Icon name="check" size={18}/>{t('validate')}</Button><Button kind="outline" onClick={()=>{setLocalCode(spec.code);updateDraft(id,spec.code);setFeedback(null)}}>{t('reset')}</Button><Button kind="quiet" onClick={()=>setShowHint(!showHint)}>{t('hint')}</Button></div>{showHint&&<div class="hint-box"><Icon name="question" size={18}/><code>{spec.hint}</code></div>}{feedback&&<div class={`feedback ${feedback}`}>{feedback==='correct'?'✓ ':'○ '}{t(feedback)}</div>}<p class="small-disclaimer">{t('runUnavailable')}</p></>:<div class="empty-editor"><Icon name="book" size={34}/>{t('contentPlan')}</div>}</Card></div><aside class="lesson-side"><Card className="side-panel"><h3>{locale==='es'?'Paso a paso':locale==='en'?'Step by Step':locale==='ja'?'学習ステップ':locale==='zh'?'学习步骤':locale==='pt'?'Passo a Passo':'Étape par étape'}</h3><ul class="steps-list">{(guide?.steps[locale]||['01 · Lee la lección','02 · Completa el código','03 · Comprueba tu solución']).map((s,idx)=><li key={idx}>{s}</li>)}</ul></Card><Card className="side-gopher"><Gopher name="idea"/><p>{locale==='es'?'Escribe en el editor y pulsa "Comprobar solución" para ganar XP.':locale==='en'?'Type in the editor and click "Check solution" to earn XP.':locale==='ja'?'エディタに入力し「解答を確認」をクリックしてXPを獲得。':locale==='zh'?'在编辑器中输入并点击“验证代码”以获得经验值。':locale==='pt'?'Digite no editor e clique em "Validar solução" para ganhar XP.':'Tapez dans l\'éditeur et cliquez sur "Vérifier la solution" pour gagner des XP.'}</p></Card></aside></div></div>;
}

const questions: Record<Locale,{q:string,explain:string,bugQ:string}>={
 es:{q:'¿Qué palabra inicia una goroutine?',explain:'La palabra clave go inicia una llamada de función como goroutine.',bugQ:'¿Qué falta en fmt.Println("Hola" ?'},
 en:{q:'Which keyword starts a goroutine?',explain:'The go keyword starts a function call as a goroutine.',bugQ:'What is missing in fmt.Println("Hello" ?'},
 ja:{q:'goroutineを開始するキーワードは？',explain:'goキーワードで関数呼び出しをgoroutineとして実行します。',bugQ:'fmt.Println("Hola" に足りないものは？'},
 zh:{q:'哪个关键字启动 goroutine？',explain:'go 关键字将函数调用作为 goroutine 启动。',bugQ:'fmt.Println("Hola" 缺少什么？'},
 pt:{q:'Qual palavra inicia uma goroutine?',explain:'A palavra go inicia uma chamada de função como goroutine.',bugQ:'O que falta em fmt.Println("Hola" ?'},
 fr:{q:'Quel mot-clé lance une goroutine ?',explain:'Le mot-clé go lance un appel de fonction dans une goroutine.',bugQ:'Que manque-t-il dans fmt.Println("Hola" ?'}
};
const gameModes=[{id:'quiz',icon:'question'},{id:'complete',icon:'code'},{id:'order',icon:'puzzle'},{id:'predict',icon:'terminal'},{id:'bug',icon:'bug'}];
function Games({t,locale,prefs,update,initialMode}:{t:(k:string)=>string;locale:Locale;prefs:Prefs;update:(v:Partial<Prefs>)=>void;initialMode?:string}) {
 const [mode,setMode]=useState(()=>gameModes.some(g=>g.id===initialMode)?(initialMode || 'quiz'):'quiz');useEffect(()=>{if(initialMode && gameModes.some(g=>g.id===initialMode))setMode(initialMode)},[initialMode]);const [choice,setChoice]=useState('');const [answer,setAnswer]=useState<'correct'|'incorrect'|null>(null);
 const [items,setItems]=useState(['fmt.Println("Hola")','func main() {','package main','import "fmt"','}']);
 const [text,setText]=useState('');
 const win=()=>{setAnswer('correct');if(!prefs.gameWins.includes(mode))update({gameWins:[...prefs.gameWins,mode],xp:prefs.xp+15})};
 const validate=()=>{const good=mode==='quiz'?choice==='go':mode==='complete'?text.trim()==='Println':mode==='predict'?choice==='6':mode==='bug'?choice==='parenthesis':items.join('|')==='package main|import "fmt"|func main() {|fmt.Println("Hola")|}';good?win():setAnswer('incorrect')};
 const select=(key:string)=>{setMode(key);setAnswer(null);setChoice('');setText('')};
 return <div class="content-page"><PageHeading eyebrow="PLAY & LEARN" title={t('games')} subtitle={t('gameDesc')}/><div class="games-grid">{gameModes.map(g=><button type="button" class={`game-tile ${mode===g.id?'chosen':''}`} onClick={()=>{select(g.id);routeTo(`games/${g.id}`)}}><span><Icon name={g.icon} size={28}/></span><b>{t(g.id)}</b><small>{prefs.gameWins.includes(g.id)?'✓':'5 MIN'}</small></button>)}</div><Card className="game-arena"><div class="game-arena-head"><span class="eyebrow small">GO PIXEL MINI LAB</span><b>{t(mode)}</b></div>
 {mode==='quiz'&&<><h2>{questions[locale].q}</h2><div class="option-grid">{['go','spawn','async','thread'].map(x=><button type="button" class={`choice ${choice===x?'chosen':''}`} onClick={()=>setChoice(x)}>{x}</button>)}</div></>}
 {mode==='complete'&&<><h2>{t('complete')}</h2><pre class="mini-code">{'package main\nimport "fmt"\nfunc main() {\n  fmt.____("Hola")\n}'}</pre><label>{t('answer')}<input value={text} onInput={e=>setText((e.currentTarget as HTMLInputElement).value)} placeholder="Println"/></label></>}
 {mode==='predict'&&<><h2>{t('predict')}</h2><pre class="mini-code">{'x := 2\nx *= 3\nfmt.Println(x)'}</pre><div class="option-grid">{['4','5','6','8'].map(x=><button type="button" class={`choice ${choice===x?'chosen':''}`} onClick={()=>setChoice(x)}>{x}</button>)}</div></>}
 {mode==='bug'&&<><h2>{questions[locale].bugQ}</h2><pre class="mini-code">{'fmt.Println("Hola"'}</pre><div class="option-grid">{[{id:'semicolon',text:';'},{id:'parenthesis',text:')'},{id:'bracket',text:'}'},{id:'quote',text:'"'}].map(x=><button type="button" class={`choice ${choice===x.id?'chosen':''}`} onClick={()=>setChoice(x.id)}>{x.text}</button>)}</div></>}
 {mode==='order'&&<><h2>{t('order')}</h2><div class="order-list">{items.map((x,i)=><div class="order-item"><code>{x}</code><div><button type="button" disabled={i===0} aria-label="Move up" onClick={()=>setItems(a=>{const n=[...a];[n[i-1],n[i]]=[n[i],n[i-1]];return n})}>↑</button><button type="button" disabled={i===items.length-1} aria-label="Move down" onClick={()=>setItems(a=>{const n=[...a];[n[i+1],n[i]]=[n[i],n[i+1]];return n})}>↓</button></div></div>)}</div></>}
 <div class="game-actions"><Button onClick={validate}>{t('validate')}</Button><Button kind="outline" onClick={()=>select(mode)}>{t('reset')}</Button></div>{answer&&<div class={`feedback ${answer}`}>{t(answer)} {answer==='correct'&&mode==='quiz'?questions[locale].explain:''}</div>}
 </Card></div>
}
const frameworkSnippets: Record<string, string> = {
  F01: `package main

import (
	"fmt"
	"net/http"
	"time"
)

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		fmt.Printf("[%s] %s %v\\n", r.Method, r.URL.Path, time.Since(start))
	})
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(\`{"status":"healthy","uptime_sec":120}\`))
	})

	server := &http.Server{
		Addr:         ":8080",
		Handler:      loggingMiddleware(mux),
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	server.ListenAndServe()
}`,
  F02: `package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

type CreateOrderReq struct {
	ItemID   string  \`json:"item_id" binding:"required"\`
	Quantity int     \`json:"qty" binding:"required,gt=0"\`
	Amount   float64 \`json:"amount" binding:"required,gt=0"\`
}

func main() {
	r := gin.Default()
	v1 := r.Group("/api/v1")
	{
		v1.POST("/orders", func(c *gin.Context) {
			var req CreateOrderReq
			if err := c.ShouldBindJSON(&req); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusCreated, gin.H{"status": "accepted", "item_id": req.ItemID})
		})
	}
	r.Run(":8080")
}`,
  F03: `package main

import (
	"net/http"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Route("/articles", func(r chi.Router) {
		r.Get("/{id}", func(w http.ResponseWriter, r *http.Request) {
			id := chi.URLParam(r, "id")
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(\`{"article_id":"\` + id + \`"}\`))
		})
	})
	http.ListenAndServe(":3333", r)
}`,
  F04: `package main

import (
	"net/http"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type User struct {
	Name  string \`json:"name"\`
	Email string \`json:"email"\`
}

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/users/:id", func(c echo.Context) error {
		id := c.Param("id")
		u := &User{Name: "Gopher " + id, Email: id + "@gopixel.dev"}
		return c.JSON(http.StatusOK, u)
	})
	e.Logger.Fatal(e.Start(":1323"))
}`,
  F05: `package main

import (
	"time"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
)

func main() {
	app := fiber.New(fiber.Config{
		Prefork:       false,
		ServerHeader:  "GoPixel-Fiber",
		StrictRouting: true,
	})

	app.Use(limiter.New(limiter.Config{
		Max:        100,
		Expiration: 1 * time.Minute,
	}))

	app.Get("/fast-metrics", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"allocations": 0,
			"engine":      "fasthttp",
			"status":      "ok",
		})
	})
	app.Listen(":3000")
}`,
  F06: `package main

import (
	"context"
	"database/sql"
	_ "github.com/lib/pq"
)

type AccountRepo struct {
	db *sql.DB
}

func (r *AccountRepo) TransferBalance(ctx context.Context, from, to int64, amount int64) error {
	tx, err := r.db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelReadCommitted})
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if _, err = tx.ExecContext(ctx, "UPDATE accounts SET balance = balance - $1 WHERE id = $2", amount, from); err != nil {
		return err
	}
	if _, err = tx.ExecContext(ctx, "UPDATE accounts SET balance = balance + $1 WHERE id = $2", amount, to); err != nil {
		return err
	}
	return tx.Commit()
}`,
  F07: `package main

import (
	"context"
	"net"
	"google.golang.org/grpc"
	pb "gopixel/academy/gen/order/v1"
)

type OrderServer struct {
	pb.UnimplementedOrderServiceServer
}

func (s *OrderServer) GetOrderStatus(ctx context.Context, req *pb.GetStatusRequest) (*pb.StatusResponse, error) {
	return &pb.StatusResponse{
		OrderId: req.GetOrderId(),
		Status:  pb.OrderStatus_ORDER_STATUS_CONFIRMED,
	}, nil
}

func main() {
	lis, _ := net.Listen("tcp", ":50051")
	srv := grpc.NewServer()
	pb.RegisterOrderServiceServer(srv, &OrderServer{})
	srv.Serve(lis)
}`,
  F08: `package main

import "context"

// Hexagonal Architecture: Ports & Adapters
type Order struct {
	ID    string
	Total int64
}

// Inbound Port
type OrderUseCase interface {
	PlaceOrder(ctx context.Context, o *Order) error
}

// Outbound Port (Dependency Inversion)
type OrderRepository interface {
	Save(ctx context.Context, o *Order) error
	FindByID(ctx context.Context, id string) (*Order, error)
}

type OrderNotifier interface {
	NotifyPlaced(ctx context.Context, orderID string) error
}`
};

function Frameworks({t,locale,id}:{t:(k:string)=>string;locale:Locale;id?:string}) {
 const frameworks=modules.filter(m=>m.track==='frameworks');const m=frameworks.find(m=>m.id===id);
 if(m) return <div class="content-page"><div class="breadcrumbs"><a href="#/frameworks">{t('frameworks')}</a><span>/</span><b>{m.id}</b></div><PageHeading eyebrow={`FRAMEWORKS ACADEMY · ${m.id}`} title={m.title[locale]} subtitle={m.summary[locale]}/><div class="framework-detail"><Card><h2>{t('objectives')}</h2><div class="chip-line">{m.tools?.map(x=><span class="chip">{x}</span>)}</div><div class="notice">{t('frameworkHint')}</div><h3>{t('contentPlan')}</h3><pre class="mini-code">{frameworkSnippets[m.id] || `// ${m.title.en}\n// Go backend lab`}</pre></Card><Card><Gopher name="building"/><h3>{t('challenge')}</h3><p>{t('contentPlan')}</p><Button kind="outline" onClick={()=>routeTo('frameworks')}>{t('back')}</Button></Card></div></div>
 return <div class="content-page"><PageHeading eyebrow="BACKEND SPECIALIZATION" title={t('frameworks')} subtitle={t('frameworkHint')}/><div class="framework-grid">{frameworks.map(m=><a href={`#/frameworks/${m.id}`} class="framework-card"><div class="framework-icon"><Icon name={m.id==='F06'?'database':m.id==='F07'?'network':'framework'} size={30}/></div><div><span class="mono small">{m.id}</span><h3>{m.title[locale]}</h3><p>{m.tools?.join(' · ')}</p></div><span>↗</span></a>)}</div></div>;
}
function Progress({t,prefs,locale}:{t:(k:string)=>string;prefs:Prefs;locale:Locale}) {
 const achieved=modules.filter(m=>prefs.completed.includes(m.id));
 return <div class="content-page"><PageHeading eyebrow="YOUR JOURNEY" title={t('progress')} subtitle={t('savedAutomatic')}/><div class="progress-layout"><Card className="progress-summary"><Gopher name="graduate"/><div><span class="eyebrow small">GO PIXEL EXPLORER</span><h2>{prefs.xp} XP</h2><p>{prefs.completed.length} {t('completed')} · {prefs.gameWins.length} {t('games')} · {Object.keys(prefs.investigationResults).length} investigaciones Senior · {Object.keys(prefs.operationsResults).length} laboratorios operativos</p></div></Card><Card><h3>{t('achievements')}</h3><div class="achievement-list"><span><Icon name="trophy" size={25}/> {t('firstSteps')}</span><span><Icon name="bug" size={25}/> BUG HUNTER</span><span><Icon name="crown" size={25}/> SENIOR LAB</span></div></Card></div><h2>{t('completed')}</h2><div class="module-grid">{achieved.length?achieved.map(m=><div class="module-card"><span class="mono">{m.id}</span><h3>{m.title[locale]}</h3></div>):<p class="muted">{t('start')} → <a href="#/lesson/B01">B01</a></p>}</div></div>;
}
function Settings({t,prefs,update,reset}:{t:(k:string)=>string;prefs:Prefs;update:(v:Partial<Prefs>)=>void;reset:()=>void}) {
 const exportData=()=>{const a=document.createElement('a');const blob=new Blob([JSON.stringify({version:1,prefs},null,2)],{type:'application/json'});a.href=URL.createObjectURL(blob);a.download='gopixel-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
 const importData=(file:File|null)=>{if(!file)return;if(file.size>1024*1024){alert('Backup too large (1 MB maximum)');return;}file.text().then(s=>{try{const v=JSON.parse(s);if(v.version!==1||!v.prefs||typeof v.prefs!=='object'||Array.isArray(v.prefs))throw new Error('Bad export');update(sanitizePrefs(v.prefs));}catch{alert('Invalid GoPixel backup');}})};
 return <div class="content-page"><PageHeading eyebrow="PERSONALIZE" title={t('settings')} subtitle={t('savedAutomatic')}/><div class="settings-grid"><Card><h2>{t('theme')}</h2><div class="choice-row"><Button kind={prefs.theme==='light'?'primary':'outline'} onClick={()=>update({theme:'light'})}><Icon name="sun" size={18}/>{t('light')}</Button><Button kind={prefs.theme==='dark'?'primary':'outline'} onClick={()=>update({theme:'dark'})}><Icon name="moon" size={18}/>{t('dark')}</Button></div><h3>{t('reducedMotion')}</h3><label class="setting-control"><input type="checkbox" checked={prefs.reducedMotion} onInput={e=>update({reducedMotion:(e.currentTarget as HTMLInputElement).checked})} onChange={e=>update({reducedMotion:(e.currentTarget as HTMLInputElement).checked})}/>{t('reducedMotion')}</label></Card><Card><h2>{t('privacy')}</h2><p>{t('noServer')}</p><p class="muted">{t('savedAutomatic')}</p><div class="settings-actions"><Button kind="outline" onClick={exportData}>{t('export')}</Button><label class="file-import">{t('import')}<input type="file" accept="application/json,.json" onChange={e=>importData((e.currentTarget as HTMLInputElement).files?.[0]||null)}/></label><button type="button" class="btn btn-danger" onClick={()=>{if(confirm(t('confirmClear')))reset()}}>{t('clear')}</button></div></Card></div></div>
}

function About({t}:{t:(k:string)=>string}) {
 return <div class="content-page"><PageHeading eyebrow="OPEN LEARNING" title="Acerca de GoPixel Academy" subtitle="Plataforma educativa independiente y estática"/><Card><Gopher name="reading"/><p>Aprende Go con ejercicios pequeños, módulos de backend, juegos ligeros y reflexiones de ingeniería Senior.</p><p>El código y el progreso se quedan en tu navegador. No hay registro ni backend.</p><p>Los retos de los módulos sin contenido desarrollado están marcados como planificados; el editor de ejercicios iniciales verifica reglas didácticas, pero no ejecuta un compilador Go.</p><a href="#/learn" class="text-link">{t('learn')} ↗</a></Card></div>
}
function Credits({t}:{t:(k:string)=>string}) {
 return <div class="content-page"><PageHeading eyebrow="ATTRIBUTION" title="Créditos y licencias" subtitle="GoPixel Academy es independiente, no oficial"/><Card><Gopher name="welcome"/><p>La mascota Go Gopher original fue creada por Renee French y se distribuye bajo CC BY 4.0. Los sprites del proyecto son adaptaciones pixel art.</p><p><a href="https://go.dev/brand" target="_blank" rel="noopener noreferrer">Go brand</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a></p><a href="#/about" class="text-link">{t('back')} ↗</a></Card></div>
}
function MissingPage({t}:{t:(k:string)=>string}) { return <div class="content-page"><PageHeading eyebrow="404" title="Página no encontrada" subtitle="La ruta no existe en este catálogo local"/><Card><Gopher name="question"/><a class="text-link" href="#/">{t('back')} ↗</a></Card></div> }
function PlaygroundInfo({t}:{t:(k:string)=>string}) {
 return <div class="content-page"><PageHeading eyebrow="GO PLAYGROUND" title="Playground independiente" subtitle="Estado: no disponible hasta integrar un motor Go seguro en WASM"/><Card><Gopher name="coding"/><p>La plataforma aún no compila ni ejecuta código Go arbitrario. Para practicar hoy, abre los cinco ejercicios didácticos del nivel básico o utiliza el <a href="https://go.dev/play/" target="_blank" rel="noopener noreferrer">Go Playground oficial</a> fuera de la web.</p><Button onClick={()=>routeTo('lesson/B01')}>{t('practice')}</Button></Card></div>
}
