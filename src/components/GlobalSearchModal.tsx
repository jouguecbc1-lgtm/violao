import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, BookOpen, Music, FileText, ArrowRight, Zap } from 'lucide-react';
import { COURSE_LESSONS } from '../data/courseData';
import { DICTIONARY_TERMS } from '../data/dictionaryData';
import { PROGRESSION_TEMPLATES } from '../data/progressionsData';
import { KEY_LIST } from '../utils/musicTheory';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'Aulas' | 'Dicionário' | 'Progressões' | '2-5-1' | 'Tonalidades';
  targetPage: string;
  targetParam?: string;
  icon: React.ReactNode;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, param?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Toggle or open
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const results: SearchResult[] = useMemo(() => {
    const clean = query.trim().toLowerCase();
    if (!clean) return [];

    const list: SearchResult[] = [];

    // Search Lessons
    COURSE_LESSONS.forEach((lesson) => {
      if (
        lesson.title.toLowerCase().includes(clean) ||
        lesson.description.toLowerCase().includes(clean) ||
        lesson.moduleTitle.toLowerCase().includes(clean)
      ) {
        list.push({
          id: lesson.id,
          title: lesson.title,
          subtitle: `Módulo ${lesson.moduleNumber}: ${lesson.moduleTitle}`,
          category: 'Aulas',
          targetPage: 'curso',
          targetParam: lesson.id,
          icon: <BookOpen className="w-4 h-4 text-emerald-400" />,
        });
      }
    });

    // Search 2-5-1 Keys
    KEY_LIST.forEach((key) => {
      if (clean.includes('2-5-1') || clean.includes('ii-v-i') || clean === key.toLowerCase() || `campo de ${key.toLowerCase()}`.includes(clean)) {
        list.push({
          id: `251-${key}`,
          title: `Progressão 2-5-1 em ${key} Maior`,
          subtitle: `II-V-I da tonalidade de ${key}`,
          category: '2-5-1',
          targetPage: '2-5-1',
          targetParam: key,
          icon: <Zap className="w-4 h-4 text-amber-400" />,
        });
      }
    });

    // Search Dictionary
    DICTIONARY_TERMS.forEach((term) => {
      if (
        term.term.toLowerCase().includes(clean) ||
        term.definition.toLowerCase().includes(clean) ||
        term.category.toLowerCase().includes(clean)
      ) {
        list.push({
          id: `dict-${term.term}`,
          title: term.term,
          subtitle: term.definition.slice(0, 75) + '...',
          category: 'Dicionário',
          targetPage: 'dicionario',
          targetParam: term.term,
          icon: <FileText className="w-4 h-4 text-cyan-400" />,
        });
      }
    });

    // Search Progressions
    PROGRESSION_TEMPLATES.forEach((prog) => {
      if (
        prog.name.toLowerCase().includes(clean) ||
        prog.category.toLowerCase().includes(clean) ||
        prog.romanNumerals.join(' ').toLowerCase().includes(clean)
      ) {
        list.push({
          id: prog.id,
          title: prog.name,
          subtitle: `${prog.romanNumerals.join(' – ')} · ${prog.category}`,
          category: 'Progressões',
          targetPage: 'progressoes',
          targetParam: prog.id,
          icon: <Music className="w-4 h-4 text-purple-400" />,
        });
      }
    });

    return list.slice(0, 10);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar aulas, acordes, 2-5-1, termos musicais (ex: '2-5-1', 'Dominante', 'Dm7', 'C')..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="p-6 text-center text-xs text-slate-500 space-y-2">
              <p>Digite para buscar em toda a plataforma:</p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                {['2-5-1 em C', 'Dominante Secundário', 'Tríade Menor', 'Escala Maior', 'Círculo das Quintas'].map(
                  (tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setQuery(tag)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Nenhum resultado encontrado para &quot;<span className="text-slate-200">{query}</span>&quot;.
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((res) => (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => {
                    onNavigate(res.targetPage, res.targetParam);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-800/80 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 group-hover:border-slate-700">
                      {res.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                        <span>{res.title}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                          {res.category}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{res.subtitle}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Pressione ESC para fechar</span>
          <span>{results.length} resultados</span>
        </div>
      </div>
    </div>
  );
};
