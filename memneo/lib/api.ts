const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface User {
  id: string;
  name: string;
  email: string;
  curso: string;
  nivel: string;
  accuracy?: number;
  streak?: number;
  totalCards?: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  curso: string;
  nivel: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Flashcard {
  _id?: string;
  id?: string;
  question: string;
  options: string[];
  answer: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  category: string;
  tags?: string[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  totalAttempts?: number;
  correctAttempts?: number;
  incorrectAttempts?: number;
  lastStudied?: string;
  isFavorite?: boolean;
}

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudySession {
  _id?: string;
  id?: string;
  userId: string;
  flashcardId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeSpent: number;
  isCorrect: boolean;
  sessionDate: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalFlashcards: number;
  totalCategories: number;
  todaySessions: number;
  overallAccuracy: number;
  totalSessions: number;
  userStreak?: number;
  userTotalCards?: number;
}

export interface CategoryStats {
  _id: string;
  category: string;
  totalCards: number;
  averageAccuracy: number;
  totalSessions: number;
  totalTimeSpent: number;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('API Call:', url);
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Adicionar token de autenticação se disponível
  const token = localStorage.getItem('authToken');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    console.log('Fazendo requisição para:', url);
    const response = await fetch(url, config);
    console.log('Resposta da API:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log('Dados recebidos da API:', data);
    return data;
  } catch (error) {
    console.error('ERRO CRÍTICO na API - BACKEND DEVE ESTAR FUNCIONANDO:', error);
    console.error('URL tentada:', url);
    console.error('Detalhes do erro:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    // NUNCA USAR DADOS MOCKADOS - SEMPRE CONECTAR AO MONGODB
    throw new ApiError(500, error instanceof Error ? error.message : 'ERRO: Backend MongoDB não disponível - Verifique conexão');
  }
};

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return apiCall<AuthResponse>('/users/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    return apiCall<AuthResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getProfile: async (): Promise<User> => {
    return apiCall<User>('/users/profile');
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    return apiCall<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getStats: async (): Promise<any> => {
    return apiCall<any>('/users/stats');
  },

  // Favoritos
  addToFavorites: async (flashcardId: string): Promise<any> => {
    return apiCall<any>(`/users/favorites/${flashcardId}`, {
      method: 'POST',
    });
  },

  removeFromFavorites: async (flashcardId: string): Promise<any> => {
    return apiCall<any>(`/users/favorites/${flashcardId}`, {
      method: 'DELETE',
    });
  },

  getFavorites: async (): Promise<{flashcards: Flashcard[]}> => {
    return apiCall<{flashcards: Flashcard[]}>('/users/favorites');
  },
};

export const flashcardsApi = {
  getAll: async (params?: { category?: string; difficulty?: string; limit?: number; page?: number }): Promise<Flashcard[]> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    const response = await apiCall<{flashcards: Flashcard[], totalPages: number, currentPage: number, total: number}>(`/flashcards${queryString ? `?${queryString}` : ''}`);
    console.log('API Response:', response);
    // Extrair apenas o array de flashcards da resposta
    return response.flashcards || [];
  },

  getById: async (id: string): Promise<Flashcard> => {
    return apiCall<Flashcard>(`/flashcards/${id}`);
  },

  create: async (data: Omit<Flashcard, '_id' | 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>): Promise<Flashcard> => {
    return apiCall<Flashcard>('/flashcards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Flashcard>): Promise<Flashcard> => {
    return apiCall<Flashcard>(`/flashcards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiCall<void>(`/flashcards/${id}`, {
      method: 'DELETE',
    });
  },

  getRandomForStudy: async (category?: string, difficulty?: string): Promise<Flashcard[]> => {
    const searchParams = new URLSearchParams();
    if (category) searchParams.append('category', category);
    if (difficulty) searchParams.append('difficulty', difficulty);
    const queryString = searchParams.toString();
    return apiCall<Flashcard[]>(`/flashcards/study/random${queryString ? `?${queryString}` : ''}`);
  },
};

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    return apiCall<Category[]>('/categories');
  },

  getById: async (id: string): Promise<Category> => {
    return apiCall<Category>(`/categories/${id}`);
  },

  create: async (data: Omit<Category, '_id' | 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
    return apiCall<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Category>): Promise<Category> => {
    return apiCall<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiCall<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async (id: string): Promise<CategoryStats> => {
    return apiCall<CategoryStats>(`/categories/${id}/stats`);
  },

  getFlashcards: async (id: string): Promise<Flashcard[]> => {
    return apiCall<Flashcard[]>(`/categories/${id}/flashcards`);
  },
};

export const analyticsApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    return apiCall<DashboardStats>('/analytics/dashboard');
  },

  getCategoriesStats: async (): Promise<CategoryStats[]> => {
    return apiCall<CategoryStats[]>('/analytics/categories-stats');
  },

  getMostFrequentSessions: async (): Promise<any[]> => {
    return apiCall<any[]>('/analytics/frequent-sessions');
  },

  getTopUsers: async (): Promise<any[]> => {
    return apiCall<any[]>('/analytics/top-users');
  },

  getMostMissedCards: async (): Promise<any[]> => {
    return apiCall<any[]>('/analytics/most-missed-cards');
  },

  getProgressOverTime: async (): Promise<any[]> => {
    return apiCall<any[]>('/analytics/progress-over-time');
  },

  getUserReport: async (userId: string): Promise<any> => {
    return apiCall<any>(`/analytics/user-report/${userId}`);
  },
};

export const sessionsApi = {
  create: async (data: Omit<StudySession, '_id' | 'id'>): Promise<StudySession> => {
    return apiCall<StudySession>('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getByUser: async (userId?: string): Promise<StudySession[]> => {
    const endpoint = userId ? `/sessions/user/${userId}` : '/sessions/user';
    return apiCall<StudySession[]>(endpoint);
  },
};

// Utilitários para gerenciar autenticação
export const authUtils = {
  setToken: (token: string) => {
    localStorage.setItem('authToken', token);
  },

  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  removeToken: () => {
    localStorage.removeItem('authToken');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: (): User | null => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  removeUser: () => {
    localStorage.removeItem('user');
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

export { ApiError };
