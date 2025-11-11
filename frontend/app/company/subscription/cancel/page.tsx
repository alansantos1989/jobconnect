'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CancelSubscriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleCancel = async () => {
    if (!confirmed) {
      alert('Por favor, confirme que deseja cancelar sua assinatura.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/payments/cancel-subscription');
      
      alert('Assinatura cancelada com sucesso! Você foi movido para o plano gratuito.');
      router.push('/company/dashboard');
    } catch (error: any) {
      console.error('Erro ao cancelar assinatura:', error);
      alert(error.response?.data?.error || 'Erro ao cancelar assinatura');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/company/plans">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div>
              <CardTitle className="text-2xl text-red-600">Cancelar Assinatura</CardTitle>
              <CardDescription>
                Tem certeza que deseja cancelar sua assinatura?
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ O que acontecerá:</h3>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li>• Você será movido para o <strong>Plano Gratuito</strong></li>
              <li>• Limite de <strong>apenas 1 vaga ativa</strong> por vez</li>
              <li>• Vagas extras serão <strong>desativadas automaticamente</strong></li>
              <li>• Você perderá acesso às funcionalidades premium</li>
              <li>• Não haverá reembolso proporcional</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Alternativas:</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Pausar temporariamente suas vagas ao invés de cancelar</li>
              <li>• Manter o plano até o fim do período já pago</li>
              <li>• Entrar em contato com o suporte para negociar</li>
            </ul>
          </div>

          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="confirm"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="confirm" className="text-sm text-gray-700">
              Eu entendo as consequências e desejo cancelar minha assinatura
            </label>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleCancel}
              disabled={!confirmed || loading}
              variant="destructive"
              className="flex-1"
            >
              {loading ? 'Cancelando...' : 'Confirmar Cancelamento'}
            </Button>
            <Link href="/company/plans" className="flex-1">
              <Button variant="outline" className="w-full">
                Manter Assinatura
              </Button>
            </Link>
          </div>

          <p className="text-xs text-center text-gray-500">
            Ao cancelar, você concorda com nossos{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Termos de Uso
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

