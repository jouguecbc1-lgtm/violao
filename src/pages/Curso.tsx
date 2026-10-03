import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  Volume2,
  Star,
  Check,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Lesson, UserStats } from '../types';
import { COURSE_LESSONS } from '../data/courseData';
import { audioSynth } from '../services/audioSynth';

interface CursoProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  selectedLessonId?: string;
  onSelectLessonId?: (id: string) => void;
}

export const Curso: React.FC<CursoProps> = ({
  stats,
  onUpdateStats,
  selectedLessonId,
  onSelectLessonId,
}) => {
  const [activeLessonId, setActiveLessonId] = useState<string>(
    selectedLessonId || COURSE_LESSONS[0].id
  );
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [selectedExerciseOption, setSelectedExerciseOption] = useState<number | null>(null);
  const [exerciseSubmitted, setExerciseSubmitted] = useState(false);

  // Sync if prop changes
  React.useEffect(() => {
    if (selectedLessonId) {
      setActiveLessonId(selectedLessonId);
      setSelectedExerciseOption(null);
      setExerciseSubmitted(false);
    }
  }, [selectedLessonId]);

  const currentLessonIndex = COURSE_LESSONS.findIndex((l) => l.id === activeLessonId);
  const currentLesson: Lesson =
    currentLessonIndex !== -1 ? COURSE_LESSONS[currentLessonIndex] : COURSE_LESSONS[0];

  const isCompleted = stats.completedLessonIds.includes(currentLesson.id);
  const isFavorite = stats.favoriteLessonIds.includes(currentLesson.id);

  // Group lessons by module
  const modulesMap = COURSE_LESSONS.reduce<Record<number, { title: string; lessons: Lesson[] }>>(
    (acc, lesson) => {
      if (!acc[lesson.moduleNumber]) {
        acc[lesson.moduleNumber] = {
          title: lesson.moduleTitle,
          lessons: [],
        };
      }
      acc[lesson.moduleNumber].lessons.push(lesson);
      return acc;
    },
    {}
  );

  const handleLessonChange = (newId: string) => {
    setActiveLessonId(newId);
    if (onSelectLessonId) onSelectLessonId(newId);
    setSelectedExerciseOption(null);
    setExerciseSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleComplete = () => {
    let updatedCompleted = [...stats.completedLessonIds];
    if (isCompleted) {
      updatedCompleted = updatedCompleted.filter((id) => id !== currentLesson.id);
    } else {
      updatedCompleted.push(currentLesson.id);
    }

    onUpdateStats({
      ...stats,
      completedLessonIds: updatedCompleted,
    });
  };

  const toggleFavorite = () => {
    let updatedFavs = [...stats.favoriteLessonIds];
    if (isFavorite) {
      updatedFavs = updatedFavs.filter((id) => id !== currentLesson.id);
    } else {
      updatedFavs.push(currentLesson.id);
    }

    onUpdateStats({
      ...stats,
      favoriteLessonIds: updatedFavs,
    });
  };

  const handleExerciseSubmit = () => {
    if (selectedExerciseOption === null) return;
    setExerciseSubmitted(true);

    const isCorrect = selectedExerciseOption === currentLesson.exercise.correctIndex;
    onUpdateStats({
      ...stats,
      exercisesAttempted: stats.exercisesAttempted + 1,
      exercisesCorrect: isCorrect ? stats.exercisesCorrect + 1 : stats.exercisesCorrect,
    });
  };

  const prevLesson = currentLessonIndex > 0 ? COURSE_LESSONS[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < COURSE_LESSONS.length - 1
      ? COURSE_LESSONS[currentLessonIndex + 1]
      : null;

  return (
    <div className={`space-y-6 ${isFocusMode ? 'max-w-4xl mx-auto' : ''}`}>
      {/* Top Bar Navigation & Focus Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            Aula <strong className="text-slate-100">{currentLesson.lessonNumber}</strong> de{' '}
            {COURSE_LESSONS.length}
          </span>
          <span className="text-slate-600">·</span>
          <div className="w-24 sm:w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full"
              style={{
                width: `${Math.round(
                  (stats.completedLessonIds.length / COURSE_LESSONS.length) * 100
                )}%`,
              }}
            />
          </div>
          <span className="text-xs font-semibold text-amber-400">
            {Math.round((stats.completedLessonIds.length / COURSE_LESSONS.length) * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Favorite Button */}
          <button
            type="button"
            onClick={toggleFavorite}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              isFavorite
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Favoritar aula"
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="hidden sm:inline">{isFavorite ? 'Favorita' : 'Favoritar'}</span>
          </button>

          {/* Focus Mode Button */}
          <button
            type="button"
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              isFocusMode
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Modo Foco sem distrações"
          >
            {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">Modo Foco</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Lesson Modules Menu (hidden in focus mode) */}
        {!isFocusMode && (
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Estrutura do Curso
              </h3>

              <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1">
                {Object.entries(modulesMap).map(([modNum, mod]) => (
                  <div key={modNum} className="space-y-1.5">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide block">
                      Módulo {modNum}: {mod.title}
                    </span>

                    <div className="space-y-1">
                      {mod.lessons.map((lesson) => {
                        const isCurrent = lesson.id === activeLessonId;
                        const isDone = stats.completedLessonIds.includes(lesson.id);

                        return (
                          <button
                            key={lesson.id}
                            type="button"
                            onClick={() => handleLessonChange(lesson.id)}
                            className={`w-full text-left p-2 rounded-lg text-xs flex items-start gap-2.5 transition-colors ${
                              isCurrent
                                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                            }`}
                          >
                            <span className="mt-0.5">
                              {isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-slate-600" />
                              )}
                            </span>
                            <span className="leading-snug">
                              Aula {lesson.lessonNumber}: {lesson.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Right Column: Active Lesson Content */}
        <div className={`${isFocusMode ? 'lg:col-span-12' : 'lg:col-span-8'} space-y-6`}>
          <article className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            {/* Lesson Header */}
            <header className="border-b border-slate-800 pb-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Módulo {currentLesson.moduleNumber} · {currentLesson.moduleTitle}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {currentLesson.estimatedMinutes} min
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {currentLesson.level}
                  </span>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 mb-2">
                Aula {currentLesson.lessonNumber} — {currentLesson.title}
              </h1>

              <p className="text-sm text-slate-400 leading-relaxed">
                {currentLesson.description}
              </p>
            </header>

            {/* Theory Content Body */}
            <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4">
              <div
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: currentLesson.content
                    .replace(/### (.*)/g, '<h3 class="text-base font-bold text-amber-300 mt-4 mb-2">$1</h3>')
                    .replace(/#### (.*)/g, '<h4 class="text-sm font-semibold text-slate-200 mt-3 mb-1">$1</h4>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-200 font-bold">$1</strong>')
                    .replace(/\* (.*)/g, '<li class="list-disc ml-4 text-slate-300">$1</li>'),
                }}
              />
            </div>

            {/* Practical Application on Instrument */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Aplicação Prática no Instrumento ({currentLesson.practicalApplication.instrument})
                </span>

                {currentLesson.practicalApplication.chordsOrNotes && (
                  <button
                    type="button"
                    onClick={() => {
                      if (currentLesson.practicalApplication.chordsOrNotes) {
                        audioSynth.playChordNotes(
                          currentLesson.practicalApplication.chordsOrNotes,
                          1.6,
                          true
                        );
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Ouvir Exemplo</span>
                  </button>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentLesson.practicalApplication.instructions}
              </p>

              {currentLesson.practicalApplication.chordsOrNotes && (
                <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
                  <span className="text-slate-400">Notas / Acordes:</span>
                  {currentLesson.practicalApplication.chordsOrNotes.map((item) => (
                    <span
                      key={item}
                      onClick={() => audioSynth.playNote(item, 4, 1.2)}
                      className="cursor-pointer px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 rounded font-semibold transition-colors"
                      title="Clique para ouvir"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Key Takeaways / Resumo */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 sm:p-5 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Pontos-Chave / Resumo da Aula
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {currentLesson.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Inline Exercise */}
            <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Exercício de Fixação</span>
              </div>

              <p className="text-sm font-semibold text-slate-100">
                {currentLesson.exercise.question}
              </p>

              <div className="space-y-2">
                {currentLesson.exercise.options.map((option, idx) => {
                  let optStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800';

                  if (exerciseSubmitted) {
                    if (idx === currentLesson.exercise.correctIndex) {
                      optStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-semibold';
                    } else if (idx === selectedExerciseOption) {
                      optStyle = 'bg-rose-950/60 border-rose-500 text-rose-300';
                    }
                  } else if (selectedExerciseOption === idx) {
                    optStyle = 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={exerciseSubmitted}
                      onClick={() => setSelectedExerciseOption(idx)}
                      className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm flex items-center justify-between transition-all ${optStyle}`}
                    >
                      <span>{option}</span>
                      {exerciseSubmitted && idx === currentLesson.exercise.correctIndex && (
                        <Check className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {!exerciseSubmitted ? (
                <button
                  type="button"
                  disabled={selectedExerciseOption === null}
                  onClick={handleExerciseSubmit}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                >
                  Conferir Resposta
                </button>
              ) : (
                <div
                  className={`p-3 rounded-lg text-xs leading-relaxed ${
                    selectedExerciseOption === currentLesson.exercise.correctIndex
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  <strong className="block mb-1">
                    {selectedExerciseOption === currentLesson.exercise.correctIndex
                      ? '✓ Parabéns! Resposta Correta.'
                      : '✗ Resposta Incorreta.'}
                  </strong>
                  {currentLesson.exercise.explanation}
                </div>
              )}
            </div>

            {/* Mark as Completed Button */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                type="button"
                onClick={toggleComplete}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleted ? 'Aula Concluída ✓' : 'Marcar como Concluída'}</span>
              </button>

              {/* Prev / Next Lesson Navigation */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {prevLesson && (
                  <button
                    type="button"
                    onClick={() => handleLessonChange(prevLesson.id)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Aula Anterior</span>
                  </button>
                )}

                {nextLesson && (
                  <button
                    type="button"
                    onClick={() => handleLessonChange(nextLesson.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-sm"
                  >
                    <span>Próxima Aula</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
