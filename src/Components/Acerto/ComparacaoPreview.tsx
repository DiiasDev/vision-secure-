import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

interface PreviewItem {
  funcionario: string;
  valorPlanilha: number;
  valorBanco: number;
  diferenca: number;
  status: 'ok' | 'divergente';
  cor: string;
}

interface ComparacaoPreviewProps {
  items: PreviewItem[];
}

export default function ComparacaoPreview({ items }: ComparacaoPreviewProps) {
  const totalPlanilha = items.reduce((acc, item) => acc + item.valorPlanilha, 0);
  const totalBanco = items.reduce((acc, item) => acc + item.valorBanco, 0);
  const totalDiferenca = totalPlanilha - totalBanco;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
          Pré-visualização da Comparação
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Confira os valores antes de processar
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-1">Total Planilhas</p>
          <p className="text-3xl font-bold">R$ {totalPlanilha.toLocaleString('pt-BR')}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-1">Total Banco</p>
          <p className="text-3xl font-bold">R$ {totalBanco.toLocaleString('pt-BR')}</p>
        </div>
        
        <div className={`bg-gradient-to-br rounded-xl p-6 text-white shadow-lg ${
          totalDiferenca === 0 ? 'from-gray-500 to-gray-600' : 
          totalDiferenca > 0 ? 'from-orange-500 to-orange-600' : 'from-red-500 to-red-600'
        }`}>
          <p className="text-sm opacity-90 mb-1">Diferença</p>
          <div className="flex items-center space-x-2">
            <p className="text-3xl font-bold">R$ {Math.abs(totalDiferenca).toLocaleString('pt-BR')}</p>
            {totalDiferenca !== 0 && (
              totalDiferenca > 0 ? 
                <TrendingUp className="w-6 h-6" /> : 
                <TrendingDown className="w-6 h-6" />
            )}
          </div>
        </div>
      </div>

      {/* Tabela de comparação */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-default)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                  Funcionário
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--text-primary)]">
                  Valor Planilha
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--text-primary)]">
                  Valor Banco
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--text-primary)]">
                  Diferença
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-[var(--text-primary)]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)]">
              {items.map((item, index) => (
                <tr key={index} className="hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{ backgroundColor: item.cor }}
                      >
                        {item.funcionario.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-[var(--text-primary)]">{item.funcionario}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-[var(--text-primary)] font-medium">
                    R$ {item.valorPlanilha.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right text-[var(--text-primary)] font-medium">
                    R$ {item.valorBanco.toLocaleString('pt-BR')}
                  </td>
                  <td className={`px-6 py-4 text-right font-semibold ${
                    item.diferenca === 0 ? 'text-gray-500' :
                    item.diferenca > 0 ? 'text-orange-500' : 'text-red-500'
                  }`}>
                    {item.diferenca > 0 ? '+' : ''}{item.diferenca !== 0 ? `R$ ${item.diferenca.toLocaleString('pt-BR')}` : '—'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.status === 'ok' ? (
                      <div className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">OK</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Divergente</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
