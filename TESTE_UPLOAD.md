# 🧪 Guia de Teste - Sistema de Upload e Detecção de Funcionários

## ✅ Funcionalidades Implementadas

### 1. **Upload de Arquivos**
- ✅ Suporte a Excel (.xlsx, .xls)
- ✅ Suporte a CSV
- ✅ Suporte a PDF (para movimentação bancária)
- ✅ Drag and drop
- ✅ Upload múltiplo
- ✅ Validação de tipo de arquivo
- ✅ Processamento e validação de arquivos Excel

### 2. **Detecção Automática de Funcionários**
- ✅ Detecção pelo nome do arquivo
- ✅ Algoritmo inteligente de correspondência
- ✅ Status visual (Auto/Pendente)
- ✅ Seleção manual quando não detectado

### 3. **Modal de Debug**
- ✅ Estatísticas de detecção
- ✅ Detalhes de cada arquivo
- ✅ Lista de funcionários disponíveis
- ✅ Indicadores visuais de status

## 🧪 Como Testar

### Passo 1: Certifique-se que há corretores cadastrados
Antes de testar, cadastre alguns corretores no sistema, por exemplo:
- João Silva
- Maria Santos
- Pedro Costa
- Ana Oliveira

### Passo 2: Prepare arquivos de teste
Crie arquivos Excel de teste com nomes que correspondam aos funcionários:

**Exemplos que DEVEM ser detectados:**
- `joao.xlsx` → João Silva ✅
- `joao_silva.xlsx` → João Silva ✅
- `maria.xlsx` → Maria Santos ✅
- `pedro-costa.xlsx` → Pedro Costa ✅
- `ana_oliveira_janeiro.xlsx` → Ana Oliveira ✅

**Exemplos que NÃO serão detectados (pendente):**
- `vendas_janeiro_2026.xlsx` → Pendente ⚠️
- `relatorio_mensal.xlsx` → Pendente ⚠️
- `dados.xlsx` → Pendente ⚠️

### Passo 3: Testar Upload

1. **Acesse**: Navegue até a página de Acerto de Valores
2. **Upload**: Na seção "Planilhas dos Funcionários"
   - Clique em "Selecionar Arquivos" OU
   - Arraste os arquivos para a área de upload
3. **Observe**: 
   - Arquivos sendo processados
   - Status de cada arquivo (Auto/Pendente)
   - Funcionário detectado automaticamente

### Passo 4: Ver Detalhes no Debug

1. Após fazer upload dos arquivos, clique no botão **Debug** (roxo) no canto superior direito
2. O modal mostrará:
   - **Estatísticas**: Quantos foram detectados automaticamente vs pendentes
   - **Detalhes**: Para cada arquivo:
     - Nome do arquivo
     - Tamanho
     - Status (Auto/Pendente)
     - Funcionário associado
   - **Funcionários Disponíveis**: Lista de todos os corretores cadastrados

### Passo 5: Testar Seleção Manual

Para arquivos com status "Pendente":
1. Use o dropdown (Select) ao lado do arquivo
2. Selecione manualmente o funcionário correto
3. O status mudará para "Manual"

### Passo 6: Testar Movimentação Bancária

Na seção "Movimentação Bancária":
1. Faça upload de um arquivo Excel ou PDF
2. Não há detecção de funcionário nesta seção (apenas arquivo único)

## 🔍 Algoritmo de Detecção

O sistema detecta funcionários usando o seguinte algoritmo:

```typescript
1. Normaliza o nome do arquivo (remove extensão, underscores, hífens)
2. Para cada funcionário cadastrado:
   - Divide o nome em palavras
   - Filtra palavras com mais de 2 caracteres
   - Verifica se alguma palavra aparece no nome do arquivo
3. Retorna o primeiro funcionário encontrado
```

### Exemplos de Correspondência

| Nome do Arquivo | Funcionário Cadastrado | Detecta? |
|----------------|------------------------|----------|
| `joao.xlsx` | João Silva | ✅ Sim |
| `silva.xlsx` | João Silva | ✅ Sim |
| `joao_silva_janeiro.xlsx` | João Silva | ✅ Sim |
| `maria_vendas.xlsx` | Maria Santos | ✅ Sim |
| `relatorio_pedro.xlsx` | Pedro Costa | ✅ Sim |
| `dados.xlsx` | João Silva | ❌ Não |
| `jan.xlsx` | João Silva | ❌ Não (palavra < 3 chars) |

## 📊 Validações Implementadas

### Tipo de Arquivo
- ✅ Rejeita arquivos que não sejam .xlsx, .xls, .csv ou .pdf
- ✅ Mostra alerta informativo

### Processamento Excel
- ✅ Valida estrutura do arquivo
- ✅ Lê todas as planilhas (sheets)
- ✅ Converte para JSON
- ✅ Mostra erro se arquivo corrompido

### PDF
- ✅ Aceita arquivo
- ✅ Valida tamanho
- ✅ Preparado para extração futura de dados

## 🎨 Indicadores Visuais

### Status de Arquivo
- 🟢 **Detectado (Auto)**: Verde - Funcionário identificado automaticamente
- 🟡 **Pendente**: Amarelo - Requer seleção manual
- 🔵 **Manual**: Azul - Selecionado manualmente pelo usuário

### Bordas do Select
- **Verde**: Funcionário já selecionado
- **Cinza padrão**: Aguardando seleção

## 🐛 Debug e Troubleshooting

### Modal de Debug mostra:
1. **Detectados**: Quantos arquivos tiveram funcionário detectado automaticamente
2. **Pendentes**: Quantos precisam de seleção manual
3. **Total**: Total de arquivos carregados

### Console do Navegador
- Abra o console (F12) para ver logs detalhados:
  - Processamento de arquivos
  - Erros de leitura
  - Detecção de funcionários

### Possíveis Problemas

**Funcionário não detectado?**
- Verifique se o nome está no arquivo
- Verifique se tem mais de 2 caracteres
- Use nomes mais específicos (ex: adicione sobrenome)

**Erro ao processar arquivo?**
- Verifique se o arquivo não está corrompido
- Tente abrir no Excel primeiro
- Verifique a extensão do arquivo

**Nenhum funcionário aparece no select?**
- Verifique se há corretores cadastrados
- Verifique se o useEffect carregou os dados
- Veja o console para erros da API

## 📝 Próximas Melhorias Sugeridas

- [ ] Extração real de dados do PDF
- [ ] Análise do conteúdo do Excel
- [ ] Sugestões múltiplas de funcionários
- [ ] Histórico de uploads
- [ ] Validação de estrutura de planilha
- [ ] Preview dos dados antes de processar
