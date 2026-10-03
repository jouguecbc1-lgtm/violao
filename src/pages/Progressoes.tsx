import React, { useState } from 'react';
import { Play, Volume2, ArrowRightLeft, GitBranch, ArrowRight } from 'lucide-react';
import { PROGRESSION_TEMPLATES } from '../data/progressionsData';
import { ProgressionTemplate } from '../types';
import { KEY_LIST, transposeProgressionBetweenKeys } from '../utils/musicTheory';
import { audioSynth } from '../services/audioSynth';

interface ProgressoesProps {
  onNavigateToTransposer?: (prog: string[], fromKey: string) => void;
}

export const Progressoes: React.FC<ProgressoesProps> = ({
  onNavigateToTransposer,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [activeKey, setActiveKey] = useState<string>('C');
  const [playingProgId, setPlayingProgId] = useState<string | null>(null);

  const categories = ['Todas', 'Básicas', 'Jazz', 'Gospel', 'Pop', 'Bossa Nova'];

  const filtered = PROGRESSION_TEMPLATES.filter(
    (p) => selectedCategory === 'Todas' || p.category === selectedCategory
  );

  const handlePlay = (prog: ProgressionTemplate) => {
    setPlayingProgId(prog.id);
    const transposedChords = transposeProgressionBetweenKeys(
      prog.exampleChords,
      prog.exampleKey,
      activeKey
    );

    // Build notes list for Web Audio
    const chordsNotes = transposedChords.map((chord) => {
      const match = chord.match(/^([A-G][b#]?)(.*)$/);
      const root = match ? match[1] : 'C';
      const suffix = match ? match[2] : '';
      if (suffix.includes('m') && !suffix.includes('maj')) {
        return [root, 'Eb', 'G', 'Bb'];
      }
      if (suffix.includes('7') && !suffix.includes('maj')) {
        return [root, 'E', 'G', 'Bb'];
      }
      return [root, 'E', 'G', 'B'];
    });

    audioSynth.playProgression(
      chordsNotes,
      85,
      undefined,
      () => setPlayingProgId(null)
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-amber-400" />
              <span>Biblioteca de Progressões Harmônicas</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Padrões clássicos da música ocidental analisados em graus romanos e transponíveis para qualquer tom.
            </p>
          </div>

          {/* Key selector for testing */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Tonalidade Ativa:</span>
            <select
              value={activeKey}
              onChange={(e) => setActiveKey(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-amber-400 font-bold text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              {KEY_LIST.map((k) => (
                <option key={k} value={k}>
                  {k} Maior
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Progression Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((prog) => {
          const isPlaying = playingProgId === prog.id;
          const currentChords = transposeProgressionBetweenKeys(
            prog.exampleChords,
            prog.exampleKey,
            activeKey
          );

          return (
            <div
              key={prog.id}
              className={`bg-slate-900 border rounded-2xl p-5 sm:p-6 space-y-4 transition-all ${
                isPlaying
                  ? 'border-amber-500 ring-1 ring-amber-500/50 bg-amber-950/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      {prog.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {prog.romanNumerals.join(' – ')}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100">{prog.name}</h3>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlay(prog)}
                  className={`p-2 rounded-xl transition-all ${
                    isPlaying
                      ? 'bg-amber-500 text-slate-950 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                  title="Ouvir progressão"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Chords display in selected key */}
              <div className="flex items-center justify-between gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-center">
                {currentChords.map((chord, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex-1">
                      <span className="text-[10px] text-slate-500 block">
                        {prog.romanNumerals[idx] || `Grau ${idx + 1}`}
                      </span>
                      <strong className="text-sm sm:text-base text-amber-300 font-black">
                        {chord}
                      </strong>
                    </div>
                    {idx < currentChords.length - 1 && (
                      <span className="text-slate-600 text-xs">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {prog.description}
              </p>
              <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                {prog.explanation}
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Em {activeKey} Maior</span>
                {onNavigateToTransposer && (
                  <button
                    type="button"
                    onClick={() => onNavigateToTransposer(currentChords, activeKey)}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Transpor</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
