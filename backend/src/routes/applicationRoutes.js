const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middlewares/auth');

// Rotas do candidato
router.post('/', authMiddleware('user'), applicationController.applyToJob);
router.get('/user', authMiddleware('user'), applicationController.getUserApplications);

// Rotas da empresa
router.get('/company', authMiddleware('company'), applicationController.getCompanyApplications);
router.get('/job/:jobId', authMiddleware('company'), applicationController.getJobApplications);
router.put('/:id/status', authMiddleware('company'), applicationController.updateApplicationStatus);

module.exports = router;

