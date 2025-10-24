'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Search, Building2, Edit } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  email: string;
  cnpj: string;
  planType: string;
  subscriptionStatus: string | null;
  createdAt: string;
  _count: {
    jobs: number;
  };
}

export default function AdminCompaniesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  useEffect(() => {
    if (!isAuthenticated || user?.type !== 'admin') {
      router.push('/login/admin');
      return;
    }
    fetchCompanies();
  }, [isAuthenticated, user, page, search]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/companies', {
        params: { page, limit: 10, search }
      });
      setCompanies(response.data.companies);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta empresa?')) return;

    try {
      await api.delete(`/api/admin/companies/${id}`);
      fetchCompanies();
    } catch (error) {
      console.error('Erro ao deletar empresa:', error);
      alert('Erro ao deletar empresa');
    }
  };

  const handleUpdatePlan = async (id: string, currentPlan: string) => {
    const newPlan = currentPlan === 'FREE' ? 'PRO' : 'FREE';
    if (!confirm(`Alterar plano para ${newPlan}?`)) return;

    try {
      await api.patch(`/api/admin/companies/${id}/plan`, { planType: newPlan });
      fetchCompanies();
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
      alert('Erro ao atualizar plano');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCompanies();
  };

  if (loading && companies.length === 0) {
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          Gerenciar Empresas
        </h1>
        <p className="text-gray-600 mt-2">
          Total de {pagination.total} empresas cadastradas
        </p>
      </div>

      {/* Barra de pesquisa */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nome, email ou CNPJ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Buscar</Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de empresas */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas</CardTitle>
          <CardDescription>
            Lista de todas as empresas cadastradas na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Nome</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">CNPJ</th>
                  <th className="text-left py-3 px-4">Plano</th>
                  <th className="text-left py-3 px-4">Vagas</th>
                  <th className="text-left py-3 px-4">Cadastro</th>
                  <th className="text-left py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{company.name}</td>
                    <td className="py-3 px-4 text-gray-600">{company.email}</td>
                    <td className="py-3 px-4 text-gray-600">{company.cnpj}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        company.planType === 'PRO' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {company.planType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {company._count.jobs}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(company.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdatePlan(company.id, company.planType)}
                          title="Alterar plano"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(company.id)}
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

