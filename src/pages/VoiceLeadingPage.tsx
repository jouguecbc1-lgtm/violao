import React, { useState } from 'react';
import { Play, Volume2, Sparkles, ArrowRight, Zap, RefreshCw, Layers } from 'lucide-react';
import { KEY_LIST, get251, noteToSemitone, semitoneToNote } from '../utils/musicTheory';
import { audioSynth } from '../services/audioSynth';
import { PianoKeyboard } from '../components/PianoKeyboard';
import { SoundTimbre } from '../types';

export const VoiceLeadingPage: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('C');
  const [activeCadenceType, setActiveCadenceType] = useState<'standard_251' | 'subv_251'>('standard_251');
  const [selectedTimbre, setSelectedTimbre] = useState<SoundTimbre>('piano');

  const rootSemi = noteToSemitone(selectedKey);

  // Standard 2-5-1 chords:
  const ii_root = semitoneToNote(rootSemi + 2);
  const ii_chord = `${ii_root}m7`;
  const ii_notes = [ii_root, semitoneToNote(rootSemi + 2 + 3), semitoneToNote(rootSemi + 2 + 7), semitoneToNote(rootSemi + 2 + 10)];

  const V_root = semitoneToNote(rootSemi + 7);
  const V_chord = `${V_root}7`;
  const V_notes = [V_root, semitoneToNote(rootSemi + 7 + 4), semitoneToNote(rootSemi + 7 + 7), semitoneToNote(rootSemi + 7 + 10)];

  const I_chord = `${selectedKey}maj7`;
  const I_notes = [selectedKey, semitoneToNote(rootSemi + 4), semitoneToNote(rootSemi + 7), semitoneToNote(rootSemi + 11)];

  // SubV (Dominante Substituto por Trítono)
  // SubV is 1 semitone above the target tonic (or a tritone away from V)
  const subv_root = semitoneToNote(rootSemi + 1);
  const subv_chord = `${subv_root}7 (SubV)`;
  const subv_notes = [subv_root, semitoneToNote(rootSemi + 1 + 4), semitoneToNote(rootSemi + 1 + 7), semitoneToNote(rootSemi + 1 + 10)];

  const activeVChordName = activeCadenceType === 'standard_251' ? V_chord : subv_chord;
  const activeVNotes = activeCadenceType === 'standard_251' ? V_notes : subv_notes;

  const playFullProgression = () => {
    audioSynth.playProgression([ii_notes, activeVNotes, I_notes], 80, undefined, undefined, selectedTimbre);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/15 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 sm:p-8 space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
            <Zap className="w-4 h-4" />
            <span>Conexão Harmônica Avançada</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Condução de Vozes & Substituição de Dominante (SubV)
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mt-2">
            Harmonia profissional não é pular de bloco em bloco de acordes. É a condução suave de cada voz individual
            com economia máxima de movimento e a resolução irresistível do trítono por semitom.
          </p>
        </div>

        {/* Key and Mode Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Tonalidade:</span>
            <div className="flex flex-wrap gap-1">
              {['C', 'F', 'Bb', 'Eb', 'G', 'D', 'A'].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSelectedKey(k)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                    selectedKey === k
                      ? 'bg-indigo-500 text-white font-black shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:text-slate-100'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {/* Cadence Type Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Tipo de Cadência:</span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveCadenceType('standard_251')}
                className={`px-3 py-1 font-bold rounded-lg transition-colors ${
                  activeCadenceType === 'standard_251'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Padrão: II – V7 – I
              </button>
              <button
                type="button"
                onClick={() => setActiveCadenceType('subv_251')}
                className={`px-3 py-1 font-bold rounded-lg transition-colors ${
                  activeCadenceType === 'subv_251'
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SubV: II – SubV7 – I
              </button>
            </div>

            <button
              type="button"
              onClick={playFullProgression}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md ml-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>Ouvir Cadência</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Voice Leading Map Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>Fluxo das Vozes no {activeCadenceType === 'standard_251' ? 'II – V – I' : 'II – SubV – I'} em {selectedKey}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Observe a trajetória de cada linha melódica: o salto do baixo, a nota comum mantida e a resolução do trítono.
          </p>
        </div>

        {/* 3 Chord Voice Leading Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Grau II */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-blue-500/30 space-y-3 text-center">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">1. Preparação (Grau II)</span>
            <div className="text-3xl font-black text-slate-100 font-mono">{ii_chord}</div>
            <div className="space-y-1.5 pt-2">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
                Fundamental (Baixo): <strong className="text-amber-400">{ii_notes[0]}</strong>
              </div>
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-mono">
                3ª Menor (Guia): <strong>{ii_notes[1]}</strong>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
                5ª Justa: <strong>{ii_notes[2]}</strong>
              </div>
              <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 font-mono">
                7ª Menor (Guia): <strong>{ii_notes[3]}</strong>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              A 7ª ({ii_notes[3]}) está pronta para descer meio tom e virar a 3ª do próximo acorde!
            </p>
          </div>

          {/* 2. Grau V ou SubV */}
          <div
            className={`p-5 rounded-2xl border space-y-3 text-center ${
              activeCadenceType === 'standard_251'
                ? 'bg-slate-950 border-amber-500/30'
                : 'bg-slate-950 border-indigo-500/40'
            }`}
          >
            <span
              className={`text-xs font-bold uppercase tracking-wider block ${
                activeCadenceType === 'standard_251' ? 'text-amber-400' : 'text-indigo-400'
              }`}
            >
              2. Tensão do Trítono ({activeCadenceType === 'standard_251' ? 'Grau V' : 'SubV'})
            </span>
            <div className="text-3xl font-black text-slate-100 font-mono">{activeVChordName}</div>
            <div className="space-y-1.5 pt-2">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
                Fundamental (Baixo): <strong className="text-amber-400">{activeVNotes[0]}</strong>
              </div>
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-mono">
                3ª Maior (Trítono): <strong>{activeVNotes[1]}</strong>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
                5ª Justa: <strong>{activeVNotes[2]}</strong>
              </div>
              <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 font-mono">
                7ª Menor (Trítono): <strong>{activeVNotes[3]}</strong>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              {activeCadenceType === 'standard_251'
                ? `O trítono entre ${activeVNotes[1]} e ${activeVNotes[3]} busca a resolução em ${I_notes[0]} e ${I_notes[1]}.`
                : `O baixo (${activeVNotes[0]}) desce meio tom direto para a tônica (${I_notes[0]})!`}
            </p>
          </div>

          {/* 3. Grau I */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/30 space-y-3 text-center">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">3. Resolução (Grau I)</span>
            <div className="text-3xl font-black text-slate-100 font-mono">{I_chord}</div>
            <div className="space-y-1.5 pt-2">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
                Fundamental (Baixo): <strong className="text-amber-400">{I_notes[0]}</strong>
              </div>
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-mono">
                3ª Maior: <strong>{I_notes[1]}</strong>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
                5ª Justa: <strong>{I_notes[2]}</strong>
              </div>
              <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 font-mono">
                7ª Maior: <strong>{I_notes[3]}</strong>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Repouso acústico com dissipação completa da tensão harmônica anterior.
            </p>
          </div>
        </div>
      </div>

      {/* Deep-Dive: The SubV Tritone Mystery Explained */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-slate-100">
            O Segredo do SubV (Substituição por Trítono)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-amber-300">1. Por que a substituição funciona?</h4>
            <p>
              Tome o acorde dominante original <strong>G7</strong> (G – <strong>B</strong> – D – <strong>F</strong>).
              O trítono está nas notas <strong>B e F</strong> (intervalo tenso de 3 tons inteiros).
            </p>
            <p>
              Agora tome o acorde <strong>Db7</strong> (Db – <strong>F</strong> – Ab – <strong>Cb/B</strong>).
              Ele possui <strong>exatamente as mesmas notas do trítono (F e B)</strong>, apenas invertidas!
            </p>
            <p className="text-amber-200 font-semibold">
              Como o ouvido reconhece a função harmônica primariamente pelo trítono e não pela fundamental,
              Db7 exerce a mesma força magnética de G7!
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-indigo-300">2. A Vantagem Cromática do Baixo</h4>
            <p>
              No 2-5-1 tradicional, o contrabaixo salta uma quarta de G para C:
            </p>
            <p className="font-mono text-slate-200 bg-slate-900 p-2 rounded">
              Dm7 (D) → G7 (G) → Cmaj7 (C)
            </p>
            <p>
              Ao usar o SubV7, o baixo ganha um deslizamento cromático ultra-elegante, descendo meio tom:
            </p>
            <p className="font-mono text-indigo-300 bg-slate-900 p-2 rounded">
              Dm7 (D) → Db7 (Db) → Cmaj7 (C) ⚡
            </p>
            <p className="text-slate-400 text-[11px]">
              Essa é a sonoridade clássica e irresistível da Bossa Nova de Tom Jobim e do Jazz de Bill Evans!
            </p>
          </div>
        </div>

        {/* Interactive Piano Demo of the Tritone */}
        <div className="pt-2">
          <PianoKeyboard
            chordName={activeVChordName}
            highlightNotes={activeVNotes}
            bassNote={activeVNotes[0]}
            guideTones={{
              third: activeVNotes[1],
              seventh: activeVNotes[3],
            }}
            octaves={2}
          />
        </div>
      </div>
    </div>
  );
};
