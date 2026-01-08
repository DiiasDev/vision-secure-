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
  Person as PersonIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import type { segurado } from '../../Types/segurados.types';
import { formatDate, formatPhone, formatCPF } from '../../Utils/Formatter';
import { getInitials } from '../../Utils/StringHelpers';
import { openWhatsApp, makePhoneCall, sendEmail } from '../../Utils/ContactHelpers';

interface SeguradosTableProps {
  segurados: segurado[];
}

export function SeguradosTable({ segurados }: SeguradosTableProps) {
  const handleWhatsAppClick = (segurado: segurado) => {
    openWhatsApp(segurado.whatsapp || segurado.telefone);
  };

  const handlePhoneClick = (phone: string) => {
    makePhoneCall(phone);
  };

  const handleEmailClick = (email: string) => {
    sendEmail(email);
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
    </TableContainer>
  );
}
