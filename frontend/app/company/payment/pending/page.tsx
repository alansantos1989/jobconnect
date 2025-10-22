'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import Link from 'next/link';

export default function PaymentPendingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">Pagamento Pendente</CardTitle>
          <CardDescription>
            Aguardando confirmação do pagamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-600">
            <p className="mb-4">
              Seu pagamento está sendo processado.
            </p>
            <p className="mb-4">
              Você receberá um email assim que o pagamento for confirmado.
            </p>
            <p className="text-sm text-gray-500">
              Este processo pode levar alguns minutos.
            </p>
          </div>

          <div className="space-y-2">
            <Link href="/company/dashboard" className="block">
              <Button className="w-full" variant="default">
                Voltar ao Dashboard
              </Button>
            </Link>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-blue-800">
              <strong>Boleto bancário:</strong> O pagamento pode levar até 3 dias úteis para ser confirmado.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

