const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

// Todas as rotas requerem autenticação de admin
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard geral
router.get('/dashboard', analyticsController.getDashboardMetrics);

// Métricas de recrutamento
router.get('/recruitment', analyticsController.getRecruitmentMetrics);

// Métricas de diversidade
router.get('/diversity', analyticsController.getDiversityMetrics);

// Métricas de empresas
router.get('/companies', analyticsController.getCompanyMetrics);

// Métricas de fonte de candidatos
router.get('/sources', analyticsController.getSourceMetrics);

// Tendências temporais
router.get('/trends', analyticsController.getTemporalTrends);

module.exports = router;

