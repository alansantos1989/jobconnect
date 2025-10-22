const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middlewares/auth');

// Rotas protegidas (usuário)
router.get('/me', authMiddleware('user'), resumeController.getResume);
router.post('/', authMiddleware('user'), resumeController.upsertResume);

module.exports = router;

