import { TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface VeiculosFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterTipo: string;
  onFilterTipoChange: (value: string) => void;
  filterUso: string;
  onFilterUsoChange: (value: string) => void;
}

export function VeiculosFilter({
  searchTerm,
  onSearchChange,
  filterTipo,
  onFilterTipoChange,
  filterUso,
  onFilterUsoChange,
}: VeiculosFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search */}
      <TextField
        placeholder="Buscar por marca, modelo, placa ou renavam..."
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

      {/* Filter by Tipo */}
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
        <InputLabel>Tipo de Veículo</InputLabel>
        <Select value={filterTipo} onChange={(e) => onFilterTipoChange(e.target.value)} label="Tipo de Veículo">
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="Carro">Carro</MenuItem>
          <MenuItem value="Moto">Moto</MenuItem>
          <MenuItem value="Caminhão">Caminhão</MenuItem>
          <MenuItem value="Utilitário">Utilitário</MenuItem>
          <MenuItem value="Outro">Outro</MenuItem>
        </Select>
      </FormControl>

      {/* Filter by Uso */}
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
        <InputLabel>Uso do Veículo</InputLabel>
        <Select value={filterUso} onChange={(e) => onFilterUsoChange(e.target.value)} label="Uso do Veículo">
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="Particular">Particular</MenuItem>
          <MenuItem value="Comercial">Comercial</MenuItem>
          <MenuItem value="Aplicativo">Aplicativo</MenuItem>
          <MenuItem value="Frota">Frota</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
