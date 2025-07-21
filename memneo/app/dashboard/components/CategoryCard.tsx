interface Category {
    id: string | number;
    name: string;
    decks: number;
    totalCards: number;
    color: string;
}

interface CategoryCardProps {
    category: Category;
    onViewDecks?: () => void;
    onStudy?: () => void;
    onViewCards?: () => void;
}

export default function CategoryCard({ category, onViewDecks, onStudy, onViewCards }: CategoryCardProps) {
    return (
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/8 transition-all duration-300">
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
            
            <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-white/60">Total de Cards:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{category.totalCards}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-white/60">Decks:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{category.decks}</span>
                </div>
            </div>

            <div className="space-y-2">
                {/* Botão Estudar */}
                <button 
                    onClick={onStudy}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 font-medium flex items-center justify-center space-x-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Estudar</span>
                </button>

                {/* Botão Ver Cards */}
                <button 
                    onClick={onViewCards}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>Ver Cards</span>
                </button>
            </div>
        </div>
    );
}
