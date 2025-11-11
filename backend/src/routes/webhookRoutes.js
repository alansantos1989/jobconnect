const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Rota para receber webhooks do Mercado Pago
// IMPORTANTE: Não usar middleware de autenticação aqui
router.post('/mercadopago', webhookController.processWebhook);

module.exports = router;

