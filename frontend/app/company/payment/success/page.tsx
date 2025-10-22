'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Pagamento Aprovado!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Seu pagamento foi processado com sucesso. Você já pode aproveitar todos os benefícios do seu plano.
          </p>
          <div className="space-y-2">
            <Link href="/company/dashboard">
              <Button className="w-full">
                Ir para Dashboard
              </Button>
            </Link>
            <Link href="/company/jobs/new">
              <Button variant="outline" className="w-full">
                Publicar Nova Vaga
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

