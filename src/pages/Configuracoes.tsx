import React, { useState } from 'react';
import { Settings, Download, Upload, RotateCcw, Volume2, Moon, Sun, Check, AlertTriangle, Database, User, LogIn, LogOut, RefreshCw, CheckCircle2 } from 'lucide-react';
import { UserStats } from '../types';
import { exportAllDataAsJSON, importAllDataFromJSON } from '../services/storage';
import { AuthUserProfile, saveUserStatsToFirestore } from '../services/firebaseAuthService';

interface ConfiguracoesProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onResetStats: () => void;
  currentUser?: AuthUserProfile | null;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
}

export const Configuracoes: React.FC<ConfiguracoesProps> = ({
  stats,
  onUpdateStats,
  onResetStats,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) => {
  const [studentName, setStudentName] = useState(stats.studentName);
  const [volume, setVolume] = useState(stats.audioVolume);
  const [bpm, setBpm] = useState(stats.metronomeBpm);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleManualSync = async () => {
    if (!currentUser) {
      onOpenAuthModal?.();
      return;
    }
    setSyncStatus('Sincronizando com Firestore...');
    try {
      await saveUserStatsToFirestore(currentUser.uid, stats, currentUser);
      setSyncStatus('Sincronização concluída com sucesso!');
      setTimeout(() => setSyncStatus(null), 3000);
    } catch {
      setSyncStatus('Erro ao sincronizar.');
    }
  };

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
      {/* Firebase Cloud Database & Authentication Card */}
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Database className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-100">
                  Banco de Dados em Nuvem & Login
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Ativo & Conectado
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Google Cloud Firestore provisionado com persistência em tempo real e autenticação de alunos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser ? (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 text-xs font-bold rounded-xl transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Desconectar</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar ou Cadastrar</span>
              </button>
            )}
          </div>
        </div>

        {/* User Status Bar */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold">
              {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'G'}
            </div>
            <div>
              <p className="font-bold text-slate-200">
                {currentUser ? currentUser.displayName : 'Modo Convidado / Navegador Local'}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                {currentUser?.email || 'Nenhuma conta vinculada no momento. Faça login para sincronizar entre múltiplos aparelhos.'}
              </p>
            </div>
          </div>

          {currentUser && (
            <button
              type="button"
              onClick={handleManualSync}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold rounded-lg border border-slate-700 transition-colors shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sincronizar Agora</span>
            </button>
          )}
        </div>

        {syncStatus && (
          <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncStatus}</span>
          </div>
        )}
      </div>

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
