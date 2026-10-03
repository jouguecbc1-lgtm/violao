import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Plus, Minus, Volume2 } from 'lucide-react';
import { audioSynth } from '../services/audioSynth';

interface MetronomeProps {
  initialBpm?: number;
  onBpmChange?: (bpm: number) => void;
  className?: string;
  compact?: boolean;
}

export const Metronome: React.FC<MetronomeProps> = ({
  initialBpm = 80,
  onBpmChange,
  className = '',
  compact = false,
}) => {
  const [bpm, setBpm] = useState(initialBpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(0);

  const timerRef = useRef<number | null>(null);
  const tapTimesRef = useRef<number[]>([]);

  const handleBpmUpdate = (newBpm: number) => {
    const clamped = Math.max(40, Math.min(240, newBpm));
    setBpm(clamped);
    if (onBpmChange) onBpmChange(clamped);
  };

  // Metronome tick logic
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setCurrentBeat(0);
      return;
    }

    const intervalMs = (60 / bpm) * 1000;

    let beat = 0;
    timerRef.current = window.setInterval(() => {
      const isFirstBeat = beat === 0;
      audioSynth.playClick(isFirstBeat);
      setCurrentBeat(beat);
      beat = (beat + 1) % beatsPerMeasure;
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm, beatsPerMeasure]);

  // Tap tempo
  const handleTapTempo = () => {
    const now = performance.now();
    const times = tapTimesRef.current;
    times.push(now);

    if (times.length > 4) {
      times.shift();
    }

    if (times.length >= 2) {
      const intervals = [];
      for (let i = 1; i < times.length; i++) {
        intervals.push(times[i] - times[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      if (calculatedBpm >= 40 && calculatedBpm <= 240) {
        handleBpmUpdate(calculatedBpm);
      }
    }
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-bold text-slate-100">Metrônomo</span>
        </div>
        <div className="flex items-center gap-1">
          {[2, 3, 4, 6].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setBeatsPerMeasure(num)}
              className={`px-2 py-0.5 text-xs rounded transition-colors ${
                beatsPerMeasure === num
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {num}/4
            </button>
          ))}
        </div>
      </div>

      {/* Beats visual indicator */}
      <div className="flex items-center justify-center gap-2 my-2 py-2 bg-slate-950/60 rounded-lg">
        {Array.from({ length: beatsPerMeasure }).map((_, i) => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-100 ${
              isPlaying && currentBeat === i
                ? i === 0
                  ? 'bg-amber-400 scale-125 shadow-lg shadow-amber-400/50'
                  : 'bg-emerald-400 scale-110 shadow-lg shadow-emerald-400/40'
                : 'bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* BPM Display & Quick Controls */}
      <div className="flex items-center justify-center gap-3 my-3">
        <button
          type="button"
          onClick={() => handleBpmUpdate(bpm - 5)}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg active:scale-95 transition-transform"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="text-center min-w-[90px]">
          <span className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
            {bpm}
          </span>
          <span className="block text-[10px] text-slate-400 uppercase tracking-widest -mt-1">
            BPM
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleBpmUpdate(bpm + 5)}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Slider */}
      <input
        type="range"
        min="40"
        max="240"
        value={bpm}
        onChange={(e) => handleBpmUpdate(Number(e.target.value))}
        className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg mb-4"
      />

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-xs transition-colors ${
            isPlaying
              ? 'bg-rose-500 hover:bg-rose-600 text-white'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10'
          }`}
        >
          {isPlaying ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Parar</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Iniciar Metrônomo</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleTapTempo}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg active:scale-95 transition-transform"
          title="Clique no ritmo desejado para calcular o BPM automaticamente"
        >
          Tap Tempo
        </button>
      </div>
    </div>
  );
};
