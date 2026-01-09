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
