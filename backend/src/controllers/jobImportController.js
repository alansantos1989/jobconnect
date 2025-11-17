const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const csv = require('csv-parser');
const fs = require('fs');

// Importar vagas de CSV
exports.importJobsFromCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo CSV foi enviado' });
    }

    const results = [];
    const errors = [];
    let processedCount = 0;
    let successCount = 0;
    let errorCount = 0;

    // Ler arquivo CSV
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Processar cada linha do CSV
        for (const row of results) {
          try {
            processedCount++;

            // Extrair dados do CSV
            const companyName = row['Empresa'] || row['empresa'];
            const title = row['Título'] || row['titulo'] || row['title'];
            const location = row['Localização'] || row['localizacao'] || row['location'];
            const salary = row['Salário'] || row['salario'] || row['salary'];
            const description = row['Descrição'] || row['descricao'] || row['description'];
            const externalUrl = row['Link'] || row['link'] || row['url'];

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

            // Se empresa não existe, criar uma empresa genérica
            if (!company) {
              company = await prisma.company.create({
                data: {
                  name: companyName,
                  email: `contato@${companyName.toLowerCase().replace(/\s+/g, '')}.com.br`,
                  cnpj: `00.000.000/0001-${String(processedCount).padStart(2, '0')}`,
                  password: '$2b$10$dummyHashForImportedCompanies',
                  plan: 'FREE',
                  description: `Empresa ${companyName} - Importada automaticamente`
                }
              });
            }

            // Extrair cidade e estado da localização
            let city = '';
            let state = '';
            let workModel = 'presencial';

            if (location) {
              // Tentar extrair cidade e estado (ex: "São Paulo - SP")
              const locationMatch = location.match(/^([^-]+)\s*-\s*([A-Z]{2})/);
              if (locationMatch) {
                city = locationMatch[1].trim();
                state = locationMatch[2].trim();
              } else {
                city = location;
              }

              // Detectar modelo de trabalho
              if (location.toLowerCase().includes('remoto')) {
                workModel = 'remoto';
              } else if (location.toLowerCase().includes('híbrido') || location.toLowerCase().includes('hibrido')) {
                workModel = 'hibrido';
              }
            }

            // Determinar categoria baseada no título
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
                location: city || location || 'Não especificado',
                state: state || '',
                city: city || '',
                workModel,
                category,
                companyId: company.id,
                status: 'active',
                externalUrl: externalUrl || null
              }
            });

            successCount++;

          } catch (error) {
            console.error(`Erro ao processar linha ${processedCount}:`, error);
            errors.push({
              row: processedCount,
              error: error.message,
              data: row
            });
            errorCount++;
          }
        }

        // Remover arquivo temporário
        fs.unlinkSync(req.file.path);

        // Retornar resultado
        res.json({
          success: true,
          message: `Importação concluída`,
          stats: {
            total: processedCount,
            success: successCount,
            errors: errorCount
          },
          errors: errors.length > 0 ? errors : undefined
        });
      })
      .on('error', (error) => {
        console.error('Erro ao ler arquivo CSV:', error);
        res.status(500).json({ error: 'Erro ao processar arquivo CSV' });
      });

  } catch (error) {
    console.error('Erro na importação:', error);
    res.status(500).json({ error: 'Erro ao importar vagas' });
  }
};

// Obter estatísticas de importação
exports.getImportStats = async (req, res) => {
  try {
    const totalJobs = await prisma.job.count();
    const activeJobs = await prisma.job.count({
      where: { status: 'active' }
    });
    const companies = await prisma.company.count();

    res.json({
      totalJobs,
      activeJobs,
      companies
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};

module.exports = exports;

