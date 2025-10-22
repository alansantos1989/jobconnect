const { verifyToken } = require('../utils/jwt');

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

module.exports = authMiddleware;

