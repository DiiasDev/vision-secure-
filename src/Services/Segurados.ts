import { frappe } from "./frappeClient";
import type { segurado } from "../Types/segurados.types";
import { filterDataByUser, canEdit, getCurrentCorretorForNewRecord, isAdmin, getCorretorId } from "../Utils/permissions";
import { salvarAssociacaoCorretor, filtrarPorCorretorLocal } from "../Utils/corretorMapping";

export async function criarSegurado(dados: segurado) {
  try {
    // Se não for admin, forçar o corretor logado
    const corretorId = getCurrentCorretorForNewRecord();
    console.log("👤 Criando segurado com corretor:", corretorId);
    
    // Criar uma cópia dos dados para não modificar o original
    const dadosParaEnviar: any = { ...dados };
    
    if (corretorId) {
      // Tentar adicionar em múltiplos campos que podem existir no backend
      dadosParaEnviar.corretor = corretorId;
      dadosParaEnviar.corretor_responsavel = corretorId;
      dadosParaEnviar.id_corretor = corretorId;
    }
    
    console.log("📝 Dados do segurado a serem enviados:", dadosParaEnviar);
    const { data } = await frappe.post("/resource/Segurados", dadosParaEnviar);
    console.log("✅ Segurado criado:", data.data);
    
    // Salvar associação localmente caso o backend não suporte o campo corretor
    if (corretorId && data.data?.name) {
      salvarAssociacaoCorretor("segurado", data.data.name, corretorId);
    }
    
    return data.data;
  } catch (error: any) {
    console.error("❌ Erro ao cadastrar Segurado", error);
    console.error("Detalhes do erro:", error.response?.data);
    throw error;
  }
}

export async function getSegurados(): Promise<segurado[]> {
  try {
    const response = await frappe.get("/resource/Segurados", {
      params: {
        fields: JSON.stringify(["*"]),
        limit_page_length: 0,
      },
    });
    console.log("Response completa:", response);
    const data = response.data?.data || [];
    console.log("📊 Segurados do backend:", data.length, data);
    
    // Se for admin, retornar tudo
    if (isAdmin()) {
      console.log("✅ Admin - retornando todos");
      return data;
    }
    
    // Se for corretor, filtrar pelos segurados que ELE criou
    const corretorId = getCorretorId();
    if (!corretorId) {
      console.log("❌ Sem corretorId");
      return [];
    }
    
    // Tentar filtrar pelo campo corretor do backend primeiro
    let filtered = filterDataByUser(data);
    console.log("🔍 Segurados filtrados (backend por campo corretor):", filtered.length);
    
    // Se não houver resultados pelo campo corretor, usar o mapeamento local
    if (filtered.length === 0 && data.length > 0) {
      console.log("⚠️ Campo corretor não existe no backend");
      console.log("🔧 Filtrando por mapeamento local (segurados criados pelo corretor)");
      
      filtered = filtrarPorCorretorLocal("segurado", data, corretorId);
      console.log("🔍 Segurados com mapeamento local:", filtered.length);
    }
    
    console.log("✅ Segurados filtrados (final):", filtered.length, filtered.map(s => s.name));
    return filtered;
  } catch (error: any) {
    console.error("Erro ao listar Segurados", error);
    throw error;
  }
}

export async function atualizarSegurado(name: string, dados: Partial<segurado>) {
  try {
    if (!canEdit(dados.corretor)) {
      throw new Error("Você não tem permissão para editar este segurado");
    }
    const response = await frappe.put(`/resource/Segurados/${name}`, dados);
    return response.data.data;
  } catch (error: any) {
    console.error("Erro ao atualizar Segurado:", error);
    throw error;
  }
}

export async function deletarSegurado(name: string) {
  try {
    // Buscar o segurado primeiro para verificar permissão
    const segurados = await frappe.get(`/resource/Segurados/${name}`);
    const segurado = segurados.data?.data;
    
    if (!canEdit(segurado?.corretor)) {
      throw new Error("Você não tem permissão para deletar este segurado");
    }
    
    // Usando método customizado do Frappe para forçar exclusão
    await frappe.post('/method/frappe.client.delete', {
      doctype: 'Segurados',
      name: name,
      force: 1
    });
    return true;
  } catch (error: any) {
    console.error("Erro ao deletar Segurado:", error);
    throw error;
  }
}
