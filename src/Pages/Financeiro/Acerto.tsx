import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calculator, Bug } from 'lucide-react';
import {
  StepIndicator,
  UploadArea,
  FuncionarioSelector,
  ComparacaoPreview,
  ProcessamentoModal,
  AlertasDivergencias
} from '../../Components/Acerto/AcertoComponents';
import FileDebugModal from '../../Components/Acerto/FileDebugModal';
import { getCorretor } from '../../Services/corretores';
import { 
  processarExtratoPDF, 
  compararExtratoComPlanilhas, 
  gerarAlertas,
  type DadosComparacao
} from '../../Services/extratoApi';
import { processExcelFile } from '../../Services/fileProcessor';

interface Funcionario {
  id: string;
  nome: string;
  cor: string;
}

interface FileItem {
  file: File;
  funcionarioSugerido?: string;
  funcionarioSelecionado?: string;
  status: 'detectado' | 'manual' | 'pendente';
  dados?: any[];
}

export default function Acerto() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalStage, setModalStage] = useState<'processando' | 'concluido' | 'erro'>('processando');
  const [corretoresSelect, setCorretoresSelect] = useState<Funcionario[]>([]);
  const [showDebugModal, setShowDebugModal] = useState(false);
  
  // Estados para os arquivos
  const [planilhasFuncionarios, setPlanilhasFuncionarios] = useState<FileItem[]>([]);
  const [movimentacaoBanco, setMovimentacaoBanco] = useState<FileItem[]>([]);
  
  // Estados para processamento
  const [dadosComparacao, setDadosComparacao] = useState<DadosComparacao[]>([]);
  const [alertas, setAlertas] = useState<Array<{tipo: 'warning' | 'info' | 'error', titulo: string, mensagem: string}>>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    'Upload de Arquivos',
    'Selecionar Funcionários',
    'Revisar Dados',
    'Processar Acerto'
  ];

  // Carregar corretores ao montar o componente
  useEffect(() => {
    const carregarCorretores = async () => {
      try {
        const corretores = await getCorretor();
        // Mapear para o formato esperado pelos componentes
        const corretoresMapeados = corretores.map((corretor, index) => ({
          id: corretor.name || `corretor-${index}`,
          nome: corretor.nome_completo || 'Sem nome',
          cor: `hsl(${(index * 137.5) % 360}, 70%, 50%)` // Gerar cores dinâmicas
        }));
        setCorretoresSelect(corretoresMapeados);
      } catch (error) {
        console.error('Erro ao carregar corretores:', error);
      }
    };
    
    carregarCorretores();
  }, []);

  // Handlers para planilhas de funcionários
  const handlePlanilhasFuncionariosChange = async (files: FileItem[]) => {
    setPlanilhasFuncionarios(files);
    
    // Processar dados das planilhas
    const filesComDados = await Promise.all(
      files.map(async (fileItem) => {
        try {
          const dadosProcessados = await processExcelFile(fileItem.file);
          // Pegar a primeira sheet como padrão
          const primeiraSheet = dadosProcessados.sheets[0];
          const dados = dadosProcessados.data[primeiraSheet];
          
          return {
            ...fileItem,
            dados: dados
          };
        } catch (error) {
          console.error('Erro ao processar planilha:', error);
          return fileItem;
        }
      })
    );
    
    setPlanilhasFuncionarios(filesComDados);
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

  // Handlers para movimentação bancária
  const handleMovimentacaoBancoChange = (files: FileItem[]) => {
    setMovimentacaoBanco(files);
  };

  const handleRemoveMovimentacaoBanco = (fileIndex: number) => {
    setMovimentacaoBanco(prev => prev.filter((_, index) => index !== fileIndex));
  };

  // Processar extrato e comparar com planilhas
  const processarComparacao = async () => {
    setIsProcessing(true);
    
    try {
      console.log('🔄 Iniciando processamento...');
      
      // 1. Processar PDF do extrato bancário
      if (movimentacaoBanco.length === 0) {
        throw new Error('Nenhum extrato bancário foi selecionado');
      }
      
      const arquivoExtrato = movimentacaoBanco[0].file;
      console.log('📄 Processando extrato:', arquivoExtrato.name);
      
      const lancamentos = await processarExtratoPDF(arquivoExtrato);
      console.log('✅ Lançamentos extraídos:', lancamentos.length);
      
      // 2. Comparar com planilhas
      console.log('📊 Comparando com planilhas...');
      const resultadosComparacao = await compararExtratoComPlanilhas(
        lancamentos,
        planilhasFuncionarios,
        corretoresSelect
      );
      
      setDadosComparacao(resultadosComparacao);
      console.log('✅ Comparação concluída:', resultadosComparacao);
      
      // 3. Gerar alertas
      const alertasGerados = gerarAlertas(resultadosComparacao);
      setAlertas(alertasGerados);
      console.log('✅ Alertas gerados:', alertasGerados.length);
      
    } catch (error) {
      console.error('❌ Erro ao processar comparação:', error);
      alert(`Erro ao processar: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = async () => {
    // Se está indo do Step 2 para o Step 3, processar a comparação
    if (currentStep === 2) {
      await processarComparacao();
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Processar acerto final
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

  // Dados de resultado final (convertidos dos dados de comparação)
  const resultadosFinais = dadosComparacao.length > 0 ? dadosComparacao.map(resultado => ({
    id: resultado.funcionarioId,
    nome: resultado.funcionario,
    cor: resultado.cor,
    totalVendido: resultado.valorPlanilha,
    comissao: resultado.valorPlanilha * 0.7, // 70% de comissão
    clientes: resultado.detalhes.clientesEncontrados,
    status: resultado.status
  })) : [];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
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
            
            {/* Botão de Debug */}
            {planilhasFuncionarios.length > 0 && (
              <button
                onClick={() => setShowDebugModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
              >
                <Bug className="w-5 h-5" />
                <span className="font-medium">Debug ({planilhasFuncionarios.length})</span>
              </button>
            )}
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
                funcionarios={corretoresSelect}
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
                onFilesChange={handleMovimentacaoBancoChange}
                onRemoveFile={handleRemoveMovimentacaoBanco}
              />
            </div>
          )}

          {currentStep === 1 && (
            <FuncionarioSelector
              funcionarios={corretoresSelect}
              selectedFuncionarios={corretoresSelect.map(c => c.id)}
            />
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              {isProcessing ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-[var(--text-secondary)]">Processando dados...</p>
                </div>
              ) : dadosComparacao.length > 0 ? (
                <>
                  <AlertasDivergencias alertas={alertas} />
                  <div className="h-px bg-[var(--border-default)]" />
                  <ComparacaoPreview items={dadosComparacao.map(d => ({
                    funcionario: d.funcionario,
                    valorPlanilha: d.valorPlanilha,
                    valorBanco: d.valorBanco,
                    diferenca: d.diferenca,
                    status: d.status,
                    cor: d.cor
                  }))} />
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-[var(--text-secondary)]">
                    Clique em "Próximo" para processar os dados
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8">
              {dadosComparacao.length > 0 ? (
                <>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-4 shadow-lg">
                      <svg
                        className="w-10 h-10 text-white"
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
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                      Comparação Concluída!
                    </h2>
                    <p className="text-[var(--text-secondary)]">
                      Revise os resultados abaixo e clique em "Processar Acerto" para finalizar
                    </p>
                  </div>

                  <AlertasDivergencias alertas={alertas} />
                  <div className="h-px bg-[var(--border-default)]" />
                  <ComparacaoPreview items={dadosComparacao.map(d => ({
                    funcionario: d.funcionario,
                    valorPlanilha: d.valorPlanilha,
                    valorBanco: d.valorBanco,
                    diferenca: d.diferenca,
                    status: d.status,
                    cor: d.cor
                  }))} />
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-3">Próximos passos:</h3>
                    <ul className="text-left text-sm text-blue-800 space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>Cálculo de comissões (70%) para cada funcionário</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>Geração de relatório detalhado exportável para Excel</span>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-[var(--text-secondary)]">
                    Nenhum dado de comparação disponível. Volte e refaça o processamento.
                  </p>
                </div>
              )}
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
            disabled={isProcessing}
            className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium flex items-center space-x-2 hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
        resultados={resultadosFinais}
        onClose={() => setShowModal(false)}
        onExportExcel={handleExportExcel}
      />

      {/* Modal de Debug */}
      <FileDebugModal
        isOpen={showDebugModal}
        onClose={() => setShowDebugModal(false)}
        files={planilhasFuncionarios}
        funcionarios={corretoresSelect}
      />
    </div>
  );
}
