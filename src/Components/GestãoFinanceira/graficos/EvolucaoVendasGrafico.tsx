import { Card, CardContent, Typography, Box, Tabs, Tab, IconButton } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import InfoModal from '../InfoModal';
import { useEffect, useState } from "react";
import { Financeiro } from '../../../Services/Financeiro';
import { formatCurrency } from '../../../Utils/Formatter';
import DateRangeFilter from '../DateRangeFilter';
// import CategoriaFilter from '../CategoriaFilter';
// import CorretorFilter from '../CorretorFilter';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { getMetasMensaisCorretora } from '../../../Services/metas';
dayjs.extend(isSameOrBefore);

interface VendaData {
  mes: string;
  vendas: number;
  meta: number;
  ano_anterior: number;
}
interface EvolucaoVendasGraficoProps {
  data: VendaData[];
  loading?: boolean;
  error?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box 
        sx={{ 
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 1,
          padding: 2,
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <Typography variant="body2" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry: any, index: number) => (
          <Typography 
            key={index} 
            variant="body2" 
            sx={{ color: entry.color, fontSize: '0.875rem' }}
          >
            {entry.name}: {formatCurrency(entry.value)}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

export default function EvolucaoVendasGrafico({ 
  loading = false, 
  error 
}: EvolucaoVendasGraficoProps) {
  const [chartType, setChartType] = useState<'area' | 'line'>('area');
  const [infoOpen, setInfoOpen] = useState(false);
  const [data, setData] = useState<VendaData[]>([]);
  const [allData, setAllData] = useState<VendaData[]>([]);
  const [dateRange, setDateRange] = useState<{start: Dayjs|null, end: Dayjs|null}>(() => {
    const today = dayjs();
    const firstDayOfYear = dayjs().startOf('year');
    return { start: firstDayOfYear, end: today };
  });
  // const [categorias, setCategorias] = useState<string[]>([]);
  // const [corretores, setCorretores] = useState<string[]>([]);

  useEffect(() => {
    const financeiro = new Financeiro();
    const start = dateRange.start ? dateRange.start.format('YYYY-MM-DD') : undefined;
    const end = dateRange.end ? dateRange.end.format('YYYY-MM-DD') : undefined;
    Promise.all([
      financeiro.getEvolucaovendas(start, end),
      getMetasMensaisCorretora(start, end),
    ]).then(([dados, metasMap]) => {
      const dadosComMeta = (dados || []).map((item: any) => ({
        ...item,
        meta: metasMap[item.mes] ?? 0,
      }));
      console.log('[EvolucaoVendasGrafico] Dados recebidos do backend:', dadosComMeta);
      setAllData(dadosComMeta);
    });
  }, [dateRange]);

  useEffect(() => {
    if (!dateRange.start || !dateRange.end) {
      setData([]);
      return;
    }
    const meses = [];
    let d = dateRange.start.startOf('month');
    while (d.isSameOrBefore(dateRange.end, 'month')) {
      meses.push(d.format('MM/YYYY'));
      d = d.add(1, 'month');
    }
    const dataFiltrada = meses.map(mes => {
      const found = allData.find(item => item.mes === mes);
      return found || {
        mes,
        vendas: 0,
        meta: 0,
        ano_anterior: 0
      };
    });
    setData(dataFiltrada);
  }, [allData, dateRange]);

  return (
    <>
      {error && (
        <Card sx={{ backgroundColor: 'var(--bg-card)', borderRadius: 2, border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Typography color="error">Erro ao carregar dados: {error}</Typography>
          </CardContent>
        </Card>
      )}
      {loading && (
        <Card sx={{ backgroundColor: 'var(--bg-card)', borderRadius: 2, border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Typography>Carregando dados...</Typography>
          </CardContent>
        </Card>
      )}
      <InfoModal 
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        title="Evolução de Vendas"
        description="Este gráfico apresenta a evolução mensal das vendas comparando três indicadores importantes para avaliar o desempenho comercial."
        details={[
          "Vendas Atuais: Mostra o volume de vendas realizado em cada mês do ano corrente",
          "Meta: Representa os objetivos estabelecidos para cada período",
          "Ano Anterior: Permite comparar o desempenho atual com o mesmo período do ano passado",
          "Você pode alternar entre visualização em Área ou Linha para melhor análise dos dados"
        ]}
      />
      <Card 
        sx={{ 
          backgroundColor: 'var(--bg-card)',
          borderRadius: 2,
          border: '1px solid var(--border-default)',
          height: '100%'
        }}
      >
        <CardContent>
          {/* Filtro de data do gráfico */}
          <Box className="flex flex-wrap gap-3 mb-4 items-center">
            <DateRangeFilter onDateRangeChange={(start, end) => setDateRange({start, end})} />
          </Box>
          <Box className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <Box className="flex items-center gap-2">
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    mb: 0.5
                  }}
                >
                  Evolução de Vendas
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: 'var(--text-secondary)' }}
                >
                  Comparativo anual de performance
                </Typography>
              </Box>
              <IconButton 
                size="small"
                onClick={() => setInfoOpen(true)}
                sx={{ 
                  color: 'var(--text-secondary)',
                  '&:hover': { color: 'var(--color-primary)' }
                }}
              >
                <InfoOutlined fontSize="small" />
              </IconButton>
            </Box>
            <Tabs 
              value={chartType} 
              onChange={(_, newValue) => setChartType(newValue)}
              sx={{
                minHeight: 'auto',
                '& .MuiTab-root': {
                  minHeight: 'auto',
                  padding: '6px 12px',
                  fontSize: '0.875rem'
                }
              }}
            >
              <Tab label="Área" value="area" />
              <Tab label="Linha" value="line" />
            </Tabs>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 450 }}>
            <ResponsiveContainer width="100%" height={400}>
              {chartType === 'area' ? (
                <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <defs>
                    <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAnterior" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                  <XAxis 
                    dataKey="mes" 
                    stroke="var(--text-secondary)"
                    style={{ fontSize: '0.75rem' }}
                  />
                  <YAxis 
                    stroke="var(--text-secondary)"
                    style={{ fontSize: '0.75rem' }}
                    tickFormatter={(value, index) => {
                      // Exibe o símbolo R$ apenas no primeiro tick (menor valor)
                      const formatted = formatCurrency(value).replace('R$', '').trim();
                      return index === 0 ? `R$ ${formatted}` : formatted;
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="ano_anterior" 
                    stroke="#94a3b8" 
                    fill="url(#colorAnterior)"
                    strokeWidth={2}
                    name="Ano Anterior"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="meta" 
                    stroke="#16a34a" 
                    fill="url(#colorMeta)"
                    strokeWidth={2}
                    name="Meta"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="vendas" 
                    stroke="#2563eb" 
                    fill="url(#colorVendas)"
                    strokeWidth={2}
                    name="Vendas Atuais"
                  />
                </AreaChart>
              ) : (
                <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                  <XAxis 
                    dataKey="mes"
                    stroke="var(--text-secondary)"
                    style={{ fontSize: '0.75rem' }}
                  />
                  <YAxis 
                    stroke="var(--text-secondary)"
                    style={{ fontSize: '0.75rem' }}
                    tickFormatter={(value, index) => {
                      const formatted = formatCurrency(value).replace('R$', '').trim();
                      return index === 0 ? `R$ ${formatted}` : formatted;
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ano_anterior" 
                    stroke="#94a3b8" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Ano Anterior"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="meta" 
                    stroke="#16a34a" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Meta"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="vendas" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Vendas Atuais"
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
