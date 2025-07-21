import { useState, useCallback } from 'react';
import { sessionsApi, authUtils } from './api';
import toast from 'react-hot-toast';

interface SessionAnswer {
  flashcardId: string;
  userAnswer: string;
  timeTaken?: number;
}

interface StudySessionData {
  userId: string;
  flashcardId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeSpent: number;
  isCorrect: boolean;
  sessionDate: string;
}

export const useSessions = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createStudySession = useCallback(async (sessionData: Omit<StudySessionData, 'userId'>) => {
    if (!authUtils.isAuthenticated()) {
      toast.error('Você precisa estar logado para salvar sessões');
      return;
    }

    try {
      const user = authUtils.getUser();
      if (!user) throw new Error('Usuário não encontrado');

      const session = await sessionsApi.create({
        ...sessionData,
        userId: user.id
      });

      console.log('Sessão criada com sucesso:', session);
      return session;
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      toast.error('Erro ao salvar sessão de estudo');
      throw error;
    }
  }, []);

  const saveStudySession = useCallback(async (answers: SessionAnswer[], startTime: Date) => {
    if (!authUtils.isAuthenticated()) {
      toast.error('Você precisa estar logado para salvar sessões');
      return;
    }

    if (answers.length === 0) {
      console.log('Nenhuma resposta para salvar');
      return;
    }

    setIsLoading(true);
    
    try {
      const endTime = new Date();
      const totalTimeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 1000); // em segundos
      const timePerCard = Math.round(totalTimeSpent / answers.length);

      // Criar uma sessão para cada resposta
      const sessionPromises = answers.map(answer => 
        createStudySession({
          flashcardId: answer.flashcardId,
          difficulty: 'medium', // Pode ser ajustado baseado na dificuldade do card
          timeSpent: answer.timeTaken || timePerCard,
          isCorrect: answer.userAnswer === answer.userAnswer, // Será calculado no backend
          sessionDate: new Date().toISOString()
        })
      );

      await Promise.all(sessionPromises);
      
      console.log(`${answers.length} sessões salvas com sucesso`);
      toast.success('Sessão de estudo salva com sucesso!');
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar sessão de estudo:', error);
      toast.error('Erro ao salvar sessão de estudo');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [createStudySession]);

  // Versão simplificada que usa a API de finalização de sessão do backend
  const finishStudySession = useCallback(async (answers: any[], startTime: Date) => {
    console.log('finishStudySession chamada com:', { answers, startTime });
    
    if (!authUtils.isAuthenticated()) {
      toast.error('Você precisa estar logado para finalizar sessões');
      return;
    }

    if (answers.length === 0) {
      console.log('Nenhuma resposta para finalizar');
      return;
    }

    setIsLoading(true);
    
    try {
      // Formatar as respostas para o formato esperado pelo backend
      const formattedAnswers = answers.map(answer => ({
        flashcardId: answer.flashcardId,
        userAnswer: answer.userAnswer,
        timeTaken: answer.timeTaken || 0
      }));

      console.log('Fazendo requisição para:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/sessions/finish-study`);
      console.log('Com dados:', {
        answers: formattedAnswers,
        startTime: startTime.toISOString(),
        endTime: new Date().toISOString()
      });

      // Usar a rota de finalização de sessão que já existe no backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/sessions/finish-study`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authUtils.getToken()}`
        },
        body: JSON.stringify({
          answers: formattedAnswers,
          startTime: startTime.toISOString(),
          endTime: new Date().toISOString()
        })
      });

      console.log('Resposta recebida:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta do servidor:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Sessão finalizada com sucesso:', result);
      toast.success('Sessão de estudo salva com sucesso!');
      
      return result;
    } catch (error) {
      console.error('Erro ao finalizar sessão de estudo:', error);
      toast.error('Erro ao salvar sessão de estudo');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    saveStudySession,
    finishStudySession,
    createStudySession
  };
};
