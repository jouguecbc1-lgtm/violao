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

type ExerciseType =
  | 'infinite_251'
  | 'chord_id'
  | 'degree_id'
  | 'number_system'
  | 'transposition'
  | 'ear_training'
  | 'harmonic_function';

interface GeneratedExercise {
  type: ExerciseType;
  prompt: string;
  context?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  audioNotes?: string[];
  audioNotesSecondary?: string[];
  isEarTraining?: boolean;
}

export const Exercicios: React.FC<ExerciciosProps> = ({ stats, onUpdateStats }) => {
  const [selectedType, setSelectedType] = useState<ExerciseType>('infinite_251');
  const [currentExercise, setCurrentExercise] = useState<GeneratedExercise | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [sessionStreak, setSessionStreak] = useState<number>(0);

  // Generate a random dynamic mathematical exercise
  const generateNewExercise = (type: ExerciseType): GeneratedExercise => {
    const randomKey = KEY_LIST[Math.floor(Math.random() * KEY_LIST.length)];
    const field = getMajorHarmonicField(randomKey);
    const twoFiveOne = get251(randomKey, 'major');

    if (type === 'infinite_251') {
      // Procedural 2-5-1 in any key
      const correctAns = `${twoFiveOne.ii.chord} → ${twoFiveOne.V.chord} → ${twoFiveOne.I.chord}`;
      const otherKeys = KEY_LIST.filter((k) => k !== randomKey).slice(0, 3);
      const wrongOptions = otherKeys.map((k) => {
        const t = get251(k, 'major');
        return `${t.ii.chord} → ${t.V.chord} → ${t.I.chord}`;
      });
      const options = [correctAns, ...wrongOptions].sort(() => Math.random() - 0.5);

      return {
        type: 'infinite_251',
        prompt: `Qual é a sequência da progressão II – V – I na tonalidade de ${randomKey} Maior?`,
        context: `Tonalidade: ${randomKey} Maior`,
        options,
        correctIndex: options.indexOf(correctAns),
        explanation: `Na escala de ${randomKey} Maior, o II é ${twoFiveOne.ii.chord} (m7), o V é ${twoFiveOne.V.chord} (7) e o I é ${twoFiveOne.I.chord} (maj7).`,
        audioNotes: twoFiveOne.I.notes,
      };
    } else if (type === 'number_system') {
      // Number system (Treino por Números Romanos)
      const patterns = [
        { roman: 'II – V – I', solve: () => `${twoFiveOne.ii.chord} – ${twoFiveOne.V.chord} – ${twoFiveOne.I.chord}` },
        {
          roman: 'I – IV – V – I',
          solve: () =>
            `${field.degrees[0].tetrad.symbol} – ${field.degrees[3].tetrad.symbol} – ${field.degrees[4].tetrad.symbol} – ${field.degrees[0].tetrad.symbol}`,
        },
        {
          roman: 'VI – II – V – I',
          solve: () =>
            `${field.degrees[5].tetrad.symbol} – ${twoFiveOne.ii.chord} – ${twoFiveOne.V.chord} – ${twoFiveOne.I.chord}`,
        },
      ];
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      const correctAns = pattern.solve();

      const otherKeys = KEY_LIST.filter((k) => k !== randomKey).slice(0, 3);
      const wrongOptions = otherKeys.map((k) => {
        const f = getMajorHarmonicField(k);
        const t = get251(k, 'major');
        if (pattern.roman === 'II – V – I') return `${t.ii.chord} – ${t.V.chord} – ${t.I.chord}`;
        if (pattern.roman === 'VI – II – V – I') return `${f.degrees[5].tetrad.symbol} – ${t.ii.chord} – ${t.V.chord} – ${t.I.chord}`;
        return `${f.degrees[0].tetrad.symbol} – ${f.degrees[3].tetrad.symbol} – ${f.degrees[4].tetrad.symbol} – ${f.degrees[0].tetrad.symbol}`;
      });

      const options = [correctAns, ...wrongOptions].sort(() => Math.random() - 0.5);

      return {
        type: 'number_system',
        prompt: `Aplique a progressão [ ${pattern.roman} ] na tonalidade de ${randomKey} Maior:`,
        context: `Pensamento por Graus Romanos`,
        options,
        correctIndex: options.indexOf(correctAns),
        explanation: `Pensando nos graus de ${randomKey} Maior: ${pattern.roman} resulta em: ${correctAns}.`,
        audioNotes: twoFiveOne.I.notes,
      };
    } else if (type === 'ear_training') {
      // Ear Training (Treino de Ouvido)
      const isProgressionTest = Math.random() > 0.5;

      if (isProgressionTest) {
        const options = ['II → V (Preparação → Tensão)', 'V → I (Tensão → Resolução)', 'I → IV (Tônica → Subdominante)', 'IV → V (Subdominante → Dominante)'];
        const correctIndex = 1; // V -> I
        return {
          type: 'ear_training',
          prompt: 'Ouça com atenção os 2 acordes tocados. Qual relação harmônica você ouviu?',
          context: 'Treino de Percepção Harmônica de Cadência',
          options,
          correctIndex,
          explanation: `Você ouviu uma cadência Dominante → Tônica (V → I, tensão do trítono se resolvendo na tônica).`,
          audioNotes: twoFiveOne.V.notes,
          audioNotesSecondary: twoFiveOne.I.notes,
          isEarTraining: true,
        };
      } else {
        // Chord recognition by ear
        const degree = field.degrees[Math.floor(Math.random() * 3)]; // I, II or V
        const correctChord = degree.tetrad.symbol;
        const fakeChords = [twoFiveOne.ii.chord, twoFiveOne.V.chord, twoFiveOne.I.chord, field.degrees[5].tetrad.symbol];
        const uniqueOptions = Array.from(new Set(fakeChords)).slice(0, 4).sort(() => Math.random() - 0.5);

        return {
          type: 'ear_training',
          prompt: 'Ouça o acorde reproduzido. Qual acorde da tonalidade de ' + randomKey + ' Maior foi tocado?',
          context: 'Reconhecimento Auditivo de Tétrades',
          options: uniqueOptions,
          correctIndex: uniqueOptions.indexOf(correctChord) !== -1 ? uniqueOptions.indexOf(correctChord) : 0,
          explanation: `O acorde tocado foi ${correctChord} (${degree.tetrad.quality}, grau ${degree.romanNumeral}).`,
          audioNotes: degree.tetrad.notes,
          isEarTraining: true,
        };
      }
    } else if (type === 'harmonic_function') {
      // Reconhecimento de Funções Harmônicas
      const degree = field.degrees[Math.floor(Math.random() * field.degrees.length)];
      const functions = ['Tônica (Repouso)', 'Subdominante (Movimento/Preparação)', 'Dominante (Tensão com Trítono)'];
      let correctIdx = 0;
      if (degree.function === 'Tônica') correctIdx = 0;
      else if (degree.function === 'Subdominante') correctIdx = 1;
      else correctIdx = 2;

      return {
        type: 'harmonic_function',
        prompt: `Na tonalidade de ${randomKey} Maior, qual é a Função Harmônica primordial do acorde ${degree.tetrad.symbol} (${degree.romanNumeral})?`,
        context: 'Análise de Funções Harmônicas',
        options: functions,
        correctIndex: correctIdx,
        explanation: `O acorde ${degree.tetrad.symbol} é o grau ${degree.romanNumeral}, exercendo a função de ${degree.function} (${degree.functionDescription}).`,
        audioNotes: degree.tetrad.notes,
      };
    } else if (type === 'chord_id') {
      const degree = field.degrees[Math.floor(Math.random() * field.degrees.length)];
      const notesStr = degree.tetrad.notes.join(' – ');
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
        prompt: `Qual acorde é formado pelas notas: ${notesStr}?`,
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
    } else {
      // Transposition
      const targetKey = KEY_LIST.filter((k) => k !== randomKey)[
        Math.floor(Math.random() * (KEY_LIST.length - 1))
      ];
      const target251 = get251(targetKey, 'major');
      const correctAns = `${target251.ii.chord} → ${target251.V.chord} → ${target251.I.chord}`;

      const wrongKeys = KEY_LIST.filter((k) => k !== targetKey).slice(0, 3);
      const wrongAns = wrongKeys.map((wk) => {
        const t = get251(wk, 'major');
        return `${t.ii.chord} → ${t.V.chord} → ${t.I.chord}`;
      });

      const options = [correctAns, ...wrongAns].sort(() => Math.random() - 0.5);

      return {
        type: 'transposition',
        prompt: `Desafio de Transposição: Transponha o II-V-I de ${randomKey} Maior para ${targetKey} Maior:`,
        context: `${twoFiveOne.ii.chord} → ${twoFiveOne.V.chord} → ${twoFiveOne.I.chord}`,
        options,
        correctIndex: options.indexOf(correctAns),
        explanation: `Em ${targetKey} Maior, o II vira ${target251.ii.chord}, o V vira ${target251.V.chord} e o I vira ${target251.I.chord}.`,
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
            { id: 'infinite_251', label: '🎲 II-V-I Infinito' },
            { id: 'number_system', label: '🎼 Treino por Números' },
            { id: 'ear_training', label: '🎧 Treino de Ouvido' },
            { id: 'harmonic_function', label: '👂 Funções Harmônicas' },
            { id: 'transposition', label: '🔄 Transposição' },
            { id: 'chord_id', label: '🎹 Identificar Acorde' },
            { id: 'degree_id', label: '🏛️ Identificar Grau' },
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {currentExercise.context && (
            <div className="text-xs font-mono font-bold text-amber-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 inline-block">
              {currentExercise.context}
            </div>
          )}

          {/* Audio trigger for Ear Training */}
          {currentExercise.isEarTraining && (
            <button
              type="button"
              onClick={() => {
                if (currentExercise.audioNotesSecondary) {
                  audioSynth.playProgression([currentExercise.audioNotes!, currentExercise.audioNotesSecondary], 75);
                } else if (currentExercise.audioNotes) {
                  audioSynth.playChordNotes(currentExercise.audioNotes, 1.8, true);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
            >
              <Volume2 className="w-4 h-4 fill-current" />
              <span>🔊 Tocar / Ouvir Novamente</span>
            </button>
          )}
        </div>

        <h2 className="text-lg sm:text-xl font-extrabold text-slate-100 leading-snug">
          {currentExercise.prompt}
        </h2>

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
