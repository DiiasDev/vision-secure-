import type { seguro } from "../Types/seguros.types";
import { frappe } from "./frappeClient";

export async function newSeguro(dados: seguro) {
  try {
    const { data } = await frappe.post("/resource/Seguros", dados);
    return data.data;
  } catch (error: any) {
    console.error("Erro ao cadastrar novo Seguro", error);
  }
}

// TODO Fazer função de Get para seguros