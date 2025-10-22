const { PrismaClient } = require('@prisma/client');

// Configuração otimizada do Prisma com pool de conexões e retry
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Middleware para retry automático em caso de falha de conexão
prisma.$use(async (params, next) => {
  const maxRetries = 3;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await next(params);
    } catch (error) {
      retries++;
      
      // Se for erro de conexão (P1001) e ainda temos tentativas, retry
      if (error.code === 'P1001' && retries < maxRetries) {
        console.log(`[DATABASE] Tentativa ${retries}/${maxRetries} - Reconectando...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Backoff exponencial
        continue;
      }
      
      // Se não for erro de conexão ou esgotamos as tentativas, lança o erro
      throw error;
    }
  }
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;

