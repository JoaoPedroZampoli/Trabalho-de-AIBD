
'use client';
import { useAnalytics } from '@/lib/useAnalytics';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StudyStats } from '../types';
import { useFlashcards } from '@/lib/useFlashcards';
import { useCategories } from '@/lib/useCategories';
import { useFavorites } from '@/lib/useFavorites';
import { useSessions } from '@/lib/useSessions';
import { useToastHelpers } from '@/lib/toast-types';
import { Flashcard } from '@/lib/api';

interface StudyViewProps {
    studyStats: StudyStats;
    setCurrentView?: (view: any) => void;
}

export default function StudyView({ studyStats, setCurrentView }: StudyViewProps) {
    const [studyMode, setStudyMode] = useState<'selection' | 'studying' | 'results'>('selection');
    const [currentCards, setCurrentCards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [showResult, setShowResult] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [studySession, setStudySession] = useState({
        correct: 0,
        incorrect: 0,
        total: 0,
        answers: [] as Array<{
            flashcardId: string;
            question: string;
            userAnswer: string;
            correctAnswer: string;
            isCorrect: boolean;
        }>
    });
    const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
    // Hook para atualizar o dashboard após o estudo
    const { loadDashboardStats } = useAnalytics();
    
    const { flashcards, loadFlashcards, isLoading } = useFlashcards();
    const { categories, loadCategories } = useCategories();
    const { favorites, loadFavorites } = useFavorites();
    const { finishStudySession, isLoading: sessionLoading } = useSessions();
    const { success, error } = useToastHelpers();

    // Carregar dados automaticamente
    useEffect(() => {
        if (flashcards.length === 0 && !isLoading) {
            loadFlashcards();
        }
        if (categories.length === 0) {
            loadCategories();
        }
        loadFavorites();
    }, [flashcards.length, categories.length, isLoading, loadFlashcards, loadCategories, loadFavorites]);

    // Filtrar flashcards por categoria
    const getFilteredFlashcards = () => {
        if (selectedCategory === 'all') {
            return flashcards;
        }
        if (selectedCategory === 'favorites') {
            return favorites;
        }
        return flashcards.filter(card => card.category === selectedCategory);
    };

    const startStudy = (mode: string) => {
        console.log('startStudy called with mode:', mode);
        const availableCards = getFilteredFlashcards();
        console.log('availableCards found:', availableCards.length);
        
        if (availableCards.length === 0) {
            error('Erro', 'Nenhum flashcard disponível para estudo. Crie alguns flashcards primeiro!');
            return;
        }

        let cardsToStudy: Flashcard[] = [];

        switch (mode) {
            case 'quick':
                cardsToStudy = availableCards.slice(0, 10);
                break;
            case 'new':
                cardsToStudy = availableCards.filter(card => !card.lastStudied).slice(0, 15);
                if (cardsToStudy.length === 0) {
                    cardsToStudy = availableCards.slice(0, 15);
                }
                break;
            case 'difficult':
                cardsToStudy = availableCards.filter(card => card.difficulty === 'Difícil').slice(0, 10);
                if (cardsToStudy.length === 0) {
                    cardsToStudy = availableCards.slice(0, 10);
                }
                break;
            case 'all':
                cardsToStudy = [...availableCards].sort(() => Math.random() - 0.5);
                break;
            default:
                cardsToStudy = availableCards.slice(0, 10);
        }

        if (cardsToStudy.length === 0) {
            error('Erro', 'Nenhum flashcard encontrado para este modo de estudo.');
            return;
        }

        console.log('cardsToStudy selected:', cardsToStudy.length);
        setCurrentCards(cardsToStudy);
        setCurrentIndex(0);
        setSelectedAnswer('');
        setShowResult(false);
        setStudySession({
            correct: 0,
            incorrect: 0,
            total: cardsToStudy.length,
            answers: []
        });
        setSessionStartTime(new Date()); // Marcar início da sessão
        console.log('Sessão iniciada! sessionStartTime definido para:', new Date());
        setStudyMode('studying');
        success('Sucesso', `Iniciando estudo com ${cardsToStudy.length} flashcards!`);
    };

    const handleAnswer = () => {
        if (!selectedAnswer.trim()) {
            error('Erro', 'Por favor, selecione ou digite uma resposta.');
            return;
        }

        const currentCard = currentCards[currentIndex];
        const isCorrect = selectedAnswer.toLowerCase().trim() === currentCard.answer.toLowerCase().trim();
        
        setStudySession(prev => ({
            ...prev,
            correct: prev.correct + (isCorrect ? 1 : 0),
            incorrect: prev.incorrect + (isCorrect ? 0 : 1),
            answers: [...prev.answers, {
                flashcardId: currentCard._id || currentCard.id || '',
                question: currentCard.question,
                userAnswer: selectedAnswer,
                correctAnswer: currentCard.answer,
                isCorrect
            }]
        }));

        setShowResult(true);
    };

    const nextCard = () => {
        console.log('nextCard called!');
        console.log('currentIndex:', currentIndex);
        console.log('currentCards.length:', currentCards.length);
        
        if (currentIndex < currentCards.length - 1) {
            console.log('Indo para próximo card...');
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer('');
            setShowResult(false);
        } else {
            console.log('Última carta! Finalizando sessão...');
            // Finalizar sessão e salvar no backend
            finishSession();
        }
    };

    const finishSession = async () => {
        console.log('finishSession called!');
        console.log('sessionStartTime:', sessionStartTime);
        console.log('studySession.answers:', studySession.answers);
        
        if (sessionStartTime && studySession.answers.length > 0) {
            console.log('Salvando sessão no backend...', {
                answers: studySession.answers,
                startTime: sessionStartTime,
                endTime: new Date()
            });
            
            try {
                const result = await finishStudySession(studySession.answers, sessionStartTime);
                console.log('Resultado do backend:', result);
                // Atualiza o dashboard (streak, etc) após finalizar sessão
                await loadDashboardStats();
            } catch (error) {
                console.error('Erro ao salvar sessão:', error);
            }
        } else {
            console.log('Condições não atendidas para salvar sessão');
        }
        setStudyMode('results');
    };

    const restartStudy = () => {
        setStudyMode('selection');
        setCurrentCards([]);
        setCurrentIndex(0);
        setSelectedAnswer('');
        setShowResult(false);
        setSessionStartTime(null);
        setStudySession({
            correct: 0,
            incorrect: 0,
            total: 0,
            answers: []
        });
    };

    const goToDecks = () => {
        if (setCurrentView) {
            setCurrentView('decks');
        }
    };

    // Agrupar flashcards por categoria
    const flashcardsByCategory = flashcards.reduce((acc, card) => {
        if (!acc[card.category]) {
            acc[card.category] = [];
        }
        acc[card.category].push(card);
        return acc;
    }, {} as Record<string, Flashcard[]>);

    // Modo de seleção
    if (studyMode === 'selection') {
        return (
            <>
                <div className="mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        🎓 Estudar Flashcards
                    </h2>
                    <p className="text-gray-700 dark:text-white/80">
                        Escolha um modo de estudo e comece a praticar seus conhecimentos
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Total de Cards</p>
                                <p className="text-3xl font-bold">{flashcards.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🃏</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Estudados Hoje</p>
                                <p className="text-3xl font-bold">{studyStats.studiedToday}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">📚</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Precisão</p>
                                <p className="text-3xl font-bold">{studyStats.accuracy}%</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🎯</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm font-medium">Sequência</p>
                                <p className="text-3xl font-bold">{studyStats.streak}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🔥</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">
                        📁 Escolha uma categoria para estudar:
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full md:w-auto px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all text-lg"
                    >
                        <option value="all">🌟 Todas as Categorias ({flashcards.length} cards)</option>
                        <option value="favorites">⭐ Meus Decks ({favorites.length} cards)</option>
                        {Object.entries(flashcardsByCategory).map(([category, cards]) => (
                            <option key={category} value={category}>
                                📂 {category} ({cards.length} cards)
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card 
                        className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800"
                        onClick={() => startStudy('quick')}
                    >
                        <CardHeader className="text-center pb-2">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl">
                                ⚡
                            </div>
                            <CardTitle className="text-xl text-blue-800 dark:text-blue-200">Revisão Rápida</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-blue-600 dark:text-blue-300 mb-4">
                                Revise rapidamente 10 flashcards aleatórios
                            </p>
                            <div className="text-sm text-blue-500 dark:text-blue-400">
                                ⏱️ ~5-10 minutos
                            </div>
                        </CardContent>
                    </Card>

                    <Card 
                        className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800"
                        onClick={() => startStudy('new')}
                    >
                        <CardHeader className="text-center pb-2">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-3xl">
                                🌟
                            </div>
                            <CardTitle className="text-xl text-green-800 dark:text-green-200">Cards Novos</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-green-600 dark:text-green-300 mb-4">
                                Aprenda cards que ainda não estudou
                            </p>
                            <div className="text-sm text-green-500 dark:text-green-400">
                                📚 Até 15 cards novos
                            </div>
                        </CardContent>
                    </Card>

                    <Card 
                        className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800"
                        onClick={() => startStudy('difficult')}
                    >
                        <CardHeader className="text-center pb-2">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white text-3xl">
                                🔥
                            </div>
                            <CardTitle className="text-xl text-red-800 dark:text-red-200">Desafio</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-red-600 dark:text-red-300 mb-4">
                                Foque nos cards mais difíceis
                            </p>
                            <div className="text-sm text-red-500 dark:text-red-400">
                                💪 Cards de nível difícil
                            </div>
                        </CardContent>
                    </Card>

                    <Card 
                        className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800"
                        onClick={() => startStudy('all')}
                    >
                        <CardHeader className="text-center pb-2">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl">
                                🎯
                            </div>
                            <CardTitle className="text-xl text-purple-800 dark:text-purple-200">Sessão Completa</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-purple-600 dark:text-purple-300 mb-4">
                                Estude todos os cards disponíveis
                            </p>
                            <div className="text-sm text-purple-500 dark:text-purple-400">
                                📊 Todos os cards
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🚀 Ações Rápidas</h3>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            onClick={goToDecks}
                            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white"
                        >
                            ➕ Criar Novos Flashcards
                        </Button>
                        {flashcards.length === 0 && (
                            <div className="text-gray-600 dark:text-gray-400 italic">
                                Você precisa criar alguns flashcards antes de começar a estudar!
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    }

    // Modo de estudo
    if (studyMode === 'studying') {
        const currentCard = currentCards[currentIndex];
        const rawProgress = ((currentIndex + 1) / currentCards.length) * 100;
        const progress = Math.min(rawProgress, 100);

        return (
            <>
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            📚 Estudando: {currentCard.category}
                        </h2>
                        <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                            {currentIndex + 1} / {currentCards.length}
                        </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                            className="bg-gradient-to-r from-teal-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {Math.round(progress)}% concluído
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <Card className="bg-white/90 dark:bg-white/10 backdrop-blur-sm border-2 border-gray-200 dark:border-white/20 shadow-2xl">
                        <CardHeader className="text-center pb-6">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <span className={`px-4 py-2 rounded-xl text-sm font-bold ${
                                    currentCard.difficulty === 'Fácil' ? 'bg-green-100 text-green-800' :
                                    currentCard.difficulty === 'Médio' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {currentCard.difficulty === 'Fácil' ? '😊' : currentCard.difficulty === 'Médio' ? '😐' : '🔥'} {currentCard.difficulty}
                                </span>
                                <span className="px-4 py-2 rounded-xl text-sm font-bold bg-blue-100 text-blue-800">
                                    📁 {currentCard.category}
                                </span>
                            </div>
                            <CardTitle className="text-2xl md:text-3xl text-gray-900 dark:text-white leading-relaxed">
                                {currentCard.question}
                            </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                            {!showResult ? (
                                <>
                                    {currentCard.options && currentCard.options.length > 0 ? (
                                        <div className="space-y-3">
                                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                                Escolha a resposta correta:
                                            </p>
                                            {currentCard.options.filter(opt => opt.trim()).map((option, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedAnswer(option)}
                                                    className={`w-full p-4 text-left rounded-xl border-2 transition-all hover:scale-105 ${
                                                        selectedAnswer === option
                                                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-800 dark:text-teal-200'
                                                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                                                    }`}
                                                >
                                                    <span className="font-semibold text-teal-600 dark:text-teal-400 mr-3">
                                                        {String.fromCharCode(65 + index)})
                                                    </span>
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                                Digite sua resposta:
                                            </label>
                                            <input
                                                type="text"
                                                value={selectedAnswer}
                                                onChange={(e) => setSelectedAnswer(e.target.value)}
                                                className="w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all text-lg"
                                                placeholder="Digite sua resposta aqui..."
                                                onKeyPress={(e) => e.key === 'Enter' && handleAnswer()}
                                            />
                                        </div>
                                    )}

                                    <div className="flex gap-4 pt-6">
                                        <Button
                                            onClick={handleAnswer}
                                            disabled={!selectedAnswer.trim()}
                                            className="flex-1 py-4 text-lg bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold disabled:opacity-50"
                                        >
                                            ✅ Confirmar Resposta
                                        </Button>
                                        <Button
                                            onClick={restartStudy}
                                            variant="outline"
                                            className="px-6 py-4"
                                        >
                                            ❌ Sair
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center space-y-6">
                                    <div className={`text-6xl mb-4 ${
                                        studySession.answers[studySession.answers.length - 1]?.isCorrect ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                        {studySession.answers[studySession.answers.length - 1]?.isCorrect ? '🎉' : '😞'}
                                    </div>
                                    
                                    <div className={`text-2xl font-bold ${
                                        studySession.answers[studySession.answers.length - 1]?.isCorrect ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {studySession.answers[studySession.answers.length - 1]?.isCorrect ? 'Correto!' : 'Incorreto!'}
                                    </div>
                                    
                                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                                            <strong>Sua resposta:</strong> {selectedAnswer}
                                        </p>
                                        <p className="text-lg text-green-600 dark:text-green-400">
                                            <strong>Resposta correta:</strong> {currentCard.answer}
                                        </p>
                                    </div>

                                    <Button
                                        onClick={nextCard}
                                        className="px-8 py-4 text-lg bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold"
                                    >
                                        {currentIndex < currentCards.length - 1 ? '➡️ Próximo Card' : '🏁 Ver Resultados'}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{studySession.correct}</div>
                        <div className="text-sm text-green-600 dark:text-green-400">Corretas</div>
                    </div>
                    <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{studySession.incorrect}</div>
                        <div className="text-sm text-red-600 dark:text-red-400">Incorretas</div>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currentIndex + 1}</div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">Atual</div>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{studySession.total}</div>
                        <div className="text-sm text-purple-600 dark:text-purple-400">Total</div>
                    </div>
                </div>
            </>
        );
    }

    // Tela de resultados
    if (studyMode === 'results') {
        const accuracy = studySession.total > 0 ? Math.round((studySession.correct / studySession.total) * 100) : 0;
        
        return (
            <>
                <div className="mb-8 text-center">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-4">
                        🎊 Sessão Concluída!
                    </h2>
                    <p className="text-xl text-gray-700 dark:text-white/80">
                        Parabéns! Você completou sua sessão de estudos
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg text-center">
                        <div className="text-4xl font-bold mb-2">{studySession.correct}</div>
                        <div className="text-green-100">Respostas Corretas</div>
                    </div>
                    <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg text-center">
                        <div className="text-4xl font-bold mb-2">{studySession.incorrect}</div>
                        <div className="text-red-100">Respostas Incorretas</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg text-center">
                        <div className="text-4xl font-bold mb-2">{accuracy}%</div>
                        <div className="text-blue-100">Precisão</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg text-center">
                        <div className="text-4xl font-bold mb-2">{studySession.total}</div>
                        <div className="text-purple-100">Total de Cards</div>
                    </div>
                </div>

                <div className={`mb-8 p-6 rounded-2xl text-center ${
                    accuracy >= 80 ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
                    accuracy >= 60 ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
                    'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}>
                    <div className="text-4xl mb-2">
                        {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '👍' : '💪'}
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${
                        accuracy >= 80 ? 'text-green-600 dark:text-green-400' :
                        accuracy >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                    }`}>
                        {accuracy >= 80 ? 'Excelente trabalho!' :
                         accuracy >= 60 ? 'Bom trabalho!' :
                         'Continue praticando!'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {accuracy >= 80 ? 'Você domina bem este conteúdo!' :
                         accuracy >= 60 ? 'Você está no caminho certo!' :
                         'A prática leva à perfeição!'}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <Button
                        onClick={restartStudy}
                        className="px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold text-lg"
                    >
                        🔄 Estudar Novamente
                    </Button>
                    <Button
                        onClick={goToDecks}
                        variant="outline"
                        className="px-8 py-4 text-lg"
                    >
                        🃏 Ver Meus Flashcards
                    </Button>
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📊 Resultados Detalhados</h3>
                    <div className="space-y-4">
                        {studySession.answers.map((answer, index) => (
                            <div key={index} className={`p-4 rounded-xl border ${
                                answer.isCorrect 
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                            }`}>
                                <div className="flex items-start gap-4">
                                    <div className={`text-2xl ${answer.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                        {answer.isCorrect ? '✅' : '❌'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 dark:text-white mb-2">
                                            {answer.question}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            <strong>Sua resposta:</strong> {answer.userAnswer}
                                        </p>
                                        {!answer.isCorrect && (
                                            <p className="text-green-600 dark:text-green-400">
                                                <strong>Resposta correta:</strong> {answer.correctAnswer}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }

    return null;
}
