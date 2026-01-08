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
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  Business as BusinessIcon,
  CreditCard as CreditCardIcon,
} from '@mui/icons-material';
import type { segurado } from '../../Types/segurados.types';
import { formatDate, formatPhone, formatCPF } from '../../Utils/Formatter';
import { getInitials } from '../../Utils/StringHelpers';
import { openWhatsApp, makePhoneCall, sendEmail } from '../../Utils/ContactHelpers';

interface SeguradoCardProps {
  segurado: segurado;
}

export function SeguradoCard({ segurado }: SeguradoCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleWhatsAppClick = () => {
    openWhatsApp(segurado.whatsapp || segurado.telefone);
  };

  const handlePhoneClick = () => {
    makePhoneCall(segurado.telefone);
  };

  const handleEmailClick = () => {
    sendEmail(segurado.email);
  };

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
                bgcolor: 'var(--color-primary)',
                fontSize: '1.125rem',
                fontWeight: 600,
              }}
            >
              {getInitials(segurado.nome_completo)}
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-lg mb-1 truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                {segurado.nome_completo}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Chip
                  icon={segurado.tipo_pessoa === 'Física' ? <PersonIcon /> : <BusinessIcon />}
                  label={segurado.tipo_pessoa === 'Física' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  size="small"
                  sx={{
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    height: '24px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {segurado.whatsapp && (
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
            {segurado.telefone && (
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
            {segurado.email && (
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
              {formatPhone(segurado.telefone)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <EmailIcon sx={{ fontSize: 18, color: 'var(--text-muted)' }} />
            <span className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
              {segurado.email || 'N/A'}
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
                    {formatCPF(segurado.cpf)}
                  </p>
                </div>
              </div>

              {/* RG */}
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
                    {segurado.rg || 'N/A'}
                  </p>
                </div>
              </div>

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
                    {formatDate(segurado.data_nascimento)}
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: 'rgba(37, 211, 102, 0.1)' }}
                >
                  <WhatsAppIcon sx={{ fontSize: 20, color: '#25D366' }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    WhatsApp
                  </p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {formatPhone(segurado.whatsapp)}
                  </p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div
              className="mt-4 pt-4 border-t"
              style={{ borderColor: 'var(--border-light)' }}
            >
              <div className="flex justify-between items-center text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>Cadastrado em: {formatDate(segurado.creation)}</span>
                <span>Atualizado em: {formatDate(segurado.modified)}</span>
              </div>
            </div>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
