# Sistema de Usuários e Permissões

## 🔐 Tipos de Usuários

### 1. Administrador (Valdir Dias)
- **Usuário:** Valdir Dias
- **Senha:** Brasil1036
- **Permissões:**
  - ✅ Acesso a TODOS os dados do sistema
  - ✅ Criar, editar e deletar seguradoras
  - ✅ Criar, editar e deletar corretores
  - ✅ Visualizar e gerenciar dados de todos os corretores
  - ✅ Acesso completo a seguros, segurados e veículos

### 2. Corretores
- **Usuário:** Nome completo do corretor (ex: Julia Dias)
- **Senha:** 123456 (padrão para todos)
- **Permissões:**
  - ✅ Visualizar apenas seus próprios dados
  - ✅ Criar segurados, veículos e seguros (vinculados a ele)
  - ✅ Editar apenas dados criados por ele
  - ✅ Deletar apenas dados criados por ele
  - ❌ Não pode gerenciar seguradoras
  - ❌ Não pode ver dados de outros corretores

## 📋 Como Funciona

### Cadastro de Corretor = Novo Usuário
1. Quando um corretor é cadastrado no sistema, ele automaticamente se torna um usuário
2. O nome completo do corretor é usado como nome de usuário
3. A senha padrão é sempre: **123456**
4. O campo "Ativo no Sistema" deve estar marcado (1) para permitir login

### Exemplo de Cadastro
```
Nome Completo: Julia Dias
Cargo: Corretora de Seguros
Ativo no Sistema: Sim (1)
```

### Login do Corretor
```
Usuário: Julia Dias
Senha: 123456
```

## 🎯 Regras de Acesso aos Dados

### Para Corretores:
- **Segurados:** Só vê segurados criados por ele
- **Veículos:** Só vê veículos criados por ele
- **Seguros:** Só vê seguros onde ele é o corretor responsável
- **Seguradoras:** Vê todas (compartilhadas), mas não pode criar/editar/deletar

### Para Administrador:
- **Tudo:** Acesso completo a todos os dados
- **Sem restrições:** Pode criar, editar e deletar qualquer registro

## 🔄 Fluxo de Trabalho

### Como Corretor:
1. Faz login com seu nome completo
2. Cria segurados
3. Cria veículos (se necessário)
4. Cria seguros vinculados aos seus segurados
5. Todos os registros ficam automaticamente vinculados a ele

### Como Administrador:
1. Faz login como Valdir Dias
2. Pode ver e gerenciar TODOS os dados de TODOS os corretores
3. Pode cadastrar novos corretores (que viram usuários)
4. Pode gerenciar seguradoras

## 🛡️ Segurança

### Proteções Implementadas:
- ✅ Filtros automáticos por corretor em todas as APIs
- ✅ Validação de permissões antes de editar/deletar
- ✅ Mensagens de erro claras para ações não permitidas
- ✅ Dados isolados entre corretores
- ✅ Apenas admin pode gerenciar seguradoras

### Mensagens de Erro Comuns:
- "Você não tem permissão para editar este registro"
- "Você não tem permissão para deletar este registro"
- "Apenas administradores podem cadastrar seguradoras"

## 💡 Dicas

1. **Senha Padrão:** Todos os corretores usam a mesma senha (123456). Considere permitir troca de senha no futuro.

2. **Nome de Usuário:** Use sempre o nome completo exato do corretor para fazer login.

3. **Ativo no Sistema:** Apenas corretores com este campo marcado podem fazer login.

4. **Dados Compartilhados:** Seguradoras são visíveis para todos, mas só admin pode gerenciar.

5. **Logout:** Sempre faça logout ao terminar para garantir segurança dos dados.

## 🚀 Próximos Passos (Futuro)

- [ ] Permitir troca de senha pelos corretores
- [ ] Adicionar níveis intermediários de permissão
- [ ] Histórico de ações por usuário
- [ ] Dashboard com estatísticas por corretor
- [ ] Notificações personalizadas por corretor
