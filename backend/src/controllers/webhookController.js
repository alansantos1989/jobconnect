const prisma = require('../config/database');

// Processar webhook do Mercado Pago
const processWebhook = async (req, res) => {
  try {
    console.log('[WEBHOOK] Recebido:', JSON.stringify(req.body, null, 2));
    console.log('[WEBHOOK] Headers:', JSON.stringify(req.headers, null, 2));

    const { type, data } = req.body;

    // Responder imediatamente ao Mercado Pago
    res.status(200).json({ received: true });

    // Processar o webhook de forma assíncrona
    if (type === 'payment') {
      await handlePaymentNotification(data);
    } else if (type === 'subscription_preapproval') {
      await handleSubscriptionNotification(data);
    } else {
      console.log('[WEBHOOK] Tipo não processado:', type);
    }
  } catch (error) {
    console.error('[WEBHOOK] Erro ao processar webhook:', error);
    // Mesmo com erro, retornar 200 para o Mercado Pago não reenviar
    res.status(200).json({ error: 'Erro ao processar webhook' });
  }
};

// Processar notificação de pagamento
const handlePaymentNotification = async (data) => {
  try {
    const paymentId = data.id;
    console.log('[WEBHOOK] Processando pagamento:', paymentId);

    // Buscar detalhes do pagamento no Mercado Pago
    const mercadopago = require('mercadopago');
    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });

    const payment = await mercadopago.payment.get(paymentId);
    console.log('[WEBHOOK] Detalhes do pagamento:', JSON.stringify(payment.body, null, 2));

    const { status, external_reference, payer } = payment.body;

    if (status === 'approved') {
      // Extrair informações do external_reference
      // Formato: "company:{companyId}:plan:{planType}"
      const match = external_reference.match(/company:([^:]+):plan:([^:]+)/);
      
      if (match) {
        const companyId = match[1];
        const planType = match[2];

        console.log('[WEBHOOK] Atualizando empresa:', companyId, 'para plano:', planType);

        // Atualizar plano da empresa
        await prisma.company.update({
          where: { id: companyId },
          data: {
            planType: planType,
            subscriptionStatus: 'ACTIVE',
            subscriptionId: paymentId.toString(),
          },
        });

        console.log('[WEBHOOK] Empresa atualizada com sucesso!');

        // TODO: Enviar email de confirmação
      } else {
        console.error('[WEBHOOK] Formato de external_reference inválido:', external_reference);
      }
    } else {
      console.log('[WEBHOOK] Pagamento não aprovado. Status:', status);
    }
  } catch (error) {
    console.error('[WEBHOOK] Erro ao processar notificação de pagamento:', error);
  }
};

// Processar notificação de assinatura
const handleSubscriptionNotification = async (data) => {
  try {
    const subscriptionId = data.id;
    console.log('[WEBHOOK] Processando assinatura:', subscriptionId);

    // Buscar detalhes da assinatura no Mercado Pago
    const mercadopago = require('mercadopago');
    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });

    const subscription = await mercadopago.preapproval.get(subscriptionId);
    console.log('[WEBHOOK] Detalhes da assinatura:', JSON.stringify(subscription.body, null, 2));

    const { status, external_reference } = subscription.body;

    // Extrair informações do external_reference
    const match = external_reference.match(/company:([^:]+):plan:([^:]+)/);
    
    if (match) {
      const companyId = match[1];
      const planType = match[2];

      console.log('[WEBHOOK] Atualizando assinatura da empresa:', companyId);

      // Atualizar status da assinatura
      let subscriptionStatus = 'ACTIVE';
      if (status === 'cancelled') {
        subscriptionStatus = 'CANCELED';
        planType = 'FREE'; // Voltar para plano gratuito
      } else if (status === 'paused') {
        subscriptionStatus = 'PAUSED';
      }

      await prisma.company.update({
        where: { id: companyId },
        data: {
          planType: planType,
          subscriptionStatus: subscriptionStatus,
          subscriptionId: subscriptionId.toString(),
        },
      });

      console.log('[WEBHOOK] Assinatura atualizada com sucesso!');

      // TODO: Enviar email de notificação
    } else {
      console.error('[WEBHOOK] Formato de external_reference inválido:', external_reference);
    }
  } catch (error) {
    console.error('[WEBHOOK] Erro ao processar notificação de assinatura:', error);
  }
};

module.exports = {
  processWebhook,
};

