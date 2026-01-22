import { useState } from 'react';
import { 
  Box, 
  Button, 
  Popover, 
  Typography, 
  Checkbox, 
  FormControlLabel, 
  IconButton
} from '@mui/material';
import { Category, Close } from '@mui/icons-material';

interface CategoriaFilterProps {
  onCategoriasChange?: (categorias: string[]) => void;
}

const todasCategorias = [
  { key: 'auto', name: 'Auto', color: '#2563eb' },
  { key: 'vida', name: 'Vida', color: '#16a34a' },
  { key: 'residencial', name: 'Residencial', color: '#8b5cf6' },
  { key: 'empresarial', name: 'Empresarial', color: '#d97706' },
  { key: 'outros', name: 'Outros', color: '#64748b' }
];

export default function CategoriaFilter({ onCategoriasChange }: CategoriaFilterProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleToggleCategoria = (categoriaKey: string) => {
    const newSelected = selectedCategorias.includes(categoriaKey)
      ? selectedCategorias.filter(c => c !== categoriaKey)
      : [...selectedCategorias, categoriaKey];
    
    setSelectedCategorias(newSelected);
    if (onCategoriasChange) {
      onCategoriasChange(newSelected);
    }
  };

  const handleSelectAll = () => {
    if (selectedCategorias.length === todasCategorias.length) {
      setSelectedCategorias([]);
      if (onCategoriasChange) {
        onCategoriasChange([]);
      }
    } else {
      const allKeys = todasCategorias.map(c => c.key);
      setSelectedCategorias(allKeys);
      if (onCategoriasChange) {
        onCategoriasChange(allKeys);
      }
    }
  };

  const handleClear = () => {
    setSelectedCategorias([]);
    if (onCategoriasChange) {
      onCategoriasChange([]);
    }
  };

  const getButtonLabel = () => {
    if (selectedCategorias.length === 0) return 'Todas as Categorias';
    if (selectedCategorias.length === 1) {
      const cat = todasCategorias.find(c => c.key === selectedCategorias[0]);
      return cat?.name || 'Categoria';
    }
    return `${selectedCategorias.length} categorias`;
  };

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<Category sx={{ fontSize: 18 }} />}
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
              Filtrar por Categoria
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleClose}
              sx={{ color: 'var(--text-secondary)' }}
            >
              <Close sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          {/* Select All */}
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedCategorias.length === todasCategorias.length}
                indeterminate={selectedCategorias.length > 0 && selectedCategorias.length < todasCategorias.length}
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
                Selecionar Todas
              </Typography>
            }
            sx={{ mb: 1 }}
          />

          {/* Categorias List */}
          <Box 
            sx={{ 
              borderTop: '1px solid var(--border-default)',
              borderBottom: '1px solid var(--border-default)',
              py: 1,
              my: 2
            }}
          >
            {todasCategorias.map((categoria) => (
              <FormControlLabel
                key={categoria.key}
                control={
                  <Checkbox
                    checked={selectedCategorias.includes(categoria.key)}
                    onChange={() => handleToggleCategoria(categoria.key)}
                    sx={{
                      color: 'var(--text-secondary)',
                      '&.Mui-checked': {
                        color: categoria.color,
                      }
                    }}
                  />
                }
                label={
                  <Box className="flex items-center gap-2">
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        backgroundColor: categoria.color 
                      }} 
                    />
                    <Typography sx={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                      {categoria.name}
                    </Typography>
                  </Box>
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
