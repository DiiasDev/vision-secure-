import { frappe } from "./frappeClient";
import type { seguradora } from "../Types/seguradoras.types";

export async function newSeguradora(dados: seguradora) {
  try {
    const { data } = await frappe.post("/resource/Seguradoras", dados);
    return data.data;
  } catch (error: any) {
    console.error("Erro ao cadastrar Seguradora", error);
    throw error;
  }
}

export async function getSeguradoras(): Promise<seguradora[]> {
  try {
    const response = await frappe.get("/resource/Seguradoras", {
      params: {
        fields: JSON.stringify("*"),
        limit_page_lenght: 0,
      },
    });
    return response.data?.data || [];
  } catch (error: any) {
    console.error("Erro ao listar Seguradoras", error);
    throw error;
  }
}

export async function atualizarSeguradora(name: string, dados: Partial<seguradora>) {
  try {
    const response = await frappe.put(`/resource/Seguradoras/${name}`, dados);
    return response.data.data;
  } catch (error: any) {
    console.error("Erro ao atualizar Seguradora:", error);
    throw error;
  }
}

export async function deletarSeguradora(name: string) {
  try {
    // Usando método customizado do Frappe para forçar exclusão
    await frappe.post('/method/frappe.client.delete', {
      doctype: 'Seguradoras',
      name: name,
      force: 1
    });
    return true;
  } catch (error: any) {
    console.error("Erro ao deletar Seguradora:", error);
    throw error;
  }
}
