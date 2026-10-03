import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Layers,
  Music2,
  KeyRound,
  GitBranch,
  Zap,
  ArrowRightLeft,
  Cpu,
  PenTool,
  HelpCircle,
  Flame,
  Award,
  BookMarked,
  Settings,
  BookOpen,
  Volume2,
  X,
  Disc,
  FlaskConical,
  Workflow,
  Sparkles,
  Users,
  UserCheck,
} from 'lucide-react';

export type NavPage =
  | 'dashboard'
  | 'laboratorio'
  | 'curso'
  | 'campo_harmonico'
  | 'escalas'
  | 'acordes'
  | 'progressoes'
  | '2-5-1'
  | 'voice_leading'
  | 'rearmonizador'
  | 'instrumentos'
  | 'transposicao'
  | 'simulador'
  | 'exercicios'
  | 'quiz'
  | 'treinamento'
  | 'progresso'
  | 'anotacoes'
  | 'configuracoes'
  | 'dicionario'
  | 'pratica'
  | 'circulo_quintas'
  | 'professor'
  | 'perfil';

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  progressPercent: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  progressPercent,
}) => {
  const menuItems = [
    { id: 'dashboard' as NavPage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'laboratorio' as NavPage, label: 'Laboratório Harmonia', icon: FlaskConical, highlight: true },
    { id: 'curso' as NavPage, label: 'Curso Completo', icon: GraduationCap },
    { id: 'instrumentos' as NavPage, label: 'Os 4 Instrumentos', icon: Music2, highlight: true },
    { id: '2-5-1' as NavPage, label: 'Especial 2-5-1', icon: Zap, highlight: true },
    { id: 'voice_leading' as NavPage, label: 'Voice Leading & SubV', icon: Workflow },
    { id: 'rearmonizador' as NavPage, label: 'Rearmonizador', icon: Sparkles },
    { id: 'campo_harmonico' as NavPage, label: 'Campo Harmônico', icon: Layers },
    { id: 'escalas' as NavPage, label: 'Escalas', icon: Music2 },
    { id: 'acordes' as NavPage, label: 'Acordes & Tríades', icon: KeyRound },
    { id: 'progressoes' as NavPage, label: 'Progressões', icon: GitBranch },
    { id: 'transposicao' as NavPage, label: 'Transposição', icon: ArrowRightLeft },
    { id: 'simulador' as NavPage, label: 'Simulador', icon: Cpu },
    { id: 'exercicios' as NavPage, label: 'Exercícios (Infinito/Ouvido)', icon: PenTool },
    { id: 'quiz' as NavPage, label: 'Quiz', icon: HelpCircle },
    { id: 'treinamento' as NavPage, label: 'Treino do Dia & Espaçado', icon: Flame },
    { id: 'circulo_quintas' as NavPage, label: 'Círculo das Quintas', icon: Disc },
    { id: 'professor' as NavPage, label: 'Painel do Professor', icon: Users },
    { id: 'perfil' as NavPage, label: 'Perfil do Aluno', icon: UserCheck },
    { id: 'progresso' as NavPage, label: 'Progresso & Metas', icon: Award },
    { id: 'anotacoes' as NavPage, label: 'Anotações', icon: BookMarked },
    { id: 'dicionario' as NavPage, label: 'Dicionário Musical', icon: BookOpen },
    { id: 'configuracoes' as NavPage, label: 'Configurações', icon: Settings },
  ];

  const handleSelect = (id: NavPage) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div
            onClick={() => handleSelect('dashboard')}
            className="cursor-pointer flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wide text-slate-100 block leading-tight">
                HARMONIA <span className="text-amber-400">2-5-1</span>
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">
                Teoria & Prática Musical
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-slate-200 lg:hidden rounded-lg hover:bg-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Course Mini Progress Widget */}
        <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400">Progresso Geral</span>
            <span className="font-bold text-amber-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Scrollable Nav Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.highlight && (
                  <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                    Destaque
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Practice Mode Button at bottom */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => handleSelect('pratica')}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-colors ${
              currentPage === 'pratica'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Modo Prática Rápida</span>
          </button>
        </div>
      </aside>
    </>
  );
};
