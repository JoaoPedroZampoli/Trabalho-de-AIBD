import { ViewType } from '../types';

interface MobileNavigationProps {
    currentView: ViewType;
    setCurrentView: (view: ViewType) => void;
}

export default function MobileNavigation({ currentView, setCurrentView }: MobileNavigationProps) {
    const navigationItems: { key: ViewType; label: string }[] = [
        { key: 'overview', label: 'Dashboard' },
        { key: 'decks', label: 'Decks' },
        { key: 'study', label: 'Estudar' },
        { key: 'categories', label: 'Categorias' },
        { key: 'analytics', label: 'Análises' }
    ];

    return (
        <div className="md:hidden mb-6">
            <div className="flex space-x-2 overflow-x-auto pb-2">
                {navigationItems.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setCurrentView(item.key)}
                        className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentView === item.key
                                ? 'bg-blue-600 text-white'
                                : 'bg-white/80 dark:bg-white/5 text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10'
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
