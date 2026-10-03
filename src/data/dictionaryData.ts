export interface DictionaryTerm {
  term: string;
  category: string;
  definition: string;
  example: string;
  practicalApplication: string;
}

export const DICTIONARY_TERMS: DictionaryTerm[] = [
  {
    term: 'Acorde',
    category: 'Harmonia',
    definition: 'A emissão simultânea ou arpejada de três ou mais sons de alturas diferentes, organizados segundo regras intervalares (geralmente terças sobrepostas).',
    example: 'C (Dó, Mi, Sol) ou Cmaj7 (Dó, Mi, Sol, Si).',
    practicalApplication: 'Serve como a base harmônica e ambiência emocional sobre a qual a melodia e o canto se apoiam.',
  },
  {
    term: 'Arpejo',
    category: 'Execução / Técnica',
    definition: 'A execução sucessiva (nota por nota) dos componentes de um acorde, em vez de tocá-los todos de uma só vez.',
    example: 'Tocar C, depois E, depois G, depois B de forma fluida.',
    practicalApplication: 'Fundamental para improvisação, solos melódicos que delineiam a harmonia e dedilhados no violão ou piano.',
  },
  {
    term: 'Cadência',
    category: 'Harmonia',
    definition: 'Sequência conclusiva ou suspensiva de acordes que pontua frases musicais, análoga às vírgulas e pontos finais da linguagem falada.',
    example: 'Cadência Autêntica Perfeita: V7 -> I (Ex: G7 -> C). Cadência Plagal: IV -> I (F -> C).',
    practicalApplication: 'Determina a respiração da música, demarcando finais de estrofes, refrãos e momentos de clímax.',
  },
  {
    term: 'Campo Harmônico',
    category: 'Teoria Fundamental',
    definition: 'O conjunto de acordes gerados exclusivamente a partir das notas de uma determinada escala diatônica, sem acidentes estranhos.',
    example: 'Campo harmônico de Dó Maior: Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7(b5).',
    practicalApplication: 'É o mapa geográfico do compositor e instrumentista. Revela instantaneamente quais acordes soam em harmonia com qualquer melodia.',
  },
  {
    term: 'Dominante',
    category: 'Funções Harmônicas',
    definition: 'O quinto grau (V) da escala diatônica ou o acorde formado sobre ele. Caracteriza-se por alta instabilidade e atração gravitacional irresistível pela tônica.',
    example: 'G7 na tonalidade de Dó Maior.',
    practicalApplication: 'Cria o momento culminante de tensão e expectativa que faz a chegada da tônica soar gloriosa.',
  },
  {
    term: 'Dominante Secundário',
    category: 'Harmonia Avançada',
    definition: 'Um acorde com estrutura de dominante (maior com sétima menor) que não pertence ao tom original, mas é inserido para preparar qualquer outro acorde diatônico que não seja a tônica.',
    example: 'A7 preparando Dm7 na tonalidade de Dó Maior (V/II).',
    practicalApplication: 'Enriquece progressões simples, introduzindo cromatismos jazzísticos e elegância melódica.',
  },
  {
    term: 'Escala',
    category: 'Teoria Fundamental',
    definition: 'Uma sucessão ordenada de notas musicais em ordem ascendente ou descendente, separadas por intervalos específicos de tons e semitons.',
    example: 'Escala Maior (T-T-ST-T-T-T-ST) ou Escala Pentatônica.',
    practicalApplication: 'Fornece a matéria-prima para a criação de melodias, riffs, solos e a formação dos próprios acordes.',
  },
  {
    term: 'Intervalo',
    category: 'Teoria Fundamental',
    definition: 'A distância física e auditiva entre duas frequências sonoras. Classifica-se por número (segunda, terça, etc.) e qualificação (maior, menor, justa, etc.).',
    example: 'De C para E = Terça Maior (4 semitons). De C para G = Quinta Justa (7 semitons).',
    practicalApplication: 'É o tijolo elementar da música; entender intervalos permite construir qualquer acorde em segundos de cabeça.',
  },
  {
    term: 'Modulação',
    category: 'Harmonia Avançada',
    definition: 'O processo de mudar deliberadamente de uma tonalidade para outra no decorrer de uma composição musical.',
    example: 'Uma música que começa em C Maior e, no último refrão, sobe para D Maior para ganhar energia.',
    practicalApplication: 'Renova o interesse do ouvinte, cria drama ou simboliza mudanças de perspectiva narrativa na canção.',
  },
  {
    term: 'Notas Guia',
    category: 'Voicings & Jazz',
    definition: 'A 3ª e a 7ª de um acorde. São as notas mais cruciais porque a 3ª define se o acorde é maior ou menor, e a 7ª define a função (maior, menor ou dominante).',
    example: 'Em G7, as notas guia são B (3ª) e F (7ª). Juntas elas formam o trítono resolutivo.',
    practicalApplication: 'Permite que pianistas e violonistas toquem harmonias elegantes e econômicas deixando o grave para o contrabaixo.',
  },
  {
    term: 'Progressão',
    category: 'Harmonia',
    definition: 'Uma sucessão encadeada de acordes ao longo do tempo que estabelece direção harmônica e sensação de movimento.',
    example: 'A progressão II – V – I ou I – V – VI – IV.',
    practicalApplication: 'Constitui a estrutura formal da canção sobre a qual a poesia e os arranjos se desdobram.',
  },
  {
    term: 'Subdominante',
    category: 'Funções Harmônicas',
    definition: 'O quarto grau (IV) e também o segundo grau (II). Sua função primordial é afastar a harmonia do repouso e preparar o caminho para o dominante.',
    example: 'F e Dm na tonalidade de Dó Maior.',
    practicalApplication: 'Evita a monotonia da tônica, dando a sensação de início de uma jornada ou de leve expectativa.',
  },
  {
    term: 'Tônica',
    category: 'Funções Harmônicas',
    definition: 'O primeiro grau (I) da escala e o acorde construído sobre ele. É o centro gravitacional tonal da peça musical, representando repouso absoluto.',
    example: 'Cmaj7 na tonalidade de C.',
    practicalApplication: 'O ponto de partida e o destino final da narrativa musical; onde a tensão se dissolve.',
  },
  {
    term: 'Trítono',
    category: 'Acústica & Harmonia',
    definition: 'Intervalo de exatamente 3 tons inteiros (6 semitons). Historicamente chamado de \'Diabolus in Musica\' pela sua instabilidade e atrito acústico.',
    example: 'Entre Si e Fá (B e F) no acorde de G7.',
    practicalApplication: 'É o motor secreto do acorde dominante: suas duas notas querem se mover em direções opostas (Si sobe para Dó, Fá desce para Mi) para resolver.',
  },
  {
    term: 'Voicing',
    category: 'Harmonia Aplicada',
    definition: 'A maneira específica como as notas de um acorde são dispostas, distribuídas entre as oitavas e atribuídas a diferentes vozes ou cordas.',
    example: 'Tocar Cmaj7 como C-E-G-B (fechado) versus C-G-E-B (aberto drop 2).',
    practicalApplication: 'Diferencia um som amador e embolado de uma sonoridade profissional, límpida e equilibrada nos instrumentos.',
  },
];
