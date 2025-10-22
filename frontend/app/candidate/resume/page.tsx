'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, FileText, Upload, Download, Trash2, Save, Plus, X } from 'lucide-react';
import Link from 'next/link';

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export default function CandidateResumePage() {
  const router = useRouter();
  const { user, isAuthenticated, fetchUser } = useAuthStore();
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

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
      fetchResume();
    }
  }, [isAuthenticated, user]);

  const fetchResume = async () => {
    try {
      const response = await api.get('/api/users/resume');
      setResume(response.data.resume || {
        skills: [],
        experiences: [],
        education: [],
      });
    } catch (err) {
      console.error('Erro ao buscar currículo:', err);
      setResume({
        skills: [],
        experiences: [],
        education: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResume = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await api.put('/api/users/resume', { resume });
      setSuccess('Currículo atualizado com sucesso!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao atualizar currículo');
    } finally {
      setSaving(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Por favor, envie apenas arquivos PDF');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('O arquivo deve ter no máximo 5MB');
      return;
    }

    setPdfFile(file);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      await api.post('/api/users/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Currículo em PDF enviado com sucesso!');
      await fetchUser();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao enviar currículo');
    }
  };

  const addSkill = () => {
    setResume({
      ...resume,
      skills: [...(resume.skills || []), ''],
    });
  };

  const removeSkill = (index: number) => {
    const newSkills = resume.skills.filter((_: any, i: number) => i !== index);
    setResume({ ...resume, skills: newSkills });
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...resume.skills];
    newSkills[index] = value;
    setResume({ ...resume, skills: newSkills });
  };

  if (loading || !user) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Carregando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/candidate/dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Meu Currículo</h1>
        <p className="text-gray-600 mt-2">Mantenha seu currículo sempre atualizado</p>
      </div>

      {/* Upload de PDF */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle>Currículo em PDF</CardTitle>
              <CardDescription>Envie seu currículo em formato PDF (máx. 5MB)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user.resumePdf && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium">Currículo atual</p>
                    <p className="text-sm text-gray-600">PDF enviado</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={user.resumePdf} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Baixar
                    </Button>
                  </a>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="pdf-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Clique para {user.resumePdf ? 'atualizar' : 'enviar'} seu currículo em PDF
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Máximo 5MB</p>
                </div>
              </label>
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                className="hidden"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Habilidades */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Habilidades</CardTitle>
          <CardDescription>Liste suas principais habilidades e competências</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {resume.skills?.map((skill: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={skill}
                  onChange={(e) => updateSkill(index, e.target.value)}
                  placeholder="Ex: JavaScript, React, Node.js"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeSkill(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addSkill} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Habilidade
            </Button>
          </div>
        </CardContent>
      </Card>

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center gap-2">
          <Save className="h-4 w-4" />
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button onClick={handleSaveResume} disabled={saving} className="flex-1">
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Salvando...' : 'Salvar Currículo'}
        </Button>
        <Link href="/candidate/dashboard" className="flex-1">
          <Button type="button" variant="outline" className="w-full">
            Cancelar
          </Button>
        </Link>
      </div>
    </div>
  );
}

