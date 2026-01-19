import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  Chip,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

interface ErrorItem {
  id: string;
  error: string;
}

interface ErrorModalProps {
  open: boolean;
  onClose: () => void;
  errors: ErrorItem[];
  title?: string;
  onRefresh?: () => void;
}

export function ErrorModal({ 
  open, 
  onClose, 
  errors, 
  title = 'Erros na Exclusão',
  onRefresh 
}: ErrorModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          padding: '8px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
            }}
          >
            <span style={{ fontSize: 24 }}>⚠️</span>
          </Box>
          <Box>
            <span style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 700 }}>
              {title}
            </span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px', fontWeight: 400 }}>
              {errors.length} erro{errors.length !== 1 ? 's' : ''} encontrado{errors.length !== 1 ? 's' : ''}
            </p>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {errors.map((err, index) => (
            <Box
              key={index}
              sx={{
                p: 2.5,
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box
                  sx={{
                    minWidth: 32,
                    height: 32,
                    borderRadius: '8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 0.5,
                  }}
                >
                  <DeleteIcon sx={{ color: '#ef4444', fontSize: 18 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Chip
                      label={err.id}
                      size="small"
                      sx={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                      }}
                    />
                  </Box>
                  <p
                    style={{
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {err.error}
                  </p>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        
        <Alert 
          severity="info" 
          sx={{ 
            mt: 3,
            borderRadius: '12px',
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            '& .MuiAlert-icon': {
              color: 'var(--color-primary)',
            },
          }}
        >
          <Box>
            <strong style={{ color: 'var(--text-primary)' }}>💡 Dica:</strong>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Se os registros já foram deletados, atualize a página para sincronizar com o servidor.
            </p>
          </Box>
        </Alert>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: 'var(--color-primary)',
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            py: 1,
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#5b21b6',
            },
          }}
        >
          Entendi
        </Button>
        {onRefresh && (
          <Button
            onClick={() => {
              onClose();
              onRefresh();
            }}
            variant="outlined"
            sx={{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1,
              borderRadius: '8px',
              '&:hover': {
                borderColor: '#5b21b6',
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
              },
            }}
          >
            Atualizar Lista
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
