import React, { useState } from 'react';
import { Flame, Play, Volume2, CheckCircle2, XCircle, RotateCcw, Headphones } from 'lucide-react';
import { KEY_LIST, get251, getMajorHarmonicField, noteToSemitone, semitoneToNote } from '../utils/musicTheory';
import { audioSynth } from '../services/audioSynth';
import { UserStats } from '../types';

interface TreinamentoProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
}

interface RapidFlashcard {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface EarTrainingChord {
  name: string;
  notes: string[];
}

export const Treinamento: React.FC<TreinamentoProps> = ({ stats, onUpdateStats }) => {
  const [activeTab, setActiveTab] = useState<'flashcard' | 'ear_training'>('flashcard');

  // Flashcard states
  const [currentCard, setCurrentCard] = useState<RapidFlashcard | null>(null);
  const [cardSelectedOption, setCardSelectedOption] = useState<number | null>(null);
  const [cardAnswered, setCardAnswered] = useState<boolean>(false);
  const [cardStreak, setCardStreak] = useState<number>(0);

  // Ear training states
  const [mysteryChord, setMysteryChord] = useState<EarTrainingChord | null>(null);
  const [earSelected, setEarSelected] = useState<string | null>(null);
  const [earAnswered, setEarAnswered] = useState<boolean>(false);
  const [earScore, setEarScore] = useState<number>(0);

  const generateFlashcard = (): RapidFlashcard => {
    const types = ['251', 'dominant', 'degree_chord', 'relative_minor'];
    const selectedType = types[Math.floor(Math.random() * types.length)];
    const randomKey = KEY_LIST[Math.floor(Math.random() * KEY_LIST.length)];
    const field = getMajorHarmonicField(randomKey);
    const twoFiveOne = get251(randomKey, 'major');

    if (selectedType === '251') {
      const correctAns = `${twoFiveOne.ii.chord} – ${twoFiveOne.V.chord} – ${twoFiveOne.I.chord}`;
      const wrongKeys = KEY_LIST.filter((k) => k !== randomKey).slice(0, 3);
      const wrongAns = wrongKeys.map((k) => {
        const t = get251(k, 'major');
        return `${t.ii.chord} – ${t.V.chord} – ${t.I.chord}`;
      });
      const options = [correctAns, ...wrongAns].sort(() => Math.random() - 0.5);

      return {
        question: `Qual é a progressão II-V-I na tonalidade de ${randomKey} Maior?`,
        options,
        correctIndex: options.indexOf(correctAns),
        explanation: `Na tonalidade de ${randomKey} Maior, o II é ${twoFiveOne.ii.chord}, o V é ${twoFiveOne.V.chord} e o I é ${twoFiveOne.I.chord}.`,
      };
    } else if (selectedType === 'dominant') {
      const domChord = `${field.degrees[4].note}7`;
      const wrong = ['7', 'maj7', 'm7'].map(
        (sfx, idx) => `${field.degrees[(idx + 1) % 6].note}${sfx}`
      );
      const options = [domChord, ...wrong].sort(() => Math.random() - 0.5);

      return {
        question: `Qual é o acorde Dominante (Grau V) de ${randomKey} Maior?`,
        options,
        correctIndex: options.indexOf(domChord),
        explanation: `O quinto grau de ${randomKey} Maior é ${domChord}.`,
      };
    } else if (selectedType === 'degree_chord') {
      const degree = field.degrees[1]; // II
      const correctAns = degree.tetrad.symbol;
      const wrong = [
        field.degrees[0].tetrad.symbol,
        field.degrees[3].tetrad.symbol,
        field.degrees[4].tetrad.symbol,
      ];
      const options = [correctAns, ...wrong].sort(() => Math.random() - 0.5);

      return {
        question: `Qual acorde corresponde ao grau II em ${randomKey} Maior?`,
        options,
        correctIndex: options.indexOf(correctAns),
        explanation: `O grau II de ${randomKey} Maior é ${correctAns}.`,
      };
    } else {
      // Relative minor
      const relMinor = `${field.degrees[5].note}m`;
      const wrong = [
        `${field.degrees[1].note}m`,
        `${field.degrees[2].note}m`,
        `${field.degrees[0].note}m`,
      ];
      const options = [relMinor, ...wrong].sort(() => Math.random() - 0.5);

      return {
        question: `Qual é a Relativa Menor da tonalidade de ${randomKey} Maior?`,
        options,
        correctIndex: options.indexOf(relMinor),
        explanation: `A relativa menor de ${randomKey} Maior é o VI grau: ${relMinor}.`,
      };
    }
  };

  const generateEarTrainingChord = (): EarTrainingChord => {
    const root = KEY_LIST[Math.floor(Math.random() * KEY_LIST.length)];
    const rSemi = noteToSemitone(root);

    const types = [
      { name: 'Tríade Maior', semitones: [0, 4, 7] },
      { name: 'Tríade Menor', semitones: [0, 3, 7] },
      { name: 'Maior com 7ª Maior (Maj7)', semitones: [0, 4, 7, 11] },
      { name: 'Menor com 7ª (m7)', semitones: [0, 3, 7, 10] },
      { name: 'Dominante (7)', semitones: [0, 4, 7, 10] },
      { name: 'Meio-Diminuto [m7(b5)]', semitones: [0, 3, 6, 10] },
    ];

    const pick = types[Math.floor(Math.random() * types.length)];
    const notes = pick.semitones.map((s) => semitoneToNote(rSemi + s));

    return {
      name: pick.name,
      notes,
    };
  };

  // Init flashcard
  React.useEffect(() => {
    setCurrentCard(generateFlashcard());
    const ear = generateEarTrainingChord();
    setMysteryChord(ear);
  }, []);

  const handleSelectCardOption = (idx: number) => {
    if (cardAnswered) return;
    setCardSelectedOption(idx);
    setCardAnswered(true);

    const isCorrect = idx === currentCard?.correctIndex;
    if (isCorrect) {
      setCardStreak((s) => s + 1);
    } else {
      setCardStreak(0);
    }

    onUpdateStats({
      ...stats,
      exercisesAttempted: stats.exercisesAttempted + 1,
      exercisesCorrect: isCorrect ? stats.exercisesCorrect + 1 : stats.exercisesCorrect,
    });
  };

  const handleNextCard = () => {
    setCurrentCard(generateFlashcard());
    setCardSelectedOption(null);
    setCardAnswered(false);
  };

  const playMystery = () => {
    if (mysteryChord) {
      audioSynth.playChordNotes(mysteryChord.notes, 2.0, true);
    }
  };

  const handleSelectEarOption = (name: string) => {
    if (earAnswered || !mysteryChord) return;
    setEarSelected(name);
    setEarAnswered(true);

    const isCorrect = name === mysteryChord.name;
    if (isCorrect) {
      setEarScore((s) => s + 1);
    }

    onUpdateStats({
      ...stats,
      exercisesAttempted: stats.exercisesAttempted + 1,
      exercisesCorrect: isCorrect ? stats.exercisesCorrect + 1 : stats.exercisesCorrect,
    });
  };

  const handleNextEar = () => {
    const nextChord = generateEarTrainingChord();
    setMysteryChord(nextChord);
    setEarSelected(null);
    setEarAnswered(false);
    setTimeout(() => {
      audioSynth.playChordNotes(nextChord.notes, 2.0, true);
    }, 200);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Mode Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('flashcard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'flashcard'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-slate-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Treinamento Rápido (Flashcards)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('ear_training');
              playMystery();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'ear_training'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-slate-100'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Percepção Auditiva (Ouvir Acordes)</span>
          </button>
        </div>
      </div>

      {activeTab === 'flashcard' ? (
        /* Flashcard View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Flashcard Harmônico Aleatório
            </span>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
              🔥 Sequência: {cardStreak}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-100 leading-snug">
            {currentCard?.question}
          </h2>

          <div className="space-y-2.5">
            {currentCard?.options.map((opt, idx) => {
              let style = 'bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800';
              if (cardAnswered) {
                if (idx === currentCard.correctIndex) {
                  style = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                } else if (idx === cardSelectedOption) {
                  style = 'bg-rose-950/80 border-rose-500 text-rose-300';
                } else {
                  style = 'opacity-40 border-slate-800';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={cardAnswered}
                  onClick={() => handleSelectCardOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-sm sm:text-base font-mono flex items-center justify-between transition-all ${style}`}
                >
                  <span>{opt}</span>
                  {cardAnswered && idx === currentCard.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                  {cardAnswered && idx === cardSelectedOption && idx !== currentCard.correctIndex && (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>

          {cardAnswered && (
            <div className="space-y-4 pt-3 border-t border-slate-800 animate-in fade-in duration-200">
              <div
                className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed border ${
                  cardSelectedOption === currentCard?.correctIndex
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                }`}
              >
                <strong className="block mb-1">
                  {cardSelectedOption === currentCard?.correctIndex ? '✓ Correto!' : '✗ Incorreto.'}
                </strong>
                {currentCard?.explanation}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextCard}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                >
                  Treinar Outra Questão →
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Ear Training View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 text-center">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Treinamento de Percepção Auditiva
            </span>
            <h2 className="text-xl font-extrabold text-slate-100">
              Ouça o acorde e identifique sua qualidade sonora
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Acertos acumulados: <strong className="text-emerald-400">{earScore}</strong>
            </p>
          </div>

          {/* Big Play Button */}
          <div className="py-4">
            <button
              type="button"
              onClick={playMystery}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 inline-flex items-center gap-3 transition-all"
            >
              <Volume2 className="w-5 h-5 fill-current" />
              <span>Ouvir Acorde Misterioso</span>
            </button>
          </div>

          {/* Chord Quality Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {[
              'Tríade Maior',
              'Tríade Menor',
              'Maior com 7ª Maior (Maj7)',
              'Menor com 7ª (m7)',
              'Dominante (7)',
              'Meio-Diminuto [m7(b5)]',
            ].map((option) => {
              let style = 'bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800';

              if (earAnswered) {
                if (option === mysteryChord?.name) {
                  style = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                } else if (option === earSelected) {
                  style = 'bg-rose-950/80 border-rose-500 text-rose-300';
                } else {
                  style = 'opacity-40 border-slate-800';
                }
              }

              return (
                <button
                  key={option}
                  type="button"
                  disabled={earAnswered}
                  onClick={() => handleSelectEarOption(option)}
                  className={`p-4 rounded-xl border text-sm font-semibold flex items-center justify-between transition-all ${style}`}
                >
                  <span>{option}</span>
                  {earAnswered && option === mysteryChord?.name && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  {earAnswered && option === earSelected && option !== mysteryChord?.name && (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>

          {earAnswered && (
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
              <div className="text-xs text-left text-slate-300">
                O acorde tocado era:{' '}
                <strong className="text-amber-400 font-bold">{mysteryChord?.name}</strong>{' '}
                (Notas: {mysteryChord?.notes.join(' – ')})
              </div>

              <button
                type="button"
                onClick={handleNextEar}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                Próximo Acorde Misterioso →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
