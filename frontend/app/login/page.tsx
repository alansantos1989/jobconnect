'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, User, Shield } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Bem-vindo ao JobConnect</h1>
          <p className="text-gray-600">Selecione o tipo de conta para fazer login</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Candidato */}
          <Link href="/login/candidate">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-500">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Candidato</CardTitle>
                <CardDescription>
                  Busque vagas e candidate-se
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Buscar vagas</li>
                  <li>✓ Candidatar-se</li>
                  <li>✓ Acompanhar status</li>
                  <li>✓ Gerenciar perfil</li>
                </ul>
                <div className="mt-4 text-center">
                  <span className="text-green-600 font-medium">Entrar como Candidato →</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Empresa */}
          <Link href="/login/company">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Empresa</CardTitle>
                <CardDescription>
                  Publique vagas e contrate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Publicar vagas</li>
                  <li>✓ Gerenciar candidatos</li>
                  <li>✓ Planos flexíveis</li>
                  <li>✓ Dashboard completo</li>
                </ul>
                <div className="mt-4 text-center">
                  <span className="text-blue-600 font-medium">Entrar como Empresa →</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Administrador */}
          <Link href="/login/admin">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-500">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Administrador</CardTitle>
                <CardDescription>
                  Gerencie a plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Gerenciar usuários</li>
                  <li>✓ Gerenciar empresas</li>
                  <li>✓ Moderar vagas</li>
                  <li>✓ Relatórios</li>
                </ul>
                <div className="mt-4 text-center">
                  <span className="text-purple-600 font-medium">Entrar como Admin →</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/register/candidate" className="text-blue-600 hover:underline font-medium">
              Cadastre-se como candidato
            </Link>
            {' '}ou{' '}
            <Link href="/register/company" className="text-blue-600 hover:underline font-medium">
              cadastre sua empresa
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

