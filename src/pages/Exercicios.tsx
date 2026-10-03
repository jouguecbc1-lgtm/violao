import React, { useState, useEffect } from 'react';
import {
  PenTool,
  CheckCircle,
  XCircle,
  RotateCcw,
  Sparkles,
  Award,
  HelpCircle,
  Volume2,
} from 'lucide-react';
import { UserStats } from '../types';
import { audioSynth } from '../services/audioSynth';
import { KEY_LIST, get251, getMajorHarmonicField } from '../utils/musicTheory';

interface ExerciciosProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
}

type ExerciseType = 'chord_id' | 'degree_id' | 'complete_prog' | 'transposition';

interface GeneratedExercise {
  type: ExerciseType;
  prompt: string;
  context?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  audioNotes?: string[];
}

export const Exercicios: React.FC<ExerciciosProps> = ({ stats, onUpdateStats }) => {
  const [selectedType, setSelectedType] = useState<ExerciseType>('chord_id');
  const [currentExercise, setCurrentExercise] = useState<GeneratedExercise | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [sessionStreak, setSessionStreak] = useState<number>(0);

  // Generate a random dynamic exercise based on selected type
  const generateNewExercise = (type: ExerciseType): GeneratedExercise => {
    const randomKey = KEY_LIST[Math.floor(Math.random() * KEY_LIST.length)];
    const field = getMajorHarmonicField(randomKey);
    const twoFiveOne = get251(randomKey, 'major');

    if (type === 'chord_id') {
      // Pick random chord from the field
      const degree = field.degrees[Math.floor(Math.random() * field.degrees.length)];
      const notesStr = degree.tetrad.notes.join(' – ');

      // Generate 3 plausible distractors
      const distractors = [
        `${degree.note}maj7`,
        `${degree.note}m7`,
        `${degree.note}7`,
        `${degree.note}m7(b5)`,
      ].filter((sym) => sym !== degree.tetrad.symbol);

      const options = [degree.tetrad.symbol, ...distractors.slice(0, 3)].sort(
        () => Math.random() - 0.5
      );

      return {
        type: 'chord_id',
        prompt: `Quais acorde é formado pelas notas: ${notesStr}?`,
        context: 'Identificação de Acordes por Tétrades',
        options,
        correctIndex: options.indexOf(degree.tetrad.symbol),
        explanation: `O acorde ${degree.tetrad.symbol} (${degree.tetrad.quality}) é formado por: ${notesStr}.`,
        audioNotes: degree.tetrad.notes,
      };
    } else if (type === 'degree_id') {
      const degree = field.degrees[Math.floor(Math.random() * field.degrees.length)];
      const roman = degree.romanNumeral;

      const romanOptions = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
      const wrongRomans = romanOptions.filter((r) => r !== roman).sort(() => Math.random() - 0.5);
      const options = [roman, ...wrongRomans.slice(0, 3)].sort(() => Math.random() - 0.5);

      return {
        type: 'degree_id',
        prompt: `Na tonalidade de ${randomKey} Maior, o acorde ${degree.tetrad.symbol} corresponde a qual grau?`,
        context: `Campo Harmônico de ${randomKey} Maior`,
        options: options.map((r) => `Grau ${r}`),
        correctIndex: options.indexOf(roman),
        explanation: `No campo harmônico de ${randomKey} Maior, o acorde ${degree.tetrad.symbol} é o grau ${roman} (${degree.function}).`,
        audioNotes: degree.tetrad.notes,
      };
    } else if (type === 'complete_prog') {
      const options = [
        twoFiveOne.I.chord,
        `${twoFiveOne.I.chord.replace('maj7', '7')}`,
        `${twoFiveOne.V.chord}`,
        `${field.degrees[3].tetrad.symbol}`,
      ].sort(() => Math.random() - 0.5);

      return {
        type: 'complete_prog',
        prompt: `Complete a cadência 2-5-1 na tonalidade de ${randomKey} Maior:`,
        context: `${twoFiveOne.ii.chord} → ${twoFiveOne.V.chord} → ?`,
        options,
        correctIndex: options.indexOf(twoFiveOne.I.chord),
        explanation: `A progressão II-V-I em ${randomKey} Maior é: ${twoFiveOne.ii.chord} (II) → ${twoFiveOne.V.chord} (V) → ${twoFiveOne.I.chord} (I).`,
        audioNotes: twoFiveOne.I.notes,
      };
    } else {
      // Transposition
      const targetKey = KEY_LIST.filter((k) => k !== randomKey)[
        Math.floor(Math.random() * (KEY_LIST.length - 1))
      ];
      const target251 = get251(targetKey, 'major');

      const correctAns = `${target251.ii.chord} → ${target251.V.chord} → ${target251.I.chord}`;

      // Fake targets
      const wrongKeys = KEY_LIST.filter((k) => k !== targetKey).slice(0, 3);
      const wrongAns = wrongKeys.map((wk) => {
        const t = get251(wk, 'major');
        return `${t.ii.chord} → ${t.V.chord} → ${t.I.chord}`;
      });

      const options = [correctAns, ...wrongAns].sort(() => Math.random() - 0.5);

      return {
        type: 'transposition',
        prompt: `Transponha a progressão II-V-I de ${randomKey} Maior para ${targetKey} Maior:`,
        context: `${twoFiveOne.ii.chord} → ${twoFiveOne.V.chord} → ${twoFiveOne.I.chord}`,
        options,
        correctIndex: options.indexOf(correctAns),
        explanation: `Ao transpor para ${targetKey} Maior, o II vira ${target251.ii.chord}, o V vira ${target251.V.chord} e o I vira ${target251.I.chord}.`,
        audioNotes: target251.I.notes,
      };
    }
  };

  useEffect(() => {
    setCurrentExercise(generateNewExercise(selectedType));
    setSelectedOption(null);
    setIsAnswered(false);
  }, [selectedType]);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentExercise?.correctIndex;
    if (isCorrect) {
      setSessionStreak((s) => s + 1);
      if (currentExercise?.audioNotes) {
        audioSynth.playChordNotes(currentExercise.audioNotes, 1.2);
      }
    } else {
      setSessionStreak(0);
    }

    onUpdateStats({
      ...stats,
      exercisesAttempted: stats.exercisesAttempted + 1,
      exercisesCorrect: isCorrect ? stats.exercisesCorrect + 1 : stats.exercisesCorrect,
    });
  };

  const handleNext = () => {
    setCurrentExercise(generateNewExercise(selectedType));
    setSelectedOption(null);
    setIsAnswered(false);
  };

  if (!currentExercise) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Exercise Mode Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'chord_id', label: '1. Identifique o Acorde' },
            { id: 'degree_id', label: '2. Identifique o Grau' },
            { id: 'complete_prog', label: '3. Complete a Progressão' },
            { id: 'transposition', label: '4. Transposição' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedType(tab.id as ExerciseType)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedType === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Streak counter */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sequência: {sessionStreak}</span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          {currentExercise.context && (
            <div className="text-xs font-mono font-bold text-amber-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 inline-block mb-3">
              {currentExercise.context}
            </div>
          )}
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-100 leading-snug">
            {currentExercise.prompt}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentExercise.options.map((opt, idx) => {
            let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-850';

            if (isAnswered) {
              if (idx === currentExercise.correctIndex) {
                btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold shadow-md';
              } else if (idx === selectedOption) {
                btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
              } else {
                btnStyle = 'opacity-40 border-slate-800';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-xl border text-sm sm:text-base font-mono flex items-center justify-between transition-all ${btnStyle}`}
              >
                <span>{opt}</span>
                {isAnswered && idx === currentExercise.correctIndex && (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                )}
                {isAnswered && idx === selectedOption && idx !== currentExercise.correctIndex && (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Button */}
        {isAnswered && (
          <div className="space-y-4 pt-2 border-t border-slate-800 animate-in fade-in duration-200">
            <div
              className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed border ${
                selectedOption === currentExercise.correctIndex
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-950/40 text-rose-300 border-rose-500/40'
              }`}
            >
              <strong className="block mb-1 font-bold">
                {selectedOption === currentExercise.correctIndex ? '✓ Correto!' : '✗ Incorreto.'}
              </strong>
              {currentExercise.explanation}
            </div>

            <div className="flex items-center justify-between">
              {currentExercise.audioNotes && (
                <button
                  type="button"
                  onClick={() =>
                    currentExercise.audioNotes &&
                    audioSynth.playChordNotes(currentExercise.audioNotes, 1.4)
                  }
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Ouvir Resposta</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md"
              >
                Próxima Pergunta →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
