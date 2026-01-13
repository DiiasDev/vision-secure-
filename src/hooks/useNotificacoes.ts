// hooks/useNotificacoes.ts
import { useEffect, useState } from "react";
import NotificacoesService, {
  type Notificacao
} from "../Services/Notificacoes";
import { verificarAniversarios, verificarVencimentosSeguros } from "../Utils/NotificacoesHelper";

const POLLING_INTERVAL = 30000; // 30 segundos

export function useNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [loading, setLoading] = useState(false);

  async function carregar() {
    try {
      setLoading(true);
      const data = await NotificacoesService.listar();
      setNotificacoes(data);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoading(false);
    }
  }

  async function carregarBadge() {
    try {
      const total = await NotificacoesService.contarNaoLidas();
      setNaoLidas(total);
    } catch (error) {
      console.error("Erro ao carregar badge de notificações:", error);
    }
  }

  async function marcarComoLida(id: string) {
    try {
      console.log("🔔 [HOOK] Marcando notificação como lida:", id);
      await NotificacoesService.marcarComoLida(id);
      console.log("🔔 [HOOK] Recarregando notificações...");
      await carregar();
      await carregarBadge();
      console.log("✅ [HOOK] Concluído");
    } catch (error: any) {
      console.error("❌ [HOOK] Erro ao marcar notificação como lida:", error);
      console.error("❌ [HOOK] Stack:", error.stack);
    }
  }

  async function marcarTodasComoLidas() {
    try {
      console.log("🔔 [HOOK] Marcando todas como lidas...");
      const total = await NotificacoesService.marcarTodasComoLidas();
      console.log(`🔔 [HOOK] ${total} notificações marcadas`);
      console.log("🔔 [HOOK] Recarregando notificações...");
      await carregar();
      await carregarBadge();
      console.log("✅ [HOOK] Concluído");
      return total;
    } catch (error: any) {
      console.error("❌ [HOOK] Erro ao marcar todas como lidas:", error);
      console.error("❌ [HOOK] Stack:", error.stack);
      throw error;
    }
  }

  async function excluir(id: string) {
    try {
      await NotificacoesService.excluir(id);
      await carregar();
      await carregarBadge();
    } catch (error) {
      console.error("Erro ao excluir notificação:", error);
    }
  }

  async function verificarManualmente() {
    try {
      console.log("🔍 Verificando aniversários e vencimentos manualmente...");
      await verificarAniversarios();
      await verificarVencimentosSeguros();
      await carregar();
      await carregarBadge();
      console.log("✅ Verificação manual concluída");
    } catch (error) {
      console.error("❌ Erro na verificação manual:", error);
    }
  }

  useEffect(() => {
    carregar();
    carregarBadge();

    // Verificar ao montar o componente (login), mas evitar duplicação
    const jaVerificouHoje = localStorage.getItem('ultimaVerificacaoNotif');
    const hoje = new Date().toDateString();
    
    if (jaVerificouHoje !== hoje) {
      console.log("🔍 Primeira verificação do dia - executando verificações...");
      localStorage.setItem('ultimaVerificacaoNotif', hoje);
      
      // Executar verificações com delay para não sobrecarregar
      setTimeout(() => {
        verificarAniversarios().catch(err => console.error("Erro ao verificar aniversários:", err));
      }, 2000);
      
      setTimeout(() => {
        verificarVencimentosSeguros().catch(err => console.error("Erro ao verificar vencimentos:", err));
      }, 4000);
    } else {
      console.log("ℹ️ Verificações já executadas hoje");
    }

    // Polling para atualizar notificações automaticamente
    const interval = setInterval(() => {
      carregarBadge(); // Atualiza apenas o contador (mais leve)
    }, POLLING_INTERVAL);

    // DESABILITADO: Verificação periódica - use botão manual ou cron job
    // const verificacaoInterval = setInterval(() => {
    //   verificarAniversarios();
    //   verificarVencimentosSeguros();
    // }, VERIFICACAO_INTERVAL);

    return () => {
      clearInterval(interval);
      // clearInterval(verificacaoInterval);
    };
  }, []);

  return {
    notificacoes,
    naoLidas,
    loading,
    carregar,
    marcarComoLida,
    marcarTodasComoLidas,
    excluir,
    verificarManualmente
  };
}
