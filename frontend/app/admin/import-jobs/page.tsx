'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';

export default function AdminImportJobsPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validar tipo de arquivo
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Por favor, selecione um arquivo CSV');
        return;
      }

      setFile(selectedFile);
      setError('');
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo CSV');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/import/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setFile(null);
        // Limpar input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setError(data.error || 'Erro ao importar vagas');
      }

    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setError('Erro ao fazer upload do arquivo');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Criar template CSV
    const template = `Empresa,Título,Localização,Salário,Descrição,Link
Exemplo Empresa LTDA,Desenvolvedor Full Stack,São Paulo - SP e Híbrido,R$ 8.000,Vaga para desenvolvedor full stack com experiência em React e Node.js,https://exemplo.com/vaga
Outra Empresa,Analista de Marketing,Rio de Janeiro - RJ,A combinar,Analista de marketing digital com foco em redes sociais,https://exemplo.com/vaga2`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_importacao_vagas.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Upload className="h-8 w-8 text-blue-600" />
            Importar Vagas em Massa
          </h1>
          <p className="mt-2 text-gray-600">
            Faça upload de um arquivo CSV para importar múltiplas vagas de uma vez
          </p>
        </div>

        {/* Instruções */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Como importar vagas</h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Baixe o template CSV clicando no botão abaixo</li>
                <li>Preencha o arquivo com os dados das vagas</li>
                <li>Certifique-se de que as colunas estão corretas: Empresa, Título, Localização, Salário, Descrição, Link</li>
                <li>Faça upload do arquivo preenchido</li>
              </ol>
              <button
                onClick={downloadTemplate}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-5 w-5" />
                Baixar Template CSV
              </button>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            
            <div className="mb-4">
              <label htmlFor="file-input" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-medium">
                  Clique para selecionar
                </span>
                <span className="text-gray-600"> ou arraste um arquivo CSV aqui</span>
              </label>
              <input
                id="file-input"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {file && (
              <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
                <FileText className="h-5 w-5" />
                <span className="font-medium">{file.name}</span>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-center justify-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                !file || uploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Importando...
                </span>
              ) : (
                'Importar Vagas'
              )}
            </button>
          </div>
        </div>

        {/* Resultado */}
        {result && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Importação Concluída!</h2>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Total Processado</p>
                <p className="text-3xl font-bold text-blue-600">{result.stats.total}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Importadas com Sucesso</p>
                <p className="text-3xl font-bold text-green-600">{result.stats.success}</p>
              </div>

              <div className="bg-red-50 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Erros</p>
                <p className="text-3xl font-bold text-red-600">{result.stats.errors}</p>
              </div>
            </div>

            {result.errors && result.errors.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Erros Encontrados:</h3>
                <div className="bg-red-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  {result.errors.map((err: any, index: number) => (
                    <div key={index} className="mb-3 pb-3 border-b border-red-200 last:border-0">
                      <p className="text-sm text-red-800">
                        <span className="font-semibold">Linha {err.row}:</span> {err.error}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => router.push('/admin/jobs')}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver Vagas Importadas
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setFile(null);
                  setError('');
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Importar Mais Vagas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

