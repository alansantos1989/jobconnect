'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, Plus, Building2 } from 'lucide-react';

export default function CompanyDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, fetchUser } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initDashboard = async () => {
      try {
        if (!isAuthenticated) {
          await fetchUser();
        }
        
        // Aguardar um pouco para garantir que o user foi carregado
        setTimeout(() => {
          const currentUser = useAuthStore.getState().user;
          if (!currentUser) {
            router.push('/login/company');
          } else if (currentUser.type !== 'company') {
            router.push('/');
          } else {
            fetchData();
          }
        }, 100);
      } catch (err) {
        console.error('Erro ao inicializar dashboard:', err);
        router.push('/login/company');
      }
    };

    initDashboard();
  }, []);

  const fetchData = async () => {
    try {
      setError('');
      const [statsRes, jobsRes] = await Promise.all([
        api.get('/api/companies/stats'),
        api.get('/api/jobs/company/my-jobs'),
      ]);
      
      setStats(statsRes.data.stats);
      setJobs(jobsRes.data.jobs || []);
    } catch (error: any) {
      console.error('Erro ao buscar dados:', error);
      setError(error.response?.data?.error || 'Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">Erro ao Carregar Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchData}>Tentar Novamente</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p>Carregando informações do usuário...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard da Empresa</h1>
          <p className="text-gray-600 mt-2">{user.name}</p>
        </div>
        <Link href="/company/jobs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Vaga
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Vagas Ativas</CardDescription>
            <CardTitle className="text-3xl">{stats.activeJobs}/{stats.maxJobs}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-600">
              <Briefcase className="h-4 w-4 mr-1" />
              Plano {stats.planType}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Candidaturas</CardDescription>
            <CardTitle className="text-3xl">{stats.totalApplications}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              Total recebidas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Plano Atual</CardDescription>
            <CardTitle className="text-2xl">{stats.planType}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/company/plans">
              <Button variant="outline" size="sm" className="w-full">
                Fazer Upgrade
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ações Rápidas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/company/profile">
              <Button variant="outline" size="sm" className="w-full">
                <Building2 className="h-4 w-4 mr-2" />
                Perfil
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle>Minhas Vagas</CardTitle>
          <CardDescription>Gerencie suas vagas publicadas</CardDescription>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Você ainda não publicou nenhuma vaga</p>
              <Link href="/company/jobs/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Publicar Primeira Vaga
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job: any) => (
                <div key={job.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-gray-600">{job.location}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span>{job._count?.applications || 0} candidaturas</span>
                        <span>Publicada em {new Date(job.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/company/jobs/${job.id}/applications`}>
                        <Button variant="outline" size="sm">
                          Ver Candidatos
                        </Button>
                      </Link>
                      <Link href={`/company/jobs/${job.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </Link>
                    </div>
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

