import { frappe } from "./frappeClient";
import type { veiculo } from "../Types/veiculos.types";

export async function newVehicle(dados: veiculo) {
  try {
    const { data } = await frappe.post("/resource/Veiculos Segurados", dados);
    return data.data;
  } catch (error: any) {
    console.error("Erro ao cadastrar veiculo", error);
  }
}

export async function getVehicle(): Promise<veiculo[]> {
  try {
    const veiculos = await frappe.get("/resource/Veiculos Segurados", {
      params: {
        fields: JSON.stringify(["*"]),
      },
    });
    return veiculos.data?.data || [];
  } catch (error: any) {
    console.error("Erro ao listar veiculos", error);
    throw error;
  }
}
