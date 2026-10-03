import React, { useState, useEffect } from 'react';
import { NavPage, Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { CertificateModal } from './components/CertificateModal';
import { Metronome } from './components/Metronome';
import { UserStats } from './types';
import { getUserStats, saveUserStats } from './services/storage';
import { audioSynth } from './services/audioSynth';
import { COURSE_LESSONS } from './data/courseData';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Curso } from './pages/Curso';
import { CampoHarmonico } from './pages/CampoHarmonico';
import { Escalas } from './pages/Escalas';
import { Acordes } from './pages/Acordes';
import { Progressoes } from './pages/Progressoes';
import { Progressao251 } from './pages/Progressao251';
import { Transpositor } from './pages/Transpositor';
import { Simulador } from './pages/Simulador';
import { Exercicios } from './pages/Exercicios';
import { Quiz } from './pages/Quiz';
import { Treinamento } from './pages/Treinamento';
import { Progresso } from './pages/Progresso';
import { Anotacoes } from './pages/Anotacoes';
import { Dicionario } from './pages/Dicionario';
import { CirculoQuintasPage } from './pages/CirculoQuintasPage';
import { Configuracoes } from './pages/Configuracoes';
import { ModoPratica } from './pages/ModoPratica';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  const [pageParam, setPageParam] = useState<string | undefined>(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isMetronomeFloatingOpen, setIsMetronomeFloatingOpen] = useState(false);
  const [stats, setStats] = useState<UserStats>(getUserStats());

  // Listen for global shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdateStats = (newStats: UserStats) => {
    setStats(newStats);
    saveUserStats(newStats);
    audioSynth.setVolume(newStats.audioVolume);
  };

  const handleResetStats = () => {
    localStorage.clear();
    setStats(getUserStats());
  };

  const handleNavigate = (page: string, param?: string) => {
    setCurrentPage(page as NavPage);
    setPageParam(param);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progressPercent = Math.round(
    (stats.completedLessonIds.length / COURSE_LESSONS.length) * 100
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* Sidebar navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(p) => handleNavigate(p)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        progressPercent={progressPercent}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Sticky Navbar */}
        <Navbar
          currentPage={currentPage}
          onOpenMobileSidebar={() => setIsMobileMenuOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMetronome={() => setIsMetronomeFloatingOpen((prev) => !prev)}
          volume={stats.audioVolume}
          onVolumeToggle={() => {
            const newVol = stats.audioVolume > 0 ? 0 : 0.75;
            handleUpdateStats({ ...stats, audioVolume: newVol });
          }}
          streakDays={stats.streakDays}
          studentName={stats.studentName}
        />

        {/* Floating Quick Metronome Panel */}
        {isMetronomeFloatingOpen && (
          <div className="fixed top-18 right-4 z-40 w-80 shadow-2xl animate-in slide-in-from-top-4 duration-200">
            <Metronome
              initialBpm={stats.metronomeBpm}
              onBpmChange={(bpm) => handleUpdateStats({ ...stats, metronomeBpm: bpm })}
            />
          </div>
        )}

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20">
          {currentPage === 'dashboard' && (
            <Dashboard
              stats={stats}
              onNavigate={(p, param) => handleNavigate(p, param)}
              onOpenCertificate={() => setIsCertificateOpen(true)}
            />
          )}

          {currentPage === 'curso' && (
            <Curso
              stats={stats}
              onUpdateStats={handleUpdateStats}
              selectedLessonId={pageParam}
              onSelectLessonId={(id) => setPageParam(id)}
            />
          )}

          {currentPage === 'campo_harmonico' && (
            <CampoHarmonico
              onNavigateTo251={(key) => handleNavigate('2-5-1', key)}
            />
          )}

          {currentPage === 'escalas' && <Escalas />}

          {currentPage === 'acordes' && <Acordes />}

          {currentPage === 'progressoes' && (
            <Progressoes
              onNavigateToTransposer={(prog, fromKey) => {
                handleNavigate('transposicao', JSON.stringify({ prog, fromKey }));
              }}
            />
          )}

          {currentPage === '2-5-1' && (
            <Progressao251
              initialKey={pageParam || 'C'}
              onNavigateToTransposer={(prog, fromKey) => {
                handleNavigate('transposicao', JSON.stringify({ prog, fromKey }));
              }}
            />
          )}

          {currentPage === 'transposicao' && (
            <Transpositor
              initialProgression={
                pageParam
                  ? (() => {
                      try {
                        const parsed = JSON.parse(pageParam);
                        return parsed.prog;
                      } catch {
                        return undefined;
                      }
                    })()
                  : undefined
              }
              initialFromKey={
                pageParam
                  ? (() => {
                      try {
                        const parsed = JSON.parse(pageParam);
                        return parsed.fromKey || 'C';
                      } catch {
                        return 'C';
                      }
                    })()
                  : 'C'
              }
            />
          )}

          {currentPage === 'simulador' && <Simulador />}

          {currentPage === 'exercicios' && (
            <Exercicios stats={stats} onUpdateStats={handleUpdateStats} />
          )}

          {currentPage === 'quiz' && (
            <Quiz stats={stats} onUpdateStats={handleUpdateStats} />
          )}

          {currentPage === 'treinamento' && (
            <Treinamento stats={stats} onUpdateStats={handleUpdateStats} />
          )}

          {currentPage === 'progresso' && (
            <Progresso
              stats={stats}
              onOpenCertificate={() => setIsCertificateOpen(true)}
            />
          )}

          {currentPage === 'anotacoes' && <Anotacoes />}

          {currentPage === 'dicionario' && (
            <Dicionario initialTerm={pageParam || ''} />
          )}

          {currentPage === 'circulo_quintas' && (
            <CirculoQuintasPage
              onNavigateTo251={(key) => handleNavigate('2-5-1', key)}
            />
          )}

          {currentPage === 'configuracoes' && (
            <Configuracoes
              stats={stats}
              onUpdateStats={handleUpdateStats}
              onResetStats={handleResetStats}
            />
          )}

          {currentPage === 'pratica' && <ModoPratica />}
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(page, param) => handleNavigate(page, param)}
      />

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        stats={stats}
      />
    </div>
  );
}
