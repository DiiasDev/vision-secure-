# Dashboard Components

Componentes profissionais e reutilizáveis para o Dashboard do Vision Secure.

## Estrutura

```
Dashboards/
├── types.ts              # Definições de tipos TypeScript
├── StatCard.tsx          # Card de estatísticas
├── FilterBar.tsx         # Barra de filtros
├── ClientRow.tsx         # Linha da tabela com detalhes expansíveis
├── ClientTable.tsx       # Tabela de clientes com paginação
└── index.ts              # Exports centralizados
```

## Componentes

### StatCard
Card minimalista para exibição de estatísticas.

**Props:**
- `count`: Número a ser exibido
- `label`: Texto descritivo
- `color`: 'orange' | 'amber' | 'red'
- `icon`: Emoji ou ícone

### FilterBar
Barra de filtros com botões estilizados.

**Props:**
- `filter`: 'all' | 'expiring'
- `onFilterChange`: Callback para mudança de filtro

### ClientRow
Linha da tabela com informações do cliente e área expansível para detalhes.

**Props:**
- `row`: Dados do cliente (ClientData)

### ClientTable
Tabela completa com cabeçalho, linhas e paginação.

**Props:**
- `data`: Array de dados dos clientes
- `page`: Página atual
- `totalPages`: Total de páginas
- `onPageChange`: Callback para mudança de página

## Uso

```tsx
import { StatCard, FilterBar, ClientTable } from '../../Components/Dashboards';
import type { ClientData } from '../../Components/Dashboards';
```

## Estilo

Os componentes seguem um design profissional com:
- Cores sutis e minimalistas
- Transições suaves (150-200ms)
- Sem animações exageradas
- Foco em legibilidade e usabilidade
- Responsivo e acessível
