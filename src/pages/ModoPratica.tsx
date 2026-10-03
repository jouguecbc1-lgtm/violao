import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Repeat, Activity, Volume2 } from 'lucide-react';
import { KEY_LIST, get251 } from '../utils/musicTheory';
import { audioSynth } from '../services/audioSynth';
import { Metronome } from '../components/Metronome';
import { PianoKeyboard } from '../components/PianoKeyboard';
import { FretboardDiagram } from '../components/FretboardDiagram';
import { BassFretboard } from '../components/BassFretboard';

export const ModoPratica: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('C');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [bpm, setBpm] = useState<number>(80);
  const [practiceInstrument, setPracticeInstrument] = useState<'teclado' | 'violao' | 'guitarra' | 'baixo' | 'nenhum'>('teclado');

  const loopTimerRef = useRef<number | null>(null);

  const twoFiveOne = get251(selectedKey, 'major');
  const chordSteps = [
    {
      chord: twoFiveOne.ii.chord,
      notes: twoFiveOne.ii.notes,
      degree: 'II',
      role: 'Preparação',
      color: 'text-blue-400 border-blue-500 bg-blue-950/30',
    },
    {
      chord: twoFiveOne.V.chord,
      notes: twoFiveOne.V.notes,
      degree: 'V',
      role: 'Tensão (Trítono)',
      color: 'text-amber-400 border-amber-500 bg-amber-950/30',
    },
    {
      chord: twoFiveOne.I.chord,
      notes: twoFiveOne.I.notes,
      degree: 'I',
      role: 'Resolução (Tônica)',
      color: 'text-emerald-400 border-emerald-500 bg-emerald-950/30',
    },
  ];

  const triggerStep = (stepIdx: number) => {
    setActiveStep(stepIdx);
    audioSynth.playChordNotes(chordSteps[stepIdx].notes, 1.8, true);
  };

  useEffect(() => {
    if (!isPlaying) {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
      return;
    }

    // Play initial step
    triggerStep(0);
    let step = 0;
    const intervalMs = (60 / bpm) * 2000; // 2 beats per chord

    loopTimerRef.current = window.setInterval(() => {
      step = (step + 1) % 3;
      if (step === 0 && !isLooping) {
        setIsPlaying(false);
        if (loopTimerRef.current) clearInterval(loopTimerRef.current);
        return;
      }
      triggerStep(step);
    }, intervalMs);

    return () => {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
    };
  }, [isPlaying, isLooping, bpm, selectedKey]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Key & Instrument Quick Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Tonalidade de Estudo:
          </span>
          <div className="flex flex-wrap gap-1">
            {KEY_LIST.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setSelectedKey(k);
                  setActiveStep(0);
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedKey === k
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:text-slate-100'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Live Instrument Visualizer Selector */}
        <div className="space-y-1 self-start sm:self-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Seu Instrumento:
          </span>
          <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[
              { id: 'teclado', label: '🎹 Teclado' },
              { id: 'violao', label: '🎸 Violão' },
              { id: 'guitarra', label: '⚡ Guitarra' },
              { id: 'baixo', label: '🎸 Baixo' },
              { id: 'nenhum', label: 'Apenas Acordes' },
            ].map((inst) => (
              <button
                key={inst.id}
                type="button"
                onClick={() => setPracticeInstrument(inst.id as typeof practiceInstrument)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  practiceInstrument === inst.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {inst.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Big Stage Chord Display */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 sm:p-14 text-center space-y-8 shadow-2xl relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <span className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-widest block">
            Tonalidade: {selectedKey} Maior
          </span>
          <div className="text-xs text-slate-400 font-mono">
            Graus: II → V → I · Funções: Preparação → Dominante → Tônica
          </div>
        </div>

        {/* 3 Giant Chord Cards */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {chordSteps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={idx}
                onClick={() => triggerStep(idx)}
                className={`cursor-pointer rounded-2xl p-6 sm:p-8 border-2 transition-all ${
                  isActive
                    ? `${step.color} scale-105 shadow-2xl shadow-amber-500/10`
                    : 'bg-slate-950/80 border-slate-800 opacity-60 hover:opacity-90'
                }`}
              >
                <span className="text-xs sm:text-sm font-mono font-bold block mb-2 uppercase tracking-wider">
                  Grau {step.degree} · {step.role}
                </span>

                <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight my-2">
                  {step.chord}
                </div>

                <div className="text-xs text-slate-400 font-mono mt-3">
                  {step.notes.join(' · ')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Synchronized Instrument Visualizer */}
        {practiceInstrument !== 'nenhum' && (
          <div className="relative z-10 p-4 bg-slate-950/70 border border-slate-800 rounded-2xl animate-in fade-in duration-150">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
              Digitação em Tempo Real ({chordSteps[activeStep].chord}):
            </span>

            {practiceInstrument === 'teclado' && (
              <PianoKeyboard
                highlightNotes={chordSteps[activeStep].notes}
                bassNote={chordSteps[activeStep].notes[0]}
                guideTones={{
                  third: chordSteps[activeStep].notes[1],
                  seventh: chordSteps[activeStep].notes[3],
                }}
                octaves={2}
              />
            )}

            {practiceInstrument === 'violao' && (
              <div className="flex justify-center">
                <FretboardDiagram
                  chordName={chordSteps[activeStep].chord}
                  notes={chordSteps[activeStep].notes}
                  instrument="violao"
                />
              </div>
            )}

            {practiceInstrument === 'guitarra' && (
              <div className="flex justify-center">
                <FretboardDiagram
                  chordName={chordSteps[activeStep].chord}
                  notes={chordSteps[activeStep].notes}
                  instrument="guitarra"
                />
              </div>
            )}

            {practiceInstrument === 'baixo' && (
              <BassFretboard
                chordName={chordSteps[activeStep].chord}
                rootNote={chordSteps[activeStep].notes[0]}
                chordNotes={chordSteps[activeStep].notes}
                stringsCount={4}
              />
            )}
          </div>
        )}

        {/* Control Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2.5 transition-all shadow-xl active:scale-95 ${
              isPlaying
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Reproduzir</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsLooping(!isLooping)}
            className={`px-5 py-3.5 rounded-2xl font-bold text-xs flex items-center gap-2 border transition-all ${
              isLooping
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Repeat className="w-4 h-4" />
            <span>Repetição Contínua ({isLooping ? 'Ativa' : 'Desativada'})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setActiveStep(0);
            }}
            className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 transition-colors"
            title="Resetar"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Integrated Metronome for Practice */}
      <div className="max-w-md mx-auto">
        <Metronome
          initialBpm={bpm}
          onBpmChange={(newBpm) => setBpm(newBpm)}
        />
      </div>
    </div>
  );
};
