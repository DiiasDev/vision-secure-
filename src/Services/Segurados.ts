import { frappe } from "./frappeClient";
import type { segurado } from "../Types/segurados.types";
import { filterDataByUser, canEdit, getCurrentCorretorForNewRecord, isAdmin, getCorretorId } from "../Utils/permissions";
import { salvarAssociacaoCorretor, filtrarPorCorretorLocal } from "../Utils/corretorMapping";
import { NotificacoesService } from "./Notificacoes";

export async function criarSegurado(dados: segurado) {
  try {
    // Se não for admin, forçar o corretor logado
    const corretorId = getCurrentCorretorForNewRecord();
    console.log("👤 Criando segurado com corretor:", corretorId);
    
    // Criar uma cópia dos dados para não modificar o original
    const dadosParaEnviar: any = { ...dados };
    
    if (corretorId) {
      // Tentar adicionar em múltiplos campos que podem existir no backend
      dadosParaEnviar.corretor = corretorId;
      dadosParaEnviar.corretor_responsavel = corretorId;
      dadosParaEnviar.id_corretor = corretorId;
    }
    
    console.log("📝 Dados do segurado a serem enviados:", dadosParaEnviar);
    const { data } = await frappe.post("/resource/Segurados", dadosParaEnviar);
    console.log("✅ Segurado criado:", data.data);
    
    // Salvar associação localmente caso o backend não suporte o campo corretor
    if (corretorId && data.data?.name) {
      salvarAssociacaoCorretor("segurado", data.data.name, corretorId);
    }
    
    // 🔔 Notificação desativada - as verificações automáticas já cuidam disso
    // try {
    //   const nomeSegurado = dados.nome_segurado || dados.nome_completo || "Novo segurado";
    //   const usuarioLogado = localStorage.getItem("userName") || "Sistema";
    //   console.log("🔔 Preparando notificação para admin sobre:", nomeSegurado, "criado por:", usuarioLogado);
    //   
    //   const notificacoesService = new NotificacoesService();
    //   
    //   const resultNotif = await notificacoesService.criar({
    //     destinatario: "Administrator",
    //     titulo: "Novo Segurado Cadastrado",
    //     descricao: `${usuarioLogado} cadastrou um novo segurado: ${nomeSegurado}`,
    //     categoria: "Seguros",
    //     tipo: "Cadastro",
    //     prioridade: "Normal",
    //     referencia_doctype: "Segurados",
    //     referencia_name: data.data?.name,
    //     icone: "👤"
    //   });
    //   
    //   console.log("✅ Notificação de novo segurado criada:", resultNotif);
    // } catch (notifError: any) {
    //   console.error("⚠️ Erro ao criar notificação:", notifError);
    //   console.error("⚠️ Stack:", notifError.stack);
    //   console.error("⚠️ Response:", notifError.response?.data);
    //   // Não falhar o cadastro se a notificação falhar
    // }
    
    return data.data;
  } catch (error: any) {
    console.error("❌ Erro ao cadastrar Segurado", error);
    console.error("Detalhes do erro:", error.response?.data);
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
    const data = response.data?.data || [];
    console.log("📊 Segurados do backend:", data.length, data);
    
    // Se for admin, retornar tudo
    if (isAdmin()) {
      console.log("✅ Admin - retornando todos");
      return data;
    }
    
    // Se for corretor, filtrar pelos segurados que ELE criou
    const corretorId = getCorretorId();
    if (!corretorId) {
      console.log("❌ Sem corretorId");
      return [];
    }
    
    // Tentar filtrar pelo campo corretor do backend primeiro
    let filtered = filterDataByUser(data);
    console.log("🔍 Segurados filtrados (backend por campo corretor):", filtered.length);
    
    // Se não houver resultados pelo campo corretor, usar o mapeamento local
    if (filtered.length === 0 && data.length > 0) {
      console.log("⚠️ Campo corretor não existe no backend");
      console.log("🔧 Filtrando por mapeamento local (segurados criados pelo corretor)");
      
      filtered = filtrarPorCorretorLocal("segurado", data, corretorId);
      console.log("🔍 Segurados com mapeamento local:", filtered.length);
    }
    
    console.log("✅ Segurados filtrados (final):", filtered.length, filtered.map(s => s.name));
    return filtered;
  } catch (error: any) {
    console.error("Erro ao listar Segurados", error);
    throw error;
  }
}

export async function atualizarSegurado(name: string, dados: Partial<segurado>) {
  try {
    // Permissão total - todos podem editar
    const response = await frappe.put(`/resource/Segurados/${name}`, dados);
    
    // 🔔 Notificar admin sobre a edição (se não for o admin editando)
    try {
      const usuarioLogado = localStorage.getItem("userName") || "Sistema";
      const isAdminUser = localStorage.getItem("isAdmin") === "true";
      const nomeSegurado = dados.nome_completo || name;
      
      // Notificar admin se um corretor editou
      if (!isAdminUser) {
        const notificacoesService = new NotificacoesService();
        await notificacoesService.criar({
          destinatario: "Administrator",
          titulo: "Segurado Editado",
          descricao: `${usuarioLogado} editou os dados de ${nomeSegurado}`,
          categoria: "Movimentacoes",
          tipo: "Movimentacao",
          prioridade: "Baixa",
          referencia_doctype: "Segurados",
          referencia_name: name,
          icone: "✏️"
        });
        console.log("✅ Notificação de edição enviada ao admin");
      }
      
      // Verificar se data de aniversário foi alterada e se está próxima
      if (dados.data_nascimento) {
        const { verificarAniversarioSegurado } = await import("../Utils/NotificacoesHelper");
        await verificarAniversarioSegurado(name, dados.data_nascimento, nomeSegurado);
      }
    } catch (notifError) {
      console.error("⚠️ Erro ao criar notificação:", notifError);
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error("Erro ao atualizar Segurado:", error);
    throw error;
  }
}

export async function deletarSegurado(name: string) {
  try {
    // Buscar nome do segurado antes de deletar
    let nomeSegurado = name;
    try {
      const segurado = await frappe.get(`/resource/Segurados/${name}`);
      nomeSegurado = segurado.data?.data?.nome_completo || name;
    } catch (err) {
      console.warn("⚠️ Não foi possível buscar nome do segurado");
    }
    
    // Permissão total - todos podem deletar
    await frappe.post('/method/frappe.client.delete', {
      doctype: 'Segurados',
      name: name,
      force: 1
    });
    
    // 🔔 Notificar admin sobre exclusão (se não for o admin deletando)
    try {
      const usuarioLogado = localStorage.getItem("userName") || "Sistema";
      const isAdminUser = localStorage.getItem("isAdmin") === "true";
      
      if (!isAdminUser) {
        const notificacoesService = new NotificacoesService();
        await notificacoesService.criar({
          destinatario: "Administrator",
          titulo: "Segurado Excluído",
          descricao: `${usuarioLogado} excluiu o segurado ${nomeSegurado}`,
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
    console.error("Erro ao deletar Segurado:", error);
    throw error;
  }
}
