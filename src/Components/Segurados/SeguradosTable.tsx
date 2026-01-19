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
  Checkbox,
  Alert,
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DeleteSweep as DeleteSweepIcon,
} from '@mui/icons-material';
import type { segurado } from '../../Types/segurados.types';
import { formatDate, formatPhone, formatCPF } from '../../Utils/Formatter';
import { getInitials } from '../../Utils/StringHelpers';
import { openWhatsApp, makePhoneCall, sendEmail } from '../../Utils/ContactHelpers';
import { deletarSegurado } from '../../Services/Segurados';
import { useState } from 'react';
import { validateDependencies } from '../../Services/dependencyValidator';
import { ErrorModal } from '../ErrorModal';

interface SeguradosTableProps {
  segurados: segurado[];
  onEdit?: (segurado: segurado) => void;
  onDelete?: () => void;
}

export function SeguradosTable({ segurados, onEdit, onDelete }: SeguradosTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [seguradoToDelete, setSeguradoToDelete] = useState<segurado | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [dependencyError, setDependencyError] = useState<string | null>(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [bulkErrors, setBulkErrors] = useState<Array<{id: string, error: string}>>([]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = new Set(segurados.map((s) => s.name!));
      setSelected(allIds);
    } else {
      setSelected(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const handleBulkDelete = () => {
    if (selected.size === 0) return;
    setBulkDeleteDialogOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    setDeleting(true);
    setDependencyError(null);
    const errorsList: Array<{id: string, error: string}> = [];
    let successCount = 0;

    for (const seguradoId of Array.from(selected)) {
      try {
        const validation = await validateDependencies('Segurados', seguradoId);
        if (validation.hasError) {
          errorsList.push({ id: seguradoId, error: validation.message });
          continue;
        }
        await deletarSegurado(seguradoId);
        successCount++;
      } catch (error: any) {
        console.error(`Erro ao deletar segurado ${seguradoId}:`, error);
        let errorMessage = 'Erro desconhecido';
        
        if (error.response?.status === 404) {
          errorMessage = 'Segurado não existe mais no sistema';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        errorsList.push({ id: seguradoId, error: errorMessage });
      }
    }

    setDeleting(false);
    setBulkDeleteDialogOpen(false);
    setSelected(new Set());

    if (errorsList.length > 0) {
      setBulkErrors(errorsList);
      setErrorModalOpen(true);
    }

    if (onDelete) {
      onDelete();
    }
  };

  const handleWhatsAppClick = (segurado: segurado) => {
    openWhatsApp(segurado.whatsapp || segurado.telefone);
  };

  const handlePhoneClick = (phone: string) => {
    makePhoneCall(phone);
  };

  const handleEmailClick = (email: string) => {
    sendEmail(email);
  };

  const handleDeleteClick = async (segurado: segurado) => {
    const validation = await validateDependencies('Segurados', segurado.name);
    if (validation.hasError) {
      setDependencyError(validation.message);
    } else {
      setDependencyError(null);
    }
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
      setDependencyError(null);
      if (onDelete) onDelete();
    } catch (error: any) {
      console.error('Erro ao deletar segurado:', error);
      const errorMessage = error.message || 'Erro ao deletar segurado. Tente novamente.';
      setDependencyError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSeguradoToDelete(null);
    setDependencyError(null);
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
      {/* Bulk Actions Toolbar */}
      {selected.size > 0 && (
        <Box
          sx={{
            px: 3,
            py: 2,
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderBottom: '1px solid',
            borderColor: 'var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              color: 'var(--color-primary)',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            {selected.size} segurado(s) selecionado(s)
          </span>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteSweepIcon />}
            onClick={handleBulkDelete}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Deletar Selecionados
          </Button>
        </Box>
      )}

      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: 'var(--bg-table-header)',
            }}
          >
            <TableCell padding="checkbox" sx={{ py: 2 }}>
              <Checkbox
                indeterminate={selected.size > 0 && selected.size < segurados.length}
                checked={segurados.length > 0 && selected.size === segurados.length}
                onChange={handleSelectAll}
                sx={{
                  color: 'var(--text-muted)',
                  '&.Mui-checked': {
                    color: 'var(--color-primary)',
                  },
                  '&.MuiCheckbox-indeterminate': {
                    color: 'var(--color-primary)',
                  },
                }}
              />
            </TableCell>
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
                backgroundColor: selected.has(segurado.name!)
                  ? 'rgba(99, 102, 241, 0.08)'
                  : 'var(--bg-table-row)',
                '&:hover': {
                  backgroundColor: selected.has(segurado.name!)
                    ? 'rgba(99, 102, 241, 0.12)'
                    : 'var(--bg-table-row-hover)',
                },
                transition: 'background-color 0.2s',
              }}
            >
              {/* Checkbox */}
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selected.has(segurado.name!)}
                  onChange={() => handleSelectOne(segurado.name!)}
                  sx={{
                    color: 'var(--text-muted)',
                    '&.Mui-checked': {
                      color: 'var(--color-primary)',
                    },
                  }}
                />
              </TableCell>

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
          {dependencyError ? (
            <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
              {dependencyError}
            </Alert>
          ) : (
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
          )}
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
            {dependencyError ? 'Fechar' : 'Cancelar'}
          </Button>
          {!dependencyError && (
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
          )}
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '8px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DeleteSweepIcon sx={{ color: '#ef4444', fontSize: 20 }} />
            </Box>
            <span style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 600 }}>
              Confirmar Exclusão em Massa
            </span>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText sx={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Tem certeza que deseja excluir{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{selected.size}</strong> segurado(s)?
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setBulkDeleteDialogOpen(false)}
            variant="outlined"
            disabled={deleting}
            sx={{
              color: 'var(--text-secondary)',
              borderColor: 'var(--border-default)',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                borderColor: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-sidebar-hover)',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleBulkDeleteConfirm}
            variant="contained"
            disabled={deleting}
            sx={{
              backgroundColor: '#ef4444',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#dc2626',
              },
              '&:disabled': {
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
              },
            }}
          >
            {deleting ? 'Excluindo...' : 'Excluir Todos'}
          </Button>
        </DialogActions>
      </Dialog>

      <ErrorModal
        open={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        errors={bulkErrors}
        onRefresh={onDelete}
      />
    </TableContainer>
  );
}
