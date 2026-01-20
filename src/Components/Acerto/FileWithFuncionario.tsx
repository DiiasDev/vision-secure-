import { FileSpreadsheet, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Select, MenuItem, Avatar, Box, Chip } from '@mui/material';

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

interface FileWithFuncionarioProps {
  fileItem: FileItem;
  funcionarios: Funcionario[];
  onFuncionarioChange: (funcionarioId: string) => void;
  onRemove: () => void;
}

export default function FileWithFuncionario({
  fileItem,
  funcionarios,
  onFuncionarioChange,
  onRemove
}: FileWithFuncionarioProps) {
  const funcionarioAtual = funcionarios.find(
    f => f.id === (fileItem.funcionarioSelecionado || fileItem.funcionarioSugerido)
  );

  return (
    <div className="flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg transition-all">
      <div className="flex items-center space-x-4 flex-1">
        {/* Ícone do arquivo */}
        <div className="w-12 h-12 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0">
          <FileSpreadsheet className="w-6 h-6 text-[var(--color-primary)]" />
        </div>

        {/* Info do arquivo */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--text-primary)] truncate">
            {fileItem.file.name}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {(fileItem.file.size / 1024).toFixed(2)} KB
          </p>
        </div>
      </div>

      {/* Área direita: Status + Dropdown + Remover */}
      <div className="flex items-center space-x-3 ml-4">
        {/* Status indicator */}
        {fileItem.status === 'detectado' && (
          <Chip 
            icon={<CheckCircle style={{ width: 16, height: 16 }} />}
            label="Auto"
            size="small"
            sx={{
              backgroundColor: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              fontWeight: 500,
              fontSize: '0.75rem',
              height: '24px',
              '& .MuiChip-icon': {
                color: 'var(--color-success)',
                marginLeft: '8px'
              }
            }}
          />
        )}
        {fileItem.status === 'pendente' && (
          <Chip 
            icon={<AlertCircle style={{ width: 16, height: 16 }} />}
            label="Pendente"
            size="small"
            sx={{
              backgroundColor: 'var(--color-warning-bg)',
              color: 'var(--color-warning)',
              fontWeight: 500,
              fontSize: '0.75rem',
              height: '24px',
              '& .MuiChip-icon': {
                color: 'var(--color-warning)',
                marginLeft: '8px'
              }
            }}
          />
        )}

        {/* Select MUI de funcionário */}
        <Select
          value={fileItem.funcionarioSelecionado || fileItem.funcionarioSugerido || ''}
          onChange={(e) => onFuncionarioChange(e.target.value as string)}
          displayEmpty
          size="small"
          sx={{
            minWidth: 220,
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: funcionarioAtual ? 'var(--color-primary)' : 'var(--border-default)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-primary)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-primary)',
            },
            '& .MuiSelect-icon': {
              color: 'var(--text-muted)',
            },
          }}
          renderValue={(selected) => {
            if (!selected) {
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}>
                  Selecionar Funcionário
                </Box>
              );
            }
            const func = funcionarios.find(f => f.id === selected);
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    fontSize: '0.75rem',
                    backgroundColor: func?.cor 
                  }}
                >
                  {func?.nome.charAt(0).toUpperCase()}
                </Avatar>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  {func?.nome}
                </span>
              </Box>
            );
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--shadow-lg)',
                maxHeight: 300,
                '& .MuiMenuItem-root': {
                  color: 'var(--text-primary)',
                  '&:hover': {
                    backgroundColor: 'var(--bg-hover)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'var(--color-primary-light)',
                    '&:hover': {
                      backgroundColor: 'var(--color-primary-light)',
                    },
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="" disabled sx={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Selecionar Funcionário
          </MenuItem>
          {funcionarios.map((func) => (
            <MenuItem key={func.id} value={func.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar 
                  sx={{ 
                    width: 28, 
                    height: 28, 
                    fontSize: '0.875rem',
                    backgroundColor: func.cor 
                  }}
                >
                  {func.nome.charAt(0).toUpperCase()}
                </Avatar>
                <span style={{ fontSize: '0.875rem' }}>{func.nome}</span>
              </Box>
            </MenuItem>
          ))}
        </Select>

        {/* Botão remover */}
        <button
          onClick={onRemove}
          className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors group"
        >
          <X className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--color-danger)]" />
        </button>
      </div>
    </div>
  );
}
