import { Box, CircularProgress } from '@mui/material';
import { AttachMoney, People, Assignment, CompareArrows } from '@mui/icons-material';
import { Financeiro } from '../../Services/Financeiro';
import { useState, useEffect } from 'react';
import KpiCardGrafico from './graficos/KpiCardsGrafico';

export default function KpiCards() {
  const [loading, setLoading] = useState(true);
  const [receitaTotal, setReceitaTotal] = useState(0);
  const [totalVendas, setTotalVendas] = useState(0);
  const [ticketMedio, setTicketMedio] = useState(0);
  const [corretores, setCorretores] = useState(0);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const financeiro = new Financeiro();
        const [receita, vendas, ticket, corretores] = await Promise.all([
          financeiro.getReceitasTotal(),
          financeiro.getTotalVendas(),
          financeiro.getTicketMedio(),
          financeiro.corretoresAtivos()
        ]);
        
        setReceitaTotal(receita);
        setTotalVendas(vendas);
        setTicketMedio(ticket);
        setCorretores(corretores);
      } catch (error) {
        console.error('Erro ao carregar dados financeiros:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center" sx={{ minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  const kpis = [
    {
      title: 'Receita Total',
      value: formatCurrency(receitaTotal),
      change: 12.5,
      icon: <AttachMoney sx={{ fontSize: 28 }} />,
      color: '#16a34a',
      description: 'Soma de todas as receitas geradas no período selecionado, incluindo vendas e comissões recebidas.'
    },
    {
      title: 'Total de Vendas',
      value: totalVendas.toString(),
      change: 8.3,
      icon: <Assignment sx={{ fontSize: 28 }} />,
      color: '#2563eb',
      description: 'Número total de apólices vendidas no período. Indica o volume de negócios fechados.'
    },
    {
      title: 'Corretores Ativos',
      value: corretores.toString(),
      change: 5.2,
      icon: <People sx={{ fontSize: 28 }} />,
      color: '#8b5cf6',
      description: 'Quantidade de corretores que realizaram ao menos uma venda no período analisado.'
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(ticketMedio),
      change: -2.1,
      icon: <CompareArrows sx={{ fontSize: 28 }} />,
      color: '#d97706',
      description: 'Valor médio por apólice vendida. Calculado dividindo a receita total pelo número de vendas.'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {kpis.map((kpi, index) => (
        <KpiCardGrafico key={index} {...kpi} />
      ))}
    </div>
  );
}
