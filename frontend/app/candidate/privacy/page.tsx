'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Trash2, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CandidatePrivacyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleExportData = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.get(`${API_URL}/api/lgpd/export-data`, {
        withCredentials: true
      });

      // Criar arquivo JSON para download
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `meus-dados-jobconnect-${new Date().toISOString().split('T')[0]}.json`;
      link.click();

      setSuccess('Seus dados foram exportados com sucesso!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao exportar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'CONFIRMO A EXCLUSÃO') {
      setError('Digite exatamente: CONFIRMO A EXCLUSÃO');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.delete(`${API_URL}/api/lgpd/delete-account`, {
        data: { confirmacao: deleteConfirmation },
        withCredentials: true
      });

      alert('Sua conta foi excluída com sucesso. Você será redirecionado para a página inicial.');
      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao excluir conta');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacidade e Dados Pessoais</h1>
      <p className="text-gray-600 mb-8">
        Gerencie seus dados pessoais de acordo com a Lei Geral de Proteção de Dados (LGPD)
      </p>

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

      <div className="space-y-6">
        {/* Exportar Dados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Exportar Meus Dados
            </CardTitle>
            <CardDescription>
              Baixe uma cópia de todos os seus dados pessoais armazenados na plataforma (Art. 18, IV da LGPD)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Você receberá um arquivo JSON contendo todas as suas informações pessoais, incluindo:
            </p>
            <ul className="list-disc pl-6 text-sm text-gray-600 mb-4">
              <li>Dados cadastrais (nome, email, telefone)</li>
              <li>Histórico de candidaturas</li>
              <li>Datas de criação e atualização</li>
            </ul>
            <Button onClick={handleExportData} disabled={loading}>
              <Download className="h-4 w-4 mr-2" />
              Exportar Dados
            </Button>
          </CardContent>
        </Card>

        {/* Política de Privacidade */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos Legais</CardTitle>
            <CardDescription>
              Consulte nossos documentos de privacidade e termos de uso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" onClick={() => window.open('/privacy', '_blank')}>
              Política de Privacidade
            </Button>
            <Button variant="outline" onClick={() => window.open('/terms', '_blank')} className="ml-2">
              Termos de Uso
            </Button>
          </CardContent>
        </Card>

        {/* Excluir Conta */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Excluir Minha Conta
            </CardTitle>
            <CardDescription>
              Solicite a exclusão permanente de sua conta e dados (Art. 18, VI da LGPD)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showDeleteConfirm ? (
              <>
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-2">Atenção: Esta ação é irreversível!</p>
                      <p>Ao excluir sua conta:</p>
                      <ul className="list-disc pl-5 mt-2">
                        <li>Todos os seus dados pessoais serão permanentemente removidos</li>
                        <li>Suas candidaturas serão excluídas</li>
                        <li>Você não poderá recuperar sua conta ou dados</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Quero Excluir Minha Conta
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-700">
                  Para confirmar a exclusão, digite exatamente: <strong>CONFIRMO A EXCLUSÃO</strong>
                </p>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="Digite a confirmação"
                />
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmation('');
                      setError('');
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    disabled={loading || deleteConfirmation !== 'CONFIRMO A EXCLUSÃO'}
                  >
                    {loading ? 'Excluindo...' : 'Confirmar Exclusão'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações sobre LGPD */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Seus Direitos (LGPD)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800 mb-3">
              De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem os seguintes direitos:
            </p>
            <ul className="list-disc pl-6 text-sm text-blue-800 space-y-1">
              <li>Confirmação da existência de tratamento de dados</li>
              <li>Acesso aos seus dados pessoais</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados</li>
              <li>Portabilidade dos dados a outro fornecedor</li>
              <li>Eliminação dos dados tratados com seu consentimento</li>
              <li>Revogação do consentimento</li>
            </ul>
            <p className="text-sm text-blue-800 mt-4">
              Para exercer esses direitos, entre em contato: <strong>privacidade@jobconnect.com</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

