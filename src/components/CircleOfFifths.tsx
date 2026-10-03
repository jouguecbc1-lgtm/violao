import React from 'react';
import { Volume2, Play } from 'lucide-react';
import { CIRCLE_OF_FIFTHS, CircleKeyData, get251 } from '../utils/musicTheory';
import { audioSynth } from '../services/audioSynth';

interface CircleOfFifthsProps {
  selectedKey: string;
  onSelectKey: (key: string) => void;
  className?: string;
}

export const CircleOfFifths: React.FC<CircleOfFifthsProps> = ({
  selectedKey,
  onSelectKey,
  className = '',
}) => {
  const currentKeyData =
    CIRCLE_OF_FIFTHS.find((k) => k.key === selectedKey) || CIRCLE_OF_FIFTHS[0];

  const twoFiveOne = get251(currentKeyData.key, 'major');

  // Math for SVG Circle coordinates (12 positions clockwise starting from C at 12 o'clock)
  const radius = 130;
  const innerRadius = 88;
  const centerX = 160;
  const centerY = 160;

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>Círculo das Quintas Interativo</span>
            <span className="text-xs text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded">
              12 Tonalidades
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Clique em qualquer tonalidade para calcular armadura, relativa menor e II-V-I
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const chordsNotes = [
              twoFiveOne.ii.notes,
              twoFiveOne.V.notes,
              twoFiveOne.I.notes,
            ];
            audioSynth.playProgression(chordsNotes, 85);
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Tocar 2-5-1 de {currentKeyData.key}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Circle View */}
        <div className="lg:col-span-7 flex justify-center py-2">
          <svg width="320" height="320" viewBox="0 0 320 320" className="select-none">
            {/* Outer and Inner Circle Track */}
            <circle cx={centerX} cy={centerY} r={radius + 18} fill="#0b1120" stroke="#1e293b" strokeWidth="2" />
            <circle cx={centerX} cy={centerY} r={radius - 20} fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx={centerX} cy={centerY} r={innerRadius - 25} fill="#090d16" stroke="#1e293b" strokeWidth="1" />

            {/* Render 12 Segments */}
            {CIRCLE_OF_FIFTHS.map((item, index) => {
              // 12 o'clock is -90 degrees (-Math.PI / 2)
              const angle = (index * 30 - 90) * (Math.PI / 180);
              const xMajor = centerX + radius * Math.cos(angle);
              const yMajor = centerY + radius * Math.sin(angle);

              const xMinor = centerX + innerRadius * Math.cos(angle);
              const yMinor = centerY + innerRadius * Math.sin(angle);

              const isSelected = item.key === currentKeyData.key;
              const isDominant = item.key === currentKeyData.dominant;
              const isSubdominant = item.key === currentKeyData.subdominant;

              return (
                <g
                  key={item.key}
                  onClick={() => {
                    onSelectKey(item.key);
                    const t = get251(item.key, 'major');
                    audioSynth.playChordNotes(t.I.notes, 1.2);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Highlight pill behind selected */}
                  {isSelected && (
                    <circle
                      cx={xMajor}
                      cy={yMajor}
                      r="19"
                      fill="#f59e0b"
                      opacity="0.9"
                      className="animate-pulse"
                    />
                  )}
                  {isDominant && (
                    <circle cx={xMajor} cy={yMajor} r="16" fill="#f59e0b" opacity="0.25" />
                  )}
                  {isSubdominant && (
                    <circle cx={xMajor} cy={yMajor} r="16" fill="#3b82f6" opacity="0.25" />
                  )}

                  {/* Major Key Text */}
                  <text
                    x={xMajor}
                    y={yMajor + 5}
                    textAnchor="middle"
                    fill={isSelected ? '#0f172a' : '#f8fafc'}
                    fontSize="13"
                    fontWeight="bold"
                    className="transition-transform group-hover:scale-110"
                  >
                    {item.key}
                  </text>

                  {/* Relative Minor Key Text */}
                  <text
                    x={xMinor}
                    y={yMinor + 4}
                    textAnchor="middle"
                    fill={isSelected ? '#f59e0b' : '#94a3b8'}
                    fontSize="10"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {item.relativeMinor}
                  </text>
                </g>
              );
            })}

            {/* Center Content */}
            <circle cx={centerX} cy={centerY} r="32" fill="#1e293b" />
            <text
              x={centerX}
              y={centerY - 4}
              textAnchor="middle"
              fill="#f8fafc"
              fontSize="14"
              fontWeight="bold"
            >
              {currentKeyData.key}
            </text>
            <text
              x={centerX}
              y={centerY + 12}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="9"
              fontWeight="bold"
            >
              {currentKeyData.accidentals === 0
                ? 'Sem acidentes'
                : `${currentKeyData.accidentals} ${
                    currentKeyData.accidentalType === 'sharp' ? '♯ sustenidos' : '♭ bemóis'
                  }`}
            </text>
          </svg>
        </div>

        {/* Selected Key Details Panel */}
        <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <span className="text-xs text-slate-400">Tonalidade Selecionada:</span>
              <h4 className="text-xl font-bold text-amber-400">
                {currentKeyData.key} Maior
              </h4>
            </div>
            <button
              type="button"
              onClick={() => audioSynth.playChordNotes(twoFiveOne.I.notes, 1.5)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
              title="Ouvir acorde de tônica"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Relativa Menor (VI):</span>
              <span className="text-sm font-bold text-slate-100">{currentKeyData.relativeMinor}</span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Armadura de Clave:</span>
              <span className="text-sm font-bold text-amber-400">
                {currentKeyData.accidentals === 0
                  ? 'Natural (0)'
                  : `${currentKeyData.accidentals} ${
                      currentKeyData.accidentalType === 'sharp' ? '♯' : '♭'
                    }`}
              </span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Dominante Primário (V):</span>
              <span className="text-sm font-bold text-amber-300">{currentKeyData.dominant}7</span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Subdominante (IV):</span>
              <span className="text-sm font-bold text-blue-300">{currentKeyData.subdominant}maj7</span>
            </div>
          </div>

          {/* Quick II - V - I Display */}
          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-300">
                Progressão II – V – I em {currentKeyData.key}:
              </span>
              <span className="text-[10px] text-amber-400 font-mono">Jazz Standard</span>
            </div>

            <div className="flex items-center justify-between gap-2 text-xs font-mono pt-1">
              <div
                onClick={() => audioSynth.playChordNotes(twoFiveOne.ii.notes, 1.4)}
                className="flex-1 cursor-pointer bg-slate-950 p-2 rounded text-center border border-slate-800 hover:border-blue-500/50 transition-colors"
              >
                <div className="text-[10px] text-blue-400">II (Prep)</div>
                <div className="font-bold text-slate-100">{twoFiveOne.ii.chord}</div>
              </div>
              <span className="text-slate-600">→</span>
              <div
                onClick={() => audioSynth.playChordNotes(twoFiveOne.V.notes, 1.4)}
                className="flex-1 cursor-pointer bg-slate-950 p-2 rounded text-center border border-slate-800 hover:border-amber-500/50 transition-colors"
              >
                <div className="text-[10px] text-amber-400">V (Tensão)</div>
                <div className="font-bold text-slate-100">{twoFiveOne.V.chord}</div>
              </div>
              <span className="text-slate-600">→</span>
              <div
                onClick={() => audioSynth.playChordNotes(twoFiveOne.I.notes, 1.4)}
                className="flex-1 cursor-pointer bg-slate-950 p-2 rounded text-center border border-slate-800 hover:border-emerald-500/50 transition-colors"
              >
                <div className="text-[10px] text-emerald-400">I (Repouso)</div>
                <div className="font-bold text-slate-100">{twoFiveOne.I.chord}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
