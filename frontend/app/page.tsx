'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Briefcase, Building2, TrendingUp, Users, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Conectando Talentos e Oportunidades
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              A plataforma completa para encontrar o emprego dos seus sonhos ou o candidato ideal
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs">
                <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Search className="mr-2 h-5 w-5" />
                  Buscar Vagas
                </Button>
              </Link>
              <Link href="/register/company">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-400">
                  <Building2 className="mr-2 h-5 w-5" />
                  Anunciar Vaga
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher o JobConnect?
            </h2>
            <p className="text-lg text-gray-600">
              A solução completa para recrutamento e seleção
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Para Candidatos</CardTitle>
                <CardDescription>
                  Encontre as melhores oportunidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Milhares de vagas disponíveis</li>
                  <li>✓ Busca avançada com filtros</li>
                  <li>✓ Candidatura em um clique</li>
                  <li>✓ Acompanhamento de status</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Para Empresas</CardTitle>
                <CardDescription>
                  Encontre os melhores talentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Publicação de vagas ilimitadas (PRO)</li>
                  <li>✓ Gestão de candidaturas</li>
                  <li>✓ Destaque para suas vagas</li>
                  <li>✓ Dashboard completo</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>
                  Seus dados protegidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Criptografia de ponta a ponta</li>
                  <li>✓ Dados seguros</li>
                  <li>✓ Privacidade garantida</li>
                  <li>✓ Conformidade com LGPD</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12" />
              </div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Candidatos Cadastrados</div>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Building2 className="h-12 w-12" />
              </div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Empresas Parceiras</div>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12" />
              </div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-blue-100">Vagas Publicadas</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Cadastre-se agora e encontre a oportunidade perfeita
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register/candidate">
              <Button size="lg">
                Cadastrar como Candidato
              </Button>
            </Link>
            <Link href="/register/company">
              <Button size="lg" variant="outline">
                Cadastrar como Empresa
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2025 JobConnect. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

