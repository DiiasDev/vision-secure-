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

export async function atualizarVeiculo(name: string, dados: Partial<veiculo>) {
  try {
    const response = await frappe.put(`/resource/Veiculos Segurados/${name}`, dados);
    return response.data.data;
  } catch (error: any) {
    console.error("Erro ao atualizar veículo:", error);
    throw error;
  }
}

export async function deletarVeiculo(name: string) {
  try {
    // Usando método customizado do Frappe para forçar exclusão
    await frappe.post('/method/frappe.client.delete', {
      doctype: 'Veiculos',
      name: name,
      force: 1
    });
    return true;
  } catch (error: any) {
    console.error("Erro ao deletar Veiculo:", error);
    throw error;
  }
}
