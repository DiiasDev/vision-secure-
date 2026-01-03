import { useState } from 'react';
import {
  TableCell,
  TableRow,
  IconButton,
  Collapse,
  Box,
  Avatar,
  Chip,
  Tooltip,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BadgeIcon from '@mui/icons-material/Badge';
import DescriptionIcon from '@mui/icons-material/Description';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import FavoriteIcon from '@mui/icons-material/Favorite';
import type { ClientData } from './types';

interface ClientRowProps {
  row: ClientData;
}

function InsurerLogo({ logoUrl, name }: { logoUrl: string; name: string }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Se for URL de placeholder ou erro, mostra ícone direto
  if (imageError || logoUrl.includes('placeholder')) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <BusinessIcon sx={{ fontSize: 20, color: '#cbd5e1' }} />
      </div>
    );
  }

  return (
    <>
      {!imageLoaded && (
        <div className="flex items-center justify-center w-full h-full">
          <BusinessIcon sx={{ fontSize: 20, color: '#cbd5e1' }} />
        </div>
      )}
      <img
        src={logoUrl}
        alt={name}
        className="w-8 h-8 object-contain"
        style={{ display: imageLoaded ? 'block' : 'none' }}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
    </>
  );
}

export function ClientRow({ row }: ClientRowProps) {
  const [open, setOpen] = useState(false);

  // Calcula dias até o vencimento
  const getDaysUntilDue = (dueDate: string) => {
    const [day, month, year] = dueDate.split('/').map(Number);
    const due = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateStatusConfig = (dueDate: string, paymentStatus: ClientData['paymentStatus']) => {
    // Se já está pago, mostrar status de pago em verde
    if (paymentStatus === 'paid') {
      return {
        label: 'Pago',
        className: 'bg-green-50 text-green-700 border border-green-200',
        iconColor: '#16a34a',
      };
    }

    // Se está vencido (overdue), mostrar em vermelho
    if (paymentStatus === 'overdue') {
      const daysUntilDue = getDaysUntilDue(dueDate);
      const daysOverdue = Math.abs(daysUntilDue);
      return {
        label: daysOverdue > 0 ? `Vencido há ${daysOverdue} dia${daysOverdue !== 1 ? 's' : ''}` : 'Vencido',
        className: 'bg-red-50 text-red-700 border border-red-200',
        iconColor: '#dc2626',
      };
    }

    // Se está pendente, calcular os dias até o vencimento
    const daysUntilDue = getDaysUntilDue(dueDate);

    if (daysUntilDue === 0) {
      return {
        label: 'Vence hoje',
        className: 'bg-red-50 text-red-700 border border-red-200',
        iconColor: '#dc2626',
      };
    } else if (daysUntilDue < 0) {
      // Caso a data já passou mas o status ainda é pending
      return {
        label: `Vencido há ${Math.abs(daysUntilDue)} dia${Math.abs(daysUntilDue) !== 1 ? 's' : ''}`,
        className: 'bg-red-50 text-red-700 border border-red-200',
        iconColor: '#dc2626',
      };
    } else if (daysUntilDue <= 10) {
      return {
        label: `Vence em ${daysUntilDue} dia${daysUntilDue !== 1 ? 's' : ''}`,
        className: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
        iconColor: '#ca8a04',
      };
    } else {
      return {
        label: `Vence em ${daysUntilDue} dias`,
        className: 'bg-green-50 text-green-700 border border-green-200',
        iconColor: '#16a34a',
      };
    }
  };

  const getPaymentStatusConfig = (status: ClientData['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return {
          label: 'Pago',
          className: 'bg-green-50 text-green-700 border border-green-200',
        };
      case 'pending':
        return {
          label: 'Pendente',
          className: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
        };
      case 'overdue':
        return {
          label: 'Vencido',
          className: 'bg-red-50 text-red-700 border border-red-200',
        };
    }
  };

  const statusConfig = getPaymentStatusConfig(row.paymentStatus);
  const dueDateStatusConfig = getDueDateStatusConfig(row.dueDate, row.paymentStatus);

  // Função para gerar mensagem do WhatsApp
  const generateWhatsAppMessage = () => {
    const firstName = row.name.split(' ')[0];
    const daysUntilDue = getDaysUntilDue(row.dueDate);
    
    let message = `Olá ${firstName}, tudo bem?\n\n`;
    
    if (row.paymentStatus === 'paid') {
      message += `Identificamos que o pagamento da sua apólice *${row.policyNumber}* já foi realizado.\n\n`;
      message += `Obrigado pela confiança!`;
    } else if (row.paymentStatus === 'overdue') {
      const daysOverdue = Math.abs(daysUntilDue);
      message += `Notamos que a parcela da sua apólice *${row.policyNumber}* está vencida há *${daysOverdue} dia${daysOverdue !== 1 ? 's' : ''}*.\n\n`;
      message += `Data de vencimento: *${row.dueDate}*\n\n`;
      message += `Está tudo certo? Podemos te ajudar com algo?`;
    } else if (daysUntilDue === 0) {
      message += `A parcela da sua apólice *${row.policyNumber}* vence *hoje*!\n\n`;
      message += `Está tudo certo com o pagamento? Se precisar de ajuda, estamos aqui!`;
    } else if (daysUntilDue > 0 && daysUntilDue <= 10) {
      message += `A parcela da sua apólice *${row.policyNumber}* vence em *${daysUntilDue} dia${daysUntilDue !== 1 ? 's' : ''}*.\n\n`;
      message += `Data de vencimento: *${row.dueDate}*\n\n`;
      message += `Está tudo certo? Se precisar de ajuda, é só avisar!`;
    } else {
      message += `Como vai? Estou entrando em contato sobre sua apólice *${row.policyNumber}*.\n\n`;
      message += `Está tudo certo? Precisa de alguma informação?`;
    }
    
    return encodeURIComponent(message);
  };

  const handleWhatsAppClick = () => {
    const phone = row.phone.replace(/\D/g, '');
    const message = generateWhatsAppMessage();
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <>
      <TableRow
        sx={{
          backgroundColor: 'var(--bg-table-row)',
          '&:hover': {
            backgroundColor: 'var(--bg-table-row-hover)',
          },
          transition: 'background-color 0.15s ease',
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{
              color: 'var(--text-muted)',
              '&:hover': {
                backgroundColor: 'var(--color-primary-light)',
              },
            }}
          >
            {open ? (
              <KeyboardArrowUpIcon sx={{ color: 'var(--color-primary)' }} />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar
              sx={{
                width: 36,
                height: 36,
                backgroundColor: '#e0e7ff',
                color: '#4f46e5',
              }}
            >
              <PersonIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <div>
              <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                {row.name}
              </div>
              <div
                className="text-xs font-mono px-1.5 py-0.5 rounded inline-block mt-0.5"
                style={{
                  color: 'var(--text-muted)',
                  backgroundColor: 'var(--bg-table-header)',
                }}
              >
                {row.code}
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Tooltip title="Clique para ligar" arrow>
            <div
              className="flex items-center gap-2 cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              <PhoneIcon sx={{ fontSize: 18 }} />
              <span className="font-medium text-sm">{row.phone}</span>
            </div>
          </Tooltip>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {row.insuranceType === 'Auto' ? (
              <DirectionsCarIcon sx={{ color: 'var(--color-primary)', fontSize: 20 }} />
            ) : row.insuranceType === 'Vida' ? (
              <FavoriteIcon sx={{ color: '#ef4444', fontSize: 20 }} />
            ) : (
              <LocalShippingIcon sx={{ color: 'var(--color-warning)', fontSize: 20 }} />
            )}
            <div>
              <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                {row.insuranceType}
              </div>
              {row.vehicleModel && (
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {row.vehicleModel}
                </div>
              )}
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Chip
            label={row.policyNumber}
            size="small"
            icon={<DescriptionIcon sx={{ fontSize: 16 }} />}
            className="font-mono"
            sx={{
              backgroundColor: 'var(--bg-table-header)',
              color: 'var(--text-primary)',
              fontWeight: 500,
              fontSize: '0.75rem',
              height: '24px',
            }}
          />
        </TableCell>
        <TableCell>
          <div
            className="font-medium text-sm px-2.5 py-1 rounded inline-block"
            style={{
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-table-header)',
            }}
          >
            {row.dueDate}
          </div>
        </TableCell>
        <TableCell>
          <Tooltip title={row.insuranceCompany} arrow>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white"
                style={{
                  borderColor: 'var(--border-default)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                }}
              >
                <InsurerLogo logoUrl={row.insuranceCompanyLogo} name={row.insuranceCompany} />
              </div>
              <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                {row.insuranceCompany}
              </span>
            </div>
          </Tooltip>
        </TableCell>
        <TableCell>
          <span
            className={`px-2.5 py-1 rounded text-xs font-medium inline-flex items-center ${statusConfig.className}`}
          >
            {statusConfig.label}
          </span>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <BadgeIcon sx={{ color: 'var(--text-muted)', fontSize: 18 }} />
            <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
              {row.broker}
            </div>
          </div>
        </TableCell>
        <TableCell>
          <span
            className={`px-2.5 py-1 rounded text-xs font-medium inline-flex items-center gap-1.5 ${dueDateStatusConfig.className}`}
          >
            <AccessTimeIcon sx={{ fontSize: 14 }} />
            {dueDateStatusConfig.label}
          </span>
        </TableCell>
        <TableCell align="center">
          <Tooltip title="Enviar mensagem no WhatsApp" arrow>
            <IconButton
              size="small"
              sx={{
                backgroundColor: '#25D366',
                '&:hover': {
                  backgroundColor: '#128C7E',
                },
                color: 'white',
                transition: 'background-color 0.2s ease',
                width: 32,
                height: 32,
              }}
              onClick={handleWhatsAppClick}
            >
              <WhatsAppIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box className="my-3 mx-4">
              <div
                className="rounded-xl p-6"
                style={{
                  backgroundColor: 'var(--bg-table-header)',
                  borderColor: 'var(--border-default)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                }}
              >
                <div className="grid grid-cols-3 gap-6">
                  {/* Coluna 1: Placa */}
                  <div>
                    {row.plate && (
                      <div
                        className="p-4 rounded-lg"
                        style={{
                          backgroundColor: 'var(--bg-card)',
                          borderColor: 'var(--border-default)',
                          borderWidth: '1px',
                          borderStyle: 'solid',
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <DirectionsCarIcon
                            sx={{ color: 'var(--color-primary)' }}
                            fontSize="small"
                          />
                          <span
                            className="font-bold text-sm"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            Placa
                          </span>
                        </div>
                        <div
                          className="font-mono font-bold text-lg px-3 py-2 rounded text-center"
                          style={{
                            color: 'var(--text-primary)',
                            backgroundColor: 'var(--bg-table-header)',
                          }}
                        >
                          {row.plate}
                        </div>
                        {row.vehicleModel && (
                          <div
                            className="text-xs mt-2 text-center"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {row.vehicleModel}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Coluna 2: CPF */}
                  <div>
                    <div
                      className="p-4 rounded-lg"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-default)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <BadgeIcon sx={{ color: 'var(--color-accent)' }} fontSize="small" />
                        <span
                          className="font-bold text-sm"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          CPF
                        </span>
                      </div>
                      <div
                        className="font-mono font-semibold text-base"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {row.cpf}
                      </div>
                    </div>
                  </div>

                  {/* Coluna 3: Observações */}
                  <div className="row-span-2">
                    {row.notes && (
                      <div
                        className="p-4 rounded-lg h-full"
                        style={{
                          backgroundColor: 'var(--bg-card)',
                          borderColor: 'var(--border-default)',
                          borderWidth: '1px',
                          borderStyle: 'solid',
                        }}
                      >
                        <div className="flex items-start gap-2 mb-3">
                          <DescriptionIcon
                            sx={{ color: 'var(--color-warning)' }}
                            fontSize="small"
                          />
                          <span
                            className="font-bold text-sm"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            Observações
                          </span>
                        </div>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {row.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
