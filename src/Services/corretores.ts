import { frappe } from "./frappeClient";
import type { corretor } from "../Types/corretores.types";

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
    return corretores.data?.data || []
  }catch(error: any){
    console.error("Erro ao listar Corretores", error)
    throw error
  }
}