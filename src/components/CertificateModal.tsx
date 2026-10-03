import React, { useEffect, useRef } from 'react';
import { Award, CheckCircle, Download, Printer, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserStats } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  stats,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.error('Confetti error:', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const completionDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Bar */}
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Certificado Oficial de Conclusão</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
          </div>
        </div>

        {/* Certificate Card Printable Area */}
        <div
          ref={certificateRef}
          className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-4 border-amber-500/40 rounded-xl p-8 sm:p-12 text-center text-slate-100 shadow-2xl"
        >
          {/* Ornate corner borders */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400"></div>
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-400"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-400"></div>
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-400"></div>

          {/* Golden Seal Icon */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
            <Award className="w-8 h-8" />
          </div>

          <div className="tracking-[0.25em] uppercase text-xs font-bold text-amber-400 mb-2">
            Certificado de Excelência Harmônica
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-serif mb-6 tracking-wide">
            HARMONIA 2-5-1
          </h1>

          <p className="text-sm text-slate-400 max-w-xl mx-auto mb-4">
            Certificamos com distinção que o(a) aluno(a)
          </p>

          <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-serif border-b border-amber-500/30 pb-2 inline-block px-8 mb-6">
            {stats.studentName || 'Estudante de Harmonia'}
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed mb-8">
            Concluiu com êxito todas as etapas de formação teórica e prática do curso{' '}
            <strong className="text-slate-100">Campo Harmônico e Progressão 2-5-1</strong>,
            demonstrando domínio integral sobre formação de acordes, tétrades, condução de vozes,
            funções harmônicas e transposição nas 12 tonalidades.
          </p>

          {/* Stats Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-xs py-4 border-t border-b border-slate-800/80 mb-8">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Aproveitamento</span>
              <span className="text-base font-bold text-emerald-400">
                {stats.exercisesAttempted > 0
                  ? `${Math.round((stats.exercisesCorrect / stats.exercisesAttempted) * 100)}%`
                  : '100%'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Exercícios Resolvidos</span>
              <span className="text-base font-bold text-slate-200">{stats.exercisesAttempted || 120}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Data de Emissão</span>
              <span className="text-base font-bold text-slate-200">{completionDate}</span>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="flex justify-between items-end max-w-md mx-auto pt-2 text-[11px] text-slate-400">
            <div className="text-center">
              <div className="w-32 border-b border-slate-600 mb-1"></div>
              <span>Coordenação Pedagógica</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border border-amber-500/50 flex items-center justify-center text-amber-400 mb-1">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-[9px] uppercase tracking-wider text-amber-400">Selo Autenticado</span>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-slate-600 mb-1"></div>
              <span>Plataforma HARMONIA 2-5-1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
