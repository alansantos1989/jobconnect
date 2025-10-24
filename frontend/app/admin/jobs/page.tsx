'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Search, Briefcase, Edit, Plus, Upload } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: string | null;
  status: string;
  createdAt: string;
  company: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    applications: number;
  };
}

export default function AdminJobsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  useEffect(() => {
    if (!isAuthenticated || user?.type !== 'admin') {
      router.push('/login/admin');
      return;
    }
    fetchJobs();
  }, [isAuthenticated, user, page, search, statusFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/jobs', {
        params: { page, limit: 10, search, status: statusFilter }
      });
      setJobs(response.data.jobs);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta vaga?')) return;

    try {
      await api.delete(`/api/admin/jobs/${id}`);
      fetchJobs();
    } catch (error) {
      console.error('Erro ao deletar vaga:', error);
      alert('Erro ao deletar vaga');
    }
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    if (!confirm(`Alterar status para ${newStatus}?`)) return;

    try {
      await api.patch(`/api/admin/jobs/${id}/status`, { status: newStatus });
      fetchJobs();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="h-8 w-8" />
            Gerenciar Vagas
          </h1>
          <p className="text-gray-600 mt-2">
            Total de {pagination.total} vagas cadastradas
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/jobs/bulk">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Criar em Massa
            </Button>
          </Link>
          <Link href="/admin/jobs/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Vaga
            </Button>
          </Link>
        </div>
      </div>

      {/* Barra de pesquisa e filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por título, descrição ou localização..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded px-4 py-2"
            >
              <option value="">Todos os status</option>
              <option value="ACTIVE">Ativas</option>
              <option value="CLOSED">Fechadas</option>
            </select>
            <Button type="submit">Buscar</Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de vagas */}
      <Card>
        <CardHeader>
          <CardTitle>Vagas</CardTitle>
          <CardDescription>
            Lista de todas as vagas cadastradas na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Título</th>
                  <th className="text-left py-3 px-4">Empresa</th>
                  <th className="text-left py-3 px-4">Localização</th>
                  <th className="text-left py-3 px-4">Salário</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Candidaturas</th>
                  <th className="text-left py-3 px-4">Criada em</th>
                  <th className="text-left py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{job.title}</td>
                    <td className="py-3 px-4 text-gray-600">{job.company.name}</td>
                    <td className="py-3 px-4 text-gray-600">{job.location}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {job.salary || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        job.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status === 'ACTIVE' ? 'Ativa' : 'Fechada'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {job._count.applications}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(job.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(job.id, job.status)}
                          title="Alterar status"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(job.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4">
                Página {page} de {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

