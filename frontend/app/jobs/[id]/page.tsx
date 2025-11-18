'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Building2, Calendar, Briefcase } from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [params.id]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/api/jobs/${params.id}`);
      setJob(response.data.job);
    } catch (error) {
      console.error('Erro ao buscar vaga:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    // Se a vaga tem link externo, redirecionar
    if (job?.externalUrl) {
      window.open(job.externalUrl, '_blank');
      return;
    }

    // Vagas internas requerem autenticação
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.type !== 'user') {
      alert('Apenas candidatos podem se candidatar a vagas');
      return;
    }

    setApplying(true);
    try {
      await api.post('/api/applications', { jobId: params.id });
      setApplied(true);
      alert('Candidatura enviada com sucesso!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao enviar candidatura');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-8">Carregando...</div>;
  }

  if (!job) {
    return <div className="max-w-4xl mx-auto px-4 py-8">Vaga não encontrada</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            {job.remote && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Remoto
              </span>
            )}
            {job.featured && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Destaque
              </span>
            )}
          </div>
          <CardTitle className="text-3xl">{job.title}</CardTitle>
          <CardDescription className="flex flex-wrap gap-4 text-base mt-2">
            <span className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {job.company.name}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {job.location}
            </span>
            {job.salary && (
              <span className="font-medium text-green-600">
                {job.salary}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Descrição da vaga</h3>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>

          {job.requirements && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Requisitos</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button
              onClick={handleApply}
              disabled={applying || applied}
              size="lg"
              className="w-full md:w-auto"
            >
              {job?.externalUrl ? 'Ver vaga no site' : (applied ? 'Candidatura enviada' : applying ? 'Enviando...' : 'Candidatar-se')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

