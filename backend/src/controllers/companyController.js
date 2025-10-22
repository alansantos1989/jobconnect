const prisma = require('../config/database');
const bcrypt = require('bcrypt');

// Obter perfil da empresa
exports.getProfile = async (req, res) => {
  try {
    const companyId = req.userId;

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        email: true,
        name: true,
        cnpj: true,
        description: true,
        logo: true,
        website: true,
        planType: true,
        subscriptionStatus: true,
        createdAt: true,
      },
    });

    if (!company) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    res.json({ company });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
};

// Atualizar perfil da empresa
exports.updateProfile = async (req, res) => {
  try {
    const companyId = req.userId;
    const { name, description, website, email, password } = req.body;

    const data = {};

    if (name) data.name = name;
    if (description) data.description = description;
    if (website) data.website = website;
    if (email) data.email = email;
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const company = await prisma.company.update({
      where: { id: companyId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        cnpj: true,
        description: true,
        logo: true,
        website: true,
        planType: true,
      },
    });

    res.json({
      message: 'Perfil atualizado com sucesso',
      company,
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
};

// Upload de logo
exports.uploadLogo = async (req, res) => {
  try {
    const companyId = req.userId;

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const logoUrl = `/uploads/${req.file.filename}`;

    const company = await prisma.company.update({
      where: { id: companyId },
      data: { logo: logoUrl },
      select: {
        id: true,
        logo: true,
      },
    });

    res.json({
      message: 'Logo enviado com sucesso',
      logoUrl: company.logo,
    });
  } catch (error) {
    console.error('Erro ao fazer upload do logo:', error);
    res.status(500).json({ error: 'Erro ao fazer upload do logo' });
  }
};

// Obter estatísticas da empresa com retry automático
exports.getStats = async (req, res) => {
  try {
    const companyId = req.userId;
    
    console.log('[STATS] Buscando estatísticas para empresa:', companyId);

    // Buscar dados com timeout e retry
    const fetchWithRetry = async (fn, retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          return await Promise.race([
            fn(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 5000)
            )
          ]);
        } catch (error) {
          console.log(`[STATS] Tentativa ${i + 1}/${retries} falhou:`, error.message);
          if (i === retries - 1) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    };

    const [activeJobs, totalApplications, company] = await Promise.all([
      fetchWithRetry(() => prisma.job.count({
        where: {
          companyId,
          status: 'ACTIVE',
        },
      })),
      fetchWithRetry(() => prisma.application.count({
        where: {
          job: {
            companyId,
          },
        },
      })),
      fetchWithRetry(() => prisma.company.findUnique({
        where: { id: companyId },
        select: {
          planType: true,
        },
      })),
    ]);

    if (!company) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    const maxJobs = company.planType === 'FREE' ? 1 : 10;

    console.log('[STATS] Estatísticas obtidas com sucesso:', {
      activeJobs,
      maxJobs,
      totalApplications,
      planType: company.planType,
    });

    res.json({
      stats: {
        activeJobs,
        maxJobs,
        totalApplications,
        planType: company.planType,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar estatísticas',
      details: error.message 
    });
  }
};

