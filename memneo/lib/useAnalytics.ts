import { useState, useCallback } from 'react';
import { analyticsApi, DashboardStats } from './api';
import toast from 'react-hot-toast';

export const useAnalytics = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const stats = await analyticsApi.getDashboardStats();
      setDashboardStats(stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar estatísticas';
      setError(errorMessage);
      // Não mostrar toast de erro para analytics, apenas logs
      console.warn('Analytics error:', errorMessage);
      setDashboardStats(null);
    } finally {
      setIsLoading(false);
    }
  }, []); // Array de dependências vazio

  return {
    dashboardStats,
    isLoading,
    error,
    loadDashboardStats
  };
};