import { frappe } from "./frappeClient";
import type { corretor } from "../Types/corretores.types";
import { filterDataByUser, canEdit } from "../Utils/permissions";

export async function newCorretor(dados: corretor) {
  try {
    const { data } = await frappe.post("/resource/Corretores", dados);
    return data.data;
  } catch (error: any) {
    console.error("Erro ao cadastrar novo corretor", error);
  }
}

export async function getCorretor(): Promise<corretor[]> {
  try{
    const corretores = await frappe.get("/resource/Corretores", {
      params:{
        fields: JSON.stringify(["*"])
      },
    });
    const data = corretores.data?.data || [];
    // Admin vê todos, corretor vê apenas seu próprio registro
    return filterDataByUser(data);
  }catch(error: any){
    console.error("Erro ao listar Corretores", error)
    throw error
  }
}

// Função para buscar TODOS os corretores (usada apenas para autenticação)
export async function getAllCorretoresForAuth(): Promise<corretor[]> {
  try{
    const corretores = await frappe.get("/resource/Corretores", {
      params:{
        fields: JSON.stringify(["*"])
      },
    });
    return corretores.data?.data || [];
  }catch(error: any){
    console.error("Erro ao listar Corretores para autenticação", error)
    throw error
  }
}

export async function atualizarCorretor(name: string, dados: Partial<corretor>) {
  try {
    if (!canEdit(name)) {
      throw new Error("Você não tem permissão para editar este corretor");
    }
    const response = await frappe.put(`/resource/Corretores/${name}`, dados);
    return response.data.data;
  } catch (error: any) {
    console.error("Erro ao atualizar corretor:", error);
    throw error;
  }
}

export async function deletarCorretor(name: string) {
  try {
    if (!canEdit(name)) {
      throw new Error("Você não tem permissão para deletar este corretor");
    }
    // Usando método customizado do Frappe para forçar exclusão
    await frappe.post('/method/frappe.client.delete', {
      doctype: 'Corretores',
      name: name,
      force: 1
    });
    return true;
  } catch (error: any) {
    console.error("Erro ao deletar corretor:", error);
    throw error;
  }
}