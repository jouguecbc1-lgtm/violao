export type NoteName =
  | 'C'
  | 'C#'
  | 'Db'
  | 'D'
  | 'D#'
  | 'Eb'
  | 'E'
  | 'F'
  | 'F#'
  | 'Gb'
  | 'G'
  | 'G#'
  | 'Ab'
  | 'A'
  | 'A#'
  | 'Bb'
  | 'B';

export type RomanNumeral = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII';

export type HarmonicFunction = 'Tônica' | 'Subdominante' | 'Dominante';

export type ChordQuality =
  | 'Maior'
  | 'Menor'
  | 'Diminuto'
  | 'Aumentado'
  | 'Maior com 7ª Maior'
  | 'Menor com 7ª'
  | 'Dominante (7ª)'
  | 'Meio-Diminuto'
  | 'Diminuto com 7ª';

export interface ChordDefinition {
  root: string;
  symbol: string;
  name: string;
  type: 'triad' | 'tetrad';
  quality: ChordQuality;
  notes: string[];
  intervals: string[];
  romanNumeral?: string;
  harmonicFunction?: HarmonicFunction;
  bass?: string;
}

export interface ScaleDegreeInfo {
  degree: number;
  romanNumeral: string;
  note: string;
  triad: ChordDefinition;
  tetrad: ChordDefinition;
  function: HarmonicFunction;
  functionDescription: string;
  modeName: string;
}

export type ScaleType =
  | 'major'
  | 'minor_natural'
  | 'minor_harmonic'
  | 'minor_melodic'
  | 'pentatonic_major'
  | 'pentatonic_minor'
  | 'blues';

export interface HarmonicField {
  key: string;
  scaleType: ScaleType;
  scaleName: string;
  notes: string[];
  formula: string;
  degrees: ScaleDegreeInfo[];
}

export interface TwoFiveOneInfo {
  key: string;
  mode: 'major' | 'minor';
  ii: {
    chord: string;
    notes: string[];
    role: string;
    function: HarmonicFunction;
    pianoGuideVoicing: { bass: string; rightHand: string[] };
    guitarTab?: string;
  };
  V: {
    chord: string;
    notes: string[];
    role: string;
    function: HarmonicFunction;
    pianoGuideVoicing: { bass: string; rightHand: string[] };
    guitarTab?: string;
  };
  I: {
    chord: string;
    notes: string[];
    role: string;
    function: HarmonicFunction;
    pianoGuideVoicing: { bass: string; rightHand: string[] };
    guitarTab?: string;
  };
  secondaryDominant?: {
    chord: string;
    target: string;
    explanation: string;
  };
  turnaround?: {
    progression: string[];
    romanNumerals: string[];
  };
}

export interface Lesson {
  id: string;
  moduleNumber: number;
  moduleTitle: string;
  lessonNumber: number;
  title: string;
  level: 'iniciante' | 'intermediario' | 'avancado';
  estimatedMinutes: number;
  description: string;
  content: string; // Markdown/HTML structured
  keyTakeaways: string[];
  practicalApplication: {
    instrument: string;
    instructions: string;
    chordsOrNotes?: string[];
  };
  exercise: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface QuizQuestion {
  id: string;
  level: 'iniciante' | 'intermediario' | 'avancado';
  category: 'campo_harmonico' | '2_5_1' | 'acordes' | 'escalas' | 'transposicao';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
}

export interface ProgressionTemplate {
  id: string;
  name: string;
  category: 'Básicas' | 'Jazz' | 'Gospel' | 'Pop' | 'Bossa Nova';
  romanNumerals: string[];
  description: string;
  explanation: string;
  exampleKey: string;
  exampleChords: string[];
  audioChords?: string[];
}

export interface StudentNote {
  id: string;
  title: string;
  content: string;
  category: 'Campo Harmônico' | 'Acordes' | '2-5-1' | 'Progressões' | 'Exercícios' | 'Geral';
  createdAt: string;
  updatedAt: string;
  favorite?: boolean;
}

export interface UserStats {
  studentName: string;
  completedLessonIds: string[];
  completedQuizIds: string[];
  exercisesAttempted: number;
  exercisesCorrect: number;
  quizScore: number;
  totalTimeMinutes: number;
  streakDays: number;
  lastActiveDate: string;
  favoriteLessonIds: string[];
  favoriteProgressionIds: string[];
  favoriteKeys: string[];
  achievements: string[];
  darkMode: boolean;
  audioVolume: number;
  metronomeBpm: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}
