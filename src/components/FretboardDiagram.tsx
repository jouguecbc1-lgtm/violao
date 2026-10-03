import React from 'react';
import { Volume2 } from 'lucide-react';
import { audioSynth } from '../services/audioSynth';

export interface GuitarChordShape {
  name: string;
  category: string; // 'Aberta', 'Pestana', 'Drop 2', 'Shell'
  frets: (number | 'x' | 0)[]; // 6 strings from low E (6th) to high e (1st)
  fingers?: (number | null)[];
  barreFret?: number;
  baseFret?: number;
  notes: string[];
}

interface FretboardDiagramProps {
  chordName: string;
  shape?: GuitarChordShape;
  notes?: string[];
  className?: string;
}

// Built-in standard guitar shapes for common 2-5-1 chords
const COMMON_GUITAR_SHAPES: Record<string, GuitarChordShape[]> = {
  Dm7: [
    {
      name: 'Dm7 (Posição 5ª casa - Drop 2)',
      category: 'Drop 2',
      frets: ['x', 5, 7, 5, 6, 5],
      fingers: [null, 1, 3, 1, 2, 1],
      barreFret: 5,
      baseFret: 5,
      notes: ['D', 'A', 'C', 'F'],
    },
    {
      name: 'Dm7 (Posição Aberta)',
      category: 'Aberta',
      frets: ['x', 'x', 0, 2, 1, 1],
      fingers: [null, null, 0, 2, 1, 1],
      baseFret: 1,
      notes: ['D', 'A', 'C', 'F'],
    },
  ],
  G7: [
    {
      name: 'G7 (Posição 3ª casa)',
      category: 'Pestana',
      frets: [3, 5, 3, 4, 3, 3],
      fingers: [1, 3, 1, 2, 1, 1],
      barreFret: 3,
      baseFret: 3,
      notes: ['G', 'D', 'F', 'B', 'D', 'G'],
    },
    {
      name: 'G7 (Shell Voicing Jazz)',
      category: 'Shell',
      frets: [3, 'x', 3, 4, 'x', 'x'],
      fingers: [1, null, 2, 3, null, null],
      baseFret: 3,
      notes: ['G', 'F', 'B'],
    },
  ],
  Cmaj7: [
    {
      name: 'Cmaj7 (Posição 3ª casa na 5ª corda)',
      category: 'Pestana',
      frets: ['x', 3, 5, 4, 5, 3],
      fingers: [null, 1, 3, 2, 4, 1],
      baseFret: 3,
      notes: ['C', 'G', 'B', 'E'],
    },
    {
      name: 'Cmaj7 (Posição Aberta)',
      category: 'Aberta',
      frets: ['x', 3, 2, 0, 0, 0],
      fingers: [null, 3, 2, 0, 0, 0],
      baseFret: 1,
      notes: ['C', 'E', 'G', 'B', 'E'],
    },
  ],
  'Bm7(b5)': [
    {
      name: 'Bm7(b5) (Posição Meio-Diminuta)',
      category: 'Drop 2',
      frets: ['x', 2, 3, 2, 3, 'x'],
      fingers: [null, 1, 3, 2, 4, null],
      baseFret: 2,
      notes: ['B', 'F', 'A', 'D'],
    },
  ],
  'E7': [
    {
      name: 'E7 (Posição Aberta)',
      category: 'Aberta',
      frets: [0, 2, 0, 1, 0, 0],
      fingers: [0, 2, 0, 1, 0, 0],
      baseFret: 1,
      notes: ['E', 'B', 'D', 'G#', 'B', 'E'],
    },
  ],
  'Am7': [
    {
      name: 'Am7 (Posição Aberta)',
      category: 'Aberta',
      frets: ['x', 0, 2, 0, 1, 0],
      fingers: [null, 0, 2, 0, 1, 0],
      baseFret: 1,
      notes: ['A', 'E', 'G', 'C', 'E'],
    },
  ],
};

export const FretboardDiagram: React.FC<FretboardDiagramProps> = ({
  chordName,
  shape: customShape,
  notes = [],
  className = '',
}) => {
  const shapes = COMMON_GUITAR_SHAPES[chordName] || [];
  const [selectedShapeIndex, setSelectedShapeIndex] = React.useState(0);

  const activeShape = customShape || (shapes.length > 0 ? shapes[selectedShapeIndex] : null);

  const strings = [6, 5, 4, 3, 2, 1]; // 6th string (E) to 1st string (e)
  const fretCount = 5;
  const baseFret = activeShape?.baseFret || 1;

  const playChord = () => {
    if (activeShape && activeShape.notes.length > 0) {
      audioSynth.playChordNotes(activeShape.notes, 1.8, true);
    } else if (notes.length > 0) {
      audioSynth.playChordNotes(notes, 1.8, true);
    }
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center ${className}`}>
      {/* Header with Title and Shape Selector */}
      <div className="w-full flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-amber-400">{chordName}</span>
          <span className="text-xs text-slate-400">Violão / Guitarra</span>
        </div>

        <button
          type="button"
          onClick={playChord}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded-lg transition-colors"
          title="Tocar acorde"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Ouvir</span>
        </button>
      </div>

      {shapes.length > 1 && (
        <div className="flex items-center gap-1 mb-3 self-start">
          {shapes.map((s, idx) => (
            <button
              key={s.name}
              type="button"
              onClick={() => setSelectedShapeIndex(idx)}
              className={`px-2 py-0.5 text-xs rounded transition-colors ${
                selectedShapeIndex === idx
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {s.category}
            </button>
          ))}
        </div>
      )}

      {/* SVG Fretboard Box */}
      {activeShape ? (
        <div className="relative my-2">
          <svg width="180" height="200" viewBox="0 0 180 200" className="overflow-visible">
            {/* Base Fret Indicator */}
            {baseFret > 1 && (
              <text x="8" y="42" fill="#94a3b8" fontSize="11" fontWeight="bold">
                {baseFret}ª
              </text>
            )}

            {/* Nut or First Fret Line */}
            <line
              x1="30"
              y1="30"
              x2="150"
              y2="30"
              stroke={baseFret === 1 ? '#f8fafc' : '#475569'}
              strokeWidth={baseFret === 1 ? '5' : '2'}
            />

            {/* Frets horizontal lines */}
            {[1, 2, 3, 4, 5].map((fret) => {
              const y = 30 + fret * 30;
              return (
                <line key={`fret-${fret}`} x1="30" y1={y} x2="150" y2={y} stroke="#334155" strokeWidth="1.5" />
              );
            })}

            {/* Strings vertical lines */}
            {strings.map((_, i) => {
              const x = 30 + i * 24;
              return <line key={`str-${i}`} x1={x} y1="30" x2={x} y2="180" stroke="#64748b" strokeWidth="1.2" />;
            })}

            {/* String Status Markers (O / X) */}
            {activeShape.frets.map((fret, i) => {
              const x = 30 + i * 24;
              if (fret === 'x') {
                return (
                  <text key={`marker-${i}`} x={x} y="20" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">
                    ✕
                  </text>
                );
              }
              if (fret === 0) {
                return (
                  <circle key={`marker-${i}`} cx={x} cy="16" r="4.5" fill="none" stroke="#22c55e" strokeWidth="2" />
                );
              }
              return null;
            })}

            {/* Pressed Finger Dots */}
            {activeShape.frets.map((fret, i) => {
              if (typeof fret === 'number' && fret > 0) {
                const relativeFret = fret - baseFret + 1;
                if (relativeFret >= 1 && relativeFret <= fretCount) {
                  const x = 30 + i * 24;
                  const y = 30 + relativeFret * 30 - 15;
                  const finger = activeShape.fingers?.[i];

                  return (
                    <g key={`dot-${i}`}>
                      <circle cx={x} cy={y} r="8.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                      {finger !== undefined && finger !== null && finger > 0 && (
                        <text
                          x={x}
                          y={y + 3.5}
                          textAnchor="middle"
                          fill="#0f172a"
                          fontSize="9.5"
                          fontWeight="bold"
                        >
                          {finger}
                        </text>
                      )}
                    </g>
                  );
                }
              }
              return null;
            })}
          </svg>
        </div>
      ) : (
        <div className="py-8 text-center text-xs text-slate-400">
          Diagrama gerado dinamicamente para {chordName}. Notas: {notes.join(' – ')}
        </div>
      )}

      {/* Note breakdown at bottom */}
      <div className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-1.5">
        <span>Notas:</span>
        <span className="text-slate-200 font-semibold">{notes.join(' · ')}</span>
      </div>
    </div>
  );
};
