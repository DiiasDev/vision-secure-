import { X, FileSpreadsheet, User, CheckCircle, AlertCircle } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

interface FileItem {
  file: File;
  funcionarioSugerido?: string;
  funcionarioSelecionado?: string;
  status: 'detectado' | 'manual' | 'pendente';
}

interface Funcionario {
  id: string;
  nome: string;
  cor: string;
}

interface FileDebugModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: FileItem[];
  funcionarios: Funcionario[];
}

export default function FileDebugModal({
  isOpen,
  onClose,
  files,
  funcionarios
}: FileDebugModalProps) {
  const getFuncionarioNome = (id?: string) => {
    if (!id) return 'Não detectado';
    const func = funcionarios.find(f => f.id === id);
    return func?.nome || 'Desconhecido';
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-primary)',
          borderRadius: '12px',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid var(--border-default)',
        pb: 2
      }}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Debug - Detecção de Funcionários
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {files.length} arquivo{files.length !== 1 ? 's' : ''} carregado{files.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-[var(--text-muted)]" />
        </button>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <div className="space-y-4">
          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 bg-[var(--color-success-bg)] rounded-lg border border-[var(--color-success)] border-opacity-30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[var(--color-success)]">Detectados</span>
                <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />
              </div>
              <p className="text-2xl font-bold text-[var(--color-success)]">
                {files.filter(f => f.status === 'detectado').length}
              </p>
            </div>

            <div className="p-3 bg-[var(--color-warning-bg)] rounded-lg border border-[var(--color-warning)] border-opacity-30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[var(--color-warning)]">Pendentes</span>
                <AlertCircle className="w-4 h-4 text-[var(--color-warning)]" />
              </div>
              <p className="text-2xl font-bold text-[var(--color-warning)]">
                {files.filter(f => f.status === 'pendente').length}
              </p>
            </div>

            <div className="p-3 bg-[var(--color-info-bg)] rounded-lg border border-[var(--color-info)] border-opacity-30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[var(--color-info)]">Total</span>
                <FileSpreadsheet className="w-4 h-4 text-[var(--color-info)]" />
              </div>
              <p className="text-2xl font-bold text-[var(--color-info)]">
                {files.length}
              </p>
            </div>
          </div>

          {/* Lista detalhada */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">
              Detalhes dos Arquivos
            </h3>
            
            {files.map((fileItem, index) => (
              <div 
                key={index}
                className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-default)]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1">
                    <FileSpreadsheet className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--text-primary)] truncate">
                        {fileItem.file.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {(fileItem.file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  
                  {fileItem.status === 'detectado' ? (
                    <span className="px-2 py-1 bg-[var(--color-success-bg)] text-[var(--color-success)] text-xs font-medium rounded flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Auto</span>
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-[var(--color-warning-bg)] text-[var(--color-warning)] text-xs font-medium rounded flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Pendente</span>
                    </span>
                  )}
                </div>

                <div className="pl-8 space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-[var(--text-muted)]" />
                    <span className="text-[var(--text-secondary)]">Funcionário:</span>
                    <span className={`font-medium ${
                      fileItem.funcionarioSugerido 
                        ? 'text-[var(--color-success)]' 
                        : 'text-[var(--color-warning)]'
                    }`}>
                      {getFuncionarioNome(fileItem.funcionarioSugerido || fileItem.funcionarioSelecionado)}
                    </span>
                  </div>
                  
                  {fileItem.funcionarioSugerido && (
                    <div className="text-xs text-[var(--text-muted)] pl-6">
                      ✓ Detectado automaticamente pelo nome do arquivo
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Lista de funcionários disponíveis */}
          <div className="mt-6 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-default)]">
            <h4 className="font-semibold text-[var(--text-primary)] mb-3">
              Funcionários Disponíveis ({funcionarios.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {funcionarios.map((func) => (
                <div
                  key={func.id}
                  className="px-3 py-1.5 bg-[var(--bg-card)] rounded-lg border border-[var(--border-default)] flex items-center space-x-2"
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: func.cor }}
                  />
                  <span className="text-sm text-[var(--text-primary)]">
                    {func.nome}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
