'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
}

interface JobForm {
  id: number;
  companyId: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  externalUrl: string;
}

export default function AdminBulkJobsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<JobForm[]>([
    { id: 1, companyId: '', title: '', description: '', location: '', salary: '', externalUrl: '' }
  ]);

  useEffect(() => {
    if (!isAuthenticated || user?.type !== 'admin') {
      router.push('/login/admin');
      return;
    }
    fetchCompanies();
  }, [isAuthenticated, user]);

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/api/admin/companies', {
        params: { limit: 1000 }
      });
      setCompanies(response.data.companies);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    }
  };

  const addJob = () => {
    setJobs([...jobs, {
      id: Date.now(),
      companyId: '',
      title: '',
      description: '',
      location: '',
      salary: '',
      externalUrl: ''
    }]);
  };

  const removeJob = (id: number) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const updateJob = (id: number, field: string, value: string) => {
    setJobs(jobs.map(job =>
      job.id === id ? { ...job, [field]: value } : job
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const jobsData = jobs.map(job => ({
        companyId: job.companyId,
        title: job.title,
        description: job.description,
        location: job.location,
        salary: job.salary || null,
        externalUrl: job.externalUrl || null,
        remote: false,
        requirements: null,
        benefits: null
      }));

      const response = await api.post('/api/admin/jobs/bulk', { jobs: jobsData });
      alert(`${response.data.results.success.length} vagas criadas com sucesso!`);
      
      if (response.data.results.errors.length > 0) {
        console.error('Erros:', response.data.results.errors);
        alert(`${response.data.results.errors.length} vagas falharam. Verifique o console.`);
      }
      
      router.push('/admin/jobs');
    } catch (error: any) {
      console.error('Erro ao criar vagas:', error);
      alert(error.response?.data?.error || 'Erro ao criar vagas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href="/admin/jobs">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Upload className="h-8 w-8" />
          Criar Vagas em Massa
        </h1>
        <p className="text-gray-600 mt-2">
          Adicione múltiplas vagas de uma vez
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {jobs.map((job, index) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Vaga #{index + 1}</CardTitle>
                {jobs.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeJob(job.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Empresa */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa *
                  </label>
                  <select
                    value={job.companyId}
                    onChange={(e) => updateJob(job.id, 'companyId', e.target.value)}
                    required
                    className="w-full border rounded px-4 py-2"
                  >
                    <option value="">Selecione</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={job.title}
                    onChange={(e) => updateJob(job.id, 'title', e.target.value)}
                    required
                    className="w-full border rounded px-4 py-2"
                    placeholder="Ex: Analista de Dados"
                  />
                </div>

                {/* Localização */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localização *
                  </label>
                  <input
                    type="text"
                    value={job.location}
                    onChange={(e) => updateJob(job.id, 'location', e.target.value)}
                    required
                    className="w-full border rounded px-4 py-2"
                    placeholder="Ex: São Paulo - SP"
                  />
                </div>

                {/* Salário */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salário
                  </label>
                  <input
                    type="text"
                    value={job.salary}
                    onChange={(e) => updateJob(job.id, 'salary', e.target.value)}
                    className="w-full border rounded px-4 py-2"
                    placeholder="Ex: R$ 3.000 - R$ 5.000"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  value={job.description}
                  onChange={(e) => updateJob(job.id, 'description', e.target.value)}
                  required
                  rows={3}
                  className="w-full border rounded px-4 py-2"
                  placeholder="Descreva a vaga..."
                />
              </div>

              {/* URL Externa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Externa (Opcional)
                </label>
                <input
                  type="url"
                  value={job.externalUrl}
                  onChange={(e) => updateJob(job.id, 'externalUrl', e.target.value)}
                  className="w-full border rounded px-4 py-2"
                  placeholder="https://empresa.com/vaga"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Link para candidatura externa
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Botão Adicionar Vaga */}
        <Button
          type="button"
          variant="outline"
          onClick={addJob}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Outra Vaga
        </Button>

        {/* Botões de Ação */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Criando...' : `Criar ${jobs.length} Vaga(s)`}
          </Button>
          <Link href="/admin/jobs" className="flex-1">
            <Button type="button" variant="outline" className="w-full">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

