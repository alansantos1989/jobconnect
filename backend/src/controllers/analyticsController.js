const prisma = require('../config/database');

// Dashboard geral - métricas principais
exports.getDashboardMetrics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.lte = new Date(endDate);
    }

    // Métricas principais
    const [
      totalUsers,
      totalCompanies,
      totalJobs,
      totalApplications,
      activeJobs,
      newUsersThisMonth,
      newCompaniesThisMonth,
      newJobsThisMonth,
      newApplicationsThisMonth,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.company.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.job.count({ where: { status: 'OPEN' } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(1)), // Primeiro dia do mês
          },
        },
      }),
      prisma.company.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(1)),
          },
        },
      }),
      prisma.job.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(1)),
          },
        },
      }),
      prisma.application.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(1)),
          },
        },
      }),
    ]);

    // Taxa de conversão (candidaturas por vaga)
    const conversionRate = totalJobs > 0 ? (totalApplications / totalJobs).toFixed(2) : 0;

    res.json({
      overview: {
        totalUsers,
        totalCompanies,
        totalJobs,
        totalApplications,
        activeJobs,
        conversionRate,
      },
      thisMonth: {
        newUsers: newUsersThisMonth,
        newCompanies: newCompaniesThisMonth,
        newJobs: newJobsThisMonth,
        newApplications: newApplicationsThisMonth,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar métricas do dashboard:', error);
    res.status(500).json({ error: 'Erro ao buscar métricas' });
  }
};

// Métricas de recrutamento
exports.getRecruitmentMetrics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.lte = new Date(endDate);
    }

    // Time-to-fill: tempo médio para preencher uma vaga (em dias)
    const closedJobs = await prisma.job.findMany({
      where: {
        status: 'CLOSED',
        ...dateFilter,
      },
      select: {
        createdAt: true,
        updatedAt: true,
      },
    });

    const timeToFill = closedJobs.length > 0
      ? closedJobs.reduce((acc, job) => {
          const days = Math.floor((job.updatedAt - job.createdAt) / (1000 * 60 * 60 * 24));
          return acc + days;
        }, 0) / closedJobs.length
      : 0;

    // Time-to-hire: tempo médio da candidatura até a contratação
    const hiredApplications = await prisma.application.findMany({
      where: {
        status: 'HIRED',
        ...dateFilter,
      },
      select: {
        createdAt: true,
        updatedAt: true,
      },
    });

    const timeToHire = hiredApplications.length > 0
      ? hiredApplications.reduce((acc, app) => {
          const days = Math.floor((app.updatedAt - app.createdAt) / (1000 * 60 * 60 * 24));
          return acc + days;
        }, 0) / hiredApplications.length
      : 0;

    // Taxa de aceitação de ofertas
    const totalOffers = await prisma.application.count({
      where: { status: { in: ['HIRED', 'REJECTED'] }, ...dateFilter },
    });
    const acceptedOffers = await prisma.application.count({
      where: { status: 'HIRED', ...dateFilter },
    });
    const offerAcceptanceRate = totalOffers > 0
      ? ((acceptedOffers / totalOffers) * 100).toFixed(2)
      : 0;

    // Candidaturas por status
    const applicationsByStatus = await prisma.application.groupBy({
      by: ['status'],
      where: dateFilter,
      _count: true,
    });

    // Vagas mais populares (mais candidaturas)
    const topJobs = await prisma.job.findMany({
      where: dateFilter,
      select: {
        id: true,
        title: true,
        _count: {
          select: { applications: true },
        },
      },
      orderBy: {
        applications: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    res.json({
      timeToFill: timeToFill.toFixed(1),
      timeToHire: timeToHire.toFixed(1),
      offerAcceptanceRate,
      applicationsByStatus: applicationsByStatus.map(item => ({
        status: item.status,
        count: item._count,
      })),
      topJobs: topJobs.map(job => ({
        id: job.id,
        title: job.title,
        applicationsCount: job._count.applications,
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar métricas de recrutamento:', error);
    res.status(500).json({ error: 'Erro ao buscar métricas de recrutamento' });
  }
};

// Métricas de diversidade
exports.getDiversityMetrics = async (req, res) => {
  try {
    // Distribuição por gênero
    const byGender = await prisma.user.groupBy({
      by: ['gender'],
      _count: true,
      where: {
        gender: { not: null },
      },
    });

    // Distribuição por faixa etária
    const users = await prisma.user.findMany({
      where: {
        birthDate: { not: null },
      },
      select: {
        birthDate: true,
      },
    });

    const ageGroups = {
      '18-24': 0,
      '25-34': 0,
      '35-44': 0,
      '45-54': 0,
      '55+': 0,
    };

    users.forEach(user => {
      const age = Math.floor((new Date() - new Date(user.birthDate)) / (1000 * 60 * 60 * 24 * 365));
      if (age >= 18 && age <= 24) ageGroups['18-24']++;
      else if (age >= 25 && age <= 34) ageGroups['25-34']++;
      else if (age >= 35 && age <= 44) ageGroups['35-44']++;
      else if (age >= 45 && age <= 54) ageGroups['45-54']++;
      else if (age >= 55) ageGroups['55+']++;
    });

    // Distribuição por nível de escolaridade
    const byEducation = await prisma.user.groupBy({
      by: ['educationLevel'],
      _count: true,
      where: {
        educationLevel: { not: null },
      },
    });

    // Distribuição por localização (estado)
    const byState = await prisma.user.groupBy({
      by: ['state'],
      _count: true,
      where: {
        state: { not: null },
      },
      orderBy: {
        _count: {
          state: 'desc',
        },
      },
      take: 10,
    });

    res.json({
      byGender: byGender.map(item => ({
        gender: item.gender,
        count: item._count,
      })),
      byAgeGroup: Object.entries(ageGroups).map(([range, count]) => ({
        range,
        count,
      })),
      byEducation: byEducation.map(item => ({
        level: item.educationLevel,
        count: item._count,
      })),
      byState: byState.map(item => ({
        state: item.state,
        count: item._count,
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar métricas de diversidade:', error);
    res.status(500).json({ error: 'Erro ao buscar métricas de diversidade' });
  }
};

// Métricas de empresas
exports.getCompanyMetrics = async (req, res) => {
  try {
    // Distribuição por porte
    const bySize = await prisma.company.groupBy({
      by: ['companySize'],
      _count: true,
      where: {
        companySize: { not: null },
      },
    });

    // Distribuição por setor
    const bySector = await prisma.company.groupBy({
      by: ['businessSector'],
      _count: true,
      where: {
        businessSector: { not: null },
      },
      orderBy: {
        _count: {
          businessSector: 'desc',
        },
      },
    });

    // Distribuição por plano
    const byPlan = await prisma.company.groupBy({
      by: ['planType'],
      _count: true,
    });

    // Empresas mais ativas (mais vagas publicadas)
    const topCompanies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { jobs: true },
        },
      },
      orderBy: {
        jobs: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    // Taxa de conversão por empresa (candidaturas/vagas)
    const companiesWithMetrics = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            jobs: true,
          },
        },
        jobs: {
          select: {
            _count: {
              select: {
                applications: true,
              },
            },
          },
        },
      },
      take: 20,
    });

    const conversionRates = companiesWithMetrics.map(company => {
      const totalApplications = company.jobs.reduce((sum, job) => sum + job._count.applications, 0);
      const conversionRate = company._count.jobs > 0
        ? (totalApplications / company._count.jobs).toFixed(2)
        : 0;

      return {
        id: company.id,
        name: company.name,
        jobsCount: company._count.jobs,
        applicationsCount: totalApplications,
        conversionRate: parseFloat(conversionRate),
      };
    }).sort((a, b) => b.conversionRate - a.conversionRate);

    res.json({
      bySize: bySize.map(item => ({
        size: item.companySize,
        count: item._count,
      })),
      bySector: bySector.map(item => ({
        sector: item.businessSector,
        count: item._count,
      })),
      byPlan: byPlan.map(item => ({
        plan: item.planType,
        count: item._count,
      })),
      topCompanies: topCompanies.map(company => ({
        id: company.id,
        name: company.name,
        jobsCount: company._count.jobs,
      })),
      conversionRates: conversionRates.slice(0, 10),
    });
  } catch (error) {
    console.error('Erro ao buscar métricas de empresas:', error);
    res.status(500).json({ error: 'Erro ao buscar métricas de empresas' });
  }
};

// Métricas de fonte de candidatos (source effectiveness)
exports.getSourceMetrics = async (req, res) => {
  try {
    // Distribuição por fonte
    const bySource = await prisma.user.groupBy({
      by: ['source'],
      _count: true,
      where: {
        source: { not: null },
      },
      orderBy: {
        _count: {
          source: 'desc',
        },
      },
    });

    // Candidaturas por fonte
    const applicationsBySource = await prisma.user.findMany({
      where: {
        source: { not: null },
      },
      select: {
        source: true,
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    const sourceStats = {};
    applicationsBySource.forEach(user => {
      if (!sourceStats[user.source]) {
        sourceStats[user.source] = {
          users: 0,
          applications: 0,
        };
      }
      sourceStats[user.source].users++;
      sourceStats[user.source].applications += user._count.applications;
    });

    const sourceEffectiveness = Object.entries(sourceStats).map(([source, stats]) => ({
      source,
      usersCount: stats.users,
      applicationsCount: stats.applications,
      avgApplicationsPerUser: (stats.applications / stats.users).toFixed(2),
    })).sort((a, b) => b.applicationsCount - a.applicationsCount);

    res.json({
      bySource: bySource.map(item => ({
        source: item.source,
        count: item._count,
      })),
      sourceEffectiveness,
    });
  } catch (error) {
    console.error('Erro ao buscar métricas de fonte:', error);
    res.status(500).json({ error: 'Erro ao buscar métricas de fonte' });
  }
};

// Tendências temporais (crescimento ao longo do tempo)
exports.getTemporalTrends = async (req, res) => {
  try {
    const { months = 12 } = req.query;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));

    // Usuários por mês
    const usersByMonth = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as count
      FROM users
      WHERE "createdAt" >= ${startDate}
      GROUP BY month
      ORDER BY month ASC
    `;

    // Empresas por mês
    const companiesByMonth = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as count
      FROM companies
      WHERE "createdAt" >= ${startDate}
      GROUP BY month
      ORDER BY month ASC
    `;

    // Vagas por mês
    const jobsByMonth = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as count
      FROM jobs
      WHERE "createdAt" >= ${startDate}
      GROUP BY month
      ORDER BY month ASC
    `;

    // Candidaturas por mês
    const applicationsByMonth = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as count
      FROM applications
      WHERE "createdAt" >= ${startDate}
      GROUP BY month
      ORDER BY month ASC
    `;

    res.json({
      usersByMonth: usersByMonth.map(item => ({
        month: item.month,
        count: Number(item.count),
      })),
      companiesByMonth: companiesByMonth.map(item => ({
        month: item.month,
        count: Number(item.count),
      })),
      jobsByMonth: jobsByMonth.map(item => ({
        month: item.month,
        count: Number(item.count),
      })),
      applicationsByMonth: applicationsByMonth.map(item => ({
        month: item.month,
        count: Number(item.count),
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar tendências temporais:', error);
    res.status(500).json({ error: 'Erro ao buscar tendências temporais' });
  }
};

module.exports = exports;

