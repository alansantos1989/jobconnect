'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Briefcase, GraduationCap, Settings, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CandidateProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, fetchUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('personal');

  const [profileData, setProfileData] = useState({
    // Dados pessoais
    name: '',
    email: '',
    phone: '',
    password: '',
    birthDate: '',
    gender: '',
    city: '',
    state: '',
    zipCode: '',
    nationality: 'Brasileira',
    maritalStatus: '',
    
    // Formação
    educationLevel: '',
    course: '',
    fieldOfStudy: '',
    complementaryCourses: '',
    certifications: '',
    
    // Profissional
    currentProfession: '',
    desiredPosition: '',
    skills: '',
    languages: '',
    salaryExpectation: '',
    availability: '',
    contractType: '',
    unemployedMonths: '',
    totalExperience: '',
    lastEmployer: '',
    lastPosition: '',
    lastEmploymentMonths: '',
    workPreference: '',
    preferredCities: '',
    
    // Processo
    source: '',
  });

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
      fetchProfile();
    }
  }, [isAuthenticated, user]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/profile`, {
        withCredentials: true
      });
      
      if (response.data) {
        setProfileData({
          ...profileData,
          ...response.data,
          birthDate: response.data.birthDate ? new Date(response.data.birthDate).toISOString().split('T')[0] : '',
          salaryExpectation: response.data.salaryExpectation || '',
          unemployedMonths: response.data.unemployedMonths || '',
          totalExperience: response.data.totalExperience || '',
          lastEmploymentMonths: response.data.lastEmploymentMonths || '',
          password: '',
        });
      }
    } catch (err: any) {
      console.error('Erro ao carregar perfil:', err);
    }
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

      await axios.put(`${API_URL}/api/users/profile`, dataToUpdate, {
        withCredentials: true
      });
      
      setSuccess('Perfil atualizado com sucesso!');
      await fetchUser();
      setProfileData({ ...profileData, password: '' });
      
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
        <Link href="/candidate/dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-600 mt-2">
          Mantenha suas informações atualizadas para aumentar suas chances de contratação
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

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Pessoal
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Formação
            </TabsTrigger>
            <TabsTrigger value="professional" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Profissional
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Preferências
            </TabsTrigger>
          </TabsList>

          {/* Dados Pessoais */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Dados básicos e informações de contato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
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
                      Telefone *
                    </label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="(11) 98765-4321"
                      required
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Nascimento
                    </label>
                    <Input
                      type="date"
                      value={profileData.birthDate}
                      onChange={(e) => handleChange('birthDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gênero
                    </label>
                    <select
                      value={profileData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Outro">Outro</option>
                      <option value="Prefiro não informar">Prefiro não informar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado Civil
                    </label>
                    <select
                      value={profileData.maritalStatus}
                      onChange={(e) => handleChange('maritalStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione</option>
                      <option value="Solteiro(a)">Solteiro(a)</option>
                      <option value="Casado(a)">Casado(a)</option>
                      <option value="Divorciado(a)">Divorciado(a)</option>
                      <option value="Viúvo(a)">Viúvo(a)</option>
                    </select>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nacionalidade
                    </label>
                    <Input
                      value={profileData.nationality}
                      onChange={(e) => handleChange('nationality', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Formação */}
          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle>Formação Acadêmica</CardTitle>
                <CardDescription>
                  Informações sobre sua educação e qualificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nível de Escolaridade
                    </label>
                    <select
                      value={profileData.educationLevel}
                      onChange={(e) => handleChange('educationLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione</option>
                      <option value="Ensino Fundamental">Ensino Fundamental</option>
                      <option value="Ensino Médio">Ensino Médio</option>
                      <option value="Técnico">Técnico</option>
                      <option value="Graduação">Graduação</option>
                      <option value="Pós-graduação">Pós-graduação</option>
                      <option value="Mestrado">Mestrado</option>
                      <option value="Doutorado">Doutorado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Curso
                    </label>
                    <Input
                      value={profileData.course}
                      onChange={(e) => handleChange('course', e.target.value)}
                      placeholder="Ex: Administração de Empresas"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Área de Formação
                    </label>
                    <select
                      value={profileData.fieldOfStudy}
                      onChange={(e) => handleChange('fieldOfStudy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione</option>
                      <option value="Administração">Administração</option>
                      <option value="TI">Tecnologia da Informação</option>
                      <option value="Engenharia">Engenharia</option>
                      <option value="Saúde">Saúde</option>
                      <option value="Educação">Educação</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Vendas">Vendas</option>
                      <option value="Finanças">Finanças</option>
                      <option value="Direito">Direito</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Idiomas
                    </label>
                    <Input
                      value={profileData.languages}
                      onChange={(e) => handleChange('languages', e.target.value)}
                      placeholder="Ex: Inglês (Avançado), Espanhol (Intermediário)"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cursos Complementares
                    </label>
                    <textarea
                      value={profileData.complementaryCourses}
                      onChange={(e) => handleChange('complementaryCourses', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                      placeholder="Liste seus cursos complementares, um por linha"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certificações
                    </label>
                    <textarea
                      value={profileData.certifications}
                      onChange={(e) => handleChange('certifications', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                      placeholder="Liste suas certificações, uma por linha"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profissional */}
          <TabsContent value="professional">
            <Card>
              <CardHeader>
                <CardTitle>Experiência Profissional</CardTitle>
                <CardDescription>
                  Informações sobre sua carreira e experiência
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profissão Atual
                    </label>
                    <Input
                      value={profileData.currentProfession}
                      onChange={(e) => handleChange('currentProfession', e.target.value)}
                      placeholder="Ex: Analista de Marketing"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo Pretendido
                    </label>
                    <Input
                      value={profileData.desiredPosition}
                      onChange={(e) => handleChange('desiredPosition', e.target.value)}
                      placeholder="Ex: Gerente de Marketing"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experiência Total (anos)
                    </label>
                    <Input
                      type="number"
                      value={profileData.totalExperience}
                      onChange={(e) => handleChange('totalExperience', e.target.value)}
                      placeholder="5"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tempo Desempregado (meses)
                    </label>
                    <Input
                      type="number"
                      value={profileData.unemployedMonths}
                      onChange={(e) => handleChange('unemployedMonths', e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Último Empregador
                    </label>
                    <Input
                      value={profileData.lastEmployer}
                      onChange={(e) => handleChange('lastEmployer', e.target.value)}
                      placeholder="Nome da empresa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Último Cargo
                    </label>
                    <Input
                      value={profileData.lastPosition}
                      onChange={(e) => handleChange('lastPosition', e.target.value)}
                      placeholder="Cargo ocupado"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tempo no Último Emprego (meses)
                    </label>
                    <Input
                      type="number"
                      value={profileData.lastEmploymentMonths}
                      onChange={(e) => handleChange('lastEmploymentMonths', e.target.value)}
                      placeholder="24"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pretensão Salarial (R$)
                    </label>
                    <Input
                      type="number"
                      value={profileData.salaryExpectation}
                      onChange={(e) => handleChange('salaryExpectation', e.target.value)}
                      placeholder="5000"
                      min="0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Habilidades
                    </label>
                    <textarea
                      value={profileData.skills}
                      onChange={(e) => handleChange('skills', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                      placeholder="Ex: Excel, Java, Vendas, Liderança (separe por vírgula)"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferências */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Trabalho</CardTitle>
                <CardDescription>
                  Suas preferências para oportunidades de emprego
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Disponibilidade
                    </label>
                    <select
                      value={profileData.availability}
                      onChange={(e) => handleChange('availability', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione</option>
                      <option value="Imediato">Imediato</option>
                      <option value="7 dias">7 dias</option>
                      <option value="15 dias">15 dias</option>
                      <option value="30 dias">30 dias</option>
                      <option value="A combinar">A combinar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Contrato
                    </label>
                    <select
                      value={profileData.contractType}
                      onChange={(e) => handleChange('contractType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione</option>
                      <option value="CLT">CLT</option>
                      <option value="PJ">PJ</option>
                      <option value="Temporário">Temporário</option>
                      <option value="Estágio">Estágio</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Qualquer">Qualquer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferência de Trabalho
                    </label>
                    <select
                      value={profileData.workPreference}
                      onChange={(e) => handleChange('workPreference', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione</option>
                      <option value="Remoto">Remoto</option>
                      <option value="Híbrido">Híbrido</option>
                      <option value="Presencial">Presencial</option>
                      <option value="Qualquer">Qualquer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Como nos conheceu?
                    </label>
                    <select
                      value={profileData.source}
                      onChange={(e) => handleChange('source', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="InfoJobs">InfoJobs</option>
                      <option value="Google">Google</option>
                      <option value="Indicação">Indicação</option>
                      <option value="Redes Sociais">Redes Sociais</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidades de Preferência
                    </label>
                    <Input
                      value={profileData.preferredCities}
                      onChange={(e) => handleChange('preferredCities', e.target.value)}
                      placeholder="Ex: São Paulo, Rio de Janeiro, Belo Horizonte"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-4">
          <Link href="/candidate/dashboard">
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

