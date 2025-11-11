const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

// Todas as rotas requerem autenticação de admin
router.use(authenticateToken);
router.use(requireAdmin);

// Listar logs com filtros
router.get('/logs', auditController.getLogs);

// Estatísticas de auditoria
router.get('/stats', auditController.getStats);

// Logs de um usuário específico
router.get('/logs/user/:userId', auditController.getUserLogs);

// Limpar logs antigos
router.post('/clean', auditController.cleanOldLogs);

module.exports = router;

