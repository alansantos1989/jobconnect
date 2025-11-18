const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const csv = require('csv-parser');

async function importJobs() {
  const results = [];
  let processedCount = 0;
  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  console.log('Iniciando importação de vagas...\n');

  // Ler arquivo CSV
  fs.createReadStream('/home/ubuntu/upload/vagas_600_final.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      console.log(`Total de vagas a processar: ${results.length}\n`);

      for (const row of results) {
        try {
          processedCount++;

          // Extrair dados do CSV
          const companyName = row['company'] || row['Empresa'] || row['empresa'];
          const title = row['title'] || row['Título'] || row['titulo'];
          const location = row['location'] || row['Localização'] || row['localizacao'];
          const salary = row['salary'] || row['Salário'] || row['salario'];
          const description = row['description'] || row['Descrição'] || row['descricao'];
          const externalUrl = row['url'] || row['Link'] || row['link'];

          // Validar campos obrigatórios
          if (!companyName || !title) {
            errors.push({
              row: processedCount,
              error: 'Empresa e Título são obrigatórios',
              data: row
            });
            errorCount++;
            continue;
          }

          // Buscar ou criar empresa
          let company = await prisma.company.findFirst({
            where: {
              name: {
                contains: companyName,
                mode: 'insensitive'
              }
            }
          });

          // Se empresa não existe, criar
          if (!company) {
            company = await prisma.company.create({
              data: {
                name: companyName,
                email: `contato@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br`,
                cnpj: `00.000.000/0001-${String(processedCount).padStart(2, '0')}`,
                password: '$2b$10$dummyHashForImportedCompanies123456',
                planType: 'FREE',
                description: `Empresa ${companyName} - Importada automaticamente`
              }
            });
            console.log(`✓ Empresa criada: ${companyName}`);
          }

          // Detectar se é remoto
          let remote = false;
          if (location && (location.toLowerCase().includes('remoto') || location.toLowerCase().includes('remote'))) {
            remote = true;
          }

          // Determinar categoria
          let category = 'Outros';
          const titleLower = title.toLowerCase();
          
          if (titleLower.includes('desenvolvedor') || titleLower.includes('programador') || titleLower.includes('dev')) {
            category = 'Tecnologia';
          } else if (titleLower.includes('analista')) {
            category = 'Administrativo';
          } else if (titleLower.includes('gerente') || titleLower.includes('coordenador')) {
            category = 'Gestão';
          } else if (titleLower.includes('vendas') || titleLower.includes('comercial')) {
            category = 'Vendas';
          } else if (titleLower.includes('marketing')) {
            category = 'Marketing';
          } else if (titleLower.includes('financeiro') || titleLower.includes('contábil')) {
            category = 'Financeiro';
          } else if (titleLower.includes('rh') || titleLower.includes('recursos humanos')) {
            category = 'Recursos Humanos';
          }

          // Criar vaga
          await prisma.job.create({
            data: {
              title,
              description: description || `Vaga para ${title} na ${companyName}`,
              requirements: 'Requisitos a serem definidos',
              salary: salary || 'A combinar',
              location: location || 'Não especificado',
              remote,
              companyId: company.id,
              status: 'ACTIVE',
              externalUrl: externalUrl || null
            }
          });

          successCount++;
          
          if (successCount % 50 === 0) {
            console.log(`Progresso: ${successCount} vagas importadas...`);
          }

        } catch (error) {
          console.error(`Erro ao processar linha ${processedCount}:`, error.message);
          errors.push({
            row: processedCount,
            error: error.message,
            data: row
          });
          errorCount++;
        }
      }

      console.log('\n=== IMPORTAÇÃO CONCLUÍDA ===');
      console.log(`Total processado: ${processedCount}`);
      console.log(`Sucesso: ${successCount}`);
      console.log(`Erros: ${errorCount}`);
      
      if (errors.length > 0) {
        console.log('\nErros encontrados:');
        errors.slice(0, 10).forEach(err => {
          console.log(`- Linha ${err.row}: ${err.error}`);
        });
        if (errors.length > 10) {
          console.log(`... e mais ${errors.length - 10} erros`);
        }
      }

      await prisma.$disconnect();
      process.exit(0);
    })
    .on('error', (error) => {
      console.error('Erro ao ler arquivo CSV:', error);
      process.exit(1);
    });
}

importJobs().catch(console.error);

