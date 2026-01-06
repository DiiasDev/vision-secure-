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
