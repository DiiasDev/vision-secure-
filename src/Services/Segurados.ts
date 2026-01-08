import { frappe } from "./frappeClient";
import type { segurado } from "../Types/segurados.types";

export async function criarSegurado(dados: segurado) {
  try {
    const { data } = await frappe.post("/resource/Segurados", dados);
    return data.data;
  } catch (error: any) {
    console.error("Erro ao cadastrar Segurado");
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
    return response.data?.data || [];
  } catch (error: any) {
    console.error("Erro ao listar Segurados", error);
    throw error;
  }
}
