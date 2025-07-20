'use client';

import { ViewType } from '../types';
import UserMenu from './UserMenu';

interface DashboardHeaderProps {
    currentView: ViewType;
    setCurrentView: (view: ViewType) => void;
    darkMode: boolean;
    toggleDarkMode: () => void;
    handleLogout: () => void;
}

export default function DashboardHeader({ 
    currentView, 
    setCurrentView, 
    darkMode, 
    toggleDarkMode, 
    handleLogout 
}: DashboardHeaderProps) {
    return (
        <header className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border-b border-gray-200 dark:border-white/10 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">M</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Memneo</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <button 
                            onClick={() => setCurrentView('overview')}
                            className={`font-medium transition-colors ${currentView === 'overview' ? 'text-blue-600 dark:text-cyan-400' : 'text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            Dashboard
                        </button>
                        <button 
                            onClick={() => setCurrentView('decks')}
                            className={`font-medium transition-colors ${currentView === 'decks' ? 'text-blue-600 dark:text-cyan-400' : 'text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            Meus Decks
                        </button>
                        <button 
                            onClick={() => setCurrentView('study')}
                            className={`font-medium transition-colors ${currentView === 'study' ? 'text-blue-600 dark:text-cyan-400' : 'text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            Estudar
                        </button>
                        <button 
                            onClick={() => setCurrentView('categories')}
                            className={`font-medium transition-colors ${currentView === 'categories' ? 'text-blue-600 dark:text-cyan-400' : 'text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            Categorias
                        </button>
                        <button 
                            onClick={() => setCurrentView('analytics')}
                            className={`font-medium transition-colors ${currentView === 'analytics' ? 'text-blue-600 dark:text-cyan-400' : 'text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            Análises
                        </button>
                    </nav>

                    {/* User Menu */}
                    <div className="flex items-center">
                        <UserMenu
                            darkMode={darkMode}
                            toggleDarkMode={toggleDarkMode}
                            handleLogout={handleLogout}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
