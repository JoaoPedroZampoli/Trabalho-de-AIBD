import ActivityItem from './ActivityItem';

interface Deck {
    id: number;
    name: string;
    cards: number;
    studied: number;
    accuracy: number;
    category: string;
}

interface AnalyticsViewProps {
    recentDecks: Deck[];
}

export default function AnalyticsView({ recentDecks }: AnalyticsViewProps) {
    const activities = [
        {
            title: "Completou sessão de React Hooks",
            time: "2 horas atrás",
            iconBgColor: "bg-green-100 dark:bg-green-900/30",
            iconColor: "text-green-600 dark:text-green-400",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: "Criou novo deck: Database Concepts",
            time: "1 dia atrás",
            iconBgColor: "bg-blue-100 dark:bg-blue-900/30",
            iconColor: "text-blue-600 dark:text-blue-400",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            )
        },
        {
            title: "Sequência de 7 dias alcançada!",
            time: "2 dias atrás",
            iconBgColor: "bg-orange-100 dark:bg-orange-900/30",
            iconColor: "text-orange-600 dark:text-orange-400",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
            )
        }
    ];

    return (
        <>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Análises de Desempenho</h2>
                <p className="text-gray-700 dark:text-white/80">Acompanhe seu progresso e estatísticas de estudo</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance Chart Placeholder */}
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-white/10">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Progresso Semanal</h3>
                    <div className="h-64 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 dark:text-white/50">Gráfico de progresso será implementado aqui</p>
                    </div>
                </div>

                {/* Study Time */}
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-white/10">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tempo de Estudo</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-white/60">Hoje:</span>
                            <span className="font-bold text-gray-900 dark:text-white">25 min</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-white/60">Esta semana:</span>
                            <span className="font-bold text-gray-900 dark:text-white">3h 45min</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-white/60">Este mês:</span>
                            <span className="font-bold text-gray-900 dark:text-white">14h 20min</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-white/60">Média diária:</span>
                            <span className="font-bold text-gray-900 dark:text-white">28 min</span>
                        </div>
                    </div>
                </div>

                {/* Deck Performance */}
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-white/10">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Performance por Deck</h3>
                    <div className="space-y-4">
                        {recentDecks.map((deck) => (
                            <div key={deck.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">{deck.name}</h4>
                                    <p className="text-sm text-gray-600 dark:text-white/60">Precisão: {deck.accuracy}%</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{deck.studied}/{deck.cards}</div>
                                    <div className="text-xs text-gray-600 dark:text-white/60">estudados</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-white/10">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Atividade Recente</h3>
                    <div className="space-y-3">
                        {activities.map((activity, index) => (
                            <ActivityItem
                                key={index}
                                icon={activity.icon}
                                iconBgColor={activity.iconBgColor}
                                iconColor={activity.iconColor}
                                title={activity.title}
                                time={activity.time}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
