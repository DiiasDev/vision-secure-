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
  Star as StarIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Pause as SuspendedIcon,
  Work as WorkIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DeleteSweep as DeleteSweepIcon,
} from '@mui/icons-material';
import type { corretor } from '../../Types/corretores.types';
import { formatDate, formatPhone, formatCPF } from '../../Utils/Formatter';
import { getInitials } from '../../Utils/StringHelpers';
import { openWhatsApp, makePhoneCall, sendEmail } from '../../Utils/ContactHelpers';
import { deletarCorretor } from '../../Services/corretores';
import { useState } from 'react';
import { validateDependencies } from '../../Services/dependencyValidator';
import { ErrorModal } from '../ErrorModal';

interface CorretoresTableProps {
  corretores: corretor[];
  onEdit?: (corretor: corretor) => void;
  onDelete?: () => void;
}

export function CorretoresTable({ corretores, onEdit, onDelete }: CorretoresTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [corretorToDelete, setCorretorToDelete] = useState<corretor | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [dependencyError, setDependencyError] = useState<string | null>(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [bulkErrors, setBulkErrors] = useState<Array<{id: string, error: string}>>([]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = new Set(corretores.map((c) => c.name!));
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

    for (const corretorId of Array.from(selected)) {
      try {
        const validation = await validateDependencies('Corretores', corretorId);
        if (validation.hasError) {
          errorsList.push({ id: corretorId, error: validation.message });
          continue;
        }
        await deletarCorretor(corretorId);
        successCount++;
      } catch (error: any) {
        console.error(`Erro ao deletar corretor ${corretorId}:`, error);
        let errorMessage = 'Erro desconhecido';
        
        if (error.response?.status === 404) {
          errorMessage = 'Corretor não existe mais no sistema';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        errorsList.push({ id: corretorId, error: errorMessage });
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

  const handleDeleteClick = async (corretor: corretor) => {
    const validation = await validateDependencies('Corretores', corretor.name);
    if (validation.hasError) {
      setDependencyError(validation.message);
    } else {
      setDependencyError(null);
    }
    setCorretorToDelete(corretor);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!corretorToDelete) return;

    setDeleting(true);
    try {
      await deletarCorretor(corretorToDelete.name);
      setDeleteDialogOpen(false);
      setCorretorToDelete(null);
      setDependencyError(null);
      if (onDelete) {
        onDelete();
      }
    } catch (error: any) {
      console.error('Erro ao deletar corretor:', error);
      const errorMessage = error.message || 'Erro ao deletar corretor. Tente novamente.';
      setDependencyError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCorretorToDelete(null);
    setDependencyError(null);
  };

  const handleWhatsAppClick = (corretor: corretor) => {
    openWhatsApp(corretor.whatsapp || corretor.telefone);
  };

  const handlePhoneClick = (phone: string) => {
    makePhoneCall(phone);
  };

  const handleEmailClick = (email: string) => {
    sendEmail(email);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ativo':
        return <ActiveIcon sx={{ fontSize: 16 }} />;
      case 'Inativo':
        return <InactiveIcon sx={{ fontSize: 16 }} />;
      case 'Suspenso':
        return <SuspendedIcon sx={{ fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return { bg: 'var(--color-success-bg)', color: 'var(--color-success)' };
      case 'Inativo':
        return { bg: 'var(--color-error-bg)', color: 'var(--color-error)' };
      case 'Suspenso':
        return { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)' };
      default:
        return { bg: 'var(--color-info-bg)', color: 'var(--color-info)' };
    }
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
            {selected.size} corretor(es) selecionado(s)
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
                indeterminate={selected.size > 0 && selected.size < corretores.length}
                checked={corretores.length > 0 && selected.size === corretores.length}
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
                Corretor
              </span>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Status
              </span>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Cargo
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
                Cidade
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
          {corretores.map((corretor) => {
            const statusColor = getStatusColor(corretor.status);
            return (
              <TableRow
                key={corretor.name}
                sx={{
                  backgroundColor: selected.has(corretor.name!)
                    ? 'rgba(99, 102, 241, 0.08)'
                    : 'var(--bg-table-row)',
                  '&:hover': {
                    backgroundColor: selected.has(corretor.name!)
                      ? 'rgba(99, 102, 241, 0.12)'
                      : 'var(--bg-table-row-hover)',
                  },
                  transition: 'background-color 0.2s',
                }}
              >
                {/* Checkbox */}
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.has(corretor.name!)}
                    onChange={() => handleSelectOne(corretor.name!)}
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
                        bgcolor: corretor.corretor_principal === 1 ? 'var(--color-warning)' : 'var(--color-primary)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      {corretor.corretor_principal === 1 ? (
                        <StarIcon sx={{ fontSize: 20 }} />
                      ) : (
                        getInitials(corretor.nome_completo)
                      )}
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p
                          className="font-semibold text-sm"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {corretor.nome_completo}
                        </p>
                        {corretor.corretor_principal === 1 && (
                          <StarIcon sx={{ fontSize: 14, color: 'var(--color-warning)' }} />
                        )}
                      </div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        ID: {corretor.name}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell sx={{ py: 2 }}>
                  <Chip
                    {...(getStatusIcon(corretor.status) && { icon: getStatusIcon(corretor.status)! })}
                    label={corretor.status}
                    size="small"
                    sx={{
                      backgroundColor: statusColor.bg,
                      color: statusColor.color,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                </TableCell>

                {/* Cargo */}
                <TableCell sx={{ py: 2 }}>
                  {corretor.cargo ? (
                    <Chip
                      icon={<WorkIcon sx={{ fontSize: 14 }} />}
                      label={corretor.cargo}
                      size="small"
                      sx={{
                        backgroundColor: 'var(--color-accent-light)',
                        color: 'var(--color-accent)',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                      }}
                    />
                  ) : (
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      N/A
                    </span>
                  )}
                </TableCell>

                {/* CPF */}
                <TableCell sx={{ py: 2 }}>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {formatCPF(corretor.cpf)}
                  </span>
                </TableCell>

                {/* Telefone */}
                <TableCell sx={{ py: 2 }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {formatPhone(corretor.telefone)}
                  </span>
                </TableCell>

                {/* E-mail */}
                <TableCell sx={{ py: 2 }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {corretor.email_principal}
                  </span>
                </TableCell>

                {/* Cidade */}
                <TableCell sx={{ py: 2 }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {corretor.cidade} - {corretor.estado}
                  </span>
                </TableCell>

                {/* Ações */}
                <TableCell align="center" sx={{ py: 2 }}>
                  <div className="flex items-center justify-center gap-1">
                    {corretor.whatsapp && (
                      <Tooltip title="WhatsApp">
                        <IconButton
                          size="small"
                          onClick={() => handleWhatsAppClick(corretor)}
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
                    {corretor.telefone && (
                      <Tooltip title="Ligar">
                        <IconButton
                          size="small"
                          onClick={() => handlePhoneClick(corretor.telefone)}
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
                    {corretor.email_principal && (
                      <Tooltip title="Enviar E-mail">
                        <IconButton
                          size="small"
                          onClick={() => handleEmailClick(corretor.email_principal)}
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
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => onEdit?.(corretor)}
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
                    <Tooltip title="Deletar">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(corretor)}
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
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
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
              <DeleteIcon sx={{ color: '#ef4444', fontSize: 20 }} />
            </Box>
            <span style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 600 }}>
              Confirmar Exclusão
            </span>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {dependencyError ? (
            <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
              {dependencyError}
            </Alert>
          ) : (
            <DialogContentText sx={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Tem certeza que deseja excluir o corretor{' '}
              <strong style={{ color: 'var(--text-primary)' }}>
                {corretorToDelete?.nome_completo}
              </strong>
              ? Esta ação não pode ser desfeita.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={handleDeleteCancel}
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
            {dependencyError ? 'Fechar' : 'Cancelar'}
          </Button>
          {!dependencyError && (
            <Button
              onClick={handleDeleteConfirm}
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
              {deleting ? 'Excluindo...' : 'Excluir'}
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
            <strong style={{ color: 'var(--text-primary)' }}>{selected.size}</strong> corretor(es)?
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
