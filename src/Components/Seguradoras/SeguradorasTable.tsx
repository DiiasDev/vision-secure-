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
  Language as LanguageIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Pause as SuspendedIcon,
  Code as CodeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DeleteSweep as DeleteSweepIcon,
} from '@mui/icons-material';
import type { seguradora } from '../../Types/seguradoras.types';
import { formatPhone } from '../../Utils/Formatter';
import { getInitials } from '../../Utils/StringHelpers';
import { makePhoneCall, sendEmail } from '../../Utils/ContactHelpers';
import { deletarSeguradora } from '../../Services/Seguradoras';
import { useState } from 'react';
import { validateDependencies } from '../../Services/dependencyValidator';
import { ErrorModal } from '../ErrorModal';

interface SeguradorasTableProps {
  seguradoras: seguradora[];
  onEdit?: (seguradora: seguradora) => void;
  onDelete?: () => void;
}

export function SeguradorasTable({ seguradoras, onEdit, onDelete }: SeguradorasTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [seguradoraToDelete, setSeguradoraToDelete] = useState<seguradora | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [dependencyError, setDependencyError] = useState<string | null>(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [bulkErrors, setBulkErrors] = useState<Array<{id: string, error: string}>>([]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = new Set(seguradoras.map((s) => s.name!));
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

    for (const seguradoraId of Array.from(selected)) {
      try {
        const validation = await validateDependencies('Seguradoras', seguradoraId);
        if (validation.hasError) {
          errorsList.push({ id: seguradoraId, error: validation.message });
          continue;
        }
        await deletarSeguradora(seguradoraId);
        successCount++;
      } catch (error: any) {
        console.error(`Erro ao deletar seguradora ${seguradoraId}:`, error);
        let errorMessage = 'Erro desconhecido';
        
        if (error.response?.status === 404) {
          errorMessage = 'Seguradora não existe mais no sistema';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        errorsList.push({ id: seguradoraId, error: errorMessage });
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

  const handlePhoneClick = (phone: string) => {
    makePhoneCall(phone);
  };

  const handleEmailClick = (email: string) => {
    sendEmail(email);
  };

  const handleWebsiteClick = (site: string) => {
    window.open(site.startsWith('http') ? site : `https://${site}`, '_blank');
  };

  const handleDeleteClick = async (seguradora: seguradora) => {
    const validation = await validateDependencies('Seguradoras', seguradora.name!);
    if (validation.hasError) {
      setDependencyError(validation.message);
    } else {
      setDependencyError(null);
    }
    setSeguradoraToDelete(seguradora);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!seguradoraToDelete || !seguradoraToDelete.name) return;

    try {
      setDeleting(true);
      await deletarSeguradora(seguradoraToDelete.name);
      setDeleteDialogOpen(false);
      setSeguradoraToDelete(null);
      setDependencyError(null);
      if (onDelete) onDelete();
    } catch (error: any) {
      console.error('Erro ao deletar seguradora:', error);
      const errorMessage = error.message || 'Erro ao deletar seguradora. Tente novamente.';
      setDependencyError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSeguradoraToDelete(null);
    setDependencyError(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ativa':
        return <ActiveIcon sx={{ fontSize: 16 }} />;
      case 'Inativa':
        return <InactiveIcon sx={{ fontSize: 16 }} />;
      case 'Suspensa':
        return <SuspendedIcon sx={{ fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativa':
        return {
          bg: 'var(--color-success-bg)',
          color: 'var(--color-success)',
        };
      case 'Inativa':
        return {
          bg: 'var(--color-error-bg)',
          color: 'var(--color-error)',
        };
      case 'Suspensa':
        return {
          bg: 'var(--color-warning-bg)',
          color: 'var(--color-warning)',
        };
      default:
        return {
          bg: 'var(--color-info-bg)',
          color: 'var(--color-info)',
        };
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
            {selected.size} seguradora(s) selecionada(s)
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
                indeterminate={selected.size > 0 && selected.size < seguradoras.length}
                checked={seguradoras.length > 0 && selected.size === seguradoras.length}
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
                Seguradora
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
                Código
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
                Site
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
          {seguradoras.map((seguradora) => {
            const statusColor = getStatusColor(seguradora.status);
            return (
              <TableRow
                key={seguradora.name}
                sx={{
                  backgroundColor: selected.has(seguradora.name!)
                    ? 'rgba(99, 102, 241, 0.08)'
                    : 'var(--bg-table-row)',
                  '&:hover': {
                    backgroundColor: selected.has(seguradora.name!)
                      ? 'rgba(99, 102, 241, 0.12)'
                      : 'var(--bg-table-row-hover)',
                  },
                  transition: 'background-color 0.2s',
                }}
              >
                {/* Checkbox */}
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.has(seguradora.name!)}
                    onChange={() => handleSelectOne(seguradora.name!)}
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
                    {seguradora.logo_seguradora ? (
                      <Avatar
                        src={seguradora.logo_seguradora}
                        sx={{
                          width: 40,
                          height: 40,
                        }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: 'var(--color-primary)',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        {getInitials(seguradora.nome_seguradora)}
                      </Avatar>
                    )}
                    <div>
                      <p
                        className="font-semibold text-sm"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {seguradora.nome_seguradora}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        ID: {seguradora.name}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell sx={{ py: 2 }}>
                  <Chip
                    {...(getStatusIcon(seguradora.status) && { icon: getStatusIcon(seguradora.status)! })}
                    label={seguradora.status}
                    size="small"
                    sx={{
                      backgroundColor: statusColor.bg,
                      color: statusColor.color,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                </TableCell>

                {/* Código Interno */}
                <TableCell sx={{ py: 2 }}>
                  {seguradora.codigo_interno ? (
                    <Chip
                      icon={<CodeIcon sx={{ fontSize: 14 }} />}
                      label={seguradora.codigo_interno}
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

                {/* Telefone */}
                <TableCell sx={{ py: 2 }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {seguradora.telefone ? formatPhone(seguradora.telefone) : 'N/A'}
                  </span>
                </TableCell>

                {/* E-mail */}
                <TableCell sx={{ py: 2 }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {seguradora.email || 'N/A'}
                  </span>
                </TableCell>

                {/* Site */}
                <TableCell sx={{ py: 2 }}>
                  {seguradora.site ? (
                    <a
                      href={seguradora.site.startsWith('http') ? seguradora.site : `https://${seguradora.site}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      Visitar
                    </a>
                  ) : (
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      N/A
                    </span>
                  )}
                </TableCell>

                {/* Ações */}
                <TableCell align="center" sx={{ py: 2 }}>
                  <div className="flex items-center justify-center gap-1">
                    {onEdit && (
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => onEdit(seguradora)}
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
                        onClick={() => handleDeleteClick(seguradora)}
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
                    {seguradora.site && (
                      <Tooltip title="Visitar Site">
                        <IconButton
                          size="small"
                          onClick={() => handleWebsiteClick(seguradora.site!)}
                          sx={{
                            color: 'var(--color-info)',
                            '&:hover': {
                              backgroundColor: 'var(--color-info-bg)',
                            },
                          }}
                        >
                          <LanguageIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {seguradora.telefone && (
                      <Tooltip title="Ligar">
                        <IconButton
                          size="small"
                          onClick={() => handlePhoneClick(seguradora.telefone!)}
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
                    {seguradora.email && (
                      <Tooltip title="Enviar E-mail">
                        <IconButton
                          size="small"
                          onClick={() => handleEmailClick(seguradora.email!)}
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
            );
          })}
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
              Tem certeza que deseja deletar a seguradora{' '}
              <Box 
                component="span" 
                sx={{ 
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                {seguradoraToDelete?.nome_seguradora}
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
            <strong style={{ color: 'var(--text-primary)' }}>{selected.size}</strong> seguradora(s)?
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
