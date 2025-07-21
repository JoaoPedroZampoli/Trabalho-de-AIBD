const mongoose = require('mongoose');
const User = require('../models/User');
const Flashcard = require('../models/Flashcard');
const Category = require('../models/Category');
const StudySession = require('../models/StudySession');
const Performance = require('../models/Performance');

// Categorias com mais acertos/erros
const getCategoriesStats = async (req, res) => {
    try {
        const categoriesStats = await Category.aggregate([
            {
                $lookup: {
                    from: 'flashcards',
                    localField: '_id',
                    foreignField: 'category',
                    as: 'flashcards'
                }
            },
            {
                $project: {
                    name: 1,
                    color: 1,
                    icon: 1,
                    totalCorrect: 1,
                    totalIncorrect: 1,
                    totalCards: { $size: '$flashcards' },
                    accuracy: {
                        $cond: {
                            if: { $gt: [{ $add: ['$totalCorrect', '$totalIncorrect'] }, 0] },
                            then: {
                                $multiply: [
                                    { $divide: ['$totalCorrect', { $add: ['$totalCorrect', '$totalIncorrect'] }] },
                                    100
                                ]
                            },
                            else: 0
                        }
                    }
                }
            },
            { $sort: { totalCorrect: -1 } }
        ]);

        res.json(categoriesStats);
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao obter estatísticas das categorias',
            error: error.message
        });
    }
};

// Sessões mais frequentes
const getMostFrequentSessions = async (req, res) => {
    try {
        const sessionsStats = await StudySession.aggregate([
            {
                $group: {
                    _id: {
                        user: '$user',
                        category: '$category'
                    },
                    sessionCount: { $sum: 1 },
                    totalTime: { $sum: '$totalTime' },
                    avgAccuracy: { $avg: '$accuracy' },
                    lastSession: { $max: '$createdAt' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id.user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id.category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $unwind: { path: '$category', preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    userName: '$user.name',
                    categoryName: { $ifNull: ['$category.name', 'Geral'] },
                    sessionCount: 1,
                    totalTime: 1,
                    avgAccuracy: { $round: ['$avgAccuracy', 1] },
                    lastSession: 1
                }
            },
            { $sort: { sessionCount: -1 } },
            { $limit: 20 }
        ]);

        res.json(sessionsStats);
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao obter sessões mais frequentes',
            error: error.message
        });
    }
};

// Usuário com melhor taxa de acerto
const getTopAccuracyUsers = async (req, res) => {
    try {
        const topUsers = await User.find()
            .select('name email curso nivel accuracy totalCards totalCorrect streak')
            .sort({ accuracy: -1 })
            .limit(10);

        res.json(topUsers);
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao obter usuários com melhor taxa de acerto',
            error: error.message
        });
    }
};

// Cartões mais errados
const getMostMissedCards = async (req, res) => {
    try {
        const mostMissedCards = await Flashcard.aggregate([
            {
                $match: {
                    totalAttempts: { $gt: 0 }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category'
            },
            {
                $project: {
                    question: 1,
                    answer: 1,
                    difficulty: 1,
                    categoryName: '$category.name',
                    categoryColor: '$category.color',
                    totalAttempts: 1,
                    correctAttempts: 1,
                    incorrectAttempts: 1,
                    errorRate: {
                        $multiply: [
                            { $divide: ['$incorrectAttempts', '$totalAttempts'] },
                            100
                        ]
                    }
                }
            },
            { $sort: { incorrectAttempts: -1, errorRate: -1 } },
            { $limit: 20 }
        ]);

        res.json(mostMissedCards);
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao obter cartões mais errados',
            error: error.message
        });
    }
};

// Progresso ao longo do tempo
const getProgressOverTime = async (req, res) => {
    try {
        const { userId, days = 30 } = req.query;
        
        let matchFilter = {};
        if (userId) {
            matchFilter.user = new mongoose.Types.ObjectId(userId);
        }

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const progressData = await Performance.aggregate([
            {
                $match: {
                    ...matchFilter,
                    date: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$date' }
                    },
                    totalCards: { $sum: '$totalCards' },
                    totalCorrect: { $sum: '$correctAnswers' },
                    avgAccuracy: { $avg: '$accuracy' },
                    totalStudyTime: { $sum: '$studyTime' },
                    usersCount: { $addToSet: '$user' }
                }
            },
            {
                $project: {
                    date: '$_id',
                    totalCards: 1,
                    totalCorrect: 1,
                    avgAccuracy: { $round: ['$avgAccuracy', 1] },
                    totalStudyTime: 1,
                    activeUsers: { $size: '$usersCount' }
                }
            },
            { $sort: { date: 1 } }
        ]);

        res.json(progressData);
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao obter progresso ao longo do tempo',
            error: error.message
        });
    }
};

// Dashboard geral
const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Se o usuário está logado, mostrar dados pessoais, senão dados gerais
        const userId = req.userId;
        
        if (userId) {
            // Estatísticas personalizadas para o usuário logado
            const userStats = await Promise.all([
                User.countDocuments(), // Total de usuários na plataforma
                Flashcard.countDocuments({ createdBy: userId }), // Flashcards criados pelo usuário
                Category.countDocuments(), // Total de categorias
                StudySession.countDocuments({ 
                    user: userId, 
                    createdAt: { $gte: today } 
                }), // Sessões do usuário hoje
                StudySession.aggregate([
                    { $match: { user: new mongoose.Types.ObjectId(userId) } },
                    {
                        $group: {
                            _id: null,
                            avgAccuracy: { $avg: '$accuracy' },
                            totalSessions: { $sum: 1 }
                        }
                    }
                ]),
                User.findById(userId).select('streak totalCards accuracy')
            ]);

            const [totalUsers, userFlashcards, totalCategories, todaySessions, userAccuracyData, userInfo] = userStats;

            res.json({
                totalUsers,
                totalFlashcards: userFlashcards,
                totalCategories,
                todaySessions,
                overallAccuracy: userAccuracyData.length > 0 ? Math.round(userAccuracyData[0].avgAccuracy * 10) / 10 : (userInfo?.accuracy || 0),
                totalSessions: userAccuracyData.length > 0 ? userAccuracyData[0].totalSessions : 0,
                userStreak: userInfo?.streak || 0,
                userTotalCards: userInfo?.totalCards || 0
            });
        } else {
            // Estatísticas gerais da plataforma
            const stats = await Promise.all([
                User.countDocuments(),
                Flashcard.countDocuments(),
                Category.countDocuments(),
                StudySession.countDocuments({ createdAt: { $gte: today } }),
                StudySession.aggregate([
                    {
                        $group: {
                            _id: null,
                            avgAccuracy: { $avg: '$accuracy' },
                            totalSessions: { $sum: 1 }
                        }
                    }
                ])
            ]);

            const [totalUsers, totalFlashcards, totalCategories, todaySessions, accuracyData] = stats;

            res.json({
                totalUsers: Math.max(totalUsers, 1),
                totalFlashcards,
                totalCategories,
                todaySessions,
                overallAccuracy: accuracyData.length > 0 ? Math.round(accuracyData[0].avgAccuracy * 10) / 10 : 0,
                totalSessions: accuracyData.length > 0 ? accuracyData[0].totalSessions : 0
            });
        }
    } catch (error) {
        console.error('Erro em getDashboardStats:', error);
        res.status(500).json({
            message: 'Erro ao obter estatísticas do dashboard',
            error: error.message
        });
    }
};

// Relatório de performance do usuário
const getUserPerformanceReport = async (req, res) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate } = req.query;

        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        }

        const [userStats, recentSessions, categoryPerformance] = await Promise.all([
            User.findById(userId).select('name accuracy streak totalCards totalCorrect'),
            StudySession.find({ user: userId, ...dateFilter })
                .populate('category', 'name color')
                .sort({ createdAt: -1 })
                .limit(10),
            StudySession.aggregate([
                { $match: { user: new mongoose.Types.ObjectId(userId), ...dateFilter } },
                {
                    $group: {
                        _id: '$category',
                        sessionsCount: { $sum: 1 },
                        avgAccuracy: { $avg: '$accuracy' },
                        totalTime: { $sum: '$totalTime' }
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                { $unwind: '$category' },
                {
                    $project: {
                        categoryName: '$category.name',
                        categoryColor: '$category.color',
                        sessionsCount: 1,
                        avgAccuracy: { $round: ['$avgAccuracy', 1] },
                        totalTime: 1
                    }
                }
            ])
        ]);

        res.json({
            userStats,
            recentSessions,
            categoryPerformance
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao obter relatório de performance do usuário',
            error: error.message
        });
    }
};

module.exports = {
    getCategoriesStats,
    getMostFrequentSessions,
    getTopAccuracyUsers,
    getMostMissedCards,
    getProgressOverTime,
    getDashboardStats,
    getUserPerformanceReport
};