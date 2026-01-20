import { Upload, FileSpreadsheet, Info, AlertCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import FileWithFuncionario from './FileWithFuncionario';
import { detectarFuncionarioPorNome, validarTipoArquivo, processExcelFile, processPDFFile } from '../../Services/fileProcessor';

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
}

interface UploadAreaProps {
  title: string;
  description: string;
  acceptedFormats: string;
  multiple?: boolean;
  showFuncionarioSelector?: boolean;
  funcionarios?: Funcionario[];
  files?: FileItem[];
  onFilesChange?: (files: FileItem[]) => void;
  onFuncionarioChange?: (fileIndex: number, funcionarioId: string) => void;
  onRemoveFile?: (fileIndex: number) => void;
}

export default function UploadArea({
  title,
  description,
  acceptedFormats,
  multiple = false,
  showFuncionarioSelector = false,
  funcionarios = [],
  files = [],
  onFilesChange = () => {},
  onFuncionarioChange = () => {},
  onRemoveFile = () => {}
}: UploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Determinar tipos aceitos baseado na descrição
  const getAcceptedTypes = () => {
    if (acceptedFormats.toLowerCase().includes('pdf')) {
      return '.xlsx,.xls,.csv,.pdf';
    }
    return '.xlsx,.xls,.csv';
  };

  const processFiles = async (fileList: FileList) => {
    setIsProcessing(true);
    const newFiles: FileItem[] = [];
    
    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        
        console.log('📁 Processando arquivo:', file.name, 'Tipo:', file.type);
        
        // Validar tipo de arquivo
        const tiposPermitidos = getAcceptedTypes().split(',');
        console.log('✅ Tipos permitidos:', tiposPermitidos);
        
        if (!validarTipoArquivo(file, tiposPermitidos)) {
          const mensagem = `Arquivo ${file.name} não é um tipo válido. Tipos aceitos: ${acceptedFormats}`;
          console.error('❌', mensagem);
          alert(mensagem);
          continue;
        }
        
        console.log('✅ Tipo de arquivo válido!');

        // Processar arquivo para verificar se é válido
        try {
          if (file.name.toLowerCase().endsWith('.pdf')) {
            console.log('📄 Processando como PDF...');
            await processPDFFile(file);
          } else {
            console.log('📊 Processando como Excel...');
            await processExcelFile(file);
          }
        } catch (error) {
          console.error('❌ Erro ao processar arquivo:', error);
          alert(`Erro ao processar ${file.name}: ${error}`);
          continue;
        }

        // Detectar funcionário se aplicável
        let funcionarioSugerido: string | undefined;
        let status: 'detectado' | 'manual' | 'pendente' = 'pendente';
        
        if (showFuncionarioSelector && funcionarios.length > 0) {
          funcionarioSugerido = detectarFuncionarioPorNome(file.name, funcionarios);
          if (funcionarioSugerido) {
            status = 'detectado';
          }
        }

        newFiles.push({
          file,
          funcionarioSugerido,
          funcionarioSelecionado: funcionarioSugerido,
          status
        });
      }

      // Atualizar lista de arquivos
      if (multiple) {
        onFilesChange([...files, ...newFiles]);
      } else {
        onFilesChange(newFiles);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
        <p className="text-sm text-[var(--text-secondary)]">{description}</p>
      </div>

      {/* Input oculto para seleção de arquivos */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={getAcceptedTypes()}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 bg-[var(--bg-card)] cursor-pointer group ${
          isDragging 
            ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]' 
            : 'border-[var(--border-default)] hover:border-[var(--color-primary)]'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onClick={handleFileSelect}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-8 h-8 text-[var(--color-primary)]" />
          </div>

          <div>
            <p className="text-[var(--text-primary)] font-medium mb-1">
              {isProcessing ? 'Processando arquivos...' : 'Clique para fazer upload ou arraste os arquivos'}
            </p>
            <p className="text-sm text-[var(--text-muted)]">{acceptedFormats}</p>
          </div>

          <button 
            type="button"
            className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            onClick={(e) => {
              e.stopPropagation();
              handleFileSelect();
            }}
          >
            Selecionar Arquivos
          </button>
        </div>
      </div>

      {/* Info sobre detecção automática */}
      {showFuncionarioSelector && files.length === 0 && (
        <div className="flex items-start space-x-3 p-4 bg-[var(--color-info-bg)] border border-[var(--color-info)] border-opacity-30 rounded-lg">
          <Info className="w-5 h-5 text-[var(--color-info)] flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-[var(--color-info)] mb-1">Detecção Automática Ativa</p>
            <p className="text-[var(--text-secondary)]">
              O sistema tentará identificar o funcionário pelo nome do arquivo. 
              Exemplo: <span className="font-mono bg-[var(--bg-hover)] px-2 py-0.5 rounded text-[var(--text-primary)]">frederico.xlsx</span> → Frederico Silva
            </p>
          </div>
        </div>
      )}

      {/* Lista de arquivos com seletor de funcionário */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              {files.length} arquivo{files.length > 1 ? 's' : ''} selecionado{files.length > 1 ? 's' : ''}
            </p>
            {showFuncionarioSelector && files.filter(f => f.status === 'pendente').length > 0 && (
              <div className="flex items-center space-x-1.5 text-[var(--color-warning)]">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-medium">
                  {files.filter(f => f.status === 'pendente').length} pendente{files.filter(f => f.status === 'pendente').length > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {showFuncionarioSelector ? (
            files.map((fileItem, index) => (
              <FileWithFuncionario
                key={index}
                fileItem={fileItem}
                funcionarios={funcionarios}
                onFuncionarioChange={(funcionarioId) => onFuncionarioChange(index, funcionarioId)}
                onRemove={() => onRemoveFile(index)}
              />
            ))
          ) : (
            files.map((fileItem, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="w-5 h-5 text-[var(--color-primary)]" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{fileItem.file.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {(fileItem.file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => onRemoveFile(index)}
                  className="p-1 hover:bg-[var(--bg-hover)] rounded transition-colors"
                >
                  <svg className="w-4 h-4 text-[var(--color-danger)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
