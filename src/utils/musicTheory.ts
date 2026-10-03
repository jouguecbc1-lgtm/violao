import {
  HarmonicField,
  HarmonicFunction,
  ScaleDegreeInfo,
  ScaleType,
  TwoFiveOneInfo,
  ChordDefinition,
} from '../types';

export const CHROMATIC_NOTES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const;

export const CHROMATIC_FLATS = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
] as const;

// Common natural spellings for keys
export const KEY_LIST = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'F#',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
] as const;

// Standard scale step formulas (in semitones)
export const SCALE_FORMULAS: Record<ScaleType, number[]> = {
  major: [2, 2, 1, 2, 2, 2, 1], // T - T - ST - T - T - T - ST
  minor_natural: [2, 1, 2, 2, 1, 2, 2], // T - ST - T - T - ST - T - T
  minor_harmonic: [2, 1, 2, 2, 1, 3, 1], // T - ST - T - T - ST - 1.5T - ST
  minor_melodic: [2, 1, 2, 2, 2, 2, 1], // T - ST - T - T - T - T - ST
  pentatonic_major: [2, 2, 3, 2, 3],
  pentatonic_minor: [3, 2, 2, 3, 2],
  blues: [3, 2, 1, 1, 3, 2],
};

// Proper pitch spelling mapping for diatonic keys
const PROPER_KEY_SPELLINGS: Record<string, string[]> = {
  C: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  Db: ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
  D: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  Eb: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
  E: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  F: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
  'F#': ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],
  Gb: ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'],
  G: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  Ab: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
  A: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  Bb: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
  B: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
  // Relative minors spellings
  Am: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  Em: ['E', 'F#', 'G', 'A', 'B', 'C', 'D'],
  Bm: ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'],
  'F#m': ['F#', 'G#', 'A', 'B', 'C#', 'D', 'E'],
  'C#m': ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B'],
  'G#m': ['G#', 'A#', 'B', 'C#', 'D#', 'E', 'F#'],
  Dm: ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'],
  Gm: ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F'],
  Cm: ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'],
  Fm: ['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb'],
  Bbm: ['Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab'],
  Ebm: ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db'],
};

// Normalize note representation to standard semitone index (0 = C, 1 = C#/Db, ..., 11 = B)
export function noteToSemitone(note: string): number {
  const clean = note.trim();
  switch (clean) {
    case 'B#':
    case 'C':
      return 0;
    case 'C#':
    case 'Db':
      return 1;
    case 'D':
      return 2;
    case 'D#':
    case 'Eb':
      return 3;
    case 'E':
    case 'Fb':
      return 4;
    case 'E#':
    case 'F':
      return 5;
    case 'F#':
    case 'Gb':
      return 6;
    case 'G':
      return 7;
    case 'G#':
    case 'Ab':
      return 8;
    case 'A':
      return 9;
    case 'A#':
    case 'Bb':
      return 10;
    case 'B':
    case 'Cb':
      return 11;
    default:
      return 0;
  }
}

export function semitoneToNote(semitone: number, preferFlat = false): string {
  const norm = ((semitone % 12) + 12) % 12;
  return preferFlat ? CHROMATIC_FLATS[norm] : CHROMATIC_NOTES[norm];
}

// Check if a key uses flats predominantly
export function isFlatKey(key: string): boolean {
  return ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm'].includes(key);
}

// Generate the 7 diatonic notes for any key
export function getScaleNotes(key: string, scaleType: ScaleType = 'major'): string[] {
  // If we have proper spelled major scale
  if (scaleType === 'major' && PROPER_KEY_SPELLINGS[key]) {
    return PROPER_KEY_SPELLINGS[key];
  }

  const rootIndex = noteToSemitone(key);
  const steps = SCALE_FORMULAS[scaleType];
  const notes: string[] = [key];
  let current = rootIndex;
  const useFlat = isFlatKey(key);

  for (let i = 0; i < steps.length - 1; i++) {
    current = (current + steps[i]) % 12;
    notes.push(semitoneToNote(current, useFlat));
  }

  return notes;
}

// Build Triad and Tetrad for a given root note & scale degrees
export function getMajorHarmonicField(key: string): HarmonicField {
  const scaleNotes = getScaleNotes(key, 'major');
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const modeNames = ['Jônio', 'Dórico', 'Frígio', 'Lídio', 'Mixolídio', 'Eólio', 'Lócrio'];
  const functions: HarmonicFunction[] = [
    'Tônica',
    'Subdominante',
    'Tônica',
    'Subdominante',
    'Dominante',
    'Tônica',
    'Dominante',
  ];
  const functionDescriptions = [
    'Tônica (Repouso primordial / Resolução absoluta)',
    'Subdominante (Sensação de afastamento / Preparação para o dominante)',
    'Tônica (Repouso suave / Acorde de passagem)',
    'Subdominante (Movimento aberto / Contraste expressivo)',
    'Dominante (Tensão harmônica máxima / Trítono que resolve na tônica)',
    'Tônica (Relativa menor / Repouso meditativo e melancólico)',
    'Dominante (Sensível / Tensão extrema com trítono diminuto)',
  ];

  const degrees: ScaleDegreeInfo[] = scaleNotes.map((root, i) => {
    // 3rd note is (i + 2) % 7
    const third = scaleNotes[(i + 2) % 7];
    // 5th note is (i + 4) % 7
    const fifth = scaleNotes[(i + 4) % 7];
    // 7th note is (i + 6) % 7
    const seventh = scaleNotes[(i + 6) % 7];

    const triadNotes = [root, third, fifth];
    const tetradNotes = [root, third, fifth, seventh];

    let triadSymbol = root;
    let tetradSymbol = root;
    let triadQuality: ChordDefinition['quality'] = 'Maior';
    let tetradQuality: ChordDefinition['quality'] = 'Maior com 7ª Maior';

    if (i === 0 || i === 3) {
      // I, IV: Major, Maj7
      triadSymbol = root;
      tetradSymbol = `${root}maj7`;
      triadQuality = 'Maior';
      tetradQuality = 'Maior com 7ª Maior';
    } else if (i === 1 || i === 2 || i === 5) {
      // II, III, VI: Minor, m7
      triadSymbol = `${root}m`;
      tetradSymbol = `${root}m7`;
      triadQuality = 'Menor';
      tetradQuality = 'Menor com 7ª';
    } else if (i === 4) {
      // V: Major, 7 (Dominant)
      triadSymbol = root;
      tetradSymbol = `${root}7`;
      triadQuality = 'Maior';
      tetradQuality = 'Dominante (7ª)';
    } else if (i === 6) {
      // VII: Diminished, m7(b5)
      triadSymbol = `${root}°`;
      tetradSymbol = `${root}m7(b5)`;
      triadQuality = 'Diminuto';
      tetradQuality = 'Meio-Diminuto';
    }

    const triad: ChordDefinition = {
      root,
      symbol: triadSymbol,
      name: `${root} ${triadQuality}`,
      type: 'triad',
      quality: triadQuality,
      notes: triadNotes,
      intervals: ['1', i === 1 || i === 2 || i === 5 || i === 6 ? 'b3' : '3', i === 6 ? 'b5' : '5'],
      romanNumeral: romanNumerals[i],
      harmonicFunction: functions[i],
    };

    const tetrad: ChordDefinition = {
      root,
      symbol: tetradSymbol,
      name: `${root} ${tetradQuality}`,
      type: 'tetrad',
      quality: tetradQuality,
      notes: tetradNotes,
      intervals: [
        '1',
        i === 1 || i === 2 || i === 5 || i === 6 ? 'b3' : '3',
        i === 6 ? 'b5' : '5',
        i === 0 || i === 3 ? '7M' : '7',
      ],
      romanNumeral: `${romanNumerals[i]}7`,
      harmonicFunction: functions[i],
    };

    return {
      degree: i + 1,
      romanNumeral: romanNumerals[i],
      note: root,
      triad,
      tetrad,
      function: functions[i],
      functionDescription: functionDescriptions[i],
      modeName: modeNames[i],
    };
  });

  return {
    key,
    scaleType: 'major',
    scaleName: `Campo Harmônico de ${key} Maior`,
    notes: scaleNotes,
    formula: 'T – T – ST – T – T – T – ST',
    degrees,
  };
}

// Generate Minor Harmonic Field (Natural, Harmonic, Melodic)
export function getMinorHarmonicField(
  key: string,
  variety: 'minor_natural' | 'minor_harmonic' | 'minor_melodic' = 'minor_natural'
): HarmonicField {
  const rootIndex = noteToSemitone(key);
  const steps = SCALE_FORMULAS[variety];
  const useFlat = isFlatKey(key);

  const scaleNotes: string[] = [key];
  let cur = rootIndex;
  for (let i = 0; i < steps.length - 1; i++) {
    cur = (cur + steps[i]) % 12;
    scaleNotes.push(semitoneToNote(cur, useFlat));
  }

  const romanNumerals = ['Im', 'II°', 'bIII', 'IVm', 'Vm', 'bVI', 'bVII'];
  const functions: HarmonicFunction[] = [
    'Tônica',
    'Subdominante',
    'Tônica',
    'Subdominante',
    'Dominante',
    'Subdominante',
    'Dominante',
  ];

  const degrees: ScaleDegreeInfo[] = scaleNotes.map((root, i) => {
    const third = scaleNotes[(i + 2) % 7];
    const fifth = scaleNotes[(i + 4) % 7];
    const seventh = scaleNotes[(i + 6) % 7];

    const triadNotes = [root, third, fifth];
    const tetradNotes = [root, third, fifth, seventh];

    let triadSymbol = root;
    let tetradSymbol = root;
    let triadQuality: ChordDefinition['quality'] = 'Menor';
    let tetradQuality: ChordDefinition['quality'] = 'Menor com 7ª';

    if (variety === 'minor_natural') {
      if (i === 0 || i === 3 || i === 4) {
        triadSymbol = `${root}m`;
        tetradSymbol = `${root}m7`;
        triadQuality = 'Menor';
        tetradQuality = 'Menor com 7ª';
      } else if (i === 1) {
        triadSymbol = `${root}°`;
        tetradSymbol = `${root}m7(b5)`;
        triadQuality = 'Diminuto';
        tetradQuality = 'Meio-Diminuto';
      } else {
        triadSymbol = root;
        tetradSymbol = `${root}maj7`;
        triadQuality = 'Maior';
        tetradQuality = 'Maior com 7ª Maior';
      }
    } else if (variety === 'minor_harmonic') {
      // In harmonic minor: V is dominant (Major / 7)
      if (i === 4) {
        triadSymbol = root;
        tetradSymbol = `${root}7`;
        triadQuality = 'Maior';
        tetradQuality = 'Dominante (7ª)';
      } else if (i === 6) {
        triadSymbol = `${root}°`;
        tetradSymbol = `${root}°7`;
        triadQuality = 'Diminuto';
        tetradQuality = 'Diminuto com 7ª';
      } else if (i === 0) {
        triadSymbol = `${root}m`;
        tetradSymbol = `${root}m(maj7)`;
        triadQuality = 'Menor';
        tetradQuality = 'Menor com 7ª';
      } else {
        triadSymbol = root;
        tetradSymbol = `${root}7`;
        triadQuality = 'Maior';
        tetradQuality = 'Dominante (7ª)';
      }
    }

    return {
      degree: i + 1,
      romanNumeral: romanNumerals[i],
      note: root,
      triad: {
        root,
        symbol: triadSymbol,
        name: `${root} ${triadQuality}`,
        type: 'triad',
        quality: triadQuality,
        notes: triadNotes,
        intervals: ['1', '3', '5'],
        romanNumeral: romanNumerals[i],
        harmonicFunction: functions[i],
      },
      tetrad: {
        root,
        symbol: tetradSymbol,
        name: `${root} ${tetradQuality}`,
        type: 'tetrad',
        quality: tetradQuality,
        notes: tetradNotes,
        intervals: ['1', '3', '5', '7'],
        romanNumeral: `${romanNumerals[i]}7`,
        harmonicFunction: functions[i],
      },
      function: functions[i],
      functionDescription: `${functions[i]} no contexto menor`,
      modeName: `Grau ${i + 1}`,
    };
  });

  const formulaLabel =
    variety === 'minor_natural'
      ? 'T – ST – T – T – ST – T – T'
      : variety === 'minor_harmonic'
      ? 'T – ST – T – T – ST – 1.5T – ST'
      : 'T – ST – T – T – T – T – ST';

  const nameLabel =
    variety === 'minor_natural'
      ? `Campo Harmônico de ${key} Menor Natural`
      : variety === 'minor_harmonic'
      ? `Campo Harmônico de ${key} Menor Harmônica`
      : `Campo Harmônico de ${key} Menor Melódica`;

  return {
    key,
    scaleType: variety,
    scaleName: nameLabel,
    notes: scaleNotes,
    formula: formulaLabel,
    degrees,
  };
}

// Dedicated 2-5-1 Calculator with guide tones and voice leading
export function get251(key: string, mode: 'major' | 'minor' = 'major'): TwoFiveOneInfo {
  if (mode === 'major') {
    const field = getMajorHarmonicField(key);
    const iiDegree = field.degrees[1]; // II
    const vDegree = field.degrees[4]; // V
    const iDegree = field.degrees[0]; // I

    // Guide tones:
    // Dm7: 3rd = F, 7th = C
    // G7: 7th = F, 3rd = B (smooth chromatic resolution C -> B while F stays)
    // Cmaj7: 3rd = E, 7th = B (smooth chromatic resolution F -> E while B stays)
    const iiThird = iiDegree.tetrad.notes[1];
    const iiSeventh = iiDegree.tetrad.notes[3];

    const vThird = vDegree.tetrad.notes[1];
    const vSeventh = vDegree.tetrad.notes[3];

    const iThird = iDegree.tetrad.notes[1];
    const iSeventh = iDegree.tetrad.notes[3];

    // Secondary dominant V/V (Dominante do dominante)
    // In C, V is G. Dominant of G is D7 (resolves to G7)
    const fifthOfKey = vDegree.note;
    const fifthOfFifthField = getMajorHarmonicField(fifthOfKey);
    const dominantOfDominant = fifthOfFifthField.degrees[4].tetrad.symbol;

    return {
      key,
      mode: 'major',
      ii: {
        chord: iiDegree.tetrad.symbol, // e.g. Dm7
        notes: iiDegree.tetrad.notes,
        role: 'Preparação (Subdominante)',
        function: 'Subdominante',
        pianoGuideVoicing: {
          bass: iiDegree.note,
          rightHand: [iiThird, iiSeventh],
        },
        guitarTab: 'x-5-7-5-6-5',
      },
      V: {
        chord: vDegree.tetrad.symbol, // e.g. G7
        notes: vDegree.tetrad.notes,
        role: 'Tensão (Trítono resolutivo)',
        function: 'Dominante',
        pianoGuideVoicing: {
          bass: vDegree.note,
          rightHand: [vSeventh, vThird], // F and B
        },
        guitarTab: '3-5-3-4-3-3',
      },
      I: {
        chord: iDegree.tetrad.symbol, // e.g. Cmaj7
        notes: iDegree.tetrad.notes,
        role: 'Resolução (Tônica / Repouso pleno)',
        function: 'Tônica',
        pianoGuideVoicing: {
          bass: iDegree.note,
          rightHand: [iThird, iSeventh], // E and B
        },
        guitarTab: 'x-3-5-4-5-3',
      },
      secondaryDominant: {
        chord: dominantOfDominant,
        target: vDegree.tetrad.symbol,
        explanation: `${dominantOfDominant} é o V/V (Dominante Secundário de ${vDegree.tetrad.symbol}). Prepara com ainda mais força a chegada do dominante antes da resolução na tônica ${iDegree.tetrad.symbol}.`,
      },
      turnaround: {
        romanNumerals: ['Imaj7', 'VI7', 'II7', 'V7'],
        progression: [
          iDegree.tetrad.symbol,
          `${field.degrees[5].note}7`,
          `${field.degrees[1].note}7`,
          vDegree.tetrad.symbol,
        ],
      },
    };
  } else {
    // Minor 2-5-1: iim7(b5) -> V7(b9) -> Im7
    const field = getMinorHarmonicField(key, 'minor_harmonic');
    const iiDegree = field.degrees[1];
    const vDegree = field.degrees[4];
    const iDegree = field.degrees[0];

    return {
      key,
      mode: 'minor',
      ii: {
        chord: `${iiDegree.note}m7(b5)`,
        notes: [
          iiDegree.note,
          scaleStepNote(iiDegree.note, 3),
          scaleStepNote(iiDegree.note, 6),
          scaleStepNote(iiDegree.note, 10),
        ],
        role: 'Preparação Meio-Diminuta',
        function: 'Subdominante',
        pianoGuideVoicing: {
          bass: iiDegree.note,
          rightHand: [scaleStepNote(iiDegree.note, 3), scaleStepNote(iiDegree.note, 10)],
        },
        guitarTab: 'x-x-x-x-x-x',
      },
      V: {
        chord: `${vDegree.note}7(b9)`,
        notes: [
          vDegree.note,
          scaleStepNote(vDegree.note, 4),
          scaleStepNote(vDegree.note, 7),
          scaleStepNote(vDegree.note, 10),
        ],
        role: 'Tensão Máxima Alterada',
        function: 'Dominante',
        pianoGuideVoicing: {
          bass: vDegree.note,
          rightHand: [scaleStepNote(vDegree.note, 10), scaleStepNote(vDegree.note, 4)],
        },
        guitarTab: 'x-x-x-x-x-x',
      },
      I: {
        chord: `${iDegree.note}m7`,
        notes: [
          iDegree.note,
          scaleStepNote(iDegree.note, 3),
          scaleStepNote(iDegree.note, 7),
          scaleStepNote(iDegree.note, 10),
        ],
        role: 'Resolução Menor',
        function: 'Tônica',
        pianoGuideVoicing: {
          bass: iDegree.note,
          rightHand: [scaleStepNote(iDegree.note, 3), scaleStepNote(iDegree.note, 10)],
        },
        guitarTab: 'x-x-x-x-x-x',
      },
    };
  }
}

function scaleStepNote(root: string, semitones: number): string {
  const rootIndex = noteToSemitone(root);
  return semitoneToNote(rootIndex + semitones, isFlatKey(root));
}

// Inversions generator for any chord
export interface ChordInversion {
  name: string;
  notes: string[];
  bass: string;
  description: string;
  inversionName?: string;
  bassNote?: string;
}

export function getChordInversions(chordName: string, notes: string[]): ChordInversion[] {
  if (notes.length === 3) {
    return [
      {
        name: 'Estado Fundamental',
        inversionName: 'Fundamental',
        notes: [...notes],
        bass: notes[0],
        bassNote: notes[0],
        description: `Tônica no baixo (${notes[0]}). Som mais estável e fundamental.`,
      },
      {
        name: '1ª Inversão (Baixo na 3ª)',
        inversionName: '1ª Inversão',
        notes: [notes[1], notes[2], notes[0]],
        bass: notes[1],
        bassNote: notes[1],
        description: `Terça no baixo (${notes[1]}). Proporciona condução melódica mais suave no baixo.`,
      },
      {
        name: '2ª Inversão (Baixo na 5ª)',
        inversionName: '2ª Inversão',
        notes: [notes[2], notes[0], notes[1]],
        bass: notes[2],
        bassNote: notes[2],
        description: `Quinta no baixo (${notes[2]}). Soa suspenso e dinâmico, comum em cadências.`,
      },
    ];
  } else if (notes.length >= 4) {
    return [
      {
        name: 'Estado Fundamental',
        inversionName: 'Fundamental',
        notes: [...notes],
        bass: notes[0],
        bassNote: notes[0],
        description: `Tônica no baixo (${notes[0]}). Estabilidade total.`,
      },
      {
        name: '1ª Inversão (Baixo na 3ª)',
        inversionName: '1ª Inversão',
        notes: [notes[1], notes[2], notes[3], notes[0]],
        bass: notes[1],
        bassNote: notes[1],
        description: `Terça no baixo (${notes[1]}). Condução de voz elegante.`,
      },
      {
        name: '2ª Inversão (Baixo na 5ª)',
        inversionName: '2ª Inversão',
        notes: [notes[2], notes[3], notes[0], notes[1]],
        bass: notes[2],
        bassNote: notes[2],
        description: `Quinta no baixo (${notes[2]}).`,
      },
      {
        name: '3ª Inversão (Baixo na 7ª)',
        inversionName: '3ª Inversão',
        notes: [notes[3], notes[0], notes[1], notes[2]],
        bass: notes[3],
        bassNote: notes[3],
        description: `Sétima no baixo (${notes[3]}). Alta tensão direcional para resolução um semitom abaixo.`,
      },
    ];
  }
  return [];
}

// Transpose note by semitones
export function transposeNote(note: string, semitones: number): string {
  const currentSemi = noteToSemitone(note);
  const targetSemi = ((currentSemi + semitones) % 12 + 12) % 12;
  const useFlat = isFlatKey(note) || (semitones < 0 && targetSemi % 2 !== 0);
  return semitoneToNote(targetSemi, useFlat);
}

// Transpose a single chord symbol (e.g. "Dm7", "F#maj7", "G7", "Bb°")
export function transposeChord(chord: string, semitones: number): string {
  const match = chord.match(/^([A-G][b#]?)(.*)$/);
  if (!match) return chord;
  const [, root, suffix] = match;
  const newRoot = transposeNote(root, semitones);
  return `${newRoot}${suffix}`;
}

// Transpose progression array
export function transposeProgression(progression: string[], semitones: number): string[] {
  return progression.map((ch) => transposeChord(ch, semitones));
}

// Transpose progression from key A to key B
export function transposeProgressionBetweenKeys(
  progression: string[],
  fromKey: string,
  toKey: string
): string[] {
  const diff = (noteToSemitone(toKey) - noteToSemitone(fromKey) + 12) % 12;
  return transposeProgression(progression, diff);
}

// Circle of Fifths data calculation
export interface CircleKeyData {
  key: string;
  relativeMinor: string;
  accidentals: number;
  accidentalType: 'sharp' | 'flat' | 'none';
  dominant: string;
  subdominant: string;
  iiV_I: string[];
}

export const CIRCLE_OF_FIFTHS: CircleKeyData[] = [
  {
    key: 'C',
    relativeMinor: 'Am',
    accidentals: 0,
    accidentalType: 'none',
    dominant: 'G',
    subdominant: 'F',
    iiV_I: ['Dm7', 'G7', 'Cmaj7'],
  },
  {
    key: 'G',
    relativeMinor: 'Em',
    accidentals: 1,
    accidentalType: 'sharp',
    dominant: 'D',
    subdominant: 'C',
    iiV_I: ['Am7', 'D7', 'Gmaj7'],
  },
  {
    key: 'D',
    relativeMinor: 'Bm',
    accidentals: 2,
    accidentalType: 'sharp',
    dominant: 'A',
    subdominant: 'G',
    iiV_I: ['Em7', 'A7', 'Dmaj7'],
  },
  {
    key: 'A',
    relativeMinor: 'F#m',
    accidentals: 3,
    accidentalType: 'sharp',
    dominant: 'E',
    subdominant: 'D',
    iiV_I: ['Bm7', 'E7', 'Amaj7'],
  },
  {
    key: 'E',
    relativeMinor: 'C#m',
    accidentals: 4,
    accidentalType: 'sharp',
    dominant: 'B',
    subdominant: 'A',
    iiV_I: ['F#m7', 'B7', 'Emaj7'],
  },
  {
    key: 'B',
    relativeMinor: 'G#m',
    accidentals: 5,
    accidentalType: 'sharp',
    dominant: 'F#',
    subdominant: 'E',
    iiV_I: ['C#m7', 'F#7', 'Bmaj7'],
  },
  {
    key: 'F#',
    relativeMinor: 'D#m',
    accidentals: 6,
    accidentalType: 'sharp',
    dominant: 'C#',
    subdominant: 'B',
    iiV_I: ['G#m7', 'C#7', 'F#maj7'],
  },
  {
    key: 'Db',
    relativeMinor: 'Bbm',
    accidentals: 5,
    accidentalType: 'flat',
    dominant: 'Ab',
    subdominant: 'Gb',
    iiV_I: ['Ebm7', 'Ab7', 'Dbmaj7'],
  },
  {
    key: 'Ab',
    relativeMinor: 'Fm',
    accidentals: 4,
    accidentalType: 'flat',
    dominant: 'Eb',
    subdominant: 'Db',
    iiV_I: ['Bbm7', 'Eb7', 'Abmaj7'],
  },
  {
    key: 'Eb',
    relativeMinor: 'Cm',
    accidentals: 3,
    accidentalType: 'flat',
    dominant: 'Bb',
    subdominant: 'Ab',
    iiV_I: ['Fm7', 'Bb7', 'Ebmaj7'],
  },
  {
    key: 'Bb',
    relativeMinor: 'Gm',
    accidentals: 2,
    accidentalType: 'flat',
    dominant: 'F',
    subdominant: 'Eb',
    iiV_I: ['Cm7', 'F7', 'Bbmaj7'],
  },
  {
    key: 'F',
    relativeMinor: 'Dm',
    accidentals: 1,
    accidentalType: 'flat',
    dominant: 'C',
    subdominant: 'Bb',
    iiV_I: ['Gm7', 'C7', 'Fmaj7'],
  },
];
