// Sistema de mapeamento local para associar registros a corretores
// Usado quando o backend não suporta o campo corretor

const STORAGE_KEY = "corretor_registros_map";

interface RegistroMap {
  [registroId: string]: string; // registroId -> corretorId
}

// Salvar associação de um registro com um corretor
export const salvarAssociacaoCorretor = (
  tipo: "segurado" | "veiculo" | "seguro",
  registroId: string,
  corretorId: string
): void => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const map: { [tipo: string]: RegistroMap } = data ? JSON.parse(data) : {};
    
    if (!map[tipo]) {
      map[tipo] = {};
    }
    
    map[tipo][registroId] = corretorId;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    console.log(`✅ Associação salva: ${tipo} ${registroId} -> ${corretorId}`);
  } catch (error) {
    console.error("Erro ao salvar associação:", error);
  }
};

// Obter o corretor de um registro
export const obterCorretorDoRegistro = (
  tipo: "segurado" | "veiculo" | "seguro",
  registroId: string
): string | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const map: { [tipo: string]: RegistroMap } = JSON.parse(data);
    return map[tipo]?.[registroId] || null;
  } catch (error) {
    console.error("Erro ao obter corretor do registro:", error);
    return null;
  }
};

// Filtrar registros por corretor usando mapeamento local
export const filtrarPorCorretorLocal = <T extends { name?: string }>(
  tipo: "segurado" | "veiculo" | "seguro",
  registros: T[],
  corretorId: string
): T[] => {
  console.log(`🗺️ Filtrando ${tipo} por corretor ${corretorId}`);
  console.log("📋 Mapeamento atual:", localStorage.getItem(STORAGE_KEY));
  
  return registros.filter((registro) => {
    const corretorDoRegistro = obterCorretorDoRegistro(tipo, registro.name || "");
    console.log(`  - ${registro.name}: corretor mapeado = ${corretorDoRegistro}`);
    return corretorDoRegistro === corretorId;
  });
};

// Limpar mapeamentos (útil para debug)
export const limparMapeamentos = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  console.log("🗑️ Mapeamentos limpos");
};

// Adicionar múltiplas associações de uma vez (para migração de dados antigos)
export const adicionarAssociacoesEmLote = (
  tipo: "segurado" | "veiculo" | "seguro",
  associacoes: Array<{ registroId: string; corretorId: string }>
): void => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const map: { [tipo: string]: RegistroMap } = data ? JSON.parse(data) : {};
    
    if (!map[tipo]) {
      map[tipo] = {};
    }
    
    associacoes.forEach(({ registroId, corretorId }) => {
      map[tipo][registroId] = corretorId;
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    console.log(`✅ ${associacoes.length} associações adicionadas para ${tipo}`);
  } catch (error) {
    console.error("Erro ao adicionar associações em lote:", error);
  }
};
