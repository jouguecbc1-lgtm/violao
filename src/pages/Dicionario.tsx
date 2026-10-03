import React, { useState } from 'react';
import { BookOpen, Search, Sparkles } from 'lucide-react';
import { DICTIONARY_TERMS, DictionaryTerm } from '../data/dictionaryData';

interface DicionarioProps {
  initialTerm?: string;
}

export const Dicionario: React.FC<DicionarioProps> = ({ initialTerm = '' }) => {
  const [search, setSearch] = useState<string>(initialTerm);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const categories = ['Todas', 'Harmonia', 'Teoria Fundamental', 'Funções Harmônicas', 'Harmonia Avançada', 'Voicings & Jazz'];

  const filtered = DICTIONARY_TERMS.filter((item) => {
    const matchesCat = selectedCategory === 'Todas' || item.category === selectedCategory;
    const matchesSearch =
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.definition.toLowerCase().includes(search.toLowerCase()) ||
      item.practicalApplication.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>Dicionário e Glossário Harmônico</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Conceitos, termos fundamentais, definições técnicas e aplicações práticas na música moderna.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar termo (ex: '2-5-1', 'Dominante', 'Trítono')..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex flex-wrap gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap ${
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

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((term) => (
          <div
            key={term.term}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-slate-100">{term.term}</h3>
              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                {term.category}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {term.definition}
            </p>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1.5">
              <div>
                <strong className="text-amber-300 font-semibold block text-[11px] uppercase">
                  Exemplo Prático:
                </strong>
                <span className="text-slate-300 font-mono">{term.example}</span>
              </div>
              <div>
                <strong className="text-emerald-300 font-semibold block text-[11px] uppercase">
                  Aplicação na Música:
                </strong>
                <span className="text-slate-400">{term.practicalApplication}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
