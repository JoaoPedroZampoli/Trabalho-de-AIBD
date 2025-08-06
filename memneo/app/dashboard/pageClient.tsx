"use client";

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
import { useToastHelpers } from '@/lib/toast-types';
import { useFlashcards } from '@/lib/useFlashcards';
import { useCategories } from '@/lib/useCategories';
import { useAnalytics } from '@/lib/useAnalytics';

export default function DashboardClient() {
    const [darkMode, setDarkMode] = useState(false);
    const [currentView, setCurrentView] = useState<ViewType>('overview');
    const [studyStats, setStudyStats] = useState<StudyStats>({
        totalCards: 0,
        studiedToday: 0,
        streak: 0,
        accuracy: 0
    });
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const { success, info } = useToastHelpers();
    
    // Usar dados reais dos hooks
    const { flashcards, loadFlashcards, isLoading: flashcardsLoading } = useFlashcards();
    const { categories, loadCategories, isLoading: categoriesLoading } = useCategories();
    const { dashboardStats, loadDashboardStats, isLoading: analyticsLoading } = useAnalytics();

    // Effect para carregar dados apenas uma vez na inicialização
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                await Promise.all([
                    loadFlashcards(),
                    loadCategories(),
                    loadDashboardStats()
                ]);
            } catch (error) {
                console.error('Erro ao carregar dados iniciais:', error);
            }
        };

        loadInitialData();
    }, [loadFlashcards, loadCategories, loadDashboardStats]); // Adicionar dependências necessárias

    useEffect(() => {
        // Atualizar estatísticas baseado nos dados reais do banco
        if (dashboardStats) {
            setStudyStats({
                totalCards: dashboardStats.totalFlashcards || 0,
                accuracy: dashboardStats.overallAccuracy || 0,
                studiedToday: dashboardStats.todaySessions || 0,
                streak: 0, // Backend ainda não fornece streak
            });
        }
    }, [dashboardStats]);

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
            success('Sucesso!', message);
        }
    }, [searchParams, success]);

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
        info('Logout realizado', 'Você foi desconectado com sucesso.');
        setTimeout(() => {
            router.push('/login');
        }, 1000);
    };

    return (
        <ProtectedRoute>
            <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-slate-900 dark:via-blue-950 dark:to-emerald-950 transition-all duration-300 ${darkMode ? 'dark' : ''}`}>
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
                        setCurrentView={setCurrentView}
                        onStatsUpdate={setStudyStats}
                    />
                )}
                {currentView === 'decks' && (
                    <DecksView setCurrentView={setCurrentView} />
                )}
                {currentView === 'study' && (
                    <StudyView studyStats={studyStats} setCurrentView={setCurrentView} />
                )}
                {currentView === 'categories' && (
                    <CategoriesView 
                        setCurrentView={setCurrentView}
                    />
                )}
                {currentView === 'analytics' && (
                    <AnalyticsView />
                )}
            </main>
        </div>
        </ProtectedRoute>
    );
}
