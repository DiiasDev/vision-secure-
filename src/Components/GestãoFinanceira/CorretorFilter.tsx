import { useState } from 'react';
import { 
  Box, 
  Button, 
  Popover, 
  Typography, 
  Checkbox, 
  FormControlLabel, 
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import { People, Close, Search } from '@mui/icons-material';

interface CorretorFilterProps {
  onCorretoresChange?: (corretores: string[]) => void;
}

const todosCorretores = [
  'Carlos Silva',
  'Ana Santos',
  'Roberto Lima',
  'Mariana Costa',
  'Pedro Oliveira',
  'Julia Ferreira',
  'Lucas Almeida',
  'Beatriz Souza',
  'Fernando Rocha',
  'Patricia Martins'
];

export default function CorretorFilter({ onCorretoresChange }: CorretorFilterProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedCorretores, setSelectedCorretores] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleToggleCorretor = (corretor: string) => {
    const newSelected = selectedCorretores.includes(corretor)
      ? selectedCorretores.filter(c => c !== corretor)
      : [...selectedCorretores, corretor];
    
    setSelectedCorretores(newSelected);
    if (onCorretoresChange) {
      onCorretoresChange(newSelected);
    }
  };

  const handleSelectAll = () => {
    if (selectedCorretores.length === todosCorretores.length) {
      setSelectedCorretores([]);
      if (onCorretoresChange) {
        onCorretoresChange([]);
      }
    } else {
      setSelectedCorretores(todosCorretores);
      if (onCorretoresChange) {
        onCorretoresChange(todosCorretores);
      }
    }
  };

  const handleClear = () => {
    setSelectedCorretores([]);
    if (onCorretoresChange) {
      onCorretoresChange([]);
    }
  };

  const filteredCorretores = todosCorretores.filter(corretor =>
    corretor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getButtonLabel = () => {
    if (selectedCorretores.length === 0) return 'Todos os Corretores';
    if (selectedCorretores.length === 1) return selectedCorretores[0];
    return `${selectedCorretores.length} corretores selecionados`;
  };

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<People sx={{ fontSize: 18 }} />}
        onClick={handleClick}
        sx={{
          color: 'var(--text-primary)',
          borderColor: 'var(--border-default)',
          backgroundColor: 'var(--bg-card)',
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          padding: '6px 12px',
          maxWidth: 250,
          '&:hover': {
            borderColor: 'var(--color-primary)',
            backgroundColor: 'var(--bg-hover)',
          }
        }}
      >
        <span className="truncate">{getButtonLabel()}</span>
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPopover-paper': {
            backgroundColor: 'var(--bg-card)',
            borderRadius: 2,
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-lg)',
            marginTop: 1,
            minWidth: 320
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box className="flex items-center justify-between mb-3">
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              Filtrar por Corretor
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleClose}
              sx={{ color: 'var(--text-secondary)' }}
            >
              <Close sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          {/* Search */}
          <TextField
            placeholder="Buscar corretor..."
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 20, color: 'var(--text-tertiary)' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'var(--input-bg)',
                '& fieldset': {
                  borderColor: 'var(--input-border)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--color-primary)',
                },
              },
              '& .MuiInputBase-input': {
                color: 'var(--text-primary)',
              }
            }}
          />

          {/* Select All */}
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedCorretores.length === todosCorretores.length}
                indeterminate={selectedCorretores.length > 0 && selectedCorretores.length < todosCorretores.length}
                onChange={handleSelectAll}
                sx={{
                  color: 'var(--text-secondary)',
                  '&.Mui-checked': {
                    color: 'var(--color-primary)',
                  },
                  '&.MuiCheckbox-indeterminate': {
                    color: 'var(--color-primary)',
                  }
                }}
              />
            }
            label={
              <Typography sx={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
                Selecionar Todos
              </Typography>
            }
            sx={{ mb: 1 }}
          />

          {/* Corretores List */}
          <Box 
            sx={{ 
              maxHeight: 300, 
              overflowY: 'auto',
              borderTop: '1px solid var(--border-default)',
              borderBottom: '1px solid var(--border-default)',
              py: 1,
              my: 2
            }}
          >
            {filteredCorretores.map((corretor) => (
              <FormControlLabel
                key={corretor}
                control={
                  <Checkbox
                    checked={selectedCorretores.includes(corretor)}
                    onChange={() => handleToggleCorretor(corretor)}
                    sx={{
                      color: 'var(--text-secondary)',
                      '&.Mui-checked': {
                        color: 'var(--color-primary)',
                      }
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                    {corretor}
                  </Typography>
                }
                sx={{ 
                  display: 'flex',
                  width: '100%',
                  mx: 0,
                  px: 1,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'var(--bg-hover)',
                  }
                }}
              />
            ))}
          </Box>

          {/* Actions */}
          <Box className="flex gap-2">
            <Button
              variant="outlined"
              onClick={handleClear}
              fullWidth
              sx={{
                color: 'var(--text-secondary)',
                borderColor: 'var(--border-default)',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'var(--color-danger)',
                  color: 'var(--color-danger)',
                }
              }}
            >
              Limpar
            </Button>
            <Button
              variant="contained"
              onClick={handleClose}
              fullWidth
              sx={{
                backgroundColor: 'var(--color-primary)',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'var(--color-primary-hover)',
                }
              }}
            >
              Aplicar
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}
