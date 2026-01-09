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
  Language as LanguageIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Pause as SuspendedIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import type { seguradora } from '../../Types/seguradoras.types';
import { formatPhone } from '../../Utils/Formatter';
import { getInitials } from '../../Utils/StringHelpers';
import { makePhoneCall, sendEmail } from '../../Utils/ContactHelpers';

interface SeguradorasTableProps {
  seguradoras: seguradora[];
}

export function SeguradorasTable({ seguradoras }: SeguradorasTableProps) {
  const handlePhoneClick = (phone: string) => {
    makePhoneCall(phone);
  };

  const handleEmailClick = (email: string) => {
    sendEmail(email);
  };

  const handleWebsiteClick = (site: string) => {
    window.open(site.startsWith('http') ? site : `https://${site}`, '_blank');
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
    </TableContainer>
  );
}
