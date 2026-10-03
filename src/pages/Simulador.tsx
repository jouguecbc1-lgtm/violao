import React, { useState } from 'react';
import { Play, RotateCcw, Volume2, Plus, Trash2, Cpu, Zap, Music } from 'lucide-react';
import { KEY_LIST, getMajorHarmonicField, getMinorHarmonicField, get251 } from '../utils/musicTheory';
import { audioSynth } from '../services/audioSynth';
import { ScaleDegreeInfo } from '../types';

export const Simulador: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('C');
  const [scaleType, setScaleType] = useState<'major' | 'minor_natural' | 'minor_harmonic'>('major');
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(85);

  // Selected Degrees for Custom Progression (1-indexed: 1 = I, 2 = II, etc.)
  const [progressionDegrees, setProgressionDegrees] = useState<number[]>([2, 5, 1]); // default II - V - I

  const field =
    scaleType === 'major'
      ? getMajorHarmonicField(selectedKey)
      : getMinorHarmonicField(selectedKey, scaleType);

  const twoFiveOne = get251(selectedKey, scaleType === 'major' ? 'major' : 'minor');

  // Convert progression degrees to chord definitions
  const activeChords = progressionDegrees.map((degNum) => {
    const degreeIndex = ((degNum - 1) % 7 + 7) % 7;
    return field.degrees[degreeIndex];
  });

  const handlePlayProgression = () => {
    setIsPlaying(true);
    const chordsNotes = activeChords.map((c) => c.tetrad.notes);

    audioSynth.playProgression(
      chordsNotes,
      bpm,
      (idx) => setActiveStepIndex(idx),
      () => {
        setIsPlaying(false);
        setActiveStepIndex(null);
      }
    );
  };

  const handleStopProgression = () => {
    audioSynth.stopPlayback();
    setIsPlaying(false);
    setActiveStepIndex(null);
  };

  const addDegree = (deg: number) => {
    if (progressionDegrees.length < 8) {
      setProgressionDegrees([...progressionDegrees, deg]);
    }
  };

  const removeDegree = (index: number) => {
    if (progressionDegrees.length > 1) {
      setProgressionDegrees(progressionDegrees.filter((_, i) => i !== index));
    }
  };

  const setPreset = (preset: number[]) => {
    setProgressionDegrees(preset);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-400" />
              <span>Simulador Interativo de Progressões</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Monte sua sequência harmônica escolhendo graus romanos e execute em tempo real com Web Audio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <span>BPM:</span>
              <input
                type="number"
                min="40"
                max="240"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-16 bg-slate-950 border border-slate-700 text-amber-400 font-mono font-bold text-xs rounded-lg px-2 py-1 text-center"
              />
            </div>

            <button
              type="button"
              onClick={isPlaying ? handleStopProgression : handlePlayProgression}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 ${
                isPlaying
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {isPlaying ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Parar</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>▶ TOCAR PROGRESSÃO</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Key and Mode Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5">
              Tonalidade Base:
            </label>
            <div className="grid grid-cols-6 gap-1">
              {KEY_LIST.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedKey(key)}
                  className={`py-1.5 px-1 text-xs font-bold rounded-lg transition-all ${
                    selectedKey === key
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5">
              Tipo de Escala:
            </label>
            <div className="flex gap-2">
              {[
                { id: 'major', label: 'Maior' },
                { id: 'minor_natural', label: 'Menor Natural' },
                { id: 'minor_harmonic', label: 'Menor Harmônica' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setScaleType(s.id as typeof scaleType)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    scaleType === s.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Builder Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Sua Sequência Harmônica Atual ({progressionDegrees.length} acordes)
            </h3>
            <p className="text-xs text-slate-400">
              Clique nos graus abaixo para adicionar ou clique no &quot;x&quot; para remover
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setPreset([2, 5, 1])}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs rounded-lg border border-slate-700"
            >
              II – V – I
            </button>
            <button
              type="button"
              onClick={() => setPreset([1, 6, 2, 5])}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700"
            >
              I – VI – II – V
            </button>
            <button
              type="button"
              onClick={() => setPreset([1, 4, 5, 1])}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700"
            >
              I – IV – V – I
            </button>
            <button
              type="button"
              onClick={() => setPreset([1, 5, 6, 4])}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700"
            >
              I – V – VI – IV
            </button>
          </div>
        </div>

        {/* Current Progression Steps Visor */}
        <div className="flex flex-wrap items-center justify-center gap-3 py-4 min-h-[120px] bg-slate-950 rounded-2xl border border-slate-800 p-4">
          {activeChords.map((chordDegree, idx) => {
            const isCurrentStep = activeStepIndex === idx;

            let badgeColor = 'text-blue-400';
            if (chordDegree.function === 'Dominante') badgeColor = 'text-amber-400';
            if (chordDegree.function === 'Tônica') badgeColor = 'text-emerald-400';

            return (
              <React.Fragment key={idx}>
                <div
                  onClick={() => audioSynth.playChordNotes(chordDegree.tetrad.notes, 1.4, true)}
                  className={`relative cursor-pointer min-w-[90px] p-3 rounded-xl border text-center transition-all ${
                    isCurrentStep
                      ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 scale-105 shadow-xl shadow-amber-500/20'
                      : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDegree(idx);
                    }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-slate-800 hover:bg-rose-500 text-slate-400 hover:text-white rounded-full flex items-center justify-center text-[10px]"
                    title="Remover acorde"
                  >
                    ×
                  </button>

                  <span className={`text-[10px] font-mono font-bold block mb-0.5 ${badgeColor}`}>
                    {chordDegree.romanNumeral} ({chordDegree.function})
                  </span>

                  <span className="text-lg sm:text-xl font-black text-slate-100 block font-mono">
                    {chordDegree.tetrad.symbol}
                  </span>

                  <span className="text-[9px] text-slate-400 block mt-1">
                    {chordDegree.tetrad.notes.join('·')}
                  </span>
                </div>

                {idx < activeChords.length - 1 && (
                  <span className="text-slate-600 font-bold text-sm">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Degree Picker Buttons Palette */}
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Adicionar Grau à Progressão (Clique para incluir):
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {field.degrees.map((deg) => (
              <button
                key={deg.degree}
                type="button"
                onClick={() => addDegree(deg.degree)}
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-xl text-center transition-colors group"
              >
                <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-bold text-amber-400">
                  <span>Grau {deg.romanNumeral}</span>
                  <Plus className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                </div>
                <div className="text-base font-black text-slate-100 mt-1 font-mono">
                  {deg.tetrad.symbol}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{deg.function}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
