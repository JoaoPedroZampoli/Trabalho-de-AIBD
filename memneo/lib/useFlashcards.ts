import { useState, useCallback } from 'react';
import { flashcardsApi, Flashcard } from './api';
import toast from 'react-hot-toast';

export const useFlashcards = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFlashcards = useCallback(async (params?: { 
    category?: string; 
    difficulty?: string; 
    limit?: number; 
  }) => {
    console.log('useFlashcards: Iniciando carregamento dos flashcards...');
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('useFlashcards: Fazendo chamada para flashcardsApi.getAll...');
      const data = await flashcardsApi.getAll(params);
      console.log('useFlashcards: Dados recebidos:', data);
      setFlashcards(Array.isArray(data) ? data : []);
      console.log('useFlashcards: Flashcards salvos no estado:', Array.isArray(data) ? data.length : 0);
    } catch (err) {
      console.error('useFlashcards: Erro ao carregar flashcards:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar flashcards';
      setError(errorMessage);
      toast.error(errorMessage);
      setFlashcards([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // Array de dependências vazio - a função só é recriada se necessário

  const createFlashcard = useCallback(async (flashcard: Omit<Flashcard, '_id'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newFlashcard = await flashcardsApi.create(flashcard);
      setFlashcards(prev => [...prev, newFlashcard]);
      toast.success('Flashcard criado com sucesso!');
      return newFlashcard;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar flashcard';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateFlashcard = useCallback(async (id: string, updates: Partial<Flashcard>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedFlashcard = await flashcardsApi.update(id, updates);
      setFlashcards(prev => prev.map(card => 
        card._id === id ? updatedFlashcard : card
      ));
      toast.success('Flashcard atualizado com sucesso!');
      return updatedFlashcard;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar flashcard';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteFlashcard = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await flashcardsApi.delete(id);
      setFlashcards(prev => prev.filter(card => card._id !== id));
      toast.success('Flashcard deletado com sucesso!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar flashcard';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    flashcards,
    isLoading,
    error,
    loadFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard
  };
};
