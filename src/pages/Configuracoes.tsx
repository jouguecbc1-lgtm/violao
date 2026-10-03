import React, { useState } from 'react';
import { Settings, Download, Upload, RotateCcw, Volume2, Moon, Sun, Check, AlertTriangle } from 'lucide-react';
import { UserStats } from '../types';
import { exportAllDataAsJSON, importAllDataFromJSON } from '../services/storage';

interface ConfiguracoesProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onResetStats: () => void;
}

export const Configuracoes: React.FC<ConfiguracoesProps> = ({
  stats,
  onUpdateStats,
  onResetStats,
}) => {
  const [studentName, setStudentName] = useState(stats.studentName);
  const [volume, setVolume] = useState(stats.audioVolume);
  const [bpm, setBpm] = useState(stats.metronomeBpm);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleSavePreferences = () => {
    onUpdateStats({
      ...stats,
      studentName: studentName.trim() || 'Estudante de Música',
      audioVolume: volume,
      metronomeBpm: bpm,
    });
  };

  const handleExportJSON = () => {
    const jsonStr = exportAllDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `harmonia-251-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importAllDataFromJSON(content);
        if (success) {
          setImportStatus('Backup importado com sucesso! Atualizando dados...');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          setImportStatus('Erro: arquivo de backup inválido.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Preferences Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <span>Configurações & Preferências</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Personalize seu perfil de aluno, volume de áudio e gerencie seus dados locais.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Nome do Estudante (utilizado na emissão do certificado):
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Volume Master ({Math.round(volume * 100)}%):
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                BPM Padrão do Metrônomo:
              </label>
              <input
                type="number"
                min="40"
                max="240"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-slate-100 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSavePreferences}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>

      {/* Backup Import / Export */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Download className="w-4 h-4 text-amber-400" />
          <span>Backup & Restauração de Dados (JSON)</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Exporte seu histórico de estudos, notas do caderno e progresso para um arquivo JSON seguro em seu computador ou transfira para outro dispositivo.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Backup (JSON)</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>Importar Backup (JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>

        {importStatus && (
          <div className="text-xs p-3 rounded-lg bg-slate-950 border border-amber-500/40 text-amber-300">
            {importStatus}
          </div>
        )}
      </div>

      {/* Danger Zone: Reset */}
      <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Zona de Perigo: Redefinir Progresso</span>
        </h3>
        <p className="text-xs text-slate-400">
          Esta ação apagará todas as aulas concluídas, estatísticas de exercícios e anotações armazenadas no navegador.
        </p>

        {!showConfirmReset ? (
          <button
            type="button"
            onClick={() => setShowConfirmReset(true)}
            className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold rounded-lg transition-colors"
          >
            Redefinir Dados Locais
          </button>
        ) : (
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                onResetStats();
                setShowConfirmReset(false);
                window.location.reload();
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors shadow-md"
            >
              Sim, Apagar Tudo
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmReset(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
