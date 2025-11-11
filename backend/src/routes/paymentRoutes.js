const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/auth');

// Rotas protegidas (empresa)
router.post('/create-job-preference', authMiddleware('company'), paymentController.createJobPaymentPreference);
router.post('/create-subscription-preference', authMiddleware('company'), paymentController.createSubscriptionPreference);
router.get('/history', authMiddleware('company'), paymentController.getPaymentHistory);
router.post('/cancel-subscription', authMiddleware('company'), paymentController.cancelSubscription);

// Webhook público (Mercado Pago)
router.post('/webhook', paymentController.webhook);

module.exports = router;

