import { StudentNote, UserStats, Achievement } from '../types';

const STORAGE_KEY_STATS = 'harmonia_251_user_stats';
const STORAGE_KEY_NOTES = 'harmonia_251_notes';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_lesson',
    title: 'Primeiro Passo',
    description: 'Concluiu sua primeira aula teórica.',
    icon: '🎯',
    unlocked: false,
  },
  {
    id: 'five_lessons',
    title: 'Dedicação Musical',
    description: 'Concluiu 5 aulas do curso.',
    icon: '📚',
    unlocked: false,
  },
  {
    id: 'first_251',
    title: 'O Poder do 2-5-1',
    description: 'Estudou e tocou a progressão II-V-I no simulador.',
    icon: '🎹',
    unlocked: false,
  },
  {
    id: 'quiz_ace',
    title: 'Mestre da Harmonia',
    description: 'Acertou 10 exercícios seguidos no modo treino.',
    icon: '🏆',
    unlocked: false,
  },
  {
    id: 'key_master',
    title: 'Domínio das 12 Tonalidades',
    description: 'Consultou o campo harmônico em pelo menos 6 tonalidades diferentes.',
    icon: '🌐',
    unlocked: false,
  },
  {
    id: 'course_completed',
    title: 'Certificado Conquistado',
    description: 'Concluiu 100% das aulas da plataforma!',
    icon: '🎓',
    unlocked: false,
  },
];

const DEFAULT_STATS: UserStats = {
  studentName: 'Estudante de Música',
  preferredInstrument: 'violao',
  soundTimbre: 'piano',
  guitarTuning: 'standard',
  studentLevel: 'Intermediário',
  studentGoal: 'Jazz & Improvisação',
  completedLessonIds: ['aula-1', 'aula-2'],
  completedQuizIds: [],
  exercisesAttempted: 18,
  exercisesCorrect: 15,
  quizScore: 85,
  totalTimeMinutes: 45,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  favoriteLessonIds: ['aula-13'],
  favoriteProgressionIds: ['prog-251-c'],
  favoriteKeys: ['C', 'G', 'F', 'Eb'],
  achievements: ['first_lesson', 'first_251'],
  darkMode: true,
  audioVolume: 0.75,
  metronomeBpm: 80,
  topicMastery: {
    'Campo Harmônico Maior': { attempts: 24, correct: 20, percentage: 83 },
    'Formação de Acordes': { attempts: 18, correct: 14, percentage: 78 },
    'Progressão II - V - I': { attempts: 32, correct: 29, percentage: 91 },
    'Transposição de Tonalidade': { attempts: 15, correct: 9, percentage: 60 },
    'Percepção & Treino de Ouvido': { attempts: 12, correct: 7, percentage: 58 },
  },
  keyMastery: {
    'C': { attempts: 30, correct: 29, percentage: 97, isMastered: true },
    'G': { attempts: 22, correct: 20, percentage: 91, isMastered: true },
    'D': { attempts: 18, correct: 15, percentage: 83, isMastered: false },
    'A': { attempts: 12, correct: 9, percentage: 75, isMastered: false },
    'E': { attempts: 10, correct: 7, percentage: 70, isMastered: false },
    'B': { attempts: 8, correct: 5, percentage: 62, isMastered: false },
    'F#': { attempts: 6, correct: 3, percentage: 50, isMastered: false },
    'Db': { attempts: 7, correct: 4, percentage: 57, isMastered: false },
    'Ab': { attempts: 14, correct: 10, percentage: 71, isMastered: false },
    'Eb': { attempts: 16, correct: 9, percentage: 56, isMastered: false },
    'Bb': { attempts: 19, correct: 12, percentage: 63, isMastered: false },
    'F': { attempts: 25, correct: 23, percentage: 92, isMastered: true },
  },
  dailyPractice: {
    date: new Date().toISOString().split('T')[0],
    key: 'Eb',
    scale: 'Maior',
    progression: ['Fm7', 'Bb7', 'Ebmaj7'],
    progressionName: 'II – V – I em Mi Bemol Maior',
    bpm: 70,
    durationMinutes: 10,
    completed: false,
  },
  weeklyGoals: [
    { id: 'goal-1', title: 'Estudar dias na semana', current: 4, target: 5, unit: 'dias', completed: false },
    { id: 'goal-2', title: 'Fazer exercícios práticos', current: 35, target: 50, unit: 'exercícios', completed: false },
    { id: 'goal-3', title: 'Dominar novas tonalidades', current: 3, target: 4, unit: 'tons', completed: false },
    { id: 'goal-4', title: 'Praticar II-V-I no metrônomo', current: 20, target: 30, unit: 'minutos', completed: false },
  ],
};

const DEFAULT_NOTES: StudentNote[] = [
  {
    id: 'note-1',
    title: 'Regra de Ouro do 2-5-1',
    category: '2-5-1',
    content:
      'Em tonalidade maior, o II é sempre m7 (subdominante, preparação), o V é 7 (dominante com trítono tenso), e o I é maj7 (tônica, repouso total).\nA 7ª do II desce meio tom e se torna a 3ª do V! A 7ª do V desce meio tom e se torna a 3ª do I!',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    favorite: true,
  },
  {
    id: 'note-2',
    title: 'Funções Harmônicas Resumidas',
    category: 'Campo Harmônico',
    content:
      '• Tônica (Repouso): I, III, VI\n• Subdominante (Afastamento/Movimento): II, IV\n• Dominante (Tensão/Direção): V, VII°',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    favorite: false,
  },
];

export function getUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATS);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  } catch (err) {
    console.error('Error saving user stats:', err);
  }
}

export function getStudentNotes(): StudentNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    if (!raw) {
      saveStudentNotes(DEFAULT_NOTES);
      return DEFAULT_NOTES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_NOTES;
  }
}

export function saveStudentNotes(notes: StudentNote[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
  } catch (err) {
    console.error('Error saving student notes:', err);
  }
}

export function exportAllDataAsJSON(): string {
  const data = {
    app: 'HARMONIA 2-5-1',
    exportDate: new Date().toISOString(),
    stats: getUserStats(),
    notes: getStudentNotes(),
  };
  return JSON.stringify(data, null, 2);
}

export function importAllDataFromJSON(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.stats) {
      saveUserStats(parsed.stats);
    }
    if (parsed.notes && Array.isArray(parsed.notes)) {
      saveStudentNotes(parsed.notes);
    }
    return true;
  } catch (e) {
    console.error('Failed to import backup:', e);
    return false;
  }
}
