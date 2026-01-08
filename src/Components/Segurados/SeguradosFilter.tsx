import { TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface SeguradosFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
}

export function SeguradosFilter({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterTypeChange,
}: SeguradosFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search */}
      <TextField
        fullWidth
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
        }}
      >
        <InputLabel>Tipo de Pessoa</InputLabel>
        <Select value={filterType} onChange={(e) => onFilterTypeChange(e.target.value)} label="Tipo de Pessoa">
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="Física">Pessoa Física</MenuItem>
          <MenuItem value="Jurídica">Pessoa Jurídica</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
