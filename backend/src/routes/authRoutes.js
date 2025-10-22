const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

// Rotas públicas
router.post('/register/user', authController.registerUser);
router.post('/register/company', authController.registerCompany);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Rotas protegidas
router.get('/me', authMiddleware(), authController.me);

module.exports = router;

