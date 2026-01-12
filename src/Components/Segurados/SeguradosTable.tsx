import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  Box,
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { segurado } from '../../Types/segurados.types';
import { formatDate, formatPhone, formatCPF } from '../../Utils/Formatter';
import { getInitials } from '../../Utils/StringHelpers';
import { openWhatsApp, makePhoneCall, sendEmail } from '../../Utils/ContactHelpers';
import { deletarSegurado } from '../../Services/Segurados';
import { useState } from 'react';

interface SeguradosTableProps {
  segurados: segurado[];
  onEdit?: (segurado: segurado) => void;
  onDelete?: () => void;
}

export function SeguradosTable({ segurados, onEdit, onDelete }: SeguradosTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [seguradoToDelete, setSeguradoToDelete] = useState<segurado | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleWhatsAppClick = (segurado: segurado) => {
    openWhatsApp(segurado.whatsapp || segurado.telefone);
  };

  const handlePhoneClick = (phone: string) => {
    makePhoneCall(phone);
  };

  const handleEmailClick = (email: string) => {
    sendEmail(email);
  };

  const handleDeleteClick = (segurado: segurado) => {
    setSeguradoToDelete(segurado);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!seguradoToDelete) return;

    try {
      setDeleting(true);
      await deletarSegurado(seguradoToDelete.name);
      setDeleteDialogOpen(false);
      setSeguradoToDelete(null);
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Erro ao deletar segurado:', error);
      alert('Erro ao deletar segurado. Tente novamente.');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSeguradoToDelete(null);
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      className="rounded-lg"
      sx={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid',
        borderColor: 'var(--border-default)',
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: 'var(--bg-table-header)',
            }}
          >
            <TableCell sx={{ py: 2 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Segurado
              </span>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Tipo
              </span>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                CPF
              </span>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Telefone
              </span>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                E-mail
              </span>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Data de Nascimento
              </span>
            </TableCell>
            <TableCell align="center" sx={{ py: 2 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Ações
              </span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {segurados.map((segurado) => (
            <TableRow
              key={segurado.name}
              sx={{
                backgroundColor: 'var(--bg-table-row)',
                '&:hover': {
                  backgroundColor: 'var(--bg-table-row-hover)',
                },
                transition: 'background-color 0.2s',
              }}
            >
              {/* Nome e Avatar */}
              <TableCell sx={{ py: 2 }}>
                <div className="flex items-center gap-3">
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: 'var(--color-primary)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    {getInitials(segurado.nome_completo)}
                  </Avatar>
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {segurado.nome_completo}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      ID: {segurado.name}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* Tipo de Pessoa */}
              <TableCell sx={{ py: 2 }}>
                <Chip
                  icon={segurado.tipo_pessoa === 'Física' ? <PersonIcon /> : <BusinessIcon />}
                  label={segurado.tipo_pessoa === 'Física' ? 'PF' : 'PJ'}
                  size="small"
                  sx={{
                    backgroundColor:
                      segurado.tipo_pessoa === 'Física'
                        ? 'var(--color-primary-light)'
                        : 'var(--color-accent-light)',
                    color:
                      segurado.tipo_pessoa === 'Física'
                        ? 'var(--color-primary)'
                        : 'var(--color-accent)',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </TableCell>

              {/* CPF */}
              <TableCell sx={{ py: 2 }}>
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {formatCPF(segurado.cpf)}
                </span>
              </TableCell>

              {/* Telefone */}
              <TableCell sx={{ py: 2 }}>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {formatPhone(segurado.telefone)}
                </span>
              </TableCell>

              {/* E-mail */}
              <TableCell sx={{ py: 2 }}>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {segurado.email || 'N/A'}
                </span>
              </TableCell>

              {/* Data de Nascimento */}
              <TableCell sx={{ py: 2 }}>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {formatDate(segurado.data_nascimento)}
                </span>
              </TableCell>

              {/* Ações */}
              <TableCell align="center" sx={{ py: 2 }}>
                <div className="flex items-center justify-center gap-1">
                  {onEdit && (
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(segurado)}
                        sx={{
                          color: 'var(--color-primary)',
                          '&:hover': {
                            backgroundColor: 'var(--color-primary-light)',
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Deletar">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(segurado)}
                      sx={{
                        color: '#ef4444',
                        '&:hover': {
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {segurado.whatsapp && (
                    <Tooltip title="WhatsApp">
                      <IconButton
                        size="small"
                        onClick={() => handleWhatsAppClick(segurado)}
                        sx={{
                          color: '#25D366',
                          '&:hover': {
                            backgroundColor: 'rgba(37, 211, 102, 0.1)',
                          },
                        }}
                      >
                        <WhatsAppIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {segurado.telefone && (
                    <Tooltip title="Ligar">
                      <IconButton
                        size="small"
                        onClick={() => handlePhoneClick(segurado.telefone)}
                        sx={{
                          color: 'var(--color-primary)',
                          '&:hover': {
                            backgroundColor: 'var(--color-primary-light)',
                          },
                        }}
                      >
                        <PhoneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {segurado.email && (
                    <Tooltip title="Enviar E-mail">
                      <IconButton
                        size="small"
                        onClick={() => handleEmailClick(segurado.email)}
                        sx={{
                          color: 'var(--text-secondary)',
                          '&:hover': {
                            backgroundColor: 'var(--bg-sidebar-hover)',
                          },
                        }}
                      >
                        <EmailIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
          },
        }}
      >
        <DialogTitle 
          id="delete-dialog-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            pb: 2,
            color: 'var(--text-primary)',
            fontSize: '1.25rem',
            fontWeight: 600,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: 'var(--color-error-bg)',
            }}
          >
            <DeleteIcon sx={{ color: 'var(--color-error)', fontSize: 28 }} />
          </Box>
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <DialogContentText 
            id="delete-dialog-description"
            sx={{ 
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              lineHeight: 1.6,
            }}
          >
            Tem certeza que deseja deletar o segurado{' '}
            <Box 
              component="span" 
              sx={{ 
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              {seguradoToDelete?.nome_completo}
            </Box>
            ?<br />
            <Box 
              component="span" 
              sx={{ 
                color: 'var(--color-error)',
                fontWeight: 500,
                mt: 1,
                display: 'inline-block',
              }}
            >
              Esta ação não pode ser desfeita.
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button 
            onClick={handleCancelDelete} 
            disabled={deleting}
            variant="outlined"
            sx={{
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              '&:hover': {
                borderColor: 'var(--color-primary)',
                backgroundColor: 'var(--color-primary-light)',
              },
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? null : <DeleteIcon />}
            sx={{
              backgroundColor: 'var(--color-error)',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                backgroundColor: '#dc2626',
              },
              '&:disabled': {
                backgroundColor: 'var(--color-error)',
                opacity: 0.6,
              },
            }}
          >
            {deleting ? 'Deletando...' : 'Deletar'}
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}
