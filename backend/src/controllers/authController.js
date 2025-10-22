const bcrypt = require('bcrypt');
const prisma = require('../config/database');
const { generateToken } = require('../utils/jwt');

// Registro de candidato
exports.registerUser = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
      },
    });

    // Gerar token
    const token = generateToken({ id: user.id, type: 'user' });

    // Configurar cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

// Registro de empresa
exports.registerCompany = async (req, res) => {
  try {
    const { email, password, name, cnpj, description, website } = req.body;

    // Verificar se email já existe
    const existingCompany = await prisma.company.findUnique({ where: { email } });
    if (existingCompany) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Verificar se CNPJ já existe
    const existingCnpj = await prisma.company.findUnique({ where: { cnpj } });
    if (existingCnpj) {
      return res.status(400).json({ error: 'CNPJ já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar empresa
    const company = await prisma.company.create({
      data: {
        email,
        password: hashedPassword,
        name,
        cnpj,
        description,
        website,
      },
    });

    // Gerar token
    const token = generateToken({ id: company.id, type: 'company' });

    // Configurar cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: 'Empresa criada com sucesso',
      company: {
        id: company.id,
        email: company.email,
        name: company.name,
      },
    });
  } catch (error) {
    console.error('Erro ao registrar empresa:', error);
    res.status(500).json({ error: 'Erro ao criar empresa' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password, type } = req.body;

    let user;
    let userType;

    // Buscar usuário baseado no tipo
    if (type === 'user') {
      user = await prisma.user.findUnique({ where: { email } });
      userType = 'user';
    } else if (type === 'company') {
      user = await prisma.company.findUnique({ where: { email } });
      userType = 'company';
    } else if (type === 'admin') {
      user = await prisma.admin.findUnique({ where: { email } });
      userType = 'admin';
    } else {
      return res.status(400).json({ error: 'Tipo de usuário inválido' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = generateToken({ id: user.id, type: userType });

    // Configurar cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: userType,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout realizado com sucesso' });
};

// Obter usuário atual
exports.me = async (req, res) => {
  try {
    const { userId, userType } = req;

    let user;

    if (userType === 'user') {
      user = await prisma.user.findUnique({
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
    } else if (userType === 'company') {
      user = await prisma.company.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          cnpj: true,
          description: true,
          logo: true,
          website: true,
          planType: true,
          createdAt: true,
        },
      });
    } else if (userType === 'admin') {
      user = await prisma.admin.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });
    }

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ user: { ...user, type: userType } });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

