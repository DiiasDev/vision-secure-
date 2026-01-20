import { Upload, FileSpreadsheet, Info, AlertCircle } from 'lucide-react';
import FileWithFuncionario from './FileWithFuncionario';

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
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
        <p className="text-sm text-[var(--text-secondary)]">{description}</p>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-[var(--border-default)] rounded-xl p-8 text-center hover:border-[var(--color-primary)] transition-all duration-300 bg-[var(--bg-card)] cursor-pointer group">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-8 h-8 text-[var(--color-primary)]" />
          </div>

          <div>
            <p className="text-[var(--text-primary)] font-medium mb-1">
              Clique para fazer upload ou arraste os arquivos
            </p>
            <p className="text-sm text-[var(--text-muted)]">{acceptedFormats}</p>
          </div>

          <button className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium">
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
