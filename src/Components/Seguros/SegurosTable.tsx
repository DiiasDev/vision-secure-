import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
  Box,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  Checkbox,
  Alert,
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  DirectionsCar as DirectionsCarIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  Favorite as FavoriteIcon,
  Flight as FlightIcon,
  MoreHoriz as MoreHorizIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Description as DescriptionIcon,
  Badge as BadgeIcon,
  AccessTime as AccessTimeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DeleteSweep as DeleteSweepIcon,
} from '@mui/icons-material';
import type { seguro } from '../../Types/seguros.types';
import { formatDate, formatCPF, formatPhone } from '../../Utils/Formatter';
import { deletarSeguro } from '../../Services/Seguros';
import { ErrorModal } from '../ErrorModal/ErrorModal';

interface SegurosTableProps {
  seguros: seguro[];
  onEdit?: (seguro: seguro) => void;
  onDelete?: () => void;
}

export function SegurosTable({ seguros, onEdit, onDelete }: SegurosTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [seguroToDelete, setSeguroToDelete] = useState<seguro | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [dependencyError, setDependencyError] = useState<string | null>(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [bulkErrors, setBulkErrors] = useState<Array<{id: string, error: string}>>([]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = new Set(seguros.map((s) => s.name!));
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

    for (const seguroId of Array.from(selected)) {
      try {
        // Seguros não têm dependências, então deletamos diretamente
        await deletarSeguro(seguroId);
        successCount++;
      } catch (error: any) {
        console.error(`Erro ao deletar seguro ${seguroId}:`, error);
        let errorMessage = 'Erro desconhecido';
        
        if (error.response?.status === 404) {
          errorMessage = 'Seguro não existe mais no sistema';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        errorsList.push({ id: seguroId, error: errorMessage });
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

  const handleDeleteClick = async (seguro: seguro) => {
    // Seguros não têm dependências (são o topo da hierarquia)
    setSeguroToDelete(seguro);
    setDependencyError(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!seguroToDelete || !seguroToDelete.name) return;

    setDeleting(true);
    setDependencyError(null);
    try {
      await deletarSeguro(seguroToDelete.name);
      setDeleteDialogOpen(false);
      setSeguroToDelete(null);
      if (onDelete) {
        onDelete();
      }
    } catch (error: any) {
      console.error('Erro ao deletar seguro:', error);
      let errorMessage = 'Erro ao deletar seguro. Tente novamente.';
      
      if (error.response?.status === 404) {
        errorMessage = 'Este seguro não existe mais no sistema ou já foi deletado.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setDependencyError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSeguroToDelete(null);
  };

  const getTipoIcon = (tipo: string) => {
    const iconProps = { fontSize: 20 as const };
    switch (tipo) {
      case 'Auto':
        return <DirectionsCarIcon sx={{ color: 'var(--color-primary)', fontSize: iconProps.fontSize }} />;
      case 'Residencial':
        return <HomeIcon sx={{ color: 'var(--color-info)', fontSize: iconProps.fontSize }} />;
      case 'Empresarial':
        return <BusinessIcon sx={{ color: 'var(--color-accent)', fontSize: iconProps.fontSize }} />;
      case 'Vida':
        return <FavoriteIcon sx={{ color: '#ef4444', fontSize: iconProps.fontSize }} />;
      case 'Viagem':
        return <FlightIcon sx={{ color: 'var(--color-warning)', fontSize: iconProps.fontSize }} />;
      default:
        return <MoreHorizIcon sx={{ color: 'var(--text-muted)', fontSize: iconProps.fontSize }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'Inativo':
        return 'bg-gray-50 text-gray-700 border border-gray-200';
      case 'Cancelado':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'Suspenso':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'Vencido':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getSituacaoPagamentoColor = (situacao: string) => {
    switch (situacao) {
      case 'Em Dia':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'Pendente':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'Atrasado':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'Cancelado':
        return 'bg-gray-50 text-gray-700 border border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getVencimentoStatus = (fimVigencia: string, situacaoPagamento: string) => {
    const hoje = new Date();
    const vencimento = new Date(fimVigencia);
    hoje.setHours(0, 0, 0, 0);
    vencimento.setHours(0, 0, 0, 0);
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (situacaoPagamento === 'Em Dia') {
      return {
        label: 'Em Dia',
        className: 'bg-green-50 text-green-700 border border-green-200',
      };
    }

    if (diffDays < 0) {
      const daysOverdue = Math.abs(diffDays);
      return {
        label: `Vencido há ${daysOverdue} dia${daysOverdue !== 1 ? 's' : ''}`,
        className: 'bg-red-50 text-red-700 border border-red-200',
      };
    } else if (diffDays === 0) {
      return {
        label: 'Vence hoje',
        className: 'bg-red-50 text-red-700 border border-red-200',
      };
    } else if (diffDays <= 10) {
      return {
        label: `Vence em ${diffDays} dia${diffDays !== 1 ? 's' : ''}`,
        className: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      };
    } else {
      return {
        label: `Vence em ${diffDays} dias`,
        className: 'bg-green-50 text-green-700 border border-green-200',
      };
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleRowClick = (seguroName: string) => {
    setExpandedRow(expandedRow === seguroName ? null : seguroName);
  };

  const generateWhatsAppMessage = (seguro: seguro) => {
    // Usa segurado_nome se disponível, senão usa segurado
    const nomeCompleto = seguro.segurado_nome || seguro.segurado;
    // Verifica se é um ID (formato: XXX-XXXXX) ou um nome real
    const isSeguradoId = /^[A-Z]+-\d+$/.test(nomeCompleto);
    const firstName = isSeguradoId ? 'Cliente' : nomeCompleto.split(' ')[0];
    
    const hoje = new Date();
    const vencimento = new Date(seguro.fim_vigencia);
    hoje.setHours(0, 0, 0, 0);
    vencimento.setHours(0, 0, 0, 0);
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let message = `Olá ${firstName}, tudo bem? 😊\n\n`;
    
    // CENÁRIO 1: Pagamento já realizado - Relacionamento e fidelização
    if (seguro.situacao_pagamento === 'Em Dia' && diffDays > 30) {
      message += `Passando aqui para agradecer pela confiança! 🙏\n\n`;
      message += `Sua apólice *${seguro.numero_apolice}* (${seguro.tipo_seguro}) está em dia e vigente até *${formatDate(seguro.fim_vigencia)}*.\n\n`;
      message += `Estamos à disposição para qualquer necessidade:\n`;
      message += `• Dúvidas sobre cobertura\n`;
      message += `• Atualização de dados\n`;
      message += `• Novas contratações\n\n`;
      message += `Conte sempre conosco! 💙`;
    }
    // CENÁRIO 2: Pagamento em dia, renovação se aproximando (30-60 dias)
    else if (seguro.situacao_pagamento === 'Em Dia' && diffDays >= 15 && diffDays <= 30) {
      message += `Tudo certo com sua apólice *${seguro.numero_apolice}*! ✅\n\n`;
      message += `Só passando para lembrar que a renovação se aproxima:\n`;
      message += `📅 Vencimento: *${formatDate(seguro.fim_vigencia)}* (em ${diffDays} dias)\n\n`;
      message += `Quer aproveitar para:\n`;
      message += `• Revisar as coberturas?\n`;
      message += `• Fazer algum ajuste?\n`;
      message += `• Conhecer novos produtos?\n\n`;
      message += `Estou aqui para te ajudar! 😉`;
    }
    // CENÁRIO 3: Vencido há muito tempo (mais de 30 dias) - Urgente
    else if ((seguro.situacao_pagamento === 'Atrasado' || diffDays < -30) && diffDays < -30) {
      const daysOverdue = Math.abs(diffDays);
      message += `⚠️ *ATENÇÃO - SITUAÇÃO URGENTE*\n\n`;
      message += `Sua apólice *${seguro.numero_apolice}* está vencida há *${daysOverdue} dias* e pode ter perdido a vigência.\n\n`;
      message += `📅 Data de vencimento: *${formatDate(seguro.fim_vigencia)}*\n`;
      message += `💰 Valor: *${formatCurrency(seguro.valor_premio)}*\n\n`;
      message += `*É muito importante regularizarmos o quanto antes* para evitar:\n`;
      message += `❌ Perda da cobertura\n`;
      message += `❌ Dificuldade na renovação\n`;
      message += `❌ Multas e juros adicionais\n\n`;
      message += `Podemos conversar agora? Tenho soluções para te ajudar! 🤝`;
    }
    // CENÁRIO 4: Vencido recentemente (1-30 dias) - Alerta
    else if (seguro.situacao_pagamento === 'Atrasado' || (diffDays < 0 && diffDays >= -30)) {
      const daysOverdue = Math.abs(diffDays);
      message += `Notei que o pagamento da sua apólice *${seguro.numero_apolice}* está pendente. 🔔\n\n`;
      message += `📅 Vencimento: *${formatDate(seguro.fim_vigencia)}* (há ${daysOverdue} dia${daysOverdue !== 1 ? 's' : ''})\n`;
      message += `💰 Valor: *${formatCurrency(seguro.valor_premio)}*\n`;
      message += `🏢 Seguradora: *${seguro.seguradora}*\n\n`;
      message += `*Importante:* Quanto antes regularizarmos, melhor para manter sua proteção ativa!\n\n`;
      message += `Houve algum imprevisto? Posso te ajudar com:\n`;
      message += `• Facilidades de pagamento\n`;
      message += `• Segunda via do boleto\n`;
      message += `• Outras formas de pagamento\n\n`;
      message += `Me conta como posso te ajudar? 😊`;
    }
    // CENÁRIO 5: Vence hoje - Urgência máxima
    else if (diffDays === 0) {
      message += `⏰ *VENCE HOJE!*\n\n`;
      message += `Sua apólice *${seguro.numero_apolice}* (${seguro.tipo_seguro}) vence *hoje* e precisa ser renovada!\n\n`;
      message += `💰 Valor: *${formatCurrency(seguro.valor_premio)}*\n`;
      message += `🏢 Seguradora: *${seguro.seguradora}*\n\n`;
      message += `Para não perder a cobertura, precisamos regularizar o pagamento ainda hoje.\n\n`;
      message += `Já efetuou o pagamento? Me avisa para eu confirmar! ✅\n\n`;
      message += `Precisa da segunda via ou tem alguma dúvida? Estou aqui para ajudar! 🚀`;
    }
    // CENÁRIO 6: Vence em 1-2 dias - Muito urgente
    else if (diffDays >= 1 && diffDays <= 2) {
      message += `⚠️ *ATENÇÃO: VENCIMENTO IMINENTE!*\n\n`;
      message += `Sua apólice *${seguro.numero_apolice}* (${seguro.tipo_seguro}) vence em *${diffDays} dia${diffDays !== 1 ? 's' : ''}*!\n\n`;
      message += `📅 Data: *${formatDate(seguro.fim_vigencia)}*\n`;
      message += `💰 Valor: *${formatCurrency(seguro.valor_premio)}*\n`;
      message += `🏢 Seguradora: *${seguro.seguradora}*\n\n`;
      message += `Já providenciou o pagamento? Se sim, me avisa para eu confirmar! ✅\n\n`;
      message += `Se precisar de:\n`;
      message += `• Segunda via do boleto 📄\n`;
      message += `• PIX para pagamento instantâneo 💳\n`;
      message += `• Outras opções de pagamento\n\n`;
      message += `*É só me chamar que resolvo rapidinho!* 😊`;
    }
    // CENÁRIO 7: Vence em 3-5 dias - Urgente
    else if (diffDays >= 3 && diffDays <= 5) {
      message += `🔔 Lembrete importante!\n\n`;
      message += `Sua apólice *${seguro.numero_apolice}* (${seguro.tipo_seguro}) vence em *${diffDays} dias*.\n\n`;
      message += `📅 Data de vencimento: *${formatDate(seguro.fim_vigencia)}*\n`;
      message += `💰 Valor da parcela: *${formatCurrency(seguro.valor_premio)}*\n`;
      message += `🏢 Seguradora: *${seguro.seguradora}*\n\n`;
      message += `Para garantir a continuidade da sua proteção sem interrupções, precisamos do pagamento em dia.\n\n`;
      message += `Já efetuou? Me confirma para eu dar baixa! ✅\n\n`;
      message += `Precisa de:\n`;
      message += `• Código de barras 📊\n`;
      message += `• PIX 💳\n`;
      message += `• Segunda via\n\n`;
      message += `Estou à disposição! 😊`;
    }
    // CENÁRIO 8: Vence em 6-15 dias - Alerta preventivo
    else if (diffDays >= 6 && diffDays <= 15) {
      message += `Olá! Passando para te lembrar: 📋\n\n`;
      message += `Sua apólice *${seguro.numero_apolice}* (${seguro.tipo_seguro}) vence em *${diffDays} dias*.\n\n`;
      message += `📅 Data: *${formatDate(seguro.fim_vigencia)}*\n`;
      message += `💰 Valor: *${formatCurrency(seguro.valor_premio)}*\n\n`;
      message += `Esse é um lembrete amigável para você se programar e não perder o prazo! 😊\n\n`;
      message += `Precisa de alguma informação?\n`;
      message += `• Boleto ou PIX\n`;
      message += `• Detalhes da apólice\n`;
      message += `• Revisar coberturas\n\n`;
      message += `Conte comigo! 💙`;
    }
    // CENÁRIO 9: Renovação futura (16-30 dias) - Relacionamento
    else if (diffDays >= 16 && diffDays <= 30) {
      message += `Oi! Tudo certo por aí? 😊\n\n`;
      message += `Só passando para avisar que sua apólice *${seguro.numero_apolice}* vence em *${diffDays} dias* (${formatDate(seguro.fim_vigencia)}).\n\n`;
      message += `📋 Tipo: *${seguro.tipo_seguro}*\n`;
      message += `🏢 Seguradora: *${seguro.seguradora}*\n\n`;
      message += `É um bom momento para:\n`;
      message += `✅ Revisar as coberturas\n`;
      message += `✅ Ver se precisa de ajustes\n`;
      message += `✅ Conhecer novos benefícios\n\n`;
      message += `Quer aproveitar para conversarmos sobre sua renovação? Posso te ajudar a garantir as melhores condições! 🎯`;
    }
    // CENÁRIO 10: Muito longe do vencimento (mais de 30 dias) - Follow-up
    else if (diffDays > 30) {
      message += `Como você está? Espero que tudo bem! 😊\n\n`;
      message += `Estou entrando em contato sobre sua apólice *${seguro.numero_apolice}* (${seguro.tipo_seguro}).\n\n`;
      message += `📅 Vigência até: *${formatDate(seguro.fim_vigencia)}*\n`;
      message += `🏢 Seguradora: *${seguro.seguradora}*\n\n`;
      message += `Está tudo certo? Gostaria de:\n`;
      message += `• Esclarecer alguma dúvida sobre a apólice\n`;
      message += `• Atualizar algum dado\n`;
      message += `• Conhecer outros produtos\n`;
      message += `• Fazer uma revisão das coberturas\n\n`;
      message += `Estou aqui para te atender! 💙`;
    }
    // CENÁRIO 11: Status cancelado - Reengajamento
    else if (seguro.situacao_pagamento === 'Cancelado') {
      message += `Vi que sua apólice *${seguro.numero_apolice}* foi cancelada.\n\n`;
      message += `Houve algum problema ou foi uma decisão sua?\n\n`;
      message += `Se quiser conversar sobre:\n`;
      message += `• Reativação da apólice\n`;
      message += `• Novas opções mais adequadas\n`;
      message += `• Condições especiais\n\n`;
      message += `Estou à disposição para te ajudar! 😊\n\n`;
      message += `Sua proteção é importante para nós! 🛡️`;
    }
    
    return encodeURIComponent(message);
  };

  const handleWhatsAppClick = (seguro: seguro, phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = generateWhatsAppMessage(seguro);
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      className="rounded-lg overflow-hidden"
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
            {selected.size} seguro(s) selecionado(s)
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

      <Table sx={{ minWidth: 1200 }}>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: 'var(--bg-table-header)',
              borderBottom: '2px solid',
              borderColor: 'var(--border-default)',
            }}
          >
            <TableCell padding="checkbox" sx={{ py: 1.5 }}>
              <Checkbox
                indeterminate={selected.size > 0 && selected.size < seguros.length}
                checked={seguros.length > 0 && selected.size === seguros.length}
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
            <TableCell 
              sx={{ 
                py: 1.5,
                width: '40px',
              }}
            ></TableCell>
            <TableCell sx={{ py: 1.5 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Segurado
              </span>
            </TableCell>
            <TableCell sx={{ py: 1.5 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Telefone
              </span>
            </TableCell>
            <TableCell sx={{ py: 1.5 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Tipo de Seguro
              </span>
            </TableCell>
            <TableCell sx={{ py: 1.5 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Apólice
              </span>
            </TableCell>
            <TableCell sx={{ py: 1.5 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Vencimento
              </span>
            </TableCell>
            <TableCell sx={{ py: 1.5 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Seguradora
              </span>
            </TableCell>
            <TableCell sx={{ py: 1.5 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Status
              </span>
            </TableCell>
            <TableCell sx={{ py: 1.5 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Corretor
              </span>
            </TableCell>
            <TableCell sx={{ py: 1.5 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Status Vencimento
              </span>
            </TableCell>
            <TableCell align="center" sx={{ py: 1.5 }}>
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
          {seguros.map((seguro) => {
            const isExpanded = expandedRow === seguro.name;
            const statusColor = getStatusColor(seguro.status_segurado);
            const pagamentoColor = getSituacaoPagamentoColor(seguro.situacao_pagamento);
            const vencimentoStatus = getVencimentoStatus(seguro.fim_vigencia, seguro.situacao_pagamento);

            return (
              <React.Fragment key={seguro.name}>
                <TableRow
                  sx={{
                    backgroundColor: selected.has(seguro.name!)
                      ? 'rgba(99, 102, 241, 0.08)'
                      : 'var(--bg-table-row)',
                    '&:hover': {
                      backgroundColor: selected.has(seguro.name!)
                        ? 'rgba(99, 102, 241, 0.12)'
                        : 'var(--bg-table-row-hover)',
                    },
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  {/* Checkbox */}
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.has(seguro.name!)}
                      onChange={() => handleSelectOne(seguro.name!)}
                      sx={{
                        color: 'var(--text-muted)',
                        '&.Mui-checked': {
                          color: 'var(--color-primary)',
                        },
                      }}
                    />
                  </TableCell>

                  {/* Expand Button */}
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleRowClick(seguro.name!)}
                      sx={{
                        color: 'var(--text-muted)',
                        '&:hover': {
                          backgroundColor: 'var(--color-primary-light)',
                        },
                      }}
                    >
                      {isExpanded ? (
                        <KeyboardArrowUpIcon sx={{ color: 'var(--color-primary)' }} />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>

                  {/* Segurado */}
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
                        <p
                          className="font-semibold text-sm"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {seguro.segurado_nome || seguro.segurado}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {seguro.segurado_cpf ? `CPF: ${formatCPF(seguro.segurado_cpf)}` : `ID: ${seguro.segurado}`}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Telefone */}
                  <TableCell>
                    {seguro.segurado_telefone ? (
                      <Tooltip title="Clique para ligar" arrow>
                        <div
                          className="flex items-center gap-2 cursor-pointer"
                          style={{ color: 'var(--text-secondary)' }}
                          onClick={() => window.open(`tel:${seguro.segurado_telefone}`, '_self')}
                        >
                          <PhoneIcon sx={{ fontSize: 18 }} />
                          <span className="text-sm font-medium">
                            {formatPhone(seguro.segurado_telefone)}
                          </span>
                        </div>
                      </Tooltip>
                    ) : (
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>-</span>
                    )}
                  </TableCell>

                  {/* Tipo de Seguro */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTipoIcon(seguro.tipo_seguro)}
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {seguro.tipo_seguro}
                      </span>
                    </div>
                  </TableCell>

                  {/* Apólice */}
                  <TableCell>
                    <Chip
                      label={seguro.numero_apolice}
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

                  {/* Vencimento */}
                  <TableCell>
                    <div
                      className="font-medium text-sm px-2.5 py-1 rounded inline-block"
                      style={{
                        color: 'var(--text-primary)',
                        backgroundColor: 'var(--bg-table-header)',
                      }}
                    >
                      {formatDate(seguro.fim_vigencia)}
                    </div>
                  </TableCell>

                  {/* Seguradora */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={seguro.seguradora_logo}
                        alt={seguro.seguradora_nome || seguro.seguradora}
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: '#f3f4f6',
                          border: '1px solid',
                          borderColor: 'var(--border-default)',
                          '& img': {
                            objectFit: 'contain',
                            padding: '4px',
                          },
                        }}
                      >
                        <BusinessIcon sx={{ fontSize: 18, color: 'var(--text-muted)' }} />
                      </Avatar>
                      <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                        {seguro.seguradora_nome || seguro.seguradora}
                      </div>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-medium inline-flex items-center ${statusColor}`}
                    >
                      {seguro.status_segurado}
                    </span>
                  </TableCell>

                  {/* Corretor */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BadgeIcon sx={{ color: 'var(--text-muted)', fontSize: 18 }} />
                      <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                        {seguro.corretor_nome || seguro.corretor_responsavel}
                      </div>
                    </div>
                  </TableCell>

                  {/* Status Vencimento */}
                  <TableCell>
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-medium inline-flex items-center gap-1.5 ${vencimentoStatus.className}`}
                    >
                      <AccessTimeIcon sx={{ fontSize: 14 }} />
                      {vencimentoStatus.label}
                    </span>
                  </TableCell>

                  {/* Ações */}
                  <TableCell align="center">
                    <div className="flex items-center justify-center gap-1">
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(seguro);
                          }}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(seguro);
                          }}
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
                      <Tooltip title="Enviar mensagem no WhatsApp" arrow>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            const phone = seguro.segurado_whatsapp || seguro.segurado_telefone || '';
                            if (phone) {
                              handleWhatsAppClick(seguro, phone);
                            }
                          }}
                          disabled={!seguro.segurado_whatsapp && !seguro.segurado_telefone}
                          sx={{
                            color: '#25D366',
                            '&:hover': {
                              backgroundColor: 'rgba(37, 211, 102, 0.1)',
                            },
                            '&.Mui-disabled': {
                              color: 'var(--text-muted)',
                              opacity: 0.5,
                            },
                          }}
                        >
                          <WhatsAppIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Expanded Content */}
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={12}
                  >
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Box
                        sx={{
                          margin: 2,
                          padding: 3,
                          backgroundColor: 'var(--bg-table-header)',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'var(--border-default)',
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Veículo */}
                          <div>
                            <div
                              className="flex items-center gap-2 mb-2"
                              style={{ color: 'var(--color-primary)' }}
                            >
                              <DirectionsCarIcon sx={{ fontSize: 20 }} />
                              <span className="text-sm font-semibold uppercase tracking-wide">Veículo</span>
                            </div>
                            <div
                              className="p-3 rounded-lg space-y-2"
                              style={{
                                backgroundColor: 'var(--bg-card)',
                                border: '2px solid',
                                borderColor: 'var(--color-primary)',
                              }}
                            >
                              {seguro.veiculo_marca && seguro.veiculo_modelo ? (
                                <>
                                  <div className="text-center pb-2 border-b" style={{ borderColor: 'var(--border-default)' }}>
                                    <p className="text-lg font-bold tracking-wider" style={{ color: 'var(--text-primary)', letterSpacing: '0.1em' }}>
                                      {seguro.veiculo_placa || 'N/A'}
                                    </p>
                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Placa</p>
                                  </div>
                                  <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                                    <p className="font-semibold">{seguro.veiculo_marca}</p>
                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{seguro.veiculo_modelo}</p>
                                  </div>
                                </>
                              ) : (
                                <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>Não disponível</p>
                              )}
                            </div>
                          </div>

                          {/* ID do Seguro e Detalhes */}
                          <div>
                            <span
                              className="text-sm font-semibold uppercase tracking-wide block mb-2"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              Informações do Seguro
                            </span>
                            <div 
                              className="space-y-2 p-3 rounded-lg"
                              style={{
                                backgroundColor: 'var(--bg-card)',
                                border: '1px solid',
                                borderColor: 'var(--border-default)',
                              }}
                            >
                              <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: 'var(--border-default)' }}>
                                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                  ID do Seguro:
                                </span>
                                <span
                                  className="text-xs font-mono font-semibold"
                                  style={{ color: 'var(--text-primary)' }}
                                >
                                  {seguro.name}
                                </span>
                              </div>
                              <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: 'var(--border-default)' }}>
                                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                  CPF do Segurado:
                                </span>
                                <span
                                  className="text-xs font-semibold"
                                  style={{ color: 'var(--text-primary)' }}
                                >
                                  {seguro.segurado_cpf ? formatCPF(seguro.segurado_cpf) : 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                  Corretor:
                                </span>
                                <span
                                  className="text-xs font-semibold"
                                  style={{ color: 'var(--text-primary)' }}
                                >
                                  {seguro.corretor_nome || seguro.corretor_responsavel}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Detalhes Financeiros */}
                          <div>
                            <span
                              className="text-sm font-semibold uppercase tracking-wide block mb-2"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              Detalhes Financeiros
                            </span>
                            <div 
                              className="space-y-2 p-3 rounded-lg"
                              style={{
                                backgroundColor: 'var(--bg-card)',
                                border: '1px solid',
                                borderColor: 'var(--border-default)',
                              }}
                            >
                              <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: 'var(--border-default)' }}>
                                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                  Valor Prêmio:
                                </span>
                                <span
                                  className="text-sm font-semibold"
                                  style={{ color: 'var(--text-primary)' }}
                                >
                                  {formatCurrency(seguro.valor_premio)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: 'var(--border-default)' }}>
                                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                  Valor do Seguro:
                                </span>
                                <span
                                  className="text-sm font-semibold"
                                  style={{ color: 'var(--text-primary)' }}
                                >
                                  {formatCurrency(seguro.valor_do_seguro || 0)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: 'var(--border-default)' }}>
                                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                  Franquia:
                                </span>
                                <span
                                  className="text-sm font-semibold"
                                  style={{ color: 'var(--text-primary)' }}
                                >
                                  {formatCurrency(seguro.valor_franquia)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: 'var(--border-default)' }}>
                                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                  Forma de Pagamento:
                                </span>
                                <span
                                  className="text-sm font-semibold"
                                  style={{ color: 'var(--text-primary)' }}
                                >
                                  {seguro.forma_pagamento}
                                </span>
                              </div>
                              <div className="flex justify-between items-center pt-1">
                                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                  Situação Pagamento:
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-medium ${pagamentoColor}`}
                                >
                                  {seguro.situacao_pagamento}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Vigência */}
                          <div>
                            <span
                              className="text-sm font-semibold uppercase tracking-wide block mb-2"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              Período de Vigência
                            </span>
                            <div 
                              className="space-y-2 p-3 rounded-lg"
                              style={{
                                backgroundColor: 'var(--bg-card)',
                                border: '1px solid',
                                borderColor: 'var(--border-default)',
                              }}
                            >
                              <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: 'var(--border-default)' }}>
                                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                  Início:
                                </span>
                                <span
                                  className="text-sm font-semibold"
                                  style={{ color: 'var(--text-primary)' }}
                                >
                                  {formatDate(seguro.inicio_vigencia)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                  Fim:
                                </span>
                                <span
                                  className="text-sm font-semibold"
                                  style={{ color: 'var(--text-primary)' }}
                                >
                                  {formatDate(seguro.fim_vigencia)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
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
              Tem certeza que deseja excluir o seguro{' '}
              <strong style={{ color: 'var(--text-primary)' }}>
                {seguroToDelete?.numero_apolice}
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
            <strong style={{ color: 'var(--text-primary)' }}>{selected.size}</strong> seguro(s)?
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
