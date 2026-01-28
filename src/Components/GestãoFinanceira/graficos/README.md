# Componentes de Gráficos - Gestão Financeira

Esta pasta contém todos os componentes de gráficos do dashboard financeiro, componentizados para facilitar manutenção, reutilização e tratamento de erros.

## 📊 Componentes Disponíveis

### 1. **KpiCardsGrafico.tsx**
Card individual de KPI (Key Performance Indicator) com ícone informativo.

**Props:**
- `title`: Título do KPI
- `value`: Valor a ser exibido
- `change`: Percentual de variação
- `icon`: Ícone React a ser exibido
- `color`: Cor do tema do card
- `description?`: Descrição opcional (exibida em tooltip)

**Uso:**
```tsx
<KpiCardGrafico 
  title="Receita Total"
  value="R$ 150.000"
  change={12.5}
  icon={<AttachMoney />}
  color="#16a34a"
  description="Total de receitas..."
/>
```

---

### 2. **EvolucaoVendasGrafico.tsx**
Gráfico de evolução de vendas com opção de visualização em Área ou Linha.

**Props:**
- `data`: Array de objetos com `{mes, vendas, meta, ano_anterior}`
- `loading?`: Estado de carregamento
- `error?`: Mensagem de erro

**Uso:**
```tsx
<EvolucaoVendasGrafico 
  data={vendasData}
  loading={false}
  error={undefined}
/>
```

---

### 3. **VendasPorCategoriaGrafico.tsx**
Gráfico de pizza mostrando distribuição de vendas por categoria.

**Props:**
- `data`: Array de objetos com `{name, value, color}`
- `loading?`: Estado de carregamento
- `error?`: Mensagem de erro

**Uso:**
```tsx
<VendasPorCategoriaGrafico 
  data={categoriaData}
/>
```

---

### 4. **VendasPorCategoriaCorretorGrafico.tsx**
Gráfico de barras empilhadas mostrando vendas por categoria segmentadas por corretor.

**Props:**
- `data`: Array de objetos com `{corretor, auto, vida, residencial, empresarial, outros}`
- `loading?`: Estado de carregamento
- `error?`: Mensagem de erro

**Uso:**
```tsx
<VendasPorCategoriaCorretorGrafico 
  data={vendasPorCategoriaData}
/>
```

---

### 5. **MetasMensaisGrafico.tsx**
Visualização de metas mensais com status e progresso.

**Props:**
- `data`: Array de objetos com `{mes, meta, realizado, status}`
- `loading?`: Estado de carregamento
- `error?`: Mensagem de erro

**Status possíveis:**
- `'atingida'`: Meta alcançada
- `'nao-atingida'`: Meta não alcançada
- `'em-andamento'`: Mês em andamento

**Uso:**
```tsx
<MetasMensaisGrafico 
  data={metasData}
/>
```

---

### 6. **RankingCorretoresGrafico.tsx**
Ranking de corretores com múltiplas visualizações (Lista, Barras, Linha).

**Props:**
- `data`: Array de objetos com `{id, nome, vendas, meta, crescimento, posicao, avatar}`
- `loading?`: Estado de carregamento
- `error?`: Mensagem de erro

**Uso:**
```tsx
<RankingCorretoresGrafico 
  data={corretoresData}
/>
```

---

## 🎯 Benefícios da Componentização

### ✅ Separação de Responsabilidades
- Cada gráfico é responsável apenas por sua visualização
- Componentes pais apenas fornecem dados
- Facilita testes unitários

### ✅ Tratamento de Erros
- Cada gráfico possui tratamento próprio de loading e erro
- Mensagens de erro consistentes
- Estados de carregamento uniformes

### ✅ Reutilização
- Gráficos podem ser usados em diferentes páginas
- Props padronizadas facilitam integração
- Fácil adaptação para novos contextos

### ✅ Manutenção
- Alterações em um gráfico não afetam outros
- Código mais limpo e organizado
- Fácil localização de bugs

---

## 🔄 Fluxo de Dados

```
Página Principal (gestãoFinanceira.tsx)
    ↓
Container (VendasChart.tsx)
    ↓ [busca dados da API]
    ↓ [passa dados como props]
    ↓
Gráfico (EvolucaoVendasGrafico.tsx)
    ↓ [renderiza visualização]
    ↓ [trata erros localmente]
```

---

## 🛠️ Como Adicionar Novo Gráfico

1. **Criar o componente do gráfico** em `/graficos/NomeGrafico.tsx`
2. **Definir interface de props** com `data`, `loading?`, `error?`
3. **Implementar tratamento de estados** (loading, error, success)
4. **Adicionar modal informativo** com `InfoModal`
5. **Criar container** no nível superior para buscar dados
6. **Importar e usar** na página principal

### Exemplo de Template:

```tsx
import { Card, CardContent, Typography } from '@mui/material';
import { useState } from 'react';
import InfoModal from '../InfoModal';

interface MeuGraficoProps {
  data: any[];
  loading?: boolean;
  error?: string;
}

export default function MeuGrafico({ data, loading, error }: MeuGraficoProps) {
  const [infoOpen, setInfoOpen] = useState(false);

  if (error) {
    return <Card><CardContent><Typography color="error">{error}</Typography></CardContent></Card>;
  }

  if (loading) {
    return <Card><CardContent><Typography>Carregando...</Typography></CardContent></Card>;
  }

  return (
    <>
      <InfoModal 
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        title="Meu Gráfico"
        description="Descrição do gráfico"
        details={[]}
      />
      <Card>
        {/* Implementação do gráfico */}
      </Card>
    </>
  );
}
```

---

## 📝 Notas

- Todos os gráficos usam o componente `InfoModal` para explicações
- Cores e estilos seguem as variáveis CSS do tema
- Biblioteca de gráficos: **Recharts**
- Componentes UI: **Material-UI (MUI)**
