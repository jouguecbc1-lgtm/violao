import { Lesson } from '../types';

export const COURSE_LESSONS: Lesson[] = [
  // MÓDULO 1: FUNDAMENTOS MUSICAIS
  {
    id: 'aula-1',
    moduleNumber: 1,
    moduleTitle: 'Fundamentos Musicais',
    lessonNumber: 1,
    title: 'Notas Musicais e a Organização do Som',
    level: 'iniciante',
    estimatedMinutes: 8,
    description: 'Compreenda o sistema ocidental de 12 sons, nomes de notas e a notação de cifras (C, D, E, F, G, A, B).',
    content: `
### As 7 Notas Naturais e as Cifras Internacionais
A música ocidental organiza as frequências audíveis em 12 notas fundamentais. As 7 notas naturais são mundialmente identificadas pelo sistema de letras:
* **C** = Dó
* **D** = Ré
* **E** = Mi
* **F** = Fá
* **G** = Sol
* **A** = Lá
* **B** = Si

Cada nota vibra em uma frequência definida. Quando subimos de um C até o próximo C mais agudo, percorremos uma **oitava** (duplicando a frequência física em Hertz).
    `,
    keyTakeaways: [
      'As cifras universais usam letras de A a G (A=Lá, B=Si, C=Dó, D=Ré, E=Mi, F=Fá, G=Sol).',
      'Existem 7 notas naturais e 5 notas alteradas (com sustenidos/bemóis), totalizando 12 sons cromáticos.',
      'Uma oitava representa o ciclo sonoro completo até a repetição do mesmo nome de nota.',
    ],
    practicalApplication: {
      instrument: 'Piano e Violão',
      instructions: 'No piano, encontre o Dó (C) imediatamente à esquerda das duas teclas pretas. No violão, toque a 5ª corda na 3ª casa para soar a nota Dó.',
      chordsOrNotes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    },
    exercise: {
      question: 'Qual letra do sistema de cifras corresponde à nota Fá?',
      options: ['C', 'D', 'F', 'G'],
      correctIndex: 2,
      explanation: 'A letra F corresponde à nota Fá (A=Lá, B=Si, C=Dó, D=Ré, E=Mi, F=Fá, G=Sol).',
    },
  },
  {
    id: 'aula-2',
    moduleNumber: 1,
    moduleTitle: 'Fundamentos Musicais',
    lessonNumber: 2,
    title: 'Tons e Semitons: A Régua Musical',
    level: 'iniciante',
    estimatedMinutes: 10,
    description: 'Entenda a menor distância do sistema ocidental (semitom) e a distância de tom inteiro.',
    content: `
### A Unidade de Medida da Música
Para entender qualquer escala, acorde ou progressão, você precisa dominar:
1. **Semitom (ST) ou Meio Tom:** É a menor distância possível entre duas notas na música ocidental temperada.
   * No teclado: a tecla imediatamente vizinha (seja preta ou branca).
   * No violão/guitarra: a distância de **1 traste** (1 casa).
2. **Tom (T):** Corresponde à soma de 2 semitons.
   * No violão/guitarra: distância de **2 trastes** (2 casas).

#### Os Semitons Naturais
Entre a maioria das notas naturais há 1 Tom de distância, **exceto em dois pontos fundamentais**:
* **E – F** (Mi – Fá) = 1 Semitom (não há tecla preta entre eles!)
* **B – C** (Si – Dó) = 1 Semitom (não há tecla preta entre eles!)
    `,
    keyTakeaways: [
      '1 Tom (T) = 2 Semitons (ST).',
      'Entre E e F, e entre B e C, a distância é naturalmente de apenas 1 Semitom.',
      'Entre todas as outras notas naturais contíguas (C-D, D-E, F-G, G-A, A-B) há 1 Tom.',
    ],
    practicalApplication: {
      instrument: 'Teclado / Fretboard',
      instructions: 'Observe no teclado onde NÃO existem teclas pretas intermediárias: exatamente entre E-F e entre B-C.',
      chordsOrNotes: ['E', 'F', 'B', 'C'],
    },
    exercise: {
      question: 'Qual é a distância natural entre as notas E (Mi) e F (Fá)?',
      options: ['1 Tom', '1 Semitom', '2 Tons', '1 Tom e meio'],
      correctIndex: 1,
      explanation: 'Entre E e F a distância é de apenas 1 semitom natural (meio tom), sem teclas intermediárias.',
    },
  },
  {
    id: 'aula-3',
    moduleNumber: 1,
    moduleTitle: 'Fundamentos Musicais',
    lessonNumber: 3,
    title: 'Escala Cromática e Enarmonia',
    level: 'iniciante',
    estimatedMinutes: 10,
    description: 'Os 12 semitons sucessivos e o conceito de enarmonia (mesmo som, nomes diferentes: C# = Db).',
    content: `
### Os 12 Sons e a Enarmonia
A escala cromática contém todas as 12 notas musicais em sucessão de semitons:
* Ascendente (com sustenidos #): **C – C# – D – D# – E – F – F# – G – G# – A – A# – B – C**
* Descendente (com bemóis b): **C – B – Bb – A – Ab – G – Gb – F – E – Eb – D – Db – C**

#### O que é Enarmonia?
Enarmonia é quando **duas notas têm nomes teóricos diferentes, mas soam na exata mesma frequência**:
* C# (Dó sustenido) é enarmônico de Db (Ré bemol)
* F# (Fá sustenido) é enarmônico de Gb (Sol bemol)
* D# é enarmônico de Eb
* G# é enarmônico de Ab
* A# é enarmônico de Bb
    `,
    keyTakeaways: [
      'Sustenido (#) sobe 1 semitom; Bemol (b) desce 1 semitom.',
      'Enarmonia: mesmo som físico, nomes teóricos distintos conforme a tonalidade.',
      'A escala cromática é formada exclusivamente por intervalos de 1 semitom.',
    ],
    practicalApplication: {
      instrument: 'Instrumento',
      instructions: 'Toque casa a casa do traste 0 ao 12 no violão, ou tecla a tecla no piano: você ouvirá a escala cromática completa.',
      chordsOrNotes: ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'],
    },
    exercise: {
      question: 'Qual é o nome enarmônico da nota F# (Fá sustenido)?',
      options: ['Gb (Sol bemol)', 'E# (Mi sustenido)', 'Ab (Lá bemol)', 'G# (Sol sustenido)'],
      correctIndex: 0,
      explanation: 'Gb e F# representam a mesma frequência física na escala temperada.',
    },
  },
  {
    id: 'aula-4',
    moduleNumber: 1,
    moduleTitle: 'Fundamentos Musicais',
    lessonNumber: 4,
    title: 'Intervalos Musicais: O DNA da Harmonia',
    level: 'iniciante',
    estimatedMinutes: 12,
    description: 'Segundas, terças, quartas, quintas, sextas e sétimas (maiores, menores, justas e diminutas).',
    content: `
### O que é um Intervalo?
Intervalo é a distância sonora entre duas notas tocadas sucessiva ou simultaneamente.

#### Tabela de Intervalos a partir da Tônica:
* **2ª Menor (2m):** 1 Semitom (Ex: C -> Db)
* **2ª Maior (2M):** 1 Tom / 2 Semitons (Ex: C -> D)
* **3ª Menor (3m):** 1 Tom e meio / 3 Semitons (Ex: C -> Eb) — Define o caráter MENOR!
* **3ª Maior (3M):** 2 Tons / 4 Semitons (Ex: C -> E) — Define o caráter MAIOR!
* **4ª Justa (4J):** 2 Tons e meio / 5 Semitons (Ex: C -> F)
* **Trítono (4A / 5dim):** 3 Tons / 6 Semitons (Ex: C -> F# ou B -> F) — Pura tensão!
* **5ª Justa (5J):** 3 Tons e meio / 7 Semitons (Ex: C -> G) — Estabilidade e força.
* **6ª Maior (6M):** 4 Tons e meio / 9 Semitons (Ex: C -> A)
* **7ª Menor (7m):** 5 Tons / 10 Semitons (Ex: C -> Bb) — Presente nos acordes dominantes!
* **7ª Maior (7M):** 5 Tons e meio / 11 Semitons (Ex: C -> B) — Doce e sofisticada.
    `,
    keyTakeaways: [
      'A 3ª é a nota que define se o acorde é maior (3M) ou menor (3m).',
      'A 5ª justa (3.5 tons) confere base e solidez aos acordes.',
      'O trítono (3 tons) é a força motriz que faz a progressão 2-5-1 resolver na tônica.',
    ],
    practicalApplication: {
      instrument: 'Piano e Violão',
      instructions: 'Toque C junto com E (3ª Maior, som alegre). Em seguida toque C junto com Eb (3ª Menor, som melancólico). Sinta a diferença imediata na emoção.',
      chordsOrNotes: ['C', 'E', 'Eb', 'G'],
    },
    exercise: {
      question: 'Quantos semitons existem no intervalo de 3ª Maior?',
      options: ['2 Semitons', '3 Semitons', '4 Semitons (2 Tons)', '5 Semitons'],
      correctIndex: 2,
      explanation: 'A 3ª Maior tem exatamente 4 semitons (2 tons inteiros), por exemplo de C até E.',
    },
  },
  {
    id: 'aula-5',
    moduleNumber: 1,
    moduleTitle: 'Fundamentos Musicais',
    lessonNumber: 5,
    title: 'Graus da Escala e Numeração Romana',
    level: 'iniciante',
    estimatedMinutes: 10,
    description: 'Identificação dos graus de I a VII e os nomes tradicionais de cada grau.',
    content: `
### Por que usar Números Romanos?
Na música, tonalidades mudam o tempo todo, mas **a relação entre as notas permanece constante**.
Usamos numeração romana para analisar músicas de forma universal:
* **Grau I:** Tônica (nota central que dá nome ao tom)
* **Grau II:** Supertônica
* **Grau III:** Mediante
* **Grau IV:** Subdominante
* **Grau V:** Dominante (a força motriz de tensão)
* **Grau VI:** Sobredominante (relativa menor)
* **Grau VII:** Sensível (a meio tom da tônica, com atração irresistível por ela)

Na escala de Dó Maior:
* I = C | II = D | III = E | IV = F | V = G | VI = A | VII = B
    `,
    keyTakeaways: [
      'Números romanos representam posições funcionais independentes do tom.',
      'Grau I = Tônica, Grau IV = Subdominante, Grau V = Dominante.',
      'Grau VII é a Sensível, que resolve naturalmente meio tom acima no Grau I.',
    ],
    practicalApplication: {
      instrument: 'Teoria Aplicada',
      instructions: 'Pense na escala de G: I = G, II = A, III = B, IV = C, V = D, VI = E, VII = F#.',
      chordsOrNotes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
    },
    exercise: {
      question: 'Qual é o grau V (Dominante) na tonalidade de C Maior?',
      options: ['F (Fá)', 'G (Sol)', 'D (Ré)', 'A (Lá)'],
      correctIndex: 1,
      explanation: 'Contando a partir de C (I), D (II), E (III), F (IV), o quinto grau é G (V).',
    },
  },

  // MÓDULO 2: A ESCALA MAIOR
  {
    id: 'aula-6',
    moduleNumber: 2,
    moduleTitle: 'A Escala Maior',
    lessonNumber: 6,
    title: 'A Fórmula Mágica da Escala Maior: T – T – ST – T – T – T – ST',
    level: 'iniciante',
    estimatedMinutes: 12,
    description: 'A fórmula intervalar imutável que constrói a escala maior em qualquer uma das 12 tonalidades.',
    content: `
### A Estrutura Universal da Escala Maior
Toda escala maior obedece rigidamente à sequência:
**TOM – TOM – SEMITOM – TOM – TOM – TOM – SEMITOM**

Vamos aplicar a partir da nota **C**:
* C + Tom = **D**
* D + Tom = **E**
* E + Semitom = **F** (semitom natural!)
* F + Tom = **G**
* G + Tom = **A**
* A + Tom = **B**
* B + Semitom = **C** (semitom natural!)

Resultado: **C – D – E – F – G – A – B – C** (sem nenhum sustenido ou bemol!)
    `,
    keyTakeaways: [
      'Fórmula da Escala Maior: T – T – ST – T – T – T – ST.',
      'Os semitons ocorrem sempre entre os graus III-IV e VII-I.',
      'Aplicando essa regra a partir de qualquer uma das 12 notas, você obtém a escala maior perfeita.',
    ],
    practicalApplication: {
      instrument: 'Instrumento',
      instructions: 'Construa a escala de Ré (D) mentalmente: D + T = E, E + T = F# (precisa de sustenido!), F# + ST = G, G + T = A, A + T = B, B + T = C#, C# + ST = D.',
      chordsOrNotes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
    },
    exercise: {
      question: 'Onde ocorrem os semitons na fórmula da Escala Maior?',
      options: ['Entre I-II e IV-V', 'Entre III-IV e VII-I', 'Entre II-III e V-VI', 'Apenas no final'],
      correctIndex: 1,
      explanation: 'Os semitons na escala maior ficam exatamente entre o 3º e 4º graus, e entre o 7º e 8º (I) graus.',
    },
  },
  {
    id: 'aula-7',
    moduleNumber: 2,
    moduleTitle: 'A Escala Maior',
    lessonNumber: 7,
    title: 'Construindo Escalas com Sustenidos e Bemóis',
    level: 'intermediario',
    estimatedMinutes: 12,
    description: 'Como surgem os acidentes nas escalas de G, D, A, E e F, Bb, Eb.',
    content: `
### Por que precisamos de acidentes?
Quando começamos uma escala por outra nota que não C, para manter a fórmula **T-T-ST-T-T-T-ST**, somos forçados a alterar algumas notas:

#### Exemplo em Sol (G):
* G + T = A
* A + T = B
* B + ST = C
* C + T = D
* D + T = E
* E + T = **F#** (de E até F seria semitom, então subimos o F para F# para obter 1 tom!)
* F# + ST = G
Escala de G Maior: **G – A – B – C – D – E – F#** (1 sustenido).

#### Exemplo em Fá (F):
* F + T = G
* G + T = A
* A + ST = **Bb** (de A até B seria 1 tom inteiro, precisamos de semitom, então abaixamos para Bb!)
* Bb + T = C
* C + T = D
* D + T = E
* E + ST = F
Escala de F Maior: **F – G – A – Bb – C – D – E** (1 bemol).
    `,
    keyTakeaways: [
      'G Maior possui 1 sustenido (F#).',
      'F Maior possui 1 bemol (Bb).',
      'A armadura de clave indica no início da partitura quais notas são alteradas durante toda a peça.',
    ],
    practicalApplication: {
      instrument: 'Piano e Violão',
      instructions: 'Toque a escala de G usando a tecla preta F#. Sinta como o F# atua como sensível puxando para o G.',
      chordsOrNotes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
    },
    exercise: {
      question: 'Qual é o acidente presente na escala de Fá Maior (F)?',
      options: ['F#', 'Bb', 'C#', 'Eb'],
      correctIndex: 1,
      explanation: 'A escala de Fá Maior possui 1 bemol: Bb (Si bemol).',
    },
  },

  // MÓDULO 3: FORMAÇÃO DE ACORDES
  {
    id: 'aula-8',
    moduleNumber: 3,
    moduleTitle: 'Formação de Acordes',
    lessonNumber: 8,
    title: 'A Tríade Maior: 1 – 3 – 5',
    level: 'iniciante',
    estimatedMinutes: 10,
    description: 'A fundação da harmonia: Tônica, Terça Maior e Quinta Justa.',
    content: `
### Como nasce uma Tríade?
Um acorde é formado pelo empilhamento de terças a partir de uma nota base (fundamental ou tônica).
A **Tríade Maior** é composta por:
* **1 (Tônica):** Define a nota fundamental.
* **3 (Terça Maior):** 2 tons acima da tônica (4 semitons).
* **5 (Quinta Justa):** 3 tons e meio acima da tônica (7 semitons).

#### Exemplos práticos:
* **C:** C (tônica) + E (3M) + G (5J)
* **G:** G (tônica) + B (3M) + D (5J)
* **F:** F (tônica) + A (3M) + C (5J)
* **D:** D (tônica) + F# (3M) + A (5J)
    `,
    keyTakeaways: [
      'Fórmula da Tríade Maior: 1 – 3 – 5.',
      'A distância de 1 para 3 é de 2 tons (terça maior); de 3 para 5 é de 1.5 tons (terça menor).',
      'A sonoridade é percebida universalmente como brilhante, consonante e afirmativa.',
    ],
    practicalApplication: {
      instrument: 'Piano e Violão',
      instructions: 'Monte o acorde de C: aperte C, E e G simultaneamente. Ouça a pureza e estabilidade da quinta justa com a terça maior.',
      chordsOrNotes: ['C', 'E', 'G'],
    },
    exercise: {
      question: 'Quais são as três notas que formam o acorde de C (Dó Maior)?',
      options: ['C – D – E', 'C – E – G', 'C – F – G', 'C – E – A'],
      correctIndex: 1,
      explanation: 'A tríade de Dó Maior é composta por C (tônica), E (3ª Maior) e G (5ª Justa).',
    },
  },
  {
    id: 'aula-9',
    moduleNumber: 3,
    moduleTitle: 'Formação de Acordes',
    lessonNumber: 9,
    title: 'A Tríade Menor: 1 – b3 – 5',
    level: 'iniciante',
    estimatedMinutes: 10,
    description: 'O papel decisivo da terça menor na atmosfera emotiva e introspectiva.',
    content: `
### A Sutileza de Meio Tom
A diferença entre um acorde maior e um acorde menor é de apenas **um semitom** na terça!
A **Tríade Menor** é composta por:
* **1 (Tônica)**
* **b3 (Terça Menor):** 1 tom e meio acima da tônica (3 semitons).
* **5 (Quinta Justa):** 3 tons e meio acima da tônica (7 semitons).

#### Comparação direta:
* **C Maior:** C – E – G
* **Cm (Dó Menor):** C – **Eb** – G
* **D Maior:** D – F# – A
* **Dm (Ré Menor):** D – **F** – A
* **A Maior:** A – C# – E
* **Am (Lá Menor):** A – **C** – E
    `,
    keyTakeaways: [
      'Fórmula da Tríade Menor: 1 – b3 – 5.',
      'A terça menor está a 3 semitons da tônica.',
      'A quinta permanece justa (5J = 7 semitons) em ambos os acordes maior e menor.',
    ],
    practicalApplication: {
      instrument: 'Instrumento',
      instructions: 'Toque Dm (D – F – A). Depois suba o F para F# tocando D Maior. Perceba a mudança imediata de humor harmônico.',
      chordsOrNotes: ['D', 'F', 'A', 'F#'],
    },
    exercise: {
      question: 'Qual fórmula intervalar define a Tríade Menor?',
      options: ['1 – 3 – 5', '1 – b3 – 5', '1 – b3 – b5', '1 – 3 – #5'],
      correctIndex: 1,
      explanation: 'A tríade menor é formada por 1 (tônica), b3 (terça menor) e 5 (quinta justa).',
    },
  },
  {
    id: 'aula-10',
    moduleNumber: 3,
    moduleTitle: 'Formação de Acordes',
    lessonNumber: 10,
    title: 'A Tríade Diminuta: 1 – b3 – b5',
    level: 'intermediario',
    estimatedMinutes: 10,
    description: 'Tensão condensada: a tríade formada por duas terças menores empilhadas e quinta diminuta.',
    content: `
### Dupla Contração e Instabilidade
Enquanto tríades maiores e menores possuem quinta justa, a **Tríade Diminuta (°)** tem:
* **1 (Tônica)**
* **b3 (Terça Menor):** 3 semitons
* **b5 (Quinta Diminuta ou Trítono):** 6 semitons (3 tons inteiros)

#### O Trítono Interno
A distância entre a tônica e a quinta diminuta é exatamente o **trítono**! Isso gera instabilidade e uma forte necessidade de resolução.

#### Exemplo clássico no VII grau de C:
* **B° (Si Diminuto):**
  * Tônica: **B**
  * Terça menor: **D**
  * Quinta diminuta: **F**
Observe o intervalo B até F: são 3 tons inteiros (trítono puro!).
    `,
    keyTakeaways: [
      'Fórmula da Tríade Diminuta: 1 – b3 – b5.',
      'Contém o trítono entre a tônica e a quinta.',
      'Aparece naturalmente no VII grau do Campo Harmônico Maior e no II grau do Campo Harmônico Menor.',
    ],
    practicalApplication: {
      instrument: 'Piano e Violão',
      instructions: 'Toque o acorde B° (B-D-F) e em seguida resolva tocando C (C-E-G). Note o alívio imediato da tensão.',
      chordsOrNotes: ['B', 'D', 'F', 'C', 'E', 'G'],
    },
    exercise: {
      question: 'Quais notas formam a tríade de B° (Si diminuto)?',
      options: ['B – D# – F#', 'B – D – F#', 'B – D – F', 'B – Eb – Gb'],
      correctIndex: 2,
      explanation: 'B° é formado por B (tônica), D (terça menor) e F (quinta diminuta).',
    },
  },

  // MÓDULO 4: TÉTRADES E CAMPO HARMÔNICO
  {
    id: 'aula-11',
    moduleNumber: 4,
    moduleTitle: 'Tétrades e Campo Harmônico',
    lessonNumber: 11,
    title: 'As 4 Tétrades Essenciais: Maj7, m7, 7 e m7(b5)',
    level: 'intermediario',
    estimatedMinutes: 14,
    description: 'Adicionando a 7ª para obter o som clássico do Jazz, Bossa Nova, MPB e Neo-Soul.',
    content: `
### Da Tríade à Tétrade (Acorde de 4 Notas)
Adicionar a 7ª nota ao acorde eleva a sofisticação da harmonia. Existem 4 tipos fundamentais no campo harmônico maior:

1. **Maj7 (Maior com 7ª Maior):**
   * Fórmula: **1 – 3 – 5 – 7M**
   * Exemplo: **Cmaj7 = C – E – G – B**
   * Som: Rico, límpido, relaxante.

2. **m7 (Menor com 7ª Menor):**
   * Fórmula: **1 – b3 – 5 – 7m**
   * Exemplo: **Dm7 = D – F – A – C**
   * Som: Nostálgico, macio, veludado.

3. **7 (Dominante com 7ª Menor):**
   * Fórmula: **1 – 3 – 5 – 7m**
   * Exemplo: **G7 = G – B – D – F**
   * Som: Tenso, instável, implora por resolução!

4. **m7(b5) (Meio-Diminuto):**
   * Fórmula: **1 – b3 – b5 – 7m**
   * Exemplo: **Bm7(b5) = B – D – F – A**
   * Som: Dramático, sombrio, elemento-chave do 2-5-1 menor.
    `,
    keyTakeaways: [
      'Maj7 tem 7ª maior (11 semitons).',
      '7 dominante tem tríade maior com 7ª menor (10 semitons), contendo o trítono entre 3ª e 7ª.',
      'm7(b5) possui tríade diminuta com 7ª menor.',
    ],
    practicalApplication: {
      instrument: 'Piano e Violão',
      instructions: 'Toque G7 (G-B-D-F). Repare que entre a 3ª (B) e a 7ª (F) existe um trítono. Agora toque Cmaj7 (C-E-G-B). O B subiu meio tom para C e o F desceu meio tom para E!',
      chordsOrNotes: ['G', 'B', 'D', 'F', 'C', 'E', 'G', 'B'],
    },
    exercise: {
      question: 'Qual é a fórmula do acorde Cmaj7 (Dó maior com sétima maior)?',
      options: ['1 – 3 – 5 – 7m', '1 – 3 – 5 – 7M', '1 – b3 – 5 – 7M', '1 – 3 – b5 – 7M'],
      correctIndex: 1,
      explanation: 'O acorde Maj7 é formado por Tônica (1), Terça Maior (3), Quinta Justa (5) e Sétima Maior (7M).',
    },
  },
  {
    id: 'aula-12',
    moduleNumber: 4,
    moduleTitle: 'Tétrades e Campo Harmônico',
    lessonNumber: 12,
    title: 'O Campo Harmônico Maior Completo em Tétrades',
    level: 'intermediario',
    estimatedMinutes: 15,
    description: 'A tabela mãe da música tonal: os 7 acordes gerados pela escala maior.',
    content: `
### Gerando Acordes a partir da Escala
Quando empilhamos terças diatônicas sobre cada grau da escala de C Maior (C-D-E-F-G-A-B), geramos 7 acordes fixos:

| Grau | Acorde em C | Qualidade | Função |
|---|---|---|---|
| **I** | **Cmaj7** | Maior com 7ª Maior | **Tônica** (Repouso) |
| **II** | **Dm7** | Menor com 7ª | **Subdominante** (Afastamento) |
| **III** | **Em7** | Menor com 7ª | **Tônica** (Suave) |
| **IV** | **Fmaj7** | Maior com 7ª Maior | **Subdominante** (Movimento) |
| **V** | **G7** | Dominante (7ª menor) | **Dominante** (Tensão máxima) |
| **VI** | **Am7** | Menor com 7ª | **Tônica** (Relativa Menor) |
| **VII** | **Bm7(b5)** | Meio-Diminuto | **Dominante** (Sensível) |

Essa mesma fórmula vale para **qualquer tom**! Em G Maior:
Gmaj7 – Am7 – Bm7 – Cmaj7 – D7 – Em7 – F#m7(b5).
    `,
    keyTakeaways: [
      'Graus I e IV são sempre Maj7.',
      'Graus II, III e VI são sempre m7.',
      'Grau V é o único acorde dominante (7) puro do campo harmônico maior.',
      'Grau VII é sempre m7(b5).',
    ],
    practicalApplication: {
      instrument: 'Instrumento',
      instructions: 'Toque a sequência II - V - I em C: Dm7 -> G7 -> Cmaj7. Ouça como essa cadência soa completa e definitiva.',
      chordsOrNotes: ['Dm7', 'G7', 'Cmaj7'],
    },
    exercise: {
      question: 'No Campo Harmônico Maior, que tipo de acorde é gerado no grau V?',
      options: ['Menor com 7ª (m7)', 'Maior com 7ª Maior (maj7)', 'Dominante com 7ª (7)', 'Meio-diminuto (m7b5)'],
      correctIndex: 2,
      explanation: 'O grau V é o acorde Dominante (7), responsável pela preparação e tensão que resolve no I.',
    },
  },
  {
    id: 'aula-13',
    moduleNumber: 4,
    moduleTitle: 'Tétrades e Campo Harmônico',
    lessonNumber: 13,
    title: 'O Campo Harmônico Menor e o Surgimento do V7',
    level: 'avancado',
    estimatedMinutes: 14,
    description: 'Entenda por que a Menor Harmônica foi inventada para criar o V7 e viabilizar a cadência dominante.',
    content: `
### O Problema da Menor Natural
Na escala menor natural de Lá (A menor: A-B-C-D-E-F-G), o quinto grau é **Em7** (um acorde menor!).
Como o Em7 não possui a sensível (G#) nem o trítono tenso, ele não tem força para resolver com determinação em Am.

### A Solução dos Mestres: Menor Harmônica
Para devolver a tensão ao dominante, os compositores elevaram o 7º grau em meio tom (G vira **G#**):
* Escala: **A – B – C – D – E – F – G#**
* O acorde do V grau agora tem G# como terça maior: **E – G# – B – D = E7!**

Com isso, nasce o poderoso **2-5-1 Menor**:
* **Bm7(b5)** (II grau) -> **E7(b9)** (V grau) -> **Am7** ou **Am6** (I grau)!
    `,
    keyTakeaways: [
      'A menor harmônica eleva o 7º grau para criar a sensível e transformar o Vm em V7 dominante.',
      'O 2-5-1 menor é formado por: iim7(b5) – V7(b9) – Im7.',
      'O acorde do grau VII na menor harmônica é um Diminuto com 7ª Diminuta (°7).',
    ],
    practicalApplication: {
      instrument: 'Piano e Violão',
      instructions: 'Toque Bm7(b5) -> E7 -> Am. Compare com Bm7(b5) -> Em7 -> Am. Sinta como o E7 fecha o ciclo com vigor incomparável.',
      chordsOrNotes: ['B', 'D', 'F', 'A', 'E', 'G#', 'B', 'D', 'A', 'C', 'E', 'G'],
    },
    exercise: {
      question: 'Qual é o acorde do grau II no campo harmônico menor harmônico?',
      options: ['m7', 'maj7', 'm7(b5) meio-diminuto', '7 dominante'],
      correctIndex: 2,
      explanation: 'No campo harmônico menor, o grau II é meio-diminuto (m7b5), exemplo: Bm7(b5) em Lá menor.',
    },
  },

  // MÓDULO 5: FUNÇÕES HARMÔNICAS E O UNIVERSO DO 2-5-1
  {
    id: 'aula-14',
    moduleNumber: 5,
    moduleTitle: 'Funções Harmônicas & O 2-5-1',
    lessonNumber: 14,
    title: 'As 3 Grandes Funções Harmônicas: Tônica, Subdominante e Dominante',
    level: 'intermediario',
    estimatedMinutes: 12,
    description: 'Como os acordes exercem papéis psicológicos de repouso, afastamento e tensão.',
    content: `
### A Física e Psicologia da Música Tonal
Toda progressão musical conta uma história através de 3 sensações:

1. **TÔNICA (Repouso / Lar / Chegada):**
   * Sensação de paz, resolução e estabilidade.
   * Acordes primários: **I (Cmaj7)**
   * Substitutos / Acordes secundários: **VI (Am7)** e **III (Em7)**

2. **SUBDOMINANTE (Afastamento / Jornada / Preparação):**
   * Sensação de movimento para longe da tônica, abertura.
   * Acordes primários: **IV (Fmaj7)**
   * Substitutos: **II (Dm7)** (o segundo grau é o rei da preparação!)

3. **DOMINANTE (Tensão / Perigo / Desejo de Resolução):**
   * Sensação de instabilidade máxima que exige retorno ao repouso.
   * Acordes primários: **V (G7)**
   * Substitutos: **VII (Bm7b5)**

#### O Ciclo Fundamental:
**TÔNICA → SUBDOMINANTE → DOMINANTE → TÔNICA**
    `,
    keyTakeaways: [
      'Tônica = Repouso (I, III, VI).',
      'Subdominante = Movimento/Preparação (II, IV).',
      'Dominante = Tensão máxima (V, VII).',
    ],
    practicalApplication: {
      instrument: 'Instrumento',
      instructions: 'Toque: Cmaj7 (repouso) -> Dm7 (preparação) -> G7 (tensão no ar) -> Cmaj7 (alívio do repouso).',
      chordsOrNotes: ['Cmaj7', 'Dm7', 'G7'],
    },
    exercise: {
      question: 'Quais graus pertencem à família da Tônica no Campo Harmônico Maior?',
      options: ['I, IV e V', 'II e IV', 'I, III e VI', 'V e VII'],
      correctIndex: 2,
      explanation: 'Os graus I, III e VI compartilham notas comuns com a tônica e exercem função de repouso.',
    },
  },
  {
    id: 'aula-15',
    moduleNumber: 5,
    moduleTitle: 'Funções Harmônicas & O 2-5-1',
    lessonNumber: 15,
    title: 'O Fenômeno da Progressão II – V – I',
    level: 'avancado',
    estimatedMinutes: 15,
    description: 'A progressão mais famosa e estudada da história da música moderna e do Jazz.',
    content: `
### Por que o 2-5-1 é tão perfeito?
O **II – V – I** é a síntese mais refinada das três funções harmônicas:
* **II (Dm7):** Subdominante -> Prepara o caminho.
* **V (G7):** Dominante -> Cria o ápice da tensão através do trítono.
* **I (Cmaj7):** Tônica -> Proporciona a resolução mais gratificante ao ouvido humano.

#### O Salto de Quartas no Baixo (Ciclo de Quintas):
Observe o movimento dos baixos fundamentais:
* De D para G: Salto de 4ª justa ascendente (ou 5ª descendente).
* De G para C: Salto de 4ª justa ascendente.
Esse movimento de quartas no baixo é a atração gravitacional acústica mais forte da música tonal ocidental!
    `,
    keyTakeaways: [
      'II – V – I reúne Preparação (II) -> Tensão (V) -> Resolução (I).',
      'Os baixos caminham em intervalos de 4ª justa ascendente (D -> G -> C).',
      'É a pedra angular do Jazz, Bossa Nova, MPB e Choro.',
    ],
    practicalApplication: {
      instrument: 'Piano e Violão',
      instructions: 'Pratique o 2-5-1 em Dó: Dm7 -> G7 -> Cmaj7. Depois transponha para F: Gm7 -> C7 -> Fmaj7. Repare que a sensação auditiva é exatamente a mesma!',
      chordsOrNotes: ['Dm7', 'G7', 'Cmaj7', 'Gm7', 'C7', 'Fmaj7'],
    },
    exercise: {
      question: 'Qual é a progressão II-V-I na tonalidade de Sol Maior (G)?',
      options: ['Dm7 – G7 – Cmaj7', 'Am7 – D7 – Gmaj7', 'Em7 – A7 – Dmaj7', 'Bm7 – E7 – Amaj7'],
      correctIndex: 1,
      explanation: 'Em Sol Maior, o II é Am7, o V é D7 e o I é Gmaj7.',
    },
  },
  {
    id: 'aula-16',
    moduleNumber: 5,
    moduleTitle: 'Funções Harmônicas & O 2-5-1',
    lessonNumber: 16,
    title: 'Condução de Vozes e Notas Guia (3ª e 7ª)',
    level: 'avancado',
    estimatedMinutes: 16,
    description: 'Como tocar como os mestres: a mágica da 7ª descendo para a 3ª enquanto a outra nota permanece.',
    content: `
### O Segredo dos Pianistas e Violonistas Profissionais
Você não precisa tocar acordes cheios saltando de um lado para o outro.
O esqueleto harmônico de qualquer tétrade reside em apenas duas notas: **A 3ª e a 7ª** (chamadas de **Notas Guia**).

Veja o milagre da condução de vozes no 2-5-1 em Dó:
1. **Dm7:**
   * 3ª = **F**
   * 7ª = **C**
2. **G7:**
   * O **F** continua parado (vira a 7ª de G7!).
   * O **C** desce apenas **meio tom** e vira **B** (a 3ª de G7!).
3. **Cmaj7:**
   * O **B** continua parado (vira a 7ª de Cmaj7!).
   * O **F** desce apenas **meio tom** e vira **E** (a 3ª de Cmaj7!).

Ou seja: **uma nota se mantém enquanto a outra desce meio tom!** Essa suavidade cromática é a razão pela qual o II-V-I soa tão sofisticado.
    `,
    keyTakeaways: [
      'As notas guia são a 3ª e a 7ª de cada acorde.',
      'Na transição de II para V: a 7ª desce meio tom para a 3ª do próximo acorde, e a 3ª vira a 7ª.',
      'Na transição de V para I: a 7ª desce meio tom para a 3ª da tônica, e a 3ª vira a 7ª.',
    ],
    practicalApplication: {
      instrument: 'Piano / Teclado',
      instructions: 'Toque com a mão esquerda o baixo (D, depois G, depois C). Na mão direita, toque apenas as duas notas: [F e C], depois [F e B], depois [E e B]. Repare na perfeição do som!',
      chordsOrNotes: ['D', 'F', 'C', 'G', 'B', 'E'],
    },
    exercise: {
      question: 'Ao passar do acorde Dm7 para o acorde G7, o que acontece com a nota C (7ª de Dm7)?',
      options: ['Sobe um tom para D', 'Desce meio tom para B (3ª de G7)', 'Desce um tom para Bb', 'Fica parada'],
      correctIndex: 1,
      explanation: 'A 7ª de Dm7 (C) desce suavemente meio tom para se tornar a 3ª de G7 (B).',
    },
  },
  {
    id: 'aula-17',
    moduleNumber: 5,
    moduleTitle: 'Funções Harmônicas & O 2-5-1',
    lessonNumber: 17,
    title: 'Dominantes Secundários: V/V e Além',
    level: 'avancado',
    estimatedMinutes: 14,
    description: 'Como transformar qualquer grau em alvo de um acorde dominante para enriquecer progressões.',
    content: `
### Dominante de Quem?
No campo harmônico, o grau V é o dominante oficial da tônica.
Mas e se quisermos preparar a chegada de **outro grau** com a mesma intensidade de um dominante?
Isso é um **Dominante Secundário**!

#### O Dominante do Dominante (V/V):
Em C Maior, o dominante é **G7**.
Qual é o dominante de G? É **D7**!
Se tocarmos:
**D7 → G7 → Cmaj7**
O D7 não pertence ao campo harmônico de C (pois tem F# em vez de F), mas atua temporariamente como dominante secundário de G7.
Isso cria uma corrente harmônica irresistível: **V/V → V → I**.
    `,
    keyTakeaways: [
      'Dominante secundário é um acorde maior com 7ª menor (7) que prepara qualquer grau que não seja o I.',
      'O V/V prepara o grau V (Ex em C: D7 preparando G7).',
      'O V/II prepara o grau II (Ex em C: A7 preparando Dm7).',
    ],
    practicalApplication: {
      instrument: 'Instrumento',
      instructions: 'Toque: Cmaj7 -> A7 (V/II) -> Dm7 (II) -> G7 (V) -> Cmaj7 (I). Sinta a cor jazzística e elegante trazida pelo A7.',
      chordsOrNotes: ['Cmaj7', 'A7', 'Dm7', 'G7'],
    },
    exercise: {
      question: 'Na tonalidade de C Maior, qual acorde é o V/V (dominante do dominante)?',
      options: ['Dm7', 'D7', 'Em7', 'A7'],
      correctIndex: 1,
      explanation: 'Em C, o dominante é G. O dominante de G é D7 (D maior com 7ª). Logo, D7 é o V/V.',
    },
  },
  {
    id: 'aula-18',
    moduleNumber: 5,
    moduleTitle: 'Funções Harmônicas & O 2-5-1',
    lessonNumber: 18,
    title: 'O Turnaround: I – VI – II – V',
    level: 'intermediario',
    estimatedMinutes: 12,
    description: 'A progressão circular mais usada para fechar e reiniciar seções musicais em loop.',
    content: `
### O Ciclo que Nunca Morre
O **Turnaround** (virada) é uma fórmula clássica de 4 acordes que conduz com naturalidade a música de volta ao início:
* **I (Cmaj7):** Tônica
* **VI (Am7 ou A7):** Tônica secundária ou dominante de preparação
* **II (Dm7):** Subdominante
* **V (G7):** Dominante resolutivo

No Jazz e Bossa Nova, é frequente substituir o VI menor (Am7) por um dominante secundário (A7), gerando:
**Cmaj7 → A7 → Dm7 → G7 → [volta ao Cmaj7]**
    `,
    keyTakeaways: [
      'Turnaround padrão: I – VI – II – V.',
      'Pode usar VI menor (Am7) ou dominante secundário (A7).',
      'Permite tocar em loop contínuo para improvisação e prática.',
    ],
    practicalApplication: {
      instrument: 'Instrumento',
      instructions: 'Toque em ritmo constante: 2 tempos de Cmaj7, 2 tempos de A7, 2 tempos de Dm7, 2 tempos de G7. Repita várias vezes.',
      chordsOrNotes: ['Cmaj7', 'A7', 'Dm7', 'G7'],
    },
    exercise: {
      question: 'Quais são os 4 graus que compõem o tradicional Turnaround?',
      options: ['I – IV – V – I', 'I – VI – II – V', 'II – V – I – IV', 'I – III – IV – V'],
      correctIndex: 1,
      explanation: 'O Turnaround é definido pelos graus I – VI – II – V.',
    },
  },
];
