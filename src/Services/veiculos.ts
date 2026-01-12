import { frappe } from "./frappeClient";
import type { veiculo } from "../Types/veiculos.types";
import { filterDataByUser, canEdit, getCurrentCorretorForNewRecord } from "../Utils/permissions";
import { salvarAssociacaoCorretor, filtrarPorCorretorLocal } from "../Utils/corretorMapping";
import { isAdmin, getCorretorId } from "./auth";

export async function newVehicle(dados: veiculo) {
  try {
    // Se não for admin, forçar o corretor logado
    const corretorId = getCurrentCorretorForNewRecord();
    if (corretorId) {
      dados.corretor = corretorId;
    }
    
    const { data } = await frappe.post("/resource/Veiculos Segurados", dados);
    const novoVeiculo = data.data;
    
    // Salvar associação no mapeamento local
    const corretorAtual = getCorretorId();
    if (corretorAtual && novoVeiculo?.name) {
      salvarAssociacaoCorretor('veiculo', novoVeiculo.name, corretorAtual);
    }
    
    return novoVeiculo;
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
    const veiculosData = veiculos.data?.data || [];
    console.log("📊 Veículos do backend:", veiculosData.length, veiculosData);
    
    // Se for admin, retornar todos
    if (isAdmin()) {
      console.log("✅ Admin - retornando todos os veículos");
      return veiculosData;
    }
    
    // Filtrar por campo corretor do backend
    const veiculosFiltradosBackend = filterDataByUser(veiculosData);
    console.log("🔍 Veículos filtrados (backend):", veiculosFiltradosBackend.length);
    
    // Se encontrou veículos pelo backend, usar eles
    if (veiculosFiltradosBackend.length > 0) {
      return veiculosFiltradosBackend;
    }
    
    // Fallback: usar mapeamento local
    console.log("⚠️ Campo corretor não existe no backend");
    console.log("🔧 Filtrando por mapeamento local (veículos criados pelo corretor)");
    
    const corretorId = getCorretorId();
    if (!corretorId) {
      console.log("❌ Nenhum corretor logado");
      return [];
    }
    
    const veiculosFiltradosLocal = filtrarPorCorretorLocal('veiculo', veiculosData, corretorId);
    console.log("🔍 Veículos com mapeamento local:", veiculosFiltradosLocal.length);
    console.log("✅ Veículos filtrados (final):", veiculosFiltradosLocal.length, veiculosFiltradosLocal);
    
    return veiculosFiltradosLocal;
  } catch (error: any) {
    console.error("Erro ao listar veiculos", error);
    throw error;
  }
}

export async function atualizarVeiculo(name: string, dados: Partial<veiculo>) {
  try {
    if (!canEdit(dados.corretor)) {
      throw new Error("Você não tem permissão para editar este veículo");
    }
    const response = await frappe.put(`/resource/Veiculos Segurados/${name}`, dados);
    return response.data.data;
  } catch (error: any) {
    console.error("Erro ao atualizar veículo:", error);
    throw error;
  }
}

export async function deletarVeiculo(name: string) {
  try {
    // Buscar o veículo primeiro para verificar permissão
    const veiculo = await frappe.get(`/resource/Veiculos Segurados/${name}`);
    const veiculoData = veiculo.data?.data;
    
    if (!canEdit(veiculoData?.corretor)) {
      throw new Error("Você não tem permissão para deletar este veículo");
    }
    
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
