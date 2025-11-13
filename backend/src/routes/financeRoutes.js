const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

// Todas as rotas requerem autenticação de admin
router.use(authenticateToken);
router.use(isAdmin);

// Dashboard financeiro geral
router.get('/dashboard', financeController.getFinancialDashboard);

// Listar transações com filtros
router.get('/transactions', financeController.getTransactions);

// Receita por período (para gráficos)
router.get('/revenue/period', financeController.getRevenueByPeriod);

// Distribuição de receita por plano
router.get('/revenue/plan', financeController.getRevenueByPlan);

// Métodos de pagamento
router.get('/payment-methods', financeController.getPaymentMethods);

module.exports = router;

