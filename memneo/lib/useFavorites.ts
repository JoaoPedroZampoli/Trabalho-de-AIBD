import { useState, useCallback, useEffect } from 'react';
import { authApi, authUtils, Flashcard } from './api';
import toast from 'react-hot-toast';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    // Verificar se o usuário está logado
    if (!authUtils.isAuthenticated()) {
      console.log('useFavorites: Usuário não está logado, não carregando favoritos');
      setFavorites([]);
      return;
    }

    console.log('useFavorites: Carregando favoritos...');
    setIsLoading(true);
    
    try {
      const response = await authApi.getFavorites();
      console.log('useFavorites: Favoritos recebidos:', response);
      setFavorites(response.flashcards || []);
    } catch (err: any) {
      console.error('useFavorites: Erro ao carregar favoritos:', err);
      // Não mostrar erro se for problema de autenticação
      if (err?.response?.status === 401 || (err instanceof Error && err.message.includes('401'))) {
        console.log('useFavorites: Usuário não autenticado');
        setFavorites([]);
      } else {
        console.error('useFavorites: Erro real ao carregar favoritos:', err);
        toast.error('Erro ao carregar favoritos');
        setFavorites([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar favoritos automaticamente quando o hook é inicializado
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const addToFavorites = useCallback(async (flashcardId: string) => {
    if (!authUtils.isAuthenticated()) {
      toast.error('Você precisa estar logado para favoritar flashcards');
      return;
    }

    console.log('useFavorites: Adicionando aos favoritos:', flashcardId);
    setIsLoading(true);
    
    try {
      await authApi.addToFavorites(flashcardId);
      toast.success('Adicionado aos favoritos!');
      // Recarregar a lista de favoritos
      await loadFavorites();
    } catch (err: any) {
      console.error('useFavorites: Erro ao adicionar favorito:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Erro ao adicionar aos favoritos';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [loadFavorites]);

  const removeFromFavorites = useCallback(async (flashcardId: string) => {
    if (!authUtils.isAuthenticated()) {
      toast.error('Você precisa estar logado para gerenciar favoritos');
      return;
    }

    console.log('useFavorites: Removendo dos favoritos:', flashcardId);
    setIsLoading(true);
    
    try {
      await authApi.removeFromFavorites(flashcardId);
      toast.success('Removido dos favoritos!');
      // Recarregar a lista de favoritos
      await loadFavorites();
    } catch (err: any) {
      console.error('useFavorites: Erro ao remover favorito:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Erro ao remover dos favoritos';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [loadFavorites]);

  const isFavorite = useCallback((flashcardId: string) => {
    const result = favorites.some(fav => {
      const favId = fav._id || fav.id;
      const cleanFlashcardId = flashcardId?.toString();
      const cleanFavId = favId?.toString();
      return cleanFavId === cleanFlashcardId;
    });
    console.log(`useFavorites: isFavorite(${flashcardId}) = ${result}`);
    console.log('useFavorites: Lista de favoritos para comparação:', favorites.map(f => f._id || f.id));
    return result;
  }, [favorites]);

  return {
    favorites,
    loadFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    isLoading
  };
};
