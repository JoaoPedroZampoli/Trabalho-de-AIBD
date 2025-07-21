import { useState, useCallback } from 'react';
import { categoriesApi, Category } from './api';
import toast from 'react-hot-toast';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await categoriesApi.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar categorias';
      setError(errorMessage);
      toast.error(errorMessage);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // Array de dependências vazio

  const createCategory = useCallback(async (category: Omit<Category, '_id'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newCategory = await categoriesApi.create(category);
      setCategories(prev => [...prev, newCategory]);
      toast.success('Categoria criada com sucesso!');
      return newCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar categoria';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedCategory = await categoriesApi.update(id, updates);
      setCategories(prev => prev.map(cat => 
        cat._id === id ? updatedCategory : cat
      ));
      toast.success('Categoria atualizada com sucesso!');
      return updatedCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar categoria';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await categoriesApi.delete(id);
      setCategories(prev => prev.filter(cat => cat._id !== id));
      toast.success('Categoria deletada com sucesso!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar categoria';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    categories,
    isLoading,
    error,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
};