'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    id: 'FREE',
    name: 'Plano Gratuito',
    price: 0,
    period: 'para sempre',
    description: 'Ideal para testar a plataforma',
    features: [
      { text: '1 vaga ativa por vez', included: true },
      { text: 'Até 10 candidaturas por vaga', included: true },
      { text: 'Perfil básico da empresa', included: true },
      { text: 'Suporte por email', included: true },
      { text: 'Destaque nas buscas', included: false },
      { text: 'Vagas ilimitadas', included: false },
      { text: 'Análise de candidatos', included: false },
      { text: 'Suporte prioritário', included: false },
    ],
  },
  {
    id: 'PRO',
    name: 'Plano Profissional',
    price: 99.90,
    period: 'por mês',
    description: 'Para empresas que querem crescer',
    features: [
      { text: 'Vagas ilimitadas', included: true },
      { text: 'Candidaturas ilimitadas', included: true },
      { text: 'Perfil completo da empresa', included: true },
      { text: 'Destaque nas buscas', included: true },
      { text: 'Análise de candidatos com IA', included: true },
      { text: 'Relatórios e estatísticas', included: true },
      { text: 'Suporte prioritário', included: true },
      { text: 'Logo em destaque', included: true },
    ],
    popular: true,
  },
];

export default function PlansPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'FREE') {
      alert('Você já está no plano gratuito!');
      return;
    }

    setLoading(planId);

    try {
      const response = await api.post('/api/payments/create-subscription-preference', {
        planType: planId,
      });

      if (response.data.initPoint) {
        window.location.href = response.data.initPoint;
      } else {
        alert('Erro ao gerar link de pagamento');
      }
    } catch (error: any) {
      console.error('Erro ao criar assinatura:', error);
      alert(error.response?.data?.error || 'Erro ao processar pagamento');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/company/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Escolha o Plano Ideal para Sua Empresa
        </h1>
        <p className="text-xl text-gray-600">
          Encontre talentos incríveis e faça sua empresa crescer
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              plan.popular ? 'border-blue-500 border-2 shadow-xl' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Mais Popular
                </span>
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  R$ {plan.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-gray-600 ml-2">{plan.period}</span>
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0 mt-0.5" />
                    )}
                    <span
                      className={
                        feature.included ? 'text-gray-900' : 'text-gray-400'
                      }
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loading === plan.id}
                className={`w-full ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {loading === plan.id
                  ? 'Processando...'
                  : plan.id === 'FREE'
                  ? 'Plano Atual'
                  : 'Assinar Agora'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center text-gray-600">
        <p className="mb-2">💳 Pagamento seguro via Mercado Pago</p>
        <p className="mb-2">🔒 Cancele quando quiser, sem multas</p>
        <p>✅ Garantia de 7 dias - devolução total do valor</p>
      </div>
    </div>
  );
}

