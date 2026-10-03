import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Music,
  Zap,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Database,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { Instrument } from '../types';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  loginAnonymouslyUser,
} from '../services/firebaseAuthService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialInstrument?: Instrument;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialInstrument = 'violao',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument>(initialInstrument);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password.trim()) {
          setErrorMessage('Por favor, informe email e senha.');
          setLoading(false);
          return;
        }
        await loginWithEmail(email.trim(), password);
        setSuccessMessage('Login efetuado com sucesso! Sincronizando dados...');
      } else {
        if (!email.trim() || !password.trim() || !name.trim()) {
          setErrorMessage('Por favor, preencha todos os campos.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
          setLoading(false);
          return;
        }
        await registerWithEmail(email.trim(), password, name.trim(), selectedInstrument);
        setSuccessMessage('Conta criada com sucesso no Firestore! Bem-vindo(a).');
      }

      setTimeout(() => {
        setLoading(false);
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setErrorMessage('Email ou senha incorretos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('Este email já está cadastrado. Tente fazer login.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Janela de login fechada antes da confirmação.');
      } else {
        setErrorMessage(err.message || 'Erro ao processar autenticação. Tente novamente.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      setSuccessMessage('Conectado via Google com sucesso!');
      setTimeout(() => {
        setLoading(false);
        onSuccess?.();
        onClose();
      }, 900);
    } catch (err: any) {
      setLoading(false);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMessage('Não foi possível conectar com o Google no momento.');
      }
    }
  };

  const handleGuestLogin = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      await loginAnonymouslyUser();
      setSuccessMessage('Entrando como Convidado! Seus dados ficarão salvos na sessão.');
      setTimeout(() => {
        setLoading(false);
        onSuccess?.();
        onClose();
      }, 800);
    } catch (err: any) {
      setLoading(false);
      setErrorMessage('Erro ao iniciar modo convidado.');
    }
  };

  const fillDemoAccount = (demoType: 'student' | 'teacher') => {
    setMode('login');
    if (demoType === 'student') {
      setEmail('aluno.demo@harmonia251.com');
      setPassword('harmonia123');
    } else {
      setEmail('professor.demo@harmonia251.com');
      setPassword('harmonia123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 overflow-hidden">
        {/* Top Decorative Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              <Database className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
                <span>Banco de Dados & Acesso</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  Firebase
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Sincronize seu progresso, notas e metas na nuvem
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Fazer Login</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Criar Nova Conta</span>
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nome Completo / Artístico
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: João Violonista"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Instrumento Principal de Estudo
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'violao', label: 'Violão' },
                  { id: 'guitarra', label: 'Guitarra' },
                  { id: 'baixo', label: 'Baixo' },
                  { id: 'teclado', label: 'Teclado' },
                ].map((inst) => (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => setSelectedInstrument(inst.id as Instrument)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      selectedInstrument === inst.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/60'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {inst.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-98 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <span className="animate-pulse">Processando no Firebase...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Entrar na Plataforma</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Salvar Conta no Firestore</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[11px] text-slate-500 font-mono">OU</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Alternative Providers */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-semibold transition-colors disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold transition-colors disabled:opacity-60"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Convidado</span>
          </button>
        </div>

        {/* Fast Demo Testing */}
        <div className="pt-2 border-t border-slate-800/80">
          <p className="text-[11px] text-slate-400 mb-2 flex items-center justify-between">
            <span>Preenchimento rápido para demonstração:</span>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('student')}
              className="flex-1 py-1.5 px-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-[11px] font-mono transition-colors"
            >
              👤 Aluno Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('teacher')}
              className="flex-1 py-1.5 px-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-[11px] font-mono transition-colors"
            >
              🎓 Professor Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
