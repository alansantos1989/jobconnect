const express = require('express');
const router = express.Router();
const lgpdController = require('../controllers/lgpdController');
const { authenticateToken } = require('../middlewares/auth');

// Todas as rotas LGPD requerem autenticação
router.use(authenticateToken);

// Exportar dados pessoais (Art. 18, IV - Portabilidade)
router.get('/export-data', lgpdController.exportUserData);

// Solicitar exclusão de conta (Art. 18, VI - Eliminação)
router.delete('/delete-account', lgpdController.deleteAccount);

// Revogar consentimento (Art. 18, IX - Revogação)
router.post('/revoke-consent', lgpdController.revokeConsent);

// Solicitar correção de dados (Art. 18, III - Correção)
router.post('/request-correction', lgpdController.requestDataCorrection);

module.exports = router;

