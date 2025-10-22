'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Zap } from 'lucide-react';

export default function PlansPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.type !== 'company') {
      router.push('/login');
    }
  }, [isAuthenticated, user]);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/payments/create-subscription-preference');
      window.location.href = response.data.initPoint;
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao criar pagamento');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Escolha seu Plano</h1>
        <p className="text-lg text-gray-600">
          Publique vagas e encontre os melhores talentos
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Plano FREE */}
        <Card className={user?.planType === 'FREE' ? 'border-blue-500 border-2' : ''}>
          <CardHeader>
            <CardTitle className="text-2xl">Plano FREE</CardTitle>
            <CardDescription>Para começar</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">R$ 0</span>
              <span className="text-gray-600">/mês</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                <span>1 vaga ativa por vez</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                <span>Acesso a candidatos</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                <span>Dashboard básico</span>
              </li>
            </ul>
            {user?.planType === 'FREE' ? (
              <Button disabled className="w-full">
                Plano Atual
              </Button>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                Fazer Downgrade
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Plano PRO */}
        <Card className={user?.planType === 'PRO' ? 'border-blue-500 border-2' : 'border-blue-300'}>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-2xl">Plano PRO</CardTitle>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Zap className="h-3 w-3 mr-1" />
                Popular
              </span>
            </div>
            <CardDescription>Para empresas em crescimento</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">R$ 99,90</span>
              <span className="text-gray-600">/mês</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-semibold">Vagas ilimitadas</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                <span>Destaque nas vagas</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                <span>Dashboard completo</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                <span>Suporte prioritário</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                <span>Análise de candidatos</span>
              </li>
            </ul>
            {user?.planType === 'PRO' ? (
              <Button disabled className="w-full">
                Plano Atual
              </Button>
            ) : (
              <Button onClick={handleUpgrade} disabled={loading} className="w-full">
                {loading ? 'Processando...' : 'Fazer Upgrade'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-600">
          Pagamento seguro via Mercado Pago • Cancele quando quiser
        </p>
      </div>
    </div>
  );
}

