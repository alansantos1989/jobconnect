const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middlewares/auth');
const upload = require('../config/upload');

// Rotas protegidas (empresa)
router.get('/profile', authMiddleware('company'), companyController.getProfile);
router.put('/profile', authMiddleware('company'), companyController.updateProfile);
router.post('/upload-logo', authMiddleware('company'), upload.single('logo'), companyController.uploadLogo);
router.get('/stats', authMiddleware('company'), companyController.getStats);

module.exports = router;

