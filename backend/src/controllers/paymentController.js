const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const prisma = require('../config/database');

// Configurar cliente do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// Criar preferência de pagamento para vaga única
exports.createJobPaymentPreference = async (req, res) => {
  try {
    const { jobId, featured } = req.body;
    const companyId = req.userId;

    // Verificar se a vaga pertence à empresa
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        company: true,
      },
    });

    if (!job || job.companyId !== companyId) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    // Calcular valor
    let amount = 49.90; // Valor base da vaga
    if (featured) {
      amount += 29.90; // Adicional por destaque
    }

    // Criar preferência no Mercado Pago
    const preference = new Preference(client);
    const preferenceData = {
      items: [
        {
          title: `Publicação de vaga: ${job.title}`,
          unit_price: amount,
          quantity: 1,
        },
      ],
      back_urls: {
        success: `${process.env.FRONTEND_URL}/company/payment/success`,
        failure: `${process.env.FRONTEND_URL}/company/payment/failure`,
        pending: `${process.env.FRONTEND_URL}/company/payment/pending`,
      },
      auto_return: 'approved',
      external_reference: jobId,
      notification_url: `${process.env.BACKEND_URL || 'https://jobconnect-i16a.onrender.com'}/api/payments/webhook`,
    };

    const response = await preference.create({ body: preferenceData });

    // Criar registro de pagamento
    await prisma.payment.create({
      data: {
        companyId,
        jobId,
        amount,
        status: 'pending',
        type: 'JOB_POST',
      },
    });

    res.json({
      preferenceId: response.id,
      initPoint: response.init_point,
    });
  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error);
    res.status(500).json({ error: 'Erro ao criar preferência de pagamento' });
  }
};

// Criar preferência de assinatura PRO
exports.createSubscriptionPreference = async (req, res) => {
  try {
    const companyId = req.userId;

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    // Criar preferência de assinatura
    const preference = new Preference(client);
    const preferenceData = {
      items: [
        {
          title: 'Plano PRO - JobConnect',
          unit_price: 99.90,
          quantity: 1,
        },
      ],
      back_urls: {
        success: `${process.env.FRONTEND_URL}/company/payment/success`,
        failure: `${process.env.FRONTEND_URL}/company/payment/failure`,
        pending: `${process.env.FRONTEND_URL}/company/payment/pending`,
      },
      auto_return: 'approved',
      external_reference: `company:${companyId}:plan:PRO`,
      notification_url: `${process.env.BACKEND_URL || 'https://jobconnect-i16a.onrender.com'}/api/webhooks/mercadopago`,
    };

    const response = await preference.create({ body: preferenceData });

    // Criar registro de pagamento
    await prisma.payment.create({
      data: {
        companyId,
        amount: 99.90,
        status: 'pending',
        type: 'SUBSCRIPTION',
      },
    });

    res.json({
      preferenceId: response.id,
      initPoint: response.init_point,
    });
  } catch (error) {
    console.error('Erro ao criar preferência de assinatura:', error);
    res.status(500).json({ error: 'Erro ao criar preferência de assinatura' });
  }
};

// Webhook do Mercado Pago
exports.webhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;

      // Buscar informações do pagamento no Mercado Pago
      const paymentClient = new Payment(client);
      const paymentInfo = await paymentClient.get({ id: paymentId });

      if (paymentInfo.status === 'approved') {
        const externalReference = paymentInfo.external_reference;

        // Atualizar pagamento no banco
        const payment = await prisma.payment.findFirst({
          where: {
            OR: [
              { jobId: externalReference },
              { companyId: externalReference },
            ],
            status: 'pending',
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'approved',
              paymentId: paymentId.toString(),
            },
          });

          // Se for assinatura, atualizar plano da empresa
          if (payment.type === 'SUBSCRIPTION') {
            await prisma.company.update({
              where: { id: payment.companyId },
              data: {
                planType: 'PRO',
                subscriptionStatus: 'active',
                subscriptionId: paymentId.toString(),
              },
            });
          }

          // Se for vaga, ativar vaga
          if (payment.type === 'JOB_POST' && payment.jobId) {
            await prisma.job.update({
              where: { id: payment.jobId },
              data: {
                status: 'ACTIVE',
              },
            });
          }
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).send('Error');
  }
};

// Histórico de pagamentos
exports.getPaymentHistory = async (req, res) => {
  try {
    const companyId = req.userId;

    const payments = await prisma.payment.findMany({
      where: { companyId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ payments });
  } catch (error) {
    console.error('Erro ao buscar histórico de pagamentos:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico de pagamentos' });
  }
};



// Cancelar assinatura
exports.cancelSubscription = async (req, res) => {
  try {
    const companyId = req.userId;

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    if (company.planType === 'FREE') {
      return res.status(400).json({ error: 'Você já está no plano gratuito' });
    }

    if (!company.subscriptionId) {
      return res.status(400).json({ error: 'Nenhuma assinatura ativa encontrada' });
    }

    // Atualizar empresa para plano FREE
    await prisma.company.update({
      where: { id: companyId },
      data: {
        planType: 'FREE',
        subscriptionStatus: 'CANCELED',
        // Manter subscriptionId para histórico
      },
    });

    // TODO: Cancelar assinatura no Mercado Pago se for recorrente
    // const mercadopago = require('mercadopago');
    // mercadopago.configure({ access_token: process.env.MERCADOPAGO_ACCESS_TOKEN });
    // await mercadopago.preapproval.update({ id: company.subscriptionId, status: 'cancelled' });

    res.json({
      message: 'Assinatura cancelada com sucesso',
      company: {
        id: company.id,
        name: company.name,
        planType: 'FREE',
        subscriptionStatus: 'CANCELED',
      },
    });
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    res.status(500).json({ error: 'Erro ao cancelar assinatura' });
  }
};

