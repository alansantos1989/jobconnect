'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Briefcase } from 'lucide-react';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
}

export default function AdminCreateJobPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyId: '',
    title: '',
    description: '',
    requirements: '',
    location: '',
    remote: false,
    salary: '',
    benefits: '',
    externalUrl: ''
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/admin/jobs', formData);
      alert('Vaga criada com sucesso!');
      router.push('/admin/jobs');
    } catch (error: any) {
      console.error('Erro ao criar vaga:', error);
      alert(error.response?.data?.error || 'Erro ao criar vaga');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href="/admin/jobs">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Briefcase className="h-8 w-8" />
          Criar Nova Vaga
        </h1>
        <p className="text-gray-600 mt-2">
          Crie uma vaga para uma empresa cadastrada na plataforma
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Vaga</CardTitle>
          <CardDescription>
            Preencha todos os campos obrigatórios para criar a vaga
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Empresa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa *
              </label>
              <select
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                required
                className="w-full border rounded px-4 py-2"
              >
                <option value="">Selecione uma empresa</option>
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
                Título da Vaga *
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ex: Desenvolvedor Full Stack Sênior"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Descreva as responsabilidades e o que a empresa oferece..."
              />
            </div>

            {/* Requisitos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requisitos
              </label>
              <Textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                placeholder="Liste os requisitos necessários para a vaga..."
              />
            </div>

            {/* Localização */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localização *
              </label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Ex: São Paulo - SP"
              />
            </div>

            {/* Remoto */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="remote"
                checked={formData.remote}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium text-gray-700">
                Trabalho Remoto
              </label>
            </div>

            {/* Salário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salário
              </label>
              <Input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Ex: R$ 5.000 - R$ 8.000"
              />
            </div>

            {/* Benefícios */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefícios
              </label>
              <Textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                rows={3}
                placeholder="Liste os benefícios oferecidos..."
              />
            </div>

            {/* URL Externa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Externa (Opcional)
              </label>
              <Input
                type="url"
                name="externalUrl"
                value={formData.externalUrl}
                onChange={handleChange}
                placeholder="https://empresa.com/vaga"
              />
              <p className="text-sm text-gray-500 mt-1">
                Se preenchido, o botão "Candidatar-se" redirecionará para este link
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Criando...' : 'Criar Vaga'}
              </Button>
              <Link href="/admin/jobs" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

