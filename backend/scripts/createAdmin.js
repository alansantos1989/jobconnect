const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Dados do administrador
    const adminData = {
      email: 'admin@jobconnect.com',
      password: 'admin123',
      name: 'Administrador',
      role: 'SUPER_ADMIN'
    };

    // Verificar se já existe
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: adminData.email }
    });

    if (existingAdmin) {
      console.log('✅ Administrador já existe!');
      console.log('Email:', adminData.email);
      console.log('Senha: admin123');
      return;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Criar administrador
    const admin = await prisma.admin.create({
      data: {
        email: adminData.email,
        password: hashedPassword,
        name: adminData.name,
        role: adminData.role
      }
    });

    console.log('🎉 Administrador criado com sucesso!');
    console.log('Email:', adminData.email);
    console.log('Senha: admin123');
    console.log('ID:', admin.id);

  } catch (error) {
    console.error('❌ Erro ao criar administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

