import React, { useState } from 'react';
import { CircleOfFifths } from '../components/CircleOfFifths';
import { getMajorHarmonicField, get251 } from '../utils/musicTheory';
import { audioSynth } from '../services/audioSynth';
import { Volume2, Play, Sparkles } from 'lucide-react';

interface CirculoQuintasPageProps {
  onNavigateTo251?: (key: string) => void;
}

export const CirculoQuintasPage: React.FC<CirculoQuintasPageProps> = ({
  onNavigateTo251,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>('C');

  const field = getMajorHarmonicField(selectedKey);
  const twoFiveOne = get251(selectedKey, 'major');

  return (
    <div className="space-y-6">
      {/* Circle Component */}
      <CircleOfFifths
        selectedKey={selectedKey}
        onSelectKey={(k) => setSelectedKey(k)}
      />

      {/* Field Overview for Selected Key */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Campo Harmônico Diatônico de {selectedKey} Maior</span>
            </h3>
            <p className="text-xs text-slate-400">
              Todos os acordes gerados pela armadura de clave de {selectedKey}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const notesList = field.degrees.map((d) => d.tetrad.notes);
                audioSynth.playProgression(notesList, 85);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Ouvir Todos os 7 Graus</span>
            </button>
          </div>
        </div>

        {/* 7 Degrees Horizontal Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {field.degrees.map((deg) => (
            <div
              key={deg.degree}
              onClick={() => audioSynth.playChordNotes(deg.tetrad.notes, 1.4, true)}
              className="cursor-pointer bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-amber-500/50 text-center transition-colors group"
            >
              <span className="text-[10px] text-amber-400 font-mono font-bold block mb-1">
                Grau {deg.romanNumeral}
              </span>
              <div className="text-base font-black text-slate-100 group-hover:text-amber-300 font-mono">
                {deg.tetrad.symbol}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">{deg.function}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
