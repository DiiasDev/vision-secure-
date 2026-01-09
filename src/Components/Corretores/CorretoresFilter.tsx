import { TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface CorretoresFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  filterPrincipal: string;
  onFilterPrincipalChange: (value: string) => void;
}

export function CorretoresFilter({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  filterPrincipal,
  onFilterPrincipalChange,
}: CorretoresFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search */}
      <TextField
        placeholder="Buscar por nome, CPF, telefone ou e-mail..."
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
          flex: 1,
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
          minWidth: 180,
          width: 'auto',
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
        }}
      >
        <InputLabel>Status</InputLabel>
        <Select value={filterStatus} onChange={(e) => onFilterStatusChange(e.target.value)} label="Status">
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="Ativo">Ativo</MenuItem>
          <MenuItem value="Inativo">Inativo</MenuItem>
          <MenuItem value="Suspenso">Suspenso</MenuItem>
        </Select>
      </FormControl>

      {/* Filter by Principal */}
      <FormControl
        sx={{
          minWidth: 180,
          width: 'auto',
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
        }}
      >
        <InputLabel>Tipo</InputLabel>
        <Select value={filterPrincipal} onChange={(e) => onFilterPrincipalChange(e.target.value)} label="Tipo">
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="1">Principal</MenuItem>
          <MenuItem value="0">Secundário</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
