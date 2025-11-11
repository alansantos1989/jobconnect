const prisma = require('../config/database');

// Listar logs de auditoria com filtros
exports.getLogs = async (req, res) => {
  try {
    const {
      userId,
      userType,
      action,
      entityType,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = req.query;

    const where = {};

    if (userId) where.userId = userId;
    if (userType) where.userType = userType;
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip,
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    res.status(500).json({ error: 'Erro ao buscar logs de auditoria' });
  }
};

// Obter estatísticas de auditoria
exports.getStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Total de logs
    const totalLogs = await prisma.auditLog.count({ where });

    // Logs por ação
    const logsByAction = await prisma.auditLog.groupBy({
      by: ['action'],
      where,
      _count: true,
      orderBy: { _count: { action: 'desc' } },
    });

    // Logs por tipo de entidade
    const logsByEntityType = await prisma.auditLog.groupBy({
      by: ['entityType'],
      where,
      _count: true,
      orderBy: { _count: { entityType: 'desc' } },
    });

    // Logs por tipo de usuário
    const logsByUserType = await prisma.auditLog.groupBy({
      by: ['userType'],
      where,
      _count: true,
      orderBy: { _count: { userType: 'desc' } },
    });

    // Usuários mais ativos
    const topUsers = await prisma.auditLog.groupBy({
      by: ['userId'],
      where: { ...where, userId: { not: null } },
      _count: true,
      orderBy: { _count: { userId: 'desc' } },
      take: 10,
    });

    res.json({
      totalLogs,
      logsByAction: logsByAction.map(item => ({
        action: item.action,
        count: item._count,
      })),
      logsByEntityType: logsByEntityType.map(item => ({
        entityType: item.entityType,
        count: item._count,
      })),
      logsByUserType: logsByUserType.map(item => ({
        userType: item.userType,
        count: item._count,
      })),
      topUsers: topUsers.map(item => ({
        userId: item.userId,
        count: item._count,
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas de auditoria' });
  }
};

// Obter logs de um usuário específico
exports.getUserLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip,
      }),
      prisma.auditLog.count({ where: { userId } }),
    ]);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar logs do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar logs do usuário' });
  }
};

// Limpar logs antigos (manutenção)
exports.cleanOldLogs = async (req, res) => {
  try {
    const { daysToKeep = 90 } = req.body;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(daysToKeep));

    const result = await prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    res.json({
      message: `Logs anteriores a ${cutoffDate.toISOString()} foram removidos`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error('Erro ao limpar logs:', error);
    res.status(500).json({ error: 'Erro ao limpar logs antigos' });
  }
};

module.exports = exports;

