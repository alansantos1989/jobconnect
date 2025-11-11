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
        // Contato
        contactName: true,
        contactPhone: true,
        city: true,
        state: true,
        zipCode: true,
        // Negócio
        businessSector: true,
        companySize: true,
        employeeCount: true,
        monthlyHiringVolume: true,
        preferredContractType: true,
        turnoverRate: true,
        averageSalary: true,
        slaHours: true,
        // Contrato
        contractActive: true,
        contractStartDate: true,
        contractEndDate: true,
        monthlyRevenue: true,
        createdAt: true,
      },
    });

    if (!company) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    res.json(company);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
};

// Atualizar perfil da empresa
exports.updateProfile = async (req, res) => {
  try {
    const companyId = req.userId;
    const {
      name, description, website, email, password, cnpj,
      // Contato
      contactName, contactPhone, city, state, zipCode,
      // Negócio
      businessSector, companySize, employeeCount, monthlyHiringVolume,
      preferredContractType, turnoverRate, averageSalary, slaHours,
      // Contrato
      contractActive, contractStartDate, contractEndDate, monthlyRevenue
    } = req.body;

    const data = {};

    // Dados básicos
    if (name) data.name = name;
    if (description !== undefined) data.description = description;
    if (website !== undefined) data.website = website;
    if (email) data.email = email;
    if (cnpj) data.cnpj = cnpj;
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    // Contato
    if (contactName !== undefined) data.contactName = contactName;
    if (contactPhone !== undefined) data.contactPhone = contactPhone;
    if (city !== undefined) data.city = city;
    if (state !== undefined) data.state = state;
    if (zipCode !== undefined) data.zipCode = zipCode;

    // Negócio
    if (businessSector !== undefined) data.businessSector = businessSector;
    if (companySize !== undefined) data.companySize = companySize;
    if (employeeCount !== undefined) data.employeeCount = employeeCount ? parseInt(employeeCount) : null;
    if (monthlyHiringVolume !== undefined) data.monthlyHiringVolume = monthlyHiringVolume ? parseInt(monthlyHiringVolume) : null;
    if (preferredContractType !== undefined) data.preferredContractType = preferredContractType;
    if (turnoverRate !== undefined) data.turnoverRate = turnoverRate ? parseFloat(turnoverRate) : null;
    if (averageSalary !== undefined) data.averageSalary = averageSalary ? parseFloat(averageSalary) : null;
    if (slaHours !== undefined) data.slaHours = slaHours ? parseInt(slaHours) : 48;

    // Contrato
    if (contractActive !== undefined) data.contractActive = contractActive;
    if (contractStartDate !== undefined) data.contractStartDate = contractStartDate ? new Date(contractStartDate) : null;
    if (contractEndDate !== undefined) data.contractEndDate = contractEndDate ? new Date(contractEndDate) : null;
    if (monthlyRevenue !== undefined) data.monthlyRevenue = monthlyRevenue ? parseFloat(monthlyRevenue) : null;

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

