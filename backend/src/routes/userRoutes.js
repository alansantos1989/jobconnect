const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');
const upload = require('../config/upload');

// Rotas protegidas (usuário)
router.get('/profile', authMiddleware('user'), userController.getProfile);
router.put('/profile', authMiddleware('user'), userController.updateProfile);
router.post('/upload-photo', authMiddleware('user'), upload.single('photo'), userController.uploadPhoto);
router.post('/upload-resume', authMiddleware('user'), upload.single('resume'), userController.uploadResume);

module.exports = router;

