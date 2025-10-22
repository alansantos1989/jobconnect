'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type AccountType = 'user' | 'company' | 'admin';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = useState({
    accountType: 'user' as AccountType,
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAccountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as AccountType;
    console.log('[LOGIN] Tipo de conta selecionado:', newType);
    setFormData(prev => ({
      ...prev,
      accountType: newType
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      email: e.target.value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      password: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('[LOGIN] Tentando fazer login com:', {
      email: formData.email,
      type: formData.accountType
    });

    try {
      await login(formData.email, formData.password, formData.accountType);
      
      console.log('[LOGIN] Login bem-sucedido! Redirecionando para:', formData.accountType);
      
      // Redirecionar baseado no tipo de usuário
      if (formData.accountType === 'user') {
        console.log('[LOGIN] Redirecionando para /candidate/dashboard');
        router.push('/candidate/dashboard');
      } else if (formData.accountType === 'company') {
        console.log('[LOGIN] Redirecionando para /company/dashboard');
        router.push('/company/dashboard');
      } else if (formData.accountType === 'admin') {
        console.log('[LOGIN] Redirecionando para /admin/dashboard');
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      console.error('[LOGIN] Erro ao fazer login:', err);
      setError(err.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Entrar no JobConnect</CardTitle>
          <CardDescription className="text-center">
            Entre com sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de conta
              </label>
              <select
                value={formData.accountType}
                onChange={handleAccountTypeChange}
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="user">Candidato</option>
                <option value="company">Empresa</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={handleEmailChange}
                required
                placeholder="seu@email.com"
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={handlePasswordChange}
                required
                placeholder="••••••••"
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
              <strong>Tipo selecionado:</strong> {
                formData.accountType === 'user' ? 'Candidato' :
                formData.accountType === 'company' ? 'Empresa' :
                'Administrador'
              }
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Não tem uma conta?{' '}
              <Link href="/register/candidate" className="text-blue-600 hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

