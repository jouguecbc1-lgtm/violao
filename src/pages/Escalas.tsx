import React, { useState } from 'react';
import { Play, Volume2, Music2, Info } from 'lucide-react';
import { KEY_LIST, getScaleNotes, SCALE_FORMULAS } from '../utils/musicTheory';
import { ScaleType } from '../types';
import { audioSynth } from '../services/audioSynth';
import { PianoKeyboard } from '../components/PianoKeyboard';

export const Escalas: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('C');
  const [selectedScaleType, setSelectedScaleType] = useState<ScaleType>('major');
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const scaleTypes: { id: ScaleType; name: string; formula: string; desc: string }[] = [
    {
      id: 'major',
      name: 'Escala Maior (Diatônica)',
      formula: 'T – T – ST – T – T – T – ST',
      desc: 'A matriz de toda a música ocidental e o alicerce para o Campo Harmônico Maior.',
    },
    {
      id: 'minor_natural',
      name: 'Escala Menor Natural (Modo Eólio)',
      formula: 'T – ST – T – T – ST – T – T',
      desc: 'Relativa da escala maior. Som melancólico, suave e cinematográfico.',
    },
    {
      id: 'minor_harmonic',
      name: 'Escala Menor Harmônica',
      formula: 'T – ST – T – T – ST – 1.5T – ST',
      desc: 'Possui o 7º grau elevado gerando a sensível e possibilitando o acorde Dominante (V7).',
    },
    {
      id: 'minor_melodic',
      name: 'Escala Menor Melódica',
      formula: 'T – ST – T – T – T – T – ST',
      desc: 'Eleva tanto o 6º quanto o 7º graus. Muito utilizada na improvisação moderna e Jazz.',
    },
    {
      id: 'pentatonic_major',
      name: 'Pentatônica Maior',
      formula: '1 – 2 – 3 – 5 – 6',
      desc: 'Escala de 5 notas sem semitons nem notas de atrito. Extremamente melódica e intuitiva.',
    },
    {
      id: 'pentatonic_minor',
      name: 'Pentatônica Menor',
      formula: '1 – b3 – 4 – 5 – b7',
      desc: 'O pilar sagrado do Blues, Rock, Soul, R&B e solos de guitarra.',
    },
    {
      id: 'blues',
      name: 'Escala Blues (com Blue Note)',
      formula: '1 – b3 – 4 – b5 – 5 – b7',
      desc: 'A pentatônica menor enriquecida com a instigante 5ª diminuta (blue note).',
    },
  ];

  const currentScaleInfo = scaleTypes.find((s) => s.id === selectedScaleType) || scaleTypes[0];
  const notes = getScaleNotes(selectedKey, selectedScaleType);

  const playScale = () => {
    let delay = 0;
    notes.forEach((note, idx) => {
      setTimeout(() => {
        setActiveNote(note);
        audioSynth.playNote(note, 4, 0.8);
      }, delay * 1000);
      delay += 0.35;
    });

    setTimeout(() => {
      // play final octave root
      audioSynth.playNote(selectedKey, 5, 1.2);
      setActiveNote(null);
    }, delay * 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <Music2 className="w-5 h-5 text-amber-400" />
              <span>Explorador de Escalas Musicais</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Visualize intervalos, fórmulas e notas no teclado interativo
            </p>
          </div>

          <button
            type="button"
            onClick={playScale}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 self-start sm:self-auto"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Ouvir Escala Completa</span>
          </button>
        </div>

        {/* 12 Keys Bar */}
        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-2">Tônica da Escala:</span>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
            {KEY_LIST.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedKey(key)}
                className={`py-2 px-1 text-xs font-bold rounded-lg transition-all ${
                  selectedKey === key
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Scale Type Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
          {scaleTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelectedScaleType(type.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedScaleType === type.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-slate-100'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Scale Detail */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              Escala de <span className="text-amber-400">{selectedKey}</span> — {currentScaleInfo.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{currentScaleInfo.desc}</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Fórmula:</span>
            <span className="font-mono text-amber-300 font-bold bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
              {currentScaleInfo.formula}
            </span>
          </div>
        </div>

        {/* Notes list */}
        <div className="flex flex-wrap items-center gap-2 py-2">
          {notes.map((note, idx) => {
            const isTonic = idx === 0;
            const isPlayingNote = activeNote === note;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => audioSynth.playNote(note, 4, 1.2)}
                className={`flex flex-col items-center justify-center w-12 h-14 rounded-xl border text-xs font-mono font-bold transition-all ${
                  isPlayingNote
                    ? 'bg-amber-400 text-slate-950 scale-110 shadow-lg'
                    : isTonic
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-950 text-slate-200 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] text-slate-500 font-normal">
                  {idx + 1}º
                </span>
                <span className="text-sm font-black">{note}</span>
              </button>
            );
          })}
        </div>

        {/* Visual Piano Keyboard with active notes */}
        <div className="pt-4 border-t border-slate-800">
          <PianoKeyboard
            highlightNotes={notes}
            bassNote={selectedKey}
            octaves={2}
          />
        </div>
      </div>
    </div>
  );
};
