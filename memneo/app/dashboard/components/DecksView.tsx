'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useFlashcards } from '@/lib/useFlashcards';
import { useCategories } from '@/lib/useCategories';
import { useFavorites } from '@/lib/useFavorites';
import { useToastHelpers } from '@/lib/toast-types';
import { Flashcard } from '@/lib/api';

interface FlashcardFormData {
  question: string;
  options: string[];
  answer: string;
  category: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  tags: string[];
}

interface DecksViewProps {
  setCurrentView?: (view: any) => void;
}

export default function DecksView({ setCurrentView }: DecksViewProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState<FlashcardFormData>({
        question: '',
        options: ['', ''],
        answer: '',
        category: '',
        difficulty: 'Médio',
        tags: []
    });

    const { 
        flashcards, 
        loadFlashcards, 
        createFlashcard, 
        updateFlashcard, 
        deleteFlashcard, 
        isLoading 
    } = useFlashcards();
    
    const { categories, loadCategories } = useCategories();
    const { 
        favorites, 
        loadFavorites, 
        addToFavorites, 
        removeFromFavorites, 
        isFavorite 
    } = useFavorites();
    const { success, error } = useToastHelpers();

    // Carregar dados automaticamente
    useEffect(() => {
        console.log('DecksView: Carregando dados do banco...');
        console.log('Flashcards atuais:', flashcards.length);
        console.log('Categories atuais:', categories.length);
        console.log('Favoritos atuais:', favorites.length);
        
        // Sempre carrega os dados para garantir que estamos usando dados reais
        loadFlashcards();
        loadCategories();
        loadFavorites();
        
        // Verificar se há filtro de categoria salvo no localStorage
        const savedCategoryFilter = localStorage.getItem('selectedCategoryFilter');
        if (savedCategoryFilter && savedCategoryFilter !== 'all') {
            console.log('DecksView: Aplicando filtro de categoria salvo:', savedCategoryFilter);
            setSelectedCategory(savedCategoryFilter);
            // Limpar o filtro do localStorage após aplicar
            localStorage.removeItem('selectedCategoryFilter');
        }
    }, [loadFlashcards, loadCategories, loadFavorites]);

    // Filtrar flashcards
    const filteredFlashcards = (() => {
        let cardsToFilter = flashcards;
        
        // Se estiver visualizando favoritos, usar a lista de favoritos
        if (selectedCategory === 'favorites') {
            cardsToFilter = favorites;
        }
        
        return cardsToFilter.filter(card => {
            const matchesCategory = selectedCategory === 'all' || 
                                  selectedCategory === 'favorites' || 
                                  card.category === selectedCategory;
            const matchesSearch = card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 card.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 card.category.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    })();

    // Agrupar por categoria
    const flashcardsByCategory = flashcards.reduce((acc, card) => {
        if (!acc[card.category]) {
            acc[card.category] = [];
        }
        acc[card.category].push(card);
        return acc;
    }, {} as Record<string, Flashcard[]>);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.question.trim() || !formData.answer.trim() || !formData.category) {
            error('Erro', 'Preencha todos os campos obrigatórios');
            return;
        }

        try {
            if (editingCard) {
                await updateFlashcard(editingCard._id || editingCard.id || '', formData);
                success('Sucesso', 'Flashcard atualizado com sucesso!');
            } else {
                await createFlashcard(formData);
                success('Sucesso', 'Flashcard criado com sucesso!');
            }
            
            resetForm();
            setIsCreateModalOpen(false);
            setEditingCard(null);
        } catch (err) {
            // Erro já tratado no hook
        }
    };

    const resetForm = () => {
        setFormData({
            question: '',
            options: ['', ''],
            answer: '',
            category: '',
            difficulty: 'Médio',
            tags: []
        });
    };

    const handleEdit = (card: Flashcard) => {
        setEditingCard(card);
        setFormData({
            question: card.question,
            options: card.options || ['', ''],
            answer: card.answer,
            category: card.category,
            difficulty: card.difficulty,
            tags: card.tags || []
        });
        setIsCreateModalOpen(true);
    };

    const handleDelete = async (cardId: string) => {
        if (confirm('Tem certeza que deseja excluir este flashcard?')) {
            try {
                await deleteFlashcard(cardId);
                success('Sucesso', 'Flashcard excluído com sucesso!');
            } catch (err) {
                // Erro já tratado no hook
            }
        }
    };

    const startStudyWithCard = (card: Flashcard) => {
        if (setCurrentView) {
            setCurrentView('study');
        }
    };

    const addOption = () => {
        setFormData(prev => ({
            ...prev,
            options: [...prev.options, '']
        }));
    };

    const removeOption = (index: number) => {
        if (formData.options.length > 2) {
            setFormData(prev => ({
                ...prev,
                options: prev.options.filter((_, i) => i !== index)
            }));
        }
    };

    const updateOption = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.map((opt, i) => i === index ? value : opt)
        }));
    };

    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    🃏 Meus Flashcards
                </h2>
                <p className="text-gray-700 dark:text-white/80">
                    Visualize, edite e gerencie todos os seus flashcards
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total de Cards</p>
                            <p className="text-3xl font-bold">{flashcards.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🃏</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Categorias</p>
                            <p className="text-3xl font-bold">{Object.keys(flashcardsByCategory).length}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🗂️</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Cards Fáceis</p>
                            <p className="text-3xl font-bold">{flashcards.filter(c => c.difficulty === 'Fácil').length}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">😊</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-100 text-sm font-medium">Cards Difíceis</p>
                            <p className="text-3xl font-bold">{flashcards.filter(c => c.difficulty === 'Difícil').length}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🔥</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1">
                    <Input
                        type="text"
                        placeholder="🔍 Buscar flashcards..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-12 text-lg"
                    />
                </div>
                
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                >
                    <option value="all">📁 Todas as Categorias</option>
                    <option value="favorites">⭐ Meus Decks ({favorites.length})</option>
                    {Object.keys(flashcardsByCategory).map(category => (
                        <option key={category} value={category}>
                            {category} ({flashcardsByCategory[category].length})
                        </option>
                    ))}
                </select>

                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            onClick={() => {
                                resetForm();
                                setEditingCard(null);
                            }}
                            className="h-12 px-6 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold"
                        >
                            ➕ Novo Flashcard
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">
                                {editingCard ? '✏️ Editar Flashcard' : '➕ Criar Novo Flashcard'}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    📝 Pergunta
                                </label>
                                <textarea
                                    value={formData.question}
                                    onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all resize-none"
                                    placeholder="Digite a pergunta do flashcard..."
                                    rows={3}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    🎯 Opções de Resposta
                                </label>
                                {formData.options.map((option, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <Input
                                            value={option}
                                            onChange={(e) => updateOption(index, e.target.value)}
                                            placeholder={`Opção ${index + 1}`}
                                            className="flex-1"
                                        />
                                        {formData.options.length > 2 && (
                                            <Button
                                                type="button"
                                                onClick={() => removeOption(index)}
                                                variant="outline"
                                                size="sm"
                                                className="px-3"
                                            >
                                                ❌
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    onClick={addOption}
                                    variant="outline"
                                    className="mt-2"
                                >
                                    ➕ Adicionar Opção
                                </Button>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    ✅ Resposta Correta
                                </label>
                                <select
                                    value={formData.answer}
                                    onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                                    required
                                >
                                    <option value="">Selecione a resposta correta</option>
                                    {formData.options.map((option, index) => 
                                        option.trim() && (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        )
                                    )}
                                </select>
                                {formData.options.filter(opt => opt.trim()).length === 0 && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Adicione pelo menos uma opção para selecionar a resposta correta
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        📁 Categoria
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                                        required
                                    >
                                        <option value="">Selecione uma categoria</option>
                                        {categories.map(cat => (
                                            <option key={cat._id || cat.id} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        ⚡ Dificuldade
                                    </label>
                                    <select
                                        value={formData.difficulty}
                                        onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'Fácil' | 'Médio' | 'Difícil' }))}
                                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                                    >
                                        <option value="Fácil">😊 Fácil</option>
                                        <option value="Médio">😐 Médio</option>
                                        <option value="Difícil">🔥 Difícil</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold"
                                >
                                    {editingCard ? '💾 Salvar Alterações' : '🚀 Criar Flashcard'}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setIsCreateModalOpen(false);
                                        setEditingCard(null);
                                        resetForm();
                                    }}
                                    variant="outline"
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-white/10 animate-pulse">
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Flashcards Grid */}
            {!isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFlashcards.map((card) => (
                        <Card key={card._id || card.id} className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 hover:shadow-xl transition-all duration-300">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                                card.difficulty === 'Fácil' ? 'bg-green-100 text-green-800' :
                                                card.difficulty === 'Médio' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {card.difficulty === 'Fácil' ? '😊' : card.difficulty === 'Médio' ? '😐' : '🔥'} {card.difficulty}
                                            </span>
                                            <span className="px-2 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-800">
                                                📁 {card.category}
                                            </span>
                                        </div>
                                        <CardTitle className="text-lg line-clamp-2">{card.question}</CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">✅ Resposta:</p>
                                        <p className="text-sm bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 p-2 rounded-lg">
                                            {card.answer}
                                        </p>
                                    </div>
                                    
                                    {card.options && card.options.length > 0 && (
                                        <div>
                                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">🎯 Opções:</p>
                                            <div className="space-y-1">
                                                {card.options.filter(opt => opt.trim()).map((option, index) => (
                                                    <p key={index} className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                                        {String.fromCharCode(65 + index)}) {option}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            onClick={() => startStudyWithCard(card)}
                                            size="sm"
                                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                                        >
                                            📚 Estudar
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                const cardId = card._id || card.id || '';
                                                console.log('DecksView: Tentando favoritar/desfavoritar card:', cardId);
                                                console.log('DecksView: isFavorite atual:', isFavorite(cardId));
                                                console.log('DecksView: Lista de favoritos:', favorites);
                                                
                                                if (isFavorite(cardId)) {
                                                    console.log('DecksView: Removendo dos favoritos...');
                                                    removeFromFavorites(cardId);
                                                } else {
                                                    console.log('DecksView: Adicionando aos favoritos...');
                                                    addToFavorites(cardId);
                                                }
                                            }}
                                            size="sm"
                                            variant="outline"
                                            className={`px-3 ${isFavorite(card._id || card.id || '') ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' : 'hover:text-yellow-600 hover:bg-yellow-50'}`}
                                        >
                                            {isFavorite(card._id || card.id || '') ? '⭐' : '☆'}
                                        </Button>
                                        <Button
                                            onClick={() => handleEdit(card)}
                                            size="sm"
                                            variant="outline"
                                            className="px-3"
                                        >
                                            ✏️
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(card._id || card.id || '')}
                                            size="sm"
                                            variant="outline"
                                            className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            🗑️
                                        </Button>
                                    </div>

                                    <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
                                        <span>Corretas: {card.correctAttempts || 0}</span>
                                        <span>Incorretas: {card.incorrectAttempts || 0}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filteredFlashcards.length === 0 && !isLoading && (
                        <div className="col-span-full text-center py-12">
                            <div className="text-6xl mb-4">🃏</div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {searchTerm || selectedCategory !== 'all' ? 'Nenhum flashcard encontrado' : 'Nenhum flashcard criado ainda'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {searchTerm || selectedCategory !== 'all' 
                                    ? 'Tente ajustar os filtros de busca'
                                    : 'Crie seu primeiro flashcard para começar a estudar'
                                }
                            </p>
                            {!searchTerm && selectedCategory === 'all' && (
                                <Button 
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all font-semibold shadow-lg"
                                >
                                    🚀 Criar Primeiro Flashcard
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
