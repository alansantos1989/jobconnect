'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, Plus, TrendingUp, Building2, CreditCard } from 'lucide-react';

export default function CompanyDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, fetchUser } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      fetchUser().then(() => {
        if (!isAuthenticated) {
          router.push('/login');
        }
      });
    } else if (user?.type !== 'company') {
      router.push('/');
    } else {
      fetchData();
    }
  }, [isAuthenticated, user]);

  const fetchData = async () => {
    try {
      const [statsRes, jobsRes] = await Promise.all([
        api.get('/api/companies/stats'),
        api.get('/api/jobs/company/my-jobs'),
      ]);
      setStats(statsRes.data.stats);
      setJobs(jobsRes.data.jobs);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Carregando...</div>;
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
                        <span>{job._count.applications} candidaturas</span>
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

