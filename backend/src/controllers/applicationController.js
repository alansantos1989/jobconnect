const prisma = require('../config/database');

// Candidatar-se a uma vaga
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.userId;

    // Verificar se a vaga existe e está ativa
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job || job.status !== 'ACTIVE') {
      return res.status(404).json({ error: 'Vaga não encontrada ou inativa' });
    }

    // Verificar se já se candidatou
    const existingApplication = await prisma.application.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'Você já se candidatou a esta vaga' });
    }

    // Buscar dados do candidato
    const candidate = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        phone: true,
        resumePdf: true,
      },
    });

    // Buscar dados completos da vaga e empresa
    const jobWithCompany = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            email: true,
            logo: true,
            planType: true,
          },
        },
      },
    });

    // Criar candidatura
    const application = await prisma.application.create({
      data: {
        userId,
        jobId,
      },
      include: {
        job: {
          include: {
            company: {
              select: {
                name: true,
                logo: true,
              },
            },
          },
        },
      },
    });

    // Enviar email para a empresa (apenas se não for vaga externa)
    if (!job.externalUrl && jobWithCompany.company.email) {
      try {
        // TODO: Implementar envio de email real
        // Por enquanto, apenas log
        console.log('Email seria enviado para:', jobWithCompany.company.email);
        console.log('Candidato:', candidate.name, '-', candidate.email);
        console.log('Vaga:', jobWithCompany.title);
        console.log('Telefone:', candidate.phone);
        console.log('Currículo:', candidate.resumePdf);
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
        // Não bloquear a candidatura se o email falhar
      }
    }

    res.status(201).json({
      message: 'Candidatura enviada com sucesso',
      application,
    });
  } catch (error) {
    console.error('Erro ao candidatar-se:', error);
    res.status(500).json({ error: 'Erro ao enviar candidatura' });
  }
};

// Listar candidaturas do usuário
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.userId;

    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ applications });
  } catch (error) {
    console.error('Erro ao listar candidaturas:', error);
    res.status(500).json({ error: 'Erro ao listar candidaturas' });
  }
};

// Listar candidaturas de uma vaga (empresa)
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const companyId = req.userId;

    // Verificar se a vaga pertence à empresa
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job || job.companyId !== companyId) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profilePhoto: true,
            resumePdf: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ applications });
  } catch (error) {
    console.error('Erro ao listar candidaturas:', error);
    res.status(500).json({ error: 'Erro ao listar candidaturas' });
  }
};

// Atualizar status de candidatura (empresa)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const companyId = req.userId;

    // Verificar se a candidatura existe e pertence a uma vaga da empresa
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: true,
      },
    });

    if (!application || application.job.companyId !== companyId) {
      return res.status(404).json({ error: 'Candidatura não encontrada' });
    }

    // Atualizar status
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    res.json({
      message: 'Status atualizado com sucesso',
      application: updatedApplication,
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
};

// Listar todas as candidaturas da empresa
exports.getCompanyApplications = async (req, res) => {
  try {
    const companyId = req.userId;

    const applications = await prisma.application.findMany({
      where: {
        job: {
          companyId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profilePhoto: true,
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
    });

    res.json({ applications });
  } catch (error) {
    console.error('Erro ao listar candidaturas:', error);
    res.status(500).json({ error: 'Erro ao listar candidaturas' });
  }
};

