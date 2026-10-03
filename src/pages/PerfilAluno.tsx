import React, { useState } from 'react';
import { User, Award, Flame, Target, CheckCircle2, Circle, Clock, Sparkles, BookOpen, Layers, Save } from 'lucide-react';
import { UserStats, Instrument } from '../types';
import { KEY_LIST } from '../utils/musicTheory';

interface PerfilAlunoProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onOpenCertificate: () => void;
}

export const PerfilAluno: React.FC<PerfilAlunoProps> = ({
  stats,
  onUpdateStats,
  onOpenCertificate,
}) => {
  const [studentName, setStudentName] = useState(stats.studentName);
  const [preferredInstrument, setPreferredInstrument] = useState<Instrument>(stats.preferredInstrument);
  const [studentLevel, setStudentLevel] = useState(stats.studentLevel || 'Intermediário');
  const [studentGoal, setStudentGoal] = useState(stats.studentGoal || 'Jazz & Improvisação');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const keyMastery = stats.keyMastery || {};
  const topicMastery = stats.topicMastery || {};

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStats({
      ...stats,
      studentName,
      preferredInstrument,
      studentLevel: studentLevel as typeof stats.studentLevel,
      studentGoal: studentGoal as typeof stats.studentGoal,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleToggleWeeklyGoal = (goalId: string) => {
    if (!stats.weeklyGoals) return;
    const updated = stats.weeklyGoals.map((g) => {
      if (g.id === goalId) {
        return { ...g, completed: !g.completed };
      }
      return g;
    });
    onUpdateStats({ ...stats, weeklyGoals: updated });
  };

  const masteredKeysCount = Object.values(keyMastery).filter((k) => k.isMastered).length;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg">
              {stats.studentName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Perfil & Passaporte Harmônico</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                {stats.studentName}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Nível: <strong className="text-amber-300">{stats.studentLevel}</strong> · Foco:{' '}
                <strong className="text-slate-200">{stats.studentGoal}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCertificate}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>Ver Certificado</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Edit Profile & Weekly Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Edit Profile Form */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-amber-400" />
            <span>Dados do Aluno & Objetivos</span>
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Nome de Exibição / Certificado</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Instrumento Principal</label>
              <select
                value={preferredInstrument}
                onChange={(e) => setPreferredInstrument(e.target.value as Instrument)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 outline-none focus:border-amber-500"
              >
                <option value="violao">🎸 Violão Acústico / Clássico</option>
                <option value="guitarra">⚡ Guitarra Elétrica</option>
                <option value="baixo">🎸 Contrabaixo (4/5 Cordas)</option>
                <option value="teclado">🎹 Teclado / Piano</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nível de Harmonia</label>
                <select
                  value={studentLevel}
                  onChange={(e) => setStudentLevel(e.target.value as typeof studentLevel)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 outline-none focus:border-amber-500"
                >
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Foco Musical</label>
                <select
                  value={studentGoal}
                  onChange={(e) => setStudentGoal(e.target.value as typeof studentGoal)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 outline-none focus:border-amber-500"
                >
                  <option value="Jazz & Improvisação">Jazz & Improvisação</option>
                  <option value="Gospel & Worship">Gospel & Worship</option>
                  <option value="MPB & Bossa Nova">MPB & Bossa Nova</option>
                  <option value="Pop & Rock">Pop & Rock</option>
                  <option value="Harmonia Geral">Harmonia Geral</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {saveSuccess ? (
                <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Salvo com sucesso!
                </span>
              ) : (
                <span />
              )}
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Weekly Goals */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Metas da Semana</span>
            </h3>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{stats.streakDays} dias de sequência</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            {stats.weeklyGoals &&
              stats.weeklyGoals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => handleToggleWeeklyGoal(goal.id)}
                  className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition-colors ${
                    goal.completed
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {goal.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <span className={goal.completed ? 'line-through opacity-80' : ''}>
                      {goal.title} ({goal.current} / {goal.target} {goal.unit})
                    </span>
                  </div>

                  <span className="font-mono text-[11px] font-bold">
                    {Math.round((goal.current / goal.target) * 100)}%
                  </span>
                </div>
              ))}
          </div>

          <p className="text-[11px] text-slate-400 pt-1">
            💡 As metas são atualizadas automaticamente conforme você completa aulas e treina no laboratório.
          </p>
        </div>
      </div>

      {/* 12 Key Mastery Matrix (Domínio das 12 Tonalidades) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Matriz de Domínio das 12 Tonalidades ({masteredKeysCount} / 12 Dominadas)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Uma tonalidade é considerada dominada quando você atinge 80% de acerto em pelo menos 15 exercícios nela.
            </p>
          </div>
        </div>

        {/* 12 Key Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {KEY_LIST.map((key) => {
            const data = keyMastery[key] || { attempts: 0, correct: 0, percentage: 0, isMastered: false };
            const isMastered = data.isMastered || (data.attempts >= 15 && data.percentage >= 80);

            return (
              <div
                key={key}
                className={`p-4 rounded-xl border text-center space-y-1 transition-all ${
                  isMastered
                    ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/40 shadow-sm'
                    : data.percentage < 65 && data.attempts > 0
                    ? 'bg-rose-500/10 border-rose-500/40'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Tom</span>
                  {isMastered ? (
                    <span className="text-amber-400 font-bold">★ Dominada</span>
                  ) : (
                    <span>{data.attempts} treinos</span>
                  )}
                </div>

                <div className="text-2xl font-black font-mono text-slate-100">{key}</div>

                <div className="text-xs font-mono font-bold text-amber-400">
                  {data.percentage}% acerto
                </div>

                {!isMastered && data.percentage < 65 && data.attempts > 0 && (
                  <span className="text-[9px] uppercase font-bold text-rose-300 block">
                    Revisão Recomendada
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
