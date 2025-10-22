const prisma = require('../config/database');

// Obter currículo do usuário
exports.getResume = async (req, res) => {
  try {
    const userId = req.userId;

    const resume = await prisma.resume.findUnique({
      where: { userId },
    });

    res.json({ resume });
  } catch (error) {
    console.error('Erro ao buscar currículo:', error);
    res.status(500).json({ error: 'Erro ao buscar currículo' });
  }
};

// Criar ou atualizar currículo
exports.upsertResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { objective, experience, education, skills } = req.body;

    const resume = await prisma.resume.upsert({
      where: { userId },
      update: {
        objective,
        experience,
        education,
        skills,
      },
      create: {
        userId,
        objective,
        experience,
        education,
        skills,
      },
    });

    res.json({
      message: 'Currículo salvo com sucesso',
      resume,
    });
  } catch (error) {
    console.error('Erro ao salvar currículo:', error);
    res.status(500).json({ error: 'Erro ao salvar currículo' });
  }
};

