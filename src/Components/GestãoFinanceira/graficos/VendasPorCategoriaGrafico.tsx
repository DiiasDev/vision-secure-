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
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import InfoModal from "../InfoModal";
import { Financeiro } from "../../../Services/Financeiro";
import { formatCurrency } from "../../../Utils/Formatter";
import DateRangeFilter from "../DateRangeFilter";
import dayjs, { Dayjs } from 'dayjs';

const CATEGORIA_CORES: Record<string, string> = {
  Auto: '#1976d2', // azul
  Vida: '#e53935', // vermelho
  Residencial: '#fbc02d',
  Empresarial: '#8e24aa',
  Carga: '#1b5e20', // verde escuro
  Outros: '#757575',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <Box
        sx={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-default)",
          borderRadius: 1,
          padding: 2,
          boxShadow: "var(--shadow-md)",
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: "var(--text-primary)", fontWeight: 600, mb: 0.5 }}
        >
          {data.categoria}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: data.color, fontSize: "0.875rem" }}
        >
          {formatCurrency(data.valor)}
        </Typography>
      </Box>
    );
  }
  return null;
};

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.05) return null;
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{ fontSize: "0.875rem", fontWeight: 600 }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function VendasPorCategoriaGrafico() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const categorias = Object.keys(CATEGORIA_CORES);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>(
    categorias
  );
  const todasSelecionadas = categoriasSelecionadas.length === categorias.length;
  const algumaSelecionada = categoriasSelecionadas.length > 0;
  const [dateRange, setDateRange] = useState<{
    start: Dayjs | null;
    end: Dayjs | null;
  }>(() => {
    const today = dayjs();
    const firstDayOfYear = dayjs().startOf("year");
    return { start: firstDayOfYear, end: today };
  });

  useEffect(() => {
    const financeiro = new Financeiro();
    const start = dateRange.start ? dateRange.start.format("YYYY-MM-DD") : undefined;
    const end = dateRange.end ? dateRange.end.format("YYYY-MM-DD") : undefined;
    financeiro.getVendasPorCategoria(start, end).then((dados) => {
      const mapped = (dados || []).map((item: any) => ({
        ...item,
        color: CATEGORIA_CORES[item.categoria] || "#8884d8",
      }));
      setData(mapped);
    });
  }, [dateRange]);

  const dataFiltrada = data.filter((item) =>
    categoriasSelecionadas.includes(item.categoria)
  );
  const total = dataFiltrada.reduce((acc, item) => acc + (item.valor || 0), 0);
  const semDados = data.length === 0 || total === 0;
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

  return (
    <>
      <InfoModal
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        title="Vendas por Categoria"
        description="Este gráfico de pizza apresenta a distribuição proporcional das vendas entre as diferentes categorias de seguros oferecidas."
        details={[
          "Cada fatia representa uma categoria de seguro (Auto, Vida, Residencial, Empresarial, Outros)",
          "O tamanho da fatia é proporcional ao volume de vendas da categoria",
          "Os percentuais mostram a participação de cada categoria no total de vendas",
          "Use este gráfico para identificar quais produtos têm maior demanda e planejar estratégias comerciais",
        ]}
      />
      <Card
        sx={{
          backgroundColor: "var(--bg-card)",
          borderRadius: 2,
          border: "1px solid var(--border-default)",
          height: "100%",
        }}
      >
        <CardContent>
          <Box className="flex flex-wrap gap-3 mb-4 items-center">
            <DateRangeFilter onDateRangeChange={(start, end) => setDateRange({ start, end })} />
            <FormControl
              size="small"
              sx={{
                minWidth: 240,
                "& .MuiInputLabel-root": { color: "var(--text-secondary)" },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "var(--color-primary)",
                },
              }}
            >
              <InputLabel id="categorias-label">Categorias</InputLabel>
              <Select
                labelId="categorias-label"
                multiple
                value={categoriasSelecionadas}
                onChange={(event) => {
                  const value = event.target.value as string[];
                  if (value.includes("__all__")) {
                    setCategoriasSelecionadas(
                      todasSelecionadas ? [] : categorias
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
                    indeterminate={!todasSelecionadas && algumaSelecionada}
                    checked={todasSelecionadas}
                    sx={{
                      color: "var(--color-primary)",
                      "&.Mui-checked": { color: "var(--color-primary)" },
                      "&.MuiCheckbox-indeterminate": {
                        color: "var(--color-primary)",
                      },
                    }}
                  />
                  <ListItemText primary="Selecionar todas" />
                </MenuItem>
                {categorias.map((categoria) => (
                  <MenuItem
                    key={categoria}
                    value={categoria}
                    sx={{
                      backgroundColor: "var(--bg-card)",
                      "&:hover": { backgroundColor: "var(--bg-hover)" },
                    }}
                  >
                    <Checkbox
                      checked={categoriasSelecionadas.includes(categoria)}
                      sx={{
                        color: "var(--color-primary)",
                        "&.Mui-checked": { color: "var(--color-primary)" },
                      }}
                    />
                    <ListItemText primary={categoria} />
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
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    mb: 0.5,
                  }}
                >
                  Vendas por Categoria
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-secondary)" }}
                >
                  Distribuição de produtos vendidos
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => setInfoOpen(true)}
                sx={{
                  color: "var(--text-secondary)",
                  "&:hover": { color: "var(--color-primary)" },
                }}
              >
                <InfoOutlined fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {semDados ? (
            <Box
              sx={{
                minHeight: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                px: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "var(--text-secondary)" }}
              >
                Nenhuma venda encontrada para o período selecionado.
              </Typography>
            </Box>
          ) : (
            <>
              {/* Valor total acima do gráfico */}
              <Box mb={2} display="flex" alignItems="center" justifyContent="center">
                <Typography
                  variant="h5"
                  sx={{ color: "var(--text-primary)", fontWeight: 700 }}
                >
                  Total: {formatCurrency(total)}
                </Typography>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dataFiltrada}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="valor"
                  >
                    {dataFiltrada.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </>
          )}

          <Box className="mt-4 space-y-2">
            {dataFiltrada.map((item, index) => {
              const percentage = total ? ((item.valor / total) * 100).toFixed(1) : '0.0';
              return (
                <Box
                  key={index}
                  className="flex items-center justify-between p-2 rounded"
                  sx={{ backgroundColor: "var(--bg-hover)" }}
                >
                  <Box className="flex items-center gap-2">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: item.color,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "var(--text-primary)", fontWeight: 500 }}
                    >
                      {item.categoria}
                    </Typography>
                  </Box>
                  <Box className="text-right">
                    <Typography
                      variant="body2"
                      sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                    >
                      {formatCurrency(item.valor)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "var(--text-tertiary)" }}
                    >
                      {percentage}%
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
