import React from 'react';
import {
  GraduationCap,
  Play,
  ArrowRight,
  Zap,
  Award,
  Layers,
  Sparkles,
  BookOpen,
  Music,
  CheckCircle2,
  Clock,
  Flame,
} from 'lucide-react';
import { UserStats } from '../types';
import { COURSE_LESSONS } from '../data/courseData';
import { audioSynth } from '../services/audioSynth';
import { NavPage } from '../components/Sidebar';

interface DashboardProps {
  stats: UserStats;
  onNavigate: (page: NavPage, param?: string) => void;
  onOpenCertificate: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  onNavigate,
  onOpenCertificate,
}) => {
  const totalLessons = COURSE_LESSONS.length;
  const completedCount = stats.completedLessonIds.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  // Next incomplete lesson or first
  const nextLesson =
    COURSE_LESSONS.find((l) => !stats.completedLessonIds.includes(l.id)) ||
    COURSE_LESSONS[0];

  const accuracyPercent =
    stats.exercisesAttempted > 0
      ? Math.round((stats.exercisesCorrect / stats.exercisesAttempted) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>PLATAFORMA EDUCACIONAL MUSICAL</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight mb-2">
            HARMONIA <span className="text-amber-400">2-5-1</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium mb-4">
            Curso de Campo Harmônico, Formação de Acordes e Progressões
          </p>

          {/* Prompt Hero Tags */}
          <div className="flex flex-wrap gap-2 text-xs text-slate-300 mb-6">
            <span className="bg-slate-800/90 border border-slate-700/60 px-2.5 py-1 rounded-md">
              ✓ Aprenda Campo Harmônico
            </span>
            <span className="bg-slate-800/90 border border-slate-700/60 px-2.5 py-1 rounded-md">
              ✓ Domine os Acordes
            </span>
            <span className="bg-slate-800/90 border border-slate-700/60 px-2.5 py-1 rounded-md">
              ✓ Entenda as Funções Harmônicas
            </span>
            <span className="bg-slate-800/90 border border-slate-700/60 px-2.5 py-1 rounded-md">
              ✓ Domine a Progressão II-V-I
            </span>
            <span className="bg-slate-800/90 border border-slate-700/60 px-2.5 py-1 rounded-md">
              ✓ Transponha para Qualquer Tom
            </span>
            <span className="bg-slate-800/90 border border-slate-700/60 px-2.5 py-1 rounded-md">
              ✓ Pratique com Exercícios
            </span>
          </div>

          {/* Quick Hero CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('curso', nextLesson.id)}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Continuar: Aula {nextLesson.lessonNumber}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigate('2-5-1');
                audioSynth.playProgression([['D', 'F', 'A', 'C'], ['G', 'B', 'D', 'F'], ['C', 'E', 'G', 'B']], 80);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Explorar o 2-5-1 Interativo</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Metrics & Student Progress Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Progresso do curso */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Progresso do Curso</span>
            <GraduationCap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono mb-2">
            {progressPercent}%
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Card 2: Aulas concluídas */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Aulas Concluídas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono mb-1">
            {completedCount} <span className="text-sm font-normal text-slate-500">/ {totalLessons}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {totalLessons - completedCount} aulas restantes
          </p>
        </div>

        {/* Card 3: Exercícios */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Exercícios Feitos</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono mb-1">
            {stats.exercisesAttempted}
          </div>
          <p className="text-[11px] text-slate-400">
            {stats.exercisesCorrect} corretos
          </p>
        </div>

        {/* Card 4: Aproveitamento */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Aproveitamento</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono mb-1">
            {accuracyPercent}%
          </div>
          <p className="text-[11px] text-slate-400">
            Sequência: {stats.streakDays} {stats.streakDays === 1 ? 'dia' : 'dias'}
          </p>
        </div>
      </div>

      {/* Main Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Next Lesson & Featured 2-5-1 Simulator */}
        <div className="lg:col-span-8 space-y-6">
          {/* Current Lesson In Progress */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Próxima Aula Sugerida
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {nextLesson.estimatedMinutes} min
              </span>
            </div>

            <div className="mb-4">
              <span className="text-xs text-slate-400 block mb-1">
                Módulo {nextLesson.moduleNumber} · {nextLesson.moduleTitle}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                Aula {nextLesson.lessonNumber} — {nextLesson.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2">
                {nextLesson.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400 capitalize">
                Nível: <strong className="text-slate-200">{nextLesson.level}</strong>
              </span>

              <button
                type="button"
                onClick={() => onNavigate('curso', nextLesson.id)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
              >
                <span>Acessar Aula</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick II - V - I Spotlight Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Laboratório Rápido 2-5-1 em Dó Maior</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Clique nos acordes ou no botão para ouvir a cadência completa
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  audioSynth.playProgression([
                    ['D', 'F', 'A', 'C'],
                    ['G', 'B', 'D', 'F'],
                    ['C', 'E', 'G', 'B'],
                  ])
                }
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs rounded-lg transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Ouvir 2-5-1</span>
              </button>
            </div>

            {/* 3 Chord Cards */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div
                onClick={() => audioSynth.playChordNotes(['D', 'F', 'A', 'C'], 1.5)}
                className="cursor-pointer bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-blue-500 transition-colors text-center group"
              >
                <span className="text-[10px] uppercase font-bold text-blue-400 block mb-1">
                  Grau II · Prep
                </span>
                <div className="text-xl sm:text-2xl font-black text-slate-100 group-hover:text-blue-300">
                  Dm7
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">D · F · A · C</span>
              </div>

              <div
                onClick={() => audioSynth.playChordNotes(['G', 'B', 'D', 'F'], 1.5)}
                className="cursor-pointer bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-amber-500 transition-colors text-center group"
              >
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                  Grau V · Tensão
                </span>
                <div className="text-xl sm:text-2xl font-black text-slate-100 group-hover:text-amber-300">
                  G7
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">G · B · D · F</span>
              </div>

              <div
                onClick={() => audioSynth.playChordNotes(['C', 'E', 'G', 'B'], 1.5)}
                className="cursor-pointer bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-emerald-500 transition-colors text-center group"
              >
                <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                  Grau I · Repouso
                </span>
                <div className="text-xl sm:text-2xl font-black text-slate-100 group-hover:text-emerald-300">
                  Cmaj7
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">C · E · G · B</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => onNavigate('2-5-1')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <span>Ver tabela completa de 2-5-1 em todas as 12 tonalidades</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Access & Utilities */}
        <div className="lg:col-span-4 space-y-6">
          {/* Certificate Banner */}
          <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 rounded-xl p-5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-100 mb-1">Certificado do Curso</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Complete as aulas e exercícios para emitir seu certificado oficial de Campo Harmônico e 2-5-1.
            </p>
            <button
              type="button"
              onClick={onOpenCertificate}
              className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
            >
              Visualizar Certificado
            </button>
          </div>

          {/* Quick Tools Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Acesso Rápido às Ferramentas
            </h4>

            <button
              type="button"
              onClick={() => onNavigate('campo_harmonico')}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-xs text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Gerador de Campo Harmônico</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('circulo_quintas')}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-xs text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Music className="w-4 h-4 text-amber-400" />
                <span>Círculo das Quintas</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('simulador')}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-xs text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Simulador de Progressões</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('exercicios')}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-xs text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>Treino de Identificação de Acordes</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
