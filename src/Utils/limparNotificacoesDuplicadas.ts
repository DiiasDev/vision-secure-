// Utils/limparNotificacoesDuplicadas.ts
import { frappe } from "../Services/frappeClient";

/**
 * Script para limpar notificações duplicadas
 * Execute este script uma vez para limpar o banco de dados
 */
export async function limparNotificacoesDuplicadas() {
  try {
    console.log("🧹 Iniciando limpeza de notificações duplicadas...");

    // Buscar todas as notificações
    const response = await frappe.get("/resource/Notificacoes", {
      params: {
        fields: JSON.stringify([
          "name",
          "titulo",
          "descricao",
          "tipo",
          "referencia_name",
          "creation",
        ]),
        limit_page_length: 0,
        order_by: "creation desc",
      },
    });

    const notificacoes = response.data?.data || [];
    console.log(`📊 Total de notificações encontradas: ${notificacoes.length}`);

    // Agrupar por tipo + referência + descrição (normalizando espaços)
    const grupos = new Map<string, any[]>();

    for (const notif of notificacoes) {
      // Normalizar descrição removendo espaços extras e caracteres especiais
      const descricaoNormalizada = notif.descricao
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
      
      const chave = `${notif.tipo}-${notif.referencia_name || "sem-ref"}-${descricaoNormalizada}`;
      if (!grupos.has(chave)) {
        grupos.set(chave, []);
      }
      grupos.get(chave)!.push(notif);
    }

    // Identificar e excluir duplicatas (manter apenas a mais recente)
    let totalExcluidas = 0;
    const promessas: Promise<void>[] = [];
    
    for (const [chave, grupo] of grupos.entries()) {
      if (grupo.length > 1) {
        console.log(`🔍 Encontradas ${grupo.length} notificações duplicadas para: ${chave.split('-')[0]}`);
        
        // Ordenar por data (mais recente primeiro)
        grupo.sort((a, b) => new Date(b.creation).getTime() - new Date(a.creation).getTime());
        
        // Manter a primeira (mais recente) e excluir as outras
        for (let i = 1; i < grupo.length; i++) {
          promessas.push(
            frappe.delete(`/resource/Notificacoes/${grupo[i].name}`)
              .then(() => {
                console.log(`  ✅ Excluída: ${grupo[i].titulo}`);
                totalExcluidas++;
              })
              .catch(error => {
                console.error(`  ❌ Erro ao excluir ${grupo[i].name}:`, error);
              })
          );
        }
      }
    }
    
    // Aguardar todas as exclusões
    await Promise.all(promessas);

    console.log(`✅ Limpeza concluída! Total de notificações excluídas: ${totalExcluidas}`);
    return { total: notificacoes.length, excluidas: totalExcluidas };
  } catch (error) {
    console.error("❌ Erro ao limpar notificações duplicadas:", error);
    throw error;
  }
}

/**
 * Limpar notificações de cadastro duplicadas (Julia/Admin)
 */
export async function limparNotificacoesCadastro() {
  try {
    console.log("🧹 Limpando notificações de cadastro duplicadas...");

    const response = await frappe.get("/resource/Notificacoes", {
      params: {
        fields: JSON.stringify(["name", "titulo", "descricao", "creation"]),
        filters: JSON.stringify([["tipo", "=", "Cadastro"]]),
        limit_page_length: 0,
        order_by: "creation desc",
      },
    });

    const notificacoes = response.data?.data || [];
    console.log(`📊 Notificações de cadastro encontradas: ${notificacoes.length}`);

    // Agrupar por descrição similar (mesmo segurado)
    const grupos = new Map<string, any[]>();
    for (const notif of notificacoes) {
      // Extrair nome do segurado da descrição
      const match = notif.descricao.match(/cadastrou (?:um novo segurado: )?(.+)$/);
      if (match) {
        const nomeSegurado = match[1];
        if (!grupos.has(nomeSegurado)) {
          grupos.set(nomeSegurado, []);
        }
        grupos.get(nomeSegurado)!.push(notif);
      }
    }

    let totalExcluidas = 0;
    for (const [nome, grupo] of grupos.entries()) {
      if (grupo.length > 1) {
        console.log(`🔍 Segurado "${nome}" tem ${grupo.length} notificações`);
        
        // Ordenar por data e manter apenas a mais recente
        grupo.sort((a, b) => new Date(b.creation).getTime() - new Date(a.creation).getTime());
        
        for (let i = 1; i < grupo.length; i++) {
          try {
            await frappe.delete(`/resource/Notificacoes/${grupo[i].name}`);
            console.log(`  ✅ Excluída: ${grupo[i].titulo}`);
            totalExcluidas++;
          } catch (error) {
            console.error(`  ❌ Erro ao excluir:`, error);
          }
        }
      }
    }

    console.log(`✅ Limpeza de cadastros concluída! Excluídas: ${totalExcluidas}`);
    return totalExcluidas;
  } catch (error) {
    console.error("❌ Erro:", error);
    throw error;
  }
}

/**
 * Limpar TODAS as notificações de uma vez (função de emergência)
 */
export async function limparTodasNotificacoes() {
  try {
    console.log("🧹 ATENÇÃO: Limpando TODAS as notificações...");

    const response = await frappe.get("/resource/Notificacoes", {
      params: {
        fields: JSON.stringify(["name"]),
        limit_page_length: 0,
      },
    });

    const notificacoes = response.data?.data || [];
    console.log(`📊 Total de notificações a excluir: ${notificacoes.length}`);

    if (notificacoes.length === 0) {
      console.log("✅ Nenhuma notificação para excluir");
      return 0;
    }

    // Excluir todas em paralelo
    const promessas = notificacoes.map((notif: any) =>
      frappe.delete(`/resource/Notificacoes/${notif.name}`)
        .catch(error => {
          console.error(`❌ Erro ao excluir ${notif.name}:`, error);
        })
    );

    await Promise.all(promessas);
    console.log(`✅ Todas as ${notificacoes.length} notificações foram excluídas!`);
    return notificacoes.length;
  } catch (error) {
    console.error("❌ Erro ao limpar todas as notificações:", error);
    throw error;
  }
}
