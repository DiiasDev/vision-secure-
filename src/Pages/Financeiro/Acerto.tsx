import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calculator } from 'lucide-react';
import {
  StepIndicator,
  UploadArea,
  FuncionarioSelector,
  ComparacaoPreview,
  ProcessamentoModal,
  AlertasDivergencias
} from '../../Components/Acerto/AcertoComponents';

interface FileItem {
  file: File;
  funcionarioSugerido?: string;
  funcionarioSelecionado?: string;
  status: 'detectado' | 'manual' | 'pendente';
}

export default function Acerto() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalStage, setModalStage] = useState<'processando' | 'concluido' | 'erro'>('processando');
  
  // Estados para os arquivos - Inicializado com dados mockados
  const [planilhasFuncionarios, setPlanilhasFuncionarios] = useState<FileItem[]>([
    {
      file: new File([], 'joao_silva.xlsx', { type: 'application/vnd.ms-excel' }),
      funcionarioSugerido: '1',
      funcionarioSelecionado: '1',
      status: 'detectado'
    },
    {
      file: new File([], 'maria.xlsx', { type: 'application/vnd.ms-excel' }),
      funcionarioSugerido: '2',
      funcionarioSelecionado: '2',
      status: 'detectado'
    },
    {
      file: new File([], 'pedro_costa.xlsx', { type: 'application/vnd.ms-excel' }),
      funcionarioSugerido: '3',
      funcionarioSelecionado: '3',
      status: 'detectado'
    },
    {
      file: new File([], 'planilha_janeiro.xlsx', { type: 'application/vnd.ms-excel' }),
      status: 'pendente'
    },
  ]);
  
  const [movimentacaoBanco, setMovimentacaoBanco] = useState<FileItem[]>([
    {
      file: new File([], 'movimentacao_banco_janeiro_2026.xlsx', { type: 'application/vnd.ms-excel' }),
      status: 'manual'
    }
  ]);

  const steps = [
    'Upload de Arquivos',
    'Selecionar Funcionários',
    'Revisar Dados',
    'Processar Acerto'
  ];

  // Dados mockados para demonstração visual
  const funcionariosMock = [
    { id: '1', nome: 'João Silva', cor: '#3b82f6' },
    { id: '2', nome: 'Maria Santos', cor: '#8b5cf6' },
    { id: '3', nome: 'Pedro Costa', cor: '#10b981' },
    { id: '4', nome: 'Ana Oliveira', cor: '#f59e0b' },
    { id: '5', nome: 'Carlos Souza', cor: '#ef4444' },
    { id: '6', nome: 'Juliana Lima', cor: '#ec4899' },
  ];

  // Função para detectar funcionário pelo nome do arquivo
  const detectarFuncionario = (fileName: string): string | undefined => {
    const nomeArquivo = fileName.toLowerCase().replace('.xlsx', '').replace('.xls', '');
    
    // Busca por correspondência no nome
    const funcionarioEncontrado = funcionariosMock.find(func => {
      const nomeFunc = func.nome.toLowerCase();
      const primeiroNome = nomeFunc.split(' ')[0];
      const sobrenome = nomeFunc.split(' ')[1] || '';
      
      return nomeArquivo.includes(primeiroNome) || 
             nomeArquivo.includes(sobrenome) ||
             nomeArquivo.includes(nomeFunc.replace(' ', ''));
    });

    return funcionarioEncontrado?.id;
  };

  // Handlers para planilhas de funcionários
  const handlePlanilhasFuncionariosChange = (files: FileItem[]) => {
    setPlanilhasFuncionarios(files);
  };

  const handleFuncionarioChange = (fileIndex: number, funcionarioId: string) => {
    setPlanilhasFuncionarios(prev => {
      const updated = [...prev];
      updated[fileIndex] = {
        ...updated[fileIndex],
        funcionarioSelecionado: funcionarioId,
        status: 'manual'
      };
      return updated;
    });
  };

  const handleRemoveFile = (fileIndex: number) => {
    setPlanilhasFuncionarios(prev => prev.filter((_, index) => index !== fileIndex));
  };

  const previewMock = [
    { funcionario: 'João Silva', valorPlanilha: 15000, valorBanco: 15000, diferenca: 0, status: 'ok' as const, cor: '#3b82f6' },
    { funcionario: 'Maria Santos', valorPlanilha: 12500, valorBanco: 12000, diferenca: 500, status: 'divergente' as const, cor: '#8b5cf6' },
    { funcionario: 'Pedro Costa', valorPlanilha: 18000, valorBanco: 18000, diferenca: 0, status: 'ok' as const, cor: '#10b981' },
    { funcionario: 'Ana Oliveira', valorPlanilha: 9500, valorBanco: 10000, diferenca: -500, status: 'divergente' as const, cor: '#f59e0b' },
  ];

  const alertasMock = [
    {
      tipo: 'warning' as const,
      titulo: 'Divergência Detectada',
      mensagem: 'Maria Santos possui diferença de R$ 500,00 entre planilha e banco.'
    },
    {
      tipo: 'warning' as const,
      titulo: 'Valor Inferior',
      mensagem: 'Ana Oliveira tem valor no banco R$ 500,00 maior que na planilha.'
    },
    {
      tipo: 'info' as const,
      titulo: 'Informação',
      mensagem: '2 de 4 funcionários possuem valores conferidos corretamente.'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Simular processamento
      setShowModal(true);
      setModalStage('processando');
      
      // Simular conclusão após 3 segundos
      setTimeout(() => {
        setModalStage('concluido');
      }, 3000);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleExportExcel = () => {
    console.log('Exportando para Excel...');
    setShowModal(false);
  };

  // Dados mockados de resultado final
  const resultadosMock = [
    {
      id: '1',
      nome: 'João Silva',
      cor: '#3b82f6',
      totalVendido: 15000,
      comissao: 10500, // 70% de 15000
      clientes: ['Cliente A', 'Cliente B', 'Cliente C', 'Cliente D'],
      status: 'ok' as const
    },
    {
      id: '3',
      nome: 'Pedro Costa',
      cor: '#10b981',
      totalVendido: 18000,
      comissao: 12600, // 70% de 18000
      clientes: ['Cliente E', 'Cliente F', 'Cliente G'],
      status: 'ok' as const
    },
    {
      id: '2',
      nome: 'Maria Santos',
      cor: '#8b5cf6',
      totalVendido: 12500,
      comissao: 8750,
      clientes: ['Cliente H', 'Cliente I'],
      status: 'divergente' as const
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-blue-600 flex items-center justify-center shadow-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                Acerto de Valores
              </h1>
              <p className="text-[var(--text-secondary)]">
                Sistema de comparação e validação de planilhas
              </p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="bg-[var(--bg-card)] rounded-xl shadow-md border border-[var(--border-default)] p-6 mb-8">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Conteúdo por Step */}
        <div className="bg-[var(--bg-card)] rounded-xl shadow-md border border-[var(--border-default)] p-8 mb-8">
          {currentStep === 0 && (
            <div className="space-y-8">
              <UploadArea
                title="Planilhas dos Funcionários"
                description="Faça upload das planilhas individuais de cada funcionário"
                acceptedFormats="Excel (.xlsx, .xls) ou CSV"
                multiple={true}
                showFuncionarioSelector={true}
                funcionarios={funcionariosMock}
                files={planilhasFuncionarios}
                onFilesChange={handlePlanilhasFuncionariosChange}
                onFuncionarioChange={handleFuncionarioChange}
                onRemoveFile={handleRemoveFile}
              />
              <div className="h-px bg-[var(--border-default)]" />
              <UploadArea
                title="Movimentação Bancária"
                description="Faça upload da planilha ou PDF com as movimentações do banco"
                acceptedFormats="Excel (.xlsx, .xls), CSV ou PDF"
                multiple={false}
                files={movimentacaoBanco}
              />
            </div>
          )}

          {currentStep === 1 && (
            <FuncionarioSelector
              funcionarios={funcionariosMock}
              selectedFuncionarios={['1', '2', '3', '4']}
            />
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <AlertasDivergencias alertas={alertasMock} />
              <div className="h-px bg-[var(--border-default)]" />
              <ComparacaoPreview items={previewMock} />
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 shadow-lg">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                Tudo Pronto!
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-2">
                Todos os dados foram revisados e estão prontos para o processamento.
              </p>
              <p className="text-[var(--text-muted)] mb-8">
                Clique em "Processar Acerto" para iniciar a comparação automática.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="font-semibold text-blue-900 mb-3">O que acontecerá:</h3>
                <ul className="text-left text-sm text-blue-800 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Comparação automática entre valores das planilhas e movimentações bancárias</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Cálculo de comissões (70%) para cada funcionário</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Identificação de divergências e alertas automáticos</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Geração de relatório detalhado exportável para Excel</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Botões de Navegação */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`
              px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all
              ${currentStep === 0
                ? 'bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed'
                : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--border-default)]'
              }
            `}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Anterior</span>
          </button>

          <div className="text-sm text-[var(--text-muted)]">
            Passo {currentStep + 1} de {steps.length}
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium flex items-center space-x-2 hover:opacity-90 transition-opacity shadow-lg"
          >
            <span>{currentStep === steps.length - 1 ? 'Processar Acerto' : 'Próximo'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal de Processamento */}
      <ProcessamentoModal
        isOpen={showModal}
        stage={modalStage}
        message={
          modalStage === 'processando'
            ? 'Analisando planilhas e comparando valores...'
            : 'O acerto foi processado com sucesso! Confira os resultados abaixo.'
        }
        progress={modalStage === 'processando' ? 65 : 100}
        resultados={resultadosMock}
        onClose={() => setShowModal(false)}
        onExportExcel={handleExportExcel}
      />
    </div>
  );
}
