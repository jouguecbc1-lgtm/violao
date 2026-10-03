import React, { useState } from 'react';
import { Volume2, Play, Sliders, Sparkles } from 'lucide-react';
import { audioSynth } from '../services/audioSynth';
import { noteToSemitone, semitoneToNote } from '../utils/musicTheory';
import { GuitarTuning } from '../types';

interface VirtualGuitarFretboardProps {
  chordName?: string;
  notes?: string[];
  rootNote?: string;
  guideTones?: { third?: string; seventh?: string };
  initialTuning?: GuitarTuning;
  interactive?: boolean;
  className?: string;
}

const TUNINGS: Record<GuitarTuning, { label: string; openNotes: string[]; openOctaves: number[] }> = {
  standard: {
    label: 'Padrão (E - A - D - G - B - E)',
    openNotes: ['E', 'B', 'G', 'D', 'A', 'E'], // String 1 (high e) to String 6 (low E)
    openOctaves: [4, 3, 3, 3, 2, 2],
  },
  drop_d: {
    label: 'Drop D (D - A - D - G - B - E)',
    openNotes: ['E', 'B', 'G', 'D', 'A', 'D'],
    openOctaves: [4, 3, 3, 3, 2, 2],
  },
  dadgad: {
    label: 'DADGAD (D - A - D - G - A - D)',
    openNotes: ['D', 'A', 'G', 'D', 'A', 'D'],
    openOctaves: [4, 3, 3, 3, 2, 2],
  },
  half_step_down: {
    label: 'Meio Tom Abaixo (Eb - Ab - Db - Gb - Bb - Eb)',
    openNotes: ['D#', 'A#', 'F#', 'C#', 'G#', 'D#'],
    openOctaves: [4, 3, 3, 3, 2, 2],
  },
};

export const VirtualGuitarFretboard: React.FC<VirtualGuitarFretboardProps> = ({
  chordName,
  notes = [],
  rootNote,
  guideTones,
  initialTuning = 'standard',
  interactive = true,
  className = '',
}) => {
  const [tuningKey, setTuningKey] = useState<GuitarTuning>(initialTuning);
  const [displayMode, setDisplayMode] = useState<'acorde' | 'arpejo' | 'escala'>('acorde');
  const [fretRegion, setFretRegion] = useState<'all' | '0-4' | '3-7' | '5-9' | '7-12'>('all');

  const tuning = TUNINGS[tuningKey];
  const totalFrets = 12;

  // Normalize target notes
  const cleanNotes = notes.map((n) => n.replace(/[0-9]/g, '').trim());
  const cleanRoot = (rootNote || (notes[0] || 'C')).replace(/[0-9]/g, '').trim();
  const cleanThird = guideTones?.third ? guideTones.third.replace(/[0-9]/g, '').trim() : null;
  const cleanSeventh = guideTones?.seventh ? guideTones.seventh.replace(/[0-9]/g, '').trim() : null;

  const isNoteMatch = (noteA: string, targetClean: string | null) => {
    if (!targetClean) return false;
    return noteToSemitone(noteA) === noteToSemitone(targetClean);
  };

  const isHighlighted = (noteName: string) => {
    return cleanNotes.some((n) => noteToSemitone(n) === noteToSemitone(noteName));
  };

  const getFretNote = (openNote: string, fret: number) => {
    const openSemi = noteToSemitone(openNote);
    return semitoneToNote(openSemi + fret);
  };

  const handlePlayStringFret = (openNote: string, baseOctave: number, fret: number) => {
    const note = getFretNote(openNote, fret);
    const openSemi = noteToSemitone(openNote);
    const calculatedOctave = baseOctave + Math.floor((openSemi + fret) / 12);
    audioSynth.playGuitarNote(note, Math.min(5, calculatedOctave), 1.2);
  };

  const isFretInRegion = (fret: number) => {
    if (fret === 0) return true; // nut always accessible
    switch (fretRegion) {
      case '0-4':
        return fret <= 4;
      case '3-7':
        return fret >= 3 && fret <= 7;
      case '5-9':
        return fret >= 5 && fret <= 9;
      case '7-12':
        return fret >= 7 && fret <= 12;
      case 'all':
      default:
        return true;
    }
  };

  // Markers on standard frets (3, 5, 7, 9, 12)
  const fretMarkers = [3, 5, 7, 9, 12];

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 ${className}`}>
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <span className="text-xl">🎸</span>
              <span>Braço Virtual de Violão & Guitarra</span>
            </h3>
            {chordName && (
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-xs">
                {chordName}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Mapeamento de 12 casas com afinações ajustáveis, destaques de notas guia e reprodução ao vivo
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Afinação Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 pl-1 font-medium">Afinação:</span>
            <select
              value={tuningKey}
              onChange={(e) => setTuningKey(e.target.value as GuitarTuning)}
              className="bg-slate-900 text-slate-200 rounded px-2 py-0.5 outline-none font-semibold cursor-pointer border border-slate-800"
            >
              <option value="standard">Padrão (EADGBE)</option>
              <option value="drop_d">Drop D (DADGBE)</option>
              <option value="dadgad">DADGAD</option>
              <option value="half_step_down">Meio Tom Abaixo</option>
            </select>
          </div>

          {/* Região do Braço Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 pl-1 font-medium">Região:</span>
            <select
              value={fretRegion}
              onChange={(e) => setFretRegion(e.target.value as typeof fretRegion)}
              className="bg-slate-900 text-slate-200 rounded px-2 py-0.5 outline-none font-semibold cursor-pointer border border-slate-800"
            >
              <option value="all">Braço Todo (0-12)</option>
              <option value="0-4">Posição Aberta (0-4)</option>
              <option value="3-7">Casas 3 a 7</option>
              <option value="5-9">Casas 5 a 9</option>
              <option value="7-12">Casas 7 a 12</option>
            </select>
          </div>

          {/* Strum chord */}
          {cleanNotes.length > 0 && (
            <button
              type="button"
              onClick={() => audioSynth.playChordNotes(cleanNotes, 1.8, true, 'guitarra')}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-sm ml-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Ouvir Acorde</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Fretboard SVG / HTML Visualizer */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[720px] bg-gradient-to-r from-amber-950/20 via-slate-950 to-slate-900 rounded-xl p-3 border border-amber-900/30">
          {/* Fret number markers top */}
          <div className="flex ml-12 text-[10px] font-mono text-slate-400 mb-1">
            <div className="w-10 text-center font-bold text-amber-400">Nut</div>
            {Array.from({ length: totalFrets }, (_, i) => i + 1).map((fret) => (
              <div
                key={fret}
                className={`flex-1 text-center ${
                  fretMarkers.includes(fret) ? 'text-amber-300 font-bold' : 'text-slate-500'
                }`}
              >
                {fret}
                {fret === 12 && ' ••'}
                {fretMarkers.includes(fret) && fret !== 12 && ' •'}
              </div>
            ))}
          </div>

          {/* 6 Guitar Strings (from 1st High E down to 6th Low E) */}
          <div className="space-y-1 relative">
            {tuning.openNotes.map((openNote, stringIdx) => {
              const stringNum = stringIdx + 1;
              const baseOct = tuning.openOctaves[stringIdx];
              // Thicker strings at the bottom (string 6 is thickest)
              const stringThickness = stringIdx >= 3 ? 'h-[2.5px] bg-amber-200/50' : 'h-[1.5px] bg-slate-400/60';

              return (
                <div key={stringIdx} className="flex items-center relative py-1.5 group">
                  {/* String Line Behind Frets */}
                  <div
                    className={`absolute left-10 right-0 top-1/2 -translate-y-1/2 ${stringThickness} z-0`}
                  />

                  {/* String Open Note Badge (Nut) */}
                  <button
                    type="button"
                    disabled={!interactive}
                    onClick={() => interactive && handlePlayStringFret(openNote, baseOct, 0)}
                    className={`z-10 w-10 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center border transition-all active:scale-95 ${
                      isHighlighted(openNote)
                        ? isNoteMatch(openNote, cleanRoot)
                          ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md'
                          : isNoteMatch(openNote, cleanThird)
                          ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-black'
                          : isNoteMatch(openNote, cleanSeventh)
                          ? 'bg-cyan-400 text-slate-950 border-cyan-300 font-black'
                          : 'bg-amber-200 text-slate-900 border-amber-400'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                    title={`Corda ${stringNum} solta: ${openNote}`}
                  >
                    <span>{openNote}</span>
                  </button>

                  {/* Frets 1 to 12 */}
                  {Array.from({ length: totalFrets }, (_, i) => i + 1).map((fret) => {
                    const noteAtFret = getFretNote(openNote, fret);
                    const isFretMatched = isHighlighted(noteAtFret);
                    const isRoot = isNoteMatch(noteAtFret, cleanRoot);
                    const isThird = isNoteMatch(noteAtFret, cleanThird);
                    const isSeventh = isNoteMatch(noteAtFret, cleanSeventh);
                    const inRegion = isFretInRegion(fret);

                    return (
                      <div
                        key={fret}
                        className={`flex-1 h-8 flex items-center justify-center relative border-r ${
                          fret === 12 ? 'border-amber-400/60' : 'border-slate-800'
                        } ${!inRegion ? 'opacity-30' : ''}`}
                      >
                        {isFretMatched ? (
                          <button
                            type="button"
                            disabled={!interactive}
                            onClick={() => interactive && handlePlayStringFret(openNote, baseOct, fret)}
                            className={`z-10 w-6 h-6 rounded-full text-[10px] font-mono font-bold flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-md ${
                              isRoot
                                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 font-black scale-105'
                                : isThird
                                ? 'bg-emerald-400 text-slate-950 ring-1 ring-emerald-300 font-black'
                                : isSeventh
                                ? 'bg-cyan-400 text-slate-950 ring-1 ring-cyan-300 font-black'
                                : 'bg-slate-200 text-slate-950'
                            }`}
                            title={`Corda ${stringNum}, Casa ${fret}: ${noteAtFret}`}
                          >
                            {noteAtFret}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={!interactive}
                            onClick={() => interactive && handlePlayStringFret(openNote, baseOct, fret)}
                            className="w-full h-full opacity-0 hover:opacity-100 flex items-center justify-center text-[9px] font-mono text-slate-500 transition-opacity z-10"
                            title={`Corda ${stringNum}, Casa ${fret}: ${noteAtFret}`}
                          >
                            <span className="w-5 h-5 rounded-full bg-slate-800/80 flex items-center justify-center">
                              {noteAtFret}
                            </span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend & Guide Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            Fundamental / Tônica
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
            3ª Guia (Modo)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
            7ª Guia (Função)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block"></span>
            5ª ou Extensão
          </span>
        </div>

        <span className="text-[11px] text-slate-400">
          💡 Clique em qualquer traste ou corda solta para ouvir o som na afinação escolhida.
        </span>
      </div>
    </div>
  );
};
