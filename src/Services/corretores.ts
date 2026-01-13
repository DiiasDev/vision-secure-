import { frappe } from "./frappeClient";
import type { corretor } from "../Types/corretores.types";
import { filterDataByUser, canEdit } from "../Utils/permissions";

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
    const data = corretores.data?.data || [];
    // Admin vê todos, corretor vê apenas seu próprio registro
    return filterDataByUser(data);
  }catch(error: any){
    console.error("Erro ao listar Corretores", error)
    throw error
  }
}

// Função para buscar TODOS os corretores (usada apenas para autenticação)
export async function getAllCorretoresForAuth(): Promise<corretor[]> {
  try{
    const corretores = await frappe.get("/resource/Corretores", {
      params:{
        fields: JSON.stringify(["*"])
      },
    });
    return corretores.data?.data || [];
  }catch(error: any){
    console.error("Erro ao listar Corretores para autenticação", error)
    throw error
  }
}

export async function atualizarCorretor(name: string, dados: Partial<corretor>) {
  try {
    // Permissão total - todos podem editar
    const response = await frappe.put(`/resource/Corretores/${name}`, dados);
    
    // 🔔 Notificar admin sobre a edição (se não for o admin editando)
    try {
      const usuarioLogado = localStorage.getItem("userName") || "Sistema";
      const isAdminUser = localStorage.getItem("isAdmin") === "true";
      const nomeCorretor = dados.nome_completo || name;
      
      if (!isAdminUser) {
        const { NotificacoesService } = await import("./Notificacoes");
        const notificacoesService = new NotificacoesService();
        await notificacoesService.criar({
          destinatario: "Administrator",
          titulo: "Corretor Editado",
          descricao: `${usuarioLogado} editou os dados do corretor ${nomeCorretor}`,
          categoria: "Movimentacoes",
          tipo: "Movimentacao",
          prioridade: "Baixa",
          referencia_doctype: "Corretores",
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
    console.error("Erro ao atualizar corretor:", error);
    throw error;
  }
}

export async function deletarCorretor(name: string) {
  try {
    // Buscar nome do corretor antes de deletar
    let nomeCorretor = name;
    try {
      const corretor = await frappe.get(`/resource/Corretores/${name}`);
      nomeCorretor = corretor.data?.data?.nome_completo || name;
    } catch (err) {
      console.warn("⚠️ Não foi possível buscar nome do corretor");
    }
    
    // Permissão total - todos podem deletar
    await frappe.post('/method/frappe.client.delete', {
      doctype: 'Corretores',
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
          titulo: "Corretor Excluído",
          descricao: `${usuarioLogado} excluiu o corretor ${nomeCorretor}`,
          categoria: "Movimentacoes",
          tipo: "Movimentacao",
          prioridade: "Alta",
          icone: "🗑️"
        });
        console.log("✅ Notificação de exclusão enviada ao admin");
      }
    } catch (notifError) {
      console.error("⚠️ Erro ao criar notificação:", notifError);
    }
    
    return true;
  } catch (error: any) {
    console.error("Erro ao deletar corretor:", error);
    throw error;
  }
}