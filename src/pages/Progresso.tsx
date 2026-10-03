import React from 'react';
import { Award, CheckCircle2, Flame, Clock, Sparkles, BookOpen, Star } from 'lucide-react';
import { UserStats } from '../types';
import { COURSE_LESSONS } from '../data/courseData';
import { INITIAL_ACHIEVEMENTS } from '../services/storage';

interface ProgressoProps {
  stats: UserStats;
  onOpenCertificate: () => void;
}

export const Progresso: React.FC<ProgressoProps> = ({ stats, onOpenCertificate }) => {
  const totalLessons = COURSE_LESSONS.length;
  const completedLessons = stats.completedLessonIds.length;
  const percent = Math.round((completedLessons / totalLessons) * 100);

  const accuracy =
    stats.exercisesAttempted > 0
      ? Math.round((stats.exercisesCorrect / stats.exercisesAttempted) * 100)
      : 100;

  // Compute achievements status
  const achievements = INITIAL_ACHIEVEMENTS.map((ach) => {
    let unlocked = false;
    if (ach.id === 'first_lesson' && completedLessons >= 1) unlocked = true;
    if (ach.id === 'five_lessons' && completedLessons >= 5) unlocked = true;
    if (ach.id === 'first_251' && stats.exercisesAttempted >= 3) unlocked = true;
    if (ach.id === 'quiz_ace' && stats.exercisesCorrect >= 10) unlocked = true;
    if (ach.id === 'key_master' && completedLessons >= 10) unlocked = true;
    if (ach.id === 'course_completed' && completedLessons >= totalLessons) unlocked = true;
    return { ...ach, unlocked };
  });

  // Breakdown by module
  const moduleNumbers = [1, 2, 3, 4, 5];
  const moduleNames = [
    'Fundamentos Musicais',
    'A Escala Maior',
    'Formação de Acordes',
    'Tétrades & Campo Harmônico',
    'Funções Harmônicas & O 2-5-1',
  ];

  return (
    <div className="space-y-6">
      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs text-slate-400 block mb-1">Progresso Geral</span>
          <div className="text-3xl font-black text-amber-400 font-mono mb-2">{percent}%</div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs text-slate-400 block mb-1">Aulas Concluídas</span>
          <div className="text-3xl font-black text-emerald-400 font-mono mb-2">
            {completedLessons} <span className="text-sm text-slate-500 font-normal">/ {totalLessons}</span>
          </div>
          <p className="text-[11px] text-slate-400">{totalLessons - completedLessons} restantes</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs text-slate-400 block mb-1">Aproveitamento</span>
          <div className="text-3xl font-black text-purple-400 font-mono mb-2">{accuracy}%</div>
          <p className="text-[11px] text-slate-400">
            {stats.exercisesCorrect} acertos em {stats.exercisesAttempted} questões
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs text-slate-400 block mb-1">Sequência Atual</span>
          <div className="text-3xl font-black text-rose-400 font-mono mb-2 flex items-center gap-1.5">
            <Flame className="w-6 h-6 fill-rose-500 text-rose-500" />
            <span>{stats.streakDays}d</span>
          </div>
          <p className="text-[11px] text-slate-400">Continue praticando diariamente</p>
        </div>
      </div>

      {/* Certificate CTA Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Award className="w-5 h-5" />
            <span>Certificado de Conclusão</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-100">
            {percent >= 100
              ? 'Parabéns! Seu Certificado está liberado!'
              : 'Emita seu Certificado Oficial de Harmonia'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Ao concluir o curso ou demonstrar proficiência nos exercícios, gere seu certificado autenticado com nome, data e índice de aproveitamento.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCertificate}
          className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 whitespace-nowrap self-start sm:self-auto"
        >
          Visualizar e Imprimir Certificado
        </button>
      </div>

      {/* Evolution by Module */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-100">Evolução por Módulo</h3>
        <div className="space-y-3">
          {moduleNumbers.map((modNum, idx) => {
            const lessonsInMod = COURSE_LESSONS.filter((l) => l.moduleNumber === modNum);
            const doneInMod = lessonsInMod.filter((l) =>
              stats.completedLessonIds.includes(l.id)
            ).length;
            const modPercent = Math.round((doneInMod / lessonsInMod.length) * 100);

            return (
              <div key={modNum} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    Módulo {modNum}: {moduleNames[idx]}
                  </span>
                  <span className="font-mono text-amber-400 font-bold">
                    {doneInMod}/{lessonsInMod.length} ({modPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${modPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gamification Achievements Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Conquistas Desbloqueadas</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border transition-all ${
                ach.unlocked
                  ? 'bg-amber-950/20 border-amber-500/40 text-slate-100 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{ach.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{ach.title}</h4>
                  <span className="text-[10px] uppercase font-bold text-amber-400">
                    {ach.unlocked ? '✓ Desbloqueada' : 'Bloqueada'}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
