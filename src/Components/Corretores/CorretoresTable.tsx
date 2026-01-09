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
} from '@mui/icons-material';
import type { corretor } from '../../Types/corretores.types';
import { formatDate, formatPhone, formatCPF } from '../../Utils/Formatter';
import { getInitials } from '../../Utils/StringHelpers';
import { openWhatsApp, makePhoneCall, sendEmail } from '../../Utils/ContactHelpers';

interface CorretoresTableProps {
  corretores: corretor[];
}

export function CorretoresTable({ corretores }: CorretoresTableProps) {
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
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
