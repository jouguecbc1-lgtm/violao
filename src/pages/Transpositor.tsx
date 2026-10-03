import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Plus,
  Minus,
  Copy,
  Check,
  Play,
  Volume2,
  Sparkles,
} from 'lucide-react';
import {
  KEY_LIST,
  transposeProgression,
  transposeProgressionBetweenKeys,
} from '../utils/musicTheory';
import { audioSynth } from '../services/audioSynth';

interface TranspositorProps {
  initialProgression?: string[];
  initialFromKey?: string;
}

export const Transpositor: React.FC<TranspositorProps> = ({
  initialProgression,
  initialFromKey = 'C',
}) => {
  const [fromKey, setFromKey] = useState<string>(initialFromKey);
  const [toKey, setToKey] = useState<string>('G');
  const [customInput, setCustomInput] = useState<string>(
    initialProgression ? initialProgression.join(' - ') : 'Dm7 - G7 - Cmaj7'
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Parse input
  const parseChords = (input: string): string[] => {
    return input
      .split(/[-–—,>\s]+/)
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
  };

  const originalChords = parseChords(customInput);
  const transposedChords = transposeProgressionBetweenKeys(originalChords, fromKey, toKey);

  const handleShiftSemitones = (shift: number) => {
    const newChords = transposeProgression(originalChords, shift);
    setCustomInput(newChords.join(' - '));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transposedChords.join(' – '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const playTransposed = () => {
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

    audioSynth.playProgression(chordsNotes, 85);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-amber-400" />
            <span>Transpositor Musical Inteligente</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Transponha qualquer progressão ou sequência de acordes com precisão harmônica instantânea.
          </p>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Progressão Original (digite os acordes separados por traço ou espaço):
            </label>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Ex: Dm7 - G7 - Cmaj7 ou C - Am - F - G"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 font-mono text-base focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Exemplos Prontos:</span>
            {[
              { label: 'II-V-I Padrão', text: 'Dm7 - G7 - Cmaj7' },
              { label: 'Turnaround', text: 'Cmaj7 - Am7 - Dm7 - G7' },
              { label: 'Pop Clássico', text: 'C - G - Am - F' },
              { label: 'Cadência Bossa', text: 'Cmaj7 - D7 - Dm7 - G7' },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setCustomInput(preset.text)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Key Selection Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Tonalidade Original:
              </label>
              <select
                value={fromKey}
                onChange={(e) => setFromKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 font-mono font-bold text-sm rounded-xl px-3 py-2.5 focus:outline-none"
              >
                {KEY_LIST.map((k) => (
                  <option key={k} value={k}>
                    {k} Maior
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Nova Tonalidade Alvo:
              </label>
              <select
                value={toKey}
                onChange={(e) => setToKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-amber-400 font-mono font-bold text-sm rounded-xl px-3 py-2.5 focus:outline-none"
              >
                {KEY_LIST.map((k) => (
                  <option key={k} value={k}>
                    {k} Maior
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Semitone / Tone Shifters */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-slate-400">Ajuste Fino Rápido:</span>
            <button
              type="button"
              onClick={() => handleShiftSemitones(-1)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 active:scale-95 transition-transform"
            >
              <Minus className="w-3.5 h-3.5" />
              <span>Descer Semitom (-1 ST)</span>
            </button>
            <button
              type="button"
              onClick={() => handleShiftSemitones(1)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 active:scale-95 transition-transform"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Subir Semitom (+1 ST)</span>
            </button>
            <button
              type="button"
              onClick={() => handleShiftSemitones(-2)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 active:scale-95 transition-transform"
            >
              <Minus className="w-3.5 h-3.5" />
              <span>Descer Tom (-2 ST)</span>
            </button>
            <button
              type="button"
              onClick={() => handleShiftSemitones(2)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 active:scale-95 transition-transform"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Subir Tom (+2 ST)</span>
            </button>
          </div>
        </div>

        {/* Output Result Card */}
        <div className="bg-slate-950 border-2 border-amber-500/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Resultado Transposto ({toKey} Maior)
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={playTransposed}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Ouvir</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Visual Chords Flow */}
          <div className="flex flex-wrap items-center justify-center gap-3 py-4 font-mono">
            {transposedChords.map((chord, idx) => (
              <React.Fragment key={idx}>
                <div
                  onClick={() => audioSynth.playChordNotes([chord.replace(/[^A-G#b]/g, '')], 1.4)}
                  className="cursor-pointer px-4 py-3 bg-slate-900 border border-slate-700 hover:border-amber-400 rounded-xl text-center transition-colors group shadow-md"
                >
                  <span className="text-[10px] text-slate-400 block mb-0.5">Acorde {idx + 1}</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-300 group-hover:text-amber-200">
                    {chord}
                  </span>
                </div>
                {idx < transposedChords.length - 1 && (
                  <span className="text-slate-600 font-bold text-lg">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
