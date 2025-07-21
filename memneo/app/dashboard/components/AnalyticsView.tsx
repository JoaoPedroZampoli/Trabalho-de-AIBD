import { useEffect } from 'react';
import { useAnalytics } from '@/lib/useAnalytics';
import { useFlashcards } from '@/lib/useFlashcards';
import { authUtils } from '@/lib/api';

interface AnalyticsViewProps {
    // Removido recentDecks - agora usa dados direto dos hooks
}

export default function AnalyticsView({}: AnalyticsViewProps) {
    const { dashboardStats, isLoading: analyticsLoading, loadDashboardStats } = useAnalytics();
    const { flashcards, isLoading: flashcardsLoading, loadFlashcards } = useFlashcards();

    // Carregar dados automaticamente se não estiverem carregados
    useEffect(() => {
        console.log('AnalyticsView: Carregando dados...');
        loadDashboardStats();
        loadFlashcards();
    }, [loadDashboardStats, loadFlashcards]);

    // Obter dados do usuário
    const currentUser = authUtils.getUser();

    const getPerformanceColor = (accuracy: number) => {
        if (accuracy >= 80) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
        if (accuracy >= 60) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    };

    const getPerformanceIcon = (accuracy: number) => {
        if (accuracy >= 80) return '🎯';
        if (accuracy >= 60) return '⚡';
        return '💪';
    };

    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    📊 Analytics & Performance
                </h2>
                <p className="text-gray-700 dark:text-white/80">
                    Acompanhe seu progresso e performance detalhada nos estudos
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Meus Flashcards</p>
                            <p className="text-3xl font-bold">{dashboardStats?.totalFlashcards || flashcards.length || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">📚</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Minha Precisão</p>
                            <p className="text-3xl font-bold">{dashboardStats?.overallAccuracy?.toFixed(1) || currentUser?.accuracy?.toFixed(1) || 0}%</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🎯</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Sequência Atual</p>
                            <p className="text-3xl font-bold">{dashboardStats?.userStreak || currentUser?.streak || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🔥</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Sessões Hoje</p>
                            <p className="text-3xl font-bold">{dashboardStats?.todaySessions || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">�</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-pink-100 text-sm font-medium">Total Estudado</p>
                            <p className="text-3xl font-bold">{dashboardStats?.userTotalCards || currentUser?.totalCards || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">�</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance por Flashcard */}
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">🎯 Performance por Flashcard</h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {flashcards.length} flashcards
                        </div>
                    </div>
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {flashcards.slice(0, 8).map((flashcard) => {
                            const accuracy = flashcard.totalAttempts ? Math.round(((flashcard.correctAttempts || 0) / flashcard.totalAttempts) * 100) : 0;
                            return (
                                <div key={flashcard._id || flashcard.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/8 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                            {flashcard.question.length > 60 ? flashcard.question.substring(0, 60) + '...' : flashcard.question}
                                        </h4>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(accuracy)}`}>
                                                {getPerformanceIcon(accuracy)} {accuracy}%
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Dificuldade: {flashcard.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right ml-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {flashcard.correctAttempts || 0}/{flashcard.totalAttempts || 0}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">acertos</div>
                                    </div>
                                </div>
                            );
                        })}
                        {flashcards.length === 0 && !flashcardsLoading && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📈</div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nenhum dado disponível</h3>
                                <p className="text-gray-600 dark:text-gray-400">Crie e estude flashcards para ver suas estatísticas aqui</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Insights e Recomendações */}
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-xl">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">💡 Insights & Recomendações</h3>
                    
                    <div className="space-y-4">
                        {dashboardStats && (
                            <>
                                {dashboardStats.overallAccuracy >= 80 ? (
                                    <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                                        <span className="text-2xl">🎉</span>
                                        <div>
                                            <h4 className="font-semibold text-green-800 dark:text-green-300">Excelente Performance!</h4>
                                            <p className="text-sm text-green-700 dark:text-green-400">Sua precisão está ótima. Continue assim!</p>
                                        </div>
                                    </div>
                                ) : dashboardStats.overallAccuracy >= 60 ? (
                                    <div className="flex items-start space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                                        <span className="text-2xl">⚡</span>
                                        <div>
                                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">Boa Performance!</h4>
                                            <p className="text-sm text-yellow-700 dark:text-yellow-400">Você está indo bem. Foque nos cards mais difíceis.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                                        <span className="text-2xl">💪</span>
                                        <div>
                                            <h4 className="font-semibold text-red-800 dark:text-red-300">Continue Praticando!</h4>
                                            <p className="text-sm text-red-700 dark:text-red-400">Revise os conceitos e pratique mais.</p>
                                        </div>
                                    </div>
                                )}

                                {dashboardStats.todaySessions === 0 && (
                                    <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                        <span className="text-2xl">📚</span>
                                        <div>
                                            <h4 className="font-semibold text-blue-800 dark:text-blue-300">Hora de Estudar!</h4>
                                            <p className="text-sm text-blue-700 dark:text-blue-400">Você ainda não estudou hoje. Que tal uma sessão rápida?</p>
                                        </div>
                                    </div>
                                )}

                                {flashcards.length < 5 && (
                                    <div className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                                        <span className="text-2xl">✨</span>
                                        <div>
                                            <h4 className="font-semibold text-purple-800 dark:text-purple-300">Crie Mais Flashcards!</h4>
                                            <p className="text-sm text-purple-700 dark:text-purple-400">Adicione mais flashcards para expandir seus estudos.</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Insights gerais quando não há dados */}
                        {!dashboardStats && (
                            <>
                                <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                    <span className="text-2xl">🚀</span>
                                    <div>
                                        <h4 className="font-semibold text-blue-800 dark:text-blue-300">Comece sua Jornada!</h4>
                                        <p className="text-sm text-blue-700 dark:text-blue-400">Crie seus primeiros flashcards e comece a estudar.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                                    <span className="text-2xl">📖</span>
                                    <div>
                                        <h4 className="font-semibold text-green-800 dark:text-green-300">Dica de Estudo</h4>
                                        <p className="text-sm text-green-700 dark:text-green-400">Estude por pequenos períodos diariamente para melhor retenção.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                                    <span className="text-2xl">🎯</span>
                                    <div>
                                        <h4 className="font-semibold text-purple-800 dark:text-purple-300">Organize por Categorias</h4>
                                        <p className="text-sm text-purple-700 dark:text-purple-400">Use categorias para organizar melhor seu material de estudo.</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
