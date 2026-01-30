import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { useEffect, useMemo, useState } from 'react';
import InfoModal from '../InfoModal';
import { Financeiro } from '../../../Services/Financeiro';
import { formatCurrency } from '../../../Utils/Formatter';
import DateRangeFilter from '../DateRangeFilter';
import dayjs, { Dayjs } from 'dayjs';

interface VendaPorCategoriaCorretor {
  corretor: string;
  auto: number;
  vida: number;
  residencial: number;
  empresarial: number;
  carga: number;
  outros: number;
}

const categorias = [
  { key: 'auto', name: 'Auto', color: '#2563eb' },
  { key: 'vida', name: 'Vida', color: '#16a34a' },
  { key: 'residencial', name: 'Residencial', color: '#8b5cf6' },
  { key: 'empresarial', name: 'Empresarial', color: '#d97706' },
  { key: 'carga', name: 'Carga', color: '#0f766e' },
  { key: 'outros', name: 'Outros', color: '#64748b' }
];

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

const TotalLabel = ({ x, y, width, value }: any) => {
  if (!value) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      textAnchor="middle"
      fill="var(--text-secondary)"
      fontSize="0.75rem"
      fontWeight={600}
    >
      {formatCurrency(value, 0)}
    </text>
  );
};

export default function VendasPorCategoriaCorretorGrafico() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [data, setData] = useState<VendaPorCategoriaCorretor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const categoriasKeys = categorias.map((categoria) => categoria.key);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>(categoriasKeys);
  const [corretoresSelecionados, setCorretoresSelecionados] = useState<string[]>([]);
  const [corretoresInicializados, setCorretoresInicializados] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: Dayjs | null; end: Dayjs | null }>(() => {
    const today = dayjs();
    const firstDayOfYear = dayjs().startOf('year');
    return { start: firstDayOfYear, end: today };
  });

  useEffect(() => {
    const financeiro = new Financeiro();
    const start = dateRange.start ? dateRange.start.format('YYYY-MM-DD') : undefined;
    const end = dateRange.end ? dateRange.end.format('YYYY-MM-DD') : undefined;
    setLoading(true);
    setError(undefined);
    financeiro.getVendasPorCategoriaCorretor(start, end)
      .then((dados) => {
        setData(dados || []);
      })
      .catch((err) => {
        console.error("Erro ao carregar vendas por categoria por corretor:", err);
        setError("Não foi possível carregar os dados.");
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [dateRange]);

  const corretores = useMemo(
    () => Array.from(new Set(data.map((item) => item.corretor))),
    [data]
  );
  const todasCategoriasSelecionadas = categoriasSelecionadas.length === categoriasKeys.length;
  const algumaCategoriaSelecionada = categoriasSelecionadas.length > 0;
  const todosCorretoresSelecionados = corretoresSelecionados.length === corretores.length;
  const algumCorretorSelecionado = corretoresSelecionados.length > 0;

  useEffect(() => {
    if (!corretoresInicializados && corretores.length > 0) {
      setCorretoresSelecionados(corretores);
      setCorretoresInicializados(true);
    }
  }, [corretores, corretoresInicializados]);

  const dataFiltrada = data
    .filter((item) => corretoresSelecionados.includes(item.corretor))
    .map((item) => {
      const filtrado: any = { corretor: item.corretor };
      categoriasKeys.forEach((key) => {
        filtrado[key] = categoriasSelecionadas.includes(key)
          ? (item as any)[key]
          : 0;
      });
      filtrado.__total = categoriasKeys.reduce((sum, key) => sum + (filtrado[key] || 0), 0);
      return filtrado as VendaPorCategoriaCorretor;
    });

  const totalFiltrado = dataFiltrada.reduce(
    (acc, item) => acc + categoriasKeys.reduce((sum, key) => sum + (item as any)[key], 0),
    0
  );
  const semDados = data.length === 0 || totalFiltrado === 0;

  const menuProps = {
    PaperProps: {
      sx: {
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        color: "var(--text-primary)",
        boxShadow: "var(--shadow-lg)",
        mt: 1,
      },
    },
  };

  if (error) {
    return (
      <Card sx={{ backgroundColor: 'var(--bg-card)', borderRadius: 2, border: '1px solid var(--border-default)' }}>
        <CardContent>
          <Typography color="error">Erro ao carregar dados: {error}</Typography>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card sx={{ backgroundColor: 'var(--bg-card)', borderRadius: 2, border: '1px solid var(--border-default)' }}>
        <CardContent>
          <Typography>Carregando...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <InfoModal 
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        title="Vendas por Categoria por Corretor"
        description="Gráfico de barras empilhadas que detalha o desempenho individual de cada corretor segmentado por categoria de produto."
        details={[
          "Cada barra representa um corretor e suas vendas totais",
          "As cores dentro das barras mostram a contribuição de cada categoria de seguro",
          "Compare o desempenho entre corretores e identifique especialidades",
          "Use os filtros para analisar períodos específicos, corretores individuais ou categorias",
          "Os cards resumo no final mostram o total vendido em cada categoria"
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
          <Box className="flex flex-wrap gap-3 mb-4 items-center">
            <DateRangeFilter onDateRangeChange={(start, end) => setDateRange({ start, end })} />
            <FormControl
              size="small"
              sx={{
                minWidth: 220,
                "& .MuiInputLabel-root": { color: "var(--text-secondary)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-primary)" },
              }}
            >
              <InputLabel id="categorias-corretor-label">Categorias</InputLabel>
              <Select
                labelId="categorias-corretor-label"
                multiple
                value={categoriasSelecionadas}
                onChange={(event) => {
                  const value = event.target.value as string[];
                  if (value.includes("__all__")) {
                    setCategoriasSelecionadas(
                      todasCategoriasSelecionadas ? [] : categoriasKeys
                    );
                    return;
                  }
                  setCategoriasSelecionadas(value);
                }}
                input={<OutlinedInput label="Categorias" />}
                renderValue={(selected) => (selected as string[]).join(", ")}
                MenuProps={menuProps}
                sx={{
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-primary)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--border-default)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--color-primary)",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "var(--text-secondary)",
                  },
                }}
              >
                <MenuItem
                  value="__all__"
                  sx={{
                    borderBottom: "1px solid var(--border-default)",
                    backgroundColor: "var(--bg-card)",
                    "&:hover": { backgroundColor: "var(--bg-hover)" },
                  }}
                >
                  <Checkbox
                    indeterminate={!todasCategoriasSelecionadas && algumaCategoriaSelecionada}
                    checked={todasCategoriasSelecionadas}
                    sx={{
                      color: "var(--color-primary)",
                      "&.Mui-checked": { color: "var(--color-primary)" },
                      "&.MuiCheckbox-indeterminate": { color: "var(--color-primary)" },
                    }}
                  />
                  <ListItemText primary="Selecionar todas" />
                </MenuItem>
                {categorias.map((categoria) => (
                  <MenuItem
                    key={categoria.key}
                    value={categoria.key}
                    sx={{
                      backgroundColor: "var(--bg-card)",
                      "&:hover": { backgroundColor: "var(--bg-hover)" },
                    }}
                  >
                    <Checkbox
                      checked={categoriasSelecionadas.includes(categoria.key)}
                      sx={{
                        color: "var(--color-primary)",
                        "&.Mui-checked": { color: "var(--color-primary)" },
                      }}
                    />
                    <ListItemText primary={categoria.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              size="small"
              sx={{
                minWidth: 220,
                "& .MuiInputLabel-root": { color: "var(--text-secondary)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-primary)" },
              }}
            >
              <InputLabel id="corretores-label">Corretores</InputLabel>
              <Select
                labelId="corretores-label"
                multiple
                value={corretoresSelecionados}
                onChange={(event) => {
                  const value = event.target.value as string[];
                  if (value.includes("__all__")) {
                    setCorretoresSelecionados(
                      todosCorretoresSelecionados ? [] : corretores
                    );
                    return;
                  }
                  setCorretoresSelecionados(value);
                }}
                input={<OutlinedInput label="Corretores" />}
                renderValue={(selected) => (selected as string[]).join(", ")}
                MenuProps={menuProps}
                sx={{
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-primary)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--border-default)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--color-primary)",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "var(--text-secondary)",
                  },
                }}
              >
                <MenuItem
                  value="__all__"
                  sx={{
                    borderBottom: "1px solid var(--border-default)",
                    backgroundColor: "var(--bg-card)",
                    "&:hover": { backgroundColor: "var(--bg-hover)" },
                  }}
                >
                  <Checkbox
                    indeterminate={!todosCorretoresSelecionados && algumCorretorSelecionado}
                    checked={todosCorretoresSelecionados}
                    sx={{
                      color: "var(--color-primary)",
                      "&.Mui-checked": { color: "var(--color-primary)" },
                      "&.MuiCheckbox-indeterminate": { color: "var(--color-primary)" },
                    }}
                  />
                  <ListItemText primary="Selecionar todos" />
                </MenuItem>
                {corretores.map((corretor) => (
                  <MenuItem
                    key={corretor}
                    value={corretor}
                    sx={{
                      backgroundColor: "var(--bg-card)",
                      "&:hover": { backgroundColor: "var(--bg-hover)" },
                    }}
                  >
                    <Checkbox
                      checked={corretoresSelecionados.includes(corretor)}
                      sx={{
                        color: "var(--color-primary)",
                        "&.Mui-checked": { color: "var(--color-primary)" },
                      }}
                    />
                    <ListItemText primary={corretor} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                  Vendas por Categoria por Corretor
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: 'var(--text-secondary)' }}
                >
                  Desempenho detalhado por tipo de seguro
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
          </Box>

          {semDados ? (
            <Box
              sx={{
                minHeight: 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                px: 2,
              }}
            >
              <Typography variant="body2" sx={{ color: "var(--text-secondary)" }}>
                Nenhuma venda encontrada para os filtros selecionados.
              </Typography>
            </Box>
          ) : (
            <Box className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dataFiltrada}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                  <XAxis 
                    dataKey="corretor" 
                    stroke="var(--text-secondary)"
                    style={{ fontSize: '0.75rem' }}
                  />
                  <YAxis 
                    stroke="var(--text-secondary)"
                    style={{ fontSize: '0.75rem' }}
                    tickFormatter={(value) => formatCurrency(value, 0)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  {categorias
                    .filter((categoria) => categoriasSelecionadas.includes(categoria.key))
                    .map((categoria, index, filtered) => (
                      <Bar 
                        key={categoria.key}
                        dataKey={categoria.key} 
                        stackId="a"
                        fill={categoria.color}
                        name={categoria.name}
                      >
                        {/* LabelList para o total, apenas na última barra */}
                        {index === filtered.length - 1 && (
                          <LabelList
                            dataKey="__total"
                            content={<TotalLabel />}
                          />
                        )}
                      </Bar>
                    ))}
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}

          {/* Summary Cards */}
          <Box className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4 pt-4 border-t" sx={{ borderColor: 'var(--border-default)' }}>
            {categorias.map((categoria) => {
              const total = dataFiltrada.reduce((acc, item) => acc + (item as any)[categoria.key], 0);
              return (
                <Box 
                  key={categoria.key}
                  className="p-3 rounded-lg"
                  sx={{ 
                    backgroundColor: 'var(--bg-hover)',
                    border: '1px solid var(--border-default)'
                  }}
                >
                  <Box className="flex items-center gap-2 mb-1">
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        backgroundColor: categoria.color 
                      }} 
                    />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    >
                      {categoria.name}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'var(--text-primary)',
                      fontWeight: 700,
                      fontSize: '1.125rem'
                    }}
                  >
                    {formatCurrency(total, 2)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
