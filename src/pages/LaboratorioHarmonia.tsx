import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Square,
  Repeat,
  Volume2,
  Sparkles,
  ArrowRight,
  ArrowRightLeft,
  RotateCcw,
  Zap,
  Activity,
  Layers,
  HelpCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { KEY_LIST, get251, noteToSemitone, semitoneToNote } from '../utils/musicTheory';
import { audioSynth } from '../services/audioSynth';
import { Instrument, SoundTimbre, GuitarTuning } from '../types';
import { PianoKeyboard } from '../components/PianoKeyboard';
import { VirtualGuitarFretboard } from '../components/VirtualGuitarFretboard';
import { BassFretboard } from '../components/BassFretboard';

interface LaboratorioHarmoniaProps {
  initialKey?: string;
  userInstrument?: Instrument;
  onNavigate?: (page: string, param?: string) => void;
}

interface ProgressionOption {
  id: string;
  name: string;
  category: 'Clássicas' | 'Jazz' | 'Gospel' | 'Bossa Nova';
  romanNumerals: string[];
  getChords: (key: string) => { chord: string; notes: string[]; role: string; function: string }[];
}

const PRESET_PROGRESSIONS: ProgressionOption[] = [
  {
    id: '251_maior',
    name: 'II – V – I Maior (Padrão Ouro)',
    category: 'Jazz',
    romanNumerals: ['II', 'V', 'I'],
    getChords: (key) => {
      const data = get251(key, 'major');
      return [
        { chord: data.ii.chord, notes: data.ii.notes, role: data.ii.role, function: 'Subdominante (Preparação)' },
        { chord: data.V.chord, notes: data.V.notes, role: data.V.role, function: 'Dominante (Tensão / Trítono)' },
        { chord: data.I.chord, notes: data.I.notes, role: data.I.role, function: 'Tônica (Repouso Absoluto)' },
      ];
    },
  },
  {
    id: '251_menor',
    name: 'II – V – I Menor (m7b5 – 7(b9) – m7)',
    category: 'Jazz',
    romanNumerals: ['IIø', 'V7', 'Im7'],
    getChords: (key) => {
      const data = get251(key, 'minor');
      return [
        { chord: data.ii.chord, notes: data.ii.notes, role: data.ii.role, function: 'Subdominante (Meio-Diminuto)' },
        { chord: data.V.chord, notes: data.V.notes, role: data.V.role, function: 'Dominante Tenso' },
        { chord: data.I.chord, notes: data.I.notes, role: data.I.role, function: 'Tônica Menor' },
      ];
    },
  },
  {
    id: '1_6_2_5',
    name: 'I – VI – II – V (Anatomia do Turnaround)',
    category: 'Jazz',
    romanNumerals: ['I', 'VI', 'II', 'V'],
    getChords: (key) => {
      const rootSemi = noteToSemitone(key);
      const I_notes = [semitoneToNote(rootSemi), semitoneToNote(rootSemi + 4), semitoneToNote(rootSemi + 7), semitoneToNote(rootSemi + 11)];
      const vi_root = semitoneToNote(rootSemi + 9);
      const vi_notes = [vi_root, semitoneToNote(rootSemi + 9 + 3), semitoneToNote(rootSemi + 9 + 7), semitoneToNote(rootSemi + 9 + 10)];
      const ii_root = semitoneToNote(rootSemi + 2);
      const ii_notes = [ii_root, semitoneToNote(rootSemi + 2 + 3), semitoneToNote(rootSemi + 2 + 7), semitoneToNote(rootSemi + 2 + 10)];
      const V_root = semitoneToNote(rootSemi + 7);
      const V_notes = [V_root, semitoneToNote(rootSemi + 7 + 4), semitoneToNote(rootSemi + 7 + 7), semitoneToNote(rootSemi + 7 + 10)];

      return [
        { chord: `${key}maj7`, notes: I_notes, role: 'Tônica', function: 'Tônica' },
        { chord: `${vi_root}m7`, notes: vi_notes, role: 'Relativa Menor', function: 'Tônica' },
        { chord: `${ii_root}m7`, notes: ii_notes, role: 'Preparação', function: 'Subdominante' },
        { chord: `${V_root}7`, notes: V_notes, role: 'Tensão', function: 'Dominante' },
      ];
    },
  },
  {
    id: 'subv_251',
    name: 'II – SubV7 – I (Substituição por Trítono)',
    category: 'Bossa Nova',
    romanNumerals: ['II', 'SubV', 'I'],
    getChords: (key) => {
      const rootSemi = noteToSemitone(key);
      const ii_root = semitoneToNote(rootSemi + 2);
      const ii_notes = [ii_root, semitoneToNote(rootSemi + 2 + 3), semitoneToNote(rootSemi + 2 + 7), semitoneToNote(rootSemi + 2 + 10)];
      const subv_root = semitoneToNote(rootSemi + 1); // half step above tonic!
      const subv_notes = [subv_root, semitoneToNote(rootSemi + 1 + 4), semitoneToNote(rootSemi + 1 + 7), semitoneToNote(rootSemi + 1 + 10)];
      const I_notes = [semitoneToNote(rootSemi), semitoneToNote(rootSemi + 4), semitoneToNote(rootSemi + 7), semitoneToNote(rootSemi + 11)];

      return [
        { chord: `${ii_root}m7`, notes: ii_notes, role: 'Grau II', function: 'Subdominante' },
        { chord: `${subv_root}7`, notes: subv_notes, role: 'SubV7 (Baixo cromático que desce 1/2 tom)', function: 'Dominante Substituto' },
        { chord: `${key}maj7`, notes: I_notes, role: 'Grau I', function: 'Tônica' },
      ];
    },
  },
  {
    id: 'gospel_736',
    name: '7 – 3 – 6 Gospel (Cadência Emotiva)',
    category: 'Gospel',
    romanNumerals: ['VIIø', 'III7', 'VIm7'],
    getChords: (key) => {
      const rootSemi = noteToSemitone(key);
      const vii_root = semitoneToNote(rootSemi + 11);
      const vii_notes = [vii_root, semitoneToNote(rootSemi + 11 + 3), semitoneToNote(rootSemi + 11 + 6), semitoneToNote(rootSemi + 11 + 10)];
      const iii_root = semitoneToNote(rootSemi + 4);
      const iii_notes = [iii_root, semitoneToNote(rootSemi + 4 + 4), semitoneToNote(rootSemi + 4 + 7), semitoneToNote(rootSemi + 4 + 10)];
      const vi_root = semitoneToNote(rootSemi + 9);
      const vi_notes = [vi_root, semitoneToNote(rootSemi + 9 + 3), semitoneToNote(rootSemi + 9 + 7), semitoneToNote(rootSemi + 9 + 10)];

      return [
        { chord: `${vii_root}m7(b5)`, notes: vii_notes, role: 'Grau VII (II do VI)', function: 'Subdominante da Relativa' },
        { chord: `${iii_root}7`, notes: iii_notes, role: 'Grau III7 (V do VI)', function: 'Dominante Secundário Tenso' },
        { chord: `${vi_root}m7`, notes: vi_notes, role: 'Grau VIm7 (Resolução)', function: 'Tônica Relativa' },
      ];
    },
  },
];

export const LaboratorioHarmonia: React.FC<LaboratorioHarmoniaProps> = ({
  initialKey = 'C',
  userInstrument = 'violao',
  onNavigate,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>(initialKey);
  const [selectedProgId, setSelectedProgId] = useState<string>('251_maior');
  const [activeTimbre, setActiveTimbre] = useState<SoundTimbre>('piano');
  const [bpm, setBpm] = useState<number>(80);
  const [totalMeasures, setTotalMeasures] = useState<number>(8);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [currentMeasure, setCurrentMeasure] = useState<number>(1);
  const [currentBeat, setCurrentBeat] = useState<number>(1);
  const [activeInstrumentVisualizer, setActiveInstrumentVisualizer] = useState<Instrument>(userInstrument);

  // Challenge state
  const [challengeAnswered, setChallengeAnswered] = useState<number | null>(null);

  const activeProgDef = PRESET_PROGRESSIONS.find((p) => p.id === selectedProgId) || PRESET_PROGRESSIONS[0];
  const chords = activeProgDef.getChords(selectedKey);
  const activeChord = chords[currentStepIndex] || chords[0];

  useEffect(() => {
    return () => {
      audioSynth.stopPlayback();
    };
  }, []);

  const handleStartPractice = () => {
    if (isPlaying) {
      audioSynth.stopPlayback();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const chordsNotesList = chords.map((c) => c.notes);

    audioSynth.playLoopProgression(
      chordsNotesList,
      bpm,
      4, // 4 beats per measure
      totalMeasures,
      (chordIdx, measureNum) => {
        setCurrentStepIndex(chordIdx);
        setCurrentMeasure(measureNum);
      },
      (beatNum) => {
        setCurrentBeat(beatNum);
      },
      () => {
        setIsPlaying(false);
        setCurrentBeat(1);
      },
      activeTimbre
    );
  };

  const handleShiftKey = (semitones: number) => {
    const currentSemi = noteToSemitone(selectedKey);
    const newKey = semitoneToNote(currentSemi + semitones);
    setSelectedKey(newKey);
    if (isPlaying) {
      audioSynth.stopPlayback();
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Master Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border border-amber-500/40 p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Centro de Prática Integrado</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight">
              ⭐ Laboratório de <span className="text-amber-400">Harmonia Interativa</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1.5 leading-relaxed">
              Pratique progressões em loop com metrônomo sincronizado, escolha timbres realistas via Web Audio,
              analise condução de vozes e visualize simultaneamente no Teclado, Braço de Guitarra/Violão e Baixo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleStartPractice}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all shadow-lg active:scale-95 ${
                isPlaying
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>Pausar Prática</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>▶ Iniciar Prática em Loop</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Toolbar: Key, Progression, Timbre & BPM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
          {/* 1. Tonalidade */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Tonalidade</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleShiftKey(-1)}
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold"
                  title="-1 semitom"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => handleShiftKey(1)}
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold"
                  title="+1 semitom"
                >
                  +1
                </button>
              </div>
            </div>
            <select
              value={selectedKey}
              onChange={(e) => {
                setSelectedKey(e.target.value);
                if (isPlaying) {
                  audioSynth.stopPlayback();
                  setIsPlaying(false);
                }
              }}
              className="w-full bg-slate-900 text-amber-300 font-bold text-sm rounded-lg px-2.5 py-1.5 border border-slate-700 outline-none cursor-pointer"
            >
              {KEY_LIST.map((k) => (
                <option key={k} value={k}>
                  Tom: {k}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Progressão */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Progressão</span>
            <select
              value={selectedProgId}
              onChange={(e) => {
                setSelectedProgId(e.target.value);
                setCurrentStepIndex(0);
                if (isPlaying) {
                  audioSynth.stopPlayback();
                  setIsPlaying(false);
                }
              }}
              className="w-full bg-slate-900 text-slate-200 font-bold text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 outline-none cursor-pointer"
            >
              {PRESET_PROGRESSIONS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Timbre do Sintetizador */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Timbre (Web Audio)</span>
            <select
              value={activeTimbre}
              onChange={(e) => {
                const t = e.target.value as SoundTimbre;
                setActiveTimbre(t);
                audioSynth.setTimbre(t);
              }}
              className="w-full bg-slate-900 text-slate-200 font-bold text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 outline-none cursor-pointer"
            >
              <option value="piano">🎹 Piano Acústico</option>
              <option value="guitarra">🎸 Violão / Guitarra</option>
              <option value="baixo">🎸 Contrabaixo Elétrico</option>
              <option value="pads">🌌 Pad Atmosférico</option>
              <option value="orgao">⛪ Órgão Hammond</option>
            </select>
          </div>

          {/* 4. Metrônomo BPM & Compassos */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
              <span>Metrônomo</span>
              <span className="text-amber-400 font-mono">{bpm} BPM</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="50"
                max="180"
                step="5"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <select
                value={totalMeasures}
                onChange={(e) => setTotalMeasures(Number(e.target.value))}
                className="bg-slate-900 text-slate-300 text-[10px] font-bold rounded px-1.5 py-1 border border-slate-700"
                title="Duração do loop"
              >
                <option value={4}>4 comp.</option>
                <option value={8}>8 comp.</option>
                <option value={16}>16 comp.</option>
                <option value={0}>Infinito</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Synchronized Loop Playback Step Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Compasso {currentMeasure} {totalMeasures > 0 ? `/ ${totalMeasures}` : '(Loop)'}
            </span>
            {/* Visual Beat Metronome Dots */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
              {[1, 2, 3, 4].map((b) => (
                <div
                  key={b}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-75 ${
                    currentBeat === b
                      ? b === 1
                        ? 'bg-amber-400 scale-125 shadow-lg shadow-amber-400/50'
                        : 'bg-emerald-400 scale-110 shadow-md'
                      : 'bg-slate-800'
                  }`}
                />
              ))}
              <span className="text-[10px] font-mono text-slate-400 ml-1.5">4/4</span>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Clique em qualquer acorde para ouvir individualmente:
          </div>
        </div>

        {/* Chords Horizontal Sequence Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {chords.map((c, idx) => {
            const isActive = currentStepIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  audioSynth.playChordNotes(c.notes, 1.6, true, activeTimbre);
                }}
                className={`cursor-pointer rounded-2xl p-5 border text-center transition-all group ${
                  isActive
                    ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/50 scale-102 shadow-xl'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 mb-1">
                  <span>{activeProgDef.romanNumerals[idx] || `Grau ${idx + 1}`}</span>
                  <Volume2 className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </div>

                <div className="text-3xl font-black text-slate-100 font-mono tracking-tight group-hover:text-amber-300">
                  {c.chord}
                </div>

                <p className="text-xs text-slate-400 font-medium mt-1">{c.role}</p>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 font-mono text-[11px] text-slate-300 flex items-center justify-center gap-1.5">
                  {c.notes.map((n) => (
                    <span key={n} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {n}
                    </span>
                  ))}
                </div>

                <div className="mt-2 text-[10px] text-slate-400 bg-slate-900/60 py-0.5 px-2 rounded-md">
                  {c.function}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Voice Leading Connection Graphic */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Condução de Vozes Linear (Voice Leading)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Observe a economia de movimento: notas em comum mantidas e notas guia se resolvendo por semitom
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
            Regra do Mínimo Esforço
          </span>
        </div>

        {/* Visual Voice Leading Matrix */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto">
          <div className="flex items-center justify-around min-w-[500px] text-xs">
            {chords.map((c, idx) => (
              <React.Fragment key={idx}>
                <div className="text-center space-y-2">
                  <span className="text-sm font-black font-mono text-amber-400">{c.chord}</span>
                  <div className="space-y-1 font-mono">
                    {c.notes.map((note, nIdx) => (
                      <div
                        key={nIdx}
                        className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${
                          nIdx === 1
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : nIdx === 3
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-slate-900 text-slate-300 border-slate-800'
                        }`}
                      >
                        {note} <span className="text-[9px] opacity-75">{nIdx === 0 ? '(1)' : nIdx === 1 ? '(3ª)' : nIdx === 2 ? '(5ª)' : '(7ª)'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {idx < chords.length - 1 && (
                  <div className="text-slate-600 flex flex-col items-center justify-center pt-6">
                    <ArrowRight className="w-5 h-5 text-amber-400/70" />
                    <span className="text-[9px] font-mono text-slate-400 mt-1">1/2 tom</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Instrument Visualizers Selection */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Visualização do Acorde Ativo ({activeChord.chord}) no Instrumento
              </h3>
              <p className="text-[11px] text-slate-400">
                Alterne entre teclado, braço de violão/guitarra ou contrabaixo:
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveInstrumentVisualizer('teclado')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeInstrumentVisualizer === 'teclado'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🎹 Teclado / Piano</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveInstrumentVisualizer('guitarra')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeInstrumentVisualizer === 'guitarra'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🎸 Violão / Guitarra</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveInstrumentVisualizer('baixo')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeInstrumentVisualizer === 'baixo'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🎸 Contrabaixo</span>
            </button>
          </div>
        </div>

        {/* 1. Teclado */}
        {activeInstrumentVisualizer === 'teclado' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <PianoKeyboard
              chordName={activeChord.chord}
              highlightNotes={activeChord.notes}
              bassNote={activeChord.notes[0]}
              guideTones={{
                third: activeChord.notes[1],
                seventh: activeChord.notes[3],
              }}
              harmonicFunction={activeChord.function}
              octaves={2}
            />
          </div>
        )}

        {/* 2. Violão / Guitarra Braço Virtual */}
        {activeInstrumentVisualizer === 'guitarra' && (
          <VirtualGuitarFretboard
            chordName={activeChord.chord}
            notes={activeChord.notes}
            rootNote={activeChord.notes[0]}
            guideTones={{
              third: activeChord.notes[1],
              seventh: activeChord.notes[3],
            }}
          />
        )}

        {/* 3. Contrabaixo */}
        {activeInstrumentVisualizer === 'baixo' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <BassFretboard
              chordName={activeChord.chord}
              rootNote={activeChord.notes[0]}
              chordNotes={activeChord.notes}
              walkingLine={[activeChord.notes[0], activeChord.notes[1], activeChord.notes[2], activeChord.notes[3] || activeChord.notes[0]]}
              stringsCount={4}
            />
          </div>
        )}
      </div>

      {/* Quick Lab Knowledge Check Challenge */}
      <div className="bg-gradient-to-br from-slate-900 to-amber-950/30 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Desafio Rápido de Fixação do Laboratório</span>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-100">
            Na progressão {activeProgDef.name} em {selectedKey}, qual é o papel do acorde{' '}
            <span className="text-amber-400 font-mono">{chords[1]?.chord}</span>?
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Analise a tensão e a resolução do trítono para responder:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            { id: 0, text: 'Tensão máxima com trítono que prepara a resolução na tônica', correct: true },
            { id: 1, text: 'Repouso acústico sem qualquer instabilidade ou atrito', correct: false },
            { id: 2, text: 'Acorde neutro que não exerce nenhuma força direcional', correct: false },
          ].map((opt) => {
            const isSelected = challengeAnswered === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setChallengeAnswered(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  isSelected
                    ? opt.correct
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-500 text-rose-200'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-2">
                  {isSelected ? (
                    opt.correct ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-700 shrink-0 mt-0.5 inline-block" />
                  )}
                  <span>{opt.text}</span>
                </div>
              </button>
            );
          })}
        </div>

        {challengeAnswered !== null && (
          <div className="text-xs text-emerald-300 bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30">
            {challengeAnswered === 0
              ? '🎉 Exato! O acorde dominante carrega o trítono instável que anseia pelo repouso imediato no grau I.'
              : 'Revise o conceito: o segundo acorde da cadência 2-5-1 é o Grau V dominante, responsável pela tensão.'}
          </div>
        )}
      </div>
    </div>
  );
};
