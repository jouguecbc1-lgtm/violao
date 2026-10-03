import { ProgressionTemplate } from '../types';

export const PROGRESSION_TEMPLATES: ProgressionTemplate[] = [
  // BÁSICAS
  {
    id: 'prog-1',
    name: 'Cadência Perfeita Triádica (I – IV – V – I)',
    category: 'Básicas',
    romanNumerals: ['I', 'IV', 'V', 'I'],
    description: 'A fundação da harmonia tonal clássica, presente do folclore ao rock clássico.',
    explanation:
      'Apresenta com clareza cristalina as 3 funções básicas: Tônica (repouso) -> Subdominante (afastamento) -> Dominante (tensão) -> Tônica (resolução final).',
    exampleKey: 'C',
    exampleChords: ['C', 'F', 'G', 'C'],
    audioChords: ['C', 'F', 'G', 'C'],
  },
  {
    id: 'prog-2',
    name: 'A Progressão de 4 Acordes Pop (I – V – vi – IV)',
    category: 'Pop',
    romanNumerals: ['I', 'V', 'vi', 'IV'],
    description: 'A sequência mais bem-sucedida da história da música pop mundial (Let It Be, Don\'t Stop Believin\').',
    explanation:
      'Inicia no I (repouso), sobe para V (tensão leve), mergulha no vi (relativa menor melancólica) e culmina no IV (esperança que prepara o reinício).',
    exampleKey: 'C',
    exampleChords: ['C', 'G', 'Am', 'F'],
    audioChords: ['C', 'G', 'Am', 'F'],
  },
  {
    id: 'prog-3',
    name: 'Doo-Wop dos Anos 50 (I – vi – IV – V)',
    category: 'Básicas',
    romanNumerals: ['I', 'vi', 'IV', 'V'],
    description: 'A clássica progressão nostálgica dos anos 50 e baladas românticas (Stand By Me).',
    explanation:
      'Tônica -> Relativa Menor -> Subdominante -> Dominante. Cria uma circularidade perfeita que convida à dança suave.',
    exampleKey: 'C',
    exampleChords: ['C', 'Am', 'F', 'G'],
    audioChords: ['C', 'Am', 'F', 'G'],
  },

  // JAZZ
  {
    id: 'prog-4',
    name: 'O Sagrado II – V – I Maior',
    category: 'Jazz',
    romanNumerals: ['ii7', 'V7', 'Imaj7'],
    description: 'A pedra angular do Jazz americano e da harmonia moderna mundial.',
    explanation:
      'Preparação subdominante com o ii7, tensão máxima do trítono no V7, e resolução elegante e aberta no Imaj7.',
    exampleKey: 'C',
    exampleChords: ['Dm7', 'G7', 'Cmaj7'],
    audioChords: ['Dm7', 'G7', 'Cmaj7'],
  },
  {
    id: 'prog-5',
    name: 'O Sagrado II – V – I Menor',
    category: 'Jazz',
    romanNumerals: ['iim7(b5)', 'V7(b9)', 'im7'],
    description: 'A versão sombria, dramática e profunda da cadência 2-5-1 (Autumn Leaves, Blue Bossa).',
    explanation:
      'Utiliza o acorde meio-diminuto no II grau e um dominante alterado (com nona menor) no V grau para resolver em tom menor.',
    exampleKey: 'A',
    exampleChords: ['Bm7(b5)', 'E7', 'Am7'],
    audioChords: ['Bm7(b5)', 'E7', 'Am7'],
  },
  {
    id: 'prog-6',
    name: 'Standard Turnaround (I – VI – II – V)',
    category: 'Jazz',
    romanNumerals: ['Imaj7', 'VI7', 'iim7', 'V7'],
    description: 'Usado para fechar o refrão e girar de volta para o topo do solo.',
    explanation:
      'Transforma o VI grau em dominante secundário (VI7), que prepara o iim7 com força redobrada.',
    exampleKey: 'C',
    exampleChords: ['Cmaj7', 'A7', 'Dm7', 'G7'],
    audioChords: ['Cmaj7', 'A7', 'Dm7', 'G7'],
  },
  {
    id: 'prog-7',
    name: 'Ciclo Expandido de Quartas (iii – vi – ii – V – I)',
    category: 'Jazz',
    romanNumerals: ['iiim7', 'vim7', 'iim7', 'V7', 'Imaj7'],
    description: 'Cadeia harmônica descendente por ciclo de quintas (ou quartas ascendentes).',
    explanation:
      'Em C: Em7 -> Am7 -> Dm7 -> G7 -> Cmaj7. Cada acorde dista uma quarta justa do próximo.',
    exampleKey: 'C',
    exampleChords: ['Em7', 'Am7', 'Dm7', 'G7', 'Cmaj7'],
    audioChords: ['Em7', 'Am7', 'Dm7', 'G7', 'Cmaj7'],
  },

  // GOSPEL & SOUL
  {
    id: 'prog-8',
    name: 'Gospel Passing Chord (I – IV – #IV° – V)',
    category: 'Gospel',
    romanNumerals: ['I', 'IV', '#IV°', 'V'],
    description: 'A clássica transição com acorde diminuto cromático de passagem do IV para o V.',
    explanation:
      'O acorde #IV° (em C: F#°) funciona como dominante disfarçado de G, criando uma linha de baixo ascendente suave: F -> F# -> G.',
    exampleKey: 'C',
    exampleChords: ['Cmaj7', 'Fmaj7', 'F#°7', 'G7'],
    audioChords: ['Cmaj7', 'Fmaj7', 'F#°7', 'G7'],
  },
  {
    id: 'prog-9',
    name: 'Cadência Neosoul (vi – ii – V – I)',
    category: 'Gospel',
    romanNumerals: ['vim7', 'iim7', 'V7', 'Imaj7'],
    description: 'Sequência envolvente com balanço groove e tensão cadenciada.',
    explanation:
      'Começa na melancolia acolhedora do vi grau e constrói a resolução através do 2-5-1.',
    exampleKey: 'C',
    exampleChords: ['Am7', 'Dm7', 'G7', 'Cmaj7'],
    audioChords: ['Am7', 'Dm7', 'G7', 'Cmaj7'],
  },

  // BOSSA NOVA
  {
    id: 'prog-10',
    name: 'Cadência da Bossa (Imaj7 – II7 – iim7 – V7)',
    category: 'Bossa Nova',
    romanNumerals: ['Imaj7', 'II7', 'iim7', 'V7'],
    description: 'A assinatura harmônica de Tom Jobim e João Gilberto (Garota de Ipanema).',
    explanation:
      'O uso do II7 (D7 em C) com nona e décima primeira traz o brilho do modo lídio dominante antes de cair no Dm7.',
    exampleKey: 'F',
    exampleChords: ['Fmaj7', 'G7', 'Gm7', 'C7'],
    audioChords: ['Fmaj7', 'G7', 'Gm7', 'C7'],
  },
];
