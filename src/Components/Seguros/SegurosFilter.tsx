import { TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface SegurosFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  tipoFilter: string;
  onTipoChange: (value: string) => void;
}

export function SegurosFilter({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  tipoFilter,
  onTipoChange,
}: SegurosFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search */}
      <TextField
        fullWidth
        placeholder="Buscar por nome, CPF, telefone, placa, apólice, seguradora ou corretor..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'var(--text-muted)' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'var(--input-bg)',
            '& fieldset': {
              borderColor: 'var(--input-border)',
            },
            '&:hover fieldset': {
              borderColor: 'var(--input-border)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--input-border-focus)',
            },
          },
          '& .MuiInputBase-input': {
            color: 'var(--input-text)',
            '&::placeholder': {
              color: 'var(--input-placeholder)',
              opacity: 1,
            },
          },
        }}
      />

      {/* Filter by Status */}
      <FormControl
        sx={{
          minWidth: 200,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'var(--input-bg)',
            '& fieldset': {
              borderColor: 'var(--input-border)',
            },
            '&:hover fieldset': {
              borderColor: 'var(--input-border)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--input-border-focus)',
            },
          },
          '& .MuiInputBase-input': {
            color: 'var(--input-text)',
          },
          '& .MuiInputLabel-root': {
            color: 'var(--text-secondary)',
          },
          '& .MuiSvgIcon-root': {
            color: 'var(--text-secondary)',
          },
        }}
      >
        <InputLabel>Status</InputLabel>
        <Select 
          value={statusFilter} 
          onChange={(e) => onStatusChange(e.target.value)} 
          label="Status"
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                '& .MuiMenuItem-root': {
                  color: 'var(--text-primary)',
                  '&:hover': {
                    bgcolor: 'var(--bg-table-row-hover)',
                  },
                  '&.Mui-selected': {
                    bgcolor: 'var(--bg-secondary)',
                    '&:hover': {
                      bgcolor: 'var(--bg-table-row-hover)',
                    },
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="Ativo">Ativo</MenuItem>
          <MenuItem value="Inativo">Inativo</MenuItem>
          <MenuItem value="Cancelado">Cancelado</MenuItem>
          <MenuItem value="Suspenso">Suspenso</MenuItem>
          <MenuItem value="Vencido">Vencido</MenuItem>
        </Select>
      </FormControl>

      {/* Filter by Type */}
      <FormControl
        sx={{
          minWidth: 200,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'var(--input-bg)',
            '& fieldset': {
              borderColor: 'var(--input-border)',
            },
            '&:hover fieldset': {
              borderColor: 'var(--input-border)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--input-border-focus)',
            },
          },
          '& .MuiInputBase-input': {
            color: 'var(--input-text)',
          },
          '& .MuiInputLabel-root': {
            color: 'var(--text-secondary)',
          },
          '& .MuiSvgIcon-root': {
            color: 'var(--text-secondary)',
          },
        }}
      >
        <InputLabel>Tipo de Seguro</InputLabel>
        <Select 
          value={tipoFilter} 
          onChange={(e) => onTipoChange(e.target.value)} 
          label="Tipo de Seguro"
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                '& .MuiMenuItem-root': {
                  color: 'var(--text-primary)',
                  '&:hover': {
                    bgcolor: 'var(--bg-table-row-hover)',
                  },
                  '&.Mui-selected': {
                    bgcolor: 'var(--bg-secondary)',
                    '&:hover': {
                      bgcolor: 'var(--bg-table-row-hover)',
                    },
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="Auto">Auto</MenuItem>
          <MenuItem value="Residencial">Residencial</MenuItem>
          <MenuItem value="Empresarial">Empresarial</MenuItem>
          <MenuItem value="Vida">Vida</MenuItem>
          <MenuItem value="Viagem">Viagem</MenuItem>
          <MenuItem value="Outros">Outros</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
