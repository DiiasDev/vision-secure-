import { TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface SeguradorasFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
}

export function SeguradorasFilter({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
}: SeguradorasFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search */}
      <TextField
        fullWidth
        placeholder="Buscar por nome, código, telefone ou e-mail..."
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
        }}
      >
        <InputLabel>Status</InputLabel>
        <Select value={filterStatus} onChange={(e) => onFilterStatusChange(e.target.value)} label="Status">
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="Ativa">Ativa</MenuItem>
          <MenuItem value="Inativa">Inativa</MenuItem>
          <MenuItem value="Suspensa">Suspensa</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
