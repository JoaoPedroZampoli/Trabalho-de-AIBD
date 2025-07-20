const express = require('express');
const router = express.Router();
const StudySession = require('../models/StudySession');
const Flashcard = require('../models/Flashcard');
const Category = require('../models/Category');
const User = require('../models/User');
const Performance = require('../models/Performance');
const { auth } = require('../middleware/auth');

// Iniciar nova sessão de estudo
router.post('/start', auth, async (req, res) => {
    try {
        const { categoryId } = req.body;
        
        const session = new StudySession({
            user: req.userId,
            category: categoryId,
            startTime: new Date()
        });

        await session.save();
        await session.populate('category', 'name color');

        res.status(201).json({
            message: 'Sessão de estudo iniciada',
            session
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao iniciar sessão',
            error: error.message
        });
    }
});

// Finalizar sessão de estudo
router.put('/:sessionId/finish', auth, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { answers } = req.body; // Array de respostas

        const session = await StudySession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: 'Sessão não encontrada' });
        }

        if (session.user.toString() !== req.userId) {
            return res.status(403).json({ message: 'Acesso negado' });
        }

        // Processar respostas
        let totalCorrect = 0;
        const processedAnswers = [];

        for (const answer of answers) {
            const flashcard = await Flashcard.findById(answer.flashcardId);
            if (flashcard) {
                const isCorrect = answer.userAnswer === flashcard.answer;
                if (isCorrect) totalCorrect++;

                processedAnswers.push({
                    flashcard: answer.flashcardId,
                    isCorrect,
                    timeTaken: answer.timeTaken || 0,
                    userAnswer: answer.userAnswer
                });

                // Atualizar estatísticas do flashcard
                flashcard.totalAttempts += 1;
                if (isCorrect) {
                    flashcard.correctAttempts += 1;
                } else {
                    flashcard.incorrectAttempts += 1;
                }
                await flashcard.save();
            }
        }

        // Finalizar sessão
        const endTime = new Date();
        const totalTime = Math.round((endTime - session.startTime) / 1000); // em segundos
        const accuracy = answers.length > 0 ? (totalCorrect / answers.length) * 100 : 0;

        session.endTime = endTime;
        session.totalTime = totalTime;
        session.answers = processedAnswers;
        session.totalCorrect = totalCorrect;
        session.accuracy = accuracy;

        await session.save();

        // Atualizar estatísticas do usuário
        const user = await User.findById(req.userId);
        user.totalCards += answers.length;
        user.totalCorrect += totalCorrect;
        user.accuracy = user.totalCards > 0 ? (user.totalCorrect / user.totalCards) * 100 : 0;
        
        // Atualizar streak (exemplo simples)
        const today = new Date().toDateString();
        const lastLogin = user.lastLogin ? user.lastLogin.toDateString() : null;
        if (lastLogin !== today) {
            user.streak += 1;
            user.lastLogin = new Date();
        }
        
        await user.save();

        // Criar/atualizar registro de performance diário
        const today_date = new Date();
        today_date.setHours(0, 0, 0, 0);

        let performance = await Performance.findOne({
            user: req.userId,
            date: today_date
        });

        if (!performance) {
            performance = new Performance({
                user: req.userId,
                date: today_date,
                totalCards: answers.length,
                correctAnswers: totalCorrect,
                accuracy: accuracy,
                studyTime: Math.round(totalTime / 60) // em minutos
            });
        } else {
            performance.totalCards += answers.length;
            performance.correctAnswers += totalCorrect;
            performance.accuracy = performance.totalCards > 0 
                ? (performance.correctAnswers / performance.totalCards) * 100 
                : 0;
            performance.studyTime += Math.round(totalTime / 60);
        }

        await performance.save();

        res.json({
            message: 'Sessão finalizada com sucesso',
            session: {
                id: session._id,
                totalTime,
                totalCorrect,
                totalAnswers: answers.length,
                accuracy: Math.round(accuracy * 10) / 10
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao finalizar sessão',
            error: error.message
        });
    }
});

// Obter sessões do usuário
router.get('/my-sessions', auth, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const sessions = await StudySession.find({ user: req.userId })
            .populate('category', 'name color')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await StudySession.countDocuments({ user: req.userId });

        res.json({
            sessions,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao buscar sessões',
            error: error.message
        });
    }
});

// Obter detalhes de uma sessão
router.get('/:sessionId', auth, async (req, res) => {
    try {
        const session = await StudySession.findById(req.params.sessionId)
            .populate('category', 'name color')
            .populate('answers.flashcard', 'question answer options');

        if (!session) {
            return res.status(404).json({ message: 'Sessão não encontrada' });
        }

        if (session.user.toString() !== req.userId) {
            return res.status(403).json({ message: 'Acesso negado' });
        }

        res.json(session);
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao buscar sessão',
            error: error.message
        });
    }
});

// Obter estatísticas de sessões
router.get('/stats/overview', auth, async (req, res) => {
    try {
        const { days = 7 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const stats = await StudySession.aggregate([
            {
                $match: {
                    user: require('mongoose').Types.ObjectId(req.userId),
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSessions: { $sum: 1 },
                    avgAccuracy: { $avg: '$accuracy' },
                    totalTime: { $sum: '$totalTime' },
                    totalCards: { $sum: { $size: '$answers' } }
                }
            }
        ]);

        const result = stats.length > 0 ? stats[0] : {
            totalSessions: 0,
            avgAccuracy: 0,
            totalTime: 0,
            totalCards: 0
        };

        res.json({
            totalSessions: result.totalSessions,
            avgAccuracy: Math.round(result.avgAccuracy * 10) / 10,
            totalTime: Math.round(result.totalTime / 60), // em minutos
            totalCards: result.totalCards
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao obter estatísticas',
            error: error.message
        });
    }
});

// Deletar sessão
router.delete('/:sessionId', auth, async (req, res) => {
    try {
        const session = await StudySession.findById(req.params.sessionId);
        
        if (!session) {
            return res.status(404).json({ message: 'Sessão não encontrada' });
        }

        if (session.user.toString() !== req.userId) {
            return res.status(403).json({ message: 'Acesso negado' });
        }

        await StudySession.findByIdAndDelete(req.params.sessionId);
        res.json({ message: 'Sessão deletada com sucesso' });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao deletar sessão',
            error: error.message
        });
    }
});

module.exports = router;