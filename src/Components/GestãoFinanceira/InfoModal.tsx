import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box } from '@mui/material';
import { Close, Info } from '@mui/icons-material';

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  details?: string[];
}

export default function InfoModal({ open, onClose, title, description, details }: InfoModalProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'var(--bg-card)',
          borderRadius: 2,
          border: '1px solid var(--border-default)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        color: 'var(--text-primary)',
        fontWeight: 600,
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Info sx={{ color: 'var(--color-primary)' }} />
          {title}
        </Box>
        <IconButton 
          onClick={onClose}
          size="small"
          sx={{ color: 'var(--text-secondary)' }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'var(--text-secondary)',
            mb: 2,
            lineHeight: 1.6
          }}
        >
          {description}
        </Typography>
        
        {details && details.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {details.map((detail, index) => (
              <Box 
                key={index}
                sx={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  mb: 1.5,
                  pl: 2
                }}
              >
                <Box 
                  sx={{ 
                    width: 6, 
                    height: 6, 
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    mt: 0.8,
                    flexShrink: 0
                  }} 
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5
                  }}
                >
                  {detail}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
