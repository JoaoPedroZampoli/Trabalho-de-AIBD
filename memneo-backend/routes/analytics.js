const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Flashcard = require('../models/Flashcard');
const Category = require('../models/Category');
const StudySession = require('../models/StudySession');
const Performance = require('../models/Performance');

router.get('/dashboard', async (req, res) => {
    try {
        const totalCards = await Flashcard.countDocuments();
        const totalUsers = await User.countDocuments();
        const todaySessions = await StudySession.countDocuments({
            createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        });
        const totalCategories = await Category.countDocuments();
        const accuracyData = await StudySession.aggregate([
            {
                $group: {
                    _id: null,
                    avgAccuracy: { $avg: '$accuracy' },
                    totalSessions: { $sum: 1 }
                }
            }
        ]);

        res.json({
            totalCards,
            totalUsers,
            todaySessions,
            overallAccuracy: accuracyData.length > 0 ? accuracyData[0].avgAccuracy : 0,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching dashboard data",
            error: error.message
        });
    }
});

router.get('/topUsers', async (req, res) => {
    try {
        const topUsers = await User.find()
            .sort({ accuracy: -1 })
            .limit(10)
            .select('name accuracy totalCards streak');

        res.json(topUsers);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching top users",
            error: error.message
        });
    }
});

router.get('/mostMissedCards', async (req, res) => {
    try {
        const mostMissed = await Flashcard.find()
            .sort({ incorrectCount: -1 })
            .limit(10)
            .populate('category', 'name')

        res.json(mostMissed);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching most missed cards",
            error: error.message
        });
    }
});

router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find()
            .select('name color totalCorrect totalIncorrect')
        
        const categoryStats = categories.map(cat => ({
            id: cat._id,
            name: cat.name,
            color: cat.color,
            totalCorrect: cat.totalCorrect,
            totalIncorrect: cat.totalIncorrect,
            totalCards: cat.totalCorrect + cat.totalIncorrect,
            accuracy: cat.accuracy
        }));

        res.json(categoryStats);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching category statistics",
            error: error.message
        });
    }
});

router.get('/progress/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const sevenDaysAgo = new Date().setDate(new Date().getDate() - 7);
        const progressData = await Performance.find({
            user: userId,
            date: { $gte: sevenDaysAgo }
        }).sort({ date: -1 });

        res.json(progressData);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching user progress",
            error: error.message
        });
    }
});


router.get('/recentSessions', async (req, res) => {
    try {
        const sessions = await StudySession.find()
            .populate('user', 'name')
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .limit(20);

        const sessionData = sessions.map(session => ({
            id: session._id,
            user: session.user.name,
            category: session.category ? session.category.name : 'All',
            date: session.createdAt.toISOString().split('T')[0],
            duration: session.duration,
            cards: session.totalCards,
            accuracy: session.accuracy
        }));

        res.json(sessionData);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching recent sessions",
            error: error.message
        });
    }
});

module.exports = router;