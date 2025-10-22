const prisma = require('../config/database');
const bcrypt = require('bcrypt');

// Obter perfil do usuário
exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        profilePhoto: true,
        resumePdf: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
};

// Atualizar perfil do usuário
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, email, password } = req.body;

    const data = {};

    if (name) data.name = name;
    if (phone) data.phone = phone;
    if (email) data.email = email;
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        profilePhoto: true,
        resumePdf: true,
      },
    });

    res.json({
      message: 'Perfil atualizado com sucesso',
      user,
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
};

// Upload de foto de perfil
exports.uploadPhoto = async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const photoUrl = `/uploads/${req.file.filename}`;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { profilePhoto: photoUrl },
      select: {
        id: true,
        profilePhoto: true,
      },
    });

    res.json({
      message: 'Foto enviada com sucesso',
      photoUrl: user.profilePhoto,
    });
  } catch (error) {
    console.error('Erro ao fazer upload da foto:', error);
    res.status(500).json({ error: 'Erro ao fazer upload da foto' });
  }
};

// Upload de currículo em PDF
exports.uploadResume = async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const resumeUrl = `/uploads/${req.file.filename}`;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { resumePdf: resumeUrl },
      select: {
        id: true,
        resumePdf: true,
      },
    });

    res.json({
      message: 'Currículo enviado com sucesso',
      resumeUrl: user.resumePdf,
    });
  } catch (error) {
    console.error('Erro ao fazer upload do currículo:', error);
    res.status(500).json({ error: 'Erro ao fazer upload do currículo' });
  }
};

