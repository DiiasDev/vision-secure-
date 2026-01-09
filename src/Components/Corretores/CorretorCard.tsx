import { useState } from 'react';
import {
  Card,
  CardContent,
  Avatar,
  IconButton,
  Collapse,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  CreditCard as CreditCardIcon,
  LocationOn as LocationIcon,
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

interface CorretorCardProps {
  corretor: corretor;
}

export function CorretorCard({ corretor }: CorretorCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleWhatsAppClick = () => {
    openWhatsApp(corretor.whatsapp || corretor.telefone);
  };

  const handlePhoneClick = () => {
    makePhoneCall(corretor.telefone);
  };

  const handleEmailClick = () => {
    sendEmail(corretor.email_principal);
  };

  const getStatusIcon = () => {
    switch (corretor.status) {
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

  const getStatusColor = () => {
    switch (corretor.status) {
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

  const statusColor = getStatusColor();

  return (
    <Card
      elevation={0}
      className="transition-all duration-200 hover:shadow-lg"
      sx={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid',
        borderColor: 'var(--border-default)',
        '&:hover': {
          borderColor: 'var(--color-primary)',
        },
      }}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: corretor.corretor_principal === 1 ? 'var(--color-warning)' : 'var(--color-primary)',
                fontSize: '1.125rem',
                fontWeight: 600,
              }}
            >
              {corretor.corretor_principal === 1 ? (
                <StarIcon sx={{ fontSize: 24 }} />
              ) : (
                getInitials(corretor.nome_completo)
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-lg mb-1 truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                {corretor.nome_completo}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Chip
                  {...(getStatusIcon() && { icon: getStatusIcon()! })}
                  label={corretor.status}
                  size="small"
                  sx={{
                    backgroundColor: statusColor.bg,
                    color: statusColor.color,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    height: '24px',
                  }}
                />
                {corretor.corretor_principal === 1 && (
                  <Chip
                    icon={<StarIcon sx={{ fontSize: 14 }} />}
                    label="Principal"
                    size="small"
                    sx={{
                      backgroundColor: 'var(--color-warning-bg)',
                      color: 'var(--color-warning)',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      height: '24px',
                    }}
                  />
                )}
                {corretor.cargo && (
                  <Chip
                    icon={<WorkIcon sx={{ fontSize: 14 }} />}
                    label={corretor.cargo}
                    size="small"
                    sx={{
                      backgroundColor: 'var(--color-accent-light)',
                      color: 'var(--color-accent)',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      height: '24px',
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {corretor.whatsapp && (
              <Tooltip title="WhatsApp">
                <IconButton
                  size="small"
                  onClick={handleWhatsAppClick}
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
                  onClick={handlePhoneClick}
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
                  onClick={handleEmailClick}
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
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{
                color: 'var(--text-secondary)',
                ml: 1,
              }}
            >
              {expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </IconButton>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2">
            <PhoneIcon sx={{ fontSize: 18, color: 'var(--text-muted)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {formatPhone(corretor.telefone)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <EmailIcon sx={{ fontSize: 18, color: 'var(--text-muted)' }} />
            <span className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
              {corretor.email_principal}
            </span>
          </div>
        </div>

        {/* Expandable Details */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: '1px solid',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CPF */}
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--color-primary-light)' }}
                >
                  <CreditCardIcon sx={{ fontSize: 20, color: 'var(--color-primary)' }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    CPF
                  </p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {formatCPF(corretor.cpf)}
                  </p>
                </div>
              </div>

              {/* RG */}
              {corretor.rg && (
                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: 'var(--color-accent-light)' }}
                  >
                    <BadgeIcon sx={{ fontSize: 20, color: 'var(--color-accent)' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                      RG
                    </p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {corretor.rg}
                    </p>
                  </div>
                </div>
              )}

              {/* SUSEP */}
              {corretor.susep && (
                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: 'var(--color-warning-bg)' }}
                  >
                    <BadgeIcon sx={{ fontSize: 20, color: 'var(--color-warning)' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                      SUSEP
                    </p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {corretor.susep}
                    </p>
                  </div>
                </div>
              )}

              {/* Data de Nascimento */}
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--color-info-bg)' }}
                >
                  <CalendarIcon sx={{ fontSize: 20, color: 'var(--color-info)' }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    Data de Nascimento
                  </p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {formatDate(corretor.data_nascimento)}
                  </p>
                </div>
              </div>

              {/* Endereço */}
              <div className="flex items-start gap-3 md:col-span-2">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--color-success-bg)' }}
                >
                  <LocationIcon sx={{ fontSize: 20, color: 'var(--color-success)' }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    Endereço
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {corretor.endereco}, {corretor.cidade} - {corretor.estado}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    CEP: {corretor.cep}
                  </p>
                </div>
              </div>

              {/* Observações */}
              {corretor.observacoes && (
                <div className="flex items-start gap-3 md:col-span-2">
                  <div className="flex-1">
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                      Observações
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {corretor.observacoes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Metadata */}
            {(corretor.creation || corretor.modified) && (
              <div
                className="mt-4 pt-4 border-t"
                style={{ borderColor: 'var(--border-light)' }}
              >
                <div className="flex justify-between items-center text-xs" style={{ color: 'var(--text-muted)' }}>
                  {corretor.creation && <span>Cadastrado em: {formatDate(corretor.creation)}</span>}
                  {corretor.modified && <span>Atualizado em: {formatDate(corretor.modified)}</span>}
                </div>
              </div>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
