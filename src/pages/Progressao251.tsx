import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Volume2,
  ArrowRight,
  Sparkles,
  Zap,
  Layers,
  ArrowDown,
  Repeat,
} from 'lucide-react';
import { KEY_LIST, get251, getChordInversions } from '../utils/musicTheory';
import { audioSynth } from '../services/audioSynth';
import { PianoKeyboard } from '../components/PianoKeyboard';
import { FretboardDiagram } from '../components/FretboardDiagram';

interface Progressao251Props {
  initialKey?: string;
  onNavigateToTransposer?: (prog: string[], fromKey: string) => void;
}

export const Progressao251: React.FC<Progressao251Props> = ({
  initialKey = 'C',
  onNavigateToTransposer,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>(initialKey);
  const [mode, setMode] = useState<'major' | 'minor'>('major');
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedInstrumentTab, setSelectedInstrumentTab] = useState<'piano' | 'violao'>('piano');
  const [selectedInversionChord, setSelectedInversionChord] = useState<'ii' | 'V' | 'I'>('ii');

  const twoFiveOne = get251(selectedKey, mode);

  // Play the 2-5-1 progression with step animation callback
  const handlePlayProgression = () => {
    setIsPlaying(true);
    const chordsList = [
      twoFiveOne.ii.notes,
      twoFiveOne.V.notes,
      twoFiveOne.I.notes,
    ];

    audioSynth.playProgression(
      chordsList,
      80,
      (stepIdx) => {
        setActiveStep(stepIdx);
      },
      () => {
        setIsPlaying(false);
        setActiveStep(null);
      }
    );
  };

  const handleStopProgression = () => {
    audioSynth.stopPlayback();
    setIsPlaying(false);
    setActiveStep(null);
  };

  const chordForInversions =
    selectedInversionChord === 'ii'
      ? twoFiveOne.ii
      : selectedInversionChord === 'V'
      ? twoFiveOne.V
      : twoFiveOne.I;

  const inversions = getChordInversions(chordForInversions.chord, chordForInversions.notes);

  return (
    <div className="space-y-8">
      {/* Hero 2-5-1 Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/30 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            <Zap className="w-4 h-4 fill-current" />
            <span>O Coração da Harmonia Moderna</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight mb-2">
            A Progressão <span className="text-amber-400">II – V – I</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            A mais famosa e resolutiva progressão da história da música ocidental.
            Combina a preparação do <strong className="text-blue-300">Grau II</strong>, a tensão extrema do{' '}
            <strong className="text-amber-300">Grau V</strong> e o repouso absoluto no{' '}
            <strong className="text-emerald-300">Grau I</strong>.
          </p>

          {/* Quick Key Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-400 font-semibold">Tonalidade:</span>
            <div className="flex flex-wrap gap-1">
              {KEY_LIST.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSelectedKey(k)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    selectedKey === k
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 ml-auto">
              <button
                type="button"
                onClick={() => setMode('major')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  mode === 'major'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2-5-1 Maior
              </button>
              <button
                type="button"
                onClick={() => setMode('minor')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  mode === 'minor'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2-5-1 Menor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Visual Progression Animation (II -> V -> I) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Cadência II – V – I em {selectedKey} {mode === 'major' ? 'Maior' : 'Menor'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Observe o fluxo de preparação, tensão do trítono e repouso
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={isPlaying ? handleStopProgression : handlePlayProgression}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 ${
                isPlaying
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {isPlaying ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Parar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>▶ Executar 2-5-1 Completo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3 Step Animated Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Grau II */}
          <div
            onClick={() => audioSynth.playChordNotes(twoFiveOne.ii.notes, 1.8)}
            className={`cursor-pointer rounded-2xl p-6 border transition-all text-center group ${
              activeStep === 0
                ? 'bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/50 scale-102 shadow-xl'
                : 'bg-slate-950 border-slate-800 hover:border-blue-500/40'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
              Grau II · Subdominante
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-100 font-mono mb-2 group-hover:text-blue-300">
              {twoFiveOne.ii.chord}
            </div>
            <div className="text-xs font-semibold text-slate-300 mb-3">
              {twoFiveOne.ii.role}
            </div>

            <div className="bg-slate-900/90 rounded-lg p-2.5 text-xs text-slate-400 font-mono border border-slate-800">
              <span className="block text-[10px] text-slate-500 uppercase">Notas:</span>
              <strong className="text-slate-200">{twoFiveOne.ii.notes.join(' · ')}</strong>
            </div>

            <div className="mt-3 text-[11px] text-blue-300/80 bg-blue-950/40 py-1 px-2 rounded">
              Função: Preparação para o dominante
            </div>
          </div>

          {/* Grau V */}
          <div
            onClick={() => audioSynth.playChordNotes(twoFiveOne.V.notes, 1.8)}
            className={`cursor-pointer rounded-2xl p-6 border transition-all text-center group ${
              activeStep === 1
                ? 'bg-amber-950/60 border-amber-500 ring-2 ring-amber-500/50 scale-102 shadow-xl'
                : 'bg-slate-950 border-slate-800 hover:border-amber-500/40'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              Grau V · Dominante
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-100 font-mono mb-2 group-hover:text-amber-300">
              {twoFiveOne.V.chord}
            </div>
            <div className="text-xs font-semibold text-slate-300 mb-3">
              {twoFiveOne.V.role}
            </div>

            <div className="bg-slate-900/90 rounded-lg p-2.5 text-xs text-slate-400 font-mono border border-slate-800">
              <span className="block text-[10px] text-slate-500 uppercase">Notas:</span>
              <strong className="text-slate-200">{twoFiveOne.V.notes.join(' · ')}</strong>
            </div>

            <div className="mt-3 text-[11px] text-amber-300/80 bg-amber-950/40 py-1 px-2 rounded">
              Contém o Trítono resolutivo
            </div>
          </div>

          {/* Grau I */}
          <div
            onClick={() => audioSynth.playChordNotes(twoFiveOne.I.notes, 1.8)}
            className={`cursor-pointer rounded-2xl p-6 border transition-all text-center group ${
              activeStep === 2
                ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/50 scale-102 shadow-xl'
                : 'bg-slate-950 border-slate-800 hover:border-emerald-500/40'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              Grau I · Tônica
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-100 font-mono mb-2 group-hover:text-emerald-300">
              {twoFiveOne.I.chord}
            </div>
            <div className="text-xs font-semibold text-slate-300 mb-3">
              {twoFiveOne.I.role}
            </div>

            <div className="bg-slate-900/90 rounded-lg p-2.5 text-xs text-slate-400 font-mono border border-slate-800">
              <span className="block text-[10px] text-slate-500 uppercase">Notas:</span>
              <strong className="text-slate-200">{twoFiveOne.I.notes.join(' · ')}</strong>
            </div>

            <div className="mt-3 text-[11px] text-emerald-300/80 bg-emerald-950/40 py-1 px-2 rounded">
              Repouso acústico e conclusão
            </div>
          </div>
        </div>

        {/* Motion Voice Leading Explanation */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>A Mágica da Condução de Vozes & Notas Guia (3ª e 7ª)</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            No 2-5-1, a condução de vozes mais suave da história ocorre através das{' '}
            <strong className="text-slate-100">Notas Guia</strong>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <strong className="text-amber-300 block mb-1">
                De {twoFiveOne.ii.chord} para {twoFiveOne.V.chord}:
              </strong>
              <span>
                A 7ª do II ({twoFiveOne.ii.notes[3]}) desce suavemente meio tom para a 3ª do V ({twoFiveOne.V.notes[1]}),
                enquanto a 3ª do II ({twoFiveOne.ii.notes[1]}) permanece fixa e vira a 7ª do V!
              </span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <strong className="text-emerald-300 block mb-1">
                De {twoFiveOne.V.chord} para {twoFiveOne.I.chord}:
              </strong>
              <span>
                A 7ª do V ({twoFiveOne.V.notes[3]}) desce meio tom para a 3ª do I ({twoFiveOne.I.notes[1]}),
                enquanto a 3ª do V ({twoFiveOne.V.notes[1]}) permanece fixa e vira a 7ª do I!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Piano & Guitar Voicings Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              Aplicação nos Instrumentos: Voicings de 2-5-1
            </h3>
            <p className="text-xs text-slate-400">
              Veja a digitação no teclado e os diagramas com cordas e trastes no violão/guitarra
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSelectedInstrumentTab('piano')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedInstrumentTab === 'piano'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Piano / Teclado
            </button>
            <button
              type="button"
              onClick={() => setSelectedInstrumentTab('violao')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedInstrumentTab === 'violao'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Violão / Guitarra
            </button>
          </div>
        </div>

        {selectedInstrumentTab === 'piano' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Piano II */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-400">{twoFiveOne.ii.chord}</span>
                  <button
                    type="button"
                    onClick={() => audioSynth.playChordNotes(twoFiveOne.ii.notes, 1.4)}
                    className="p-1 hover:bg-slate-800 text-slate-300 rounded"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs text-slate-400 space-y-1 mb-3">
                  <div>Mão Esquerda (Baixo): <strong className="text-amber-300">{twoFiveOne.ii.pianoGuideVoicing.bass}</strong></div>
                  <div>Mão Direita (Notas Guia): <strong className="text-slate-200">{twoFiveOne.ii.pianoGuideVoicing.rightHand.join(' + ')}</strong></div>
                </div>
                <PianoKeyboard
                  highlightNotes={twoFiveOne.ii.notes}
                  bassNote={twoFiveOne.ii.pianoGuideVoicing.bass}
                  guideTones={{
                    third: twoFiveOne.ii.pianoGuideVoicing.rightHand[0],
                    seventh: twoFiveOne.ii.pianoGuideVoicing.rightHand[1],
                  }}
                  octaves={1}
                />
              </div>

              {/* Piano V */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-400">{twoFiveOne.V.chord}</span>
                  <button
                    type="button"
                    onClick={() => audioSynth.playChordNotes(twoFiveOne.V.notes, 1.4)}
                    className="p-1 hover:bg-slate-800 text-slate-300 rounded"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs text-slate-400 space-y-1 mb-3">
                  <div>Mão Esquerda (Baixo): <strong className="text-amber-300">{twoFiveOne.V.pianoGuideVoicing.bass}</strong></div>
                  <div>Mão Direita (Notas Guia): <strong className="text-slate-200">{twoFiveOne.V.pianoGuideVoicing.rightHand.join(' + ')}</strong></div>
                </div>
                <PianoKeyboard
                  highlightNotes={twoFiveOne.V.notes}
                  bassNote={twoFiveOne.V.pianoGuideVoicing.bass}
                  guideTones={{
                    third: twoFiveOne.V.pianoGuideVoicing.rightHand[1],
                    seventh: twoFiveOne.V.pianoGuideVoicing.rightHand[0],
                  }}
                  octaves={1}
                />
              </div>

              {/* Piano I */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400">{twoFiveOne.I.chord}</span>
                  <button
                    type="button"
                    onClick={() => audioSynth.playChordNotes(twoFiveOne.I.notes, 1.4)}
                    className="p-1 hover:bg-slate-800 text-slate-300 rounded"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs text-slate-400 space-y-1 mb-3">
                  <div>Mão Esquerda (Baixo): <strong className="text-amber-300">{twoFiveOne.I.pianoGuideVoicing.bass}</strong></div>
                  <div>Mão Direita (Notas Guia): <strong className="text-slate-200">{twoFiveOne.I.pianoGuideVoicing.rightHand.join(' + ')}</strong></div>
                </div>
                <PianoKeyboard
                  highlightNotes={twoFiveOne.I.notes}
                  bassNote={twoFiveOne.I.pianoGuideVoicing.bass}
                  guideTones={{
                    third: twoFiveOne.I.pianoGuideVoicing.rightHand[0],
                    seventh: twoFiveOne.I.pianoGuideVoicing.rightHand[1],
                  }}
                  octaves={1}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FretboardDiagram chordName={twoFiveOne.ii.chord} notes={twoFiveOne.ii.notes} />
            <FretboardDiagram chordName={twoFiveOne.V.chord} notes={twoFiveOne.V.notes} />
            <FretboardDiagram chordName={twoFiveOne.I.chord} notes={twoFiveOne.I.notes} />
          </div>
        )}
      </div>

      {/* Inversions Explorer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100">Inversões dos Acordes do 2-5-1</h3>
            <p className="text-xs text-slate-400">
              Estado Fundamental, 1ª, 2ª e 3ª Inversão: alterando o baixo para condução elegante
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedInversionChord('ii')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                selectedInversionChord === 'ii'
                  ? 'bg-blue-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {twoFiveOne.ii.chord} (II)
            </button>
            <button
              type="button"
              onClick={() => setSelectedInversionChord('V')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                selectedInversionChord === 'V'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {twoFiveOne.V.chord} (V)
            </button>
            <button
              type="button"
              onClick={() => setSelectedInversionChord('I')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                selectedInversionChord === 'I'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {twoFiveOne.I.chord} (I)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {inversions.map((inv, idx) => (
            <div
              key={idx}
              onClick={() => audioSynth.playChordNotes(inv.notes, 1.5, true)}
              className="cursor-pointer bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-amber-500/50 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1">
                <span>{inv.name}</span>
                <Volume2 className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs text-slate-300 mb-2">
                Baixo em: <strong className="text-amber-300 font-mono text-sm">{inv.bass}</strong>
              </div>
              <div className="font-mono text-xs text-slate-400 bg-slate-900 p-2 rounded mb-2">
                {inv.notes.join(' – ')}
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{inv.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dominante Secundário & Turnaround Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dominante Secundário V/V */}
        {twoFiveOne.secondaryDominant && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                2-5-1 com Dominante Secundário (V/V)
              </span>
              <button
                type="button"
                onClick={() => {
                  const secChord = twoFiveOne.secondaryDominant?.chord || '';
                  const vChord = twoFiveOne.V.chord;
                  const iChord = twoFiveOne.I.chord;
                  audioSynth.playProgression([
                    twoFiveOne.secondaryDominant ? [secChord.charAt(0), 'F#', 'A', 'C'] : twoFiveOne.V.notes,
                    twoFiveOne.V.notes,
                    twoFiveOne.I.notes,
                  ]);
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                title="Ouvir V/V -> V -> I"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 py-3 font-mono text-base font-bold bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-amber-400">{twoFiveOne.secondaryDominant.chord}</span>
              <span className="text-slate-500">→</span>
              <span className="text-amber-300">{twoFiveOne.secondaryDominant.target}</span>
              <span className="text-slate-500">→</span>
              <span className="text-emerald-400">{twoFiveOne.I.chord}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {twoFiveOne.secondaryDominant.explanation}
            </p>
          </div>
        )}

        {/* Turnaround I - VI - II - V */}
        {twoFiveOne.turnaround && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Repeat className="w-4 h-4" />
                O Turnaround Completo (I – VI – II – V)
              </span>
              <button
                type="button"
                onClick={() => {
                  if (twoFiveOne.turnaround) {
                    audioSynth.playProgression([
                      twoFiveOne.I.notes,
                      ['A', 'C#', 'E', 'G'],
                      twoFiveOne.ii.notes,
                      twoFiveOne.V.notes,
                    ]);
                  }
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                title="Ouvir Turnaround"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 py-3 font-mono text-sm sm:text-base font-bold bg-slate-950 rounded-xl border border-slate-800">
              {twoFiveOne.turnaround.progression.map((chord, idx) => (
                <React.Fragment key={idx}>
                  <span className={idx === 0 ? 'text-emerald-400' : idx === 3 ? 'text-amber-400' : 'text-slate-200'}>
                    {chord}
                  </span>
                  {idx < 3 && <span className="text-slate-500">→</span>}
                </React.Fragment>
              ))}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              A clássica virada circular dos standards de jazz e bossa. Prepara com perfeição a repetição do tema ou do solo.
            </p>
          </div>
        )}
      </div>

      {/* 12-Keys Matrix Table of 2-5-1 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Tabela Mestra do 2-5-1 em Todas as 12 Tonalidades
            </h4>
            <p className="text-[11px] text-slate-400">
              Consulte e execute a progressão em qualquer tom com um clique
            </p>
          </div>

          {onNavigateToTransposer && (
            <button
              type="button"
              onClick={() => onNavigateToTransposer([twoFiveOne.ii.chord, twoFiveOne.V.chord, twoFiveOne.I.chord], selectedKey)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Abrir no Transpositor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <th className="py-3 px-4">Tonalidade (I)</th>
                <th className="py-3 px-4 text-blue-400">II (Preparação)</th>
                <th className="py-3 px-4 text-amber-400">V (Tensão)</th>
                <th className="py-3 px-4 text-emerald-400">I (Resolução)</th>
                <th className="py-3 px-4 text-right">Ouvir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {KEY_LIST.map((key) => {
                const item = get251(key, 'major');
                const isSelected = selectedKey === key;

                return (
                  <tr
                    key={key}
                    onClick={() => {
                      setSelectedKey(key);
                      audioSynth.playProgression([item.ii.notes, item.V.notes, item.I.notes], 85);
                    }}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-amber-500/15 font-bold text-slate-100'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">{key} Maior</td>
                    <td className="py-3 px-4 font-mono text-blue-300">{item.ii.chord}</td>
                    <td className="py-3 px-4 font-mono text-amber-300">{item.V.chord}</td>
                    <td className="py-3 px-4 font-mono text-emerald-300">{item.I.chord}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          audioSynth.playProgression([item.ii.notes, item.V.notes, item.I.notes], 85);
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded-lg transition-colors"
                        title={`Tocar 2-5-1 em ${key}`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
