const express = require('express');
const router = express.Router();
const {
    getCategoriesStats,
    getMostFrequentSessions,
    getTopAccuracyUsers,
    getMostMissedCards,
    getProgressOverTime,
    getDashboardStats,
    getUserPerformanceReport
} = require('../controller/analyticsController');
const { auth } = require('../middleware/auth');

// Dashboard geral
router.get('/dashboard', getDashboardStats);

// Categorias com mais acertos/erros
router.get('/categories-stats', getCategoriesStats);

// Sessões mais frequentes
router.get('/frequent-sessions', getMostFrequentSessions);

// Usuários com melhor taxa de acerto
router.get('/top-users', getTopAccuracyUsers);

// Cartões mais errados
router.get('/most-missed-cards', getMostMissedCards);

// Progresso ao longo do tempo
router.get('/progress-over-time', getProgressOverTime);

// Relatório de performance do usuário
router.get('/user-report/:userId', auth, getUserPerformanceReport);

module.exports = router;