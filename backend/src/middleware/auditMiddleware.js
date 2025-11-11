const prisma = require('../config/database');

// Middleware para registrar ações de auditoria
const auditLog = (action, entityType) => {
  return async (req, res, next) => {
    // Armazena a função original de res.json
    const originalJson = res.json.bind(res);

    // Sobrescreve res.json para capturar a resposta
    res.json = function (data) {
      // Só registra se a operação foi bem-sucedida (status 2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Registra o log de auditoria de forma assíncrona
        setImmediate(async () => {
          try {
            const userId = req.userId || null;
            const userType = req.userType || 'unknown';
            const ipAddress = req.ip || req.connection.remoteAddress;
            const userAgent = req.get('user-agent') || 'unknown';

            // Extrai informações relevantes do request
            const metadata = {
              method: req.method,
              path: req.path,
              query: req.query,
              body: sanitizeBody(req.body),
              params: req.params,
            };

            // Extrai ID da entidade se disponível
            let entityId = null;
            if (data && typeof data === 'object') {
              entityId = data.id || data.user?.id || data.company?.id || data.job?.id || null;
            }

            await prisma.auditLog.create({
              data: {
                userId,
                userType,
                action,
                entityType,
                entityId,
                ipAddress,
                userAgent,
                metadata,
              },
            });
          } catch (error) {
            console.error('Erro ao registrar log de auditoria:', error);
            // Não falha a requisição se o log falhar
          }
        });
      }

      // Chama a função original
      return originalJson(data);
    };

    next();
  };
};

// Remove informações sensíveis do body antes de salvar
function sanitizeBody(body) {
  if (!body || typeof body !== 'object') return body;

  const sanitized = { ...body };
  
  // Remove campos sensíveis
  delete sanitized.password;
  delete sanitized.token;
  delete sanitized.accessToken;
  delete sanitized.refreshToken;
  
  return sanitized;
}

module.exports = auditLog;

