const prisma = require('../config/database');

// Listar vagas com filtros
exports.listJobs = async (req, res) => {
  try {
    const { search, location, remote, page = 1, limit = 20 } = req.query;

    const where = {
      status: 'ACTIVE',
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (remote !== undefined) {
      where.remote = remote === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: parseInt(limit),
      }),
      prisma.job.count({ where }),
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

// Obter detalhes de uma vaga
exports.getJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            description: true,
            website: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    res.json({ job });
  } catch (error) {
    console.error('Erro ao buscar vaga:', error);
    res.status(500).json({ error: 'Erro ao buscar vaga' });
  }
};

// Criar vaga (empresa)
exports.createJob = async (req, res) => {
  try {
    const { title, description, requirements, location, remote, salary, featured } = req.body;
    const companyId = req.userId;

    // Verificar plano da empresa
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        jobs: {
          where: { status: 'ACTIVE' },
        },
      },
    });

    // Verificar limites do plano
    if (company.planType === 'FREE' && company.jobs.length >= 1) {
      return res.status(403).json({
        error: 'Limite de vagas atingido. Faça upgrade para o plano PRO.',
      });
    }

    if (company.planType === 'PRO' && company.jobs.length >= 10) {
      return res.status(403).json({
        error: 'Limite de vagas atingido (10 vagas ativas).',
      });
    }

    // Verificar se pode destacar vaga
    const canFeature = company.planType === 'PRO' && featured;

    const job = await prisma.job.create({
      data: {
        companyId,
        title,
        description,
        requirements,
        location,
        remote: remote || false,
        salary,
        featured: canFeature,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Vaga criada com sucesso',
      job,
    });
  } catch (error) {
    console.error('Erro ao criar vaga:', error);
    res.status(500).json({ error: 'Erro ao criar vaga' });
  }
};

// Atualizar vaga (empresa)
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, requirements, location, remote, salary, status } = req.body;
    const companyId = req.userId;

    // Verificar se a vaga pertence à empresa
    const existingJob = await prisma.job.findUnique({
      where: { id },
    });

    if (!existingJob || existingJob.companyId !== companyId) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    const job = await prisma.job.update({
      where: { id },
      data: {
        title,
        description,
        requirements,
        location,
        remote,
        salary,
        status,
      },
    });

    res.json({
      message: 'Vaga atualizada com sucesso',
      job,
    });
  } catch (error) {
    console.error('Erro ao atualizar vaga:', error);
    res.status(500).json({ error: 'Erro ao atualizar vaga' });
  }
};

// Deletar vaga (empresa)
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.userId;

    // Verificar se a vaga pertence à empresa
    const existingJob = await prisma.job.findUnique({
      where: { id },
    });

    if (!existingJob || existingJob.companyId !== companyId) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    await prisma.job.delete({
      where: { id },
    });

    res.json({ message: 'Vaga deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar vaga:', error);
    res.status(500).json({ error: 'Erro ao deletar vaga' });
  }
};

// Listar vagas da empresa
exports.getCompanyJobs = async (req, res) => {
  try {
    const companyId = req.userId;

    const jobs = await prisma.job.findMany({
      where: { companyId },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ jobs });
  } catch (error) {
    console.error('Erro ao listar vagas da empresa:', error);
    res.status(500).json({ error: 'Erro ao listar vagas' });
  }
};

