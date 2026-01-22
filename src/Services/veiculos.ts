import { frappe } from "./frappeClient";
import type { veiculo } from "../Types/veiculos.types";
import { filterDataByUser, getCurrentCorretorForNewRecord } from "../Utils/permissions";
import { salvarAssociacaoCorretor, filtrarPorCorretorLocal } from "../Utils/corretorMapping";
import { isAdmin, getCorretorId } from "./auth";

// Funções de gerenciamento de veículos
export async function newVehicle(dados: veiculo) {
  try {
    // Se não for admin, forçar o corretor logado
    const corretorId = getCurrentCorretorForNewRecord();
    const dadosComCorretor = corretorId ? { ...dados, corretor: corretorId } : dados;
    
    const { data } = await frappe.post("/resource/Veiculos Segurados", dadosComCorretor);
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
      return veiculosFiltradosBackend as veiculo[];
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
    
    return veiculosFiltradosLocal as veiculo[];
  } catch (error: any) {
    console.error("Erro ao listar veiculos", error);
    throw error;
  }
}

export async function atualizarVeiculo(name: string, dados: Partial<veiculo>) {
  try {
    // Permissão total - todos podem editar
    const response = await frappe.put(`/resource/Veiculos Segurados/${name}`, dados);
    
    // 🔔 Notificar admin sobre a edição (se não for o admin editando)
    try {
      const usuarioLogado = localStorage.getItem("userName") || "Sistema";
      const isAdminUser = localStorage.getItem("isAdmin") === "true";
      const placaVeiculo = dados.placa || name;
      
      if (!isAdminUser) {
        const { NotificacoesService } = await import("./Notificacoes");
        const notificacoesService = new NotificacoesService();
        await notificacoesService.criar({
          destinatario: "Administrator",
          titulo: "Veículo Editado",
          descricao: `${usuarioLogado} editou o veículo ${placaVeiculo}`,
          categoria: "Movimentacoes",
          tipo: "Movimentacao",
          prioridade: "Baixa",
          referencia_doctype: "Veiculos Segurados",
          referencia_name: name,
          icone: "✏️"
        });
        console.log("✅ Notificação de edição enviada ao admin");
      }
    } catch (notifError) {
      console.error("⚠️ Erro ao criar notificação:", notifError);
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error("Erro ao atualizar veículo:", error);
    throw error;
  }
}

export async function deletarVeiculo(name: string) {
  try {
    // Buscar placa antes de deletar
    let placaVeiculo = name;
    try {
      const veiculo = await frappe.get(`/resource/Veiculos Segurados/${name}`);
      placaVeiculo = veiculo.data?.data?.placa || name;
    } catch (err) {
      console.warn("⚠️ Não foi possível buscar placa do veículo");
    }
    
    // Permissão total - todos podem deletar
    await frappe.post('/method/frappe.client.delete', {
      doctype: 'Veiculos Segurados',
      name: name,
      force: 1
    });
    
    // 🔔 Notificar admin sobre exclusão (se não for o admin deletando)
    try {
      const usuarioLogado = localStorage.getItem("userName") || "Sistema";
      const isAdminUser = localStorage.getItem("isAdmin") === "true";
      
      if (!isAdminUser) {
        const { NotificacoesService } = await import("./Notificacoes");
        const notificacoesService = new NotificacoesService();
        await notificacoesService.criar({
          destinatario: "Administrator",
          titulo: "Veículo Excluído",
          descricao: `${usuarioLogado} excluiu o veículo ${placaVeiculo}`,
          categoria: "Movimentacoes",
          tipo: "Movimentacao",
          prioridade: "Normal",
          icone: "🗑️"
        });
        console.log("✅ Notificação de exclusão enviada ao admin");
      }
    } catch (notifError) {
      console.error("⚠️ Erro ao criar notificação:", notifError);
    }
    
    return true;
  } catch (error: any) {
    console.error("Erro ao deletar Veiculo:", error);
    throw error;
  }
}
