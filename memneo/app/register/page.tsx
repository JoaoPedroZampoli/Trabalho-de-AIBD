'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormInput from './components/FormInput';
import StepTransition from './components/StepTransition';
import StepsIndicator from './components/StepsIndicator';
import { authApi, authUtils, ApiError, type RegisterData } from '@/lib/api';


export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        curso: '',
        nivel: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [currentStep, setCurrentStep] = useState(1);
    const router = useRouter();

    useEffect(() => {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

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


    // Validação por etapa
    const validateStep = (step: number) => {
        const newErrors: {[key: string]: string} = {};
        if (step === 1) {
            // Name
            if (!formData.name.trim()) {
                newErrors.name = 'Nome é obrigatório';
            } else if (formData.name.trim().length < 2) {
                newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
            }
            // Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formData.email.trim()) {
                newErrors.email = 'Email é obrigatório';
            } else if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Email inválido';
            }
        } else if (step === 2) {
            if (!formData.curso.trim()) {
                newErrors.curso = 'Curso é obrigatório';
            }
            if (!formData.nivel.trim()) {
                newErrors.nivel = 'Nível é obrigatório';
            }
        } else if (step === 3) {
            if (!formData.password) {
                newErrors.password = 'Senha é obrigatória';
            } else if (formData.password.length < 8) {
                newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
            }
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Senhas não coincidem';
            }
        } else if (step === 4) {
            if (!acceptTerms) {
                newErrors.terms = 'Você deve aceitar os termos e condições';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validação final (todas as etapas)
    const validateForm = () => {
        return validateStep(1) && validateStep(2) && validateStep(3) && validateStep(4);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };


    const handleNext = () => {
        if (validateStep(currentStep)) {
            // Add a small delay for smooth animation
            setTimeout(() => {
                setCurrentStep((prev) => Math.min(prev + 1, 4));
            }, 100);
        }
    };

    const handlePrev = () => {
        // Add a small delay for smooth animation
        setTimeout(() => {
            setCurrentStep((prev) => Math.max(prev - 1, 1));
        }, 100);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        setErrors({}); // Limpar erros anteriores
        
        try {
            const registerData: RegisterData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                curso: formData.curso,
                nivel: formData.nivel
            };

            const response = await authApi.register(registerData);
            
            // Salvar token e dados do usuário
            authUtils.setToken(response.token);
            authUtils.setUser(response.user);
            
            // Redirect para dashboard com mensagem de sucesso
            router.push('/dashboard?message=Cadastro realizado com sucesso!');
        } catch (error) {
            console.error('Registration failed:', error);
            
            if (error instanceof ApiError) {
                if (error.status === 400) {
                    setErrors({ submit: error.message });
                } else if (error.status === 0) {
                    setErrors({ submit: 'Erro de conexão. Verifique se o servidor está rodando.' });
                } else {
                    setErrors({ submit: 'Erro interno do servidor. Tente novamente.' });
                }
            } else {
                setErrors({ submit: 'Erro inesperado. Tente novamente.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        console.log(`Register with ${provider}`);
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

            {/* Main Content */}
            <div className="relative z-10 flex min-h-screen">
                {/* Registration Section */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                    <div className="w-full max-w-md">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Criar Conta
                            </h2>
                            <p className="text-gray-700 dark:text-white/80">
                                Comece sua jornada de aprendizado
                            </p>
                        </div>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Steps Indicator */}
                            <StepsIndicator currentStep={currentStep} totalSteps={4} />

                            {/* Steps Container with Animations */}
                            <div className="relative h-[200px] overflow-hidden">
                                {/* Step 1: Dados pessoais */}
                                <StepTransition currentStep={currentStep} targetStep={1}>
                                    <div className="flex flex-col justify-between h-full">
                                        <div className="space-y-4">
                                            <FormInput
                                                id="name"
                                                name="name"
                                                type="text"
                                                label="Nome Completo"
                                                placeholder="Digite seu nome completo"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                error={errors.name}
                                                autoComplete="name"
                                                required
                                            />
                                            <FormInput
                                                id="email"
                                                name="email"
                                                type="email"
                                                label="Email"
                                                placeholder="Digite seu email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                error={errors.email}
                                                autoComplete="email"
                                                required
                                            />
                                        </div>
                                    </div>
                                </StepTransition>

                                {/* Step 2: Curso e Nível */}
                                <StepTransition currentStep={currentStep} targetStep={2}>
                                    <div className="flex flex-col justify-between h-full">
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="curso" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                                    Curso
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        id="curso"
                                                        name="curso"
                                                        type="text"
                                                        list="cursos"
                                                        required
                                                        className="w-full px-4 py-3 pr-12 bg-white/70 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/25 focus:border-blue-500 dark:focus:border-white/30 transition-all duration-300 cursor-text h-[48px]"
                                                        placeholder="Digite ou selecione seu curso"
                                                        value={formData.curso}
                                                        onChange={handleInputChange}
                                                        style={{
                                                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                                            backgroundPosition: 'right 0.75rem center',
                                                            backgroundRepeat: 'no-repeat',
                                                            backgroundSize: '1.5em 1.5em'
                                                        }}
                                                    />
                                                    <datalist id="cursos">
                                                        <option value="Ciência da Computação" />
                                                        <option value="Engenharia de Software" />
                                                        <option value="Sistemas de Informação" />
                                                        <option value="Análise e Desenvolvimento de Sistemas" />
                                                        <option value="Engenharia da Computação" />
                                                        <option value="Gestão da Tecnologia da Informação" />
                                                        <option value="Redes de Computadores" />
                                                        <option value="Segurança da Informação" />
                                                        <option value="Banco de Dados" />
                                                        <option value="Desenvolvimento Web" />
                                                        <option value="Inteligência Artificial" />
                                                        <option value="Ciência de Dados" />
                                                    </datalist>
                                                </div>
                                                {errors.curso && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.curso}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="nivel" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                                    Nível
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        id="nivel"
                                                        name="nivel"
                                                        required
                                                        className="w-full px-4 py-3 pr-12 bg-white/70 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/25 focus:border-blue-500 dark:focus:border-white/30 transition-all duration-300 cursor-pointer appearance-none h-[48px] shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-white/20"
                                                        value={formData.nivel}
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value="" className="text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">Selecione seu nível</option>
                                                        <option value="EFund" className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20">Ensino Fundamental</option>
                                                        <option value="EMed" className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20">Ensino Médio</option>
                                                        <option value="ETec" className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20">Ensino Técnico</option>
                                                        <option value="Grad" className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20">Graduação</option>
                                                        <option value="PosGrad" className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20">Pós-Graduação</option>
                                                    </select>
                                                    {/* Custom dropdown icon */}
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {errors.nivel && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nivel}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </StepTransition>

                                {/* Step 3: Senha */}
                                <StepTransition currentStep={currentStep} targetStep={3}>
                                    <div className="flex flex-col justify-between h-full">
                                        <div className="space-y-4">
                                            <FormInput
                                                id="password"
                                                name="password"
                                                type="password"
                                                label="Senha"
                                                placeholder="Digite sua senha"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                error={errors.password}
                                                autoComplete="new-password"
                                                required
                                                showPasswordToggle
                                                showPassword={showPassword}
                                                onTogglePassword={() => setShowPassword(!showPassword)}
                                            />
                                            <FormInput
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                label="Confirmar Senha"
                                                placeholder="Confirme sua senha"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                error={errors.confirmPassword}
                                                autoComplete="new-password"
                                                required
                                                showPasswordToggle
                                                showPassword={showConfirmPassword}
                                                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                                            />
                                        </div>
                                    </div>
                                </StepTransition>

                                {/* Step 4: Termos */}
                                <StepTransition currentStep={currentStep} targetStep={4}>
                                    <div className="flex flex-col justify-between h-full">
                                        <div className="flex items-start space-x-3 p-6 bg-white/50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                                            <input
                                                id="terms"
                                                name="terms"
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded focus:ring-blue-500 dark:focus:ring-white/25 focus:ring-2 mt-1"
                                                checked={acceptTerms}
                                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                            />
                                            <label htmlFor="terms" className="text-sm text-gray-700 dark:text-white/80 leading-relaxed">
                                                Aceito os{' '}
                                                <Link href="/terms" className="text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-200 transition-colors underline">
                                                    termos e condições
                                                </Link>
                                                {' '}e{' '}
                                                <Link href="/privacy" className="text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-200 transition-colors underline">
                                                    política de privacidade
                                                </Link>
                                                .
                                            </label>
                                        </div>
                                        {errors.terms && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.terms}</p>}
                                    </div>
                                </StepTransition>
                            </div>

                            {/* Submit Error */}
                            {errors.submit && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                                {errors.submit}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navegação dos steps */}
                            <div className="flex justify-between gap-2 mt-2">
                                {currentStep > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={handlePrev} 
                                        className="px-6 py-2 rounded-xl bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        <span>Voltar</span>
                                    </button>
                                )}
                                {currentStep < 4 && (
                                    <button 
                                        type="button" 
                                        onClick={handleNext} 
                                        className="ml-auto px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                                    >
                                        <span>Próximo</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                )}
                                {currentStep === 4 && (
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="ml-auto px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-500 text-white font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 disabled:cursor-not-allowed disabled:opacity-50 shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 disabled:transform-none"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Cadastrando...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <span>Criar Conta</span>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="flex items-center">
                                <div className="flex-grow border-t border-gray-300 dark:border-white/10"></div>
                                <span className="px-4 text-sm text-gray-700 dark:text-white/80">ou cadastre-se com</span>
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

                        {/* Login Link */}
                        <p className="text-center text-sm text-gray-700 dark:text-white/80 mt-6">
                            Já tem uma conta?{' '}
                            <Link href="/login" className="font-medium text-blue-600 dark:text-white hover:text-blue-800 dark:hover:text-cyan-200 transition-colors">
                                Faça login
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
                            Bem-vindo ao Memneo!
                        </h3>
                        <p className="text-gray-700 dark:text-white/80 text-lg mb-8 leading-relaxed">
                            Junte-se a diversos estudantes que já estão transformando a forma como aprendem e memorizam conteúdos.
                        </p>
                        
                        {/* Benefits List */}
                        <div className="space-y-4 text-left">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-200 dark:bg-white/15 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-gray-700 dark:text-white/90">Conta gratuita para sempre</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-200 dark:bg-white/15 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-gray-700 dark:text-white/90">Flashcards ilimitados</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-200 dark:bg-white/15 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-gray-700 dark:text-white/90">Sincronização em todos os dispositivos</span>
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