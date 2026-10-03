import React, { useState } from 'react';
import { Volume2, ArrowRight, ShieldCheck, Compass, Zap } from 'lucide-react';
import { audioSynth } from '../services/audioSynth';
import { getMajorHarmonicField } from '../utils/musicTheory';

interface HarmonicFlowMapProps {
  currentKey?: string;
  onSelectChord?: (chord: string) => void;
  className?: string;
}

export const HarmonicFlowMap: React.FC<HarmonicFlowMapProps> = ({
  currentKey = 'C',
  onSelectChord,
  className = '',
}) => {
  const [activeFunction, setActiveFunction] = useState<'tonica' | 'subdominante' | 'dominante'>('tonica');

  const field = getMajorHarmonicField(currentKey);

  // Group chords by function
  const tonicaDegrees = [field.degrees[0], field.degrees[2], field.degrees[5]]; // I, III, VI
  const subdominanteDegrees = [field.degrees[1], field.degrees[3]]; // II, IV
  const dominanteDegrees = [field.degrees[4], field.degrees[6]]; // V, VII

  const playFunctionChords = (degrees: typeof field.degrees) => {
    const chordNotesList = degrees.map((d) => d.tetrad.notes);
    audioSynth.playProgression(chordNotesList, 90);
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>Mapa de Fluxo e Gravidade Harmônica</span>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
              Tom: {currentKey} Maior
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            A narrativa sonora ocidental: Repouso → Afastamento → Tensão → Resolução
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const chords = [
              field.degrees[0].tetrad.notes, // I (Tônica)
              field.degrees[1].tetrad.notes, // II (Subdominante)
              field.degrees[4].tetrad.notes, // V (Dominante)
              field.degrees[0].tetrad.notes, // I (Resolução)
            ];
            audioSynth.playProgression(chords, 75);
          }}
          className="flex items-center justify-center gap-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
        >
          <Volume2 className="w-4 h-4" />
          <span>Ouvir Ciclo Completo (I → II → V → I)</span>
        </button>
      </div>

      {/* Interactive 3-Pillar Visual Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {/* TÔNICA */}
        <div
          onClick={() => setActiveFunction('tonica')}
          className={`cursor-pointer rounded-xl p-4 border transition-all ${
            activeFunction === 'tonica'
              ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/50'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              Tônica (Repouso)
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playFunctionChords(tonicaDegrees);
              }}
              className="p-1 hover:bg-emerald-500/20 text-emerald-400 rounded"
              title="Ouvir acordes de tônica"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            Ponto de equilíbrio absoluto e estabilidade acústica. O lar onde a música descansa.
          </p>

          <div className="space-y-1.5">
            {tonicaDegrees.map((deg) => (
              <div
                key={deg.degree}
                onClick={(e) => {
                  e.stopPropagation();
                  audioSynth.playChordNotes(deg.tetrad.notes, 1.5, true);
                  if (onSelectChord) onSelectChord(deg.tetrad.symbol);
                }}
                className="flex items-center justify-between px-2.5 py-1.5 bg-slate-900/90 hover:bg-emerald-900/30 rounded border border-slate-800 hover:border-emerald-500/50 text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-emerald-400 font-bold w-6">{deg.romanNumeral}</span>
                  <span className="font-semibold text-slate-200">{deg.tetrad.symbol}</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {deg.degree === 1 ? 'Principal' : deg.degree === 6 ? 'Relativa Menor' : 'Anti-tônica'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SUBDOMINANTE */}
        <div
          onClick={() => setActiveFunction('subdominante')}
          className={`cursor-pointer rounded-xl p-4 border transition-all ${
            activeFunction === 'subdominante'
              ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500/50'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400">
              <Compass className="w-4 h-4" />
              Subdominante (Movimento)
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playFunctionChords(subdominanteDegrees);
              }}
              className="p-1 hover:bg-blue-500/20 text-blue-400 rounded"
              title="Ouvir acordes subdominantes"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            Afastamento do repouso, abertura expressiva. Prepara e conduz com firmeza ao dominante.
          </p>

          <div className="space-y-1.5">
            {subdominanteDegrees.map((deg) => (
              <div
                key={deg.degree}
                onClick={(e) => {
                  e.stopPropagation();
                  audioSynth.playChordNotes(deg.tetrad.notes, 1.5, true);
                  if (onSelectChord) onSelectChord(deg.tetrad.symbol);
                }}
                className="flex items-center justify-between px-2.5 py-1.5 bg-slate-900/90 hover:bg-blue-900/30 rounded border border-slate-800 hover:border-blue-500/50 text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-blue-400 font-bold w-6">{deg.romanNumeral}</span>
                  <span className="font-semibold text-slate-200">{deg.tetrad.symbol}</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {deg.degree === 2 ? 'Rei da Preparação (2-5-1)' : 'Abertura Plagal'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* DOMINANTE */}
        <div
          onClick={() => setActiveFunction('dominante')}
          className={`cursor-pointer rounded-xl p-4 border transition-all ${
            activeFunction === 'dominante'
              ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500/50'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Zap className="w-4 h-4" />
              Dominante (Tensão Máxima)
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playFunctionChords(dominanteDegrees);
              }}
              className="p-1 hover:bg-amber-500/20 text-amber-400 rounded"
              title="Ouvir acordes dominantes"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            Contém o trítono de atrito e a sensível. Eletricidade sonora que implora por resolução na tônica.
          </p>

          <div className="space-y-1.5">
            {dominanteDegrees.map((deg) => (
              <div
                key={deg.degree}
                onClick={(e) => {
                  e.stopPropagation();
                  audioSynth.playChordNotes(deg.tetrad.notes, 1.5, true);
                  if (onSelectChord) onSelectChord(deg.tetrad.symbol);
                }}
                className="flex items-center justify-between px-2.5 py-1.5 bg-slate-900/90 hover:bg-amber-900/30 rounded border border-slate-800 hover:border-amber-500/50 text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-amber-400 font-bold w-6">{deg.romanNumeral}</span>
                  <span className="font-semibold text-slate-200">{deg.tetrad.symbol}</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {deg.degree === 5 ? 'Dominante Primário (V7)' : 'Sensível Meio-Diminuta'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Resolution Cycle Arrow */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-400">
        <span className="font-semibold text-emerald-400">Tônica (I)</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
        <span className="font-semibold text-blue-400">Subdominante (II / IV)</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
        <span className="font-semibold text-amber-400">Dominante (V / VII)</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
        <span className="font-semibold text-emerald-400">Tônica (I)</span>
      </div>
    </div>
  );
};
