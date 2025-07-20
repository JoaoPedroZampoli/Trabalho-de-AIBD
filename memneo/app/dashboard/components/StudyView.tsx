import StudyModeCard from './StudyModeCard';
import { Deck, StudyStats } from '../types';

interface StudyViewProps {
    recentDecks: Deck[];
    studyStats: StudyStats;
}

export default function StudyView({ recentDecks, studyStats }: StudyViewProps) {
    const studyModes = [
        {
            title: "Revisão Rápida",
            description: "Cards que precisam ser revisados hoje",
            bgColor: "bg-gradient-to-r from-blue-600 to-blue-700",
            hoverColor: "hover:from-blue-700 hover:to-blue-800"
        },
        {
            title: "Novos Cards",
            description: "Aprenda cards que ainda não estudou",
            bgColor: "bg-gradient-to-r from-green-600 to-green-700",
            hoverColor: "hover:from-green-700 hover:to-green-800"
        },
        {
            title: "Teste Cronometrado",
            description: "Desafie-se com limite de tempo",
            bgColor: "bg-gradient-to-r from-purple-600 to-purple-700",
            hoverColor: "hover:from-purple-700 hover:to-purple-800"
        },
        {
            title: "Revisão Completa",
            description: "Revise todos os cards do deck",
            bgColor: "bg-gradient-to-r from-orange-600 to-orange-700",
            hoverColor: "hover:from-orange-700 hover:to-orange-800"
        }
    ];

    return (
        <>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sessão de Estudo</h2>
                <p className="text-gray-700 dark:text-white/80">Escolha um deck para começar a estudar</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Study Options */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-white/10">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Modos de Estudo</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {studyModes.map((mode, index) => (
                                <StudyModeCard
                                    key={index}
                                    title={mode.title}
                                    description={mode.description}
                                    bgColor={mode.bgColor}
                                    hoverColor={mode.hoverColor}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-white/10">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Decks Disponíveis</h3>
                        <div className="space-y-3">
                            {recentDecks.map((deck) => (
                                <div key={deck.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/8 transition-colors cursor-pointer">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">{deck.name}</h4>
                                        <p className="text-sm text-gray-600 dark:text-white/60">{deck.cards} cards • {deck.category}</p>
                                    </div>
                                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                        Estudar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Study Stats */}
                <div className="space-y-6">
                    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-white/10">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Estatísticas de Hoje</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-white/60">Cards estudados:</span>
                                <span className="font-bold text-gray-900 dark:text-white">{studyStats.studiedToday}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-white/60">Precisão:</span>
                                <span className="font-bold text-gray-900 dark:text-white">{studyStats.accuracy}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-white/60">Sequência:</span>
                                <span className="font-bold text-gray-900 dark:text-white">{studyStats.streak} dias</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-white/10">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cards para Revisar</h3>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">15</div>
                            <p className="text-gray-600 dark:text-white/60">cards aguardando revisão</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
