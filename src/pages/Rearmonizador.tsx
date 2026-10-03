import React, { useState } from 'react';
import { Volume2, Play, Sparkles, ArrowRight, Layers, RefreshCw, Info } from 'lucide-react';
import { audioSynth } from '../services/audioSynth';
import { SoundTimbre } from '../types';

interface ReharmonizationOption {
  style: 'Jazz Moderno' | 'Gospel / Neo-Soul' | 'Bossa Nova' | 'Empréstimo Modal';
  reharmonizedChords: string[];
  reharmonizedNotes: string[][];
  explanation: string;
  harmonicTechniques: string[];
}

interface BaseProgressionDef {
  id: string;
  name: string;
  originalChords: string[];
  originalNotes: string[][];
  reharmonizations: ReharmonizationOption[];
}

const PRESET_REHARMONIZATIONS: BaseProgressionDef[] = [
  {
    id: 'prog-pop-c-am-f-g',
    name: 'Progressão Clássica Pop/Folk (I – vi – IV – V em C)',
    originalChords: ['C', 'Am', 'F', 'G'],
    originalNotes: [
      ['C', 'E', 'G'],
      ['A', 'C', 'E'],
      ['F', 'A', 'C'],
      ['G', 'B', 'D'],
    ],
    reharmonizations: [
      {
        style: 'Jazz Moderno',
        reharmonizedChords: ['Cmaj7', 'A7(b13)', 'Dm9', 'G13'],
        reharmonizedNotes: [
          ['C', 'E', 'G', 'B'],
          ['A', 'C#', 'F', 'G'],
          ['D', 'F', 'A', 'C', 'E'],
          ['G', 'F', 'B', 'E'],
        ],
        explanation:
          'Substitui o Am por um Dominante Secundário A7(b13) que prepara o Dm9 com tensão. O G vira G13 com a 13ª límpida.',
        harmonicTechniques: ['Dominante Secundário (V do II)', 'Extensões de 9ª e 13ª', 'Tétrades com 7ª'],
      },
      {
        style: 'Gospel / Neo-Soul',
        reharmonizedChords: ['Cmaj9', 'Am11', 'Fm6', 'Gsus4'],
        reharmonizedNotes: [
          ['C', 'E', 'G', 'B', 'D'],
          ['A', 'C', 'D', 'G'],
          ['F', 'Ab', 'C', 'D'],
          ['G', 'C', 'D', 'F'],
        ],
        explanation:
          'Utiliza o acorde Fm6 (Empréstimo Modal do homônimo menor C menor) criando aquela sensação emotiva e profunda do Gospel.',
        harmonicTechniques: ['Empréstimo Modal (Subdominante Menor Fm6)', 'Acordes Sus4', 'Clima Neo-Soul'],
      },
      {
        style: 'Bossa Nova',
        reharmonizedChords: ['C6/9', 'A7(#5)', 'Dm7(9)', 'Db7(9)'],
        reharmonizedNotes: [
          ['C', 'E', 'A', 'D'],
          ['A', 'C#', 'F', 'G'],
          ['D', 'F', 'A', 'C', 'E'],
          ['Db', 'F', 'Ab', 'B', 'Eb'],
        ],
        explanation:
          'Substitui o acorde G7 pelo SubV7 (Db7(9)), fazendo com que a linha de baixo deslize suavemente meio tom para o C.',
        harmonicTechniques: ['Substituição por Trítono (SubV)', 'Acorde 6/9 de Repouso', 'Quinta Aumentada #5'],
      },
    ],
  },
  {
    id: 'prog-251-basic',
    name: 'Cadência Básica Dm → G → C',
    originalChords: ['Dm', 'G', 'C'],
    originalNotes: [
      ['D', 'F', 'A'],
      ['G', 'B', 'D'],
      ['C', 'E', 'G'],
    ],
    reharmonizations: [
      {
        style: 'Jazz Moderno',
        reharmonizedChords: ['Dm7', 'Db7(#11)', 'Cmaj7(#11)'],
        reharmonizedNotes: [
          ['D', 'F', 'A', 'C'],
          ['Db', 'F', 'G', 'B'],
          ['C', 'E', 'F#', 'B'],
        ],
        explanation:
          'Transforma a cadência em uma descida cromática com acorde Lídio Dominante (Db7(#11)) e Tônica Lídia.',
        harmonicTechniques: ['Escala Lídia Dominante', 'SubV com Tensão #11', 'Descida Cromática de Baixo'],
      },
      {
        style: 'Gospel / Neo-Soul',
        reharmonizedChords: ['Dm9', 'G7(b9,b13)', 'Cadd9'],
        reharmonizedNotes: [
          ['D', 'F', 'A', 'C', 'E'],
          ['G', 'B', 'Eb', 'Ab'],
          ['C', 'E', 'G', 'D'],
        ],
        explanation:
          'Adiciona a nona bemol (b9) e décima terceira bemol (b13) ao acorde G7, criando a assinatura sonora harmônica de igrejas e soul.',
        harmonicTechniques: ['Tensões Alteradas (b9, b13)', 'Acorde Alterado no Dominante', 'Acorde Add9'],
      },
    ],
  },
];

export const Rearmonizador: React.FC = () => {
  const [selectedProgId, setSelectedProgId] = useState<string>(PRESET_REHARMONIZATIONS[0].id);
  const [activeReharmIdx, setActiveReharmIdx] = useState<number>(0);
  const [timbre, setTimbre] = useState<SoundTimbre>('piano');

  const currentProg = PRESET_REHARMONIZATIONS.find((p) => p.id === selectedProgId) || PRESET_REHARMONIZATIONS[0];
  const currentReharm = currentProg.reharmonizations[activeReharmIdx] || currentProg.reharmonizations[0];

  const playOriginal = () => {
    audioSynth.playProgression(currentProg.originalNotes, 85, undefined, undefined, timbre);
  };

  const playReharmonized = () => {
    audioSynth.playProgression(currentReharm.reharmonizedNotes, 85, undefined, undefined, timbre);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Ferramenta de Criação & Sofisticação</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Rearmonizador Harmônico Interativo
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mt-2">
            Pegue uma sequência simples de acordes e descubra como transformá-la em sonoridades ricas de Jazz,
            Gospel e Bossa Nova através de substituições lógicas e empréstimos modais.
          </p>
        </div>

        {/* Progression and Timbre Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Progressão Base:</span>
            <select
              value={selectedProgId}
              onChange={(e) => {
                setSelectedProgId(e.target.value);
                setActiveReharmIdx(0);
              }}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold rounded-lg px-3 py-1.5 outline-none cursor-pointer"
            >
              {PRESET_REHARMONIZATIONS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Timbre:</span>
            <select
              value={timbre}
              onChange={(e) => setTimbre(e.target.value as SoundTimbre)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
            >
              <option value="piano">🎹 Piano</option>
              <option value="guitarra">🎸 Guitarra</option>
              <option value="baixo">🎸 Baixo</option>
              <option value="pads">🌌 Pad Synth</option>
              <option value="orgao">⛪ Órgão</option>
            </select>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison: Original vs Reharmonized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Chords Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Versão Original</span>
              <h3 className="text-base font-bold text-slate-200">Tríades Básicas</h3>
            </div>
            <button
              type="button"
              onClick={playOriginal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors border border-slate-700"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Ouvir Original</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {currentProg.originalChords.map((chord, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-1"
              >
                <div className="text-xl font-black text-slate-300 font-mono">{chord}</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {currentProg.originalNotes[idx].join(' · ')}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 pt-2 leading-relaxed">
            Estrutura simples e funcional, porém previsível e com pouca textura harmônica.
          </p>
        </div>

        {/* Reharmonized Chords Card */}
        <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/40 rounded-2xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Versão Rearmonizada</span>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>{currentReharm.style}</span>
              </h3>
            </div>
            <button
              type="button"
              onClick={playReharmonized}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Ouvir Rearmonizado</span>
            </button>
          </div>

          {/* Style Selector Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {currentProg.reharmonizations.map((r, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveReharmIdx(idx)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  activeReharmIdx === idx
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-300 hover:text-slate-100 border border-slate-800'
                }`}
              >
                {r.style}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {currentReharm.reharmonizedChords.map((chord, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 text-center space-y-1 shadow-sm"
              >
                <div className="text-lg sm:text-xl font-black text-amber-300 font-mono tracking-tight">
                  {chord}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {currentReharm.reharmonizedNotes[idx].join(' · ')}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="text-xs text-slate-200 leading-relaxed">
              <strong className="text-amber-400">Por que funciona:</strong> {currentReharm.explanation}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentReharm.harmonicTechniques.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-semibold font-mono"
                >
                  ✓ {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
