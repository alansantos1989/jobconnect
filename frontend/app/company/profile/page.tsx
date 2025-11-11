'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, DollarSign, Users, Settings, ArrowLeft, Upload } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CompanyProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, fetchUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('company');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');

  const [profileData, setProfileData] = useState({
    // Dados da empresa
    name: '',
    email: '',
    cnpj: '',
    description: '',
    website: '',
    password: '',
    
    // Contato
    contactName: '',
    contactPhone: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Negócio
    businessSector: '',
    companySize: '',
    employeeCount: '',
    monthlyHiringVolume: '',
    preferredContractType: '',
    turnoverRate: '',
    averageSalary: '',
    slaHours: '48',
    
    // Contrato
    contractActive: true,
    contractStartDate: '',
    contractEndDate: '',
    monthlyRevenue: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      fetchUser().then(() => {
        if (!isAuthenticated) {
          router.push('/login/company');
        }
      });
    } else if (user?.type !== 'company') {
      router.push('/');
    } else {
      fetchProfile();
      if (user.logo) {
        setLogoPreview(user.logo);
      }
    }
  }, [isAuthenticated, user]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/companies/profile`, {
        withCredentials: true
      });
      
      if (response.data) {
        setProfileData({
          ...profileData,
          ...response.data,
          contractStartDate: response.data.contractStartDate ? new Date(response.data.contractStartDate).toISOString().split('T')[0] : '',
          contractEndDate: response.data.contractEndDate ? new Date(response.data.contractEndDate).toISOString().split('T')[0] : '',
          employeeCount: response.data.employeeCount || '',
          monthlyHiringVolume: response.data.monthlyHiringVolume || '',
          turnoverRate: response.data.turnoverRate || '',
          averageSalary: response.data.averageSalary || '',
          monthlyRevenue: response.data.monthlyRevenue || '',
          slaHours: response.data.slaHours || '48',
          password: '',
        });
      }
    } catch (err: any) {
      console.error('Erro ao carregar perfil:', err);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor, envie apenas imagens');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 2MB');
      return;
    }

    setLogoFile(file);
    setError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const dataToUpdate: any = { ...profileData };
      
      // Remove senha se estiver vazia
      if (!dataToUpdate.password) {
        delete dataToUpdate.password;
      }

      await axios.put(`${API_URL}/api/companies/profile`, dataToUpdate, {
        withCredentials: true
      });

      // Upload de logo se houver
      if (logoFile) {
        const formDataLogo = new FormData();
        formDataLogo.append('logo', logoFile);
        await axios.post(`${API_URL}/api/companies/logo`, formDataLogo, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });
      }
      
      setSuccess('Perfil atualizado com sucesso!');
      await fetchUser();
      setProfileData({ ...profileData, password: '' });
      setLogoFile(null);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setProfileData({ ...profileData, [field]: value });
  };

  if (!user) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Carregando...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/company/dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Perfil da Empresa</h1>
        <p className="text-gray-600 mt-2">
          Mantenha as informações da empresa atualizadas para melhor atendimento
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      {/* Logo */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Logo da Empresa</CardTitle>
          <CardDescription>Imagem que representa sua empresa (máx. 2MB)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <label htmlFor="logo-upload" className="cursor-pointer">
                <Button type="button" variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  {logoPreview ? 'Alterar Logo' : 'Enviar Logo'}
                </Button>
              </label>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <p className="text-sm text-gray-500 mt-2">
                PNG, JPG ou GIF até 2MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Contato
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Negócio
            </TabsTrigger>
            <TabsTrigger value="contract" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Contrato
            </TabsTrigger>
          </TabsList>

          {/* Dados da Empresa */}
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
                <CardDescription>
                  Dados cadastrais e informações básicas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Razão Social / Nome Fantasia *
                    </label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CNPJ *
                    </label>
                    <Input
                      value={profileData.cnpj}
                      onChange={(e) => handleChange('cnpj', e.target.value)}
                      placeholder="00.000.000/0000-00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Corporativo *
                    </label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <Input
                      value={profileData.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      placeholder="https://empresa.com.br"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nova Senha (deixe em branco para não alterar)
                    </label>
                    <Input
                      type="password"
                      value={profileData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição da Empresa
                    </label>
                    <textarea
                      value={profileData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={4}
                      placeholder="Descreva sua empresa, missão, valores e área de atuação"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contato */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
                <CardDescription>
                  Dados de contato e localização
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Contato Principal
                    </label>
                    <Input
                      value={profileData.contactName}
                      onChange={(e) => handleChange('contactName', e.target.value)}
                      placeholder="Nome do responsável"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone de Contato
                    </label>
                    <Input
                      value={profileData.contactPhone}
                      onChange={(e) => handleChange('contactPhone', e.target.value)}
                      placeholder="(11) 3456-7890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <Input
                      value={profileData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="São Paulo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <Input
                      value={profileData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP
                    </label>
                    <Input
                      value={profileData.zipCode}
                      onChange={(e) => handleChange('zipCode', e.target.value)}
                      placeholder="01234-567"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Negócio */}
          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Negócio</CardTitle>
                <CardDescription>
                  Dados sobre o porte e operação da empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ramo de Atividade
                    </label>
                    <select
                      value={profileData.businessSector}
                      onChange={(e) => handleChange('businessSector', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione</option>
                      <option value="TI">Tecnologia da Informação</option>
                      <option value="Varejo">Varejo</option>
                      <option value="Indústria">Indústria</option>
                      <option value="Saúde">Saúde</option>
                      <option value="Educação">Educação</option>
                      <option value="Finanças">Finanças</option>
                      <option value="Construção">Construção</option>
                      <option value="Logística">Logística</option>
                      <option value="Alimentação">Alimentação</option>
                      <option value="Serviços">Serviços</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Porte da Empresa
                    </label>
                    <select
                      value={profileData.companySize}
                      onChange={(e) => handleChange('companySize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione</option>
                      <option value="Micro">Micro (até 9 funcionários)</option>
                      <option value="Pequena">Pequena (10-49 funcionários)</option>
                      <option value="Média">Média (50-249 funcionários)</option>
                      <option value="Grande">Grande (250+ funcionários)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Funcionários
                    </label>
                    <Input
                      type="number"
                      value={profileData.employeeCount}
                      onChange={(e) => handleChange('employeeCount', e.target.value)}
                      placeholder="100"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Volume Mensal de Contratações
                    </label>
                    <Input
                      type="number"
                      value={profileData.monthlyHiringVolume}
                      onChange={(e) => handleChange('monthlyHiringVolume', e.target.value)}
                      placeholder="5"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Contrato Preferido
                    </label>
                    <select
                      value={profileData.preferredContractType}
                      onChange={(e) => handleChange('preferredContractType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione</option>
                      <option value="CLT">CLT</option>
                      <option value="PJ">PJ</option>
                      <option value="Temporário">Temporário</option>
                      <option value="Estágio">Estágio</option>
                      <option value="Misto">Misto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Taxa de Turnover (%)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={profileData.turnoverRate}
                      onChange={(e) => handleChange('turnoverRate', e.target.value)}
                      placeholder="15.5"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salário Médio (R$)
                    </label>
                    <Input
                      type="number"
                      value={profileData.averageSalary}
                      onChange={(e) => handleChange('averageSalary', e.target.value)}
                      placeholder="5000"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SLA de Atendimento (horas)
                    </label>
                    <Input
                      type="number"
                      value={profileData.slaHours}
                      onChange={(e) => handleChange('slaHours', e.target.value)}
                      placeholder="48"
                      min="1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contrato */}
          <TabsContent value="contract">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contrato</CardTitle>
                <CardDescription>
                  Dados contratuais e financeiros (uso interno)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status do Contrato
                    </label>
                    <select
                      value={profileData.contractActive ? 'true' : 'false'}
                      onChange={(e) => handleChange('contractActive', e.target.value === 'true')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="true">Ativo</option>
                      <option value="false">Inativo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Receita Mensal Estimada (R$)
                    </label>
                    <Input
                      type="number"
                      value={profileData.monthlyRevenue}
                      onChange={(e) => handleChange('monthlyRevenue', e.target.value)}
                      placeholder="1000"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Início do Contrato
                    </label>
                    <Input
                      type="date"
                      value={profileData.contractStartDate}
                      onChange={(e) => handleChange('contractStartDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Término do Contrato
                    </label>
                    <Input
                      type="date"
                      value={profileData.contractEndDate}
                      onChange={(e) => handleChange('contractEndDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> As informações de contrato são para uso interno e controle administrativo. 
                    Elas não são exibidas publicamente.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-4">
          <Link href="/company/dashboard">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Perfil'}
          </Button>
        </div>
      </form>
    </div>
  );
}

