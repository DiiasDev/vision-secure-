import { Loader2, CheckCircle, AlertCircle, FileText, TrendingUp, Users, DollarSign } from 'lucide-react';

interface ResultadoFuncionario {
  id: string;
  nome: string;
  cor: string;
  totalVendido: number;
  comissao: number;
  clientes: string[];
  status: 'ok' | 'divergente';
}

interface ProcessamentoModalProps {
  isOpen: boolean;
  stage: 'processando' | 'concluido' | 'erro';
  message: string;
  progress?: number;
  resultados?: ResultadoFuncionario[];
  onClose?: () => void;
  onExportExcel?: () => void;
}

export default function ProcessamentoModal({
  isOpen,
  stage,
  message,
  progress = 0,
  resultados = [],
  onClose = () => {},
  onExportExcel = () => {}
}: ProcessamentoModalProps) {
  if (!isOpen) return null;

  // Filtra apenas funcionários com status OK
  const resultadosOk = resultados.filter(r => r.status === 'ok');
  const totalComissao = resultadosOk.reduce((acc, r) => acc + r.comissao, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className={`bg-[var(--bg-card)] rounded-2xl shadow-2xl w-full my-4 ${stage === 'concluido' && resultadosOk.length > 0 ? 'max-w-4xl' : 'max-w-md'}`}>
        <div className="p-6">
        {/* Ícone baseado no estágio */}
        <div className="flex justify-center mb-4">
          {stage === 'processando' && (
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}
          {stage === 'concluido' && (
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          )}
          {stage === 'erro' && (
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          )}
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold text-center text-[var(--text-primary)] mb-2">
          {stage === 'processando' && 'Processando...'}
          {stage === 'concluido' && 'Processamento Concluído!'}
          {stage === 'erro' && 'Erro no Processamento'}
        </h3>

        {/* Mensagem */}
        <p className="text-center text-sm text-[var(--text-secondary)] mb-5">{message}</p>

        {/* Barra de progresso (apenas para processando) */}
        {stage === 'processando' && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-sm text-[var(--text-muted)] mt-2">{progress}%</p>
          </div>
        )}

        {/* Botões */}
        {stage === 'concluido' && (
          <>
            {/* Resumo Geral */}
            {resultadosOk.length > 0 && (
              <div className="mb-5 p-5 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium opacity-90 mb-1">Total em Comissões (70%)</p>
                    <p className="text-3xl font-bold tracking-tight">
                      R$ {totalComissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs opacity-75 mt-1">
                      {resultadosOk.length} funcionário{resultadosOk.length !== 1 ? 's' : ''} processado{resultadosOk.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-full">
                    <DollarSign className="w-8 h-8" />
                  </div>
                </div>
              </div>
            )}

            {/* Tabela de Resultados */}
            {resultadosOk.length > 0 && (
              <div className="mb-5 max-h-[400px] overflow-y-auto pr-2">
                <h4 className="text-base font-bold text-[var(--text-primary)] mb-4 flex items-center space-x-2">
                  <div className="p-1.5 bg-[var(--color-primary-light)] rounded-lg">
                    <TrendingUp className="w-4 h-4 text-[var(--color-primary)]" />
                  </div>
                  <span>Resultado por Funcionário</span>
                </h4>
                
                <div className="space-y-3">
                  {resultadosOk.map((resultado) => (
                    <div 
                      key={resultado.id}
                      className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-default)] hover:border-[var(--color-primary)] transition-all"
                    >
                      {/* Header do Funcionário */}
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-[var(--border-default)]">
                        <div className="flex items-center space-x-2.5">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                            style={{ backgroundColor: resultado.cor }}
                          >
                            {resultado.nome.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[var(--text-primary)]">{resultado.nome}</p>
                            <div className="flex items-center space-x-1 text-xs text-[var(--text-muted)] mt-0.5">
                              <Users className="w-3 h-3" />
                              <span>{resultado.clientes.length} cliente{resultado.clientes.length !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-[var(--text-muted)] mb-0.5">Total a Receber</p>
                          <p className="text-xl font-bold text-[var(--color-success)]">
                            R$ {resultado.comissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>

                      {/* Valores */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-[var(--bg-card)] rounded-lg p-3 border border-[var(--border-light)]">
                          <div className="flex items-center space-x-1 mb-1">
                            <DollarSign className="w-3 h-3 text-[var(--text-muted)]" />
                            <p className="text-xs font-medium text-[var(--text-muted)]">Total Vendido</p>
                          </div>
                          <p className="text-sm font-bold text-[var(--text-primary)]">
                            R$ {resultado.totalVendido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-lg p-3 text-white">
                          <p className="text-xs font-medium opacity-90 mb-1">Comissão</p>
                          <p className="text-sm font-bold">70%</p>
                        </div>
                      </div>

                      {/* Lista de Clientes */}
                      <div className="bg-[var(--bg-card)] rounded-lg p-3 border border-[var(--border-light)]">
                        <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
                          Clientes Atendidos
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {resultado.clientes.map((cliente, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-medium px-2.5 py-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-full border border-[var(--border-default)] hover:border-[var(--color-primary)] transition-all"
                            >
                              {cliente}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="space-y-2.5 pt-4 border-t border-[var(--border-default)]">
              <button
                onClick={onExportExcel}
                className="w-full px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all font-semibold text-sm flex items-center justify-center space-x-2 shadow-md"
              >
                <FileText className="w-4 h-4" />
                <span>Exportar para Excel</span>
              </button>
              <button
                onClick={onClose}
                className="w-full px-5 py-2.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--border-default)] transition-colors font-medium text-sm border border-[var(--border-default)]"
              >
                Fechar
              </button>
            </div>
          </>
        )}

        {stage === 'erro' && (
          <button
            onClick={onClose}
            className="w-full px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
          >
            Tentar Novamente
          </button>
        )}
      </div>
    </div>
    </div>
  );
}
