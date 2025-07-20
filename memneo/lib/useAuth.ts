'use client';

import { useState, useEffect } from 'react';
import { authUtils, type User } from '@/lib/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authUtils.isAuthenticated();
      const userData = authUtils.getUser();
      
      setIsAuthenticated(authenticated);
      setUser(userData);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    authUtils.setToken(token);
    authUtils.setUser(userData);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authUtils.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData: User) => {
    authUtils.setUser(userData);
    setUser(userData);
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };
}

export default useAuth;
