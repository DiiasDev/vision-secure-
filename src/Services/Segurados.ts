import { frappe } from "./frappeClient";
import type { segurado } from "../Types/segurados.types";

export async function criarSegurado(dados: segurado) {
  try {
    const { data } = await frappe.post("/resource/Segurados", dados);
    return data.data;
  } catch (error: any) {
    console.error("Erro ao cadastrar Segurado");
    throw error
  }
} 

//TODO Criar Função para listar Segurados
