import React, { useState } from 'react';
import { Volume2, KeyRound, Sparkles, ArrowRight } from 'lucide-react';
import { KEY_LIST, noteToSemitone, semitoneToNote, getChordInversions } from '../utils/musicTheory';
import { audioSynth } from '../services/audioSynth';
import { PianoKeyboard } from '../components/PianoKeyboard';
import { FretboardDiagram } from '../components/FretboardDiagram';

interface ChordFormulaType {
  suffix: string;
  name: string;
  category: 'Tríade' | 'Tétrade';
  intervals: string[];
  semitonesFromRoot: number[];
  description: string;
}

const CHORD_TYPES: ChordFormulaType[] = [
  // TRÍADES
  {
    suffix: '',
    name: 'Maior',
    category: 'Tríade',
    intervals: ['1', '3', '5'],
    semitonesFromRoot: [0, 4, 7],
    description: 'Tônica + 3ª Maior (4 ST) + 5ª Justa (7 ST). Som brilhante e aberto.',
  },
  {
    suffix: 'm',
    name: 'Menor',
    category: 'Tríade',
    intervals: ['1', 'b3', '5'],
    semitonesFromRoot: [0, 3, 7],
    description: 'Tônica + 3ª Menor (3 ST) + 5ª Justa (7 ST). Som emotivo e contemplativo.',
  },
  {
    suffix: '°',
    name: 'Diminuto',
    category: 'Tríade',
    intervals: ['1', 'b3', 'b5'],
    semitonesFromRoot: [0, 3, 6],
    description: 'Tônica + 3ª Menor (3 ST) + 5ª Diminuta (6 ST). Contém o trítono instável.',
  },
  {
    suffix: 'aug',
    name: 'Aumentado',
    category: 'Tríade',
    intervals: ['1', '3', '#5'],
    semitonesFromRoot: [0, 4, 8],
    description: 'Tônica + 3ª Maior (4 ST) + 5ª Aumentada (8 ST). Soa flutuante e suspenso.',
  },

  // TÉTRADES
  {
    suffix: 'maj7',
    name: 'Maior com 7ª Maior',
    category: 'Tétrade',
    intervals: ['1', '3', '5', '7M'],
    semitonesFromRoot: [0, 4, 7, 11],
    description: 'Tríade Maior + 7ª Maior (11 ST). O clássico som relaxante e límpido do I e IV graus.',
  },
  {
    suffix: 'm7',
    name: 'Menor com 7ª',
    category: 'Tétrade',
    intervals: ['1', 'b3', '5', '7'],
    semitonesFromRoot: [0, 3, 7, 10],
    description: 'Tríade Menor + 7ª Menor (10 ST). Presente nos graus II, III e VI.',
  },
  {
    suffix: '7',
    name: 'Dominante com 7ª',
    category: 'Tétrade',
    intervals: ['1', '3', '5', '7'],
    semitonesFromRoot: [0, 4, 7, 10],
    description: 'Tríade Maior + 7ª Menor (10 ST). Possui o trítono entre a 3ª e a 7ª (grau V).',
  },
  {
    suffix: 'm7(b5)',
    name: 'Meio-Diminuto',
    category: 'Tétrade',
    intervals: ['1', 'b3', 'b5', '7'],
    semitonesFromRoot: [0, 3, 6, 10],
    description: 'Tríade Diminuta + 7ª Menor (10 ST). Essencial para o 2-5-1 menor e grau VII.',
  },
  {
    suffix: '°7',
    name: 'Diminuto com 7ª Diminuta',
    category: 'Tétrade',
    intervals: ['1', 'b3', 'b5', 'bb7'],
    semitonesFromRoot: [0, 3, 6, 9],
    description: 'Simetria perfeita de 3 em 3 semitons. O acorde diminuto completo da menor harmônica.',
  },
];

export const Acordes: React.FC = () => {
  const [selectedRoot, setSelectedRoot] = useState<string>('C');
  const [selectedChordType, setSelectedChordType] = useState<ChordFormulaType>(CHORD_TYPES[4]); // Cmaj7 default
  const [instrumentView, setInstrumentView] = useState<'piano' | 'violao'>('piano');

  const rootSemi = noteToSemitone(selectedRoot);
  const notes = selectedChordType.semitonesFromRoot.map((semi) =>
    semitoneToNote(rootSemi + semi, ['F', 'Bb', 'Eb', 'Ab', 'Db'].includes(selectedRoot))
  );

  const fullChordSymbol = `${selectedRoot}${selectedChordType.suffix}`;
  const inversions = getChordInversions(fullChordSymbol, notes);

  const playChord = () => {
    audioSynth.playChordNotes(notes, 1.8, true);
  };

  return (
    <div className="space-y-6">
      {/* Selector Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <span>Dicionário e Construtor de Acordes</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Fórmulas intervalares de Tríades e Tétrades, notas formadoras e inversões
            </p>
          </div>

          <button
            type="button"
            onClick={playChord}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 self-start sm:self-auto"
          >
            <Volume2 className="w-4 h-4" />
            <span>Tocar {fullChordSymbol}</span>
          </button>
        </div>

        {/* 12 Root Notes Bar */}
        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-2">Fundamental (Tônica):</span>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
            {KEY_LIST.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedRoot(key)}
                className={`py-2 px-1 text-xs font-bold rounded-lg transition-all ${
                  selectedRoot === key
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Chord Qualities Filter */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block">Qualidade do Acorde:</span>
          <div className="flex flex-wrap gap-1.5">
            {CHORD_TYPES.map((type) => {
              const isSelected = selectedChordType.name === type.name;
              return (
                <button
                  key={type.name}
                  type="button"
                  onClick={() => setSelectedChordType(type)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:text-slate-100'
                  }`}
                >
                  <span>
                    {selectedRoot}
                    {type.suffix}
                  </span>
                  <span className="text-[10px] opacity-75 font-normal">({type.name})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Chord Detail Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-black text-amber-400 font-mono tracking-tight">
                {fullChordSymbol}
              </h3>
              <span className="text-sm font-semibold text-slate-200">
                {selectedRoot} {selectedChordType.name}
              </span>
              <span className="text-xs text-slate-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded font-mono">
                {selectedChordType.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{selectedChordType.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setInstrumentView('piano')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                instrumentView === 'piano'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              Piano
            </button>
            <button
              type="button"
              onClick={() => setInstrumentView('violao')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                instrumentView === 'violao'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              Violão
            </button>
          </div>
        </div>

        {/* Intervals and notes pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {notes.map((note, idx) => (
            <div
              key={idx}
              onClick={() => audioSynth.playNote(note, 4, 1.2)}
              className="cursor-pointer bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-amber-500/50 text-center transition-colors group"
            >
              <span className="text-[10px] text-amber-400 font-bold block mb-1">
                Intervalo: {selectedChordType.intervals[idx]}
              </span>
              <div className="text-xl font-black text-slate-100 group-hover:text-amber-300 font-mono">
                {note}
              </div>
            </div>
          ))}
        </div>

        {/* Visual instrument component */}
        {instrumentView === 'piano' ? (
          <div className="py-2">
            <PianoKeyboard
              highlightNotes={notes}
              bassNote={selectedRoot}
              guideTones={{
                third: notes[1],
                seventh: notes[3],
              }}
              octaves={2}
            />
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <FretboardDiagram chordName={fullChordSymbol} notes={notes} />
          </div>
        )}
      </div>

      {/* Chord Inversions Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <span>Inversões de {fullChordSymbol}</span>
        </h4>
        <p className="text-xs text-slate-400">
          Mude a nota mais grave (baixo) do acorde para criar linhas de condução melódicas suaves
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {inversions.map((inv, idx) => (
            <div
              key={idx}
              onClick={() => audioSynth.playChordNotes(inv.notes, 1.5, true)}
              className="cursor-pointer bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-amber-500/50 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1">
                <span>{inv.name}</span>
                <Volume2 className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs text-slate-300 mb-2">
                Baixo: <strong className="text-amber-300 font-mono text-sm">{inv.bass}</strong>
              </div>
              <div className="font-mono text-xs text-slate-400 bg-slate-900 p-2 rounded mb-2">
                {inv.notes.join(' – ')}
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{inv.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
