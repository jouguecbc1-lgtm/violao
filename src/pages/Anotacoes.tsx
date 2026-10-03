import React, { useState, useEffect } from 'react';
import {
  BookMarked,
  Plus,
  Trash2,
  Edit2,
  Search,
  Star,
  Save,
  X,
  FileText,
} from 'lucide-react';
import { StudentNote } from '../types';
import { getStudentNotes, saveStudentNotes } from '../services/storage';

export const Anotacoes: React.FC = () => {
  const [notes, setNotes] = useState<StudentNote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [editingNote, setEditingNote] = useState<StudentNote | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<StudentNote['category']>('2-5-1');
  const [formContent, setFormContent] = useState('');

  const categories = [
    'Todas',
    'Campo Harmônico',
    'Acordes',
    '2-5-1',
    'Progressões',
    'Exercícios',
    'Geral',
  ];

  useEffect(() => {
    setNotes(getStudentNotes());
  }, []);

  const handleSaveNote = () => {
    if (!formTitle.trim() || !formContent.trim()) return;

    let updated: StudentNote[];
    if (editingNote) {
      updated = notes.map((n) =>
        n.id === editingNote.id
          ? {
              ...n,
              title: formTitle,
              category: formCategory,
              content: formContent,
              updatedAt: new Date().toISOString(),
            }
          : n
      );
    } else {
      const newNote: StudentNote = {
        id: `note-${Date.now()}`,
        title: formTitle,
        category: formCategory,
        content: formContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        favorite: false,
      };
      updated = [newNote, ...notes];
    }

    setNotes(updated);
    saveStudentNotes(updated);
    handleCancelForm();
  };

  const handleDelete = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    saveStudentNotes(updated);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, favorite: !n.favorite } : n));
    setNotes(updated);
    saveStudentNotes(updated);
  };

  const handleStartEdit = (note: StudentNote) => {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormCategory(note.category);
    setFormContent(note.content);
    setIsCreating(true);
  };

  const handleCancelForm = () => {
    setEditingNote(null);
    setFormTitle('');
    setFormCategory('2-5-1');
    setFormContent('');
    setIsCreating(false);
  };

  const filteredNotes = notes.filter((n) => {
    const matchesCat = selectedCategory === 'Todas' || n.category === selectedCategory;
    const matchesQuery =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-amber-400" />
              <span>Caderno de Anotações do Aluno</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Registre percepções, segredos de voicings e estudos práticos. Salvo automaticamente no seu navegador.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              handleCancelForm();
              setIsCreating(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Anotação</span>
          </button>
        </div>

        {/* Search Bar & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-800">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar em anotações..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex flex-wrap gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Note Editor Drawer / Modal */}
      {isCreating && (
        <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-6 space-y-4 shadow-2xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100">
              {editingNote ? 'Editar Anotação' : 'Criar Nova Anotação'}
            </h3>
            <button
              type="button"
              onClick={handleCancelForm}
              className="p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
                Título:
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ex: Segredo da condução de vozes no 2-5-1"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
                Categoria:
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as StudentNote['category'])}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none"
              >
                {categories.filter((c) => c !== 'Todas').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
              Conteúdo da Anotação:
            </label>
            <textarea
              rows={4}
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="Escreva suas observações, acordes, dúvidas ou lembretes..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancelForm}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveNote}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-sm"
            >
              Salvar Anotação
            </button>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs space-y-2">
          <FileText className="w-8 h-8 mx-auto text-slate-600 mb-2" />
          <p>Nenhuma anotação encontrada nesta categoria ou busca.</p>
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="text-amber-400 font-semibold hover:underline"
          >
            Clique aqui para criar a primeira anotação
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    {note.category}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(note.id)}
                    className="text-slate-400 hover:text-amber-400"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        note.favorite ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                  </button>
                </div>

                <h4 className="text-sm font-bold text-slate-100 mb-2">{note.title}</h4>

                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line line-clamp-6">
                  {note.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[10px] text-slate-500">
                <span>
                  {new Date(note.updatedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(note)}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(note.id)}
                    className="p-1.5 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
