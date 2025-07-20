'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardHeader from './components/DashboardHeader';
import MobileNavigation from './components/MobileNavigation';
import OverviewView from './components/OverviewView';
import DecksView from './components/DecksView';
import StudyView from './components/StudyView';
import CategoriesView from './components/CategoriesView';
import AnalyticsView from './components/AnalyticsView';
import { Deck, Category, StudyStats, ViewType } from './types';
import { authUtils } from '@/lib/api';

export default function DashboardPage() {
    const [darkMode, setDarkMode] = useState(false);
    const [currentView, setCurrentView] = useState<ViewType>('overview');
    const [successMessage, setSuccessMessage] = useState('');
    const [studyStats, setStudyStats] = useState<StudyStats>({
        totalCards: 145,
        studiedToday: 23,
        streak: 7,
        accuracy: 85
    });
    const [recentDecks, setRecentDecks] = useState<Deck[]>([
        { id: 1, name: 'JavaScript Fundamentals', cards: 25, studied: 18, accuracy: 88, category: 'Programação' },
        { id: 2, name: 'React Hooks', cards: 15, studied: 12, accuracy: 92, category: 'Programação' },
        { id: 3, name: 'Database Concepts', cards: 30, studied: 8, accuracy: 76, category: 'Banco de Dados' },
        { id: 4, name: 'Algorithms & Data Structures', cards: 40, studied: 25, accuracy: 82, category: 'Ciência da Computação' }
    ]);
    const [categories, setCategories] = useState<Category[]>([
        { id: 1, name: 'Programação', decks: 8, totalCards: 150, color: 'bg-blue-500' },
        { id: 2, name: 'Banco de Dados', decks: 3, totalCards: 75, color: 'bg-green-500' },
        { id: 3, name: 'Ciência da Computação', decks: 5, totalCards: 120, color: 'bg-purple-500' },
        { id: 4, name: 'Design', decks: 2, totalCards: 45, color: 'bg-pink-500' }
    ]);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }

        // Check for success message from login/registration
        const message = searchParams.get('message');
        if (message) {
            setSuccessMessage(message);
            // Clear message after 5 seconds
            setTimeout(() => setSuccessMessage(''), 5000);
        }

        // Load user data from localStorage and update stats
        const user = authUtils.getUser();
        if (user) {
            setStudyStats(prev => ({
                ...prev,
                totalCards: user.totalCards || prev.totalCards,
                accuracy: user.accuracy || prev.accuracy,
                streak: user.streak || prev.streak
            }));
        }
    }, [searchParams]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleLogout = () => {
        authUtils.logout();
        router.push('/login');
    };

    return (
        <ProtectedRoute>
            <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-slate-900 dark:via-blue-950 dark:to-emerald-950 transition-all duration-300 ${darkMode ? 'dark' : ''}`}>
                {/* Success Message */}
                {successMessage && (
                    <div className="fixed top-4 right-4 z-50 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl shadow-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.465 10.5a.75.75 0 00-1.06 1.061l2.999 2.999a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                    {successMessage}
                                </p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button
                                    onClick={() => setSuccessMessage('')}
                                    className="text-green-800 dark:text-green-200 hover:text-green-600 dark:hover:text-green-400"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
            <DashboardHeader
                currentView={currentView}
                setCurrentView={setCurrentView}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                handleLogout={handleLogout}
            />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Mobile Navigation */}
                <MobileNavigation
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                />

                {/* Render Current View */}
                {currentView === 'overview' && (
                    <OverviewView
                        studyStats={studyStats}
                        recentDecks={recentDecks}
                        setCurrentView={setCurrentView}
                    />
                )}
                {currentView === 'decks' && (
                    <DecksView recentDecks={recentDecks} />
                )}
                {currentView === 'study' && (
                    <StudyView recentDecks={recentDecks} studyStats={studyStats} />
                )}
                {currentView === 'categories' && (
                    <CategoriesView categories={categories} />
                )}
                {currentView === 'analytics' && (
                    <AnalyticsView recentDecks={recentDecks} />
                )}
            </main>
        </div>
        </ProtectedRoute>
    );
}
