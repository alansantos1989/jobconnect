'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, FileText, User, Send } from 'lucide-react';

export default function CandidateDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, fetchUser } = useAuthStore();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      fetchUser().then(() => {
        if (!isAuthenticated) {
          router.push('/login');
        }
      });
    } else if (user?.type !== 'user') {
      router.push('/');
    } else {
      fetchApplications();
    }
  }, [isAuthenticated, user]);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/api/applications/user');
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Erro ao buscar candidaturas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Carregando...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bem-vindo, {user.name}!</h1>
        <p className="text-gray-600 mt-2">Gerencie seu perfil e acompanhe suas candidaturas</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link href="/candidate/profile">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Meu Perfil</CardTitle>
              <CardDescription>Edite suas informações pessoais</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/candidate/resume">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Meu Currículo</CardTitle>
              <CardDescription>Atualize seu currículo</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/jobs">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Buscar Vagas</CardTitle>
              <CardDescription>Encontre novas oportunidades</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Minhas Candidaturas</CardTitle>
          <CardDescription>Acompanhe o status das suas candidaturas</CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <Send className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Você ainda não se candidatou a nenhuma vaga</p>
              <Link href="/jobs">
                <Button>Buscar Vagas</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app: any) => (
                <div key={app.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{app.job.title}</h3>
                      <p className="text-gray-600">{app.job.company.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Candidatura enviada em {new Date(app.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      app.status === 'REVIEWED' ? 'bg-blue-100 text-blue-800' :
                      app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {app.status === 'PENDING' ? 'Pendente' :
                       app.status === 'REVIEWED' ? 'Em análise' :
                       app.status === 'ACCEPTED' ? 'Aceita' : 'Rejeitada'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

