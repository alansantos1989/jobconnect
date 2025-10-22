const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middlewares/auth');

// Rotas públicas
router.get('/', jobController.listJobs);
router.get('/:id', jobController.getJob);

// Rotas protegidas (empresa)
router.post('/', authMiddleware('company'), jobController.createJob);
router.put('/:id', authMiddleware('company'), jobController.updateJob);
router.delete('/:id', authMiddleware('company'), jobController.deleteJob);
router.get('/company/my-jobs', authMiddleware('company'), jobController.getCompanyJobs);

module.exports = router;

