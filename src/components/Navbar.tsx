import React from 'react';
import { Menu, Search, Volume2, VolumeX, Flame, Activity, LogIn, LogOut, Database, UserCheck } from 'lucide-react';
import { NavPage } from './Sidebar';
import { Instrument } from '../types';
import { AuthUserProfile } from '../services/firebaseAuthService';

interface NavbarProps {
  currentPage: NavPage;
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
  onOpenMetronome: () => void;
  volume: number;
  onVolumeToggle: () => void;
  streakDays: number;
  studentName: string;
  preferredInstrument?: Instrument;
  onSelectInstrument?: (instrument: Instrument) => void;
  currentUser?: AuthUserProfile | null;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
}

const PAGE_TITLES: Record<NavPage, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Visão geral e progresso dos seus estudos' },
  laboratorio: { title: 'Laboratório de Harmonia', subtitle: 'Estúdio interativo com teclado, braço, metrônomo e análise' },
  curso: { title: 'Curso Completo', subtitle: 'Aulas teóricas e práticas passo a passo' },
  campo_harmonico: { title: 'Campo Harmônico', subtitle: 'Tabela interativa e gerador em 12 tonalidades' },
  escalas: { title: 'Escalas Musicais', subtitle: 'Fórmula intervalar, modos e visualização' },
  acordes: { title: 'Formação de Acordes', subtitle: 'Tríades, tétrades e inversões completas' },
  progressoes: { title: 'Biblioteca de Progressões', subtitle: 'Cadências clássicas, Jazz, Gospel e Bossa Nova' },
  '2-5-1': { title: 'Especial II – V – I', subtitle: 'A progressão mais importante da música moderna' },
  voice_leading: { title: 'Voice Leading & SubV', subtitle: 'Condução melódica de vozes e substitutos por trítono' },
  rearmonizador: { title: 'Rearmonizador Musical', subtitle: 'Transforme progressões simples em arranjos Jazz, Gospel e Neo-Soul' },
  instrumentos: { title: 'Os 4 Instrumentos', subtitle: 'Aplicação prática para Violão, Guitarra, Baixo e Teclado' },
  transposicao: { title: 'Transpositor Musical', subtitle: 'Transponha acordes e progressões em semitons ou tonalidades' },
  simulador: { title: 'Simulador Harmônico', subtitle: 'Monte progressões personalizadas e toque com áudio' },
  exercicios: { title: 'Exercícios Práticos', subtitle: 'Gerador infinito, treino de ouvido e reconhecimento de funções' },
  quiz: { title: 'Quiz de Harmonia', subtitle: 'Teste seu conhecimento em 3 níveis de dificuldade' },
  treinamento: { title: 'Treinamento & Repetição Espaçada', subtitle: 'Treino diário inteligente focado nas suas maiores dúvidas' },
  progresso: { title: 'Meu Progresso & Metas', subtitle: 'Estatísticas, radar de domínio musical e metas semanais' },
  anotacoes: { title: 'Bloco de Anotações', subtitle: 'Seu caderno pessoal de teoria musical' },
  circulo_quintas: { title: 'Círculo das Quintas', subtitle: 'Visualização interativa das 12 tonalidades' },
  professor: { title: 'Painel do Professor', subtitle: 'Gerenciamento de turmas, alunos e diagnósticos de aprendizagem' },
  perfil: { title: 'Perfil do Aluno', subtitle: 'Configurações de instrumento, metas e nível musical' },
  dicionario: { title: 'Dicionário Musical', subtitle: 'Glossário completo de termos harmônicos' },
  configuracoes: { title: 'Configurações', subtitle: 'Preferências, backup e dados' },
  pratica: { title: 'Modo Prática Rápida', subtitle: 'Foco total com metrônomo e acordes grandes' },
};

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onOpenMobileSidebar,
  onOpenSearch,
  onOpenMetronome,
  volume,
  onVolumeToggle,
  streakDays,
  studentName,
  preferredInstrument = 'violao',
  onSelectInstrument,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) => {
  const pageInfo = PAGE_TITLES[currentPage] || { title: 'Harmonia 2-5-1', subtitle: 'Curso de Harmonia' };

  const instrumentsList: { id: Instrument; label: string; icon: string }[] = [
    { id: 'violao', label: 'Violão', icon: '🎸' },
    { id: 'guitarra', label: 'Guitarra', icon: '⚡' },
    { id: 'baixo', label: 'Baixo', icon: '🎸' },
    { id: 'teclado', label: 'Teclado', icon: '🎹' },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-lg lg:hidden"
          title="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-100 leading-tight">
            {pageInfo.title}
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Quick Instrument Selector */}
        {onSelectInstrument && (
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5" title="Seu instrumento ativo">
            {instrumentsList.map((inst) => {
              const active = preferredInstrument === inst.id;
              return (
                <button
                  key={inst.id}
                  type="button"
                  onClick={() => onSelectInstrument(inst.id)}
                  className={`flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                    active
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{inst.icon}</span>
                  <span className="hidden lg:inline">{inst.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Global Search Trigger */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-slate-900 hover:bg-slate-800 hover:text-slate-200 border border-slate-800 rounded-lg transition-colors"
          title="Buscar no curso (Ctrl + K)"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="hidden md:inline">Buscar...</span>
          <kbd className="hidden md:inline text-[10px] font-mono bg-slate-800 text-slate-400 px-1 py-0.5 rounded border border-slate-700">
            ⌘K
          </kbd>
        </button>

        {/* Metronome Quick Button */}
        <button
          type="button"
          onClick={onOpenMetronome}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors"
          title="Abrir metrônomo"
        >
          <Activity className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Metrônomo</span>
        </button>

        {/* Volume Mute Toggle */}
        <button
          type="button"
          onClick={onVolumeToggle}
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-lg transition-colors"
          title={volume > 0 ? 'Mutar áudio' : 'Desmutar áudio'}
        >
          {volume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
        </button>

        {/* Student Streak */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="font-bold text-amber-400">{streakDays}</span>
          <span className="text-slate-400 hidden xl:inline">dias</span>
        </div>

        {/* Firebase Auth & Database status indicator */}
        {currentUser ? (
          <div className="flex items-center gap-1.5 pl-1 border-l border-slate-800">
            <div
              className="flex items-center gap-2 px-2.5 py-1 bg-slate-900 border border-emerald-500/30 rounded-xl"
              title={`Logado como: ${currentUser.email || currentUser.displayName} (Sincronizado no Firestore)`}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[11px] font-bold text-slate-200 leading-none truncate max-w-[100px]">
                  {currentUser.displayName || 'Aluno'}
                </span>
                <span className="text-[9px] font-mono text-emerald-400 leading-none mt-0.5">
                  Firestore Nuvem
                </span>
              </div>
              <div
                className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-xs shadow-sm ml-1"
                title={currentUser.displayName || studentName}
              >
                {(currentUser.displayName || studentName).charAt(0).toUpperCase()}
              </div>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                title="Desconectar / Sair da conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 pl-1 border-l border-slate-800">
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95"
              title="Fazer Login ou Criar Conta para salvar no Firebase"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Entrar / Banco</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
