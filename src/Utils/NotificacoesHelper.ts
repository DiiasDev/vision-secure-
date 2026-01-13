// Utils/NotificacoesHelper.ts
import { NotificacoesService } from "../Services/Notificacoes";
import { frappe } from "../Services/frappeClient";

/**
 * Verifica aniversários próximos e cria notificações
 */
export async function verificarAniversarios() {
  try {
    console.log("🎂 Verificando aniversários...");
    
    // Buscar todos os segurados
    const response = await frappe.get("/resource/Segurados", {
      params: {
        fields: JSON.stringify(["name", "nome_completo", "data_nascimento"]),
        limit_page_length: 0,
      },
    });
    
    const segurados = response.data?.data || [];
    console.log(`📊 Total de segurados encontrados: ${segurados.length}`);
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zerar horas para comparação precisa
    const notificacoesService = new NotificacoesService();
    
    let notificacoesCriadas = 0;
    
    for (const segurado of segurados) {
      if (!segurado.data_nascimento) continue;
      
      // Extrair dia e mês da data de nascimento (formato YYYY-MM-DD)
      const [, mesNasc, diaNasc] = segurado.data_nascimento.split('-').map(Number);
      
      // Data de aniversário neste ano
      const aniversarioEsteAno = new Date(hoje.getFullYear(), mesNasc - 1, diaNasc);
      aniversarioEsteAno.setHours(0, 0, 0, 0);
      
      // Se já passou este ano, usar ano que vem
      const proximoAniversario = aniversarioEsteAno >= hoje 
        ? aniversarioEsteAno 
        : new Date(hoje.getFullYear() + 1, mesNasc - 1, diaNasc);
      
      proximoAniversario.setHours(0, 0, 0, 0);
      
      // Calcular dias até o aniversário
      const diffTime = proximoAniversario.getTime() - hoje.getTime();
      const diasAteAniversario = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      // Notificar se falta 7, 3, 1 ou 0 dias (hoje)
      if ([0, 1, 3, 7].includes(diasAteAniversario)) {
        const mensagem = diasAteAniversario === 0
          ? `Hoje é aniversário de ${segurado.nome_completo}! 🎉`
          : diasAteAniversario === 1
          ? `${segurado.nome_completo} faz aniversário amanhã`
          : `${segurado.nome_completo} faz aniversário em ${diasAteAniversario} dias`;
        
        const prioridade = diasAteAniversario === 0 ? "Alta" : diasAteAniversario === 1 ? "Normal" : "Baixa";
        
        // Verificar se já existe notificação para este aniversário (sem duplicação)
        try {
          const notificacoesExistentes = await frappe.get("/resource/Notificacoes", {
            params: {
              fields: JSON.stringify(["name", "titulo", "descricao", "lida"]),
              filters: JSON.stringify([
                ["referencia_name", "=", segurado.name],
                ["tipo", "=", "Aniversario"],
                ["titulo", "=", "Aniversário de Cliente"]
              ]),
              limit_page_length: 20
            }
          });
          
          // Verificar se já existe notificação com a mesma descrição E não lida
          const jaExiste = notificacoesExistentes.data?.data?.some(
            (n: any) => n.descricao === mensagem && n.lida === 0
          );
          
          if (jaExiste) {
            console.log(`⏭️ Notificação de aniversário já existe para ${segurado.nome_completo} (${diasAteAniversario} dias)`);
            continue;
          }
        } catch (checkError) {
          console.warn("⚠️ Erro ao verificar notificações existentes:", checkError);
        }
        
        await notificacoesService.criar({
          destinatario: "Administrator",
          titulo: "Aniversário de Cliente",
          descricao: mensagem,
          categoria: "Aniversarios",
          tipo: "Aniversario",
          prioridade,
          referencia_doctype: "Segurados",
          referencia_name: segurado.name,
          icone: "🎂"
        });
        
        console.log(`✅ Notificação de aniversário criada para ${segurado.nome_completo} (${diasAteAniversario} dias)`);
        notificacoesCriadas++;
      }
    }
    
    console.log(`✅ Verificação de aniversários concluída. ${notificacoesCriadas} notificações criadas.`);
  } catch (error) {
    console.error("❌ Erro ao verificar aniversários:", error);
  }
}

/**
 * Verifica vencimentos de seguros e cria notificações
 */
export async function verificarVencimentosSeguros() {
  try {
    console.log("⚠️ Verificando vencimentos de seguros...");
    
    // Importar getSeguros para usar a mesma lógica
    const { getSeguros } = await import("../Services/Seguros");
    const seguros = await getSeguros();
    
    console.log(`📊 Total de seguros encontrados: ${seguros.length}`);
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const notificacoesService = new NotificacoesService();
    
    let notificacoesCriadas = 0;
    
    for (const seguro of seguros) {
      // Usar fim_vigencia (campo correto do DocType)
      if (!seguro.fim_vigencia) continue;
      
      // Extrair data do vencimento (formato YYYY-MM-DD)
      const [ano, mes, dia] = seguro.fim_vigencia.split('-').map(Number);
      const dataVencimento = new Date(ano, mes - 1, dia);
      dataVencimento.setHours(0, 0, 0, 0);
      
      // Calcular dias até o vencimento
      const diffTime = dataVencimento.getTime() - hoje.getTime();
      const diasAteVencimento = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      // Notificar se falta 30, 15, 5, 1 ou 0 dias (hoje)
      if ([0, 1, 5, 15, 30].includes(diasAteVencimento)) {
        const placaVeiculo = seguro.veiculo_placa || seguro.veiculo || "Veículo";
        const mensagem = diasAteVencimento === 0
          ? `O seguro do veículo ${placaVeiculo} vence HOJE!`
          : diasAteVencimento === 1
          ? `O seguro do veículo ${placaVeiculo} vence amanhã`
          : `O seguro do veículo ${placaVeiculo} vence em ${diasAteVencimento} dias`;
        
        const prioridade = diasAteVencimento <= 1 ? "Critica" : diasAteVencimento <= 5 ? "Alta" : "Normal";
        
        // Verificar se já existe notificação para este vencimento (sem duplicação)
        try {
          const notificacoesExistentes = await frappe.get("/resource/Notificacoes", {
            params: {
              fields: JSON.stringify(["name", "titulo", "descricao", "lida"]),
              filters: JSON.stringify([
                ["referencia_name", "=", seguro.name],
                ["tipo", "=", "Vencimento"],
                ["titulo", "=", "Seguro a Vencer"]
              ]),
              limit_page_length: 20
            }
          });
          
          // Verificar se já existe notificação com a mesma descrição E não lida
          const jaExiste = notificacoesExistentes.data?.data?.some(
            (n: any) => n.descricao === mensagem && n.lida === 0
          );
          
          if (jaExiste) {
            console.log(`⏭️ Notificação de vencimento já existe para ${placaVeiculo} (${diasAteVencimento} dias)`);
            continue;
          }
        } catch (checkError) {
          console.warn("⚠️ Erro ao verificar notificações existentes:", checkError);
        }
        
        await notificacoesService.criar({
          destinatario: "Administrator",
          titulo: "Seguro a Vencer",
          descricao: mensagem,
          categoria: "Seguros",
          tipo: "Vencimento",
          prioridade,
          referencia_doctype: "Seguros",
          referencia_name: seguro.name,
          icone: "⚠️"
        });
        
        console.log(`✅ Notificação de vencimento criada para ${placaVeiculo} (${diasAteVencimento} dias)`);
        notificacoesCriadas++;
      }
    }
    
    console.log(`✅ Verificação de vencimentos concluída. ${notificacoesCriadas} notificações criadas.`);
  } catch (error) {
    console.error("❌ Erro ao verificar vencimentos:", error);
  }
}

/**
 * Verifica e notifica aniversário de um segurado específico (chamado após edição)
 */
export async function verificarAniversarioSegurado(seguradoId: string, dataNascimento: string, nomeCompleto: string) {
  try {
    if (!dataNascimento) return;
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const [, mesNasc, diaNasc] = dataNascimento.split('-').map(Number);
    const aniversarioEsteAno = new Date(hoje.getFullYear(), mesNasc - 1, diaNasc);
    aniversarioEsteAno.setHours(0, 0, 0, 0);
    
    const proximoAniversario = aniversarioEsteAno >= hoje 
      ? aniversarioEsteAno 
      : new Date(hoje.getFullYear() + 1, mesNasc - 1, diaNasc);
    
    proximoAniversario.setHours(0, 0, 0, 0);
    
    const diffTime = proximoAniversario.getTime() - hoje.getTime();
    const diasAteAniversario = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Notificar se está próximo (0 a 7 dias)
    if (diasAteAniversario >= 0 && diasAteAniversario <= 7) {
      const mensagem = diasAteAniversario === 0
        ? `Hoje é aniversário de ${nomeCompleto}! 🎉`
        : diasAteAniversario === 1
        ? `${nomeCompleto} faz aniversário amanhã`
        : `${nomeCompleto} faz aniversário em ${diasAteAniversario} dias`;
      
      const prioridade = diasAteAniversario === 0 ? "Alta" : diasAteAniversario === 1 ? "Normal" : "Baixa";
      
      // Verificar se já existe (sem duplicação)
      const notificacoesExistentes = await frappe.get("/resource/Notificacoes", {
        params: {
          fields: JSON.stringify(["name", "titulo", "descricao", "lida"]),
          filters: JSON.stringify([
            ["referencia_name", "=", seguradoId],
            ["tipo", "=", "Aniversario"],
            ["titulo", "=", "Aniversário Próximo"]
          ]),
          limit_page_length: 20
        }
      });
      
      const jaExiste = notificacoesExistentes.data?.data?.some(
        (n: any) => n.descricao === mensagem && n.lida === 0
      );
      
      if (jaExiste) {
        console.log(`⏭️ Notificação de aniversário já existe para ${nomeCompleto}`);
        return;
      }
      
      const notificacoesService = new NotificacoesService();
      await notificacoesService.criar({
        destinatario: "Administrator",
        titulo: "Aniversário Próximo",
        descricao: mensagem,
        categoria: "Aniversarios",
        tipo: "Aniversario",
        prioridade,
        referencia_doctype: "Segurados",
        referencia_name: seguradoId,
        icone: "🎂"
      });
      
      console.log(`✅ Notificação de aniversário criada para ${nomeCompleto}`);
    }
  } catch (error) {
    console.error("❌ Erro ao verificar aniversário do segurado:", error);
  }
}

/**
 * Verifica e notifica vencimento de um seguro específico (chamado após edição)
 */
export async function verificarVencimentoSeguro(seguroId: string, fimVigencia: string, placaVeiculo?: string) {
  try {
    if (!fimVigencia) return;
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const [ano, mes, dia] = fimVigencia.split('-').map(Number);
    const dataVencimento = new Date(ano, mes - 1, dia);
    dataVencimento.setHours(0, 0, 0, 0);
    
    const diffTime = dataVencimento.getTime() - hoje.getTime();
    const diasAteVencimento = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Notificar se está próximo (0 a 30 dias)
    if ([0, 1, 5, 15, 30].includes(diasAteVencimento)) {
      const placa = placaVeiculo || "Veículo";
      const mensagem = diasAteVencimento === 0
        ? `O seguro do veículo ${placa} vence HOJE!`
        : diasAteVencimento === 1
        ? `O seguro do veículo ${placa} vence amanhã`
        : `O seguro do veículo ${placa} vence em ${diasAteVencimento} dias`;
      
      const prioridade = diasAteVencimento <= 1 ? "Critica" : diasAteVencimento <= 5 ? "Alta" : "Normal";
      
      // Verificar se já existe (sem duplicação)
      const notificacoesExistentes = await frappe.get("/resource/Notificacoes", {
        params: {
          fields: JSON.stringify(["name", "titulo", "descricao", "lida"]),
          filters: JSON.stringify([
            ["referencia_name", "=", seguroId],
            ["tipo", "=", "Vencimento"],
            ["titulo", "=", "Seguro a Vencer"]
          ]),
          limit_page_length: 20
        }
      });
      
      const jaExiste = notificacoesExistentes.data?.data?.some(
        (n: any) => n.descricao === mensagem && n.lida === 0
      );
      
      if (jaExiste) {
        console.log(`⏭️ Notificação de vencimento já existe para ${placa}`);
        return;
      }
      
      const notificacoesService = new NotificacoesService();
      await notificacoesService.criar({
        destinatario: "Administrator",
        titulo: "Seguro a Vencer",
        descricao: mensagem,
        categoria: "Seguros",
        tipo: "Vencimento",
        prioridade,
        referencia_doctype: "Seguros",
        referencia_name: seguroId,
        icone: "⚠️"
      });
      
      console.log(`✅ Notificação de vencimento criada para ${placa}`);
    }
  } catch (error) {
    console.error("❌ Erro ao verificar vencimento do seguro:", error);
  }
}
