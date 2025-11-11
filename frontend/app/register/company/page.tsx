'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function RegisterCompanyPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('FREE');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cnpj: '',
    description: '',
    website: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const plans = [
    {
      type: 'FREE',
      name: 'Plano Gratuito',
      price: 'R$ 0',
      period: '/mês',
      features: [
        '1 vaga ativa por vez',
        'Acesso básico ao banco de talentos',
        'Suporte por email',
        'Perfil da empresa básico'
      ],
      color: 'gray'
    },
    {
      type: 'PRO',
      name: 'Plano Profissional',
      price: 'R$ 99,90',
      period: '/mês',
      features: [
        '10 vagas ativas simultaneamente',
        'Acesso completo ao banco de talentos',
        'Suporte prioritário',
        'Perfil da empresa destacado',
        'Estatísticas avançadas',
        'Divulgação em destaque'
      ],
      color: 'blue',
      popular: true
    },
    {
      type: 'ENTERPRISE',
      name: 'Plano Empresarial',
      price: 'R$ 299,90',
      period: '/mês',
      features: [
        'Vagas ilimitadas',
        'Acesso VIP ao banco de talentos',
        'Gerente de conta dedicado',
        'Perfil premium com destaque',
        'Relatórios personalizados',
        'API de integração',
        'Treinamento da equipe'
      ],
      color: 'purple'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('[REGISTER] Iniciando registro de empresa com plano:', selectedPlan);
      
      // Adicionar planType ao formData
      const dataToSend = {
        ...formData,
        planType: selectedPlan
      };
      
      // Chamar a função register do authStore
      await register(dataToSend, 'company');
      console.log('[REGISTER] Registro concluído com sucesso!');
      
      // Aguardar um pouco para garantir que o authStore foi atualizado
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verificar se está autenticado
      const isAuth = useAuthStore.getState().isAuthenticated;
      const user = useAuthStore.getState().user;
      console.log('[REGISTER] Estado de autenticação:', isAuth, user);
      
      if (isAuth && user) {
        console.log('[REGISTER] Redirecionando para /company/dashboard...');
        
        // Se escolheu plano pago, redirecionar para pagamento
        if (selectedPlan !== 'FREE') {
          window.location.href = '/company/plans';
        } else {
          window.location.href = '/company/dashboard';
        }
      } else {
        throw new Error('Falha na autenticação após registro');
      }
    } catch (err: any) {
      console.error('[REGISTER] Erro ao registrar:', err);
      setError(err.response?.data?.error || err.message || 'Erro ao criar conta');
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Escolha o Plano Ideal para sua Empresa
            </h1>
            <p className="text-xl text-gray-600">
              Comece gratuitamente ou escolha um plano com mais recursos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {plans.map((plan) => (
              <Card
                key={plan.type}
                className={`relative cursor-pointer transition-all ${
                  selectedPlan === plan.type
                    ? 'ring-2 ring-blue-600 shadow-lg'
                    : 'hover:shadow-md'
                } ${plan.popular ? 'border-blue-600' : ''}`}
                onClick={() => setSelectedPlan(plan.type)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    type="button"
                    className="w-full"
                    variant={selectedPlan === plan.type ? 'default' : 'outline'}
                    onClick={() => setSelectedPlan(plan.type)}
                  >
                    {selectedPlan === plan.type ? 'Selecionado' : 'Selecionar'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => setStep(2)}
              className="px-8"
            >
              Continuar com Plano {plans.find(p => p.type === selectedPlan)?.name}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Cadastro de Empresa</CardTitle>
          <CardDescription className="text-center">
            Plano selecionado: <strong>{plans.find(p => p.type === selectedPlan)?.name}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da empresa
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Empresa LTDA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CNPJ
              </label>
              <Input
                type="text"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                required
                placeholder="00.000.000/0000-00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email corporativo
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="contato@empresa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição da empresa (opcional)
              </label>
              <Input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Breve descrição"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website (opcional)
              </label>
              <Input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://empresa.com"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 mr-2"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  Li e aceito os{' '}
                  <Link href="/terms" target="_blank" className="text-blue-600 hover:underline">
                    Termos de Uso
                  </Link>
                </label>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={acceptedPrivacy}
                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                  className="mt-1 mr-2"
                  required
                />
                <label htmlFor="privacy" className="text-sm text-gray-600">
                  Li e aceito a{' '}
                  <Link href="/privacy" target="_blank" className="text-blue-600 hover:underline">
                    Política de Privacidade
                  </Link>
                  {' '}e autorizo o tratamento dos dados da empresa conforme a LGPD
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !acceptedTerms || !acceptedPrivacy} 
                className="flex-1"
              >
                {loading ? 'Criando...' : 'Criar conta'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link href="/login/company" className="text-blue-600 hover:text-blue-700 font-medium">
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

