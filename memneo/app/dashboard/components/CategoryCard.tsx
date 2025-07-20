interface Category {
    id: number;
    name: string;
    decks: number;
    totalCards: number;
    color: string;
}

interface CategoryCardProps {
    category: Category;
    onViewDecks?: () => void;
}

export default function CategoryCard({ category, onViewDecks }: CategoryCardProps) {
    return (
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/8 transition-all duration-300 cursor-pointer">
            <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                    <p className="text-gray-600 dark:text-white/60">{category.decks} decks</p>
                </div>
            </div>
            
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-white/60">Total de Cards:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{category.totalCards}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-white/60">Decks:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{category.decks}</span>
                </div>
            </div>

            <button 
                onClick={onViewDecks}
                className="w-full mt-4 px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
            >
                Ver Decks
            </button>
        </div>
    );
}
