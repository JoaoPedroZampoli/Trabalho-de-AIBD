interface Deck {
    id: number;
    name: string;
    cards: number;
    studied: number;
    accuracy: number;
    category: string;
}

interface DeckCardProps {
    deck: Deck;
    variant?: 'compact' | 'full';
    onStudy?: () => void;
}

export default function DeckCard({ deck, variant = 'full', onStudy }: DeckCardProps) {
    if (variant === 'compact') {
        return (
            <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-white/8 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{deck.name}</h4>
                    <span className="text-sm text-gray-600 dark:text-white/60">{deck.cards} cards</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-700 dark:text-white/80">
                        <span>Estudados: {deck.studied}/{deck.cards}</span>
                        <span>Precisão: {deck.accuracy}%</span>
                    </div>
                    <button 
                        onClick={onStudy}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Estudar
                    </button>
                </div>
                <div className="mt-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${(deck.studied / deck.cards) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/8 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{deck.name}</h3>
                <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
            
            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-white/60">Total de Cards:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{deck.cards}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-white/60">Estudados:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{deck.studied}/{deck.cards}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-white/60">Precisão:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{deck.accuracy}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-white/60">Categoria:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{deck.category}</span>
                </div>
            </div>

            <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                    <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(deck.studied / deck.cards) * 100}%` }}
                    ></div>
                </div>
                <button 
                    onClick={onStudy}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Estudar Deck
                </button>
            </div>
        </div>
    );
}
