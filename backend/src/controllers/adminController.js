const prisma = require('../config/database');

// Dashboard - Estatísticas gerais
exports.getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCompanies,
      totalJobs,
      totalApplications,
      totalRevenue,
      newUsersLast30Days,
      newCompaniesLast30Days,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.company.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.payment.aggregate({
        where: { status: 'approved' },
        _sum: { amount: true },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.company.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    res.json({
      stats: {
        totalUsers,
        totalCompanies,
        totalJobs,
        totalApplications,
        totalRevenue: totalRevenue._sum.amount || 0,
        newUsersLast30Days,
        newCompaniesLast30Days,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};

// Listar todos os usuários
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          createdAt: true,
          _count: {
            select: {
              applications: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.user.count(),
    ]);

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

// Listar todas as empresas
exports.getCompanies = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          cnpj: true,
          planType: true,
          subscriptionStatus: true,
          createdAt: true,
          _count: {
            select: {
              jobs: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.company.count(),
    ]);

    res.json({
      companies,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    res.status(500).json({ error: 'Erro ao listar empresas' });
  }
};

// Listar todas as vagas
exports.getJobs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.job.count(),
    ]);

    res.json({
      jobs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Erro ao listar vagas:', error);
    res.status(500).json({ error: 'Erro ao listar vagas' });
  }
};

// Listar todos os pagamentos
exports.getPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
          job: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.payment.count(),
    ]);

    res.json({
      payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Erro ao listar pagamentos:', error);
    res.status(500).json({ error: 'Erro ao listar pagamentos' });
  }
};

// Deletar usuário
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};

// Deletar empresa
exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.company.delete({
      where: { id },
    });

    res.json({ message: 'Empresa deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar empresa:', error);
    res.status(500).json({ error: 'Erro ao deletar empresa' });
  }
};

// Deletar vaga
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.job.delete({
      where: { id },
    });

    res.json({ message: 'Vaga deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar vaga:', error);
    res.status(500).json({ error: 'Erro ao deletar vaga' });
  }
};



// Atualizar status da vaga
exports.updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const job = await prisma.job.update({
      where: { id },
      data: { status }
    });

    res.json({ message: 'Status atualizado com sucesso', job });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
};

// Atualizar plano da empresa
exports.updateCompanyPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { planType } = req.body;

    const company = await prisma.company.update({
      where: { id },
      data: { planType }
    });

    res.json({ message: 'Plano atualizado com sucesso', company });
  } catch (error) {
    console.error('Erro ao atualizar plano:', error);
    res.status(500).json({ error: 'Erro ao atualizar plano' });
  }
};



// Criar vaga como administrador
exports.createJob = async (req, res) => {
  try {
    const {
      companyId,
      title,
      description,
      requirements,
      location,
      remote,
      salary,
      benefits,
      externalUrl
    } = req.body;

    // Validar campos obrigatórios
    if (!companyId || !title || !description || !location) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    // Verificar se a empresa existe
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    // Criar vaga
    const job = await prisma.job.create({
      data: {
        companyId,
        title,
        description,
        requirements: requirements || null,
        location,
        remote: remote || false,
        salary: salary || null,
        benefits: benefits || null,
        externalUrl: externalUrl || null,
        status: 'ACTIVE'
      },
      include: {
        company: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json({ message: 'Vaga criada com sucesso', job });
  } catch (error) {
    console.error('Erro ao criar vaga:', error);
    res.status(500).json({ error: 'Erro ao criar vaga' });
  }
};

// Criar múltiplas vagas em massa
exports.createJobsBulk = async (req, res) => {
  try {
    const { jobs } = req.body;

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({ error: 'Array de vagas inválido' });
    }

    const results = {
      success: [],
      errors: []
    };

    for (const jobData of jobs) {
      try {
        const {
          companyId,
          title,
          description,
          requirements,
          location,
          remote,
          salary,
          benefits,
          externalUrl
        } = jobData;

        // Validar campos obrigatórios
        if (!companyId || !title || !description || !location) {
          results.errors.push({
            job: jobData,
            error: 'Campos obrigatórios faltando'
          });
          continue;
        }

        // Verificar se a empresa existe
        const company = await prisma.company.findUnique({
          where: { id: companyId }
        });

        if (!company) {
          results.errors.push({
            job: jobData,
            error: 'Empresa não encontrada'
          });
          continue;
        }

        // Criar vaga
        const job = await prisma.job.create({
          data: {
            companyId,
            title,
            description,
            requirements: requirements || null,
            location,
            remote: remote || false,
            salary: salary || null,
            benefits: benefits || null,
            externalUrl: externalUrl || null,
            status: 'ACTIVE'
          }
        });

        results.success.push(job);
      } catch (error) {
        results.errors.push({
          job: jobData,
          error: error.message
        });
      }
    }

    res.status(201).json({
      message: `${results.success.length} vagas criadas com sucesso`,
      results
    });
  } catch (error) {
    console.error('Erro ao criar vagas em massa:', error);
    res.status(500).json({ error: 'Erro ao criar vagas em massa' });
  }
};

