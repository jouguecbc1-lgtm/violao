import React, { useState } from 'react';
import { Volume2, Sparkles, Hand } from 'lucide-react';
import { audioSynth } from '../services/audioSynth';
import { noteToSemitone, getChordInversions } from '../utils/musicTheory';
import { SoundTimbre } from '../types';

interface PianoKeyboardProps {
  chordName?: string;
  romanNumeral?: string;
  harmonicFunction?: string;
  highlightNotes?: string[];
  guideTones?: { third?: string; seventh?: string };
  bassNote?: string;
  intervalsMap?: Record<string, string>;
  startOctave?: number;
  octaves?: number;
  interactive?: boolean;
  className?: string;
  showInversionControls?: boolean;
}

interface KeyDef {
  name: string;
  isBlack: boolean;
  octave: number;
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  chordName,
  romanNumeral,
  harmonicFunction,
  highlightNotes = [],
  guideTones,
  bassNote,
  intervalsMap,
  startOctave = 3,
  octaves = 2,
  interactive = true,
  className = '',
  showInversionControls = true,
}) => {
  const [inversionIndex, setInversionIndex] = useState(0);
  const [selectedTimbre, setSelectedTimbre] = useState<SoundTimbre>('piano');

  // Compute inversions if notes are provided
  const inversions = chordName && highlightNotes.length > 0 ? getChordInversions(chordName, highlightNotes) : [];
  const currentInversion = inversions[inversionIndex] || {
    inversionName: 'Fundamental',
    bassNote: bassNote || highlightNotes[0] || 'C',
    notes: highlightNotes,
  };

  const activeNotes = inversions.length > 0 ? currentInversion.notes : highlightNotes;
  const activeBass = inversions.length > 0 ? currentInversion.bassNote : bassNote;

  // Normalize highlight notes
  const cleanHighlightNotes = activeNotes.map((n) => n.replace(/[0-9]/g, '').trim());
  const cleanBass = activeBass ? activeBass.replace(/[0-9]/g, '').trim() : null;
  const cleanThird = guideTones?.third ? guideTones.third.replace(/[0-9]/g, '').trim() : null;
  const cleanSeventh = guideTones?.seventh ? guideTones.seventh.replace(/[0-9]/g, '').trim() : null;

  const isNoteMatch = (noteName: string, targetClean: string | null) => {
    if (!targetClean) return false;
    return noteToSemitone(noteName) === noteToSemitone(targetClean);
  };

  const isHighlighted = (noteName: string) => {
    return cleanHighlightNotes.some((n) => noteToSemitone(n) === noteToSemitone(noteName));
  };

  const getIntervalLabel = (noteName: string): string | null => {
    if (cleanBass && isNoteMatch(noteName, cleanBass)) return '1 (Tônica)';
    if (cleanThird && isNoteMatch(noteName, cleanThird)) return '3ª (Guia)';
    if (cleanSeventh && isNoteMatch(noteName, cleanSeventh)) return '7ª (Guia)';
    if (intervalsMap) {
      for (const [n, int] of Object.entries(intervalsMap)) {
        if (noteToSemitone(n) === noteToSemitone(noteName)) return int;
      }
    }
    return null;
  };

  // Build key definitions across the octaves
  const allKeys: KeyDef[] = [];
  for (let oct = startOctave; oct < startOctave + octaves; oct++) {
    allKeys.push({ name: 'C', isBlack: false, octave: oct });
    allKeys.push({ name: 'C#', isBlack: true, octave: oct });
    allKeys.push({ name: 'D', isBlack: false, octave: oct });
    allKeys.push({ name: 'D#', isBlack: true, octave: oct });
    allKeys.push({ name: 'E', isBlack: false, octave: oct });
    allKeys.push({ name: 'F', isBlack: false, octave: oct });
    allKeys.push({ name: 'F#', isBlack: true, octave: oct });
    allKeys.push({ name: 'G', isBlack: false, octave: oct });
    allKeys.push({ name: 'G#', isBlack: true, octave: oct });
    allKeys.push({ name: 'A', isBlack: false, octave: oct });
    allKeys.push({ name: 'A#', isBlack: true, octave: oct });
    allKeys.push({ name: 'B', isBlack: false, octave: oct });
  }

  const whiteKeys = allKeys.filter((k) => !k.isBlack);

  const handlePlayChord = () => {
    audioSynth.playChordNotes(activeNotes, 1.8, true, selectedTimbre);
  };

  return (
    <div className={`flex flex-col items-center select-none space-y-3 ${className}`}>
      {/* Top Header Card if chordName is provided */}
      {chordName && (
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
              {currentInversion.inversionName !== 'Fundamental' ? `${chordName}/${activeBass}` : chordName}
            </span>
            {romanNumeral && (
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold">
                {romanNumeral}
              </span>
            )}
            {harmonicFunction && (
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                {harmonicFunction}
              </span>
            )}
            <span className="text-slate-400 font-mono hidden sm:inline">
              [{activeNotes.join(' · ')}]
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Timbre Picker */}
            <select
              value={selectedTimbre}
              onChange={(e) => {
                const t = e.target.value as SoundTimbre;
                setSelectedTimbre(t);
                audioSynth.setTimbre(t);
              }}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 outline-none font-semibold cursor-pointer"
              title="Timbre de áudio"
            >
              <option value="piano">🎹 Piano</option>
              <option value="guitarra">🎸 Guitarra</option>
              <option value="baixo">🎸 Baixo</option>
              <option value="pads">🌌 Pad Synth</option>
              <option value="orgao">⛪ Órgão</option>
            </select>

            <button
              type="button"
              onClick={handlePlayChord}
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors shadow-sm"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Ouvir Acorde</span>
            </button>
          </div>
        </div>
      )}

      {/* Inversion Selector Tabs */}
      {showInversionControls && inversions.length > 0 && (
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-400 px-2 font-medium">Inversão:</span>
          {inversions.map((inv, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInversionIndex(idx)}
              className={`px-2.5 py-0.5 rounded transition-colors font-semibold ${
                inversionIndex === idx
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {idx === 0 ? 'Fundamental' : `${idx}ª Inversão`}
            </button>
          ))}
        </div>
      )}

      {/* Piano Keys Visualizer */}
      <div className="relative inline-flex bg-slate-900 p-2 rounded-xl shadow-2xl border border-slate-800 overflow-x-auto max-w-full">
        {/* Render White Keys */}
        <div className="flex">
          {whiteKeys.map((k, idx) => {
            const active = isHighlighted(k.name);
            const isBass = isNoteMatch(k.name, cleanBass);
            const isThird = isNoteMatch(k.name, cleanThird);
            const isSeventh = isNoteMatch(k.name, cleanSeventh);
            const interval = active ? getIntervalLabel(k.name) : null;

            let bgClass = 'bg-white hover:bg-slate-100 text-slate-700';
            if (isBass) bgClass = 'bg-amber-400 text-slate-950 font-bold';
            else if (isThird) bgClass = 'bg-emerald-400 text-slate-950 font-bold';
            else if (isSeventh) bgClass = 'bg-cyan-400 text-slate-950 font-bold';
            else if (active) bgClass = 'bg-amber-200 text-slate-900 font-semibold';

            return (
              <button
                key={`${k.name}-${k.octave}-${idx}`}
                type="button"
                disabled={!interactive}
                onClick={() => interactive && audioSynth.playNote(k.name, k.octave, 1.2, 0, selectedTimbre)}
                className={`relative w-8 sm:w-10 h-32 sm:h-36 border-r border-slate-300 rounded-b-md flex flex-col justify-end items-center pb-2 transition-all active:scale-[0.98] ${bgClass} ${
                  active ? 'shadow-inner ring-2 ring-amber-500' : ''
                }`}
                title={`${k.name}${k.octave} ${interval ? `(${interval})` : ''}`}
              >
                <span className="text-[11px] font-bold tracking-tight">{k.name}</span>
                {isBass && <span className="text-[8px] uppercase tracking-tighter font-extrabold text-amber-950">Tônica</span>}
                {isThird && !isBass && <span className="text-[8px] uppercase tracking-tighter font-extrabold text-emerald-950">3ª Guia</span>}
                {isSeventh && !isBass && <span className="text-[8px] uppercase tracking-tighter font-extrabold text-cyan-950">7ª Guia</span>}
                {!isBass && !isThird && !isSeventh && interval && (
                  <span className="text-[8px] font-semibold text-slate-800">{interval}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Render Black Keys positioned absolutely */}
        <div className="absolute top-2 left-2 flex pointer-events-none">
          {whiteKeys.map((k, idx) => {
            const hasSharp = ['C', 'D', 'F', 'G', 'A'].includes(k.name);
            if (!hasSharp) {
              return <div key={`spacer-${idx}`} className="w-8 sm:w-10" />;
            }

            const blackName = `${k.name}#`;
            const active = isHighlighted(blackName);
            const isBass = isNoteMatch(blackName, cleanBass);
            const isThird = isNoteMatch(blackName, cleanThird);
            const isSeventh = isNoteMatch(blackName, cleanSeventh);
            const interval = active ? getIntervalLabel(blackName) : null;

            let bgClass = 'bg-slate-950 hover:bg-slate-800 text-slate-200';
            if (isBass) bgClass = 'bg-amber-400 text-slate-950 font-bold';
            else if (isThird) bgClass = 'bg-emerald-400 text-slate-950 font-bold';
            else if (isSeventh) bgClass = 'bg-cyan-400 text-slate-950 font-bold';
            else if (active) bgClass = 'bg-amber-300 text-slate-950 font-semibold';

            return (
              <div key={`black-container-${idx}`} className="w-8 sm:w-10 relative">
                <button
                  type="button"
                  disabled={!interactive}
                  onClick={() => interactive && audioSynth.playNote(blackName, k.octave, 1.2, 0, selectedTimbre)}
                  className={`pointer-events-auto absolute -right-3 sm:-right-3.5 z-10 w-6 sm:w-7 h-20 sm:h-22 rounded-b flex flex-col justify-end items-center pb-1 shadow-md transition-all active:scale-[0.98] ${bgClass} ${
                    active ? 'ring-2 ring-amber-500' : ''
                  }`}
                  title={`${blackName}${k.octave} ${interval ? `(${interval})` : ''}`}
                >
                  <span className="text-[9px] font-bold">{blackName}</span>
                  {isBass && <span className="text-[7px] uppercase font-black">T</span>}
                  {isThird && !isBass && <span className="text-[7px] uppercase font-black">3ª</span>}
                  {isSeventh && !isBass && <span className="text-[7px] uppercase font-black">7ª</span>}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hand Positions Guide */}
      <div className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Hand className="w-4 h-4 text-amber-400" />
          <strong className="text-amber-400">Posição das Mãos (Teclado):</strong>
          <span>
            Mão Esquerda no Baixo (<strong className="text-amber-300">{activeBass || 'Fundamental'}</strong>) · Mão Direita nas Notas Guia (
            <strong className="text-emerald-300">3ª</strong> e <strong className="text-cyan-300">7ª</strong>)
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block"></span>
            Tônica
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block"></span>
            3ª Guia
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 inline-block"></span>
            7ª Guia
          </span>
        </div>
      </div>
    </div>
  );
};
