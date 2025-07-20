import StatsCard from './StatsCard';
import QuickActionCard from './QuickActionCard';
import DeckCard from './DeckCard';
import { Deck, StudyStats, ViewType } from '../types';

interface OverviewViewProps {
    studyStats: StudyStats;
    recentDecks: Deck[];
    setCurrentView: (view: ViewType) => void;
}

export default function OverviewView({ studyStats, recentDecks, setCurrentView }: OverviewViewProps) {
    return (
        <>
            {/* Welcome Section */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Bem-vindo de volta! 👋
                </h2>
                <p className="text-gray-700 dark:text-white/80">
                    Continue sua jornada de aprendizado com seus flashcards
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Commented out stats cards */}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
                {/* Main Study Action - Takes up 2 columns */}
                <div className="lg:col-span-2">
                    <button 
                        onClick={() => setCurrentView('study')} 
                        className="group w-full h-full min-h-[240px] bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-8 text-white hover:from-blue-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center text-center"
                    >
                        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-3">Estudar Agora</h3>
                            <p className="text-white/90 text-lg">Continue revisando seus cards</p>
                        </div>
                    </button>
                </div>

                {/* Streak Card */}
                <div className="lg:col-span-1">
                    <div className="w-full h-full min-h-[240px] bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 716.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0720 13a7.975 7.975 0 01-2.343 5.657z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-2">Sequência</h3>
                            <p className="text-white/90 text-2xl font-bold">{studyStats.streak}</p>
                            <p className="text-white/90 text-sm">dias consecutivos</p>
                        </div>
                    </div>
                </div>

                {/* Studies Today Card */}
                <div className="lg:col-span-1">
                    <div className="w-full h-full min-h-[240px] bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 text-white transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-2">Estudados Hoje</h3>
                            <p className="text-white/90 text-2xl font-bold">{studyStats.studiedToday}</p>
                            <p className="text-white/90 text-sm">cards</p>
                        </div>
                    </div>
                </div>

                {/* Side Actions - 2x2 grid menu */}
                <div className="lg:col-span-1 grid grid-cols-2 gap-3 h-[240px]">
                    <QuickActionCard
                        title="Criar Deck"
                        description="Adicione novos flashcards"
                        onClick={() => setCurrentView('decks')}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        }
                    />

                    <QuickActionCard
                        title="Ver Análises"
                        description="Acompanhe seu progresso"
                        onClick={() => setCurrentView('analytics')}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        }
                    />

                    <QuickActionCard
                        title="Categorias"
                        description="Organize seus decks"
                        onClick={() => setCurrentView('categories')}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        }
                    />

                    <QuickActionCard
                        title="Meus Decks"
                        description="Gerencie seus decks"
                        onClick={() => setCurrentView('decks')}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        }
                    />
                </div>
            </div>

            {/* Recent Decks */}
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Decks Recentes</h3>
                    <button 
                        onClick={() => setCurrentView('decks')} 
                        className="text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-200 font-medium transition-colors"
                    >
                        Ver todos
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentDecks.slice(0, 4).map((deck) => (
                        <DeckCard key={deck.id} deck={deck} variant="compact" />
                    ))}
                </div>
            </div>
        </>
    );
}
