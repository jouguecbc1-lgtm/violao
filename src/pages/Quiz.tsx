import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Award, Sparkles } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { QuizQuestion, UserStats } from '../types';
import confetti from 'canvas-confetti';

interface QuizProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
}

export const Quiz: React.FC<QuizProps> = ({ stats, onUpdateStats }) => {
  const [level, setLevel] = useState<'iniciante' | 'intermediario' | 'avancado'>('iniciante');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const levelQuestions = QUIZ_QUESTIONS.filter((q) => q.level === level);
  const currentQ: QuizQuestion = levelQuestions[currentIndex] || levelQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
    }

    onUpdateStats({
      ...stats,
      exercisesAttempted: stats.exercisesAttempted + 1,
      exercisesCorrect: isCorrect ? stats.exercisesCorrect + 1 : stats.exercisesCorrect,
    });
  };

  const handleNext = () => {
    if (currentIndex < levelQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      if (score >= Math.round(levelQuestions.length * 0.7)) {
        try {
          confetti({ particleCount: 70, spread: 60 });
        } catch {
          // ignore
        }
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  const handleLevelChange = (lvl: 'iniciante' | 'intermediario' | 'avancado') => {
    setLevel(lvl);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Level Selector Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleLevelChange('iniciante')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              level === 'iniciante'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-slate-100'
            }`}
          >
            <span>🟢 Iniciante</span>
          </button>
          <button
            type="button"
            onClick={() => handleLevelChange('intermediario')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              level === 'intermediario'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-slate-100'
            }`}
          >
            <span>🟡 Intermediário</span>
          </button>
          <button
            type="button"
            onClick={() => handleLevelChange('avancado')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              level === 'avancado'
                ? 'bg-rose-500 text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-slate-100'
            }`}
          >
            <span>🔴 Avançado</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Pergunta <strong className="text-slate-100">{currentIndex + 1}</strong> de{' '}
          {levelQuestions.length}
        </div>
      </div>

      {isFinished ? (
        /* Results Screen */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto shadow-lg">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-100 mb-2">Quiz Concluído!</h2>
            <p className="text-sm text-slate-400">
              Você completou o módulo de perguntas no nível{' '}
              <strong className="text-slate-200 capitalize">{level}</strong>.
            </p>
          </div>

          <div className="text-4xl font-black text-amber-400 font-mono">
            {score} <span className="text-xl text-slate-500">/ {levelQuestions.length}</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            {score === levelQuestions.length
              ? 'Desempenho perfeito! Você domina com maestria os conceitos testados.'
              : score >= Math.round(levelQuestions.length * 0.7)
              ? 'Excelente aproveitamento! Seu conhecimento em harmonia está muito sólido.'
              : 'Bom esforço! Recomendamos revisar as aulas deste módulo para aperfeiçoar sua pontuação.'}
          </p>

          <button
            type="button"
            onClick={handleRestart}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Tentar Novamente</span>
          </button>
        </div>
      ) : (
        /* Question Card */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded">
              Categoria: {currentQ.category.replace('_', ' ')}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              let style = 'bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800';

              if (isAnswered) {
                if (idx === currentQ.correctIndex) {
                  style = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                } else if (idx === selectedOption) {
                  style = 'bg-rose-950/80 border-rose-500 text-rose-300';
                } else {
                  style = 'opacity-40 border-slate-800';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-sm sm:text-base flex items-center justify-between transition-all ${style}`}
                >
                  <span>{opt}</span>
                  {isAnswered && idx === currentQ.correctIndex && (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next */}
          {isAnswered && (
            <div className="space-y-4 pt-3 border-t border-slate-800 animate-in fade-in duration-200">
              <div
                className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed border ${
                  selectedOption === currentQ.correctIndex
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                }`}
              >
                <strong className="block mb-1 font-bold">
                  {selectedOption === currentQ.correctIndex ? '✓ Resposta Certa!' : '✗ Resposta Incorreta.'}
                </strong>
                {currentQ.explanation}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md"
                >
                  {currentIndex < levelQuestions.length - 1 ? 'Próxima Questão →' : 'Ver Resultado Final'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
