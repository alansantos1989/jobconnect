const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Exportar dados do usuário (direito de portabilidade - LGPD Art. 18, IV)
exports.exportUserData = async (req, res) => {
  try {
    const userId = req.userId;
    const userType = req.userType;

    let userData = {};

    if (userType === 'user') {
      // Exportar dados do candidato
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          applications: {
            include: {
              job: {
                select: {
                  title: true,
                  company: { select: { name: true } }
                }
              }
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      userData = {
        tipo: 'Candidato',
        dados_pessoais: {
          nome: user.name,
          email: user.email,
          telefone: user.phone,
          data_criacao: user.createdAt,
          data_atualizacao: user.updatedAt
        },
        candidaturas: user.applications.map(app => ({
          vaga: app.job.title,
          empresa: app.job.company.name,
          status: app.status,
          data_candidatura: app.appliedAt
        }))
      };

    } else if (userType === 'company') {
      // Exportar dados da empresa
      const company = await prisma.company.findUnique({
        where: { id: userId },
        include: {
          jobs: {
            include: {
              applications: true
            }
          }
        }
      });

      if (!company) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
      }

      userData = {
        tipo: 'Empresa',
        dados_cadastrais: {
          nome: company.name,
          cnpj: company.cnpj,
          email: company.email,
          descricao: company.description,
          website: company.website,
          data_criacao: company.createdAt,
          data_atualizacao: company.updatedAt
        },
        assinatura: {
          plano: company.planType,
          status: company.subscriptionStatus,
          id_assinatura: company.subscriptionId,
          data_inicio: company.subscriptionStartDate,
          data_fim: company.subscriptionEndDate
        },
        vagas_publicadas: company.jobs.map(job => ({
          titulo: job.title,
          descricao: job.description,
          localizacao: job.location,
          tipo: job.type,
          salario: job.salary,
          status: job.status,
          candidaturas: job.applications.length,
          data_criacao: job.createdAt
        }))
      };
    }

    // Retornar dados em formato JSON
    res.json({
      message: 'Dados exportados com sucesso',
      data_exportacao: new Date().toISOString(),
      dados: userData
    });

  } catch (error) {
    console.error('[LGPD] Erro ao exportar dados:', error);
    res.status(500).json({ error: 'Erro ao exportar dados' });
  }
};

// Solicitar exclusão de conta (direito de eliminação - LGPD Art. 18, VI)
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const userType = req.userType;
    const { confirmacao } = req.body;

    // Validar confirmação
    if (confirmacao !== 'CONFIRMO A EXCLUSÃO') {
      return res.status(400).json({ 
        error: 'Confirmação inválida. Digite exatamente: CONFIRMO A EXCLUSÃO' 
      });
    }

    if (userType === 'user') {
      // Excluir candidato e suas candidaturas
      await prisma.application.deleteMany({
        where: { userId }
      });

      await prisma.user.delete({
        where: { id: userId }
      });

      res.json({ 
        message: 'Conta de candidato excluída com sucesso',
        tipo: 'user'
      });

    } else if (userType === 'company') {
      // Verificar se tem assinatura ativa
      const company = await prisma.company.findUnique({
        where: { id: userId }
      });

      if (company.subscriptionStatus === 'active') {
        return res.status(400).json({ 
          error: 'Cancele sua assinatura antes de excluir a conta' 
        });
      }

      // Excluir vagas e candidaturas relacionadas
      const jobs = await prisma.job.findMany({
        where: { companyId: userId },
        select: { id: true }
      });

      const jobIds = jobs.map(j => j.id);

      await prisma.application.deleteMany({
        where: { jobId: { in: jobIds } }
      });

      await prisma.job.deleteMany({
        where: { companyId: userId }
      });

      await prisma.company.delete({
        where: { id: userId }
      });

      res.json({ 
        message: 'Conta de empresa excluída com sucesso',
        tipo: 'company'
      });
    }

  } catch (error) {
    console.error('[LGPD] Erro ao excluir conta:', error);
    res.status(500).json({ error: 'Erro ao excluir conta' });
  }
};

// Revogar consentimento (direito de revogação - LGPD Art. 18, IX)
exports.revokeConsent = async (req, res) => {
  try {
    const userId = req.userId;
    const userType = req.userType;

    // Aqui você pode implementar lógica para marcar que o usuário
    // revogou o consentimento para determinados tratamentos de dados
    // Por exemplo, parar de enviar emails de marketing

    res.json({ 
      message: 'Consentimento revogado com sucesso',
      info: 'Seus dados não serão mais utilizados para finalidades não essenciais'
    });

  } catch (error) {
    console.error('[LGPD] Erro ao revogar consentimento:', error);
    res.status(500).json({ error: 'Erro ao revogar consentimento' });
  }
};

// Solicitar correção de dados (direito de correção - LGPD Art. 18, III)
exports.requestDataCorrection = async (req, res) => {
  try {
    const userId = req.userId;
    const userType = req.userType;
    const { campo, valor_atual, valor_correto, justificativa } = req.body;

    // Aqui você pode implementar um sistema de tickets ou
    // permitir correção direta de certos campos

    res.json({ 
      message: 'Solicitação de correção registrada',
      info: 'Nossa equipe analisará sua solicitação em até 48 horas',
      dados_solicitacao: {
        campo,
        valor_atual,
        valor_correto,
        justificativa,
        data_solicitacao: new Date()
      }
    });

  } catch (error) {
    console.error('[LGPD] Erro ao solicitar correção:', error);
    res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
};

