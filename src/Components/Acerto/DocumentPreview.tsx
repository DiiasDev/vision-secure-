import { useState, useEffect } from 'react';
import { FileSpreadsheet, FileText, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { processarExtratoPDF } from '../../Services/extratoApi';

interface LancamentoExtrato {
  data: string;
  tipo: string;
  descricao: string;
  valor: number;
}

interface DocumentPreviewProps {
  planilhas: Array<{
    file: File;
    funcionarioSelecionado?: string;
    dados?: any[];
  }>;
  extrato: File | null;
  funcionarios: Array<{ id: string; nome: string; cor: string }>;
}

export default function DocumentPreview({ planilhas, extrato, funcionarios }: DocumentPreviewProps) {
  const [selectedPlanilhaIndex, setSelectedPlanilhaIndex] = useState(0);
  const [lancamentosExtrato, setLancamentosExtrato] = useState<LancamentoExtrato[]>([]);
  const [loadingExtrato, setLoadingExtrato] = useState(false);
  const [errorExtrato, setErrorExtrato] = useState<string | null>(null);

  const planilhaSelecionada = planilhas[selectedPlanilhaIndex];
  const funcionario = funcionarios.find(f => f.id === planilhaSelecionada?.funcionarioSelecionado);

  // Processar extrato quando o arquivo mudar
  useEffect(() => {
    const carregarExtrato = async () => {
      if (!extrato) {
        setLancamentosExtrato([]);
        return;
      }

      setLoadingExtrato(true);
      setErrorExtrato(null);

      try {
        const lancamentos = await processarExtratoPDF(extrato);
        setLancamentosExtrato(lancamentos);
      } catch (error) {
        console.error('Erro ao processar extrato:', error);
        setErrorExtrato('Erro ao processar o PDF. O arquivo será processado no próximo passo.');
        setLancamentosExtrato([]);
      } finally {
        setLoadingExtrato(false);
      }
    };

    carregarExtrato();
  }, [extrato]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Preview Planilhas dos Corretores */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-default)] overflow-hidden flex flex-col" style={{ maxHeight: '600px' }}>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5" />
            <div>
              <h3 className="font-semibold">Planilhas dos Corretores</h3>
              <p className="text-xs opacity-90">{planilhas.length} arquivo(s)</p>
            </div>
          </div>
        </div>

        {planilhas.length > 0 ? (
          <>
            {/* Navegação entre planilhas */}
            {planilhas.length > 1 && (
              <div className="flex items-center justify-between p-2 bg-[var(--bg-secondary)] border-b border-[var(--border-default)] flex-shrink-0">
                <button
                  onClick={() => setSelectedPlanilhaIndex(Math.max(0, selectedPlanilhaIndex - 1))}
                  disabled={selectedPlanilhaIndex === 0}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="text-center flex-1 min-w-0">
                  <div className="text-xs font-medium text-[var(--text-primary)] truncate px-2">
                    {planilhaSelecionada.file.name}
                  </div>
                  {funcionario && (
                    <div className="flex items-center justify-center space-x-1.5 mt-0.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: funcionario.cor }}
                      />
                      <span className="text-xs text-[var(--text-secondary)]">{funcionario.nome}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedPlanilhaIndex(Math.min(planilhas.length - 1, selectedPlanilhaIndex + 1))}
                  disabled={selectedPlanilhaIndex === planilhas.length - 1}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Preview da planilha */}
            <div className="overflow-auto flex-1">
              {planilhaSelecionada.dados && planilhaSelecionada.dados.length > 0 ? (
                <table className="w-full text-xs">
                  <thead className="bg-[var(--bg-secondary)] sticky top-0 z-10">
                    <tr>
                      {Object.keys(planilhaSelecionada.dados[0]).map((coluna, idx) => (
                        <th
                          key={idx}
                          className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide border-r border-[var(--border-default)] last:border-r-0"
                        >
                          {coluna}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-default)]">
                    {planilhaSelecionada.dados.map((linha, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-[var(--bg-secondary)] transition-colors">
                        {Object.values(linha).map((valor: any, colIdx) => (
                          <td
                            key={colIdx}
                            className="px-3 py-1.5 text-xs text-[var(--text-primary)] border-r border-[var(--border-default)] last:border-r-0 whitespace-nowrap"
                          >
                            {valor?.toString() || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-[var(--text-secondary)]">
                  <FileSpreadsheet className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Processando dados...</p>
                </div>
              )}
            </div>

            {planilhaSelecionada.dados && planilhaSelecionada.dados.length > 0 && (
              <div className="p-2 bg-[var(--bg-secondary)] text-center text-xs text-[var(--text-muted)] border-t border-[var(--border-default)] flex-shrink-0">
                {planilhaSelecionada.dados.length} linha(s) • Planilha {selectedPlanilhaIndex + 1} de {planilhas.length}
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center flex-1 flex items-center justify-center">
            <div>
              <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-[var(--text-muted)] opacity-50" />
              <p className="text-sm text-[var(--text-secondary)]">Nenhuma planilha carregada</p>
            </div>
          </div>
        )}
      </div>

      {/* Preview Extrato Bancário */}
      {/* Preview Extrato Bancário */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-default)] overflow-hidden flex flex-col" style={{ maxHeight: '600px' }}>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <div>
              <h3 className="font-semibold">Extrato Bancário</h3>
              <p className="text-xs opacity-90">
                {extrato ? `${lancamentosExtrato.length} lançamento(s)` : 'Aguardando arquivo'}
              </p>
            </div>
          </div>
        </div>

        {extrato ? (
          <>
            {/* Informações do arquivo */}
            <div className="p-3 bg-[var(--bg-secondary)] border-b border-[var(--border-default)] flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {extrato.name}
                  </h4>
                  <div className="flex items-center space-x-3 text-xs text-[var(--text-secondary)] mt-0.5">
                    <span>{(extrato.size / 1024).toFixed(1)} KB</span>
                    <span>•</span>
                    <span>{new Date(extrato.lastModified).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabela de lançamentos */}
            <div className="overflow-auto flex-1">
              {loadingExtrato ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto mb-3"></div>
                  <p className="text-sm text-[var(--text-secondary)]">Processando PDF...</p>
                </div>
              ) : errorExtrato ? (
                <div className="p-4 m-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">Preview não disponível</p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">{errorExtrato}</p>
                    </div>
                  </div>
                </div>
              ) : lancamentosExtrato.length > 0 ? (
                <table className="w-full text-xs">
                  <thead className="bg-[var(--bg-secondary)] sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide border-r border-[var(--border-default)]">
                        Data
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide border-r border-[var(--border-default)]">
                        Tipo
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide border-r border-[var(--border-default)]">
                        Descrição
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide">
                        Valor (R$)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-default)]">
                    {lancamentosExtrato.map((lancamento, idx) => (
                      <tr key={idx} className="hover:bg-[var(--bg-secondary)] transition-colors">
                        <td className="px-3 py-1.5 text-xs text-[var(--text-primary)] border-r border-[var(--border-default)] whitespace-nowrap">
                          {lancamento.data}
                        </td>
                        <td className="px-3 py-1.5 text-xs border-r border-[var(--border-default)] whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            {lancamento.tipo}
                          </span>
                        </td>
                        <td className="px-3 py-1.5 text-xs text-[var(--text-primary)] border-r border-[var(--border-default)]">
                          <div className="max-w-xs truncate" title={lancamento.descricao}>
                            {lancamento.descricao}
                          </div>
                        </td>
                        <td className="px-3 py-1.5 text-xs text-[var(--text-primary)] text-right font-mono whitespace-nowrap">
                          {lancamento.valor.toLocaleString('pt-BR', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center">
                  <FileText className="w-10 h-10 mx-auto mb-2 text-[var(--text-muted)] opacity-50" />
                  <p className="text-sm text-[var(--text-secondary)]">Nenhum lançamento encontrado</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Verifique se o PDF contém lançamentos do tipo "Entrada PIX"
                  </p>
                </div>
              )}
            </div>

            {/* Footer com totalizador */}
            {lancamentosExtrato.length > 0 && (
              <div className="p-2 bg-[var(--bg-secondary)] border-t border-[var(--border-default)] flex-shrink-0">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">
                    {lancamentosExtrato.length} lançamento(s)
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[var(--text-secondary)] font-medium">Total:</span>
                    <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                      R$ {lancamentosExtrato.reduce((sum, l) => sum + l.valor, 0).toLocaleString('pt-BR', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center flex-1 flex items-center justify-center">
            <div>
              <FileText className="w-12 h-12 mx-auto mb-3 text-[var(--text-muted)] opacity-50" />
              <p className="text-sm text-[var(--text-secondary)]">Nenhum extrato carregado</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Faça upload do PDF no passo anterior
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
