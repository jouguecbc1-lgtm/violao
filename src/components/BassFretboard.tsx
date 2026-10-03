import React, { useState } from 'react';
import { Volume2, Play } from 'lucide-react';
import { audioSynth } from '../services/audioSynth';
import { noteToSemitone, semitoneToNote } from '../utils/musicTheory';

interface BassFretboardProps {
  chordName?: string;
  rootNote: string;
  chordNotes?: string[];
  walkingLine?: string[];
  stringsCount?: 4 | 5;
  className?: string;
}

export const BassFretboard: React.FC<BassFretboardProps> = ({
  chordName,
  rootNote,
  chordNotes = [],
  walkingLine,
  stringsCount = 4,
  className = '',
}) => {
  const [numStrings, setNumStrings] = useState<4 | 5>(stringsCount);
  const [isPlayingWalking, setIsPlayingWalking] = useState(false);

  // Strings from highest pitch to lowest pitch:
  // 4 strings: G2, D2, A1, E1
  // 5 strings: G2, D2, A1, E1, B0
  const stringOpenNotes = numStrings === 5 ? ['G', 'D', 'A', 'E', 'B'] : ['G', 'D', 'A', 'E'];
  const totalFrets = 12;

  // Normalize chord notes
  const cleanChordNotes = chordNotes.map((n) => n.replace(/[0-9]/g, '').trim());
  const cleanRoot = rootNote.replace(/[0-9]/g, '').trim();

  const isNoteMatch = (noteA: string, noteB: string) => {
    return noteToSemitone(noteA) === noteToSemitone(noteB);
  };

  const getFretNote = (openNote: string, fret: number) => {
    const openSemi = noteToSemitone(openNote);
    return semitoneToNote(openSemi + fret);
  };

  const handlePlayBassNote = (noteName: string) => {
    audioSynth.playBassNote(noteName, 2, 1.2);
  };

  const handlePlayWalkingLine = () => {
    if (!walkingLine || walkingLine.length === 0) return;
    setIsPlayingWalking(true);

    let delay = 0;
    walkingLine.forEach((note, idx) => {
      setTimeout(() => {
        audioSynth.playBassNote(note, 2, 0.7);
        if (idx === walkingLine.length - 1) {
          setIsPlayingWalking(false);
        }
      }, delay * 1000);
      delay += 0.55;
    });
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 ${className}`}>
      {/* Header with Title & String Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-amber-400">
              Contrabaixo Elétrico {chordName ? `· ${chordName}` : ''}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({numStrings} Cordas: {numStrings === 5 ? 'B-E-A-D-G' : 'E-A-D-G'})
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Destaque da Tônica (Fundamental) e arpejos da tétrade no braço do baixo
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {walkingLine && walkingLine.length > 0 && (
            <button
              type="button"
              disabled={isPlayingWalking}
              onClick={handlePlayWalkingLine}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Ouvir Walking Bass</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setNumStrings(4)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                numStrings === 4
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              4 Cordas
            </button>
            <button
              type="button"
              onClick={() => setNumStrings(5)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                numStrings === 5
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              5 Cordas
            </button>
          </div>
        </div>
      </div>

      {/* Fretboard SVG / Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[680px] bg-slate-950 p-3 rounded-xl border border-slate-800 select-none">
          {/* Fret Numbers Header */}
          <div className="flex border-b border-slate-800 pb-1 mb-1 text-[10px] text-slate-500 font-mono">
            <div className="w-12 text-center text-slate-400 font-bold">Corda</div>
            <div className="w-10 text-center font-bold text-amber-500">0 (Solta)</div>
            {Array.from({ length: totalFrets }).map((_, f) => (
              <div key={f} className="flex-1 text-center">
                {f + 1}
                {[3, 5, 7, 9].includes(f + 1) && <span className="block text-slate-600">•</span>}
                {f + 1 === 12 && <span className="block text-amber-500/80 font-bold">••</span>}
              </div>
            ))}
          </div>

          {/* Strings and Frets */}
          <div className="space-y-1">
            {stringOpenNotes.map((openNote, stringIdx) => {
              const stringThickness = (stringOpenNotes.length - stringIdx) * 0.75 + 1.2;

              return (
                <div key={stringIdx} className="flex items-center relative py-1">
                  {/* String Label */}
                  <div className="w-12 text-center text-xs font-mono font-bold text-slate-400">
                    {stringOpenNotes.length - stringIdx}ª ({openNote})
                  </div>

                  {/* Open String Button (Fret 0) */}
                  {(() => {
                    const isRoot = isNoteMatch(openNote, cleanRoot);
                    const isChord = cleanChordNotes.some((n) => isNoteMatch(openNote, n));

                    let badgeClass = 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800';
                    if (isRoot) badgeClass = 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/30';
                    else if (isChord) badgeClass = 'bg-blue-500/30 border-blue-500 text-blue-300 font-bold';

                    return (
                      <div className="w-10 flex justify-center">
                        <button
                          type="button"
                          onClick={() => handlePlayBassNote(openNote)}
                          className={`w-7 h-7 rounded-full text-[10px] font-mono border flex items-center justify-center transition-transform active:scale-90 ${badgeClass}`}
                          title={`Corda solta: ${openNote}`}
                        >
                          {openNote}
                        </button>
                      </div>
                    );
                  })()}

                  {/* Fret wire separator (Nut) */}
                  <div className="w-1 h-8 bg-slate-300 mx-1 rounded" />

                  {/* Frets 1 to 12 */}
                  <div className="flex-1 flex relative items-center">
                    {/* Horizontal String Line */}
                    <div
                      className="absolute left-0 right-0 bg-slate-600 pointer-events-none"
                      style={{ height: `${stringThickness}px` }}
                    />

                    {Array.from({ length: totalFrets }).map((_, fIdx) => {
                      const fretNumber = fIdx + 1;
                      const noteOnFret = getFretNote(openNote, fretNumber);
                      const isRoot = isNoteMatch(noteOnFret, cleanRoot);
                      const isChord = cleanChordNotes.some((n) => isNoteMatch(noteOnFret, n));

                      let badgeClass = 'bg-slate-900/60 border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-200';
                      if (isRoot) {
                        badgeClass = 'bg-amber-400 text-slate-950 font-black border-amber-300 shadow-md shadow-amber-400/40 z-10 scale-105';
                      } else if (isChord) {
                        badgeClass = 'bg-blue-500 text-white font-bold border-blue-400 shadow-sm z-10';
                      }

                      return (
                        <div
                          key={fIdx}
                          className="flex-1 flex justify-center border-r border-slate-800/80 h-8 items-center relative"
                        >
                          <button
                            type="button"
                            onClick={() => handlePlayBassNote(noteOnFret)}
                            className={`w-6 h-6 rounded-full text-[9px] font-mono border flex items-center justify-center transition-transform active:scale-90 relative ${badgeClass}`}
                            title={`Casa ${fretNumber}: ${noteOnFret}`}
                          >
                            {noteOnFret}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend & Walking Bass Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
            <strong className="text-slate-200">Tônica (Baixo Principal)</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
            <strong className="text-slate-200">Notas da Tétrade (3ª, 5ª, 7ª)</strong>
          </span>
        </div>

        {walkingLine && walkingLine.length > 0 && (
          <div className="font-mono text-xs">
            <span className="text-slate-400">Walking Bass Sugerido: </span>
            <span className="text-amber-300 font-bold">{walkingLine.join(' → ')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
