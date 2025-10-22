const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/auth');

// Todas as rotas protegidas (admin)
router.get('/stats', authMiddleware('admin'), adminController.getStats);
router.get('/users', authMiddleware('admin'), adminController.getUsers);
router.get('/companies', authMiddleware('admin'), adminController.getCompanies);
router.get('/jobs', authMiddleware('admin'), adminController.getJobs);
router.get('/payments', authMiddleware('admin'), adminController.getPayments);
router.delete('/users/:id', authMiddleware('admin'), adminController.deleteUser);
router.delete('/companies/:id', authMiddleware('admin'), adminController.deleteCompany);
router.delete('/jobs/:id', authMiddleware('admin'), adminController.deleteJob);

module.exports = router;

