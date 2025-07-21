'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authApi, authUtils, ApiError, type LoginData } from '@/lib/api';
import { useToastHelpers } from '@/lib/toast-types';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { success, error } = useToastHelpers();

    useEffect(() => {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }

        // Check for success message from registration
        const message = searchParams.get('message');
        if (message) {
            success('Sucesso!', message);
        }

        // Redirect if already authenticated
        if (authUtils.isAuthenticated()) {
            router.push('/dashboard');
        }
    }, [router, searchParams, success]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validação básica
        if (!email || !password) {
            error('Campos obrigatórios', 'Por favor, preencha todos os campos.');
            return;
        }

        setIsLoading(true);
        
        try {
            const loginData: LoginData = {
                email: email.trim(),
                password
            };

            const response = await authApi.login(loginData);
            
            // Salvar token e dados do usuário
            authUtils.setToken(response.token);
            authUtils.setUser(response.user);
            
            success('Login realizado!', `Bem-vindo, ${response.user.name}!`);
            
            // Redirect para dashboard
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        } catch (err) {
            console.error('Login failed:', err);
            
            if (err instanceof ApiError) {
                if (err.status === 400) {
                    error('Credenciais inválidas', 'Email ou senha incorretos.');
                } else if (err.status === 0) {
                    error('Erro de conexão', 'Verifique se o servidor está rodando.');
                } else {
                    error('Erro do servidor', 'Erro interno do servidor. Tente novamente.');
                }
            } else {
                error('Erro inesperado', 'Tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        console.log(`Login with ${provider}`);
        // Add social login logic here
    };

    return (
        <div className={`min-h-screen relative overflow-hidden transition-all duration-300 ${darkMode ? 'dark' : ''}`}>
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-slate-900 dark:via-blue-950 dark:to-emerald-950">
                <div className="absolute inset-0 bg-black/5 dark:bg-black/20"></div>
                {/* Floating Orbs */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/8 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-teal-300/15 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Theme Toggle */}
            <button
                onClick={toggleDarkMode}
                className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/80 dark:bg-white/15 backdrop-blur-sm border border-gray-300 dark:border-white/25 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-white/25 transition-all duration-300 cursor-pointer"
                aria-label="Toggle theme"
            >
                {darkMode ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                )}
            </button>

            {/* Back Button */}
            <button
                onClick={() => router.push('/')}
                className="absolute top-6 left-6 z-50 inline-flex items-center px-4 py-2 rounded-full bg-white/80 dark:bg-white/15 backdrop-blur-sm border border-gray-300 dark:border-white/25 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-white/25 transition-all duration-300 text-sm cursor-pointer"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar
            </button>

            {/* Main Content */}
            <div className="relative z-10 flex min-h-screen">
                {/* Login Section */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                    <div className="w-full max-w-md">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Bem-vindo de volta
                            </h2>
                            <p className="text-gray-700 dark:text-white/80">
                                Entre na sua conta para continuar aprendendo
                            </p>
                        </div>

                        {/* Login Form */}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="w-full px-4 py-3 bg-white/70 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/25 focus:border-blue-500 dark:focus:border-white/30 transition-all duration-300"
                                    placeholder="Digite seu email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Senha
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        className="w-full px-4 py-3 bg-white/70 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/25 focus:border-blue-500 dark:focus:border-white/30 transition-all duration-300 pr-12"
                                        placeholder="Digite sua senha"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5 text-gray-600 dark:text-white/60 hover:text-gray-800 dark:hover:text-white/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-gray-600 dark:text-white/60 hover:text-gray-800 dark:hover:text-white/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded focus:ring-blue-500 dark:focus:ring-white/25 focus:ring-2"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className="ml-2 text-gray-700 dark:text-white/80">Lembrar de mim</span>
                                </label>
                                <Link href="/forgot-password" className="text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-200 transition-colors">
                                    Esqueci minha senha
                                </Link>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 disabled:cursor-not-allowed disabled:opacity-50 shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 disabled:transform-none"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Entrando...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center space-x-2">
                                        <span>Entrar</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="flex items-center">
                                <div className="flex-grow border-t border-gray-300 dark:border-white/10"></div>
                                <span className="px-4 text-sm text-gray-700 dark:text-white/80">ou continue com</span>
                                <div className="flex-grow border-t border-gray-300 dark:border-white/10"></div>
                            </div>
                        </div>

                        {/* Social Login */}
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('google')}
                                className="w-full inline-flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-white/10 rounded-xl bg-white/80 dark:bg-white/5 backdrop-blur-sm text-gray-900 dark:text-white text-sm font-medium hover:bg-white dark:hover:bg-white/8 transition-all duration-300"
                            >
                                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Continuar com Google
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('github')}
                                className="w-full inline-flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-white/10 rounded-xl bg-white/80 dark:bg-white/5 backdrop-blur-sm text-gray-900 dark:text-white text-sm font-medium hover:bg-white dark:hover:bg-white/8 transition-all duration-300"
                            >
                                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                Continuar com GitHub
                            </button>
                        </div>

                        {/* Sign Up Link */}
                        <p className="text-center text-sm text-gray-700 dark:text-white/80 mt-6">
                            Não tem uma conta?{' '}
                            <Link href="/register" className="font-medium text-blue-600 dark:text-white hover:text-blue-800 dark:hover:text-cyan-200 transition-colors">
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Welcome Section - Hidden on mobile */}
                <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center p-12 text-center">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 dark:from-white/3 to-white/30 dark:to-white/8 backdrop-blur-sm"></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                        <div className="w-48 h-16 mx-auto mb-8 bg-gradient-to-r from-blue-600/50 to-teal-600/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <span className="text-4xl font-bold text-white">Memneo</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Transforme Memórias em Conhecimento
                        </h3>
                        <p className="text-gray-700 dark:text-white/80 text-lg mb-8 leading-relaxed">
                            O Memneo utiliza técnicas de repetição espaçada para otimizar seu aprendizado e maximizar a retenção de informações.
                        </p>
                        
                        {/* Feature List */}
                        <div className="space-y-4 text-left">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-200 dark:bg-white/15 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-gray-700 dark:text-white/90">Flashcards inteligentes</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-200 dark:bg-white/15 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-gray-700 dark:text-white/90">Análise de desempenho</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-200 dark:bg-white/15 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-gray-700 dark:text-white/90">Repetição espaçada</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-10 right-10 w-20 h-20 bg-white/8 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute bottom-10 left-10 w-16 h-16 bg-cyan-300/15 rounded-full blur-xl animate-pulse delay-1000"></div>
                </div>
            </div>
        </div>
    );
}