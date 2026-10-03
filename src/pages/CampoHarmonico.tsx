import React, { useState } from 'react';
import { Volume2, Play, Zap, Info } from 'lucide-react';
import {
  KEY_LIST,
  getMajorHarmonicField,
  getMinorHarmonicField,
  get251,
} from '../utils/musicTheory';
import { audioSynth } from '../services/audioSynth';
import { ScaleDegreeInfo, Instrument } from '../types';
import { PianoKeyboard } from '../components/PianoKeyboard';
import { FretboardDiagram } from '../components/FretboardDiagram';
import { BassFretboard } from '../components/BassFretboard';
import { HarmonicFlowMap } from '../components/HarmonicFlowMap';

interface CampoHarmonicoProps {
  onNavigateTo251?: (key: string) => void;
  userInstrument?: Instrument;
}

export const CampoHarmonico: React.FC<CampoHarmonicoProps> = ({
  onNavigateTo251,
  userInstrument = 'violao',
}) => {
  const [selectedKey, setSelectedKey] = useState<string>('C');
  const [scaleType, setScaleType] = useState<
    'major' | 'minor_natural' | 'minor_harmonic' | 'minor_melodic'
  >('major');
  const [activeChordIndex, setActiveChordIndex] = useState<number>(0);
  const [chordDisplayType, setChordDisplayType] = useState<'tetrad' | 'triad'>('tetrad');
  const [instrumentView, setInstrumentView] = useState<'teclado' | 'violao' | 'guitarra' | 'baixo'>(
    userInstrument || 'violao'
  );

  React.useEffect(() => {
    if (userInstrument) {
      setInstrumentView(userInstrument);
    }
  }, [userInstrument]);

  const field =
    scaleType === 'major'
      ? getMajorHarmonicField(selectedKey)
      : getMinorHarmonicField(selectedKey, scaleType);

  const activeDegree: ScaleDegreeInfo = field.degrees[activeChordIndex] || field.degrees[0];
  const activeChord =
    chordDisplayType === 'tetrad' ? activeDegree.tetrad : activeDegree.triad;

  const playEntireField = () => {
    const list = field.degrees.map((d) =>
      chordDisplayType === 'tetrad' ? d.tetrad.notes : d.triad.notes
    );
    audioSynth.playProgression(list, 80, (idx) => setActiveChordIndex(idx));
  };

  const twoFiveOne = get251(selectedKey, scaleType === 'major' ? 'major' : 'minor');

  return (
    <div className="space-y-6">
      {/* Key & Scale Selectors Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <span>Gerador de Campo Harmônico</span>
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md">
                12 Tonalidades
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Selecione o tom e a escala para calcular instantaneamente acordes, graus, funções e notas.
            </p>
          </div>

          {/* Play Field Button */}
          <button
            type="button"
            onClick={playEntireField}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 self-start sm:self-auto"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Tocar Campo Completo (I ao VII)</span>
          </button>
        </div>

        {/* 12 Key Selector Buttons */}
        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-2">
            Escolha a Tonalidade Fundamental:
          </span>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
            {KEY_LIST.map((key) => {
              const isSelected = selectedKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedKey(key)}
                  className={`py-2 px-1 text-xs font-bold rounded-lg transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scale Type Tabs & Display Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'major', label: 'Maior Diatônico' },
              { id: 'minor_natural', label: 'Menor Natural' },
              { id: 'minor_harmonic', label: 'Menor Harmônica' },
              { id: 'minor_melodic', label: 'Menor Melódica' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setScaleType(tab.id as typeof scaleType)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  scaleType === tab.id
                    ? 'bg-slate-100 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setChordDisplayType('tetrad')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                chordDisplayType === 'tetrad'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tétrades (Com 7ª)
            </button>
            <button
              type="button"
              onClick={() => setChordDisplayType('triad')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                chordDisplayType === 'triad'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tríades (3 Notas)
            </button>
          </div>
        </div>
      </div>

      {/* Scale Notes Formula Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-400">Escala de {field.scaleName}:</span>
          <div className="flex items-center gap-1.5 font-mono font-bold text-amber-300">
            {field.notes.map((n, i) => (
              <span
                key={i}
                onClick={() => audioSynth.playNote(n, 4, 1)}
                className="cursor-pointer px-2 py-0.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 transition-colors"
                title={`Ouvir nota ${n}`}
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span>Fórmula Intervalar:</span>
          <span className="font-mono text-slate-200 font-semibold bg-slate-950 px-2 py-1 rounded border border-slate-800">
            {field.formula}
          </span>
        </div>
      </div>

      {/* Interactive Harmonic Field Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Tabela do Campo Harmônico ({chordDisplayType === 'tetrad' ? 'Tétrades' : 'Tríades'})
          </span>
          <span className="text-[11px] text-slate-400">
            Clique em qualquer linha ou acorde para selecioná-lo e visualizá-lo no teclado
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <th className="py-3 px-4">Grau</th>
                <th className="py-3 px-4">Acorde</th>
                <th className="py-3 px-4">Qualidade</th>
                <th className="py-3 px-4">Função Harmônica</th>
                <th className="py-3 px-4">Notas Formadoras</th>
                <th className="py-3 px-4">Modo Grego</th>
                <th className="py-3 px-4 text-right">Ouvir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {field.degrees.map((deg, idx) => {
                const chord = chordDisplayType === 'tetrad' ? deg.tetrad : deg.triad;
                const isSelected = activeChordIndex === idx;

                let funcBadge = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
                if (deg.function === 'Subdominante')
                  funcBadge = 'text-blue-400 bg-blue-500/10 border-blue-500/30';
                if (deg.function === 'Dominante')
                  funcBadge = 'text-amber-400 bg-amber-500/10 border-amber-500/30';

                return (
                  <tr
                    key={deg.degree}
                    onClick={() => {
                      setActiveChordIndex(idx);
                      audioSynth.playChordNotes(chord.notes, 1.4, true);
                    }}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-amber-500/15 font-semibold text-slate-100'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {deg.romanNumeral}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-base font-extrabold text-slate-100 font-mono">
                        {chord.symbol}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{chord.quality}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold ${funcBadge}`}>
                        {deg.function}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {chord.notes.join(' – ')}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{deg.modeName}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          audioSynth.playChordNotes(chord.notes, 1.4, true);
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded-lg transition-colors"
                        title="Ouvir acorde"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Chord Detail & Keyboard Visualizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs text-slate-400 block">Acorde em Destaque:</span>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-amber-400 font-mono">
                {activeChord.symbol}
              </span>
              <span className="text-sm font-semibold text-slate-200">
                ({activeDegree.romanNumeral} Grau · {activeChord.quality})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => audioSynth.playChordNotes(activeChord.notes, 1.8, true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>Tocar Acorde</span>
            </button>

            {onNavigateTo251 && (
              <button
                type="button"
                onClick={() => onNavigateTo251(selectedKey)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold rounded-lg transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Ver II-V-I de {selectedKey}</span>
              </button>
            )}

            {/* Instrument View Selector */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setInstrumentView('teclado')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  instrumentView === 'teclado'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🎹 Teclado
              </button>
              <button
                type="button"
                onClick={() => setInstrumentView('violao')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  instrumentView === 'violao'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🎸 Violão
              </button>
              <button
                type="button"
                onClick={() => setInstrumentView('guitarra')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  instrumentView === 'guitarra'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ⚡ Guitarra
              </button>
              <button
                type="button"
                onClick={() => setInstrumentView('baixo')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  instrumentView === 'baixo'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🎸 Baixo
              </button>
            </div>
          </div>
        </div>

        {/* Visual Instrument Component */}
        {instrumentView === 'teclado' && (
          <div className="py-2">
            <PianoKeyboard
              highlightNotes={activeChord.notes}
              bassNote={activeChord.root}
              guideTones={{
                third: activeChord.notes[1],
                seventh: activeChord.notes[3],
              }}
            />
          </div>
        )}

        {instrumentView === 'violao' && (
          <div className="flex justify-center py-2">
            <FretboardDiagram chordName={activeChord.symbol} notes={activeChord.notes} instrument="violao" />
          </div>
        )}

        {instrumentView === 'guitarra' && (
          <div className="flex justify-center py-2">
            <FretboardDiagram chordName={activeChord.symbol} notes={activeChord.notes} instrument="guitarra" />
          </div>
        )}

        {instrumentView === 'baixo' && (
          <div className="py-2">
            <BassFretboard
              chordName={activeChord.symbol}
              rootNote={activeChord.root}
              chordNotes={activeChord.notes}
              stringsCount={4}
            />
          </div>
        )}
      </div>

      {/* Harmonic Flow Map */}
      <HarmonicFlowMap
        currentKey={selectedKey}
        onSelectChord={(chordSymbol) => {
          const index = field.degrees.findIndex(
            (d) => d.tetrad.symbol === chordSymbol || d.triad.symbol === chordSymbol
          );
          if (index !== -1) setActiveChordIndex(index);
        }}
      />
    </div>
  );
};
