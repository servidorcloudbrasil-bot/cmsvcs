import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../lib/pageStore';
import { Laptop, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const success = await login(username, password);
        if (success) {
            navigate('/admin');
        } else {
            setError('Usuário ou senha incorretos');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[hsl(var(--black))] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 gradient-hero" />
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--gold))]/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--navy-light))]/40 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(var(--gold))]/5 rounded-full blur-3xl" />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `linear-gradient(hsl(var(--gold)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--gold)) 1px, transparent 1px)`,
                backgroundSize: '60px 60px'
            }} />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] flex items-center justify-center mb-4 shadow-lg shadow-[hsl(var(--gold))]/20">
                        <Laptop className="w-8 h-8 text-[hsl(var(--black))]" />
                    </div>
                    <h1 className="text-2xl font-bold text-gradient-gold">CMS SEO Manager</h1>
                    <p className="text-gray-400 text-sm mt-1">Painel de Controle de Páginas</p>
                </div>

                {/* Login Card */}
                <div className="card-glass p-8 shadow-2xl">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-white">Bem-vindo de volta</h2>
                        <p className="text-sm text-gray-400 mt-1">Faça login para acessar o painel</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                                Usuário
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-[hsl(var(--black))]/80 border border-[hsl(var(--gold))]/20 text-white placeholder-gray-500 focus:border-[hsl(var(--gold))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--gold))]/50 transition-all"
                                    placeholder="Seu usuário"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-3 rounded-lg bg-[hsl(var(--black))]/80 border border-[hsl(var(--gold))]/20 text-white placeholder-gray-500 focus:border-[hsl(var(--gold))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--gold))]/50 transition-all"
                                    placeholder="Sua senha"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-[hsl(var(--black))] border-t-transparent rounded-full animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-4 h-4" />
                                    Entrar no Painel
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-[hsl(var(--gold))]/10">
                        <p className="text-xs text-gray-500 text-center">
                            Credenciais padrão: <span className="text-[hsl(var(--gold))]/60">admin</span> / <span className="text-[hsl(var(--gold))]/60">admin123</span>
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-600 mt-6">
                    CMS SEO Manager v1.0 — Gerador de Landing Pages
                </p>
            </div>
        </div>
    );
}
