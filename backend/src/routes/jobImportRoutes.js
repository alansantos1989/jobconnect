const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jobImportController = require('../controllers/jobImportController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

// Configurar multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/temp/');
  },
  filename: function (req, file, cb) {
    cb(null, `import-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (path.extname(file.originalname).toLowerCase() !== '.csv') {
      return cb(new Error('Apenas arquivos CSV são permitidos'));
    }
    cb(null, true);
  }
});

// Todas as rotas requerem autenticação de admin
router.use(authenticateToken);
router.use(isAdmin);

// Importar vagas de CSV
router.post('/import', upload.single('file'), jobImportController.importJobsFromCSV);

// Obter estatísticas
router.get('/stats', jobImportController.getImportStats);

module.exports = router;

