import React, { useState, useEffect } from 'react';
import { Music, Play, Volume2, Sparkles, CheckCircle2, Layers } from 'lucide-react';
import { KEY_LIST, get251 } from '../utils/musicTheory';
import { Instrument } from '../types';
import { audioSynth } from '../services/audioSynth';
import { PianoKeyboard } from '../components/PianoKeyboard';
import { FretboardDiagram } from '../components/FretboardDiagram';
import { BassFretboard } from '../components/BassFretboard';

interface GuiaInstrumentosProps {
  userInstrument?: Instrument;
}

export const GuiaInstrumentos: React.FC<GuiaInstrumentosProps> = ({
  userInstrument,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>('C');
  const [activeChordStep, setActiveChordStep] = useState<'ii' | 'V' | 'I'>('ii');
  const [instrumentFilter, setInstrumentFilter] = useState<'todos' | Instrument>('todos');

  useEffect(() => {
    if (userInstrument) {
      setInstrumentFilter(userInstrument);
    }
  }, [userInstrument]);

  const twoFiveOne = get251(selectedKey, 'major');
  const currentChord =
    activeChordStep === 'ii'
      ? twoFiveOne.ii
      : activeChordStep === 'V'
      ? twoFiveOne.V
      : twoFiveOne.I;

  const playFullBand = () => {
    // Play bass note in octave 2 + chord notes in octave 4 simultaneously!
    audioSynth.playBassNote(currentChord.notes[0], 2, 1.8);
    audioSynth.playChordNotes(currentChord.notes, 1.8, true);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Harmonia Aplicada ao Conjunto</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Guia dos 4 Instrumentos: Violão, Guitarra, Baixo e Teclado
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mt-2 max-w-3xl">
            Descubra o papel exato de cada instrumento no arranjo harmônico. Como tocar juntos em harmonia
            perfeita sem sobreposição de frequências, do som acústico ao jazz moderno.
          </p>
        </div>

        {/* Key Selector & Chord Step Selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Tonalidade:</span>
            <div className="flex flex-wrap gap-1">
              {['C', 'G', 'D', 'F', 'Bb', 'Eb'].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSelectedKey(k)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                    selectedKey === k
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:text-slate-100'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Acorde do 2-5-1:</span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveChordStep('ii')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  activeChordStep === 'ii'
                    ? 'bg-blue-500 text-slate-950'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                II ({twoFiveOne.ii.chord})
              </button>
              <button
                type="button"
                onClick={() => setActiveChordStep('V')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  activeChordStep === 'V'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                V ({twoFiveOne.V.chord})
              </button>
              <button
                type="button"
                onClick={() => setActiveChordStep('I')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  activeChordStep === 'I'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                I ({twoFiveOne.I.chord})
              </button>
            </div>

            <button
              type="button"
              onClick={playFullBand}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md ml-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>Ouvir em Conjunto</span>
            </button>
          </div>
        </div>
      </div>

      {/* Instrument View Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3">
        <span className="text-xs text-slate-400 font-semibold">Visualizar Instrumento:</span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'todos', label: '👥 Todos (Visão Geral da Banda)' },
            { id: 'violao', label: '🎸 Violão' },
            { id: 'guitarra', label: '⚡ Guitarra' },
            { id: 'baixo', label: '🎸 Contrabaixo' },
            { id: 'teclado', label: '🎹 Teclado' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setInstrumentFilter(tab.id as typeof instrumentFilter)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                instrumentFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-950 text-slate-300 hover:text-slate-100 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Instrument Grid Breakdown */}
      <div className={`grid gap-6 ${instrumentFilter === 'todos' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {/* 1. TECLADO */}
        {(instrumentFilter === 'todos' || instrumentFilter === 'teclado') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span className="text-xl">🎹</span>
              <span>Teclado / Piano</span>
            </h3>
            <button
              type="button"
              onClick={() => audioSynth.playChordNotes(currentChord.notes, 1.4)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Ouvir</span>
            </button>
          </div>

          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>
              <strong className="text-amber-300">Papel no arranjo:</strong> Espaço harmônico amplo, preenchimento e condução de vozes.
            </p>
            <p>
              <strong className="text-slate-100">Como tocar:</strong> Quando tocar com baixista, evite tocar a tônica grave na mão esquerda! Concentre-se nas <strong>Notas Guia (3ª e 7ª)</strong> na mão direita e extensões (9ª).
            </p>
          </div>

          <div className="pt-2">
            <PianoKeyboard
              highlightNotes={currentChord.notes}
              bassNote={currentChord.notes[0]}
              guideTones={{
                third: currentChord.notes[1],
                seventh: currentChord.notes[3],
              }}
              octaves={instrumentFilter === 'teclado' ? 2 : 1}
            />
          </div>
        </div>
        )}

        {/* 2. VIOLÃO */}
        {(instrumentFilter === 'todos' || instrumentFilter === 'violao') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span className="text-xl">🎸</span>
              <span>Violão Acústico / Clássico</span>
            </h3>
            <button
              type="button"
              onClick={() => audioSynth.playChordNotes(currentChord.notes, 1.4)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Ouvir</span>
            </button>
          </div>

          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>
              <strong className="text-amber-300">Papel no arranjo:</strong> Centro rítmico-harmônico orgânico (pulso, levada e suingue).
            </p>
            <p>
              <strong className="text-slate-100">Como tocar:</strong> O polegar define a raiz na 5ª ou 6ª corda, enquanto os dedos I-M-A tocam simultaneamente o acorde no tempo da levada da Bossa ou MPB.
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <FretboardDiagram chordName={currentChord.chord} notes={currentChord.notes} instrument="violao" />
          </div>
        </div>
        )}

        {/* 3. GUITARRA */}
        {(instrumentFilter === 'todos' || instrumentFilter === 'guitarra') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span>Guitarra Elétrica</span>
            </h3>
            <button
              type="button"
              onClick={() => audioSynth.playChordNotes(currentChord.notes, 1.4)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Ouvir</span>
            </button>
          </div>

          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>
              <strong className="text-amber-300">Papel no arranjo:</strong> Texturas límpidas, comping jazzístico e ataques pontuais.
            </p>
            <p>
              <strong className="text-slate-100">Como tocar:</strong> Utilize <strong>Shell Voicings</strong> (1-7-3 ou 1-3-7) nas 4 cordas graves e voicings <strong>Drop 2</strong> nas cordas 5-4-3-2 para conduzir sem sobrecarregar a banda.
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <FretboardDiagram chordName={currentChord.chord} notes={currentChord.notes} instrument="guitarra" />
          </div>
        </div>
        )}

        {/* 4. CONTRABAIXO */}
        {(instrumentFilter === 'todos' || instrumentFilter === 'baixo') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span className="text-xl">🎸</span>
              <span>Contrabaixo (4 e 5 Cordas)</span>
            </h3>
            <button
              type="button"
              onClick={() => audioSynth.playBassNote(currentChord.notes[0], 2, 1.5)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Ouvir Baixo</span>
            </button>
          </div>

          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>
              <strong className="text-amber-300">Papel no arranjo:</strong> O chão sonoro, o alicerce harmônico e a propulsão rítmica com a bateria.
            </p>
            <p>
              <strong className="text-slate-100">Como tocar:</strong> Toque a tônica no tempo 1 do compasso. No tempo 2 e 3 arpeje a 3ª ou 5ª, e no tempo 4 faça uma aproximação cromática de meio tom para a próxima tônica.
            </p>
          </div>

          <div className="pt-2">
            <BassFretboard
              chordName={currentChord.chord}
              rootNote={currentChord.notes[0]}
              chordNotes={currentChord.notes}
              stringsCount={4}
            />
          </div>
        </div>
        )}
      </div>

      {/* Frequency & Balance Master Rule Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <span>A Regra de Ouro da Convivência dos 4 Instrumentos</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-2">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-amber-400 block text-sm font-bold">1. Baixo</strong>
            <p className="text-slate-300 font-semibold">Sub-graves e Graves (40Hz – 250Hz)</p>
            <p className="text-slate-400 text-[11px]">
              Dono absoluto da Fundamental. Nenhum outro instrumento deve tocar notas graves emboladas.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-amber-400 block text-sm font-bold">2. Violão</strong>
            <p className="text-slate-300 font-semibold">Médios Graves & Ataque (200Hz – 2kHz)</p>
            <p className="text-slate-400 text-[11px]">
              Sustentação acústica rítmica. Marca a síncope e a pulsação com batidas ou arpejos suaves.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-amber-400 block text-sm font-bold">3. Guitarra</strong>
            <p className="text-slate-300 font-semibold">Médios Agudos (500Hz – 4kHz)</p>
            <p className="text-slate-400 text-[11px]">
              Shell voicings de 2 ou 3 notas (3ª e 7ª). Condução limpa sem redundância sonora.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-amber-400 block text-sm font-bold">4. Teclado</strong>
            <p className="text-slate-300 font-semibold">Médios a Agudos Plenos (300Hz – 8kHz)</p>
            <p className="text-slate-400 text-[11px]">
              Tensão harmônica, notas guia e tensões (9ª, 11ª, 13ª). Evita a mão esquerda no grave.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
