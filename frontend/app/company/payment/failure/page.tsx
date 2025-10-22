'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailurePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Pagamento Cancelado</CardTitle>
          <CardDescription>
            Seu pagamento não foi processado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-600">
            <p className="mb-4">
              O pagamento foi cancelado ou ocorreu um erro durante o processamento.
            </p>
            <p className="mb-4">
              Não se preocupe, nenhum valor foi cobrado.
            </p>
          </div>

          <div className="space-y-2">
            <Link href="/company/plans" className="block">
              <Button className="w-full" variant="default">
                Tentar Novamente
              </Button>
            </Link>
            <Link href="/company/dashboard" className="block">
              <Button className="w-full" variant="outline">
                Voltar ao Dashboard
              </Button>
            </Link>
          </div>

          <div className="text-center text-sm text-gray-500 mt-6">
            <p>Precisa de ajuda?</p>
            <p>Entre em contato com nosso suporte</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

