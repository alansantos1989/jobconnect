const { verifyToken } = require('../utils/jwt');

// Middleware genérico de autenticação
const authMiddleware = (userType = 'user') => {
  return (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    // Verificar tipo de usuário
    if (userType === 'user' && decoded.type !== 'user') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    if (userType === 'company' && decoded.type !== 'company') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    if (userType === 'admin' && decoded.type !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    req.userId = decoded.id;
    req.userType = decoded.type;
    next();
  };
};

// Middleware para autenticar qualquer tipo de usuário
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }

  req.userId = decoded.id;
  req.userType = decoded.type;
  next();
};

// Middleware para verificar se é admin
const requireAdmin = (req, res, next) => {
  if (req.userType !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

// Middleware para verificar se é empresa
const requireCompany = (req, res, next) => {
  if (req.userType !== 'company') {
    return res.status(403).json({ error: 'Acesso negado. Apenas empresas.' });
  }
  next();
};

// Middleware para verificar se é candidato
const requireUser = (req, res, next) => {
  if (req.userType !== 'user') {
    return res.status(403).json({ error: 'Acesso negado. Apenas candidatos.' });
  }
  next();
};

module.exports = authMiddleware;
module.exports.authenticateToken = authenticateToken;
module.exports.requireAdmin = requireAdmin;
module.exports.requireCompany = requireCompany;
module.exports.requireUser = requireUser;

