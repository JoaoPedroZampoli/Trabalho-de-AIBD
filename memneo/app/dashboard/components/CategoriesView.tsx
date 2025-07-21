'use client';

import { useState, useEffect } from 'react';
import CategoryCard from './CategoryCard';
import { Category, ViewType } from '../types';
import { useCategories } from '@/lib/useCategories';
import { useToastHelpers } from '@/lib/toast-types';

interface CategoriesViewProps {
    onStudy?: (categoryName: string) => void;
    onViewCards?: (categoryName: string) => void;
    setCurrentView?: (view: ViewType) => void;
}

export default function CategoriesView({ onStudy, onViewCards, setCurrentView }: CategoriesViewProps) {
    const { categories, isLoading, createCategory, loadCategories } = useCategories();
    const { success } = useToastHelpers();
    const [isCreating, setIsCreating] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: '',
        description: '',
        color: '#3B82F6',
        icon: '📚'
    });

    // Carregar categorias automaticamente se não estiverem carregadas
    useEffect(() => {
        if (categories.length === 0 && !isLoading) {
            loadCategories();
        }
    }, [categories.length, isLoading, loadCategories]);

    // Usar apenas dados da API
    const displayCategories = categories;

    const handleStudyCategory = (categoryName: string) => {
        if (setCurrentView) {
            setCurrentView('study');
        }
        if (onStudy) {
            onStudy(categoryName);
        }
    };

    const handleViewCards = (categoryName: string) => {
        // Salvar o filtro de categoria no localStorage para que DecksView possa usar
        localStorage.setItem('selectedCategoryFilter', categoryName);
        
        if (setCurrentView) {
            setCurrentView('decks');
        }
        if (onViewCards) {
            onViewCards(categoryName);
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.name.trim()) return;

        setIsCreating(true);
        try {
            await createCategory(newCategory);
            setNewCategory({ name: '', description: '', color: '#3B82F6', icon: '📚' });
            setShowCreateForm(false);
        } catch (error) {
            // Error is handled by the hook
        } finally {
            setIsCreating(false);
        }
    };

    const colorOptions = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
        '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
    ];

    const iconOptions = ['📚', '💻', '🔬', '🎨', '📊', '🌍', '💡', '🎵', '🏃‍♂️', '🍕'];

    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    🗂️ Gerenciar Categorias
                </h2>
                <p className="text-gray-700 dark:text-white/80">
                    Organize seus flashcards em categorias para um estudo mais eficiente
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-teal-100 text-sm font-medium">Total de Categorias</p>
                            <p className="text-3xl font-bold">{displayCategories.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🗂️</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Cards por Categoria</p>
                            <p className="text-3xl font-bold">{displayCategories.length > 0 ? Math.ceil(35 / displayCategories.length) : 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">📊</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Mais Estudada</p>
                            <p className="text-lg font-bold">{displayCategories[0]?.name || 'N/A'}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🏆</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Category Form */}
            {showCreateForm && (
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-white/10 shadow-xl mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                            ✨ Criar Nova Categoria
                        </h3>
                        <button 
                            onClick={() => setShowCreateForm(false)}
                            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleCreateCategory} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                                    1️⃣ Nome da Categoria
                                </label>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                                    placeholder="Ex: Programação, História, Matemática..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                                    2️⃣ Descrição
                                </label>
                                <textarea
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all resize-none"
                                    placeholder="Descreva o que você vai estudar nesta categoria..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                                3️⃣ Escolha uma Cor
                            </label>
                            <div className="flex gap-3 flex-wrap">
                                {colorOptions.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                                        className={`w-12 h-12 rounded-xl border-4 transition-all duration-200 transform hover:scale-110 ${newCategory.color === color ? 'border-gray-900 dark:border-white shadow-lg' : 'border-gray-200 dark:border-gray-600 hover:border-gray-400'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                                4️⃣ Escolha um Ícone
                            </label>
                            <div className="flex gap-3 flex-wrap">
                                {iconOptions.map(icon => (
                                    <button
                                        key={icon}
                                        type="button"
                                        onClick={() => setNewCategory(prev => ({ ...prev, icon }))}
                                        className={`w-12 h-12 rounded-xl border-4 transition-all duration-200 transform hover:scale-110 flex items-center justify-center text-xl ${newCategory.icon === icon ? 'border-gray-900 dark:border-white bg-gray-100 dark:bg-gray-700' : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={isCreating || !newCategory.name.trim()}
                                className="flex-1 px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCreating ? '🔄 Criando...' : '🚀 Criar Categoria'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="px-8 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-semibold text-lg"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-white/10 animate-pulse">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-2xl"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Categories Grid */}
            {!isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayCategories.map((category) => (
                        <CategoryCard
                            key={category._id || category.id}
                            category={{
                                id: category._id || category.id || '',
                                name: category.name,
                                decks: 1,
                                totalCards: (category as any).totalCards || 0,
                                color: category.color || '#3B82F6'
                            }}
                            onStudy={() => handleStudyCategory(category.name)}
                            onViewCards={() => handleViewCards(category.name)}
                        />
                    ))}

                    {/* Add New Category Card */}
                    <div 
                        onClick={() => setShowCreateForm(true)}
                        className="bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-teal-500 dark:hover:border-teal-400 transition-all duration-300 cursor-pointer group flex items-center justify-center min-h-[280px]"
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-600 dark:text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                Criar Nova Categoria
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                Organize seus estudos em categorias
                            </p>
                        </div>
                    </div>

                    {displayCategories.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <div className="text-6xl mb-4">📂</div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nenhuma categoria encontrada</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">Crie sua primeira categoria para organizar seus flashcards de forma eficiente</p>
                            <button 
                                onClick={() => setShowCreateForm(true)}
                                className="px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all font-semibold shadow-lg"
                            >
                                🚀 Criar Primeira Categoria
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
