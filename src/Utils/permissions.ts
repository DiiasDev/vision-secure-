import { isAdmin as checkIsAdmin, getCorretorId } from "../Services/auth";

// Re-exportar funções do auth para facilitar importação
export { isAdmin, getCorretorId, isAuthenticated, getLoggedUser } from "../Services/auth";

/**
 * Verifica se o usuário tem permissão para visualizar todos os dados
 * MODIFICADO: Todos os usuários têm acesso total
 */
export const canViewAll = (): boolean => {
  return true; // Todos podem visualizar tudo
};

/**
 * Verifica se o usuário pode editar/deletar um registro
 * MODIFICADO: Todos os usuários têm permissão total
 */
export const canEdit = (ownerCorretorId?: string): boolean => {
  return true; // Todos podem editar/deletar tudo
};

/**
 * Filtra dados para mostrar apenas os do corretor logado (se não for admin)
 * MODIFICADO: Retorna todos os dados para todos os usuários
 */
export const filterDataByUser = <T extends { owner?: string; corretor?: string; name?: string }>(
  data: T[]
): T[] => {
  console.log("🔍 filterDataByUser chamado (sem restrições):");
  console.log("  - Total de registros:", data.length);
  console.log("  ✅ Retornando todos os dados para todos os usuários");
  
  return data; // Todos podem ver tudo
};

/**
 * Retorna o ID do corretor para ser usado em novos registros
 */
export const getCurrentCorretorForNewRecord = (): string | null => {
  if (checkIsAdmin()) return null; // Admin pode escolher o corretor
  return getCorretorId(); // Corretor sempre cria para si mesmo
};
