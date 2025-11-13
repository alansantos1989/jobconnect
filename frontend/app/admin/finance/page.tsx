'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Calendar, Download, Filter, Search, PieChart, BarChart3, Activity } from 'lucide-react';

interface FinancialFilters {
  dateFrom: string;
  dateTo: string;
  transactionType: string;
  status: string;
  paymentMethod: string;
  plan: string;
  searchTerm: string;
}

export default function AdminFinancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [filters, setFilters] = useState<FinancialFilters>({
    dateFrom: '',
    dateTo: '',
    transactionType: 'all',
    status: 'all',
    paymentMethod: 'all',
    plan: 'all',
    searchTerm: ''
  });

  useEffect(() => {
    fetchFinancialData();
  }, [filters]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Simular dados - você deve buscar da API real
      const mockData = {
        totalRevenue: 45890.50,
        monthlyRevenue: 12450.00,
        averageTicket: 124.50,
        activeSubscriptions: 100,
        churnRate: 2.5,
        mrr: 12450.00,
        arr: 149400.00,
        ltv: 1494.00,
        transactions: [
          {
            id: 'TXN001',
            date: '2025-11-10',
            company: 'Tech Solutions LTDA',
            plan: 'PRO',
            amount: 99.90,
            status: 'approved',
            method: 'credit_card'
          },
          {
            id: 'TXN002',
            date: '2025-11-09',
            company: 'Digital Corp',
            plan: 'ENTERPRISE',
            amount: 299.90,
            status: 'approved',
            method: 'pix'
          }
        ]
      };
      
      setData(mockData);
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    alert('Exportando relatório financeiro para CSV...');
  };

  const applyFilters = (newFilters: Partial<FinancialFilters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-600" />
                Dashboard Financeiro
              </h1>
              <p className="mt-2 text-gray-600">
                Gestão completa das finanças da plataforma
              </p>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-5 w-5" />
              Exportar Relatório
            </button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <FinancialMetricCard
            icon={<DollarSign className="h-8 w-8 text-green-600" />}
            title="Receita Total"
            value={`R$ ${data?.totalRevenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            change="+18.5%"
            changeType="positive"
          />
          <FinancialMetricCard
            icon={<TrendingUp className="h-8 w-8 text-blue-600" />}
            title="MRR (Receita Recorrente)"
            value={`R$ ${data?.mrr?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            change="+12.3%"
            changeType="positive"
          />
          <FinancialMetricCard
            icon={<CreditCard className="h-8 w-8 text-purple-600" />}
            title="Ticket Médio"
            value={`R$ ${data?.averageTicket?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            change="+5.2%"
            changeType="positive"
          />
          <FinancialMetricCard
            icon={<Activity className="h-8 w-8 text-orange-600" />}
            title="Assinaturas Ativas"
            value={data?.activeSubscriptions}
            change="-2.5%"
            changeType="negative"
          />
        </div>

        {/* KPIs Secundários */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">ARR (Receita Anual)</h3>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              R$ {data?.arr?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-green-600 mt-2">+15% vs ano anterior</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">LTV (Lifetime Value)</h3>
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              R$ {data?.ltv?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-blue-600 mt-2">Valor médio por cliente</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Taxa de Churn</h3>
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{data?.churnRate}%</p>
            <p className="text-sm text-red-600 mt-2">Cancelamentos mensais</p>
          </div>
        </div>

        {/* Gráficos Financeiros */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico: Receita Mensal */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Receita Mensal</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
              <div className="text-center">
                <p className="text-gray-600 mb-2">Gráfico de Barras</p>
                <p className="text-sm text-gray-500">Receita dos últimos 12 meses</p>
              </div>
            </div>
          </div>

          {/* Gráfico: Distribuição por Plano */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Receita por Plano</h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <div className="text-center">
                <p className="text-gray-600 mb-2">Gráfico de Pizza</p>
                <p className="text-sm text-gray-500">FREE vs PRO vs ENTERPRISE</p>
              </div>
            </div>
          </div>

          {/* Gráfico: MRR Evolution */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Evolução do MRR</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
              <div className="text-center">
                <p className="text-gray-600 mb-2">Gráfico de Linha</p>
                <p className="text-sm text-gray-500">Crescimento da receita recorrente</p>
              </div>
            </div>
          </div>

          {/* Gráfico: Métodos de Pagamento */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Métodos de Pagamento</h3>
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
              <div className="text-center">
                <p className="text-gray-600 mb-2">Gráfico de Rosca</p>
                <p className="text-sm text-gray-500">Cartão, PIX, Boleto</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros Avançados */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filtros Avançados</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Inicial
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => applyFilters({ dateFrom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Final
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => applyFilters({ dateTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Transação
              </label>
              <select
                value={filters.transactionType}
                onChange={(e) => applyFilters({ transactionType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas</option>
                <option value="subscription">Assinatura</option>
                <option value="upgrade">Upgrade</option>
                <option value="downgrade">Downgrade</option>
                <option value="refund">Reembolso</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => applyFilters({ status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="approved">Aprovado</option>
                <option value="pending">Pendente</option>
                <option value="failed">Falhou</option>
                <option value="refunded">Reembolsado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pagamento
              </label>
              <select
                value={filters.paymentMethod}
                onChange={(e) => applyFilters({ paymentMethod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="credit_card">Cartão de Crédito</option>
                <option value="pix">PIX</option>
                <option value="boleto">Boleto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plano
              </label>
              <select
                value={filters.plan}
                onChange={(e) => applyFilters({ plan: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="FREE">FREE</option>
                <option value="PRO">PRO</option>
                <option value="ENTERPRISE">ENTERPRISE</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Empresa, ID da transação..."
                  value={filters.searchTerm}
                  onChange={(e) => applyFilters({ searchTerm: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Transações */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Transações Recentes</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Transação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.transactions?.map((transaction: any) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.plan === 'PRO' ? 'bg-blue-100 text-blue-800' :
                        transaction.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {transaction.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      R$ {transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.method === 'credit_card' ? 'Cartão' :
                       transaction.method === 'pix' ? 'PIX' : 'Boleto'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'approved' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status === 'approved' ? 'Aprovado' :
                         transaction.status === 'pending' ? 'Pendente' : 'Falhou'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
                      <button className="text-green-600 hover:text-green-900">Nota Fiscal</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Anterior
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Próximo
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">1</span> a <span className="font-medium">10</span> de{' '}
                  <span className="font-medium">247</span> transações
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Anterior
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Próximo
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para cards de métricas financeiras
function FinancialMetricCard({ icon, title, value, change, changeType }: any) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          <p className={`mt-2 text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            {change} vs mês anterior
          </p>
        </div>
        <div className="flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}

