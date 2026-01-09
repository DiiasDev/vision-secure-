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
  Language as LanguageIcon,
  Business as BusinessIcon,
  Code as CodeIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Pause as SuspendedIcon,
} from '@mui/icons-material';
import type { seguradora } from '../../Types/seguradoras.types';
import { formatDate, formatPhone } from '../../Utils/Formatter';
import { getInitials } from '../../Utils/StringHelpers';
import { makePhoneCall, sendEmail } from '../../Utils/ContactHelpers';

interface SeguradoraCardProps {
  seguradora: seguradora;
}

export function SeguradoraCard({ seguradora }: SeguradoraCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handlePhoneClick = () => {
    if (seguradora.telefone) {
      makePhoneCall(seguradora.telefone);
    }
  };

  const handleEmailClick = () => {
    if (seguradora.email) {
      sendEmail(seguradora.email);
    }
  };

  const handleWebsiteClick = () => {
    if (seguradora.site) {
      window.open(seguradora.site.startsWith('http') ? seguradora.site : `https://${seguradora.site}`, '_blank');
    }
  };

  const getStatusIcon = () => {
    switch (seguradora.status) {
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

  const getStatusColor = () => {
    switch (seguradora.status) {
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
            {seguradora.logo_seguradora ? (
              <Avatar
                src={seguradora.logo_seguradora}
                sx={{
                  width: 48,
                  height: 48,
                }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: 'var(--color-primary)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                }}
              >
                {getInitials(seguradora.nome_seguradora)}
              </Avatar>
            )}
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-lg mb-1 truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                {seguradora.nome_seguradora}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Chip
                  {...(getStatusIcon() && { icon: getStatusIcon()! })}
                  label={seguradora.status}
                  size="small"
                  sx={{
                    backgroundColor: statusColor.bg,
                    color: statusColor.color,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    height: '24px',
                  }}
                />
                {seguradora.codigo_interno && (
                  <Chip
                    icon={<CodeIcon sx={{ fontSize: 14 }} />}
                    label={seguradora.codigo_interno}
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
            {seguradora.site && (
              <Tooltip title="Visitar Site">
                <IconButton
                  size="small"
                  onClick={handleWebsiteClick}
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
            {seguradora.email && (
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
          {seguradora.telefone && (
            <div className="flex items-center gap-2">
              <PhoneIcon sx={{ fontSize: 18, color: 'var(--text-muted)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {formatPhone(seguradora.telefone)}
              </span>
            </div>
          )}
          {seguradora.email && (
            <div className="flex items-center gap-2">
              <EmailIcon sx={{ fontSize: 18, color: 'var(--text-muted)' }} />
              <span className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                {seguradora.email}
              </span>
            </div>
          )}
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
            <div className="grid grid-cols-1 gap-4">
              {/* Site */}
              {seguradora.site && (
                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: 'var(--color-info-bg)' }}
                  >
                    <LanguageIcon sx={{ fontSize: 20, color: 'var(--color-info)' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                      Site
                    </p>
                    <a
                      href={seguradora.site.startsWith('http') ? seguradora.site : `https://${seguradora.site}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold hover:underline"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {seguradora.site}
                    </a>
                  </div>
                </div>
              )}

              {/* Código Interno */}
              {seguradora.codigo_interno && (
                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: 'var(--color-accent-light)' }}
                  >
                    <CodeIcon sx={{ fontSize: 20, color: 'var(--color-accent)' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                      Código Interno
                    </p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {seguradora.codigo_interno}
                    </p>
                  </div>
                </div>
              )}

              {/* Observações */}
              {seguradora.observacoes && (
                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: 'var(--color-primary-light)' }}
                  >
                    <BusinessIcon sx={{ fontSize: 20, color: 'var(--color-primary)' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                      Observações
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {seguradora.observacoes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Metadata */}
            {(seguradora.creation || seguradora.modified) && (
              <div
                className="mt-4 pt-4 border-t"
                style={{ borderColor: 'var(--border-light)' }}
              >
                <div className="flex justify-between items-center text-xs" style={{ color: 'var(--text-muted)' }}>
                  {seguradora.creation && <span>Cadastrado em: {formatDate(seguradora.creation)}</span>}
                  {seguradora.modified && <span>Atualizado em: {formatDate(seguradora.modified)}</span>}
                </div>
              </div>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
