import React, { useState } from 'react';
import { Users, GraduationCap, Plus, CheckCircle, BarChart3, Clock, AlertTriangle, FileText, Sparkles, BookOpen } from 'lucide-react';
import { TeacherClass, TeacherStudent, Instrument } from '../types';

const INITIAL_CLASSES: TeacherClass[] = [
  {
    id: 'class-jazz',
    name: 'Turma Harmonia Jazz & Bossa',
    category: 'Harmonia Jazz/Gospel',
    students: [
      { id: 'st-1', name: 'Lucas Silveira', instrument: 'guitarra', progressPercent: 88, exercisesDone: 120, accuracy: 92, lastActive: 'Hoje', weakKey: 'Gb' },
      { id: 'st-2', name: 'Mariana Duarte', instrument: 'teclado', progressPercent: 74, exercisesDone: 85, accuracy: 86, lastActive: 'Ontem', weakKey: 'Ab' },
      { id: 'st-3', name: 'Pedro Henrique', instrument: 'baixo', progressPercent: 62, exercisesDone: 64, accuracy: 78, lastActive: 'Há 3 dias', weakKey: 'Db' },
      { id: 'st-4', name: 'Beatriz Ramos', instrument: 'violao', progressPercent: 95, exercisesDone: 140, accuracy: 96, lastActive: 'Hoje', weakKey: 'B' },
    ],
  },
  {
    id: 'class-worship',
    name: 'Turma Teclado & Violão Gospel/Worship',
    category: 'Intermediário',
    students: [
      { id: 'st-5', name: 'Gabriel Souza', instrument: 'teclado', progressPercent: 82, exercisesDone: 95, accuracy: 89, lastActive: 'Hoje', weakKey: 'Eb' },
      { id: 'st-6', name: 'Aline Ferreira', instrument: 'violao', progressPercent: 55, exercisesDone: 50, accuracy: 72, lastActive: 'Há 2 dias', weakKey: 'Bb' },
      { id: 'st-7', name: 'Carlos Eduardo', instrument: 'baixo', progressPercent: 70, exercisesDone: 75, accuracy: 84, lastActive: 'Ontem', weakKey: 'F#' },
    ],
  },
];

export const PainelProfessor: React.FC = () => {
  const [classes, setClasses] = useState<TeacherClass[]>(INITIAL_CLASSES);
  const [selectedClassId, setSelectedClassId] = useState<string>(INITIAL_CLASSES[0].id);
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newStudentInstrument, setNewStudentInstrument] = useState<Instrument>('violao');
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
  const [assignedTaskMessage, setAssignedTaskMessage] = useState<string | null>(null);

  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newStudent: TeacherStudent = {
      id: `st-${Date.now()}`,
      name: newStudentName.trim(),
      instrument: newStudentInstrument,
      progressPercent: 0,
      exercisesDone: 0,
      accuracy: 0,
      lastActive: 'Cadastrado agora',
      weakKey: 'C',
    };

    setClasses(
      classes.map((c) =>
        c.id === selectedClassId ? { ...c, students: [...c.students, newStudent] } : c
      )
    );

    setNewStudentName('');
    setShowAddStudentModal(false);
  };

  const handleSendHomework = () => {
    setAssignedTaskMessage('Tarefa "Dominar II-V-I em 3 Tonalidades" enviada com sucesso para toda a turma!');
    setTimeout(() => setAssignedTaskMessage(null), 5000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-500/15 via-slate-900 to-slate-950 border border-blue-500/30 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
              <GraduationCap className="w-4 h-4" />
              <span>Plataforma do Educador Musical</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Painel do Professor & Gestão de Turmas
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mt-2">
              Acompanhe o aprendizado dos seus alunos em tempo real: aproveitamento em exercícios, tonalidades onde mais
              erram, histórico de atividades e envio de tarefas de harmonia.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddStudentModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Aluno</span>
            </button>
            <button
              type="button"
              onClick={handleSendHomework}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all border border-slate-700"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Enviar Tarefa</span>
            </button>
          </div>
        </div>

        {/* Class Tabs */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
          {classes.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedClassId(c.id)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                selectedClassId === c.id
                  ? 'bg-blue-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:text-slate-100'
              }`}
            >
              {c.name} ({c.students.length} alunos)
            </button>
          ))}
        </div>
      </div>

      {assignedTaskMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4" />
          <span>{assignedTaskMessage}</span>
        </div>
      )}

      {/* Class Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">Total de Alunos</span>
          <div className="text-2xl font-black text-slate-100 font-mono">{activeClass.students.length}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">Média de Aproveitamento</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {Math.round(
              activeClass.students.reduce((acc, s) => acc + s.accuracy, 0) / (activeClass.students.length || 1)
            )}%
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">Total de Exercícios Feitos</span>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {activeClass.students.reduce((acc, s) => acc + s.exercisesDone, 0)}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">Tonalidade Mais Crítica</span>
          <div className="text-2xl font-black text-rose-400 font-mono">Eb & Db</div>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100">Alunos Matriculados em {activeClass.name}</h3>
          <span className="text-xs text-slate-400 font-mono">Ordenado por atividade recente</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Aluno</th>
                <th className="p-4">Instrumento</th>
                <th className="p-4">Progresso Curso</th>
                <th className="p-4">Exercícios</th>
                <th className="p-4">Aproveitamento</th>
                <th className="p-4">Tonalidade com Dificuldade</th>
                <th className="p-4">Último Acesso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {activeClass.students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-slate-100 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center text-xs">
                      {student.name.charAt(0)}
                    </span>
                    <span>{student.name}</span>
                  </td>
                  <td className="p-4 capitalize">
                    {student.instrument === 'violao' && '🎸 Violão'}
                    {student.instrument === 'guitarra' && '⚡ Guitarra'}
                    {student.instrument === 'baixo' && '🎸 Baixo'}
                    {student.instrument === 'teclado' && '🎹 Teclado'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{ width: `${student.progressPercent}%` }}
                        />
                      </div>
                      <span className="font-mono text-slate-300">{student.progressPercent}%</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono">{student.exercisesDone}</td>
                  <td className="p-4">
                    <span
                      className={`font-bold font-mono px-2 py-0.5 rounded text-[11px] ${
                        student.accuracy >= 85
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : student.accuracy >= 70
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {student.accuracy}%
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono font-bold text-[11px]">
                      Tom de {student.weakKey}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono">{student.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-100">Matricular Novo Aluno na Turma</h3>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nome Completo do Aluno
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João da Silva"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Instrumento Principal
                </label>
                <select
                  value={newStudentInstrument}
                  onChange={(e) => setNewStudentInstrument(e.target.value as Instrument)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 outline-none focus:border-blue-500"
                >
                  <option value="violao">🎸 Violão</option>
                  <option value="guitarra">⚡ Guitarra</option>
                  <option value="baixo">🎸 Contrabaixo</option>
                  <option value="teclado">🎹 Teclado / Piano</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-slate-950 rounded-lg text-xs font-bold"
                >
                  Confirmar Matrícula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
