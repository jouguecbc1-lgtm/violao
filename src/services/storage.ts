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
  completedLessonIds: [],
  completedQuizIds: [],
  exercisesAttempted: 0,
  exercisesCorrect: 0,
  quizScore: 0,
  totalTimeMinutes: 15,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  favoriteLessonIds: [],
  favoriteProgressionIds: [],
  favoriteKeys: ['C', 'G', 'F'],
  achievements: [],
  darkMode: true,
  audioVolume: 0.75,
  metronomeBpm: 80,
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
