import { isAdmin as checkIsAdmin, getCorretorId } from "../Services/auth";

// Re-exportar funções do auth para facilitar importação
export { isAdmin, getCorretorId, isAuthenticated, getLoggedUser } from "../Services/auth";

/**
 * Verifica se o usuário tem permissão para visualizar todos os dados
 */
export const canViewAll = (): boolean => {
  return checkIsAdmin();
};

/**
 * Verifica se o usuário pode editar/deletar um registro
 * Admin pode editar tudo, corretor só pode editar seus próprios registros
 */
export const canEdit = (ownerCorretorId?: string): boolean => {
  if (checkIsAdmin()) return true;
  
  const currentCorretorId = getCorretorId();
  if (!currentCorretorId || !ownerCorretorId) return false;
  
  return currentCorretorId === ownerCorretorId;
};

/**
 * Filtra dados para mostrar apenas os do corretor logado (se não for admin)
 */
export const filterDataByUser = <T extends { owner?: string; corretor?: string; name?: string }>(
  data: T[]
): T[] => {
  const isUserAdmin = checkIsAdmin();
  const corretorId = getCorretorId();
  
  console.log("🔍 filterDataByUser chamado:");
  console.log("  - isAdmin:", isUserAdmin);
  console.log("  - corretorId:", corretorId);
  console.log("  - Total de registros:", data.length);
  
  if (isUserAdmin) {
    console.log("  ✅ Admin - retornando todos os dados");
    return data;
  }
  
  if (!corretorId) {
    console.log("  ❌ Sem corretorId - retornando vazio");
    return [];
  }
  
  // Filtrar por corretor ou owner
  const filtered = data.filter((item) => {
    const match = item.corretor === corretorId || item.owner === corretorId;
    console.log(`  - Item ${item.name}: corretor=${item.corretor}, owner=${item.owner}, match=${match}`);
    return match;
  });
  
  console.log("  ✅ Filtrados:", filtered.length, "de", data.length);
  return filtered;
};

/**
 * Retorna o ID do corretor para ser usado em novos registros
 */
export const getCurrentCorretorForNewRecord = (): string | null => {
  if (checkIsAdmin()) return null; // Admin pode escolher o corretor
  return getCorretorId(); // Corretor sempre cria para si mesmo
};
