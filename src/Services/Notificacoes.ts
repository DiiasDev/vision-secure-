// Services/Notificacoes.ts
import {frappe} from "./frappeClient";

export interface Notificacao {
  name: string;
  titulo: string;
  descricao: string;
  categoria: string; // Seguros | Aniversarios | Movimentacoes | Geral
  tipo: string; // Cadastro | Vencimento | Aniversario | Movimentacao | Sistema
  prioridade: string; // Baixa | Normal | Alta | Critica
  lida: number;
  creation: string;
  criado_por_usuario?: string;
  referencia_doctype?: string;
  referencia_name?: string;
  icone?: string;
}

export interface CriarNotificacaoParams {
  destinatario: string; // Email do usuário destinatário
  titulo: string;
  descricao: string;
  categoria: "Seguros" | "Aniversarios" | "Movimentacoes" | "Geral";
  tipo: "Cadastro" | "Vencimento" | "Aniversario" | "Movimentacao" | "Sistema";
  prioridade?: "Baixa" | "Normal" | "Alta" | "Critica";
  referencia_doctype?: string;
  referencia_name?: string;
  icone?: string;
}

export class NotificacoesService {
  async listar() {
    // Buscar pelo ID do User do Frappe, não pelo email
    const userId = "Administrator"; // Por enquanto fixo, depois ajustamos
    
    console.log("🔍 Buscando notificações para:", userId);

    const { data } = await frappe.get("/resource/Notificacoes", {
      params: {
        fields: JSON.stringify([
          "name",
          "titulo",
          "descricao",
          "categoria",
          "tipo",
          "prioridade",
          "lida",
          "creation",
          "criado_por_usuario"
        ]),
        filters: JSON.stringify([
          ["destinatario", "=", userId]
        ]),
        order_by: "creation desc",
        limit_page_length: 50
      }
    });

    return data.data as Notificacao[];
  }

  async contarNaoLidas() {
    try {
      const userId = "Administrator"; // Por enquanto fixo

      const { data } = await frappe.get("/resource/Notificacoes", {
        params: {
          fields: JSON.stringify(["name"]),
          filters: JSON.stringify([
            ["destinatario", "=", userId],
            ["lida", "=", 0]
          ]),
          limit_page_length: 0 // Retorna todas as não lidas
        }
      });

      return data.data?.length || 0;
    } catch (error) {
      console.error("Erro ao contar notificações não lidas:", error);
      return 0;
    }
  }

  async marcarComoLida(id: string) {
    try {
      console.log("📝 Marcando notificação como lida:", id);
      
      // Buscar a notificação primeiro para ver o estado atual
      const notifAtual = await frappe.get(`/resource/Notificacoes/${id}`);
      console.log("📄 Notificação atual:", notifAtual.data?.data);
      
      // Formato datetime para MySQL: "YYYY-MM-DD HH:MM:SS"
      const agora = new Date();
      const dataLeitura = agora.getFullYear() + '-' +
        String(agora.getMonth() + 1).padStart(2, '0') + '-' +
        String(agora.getDate()).padStart(2, '0') + ' ' +
        String(agora.getHours()).padStart(2, '0') + ':' +
        String(agora.getMinutes()).padStart(2, '0') + ':' +
        String(agora.getSeconds()).padStart(2, '0');
      
      const response = await frappe.put(`/resource/Notificacoes/${id}`, {
        lida: 1,  // Campo Check aceita 1 ou 0
        data_leitura: dataLeitura
      });
      
      console.log("✅ Resposta do servidor:", response.data);
      console.log("✅ Notificação marcada como lida");
      return response.data;
    } catch (error: any) {
      console.error("❌ Erro ao marcar como lida:", error);
      console.error("❌ Response:", error.response?.data);
      throw error;
    }
  }

  async marcarTodasComoLidas() {
    try {
      console.log("📝 Marcando todas as notificações como lidas...");
      const userId = "Administrator";
      const notificacoesNaoLidas = await frappe.get("/resource/Notificacoes", {
        params: {
          fields: JSON.stringify(["name", "titulo", "lida"]),
          filters: JSON.stringify([
            ["destinatario", "=", userId],
            ["lida", "=", 0]
          ]),
          limit_page_length: 0
        }
      });

      const lista = notificacoesNaoLidas.data?.data || [];
      console.log(`📊 Total de notificações não lidas: ${lista.length}`);

      if (lista.length === 0) {
        console.log("ℹ️ Nenhuma notificação para marcar como lida");
        return 0;
      }

      let sucesso = 0;
      let erro = 0;

      // Formato datetime para MySQL
      const agora = new Date();
      const dataLeitura = agora.getFullYear() + '-' +
        String(agora.getMonth() + 1).padStart(2, '0') + '-' +
        String(agora.getDate()).padStart(2, '0') + ' ' +
        String(agora.getHours()).padStart(2, '0') + ':' +
        String(agora.getMinutes()).padStart(2, '0') + ':' +
        String(agora.getSeconds()).padStart(2, '0');
      
      // Marcar cada uma individualmente e aguardar
      for (const notif of lista) {
        try {
          await frappe.put(`/resource/Notificacoes/${notif.name}`, {
            lida: 1,
            data_leitura: dataLeitura
          });
          console.log(`  ✅ ${notif.name} marcada`);
          sucesso++;
        } catch (err: any) {
          console.error(`  ❌ Erro ao marcar ${notif.name}:`, err.response?.data || err.message);
          erro++;
        }
      }

      console.log(`✅ Concluído: ${sucesso} marcadas, ${erro} erros`);
      return sucesso;
    } catch (error: any) {
      console.error("❌ Erro ao marcar todas como lidas:", error);
      console.error("❌ Response:", error.response?.data);
      throw error;
    }
  }

  async excluir(id: string) {
    try {
      await frappe.delete(`/resource/Notificacoes/${id}`);
      console.log("✅ Notificação excluída:", id);
    } catch (error) {
      console.error("❌ Erro ao excluir notificação:", error);
      throw error;
    }
  }

  /**
   * Cria uma nova notificação no sistema
   */
  async criar(params: CriarNotificacaoParams) {
    try {
      // Usar "Administrator" como criador (ID do User do Frappe)
      const userId = "Administrator";
      
      console.log("🔔 Criando notificação:", {
        titulo: params.titulo,
        destinatario: params.destinatario,
        categoria: params.categoria,
        tipo: params.tipo,
        criadoPor: userId
      });
      
      const payload: any = {
        titulo: params.titulo,
        descricao: params.descricao,
        categoria: params.categoria,
        tipo: params.tipo,
        prioridade: params.prioridade || "Normal",
        destinatario: params.destinatario,
        lida: 0,
        canal: "Sistema",
        status_envio: "Enviado",
        origem_evento: "Servico",
        criado_por_usuario: userId // Sempre usar Administrator
      };

      // Adicionar campos opcionais
      if (params.referencia_doctype) {
        payload.referencia_doctype = params.referencia_doctype;
      }
      if (params.referencia_name) {
        payload.referencia_name = params.referencia_name;
      }
      if (params.icone) {
        payload.icone = params.icone;
      }

      console.log("📦 Payload da notificação:", payload);

      const { data } = await frappe.post("/resource/Notificacoes", payload);

      console.log("✅ Notificação criada com sucesso:", data.data);
      return data.data;
    } catch (error: any) {
      console.error("❌ Erro ao criar notificação:", error);
      console.error("Detalhes:", error.response?.data);
      throw error;
    }
  }

  /**
   * Envia notificação de vencimento de seguro
   */
  async notificarVencimentoSeguro(
    destinatario: string,
    placa: string,
    diasParaVencer: number,
    seguroId?: string
  ) {
    return this.criar({
      destinatario,
      titulo: "Seguro a vencer",
      descricao: `O seguro do veículo ${placa} vence em ${diasParaVencer} dias`,
      categoria: "Seguros",
      tipo: "Vencimento",
      prioridade: diasParaVencer <= 5 ? "Critica" : diasParaVencer <= 15 ? "Alta" : "Normal",
      referencia_doctype: "Seguro",
      referencia_name: seguroId,
      icone: "⚠️"
    });
  }

  /**
   * Envia notificação de aniversário
   */
  async notificarAniversario(
    destinatario: string,
    nomeSegurado: string,
    diasParaAniversario: number,
    seguradoId?: string
  ) {
    const mensagem = diasParaAniversario === 0 
      ? `Hoje é aniversário de ${nomeSegurado}! 🎉`
      : diasParaAniversario === 1
      ? `${nomeSegurado} faz aniversário amanhã`
      : `${nomeSegurado} faz aniversário em ${diasParaAniversario} dias`;

    return this.criar({
      destinatario,
      titulo: "Aniversário de cliente",
      descricao: mensagem,
      categoria: "Aniversarios",
      tipo: "Aniversario",
      prioridade: diasParaAniversario === 0 ? "Alta" : "Baixa",
      referencia_doctype: "Cliente",
      referencia_name: seguradoId,
      icone: "🎂"
    });
  }

  /**
   * Envia notificação de movimentação do sistema
   */
  async notificarMovimentacao(
    destinatario: string,
    titulo: string,
    descricao: string,
    subTipo: "novo-cadastro" | "edicao" | "exclusao",
    referenciaDoctype?: string,
    referenciaName?: string
  ) {
    const icones = {
      "novo-cadastro": "➕",
      "edicao": "✏️",
      "exclusao": "🗑️"
    };

    return this.criar({
      destinatario,
      titulo,
      descricao,
      categoria: "Movimentacoes",
      tipo: "Movimentacao",
      prioridade: "Baixa",
      referencia_doctype: referenciaDoctype,
      referencia_name: referenciaName,
      icone: icones[subTipo]
    });
  }
}

export default new NotificacoesService();
