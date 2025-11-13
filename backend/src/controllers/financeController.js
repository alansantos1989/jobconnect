const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Dashboard financeiro geral
exports.getFinancialDashboard = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;

    // Total de receita
    const totalRevenue = await prisma.payment.aggregate({
      where: {
        status: 'approved',
        ...(dateFrom && dateTo && {
          createdAt: {
            gte: new Date(dateFrom),
            lte: new Date(dateTo)
          }
        })
      },
      _sum: {
        amount: true
      }
    });

    // Receita mensal (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthlyRevenue = await prisma.payment.aggregate({
      where: {
        status: 'approved',
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      _sum: {
        amount: true
      }
    });

    // Assinaturas ativas
    const activeSubscriptions = await prisma.company.count({
      where: {
        plan: {
          in: ['PRO', 'ENTERPRISE']
        }
      }
    });

    // Ticket médio
    const averageTicket = await prisma.payment.aggregate({
      where: {
        status: 'approved'
      },
      _avg: {
        amount: true
      }
    });

    // MRR (Monthly Recurring Revenue)
    const proSubscriptions = await prisma.company.count({
      where: { plan: 'PRO' }
    });

    const enterpriseSubscriptions = await prisma.company.count({
      where: { plan: 'ENTERPRISE' }
    });

    const mrr = (proSubscriptions * 99.90) + (enterpriseSubscriptions * 299.90);
    const arr = mrr * 12;

    // Taxa de churn (últimos 30 dias)
    const canceledSubscriptions = await prisma.company.count({
      where: {
        plan: 'FREE',
        updatedAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    const churnRate = activeSubscriptions > 0 
      ? ((canceledSubscriptions / activeSubscriptions) * 100).toFixed(2)
      : 0;

    // LTV (Lifetime Value) - estimativa simples
    const ltv = averageTicket._avg.amount ? averageTicket._avg.amount * 12 : 0;

    res.json({
      totalRevenue: totalRevenue._sum.amount || 0,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      activeSubscriptions,
      averageTicket: averageTicket._avg.amount || 0,
      mrr,
      arr,
      ltv,
      churnRate: parseFloat(churnRate)
    });

  } catch (error) {
    console.error('Erro ao buscar dashboard financeiro:', error);
    res.status(500).json({ error: 'Erro ao buscar dados financeiros' });
  }
};

// Listar todas as transações com filtros
exports.getTransactions = async (req, res) => {
  try {
    const {
      dateFrom,
      dateTo,
      status,
      paymentMethod,
      plan,
      searchTerm,
      page = 1,
      limit = 10
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ...(dateFrom && dateTo && {
        createdAt: {
          gte: new Date(dateFrom),
          lte: new Date(dateTo)
        }
      }),
      ...(status && status !== 'all' && { status }),
      ...(paymentMethod && paymentMethod !== 'all' && { paymentMethod }),
      ...(searchTerm && {
        OR: [
          { id: { contains: searchTerm } },
          { company: { name: { contains: searchTerm } } }
        ]
      })
    };

    const [transactions, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          company: {
            select: {
              name: true,
              plan: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: parseInt(limit)
      }),
      prisma.payment.count({ where })
    ]);

    res.json({
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
};

// Receita por período (para gráficos)
exports.getRevenueByPeriod = async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    let groupBy;
    let dateRange;

    switch (period) {
      case 'day':
        dateRange = new Date();
        dateRange.setDate(dateRange.getDate() - 30);
        break;
      case 'month':
        dateRange = new Date();
        dateRange.setMonth(dateRange.getMonth() - 12);
        break;
      case 'year':
        dateRange = new Date();
        dateRange.setFullYear(dateRange.getFullYear() - 5);
        break;
      default:
        dateRange = new Date();
        dateRange.setMonth(dateRange.getMonth() - 12);
    }

    const payments = await prisma.payment.findMany({
      where: {
        status: 'approved',
        createdAt: {
          gte: dateRange
        }
      },
      select: {
        amount: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Agrupar por período
    const revenueByPeriod = {};
    payments.forEach(payment => {
      const date = new Date(payment.createdAt);
      let key;

      if (period === 'day') {
        key = date.toISOString().split('T')[0];
      } else if (period === 'month') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else {
        key = date.getFullYear().toString();
      }

      if (!revenueByPeriod[key]) {
        revenueByPeriod[key] = 0;
      }
      revenueByPeriod[key] += payment.amount;
    });

    const result = Object.entries(revenueByPeriod).map(([period, revenue]) => ({
      period,
      revenue
    }));

    res.json(result);

  } catch (error) {
    console.error('Erro ao buscar receita por período:', error);
    res.status(500).json({ error: 'Erro ao buscar receita por período' });
  }
};

// Distribuição de receita por plano
exports.getRevenueByPlan = async (req, res) => {
  try {
    const revenueByPlan = await prisma.payment.groupBy({
      by: ['companyId'],
      where: {
        status: 'approved'
      },
      _sum: {
        amount: true
      }
    });

    // Buscar planos das empresas
    const companyIds = revenueByPlan.map(r => r.companyId);
    const companies = await prisma.company.findMany({
      where: {
        id: {
          in: companyIds
        }
      },
      select: {
        id: true,
        plan: true
      }
    });

    const planMap = {};
    companies.forEach(company => {
      planMap[company.id] = company.plan;
    });

    // Agrupar por plano
    const result = {
      FREE: 0,
      PRO: 0,
      ENTERPRISE: 0
    };

    revenueByPlan.forEach(item => {
      const plan = planMap[item.companyId] || 'FREE';
      result[plan] += item._sum.amount || 0;
    });

    res.json(result);

  } catch (error) {
    console.error('Erro ao buscar receita por plano:', error);
    res.status(500).json({ error: 'Erro ao buscar receita por plano' });
  }
};

// Métodos de pagamento mais usados
exports.getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await prisma.payment.groupBy({
      by: ['paymentMethod'],
      where: {
        status: 'approved'
      },
      _count: {
        id: true
      },
      _sum: {
        amount: true
      }
    });

    const result = paymentMethods.map(method => ({
      method: method.paymentMethod,
      count: method._count.id,
      revenue: method._sum.amount || 0
    }));

    res.json(result);

  } catch (error) {
    console.error('Erro ao buscar métodos de pagamento:', error);
    res.status(500).json({ error: 'Erro ao buscar métodos de pagamento' });
  }
};

module.exports = exports;

