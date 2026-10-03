import React from 'react';
import { audioSynth } from '../services/audioSynth';
import { noteToSemitone } from '../utils/musicTheory';

interface PianoKeyboardProps {
  highlightNotes?: string[];
  guideTones?: { third?: string; seventh?: string };
  bassNote?: string;
  startOctave?: number;
  octaves?: number;
  interactive?: boolean;
  className?: string;
}

interface KeyDef {
  name: string;
  isBlack: boolean;
  octave: number;
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  highlightNotes = [],
  guideTones,
  bassNote,
  startOctave = 4,
  octaves = 2,
  interactive = true,
  className = '',
}) => {
  const whiteKeyNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  // Normalize highlight notes to uppercase without numbers for matching
  const cleanHighlightNotes = highlightNotes.map((n) => n.replace(/[0-9]/g, '').trim());
  const cleanBass = bassNote ? bassNote.replace(/[0-9]/g, '').trim() : null;
  const cleanThird = guideTones?.third ? guideTones.third.replace(/[0-9]/g, '').trim() : null;
  const cleanSeventh = guideTones?.seventh ? guideTones.seventh.replace(/[0-9]/g, '').trim() : null;

  const isNoteMatch = (noteName: string, targetClean: string | null) => {
    if (!targetClean) return false;
    return noteToSemitone(noteName) === noteToSemitone(targetClean);
  };

  const isHighlighted = (noteName: string) => {
    return cleanHighlightNotes.some((n) => noteToSemitone(n) === noteToSemitone(noteName));
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

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div className="relative inline-flex bg-slate-900 p-2 rounded-xl shadow-2xl border border-slate-800 overflow-x-auto max-w-full">
        {/* Render White Keys */}
        <div className="flex">
          {whiteKeys.map((k, idx) => {
            const active = isHighlighted(k.name);
            const isBass = isNoteMatch(k.name, cleanBass);
            const isThird = isNoteMatch(k.name, cleanThird);
            const isSeventh = isNoteMatch(k.name, cleanSeventh);

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
                onClick={() => interactive && audioSynth.playNote(k.name, k.octave, 1.2)}
                className={`relative w-8 sm:w-10 h-32 sm:h-36 border-r border-slate-300 rounded-b-md flex flex-col justify-end items-center pb-2 transition-all active:scale-[0.98] ${bgClass} ${
                  active ? 'shadow-inner ring-2 ring-amber-500' : ''
                }`}
                title={`${k.name}${k.octave}`}
              >
                <span className="text-[11px] tracking-tight">{k.name}</span>
                {isBass && <span className="text-[8px] uppercase tracking-tighter font-extrabold text-amber-950">Tônica</span>}
                {isThird && <span className="text-[8px] uppercase tracking-tighter font-extrabold text-emerald-950">3ª Guia</span>}
                {isSeventh && <span className="text-[8px] uppercase tracking-tighter font-extrabold text-cyan-950">7ª Guia</span>}
              </button>
            );
          })}
        </div>

        {/* Render Black Keys positioned absolutely */}
        <div className="absolute top-2 left-2 flex pointer-events-none">
          {whiteKeys.map((k, idx) => {
            // Check if there is a black key immediately following this white key (C, D, F, G, A have black keys to the right)
            const hasSharp = ['C', 'D', 'F', 'G', 'A'].includes(k.name);
            if (!hasSharp) {
              return <div key={`spacer-${idx}`} className="w-8 sm:w-10" />;
            }

            const blackName = `${k.name}#`;
            const active = isHighlighted(blackName);
            const isBass = isNoteMatch(blackName, cleanBass);
            const isThird = isNoteMatch(blackName, cleanThird);
            const isSeventh = isNoteMatch(blackName, cleanSeventh);

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
                  onClick={() => interactive && audioSynth.playNote(blackName, k.octave, 1.2)}
                  className={`pointer-events-auto absolute -right-3 sm:-right-3.5 z-10 w-6 sm:w-7 h-20 sm:h-22 rounded-b flex flex-col justify-end items-center pb-1 shadow-md transition-all active:scale-[0.98] ${bgClass} ${
                    active ? 'ring-2 ring-amber-500' : ''
                  }`}
                  title={`${blackName}${k.octave}`}
                >
                  <span className="text-[9px]">{blackName}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-2.5 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block"></span>
          Tônica / Fundamental
        </span>
        {guideTones?.third && (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block"></span>
            3ª (Define modo / Nota Guia)
          </span>
        )}
        {guideTones?.seventh && (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 inline-block"></span>
            7ª (Define função / Nota Guia)
          </span>
        )}
      </div>
    </div>
  );
};
