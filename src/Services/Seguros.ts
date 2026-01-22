import type { seguro } from "../Types/seguros.types";
import { frappe } from "./frappeClient";
import { getSegurados } from "./Segurados";
import { getSeguradoras } from "./Seguradoras";
import { getCorretor } from "./corretores";
import { getVehicle } from "./veiculos";
import { filterDataByUser, getCurrentCorretorForNewRecord } from "../Utils/permissions";
import { salvarAssociacaoCorretor, filtrarPorCorretorLocal } from "../Utils/corretorMapping";
import { isAdmin, getCorretorId } from "./auth";
import { NotificacoesService } from "./Notificacoes";

export async function newSeguro(dados: seguro) {
  try {
    // Limpar dados: extrair apenas IDs dos campos que vêm como "ID|Nome"
    const dadosLimpos = { ...dados };
    
    // Garantir que situacao_pagamento tenha um valor padrão
    if (!dadosLimpos.situacao_pagamento) {
      dadosLimpos.situacao_pagamento = 'Em Dia';
    }
    
    // Campos que podem vir com formato "ID|Nome"
    const camposParaLimpar = ['segurado', 'seguradora', 'corretor_responsavel', 'veiculo'];
    
    camposParaLimpar.forEach(campo => {
      if (dadosLimpos[campo as keyof seguro] && typeof dadosLimpos[campo as keyof seguro] === 'string') {
        const valor = dadosLimpos[campo as keyof seguro] as string;
        // Se contém "|", extrair apenas o ID (parte antes do |)
        if (valor.includes('|')) {
          (dadosLimpos as any)[campo] = valor.split('|')[0].trim();
        }
      }
    });
    
    // Remover campos vazios/undefined (especialmente veiculo se for opcional e não preenchido)
    Object.keys(dadosLimpos).forEach(key => {
      const valor = (dadosLimpos as any)[key];
      if (valor === '' || valor === undefined || valor === null) {
        delete (dadosLimpos as any)[key];
      }
    });
    
    console.log('📤 Dados limpos para envio:', dadosLimpos);
    
    // Se não for admin, forçar o corretor logado
    const corretorId = getCurrentCorretorForNewRecord();
    if (corretorId) {
      dadosLimpos.corretor_responsavel = corretorId;
    }
    
    console.log('🚀 Enviando requisição para criar seguro...');
    console.log('📋 Dados completos:', JSON.stringify(dadosLimpos, null, 2));
    const { data } = await frappe.post("/resource/Seguros", dadosLimpos);
    console.log('📦 Resposta do backend:', data);
    const novoSeguro = data.data;
    
    console.log('✅ Seguro criado:', novoSeguro);
    
    // Salvar associação no mapeamento local
    const corretorAtual = getCorretorId();
    if (corretorAtual && novoSeguro?.name) {
      salvarAssociacaoCorretor('seguro', novoSeguro.name, corretorAtual);
    }
    
    // 🔔 Criar notificação sobre novo seguro
    try {
      const usuarioLogado = localStorage.getItem("userName") || "Sistema";
      
      // Buscar dados do segurado e veículo para a notificação
      let descricao = `${usuarioLogado} cadastrou um novo seguro`;
      
      if (dadosLimpos.segurado) {
        try {
          const seguradoResp = await frappe.get(`/resource/Segurados/${dadosLimpos.segurado}`);
          const nomeSegurado = seguradoResp.data?.data?.nome_completo;
          if (nomeSegurado) {
            descricao = `${usuarioLogado} cadastrou um novo seguro para ${nomeSegurado}`;
          }
        } catch (e) {
          console.warn("⚠️ Não foi possível buscar nome do segurado");
        }
      }
      
      if (dadosLimpos.veiculo_placa) {
        descricao += ` - Veículo: ${dadosLimpos.veiculo_placa}`;
      }
      
      const notificacoesService = new NotificacoesService();
      await notificacoesService.criar({
        destinatario: "Administrator",
        titulo: "Novo Seguro Cadastrado",
        descricao,
        categoria: "Seguros",
        tipo: "Cadastro",
        prioridade: "Normal",
        referencia_doctype: "Seguros",
        referencia_name: novoSeguro.name,
        icone: "🛡️"
      });
      
      console.log("✅ Notificação de novo seguro criada");
    } catch (notifError) {
      console.error("⚠️ Erro ao criar notificação de seguro:", notifError);
    }
    
    return novoSeguro;
  } catch (error: any) {
    console.error("❌ Erro ao cadastrar novo Seguro:", error);
    if (error.response) {
      console.error("📋 Status:", error.response.status);
      console.error("📋 Detalhes do erro:", error.response.data);
      if (error.response.data?.exception) {
        console.error("⚠️ Mensagem:", error.response.data.exception);
      }
    }
    throw error;
  }
}

export async function atualizarSeguro(name: string, dados: Partial<seguro>) {
  try {
    // Permissão total - todos podem editar
    const response = await frappe.put(`/resource/Seguros/${name}`, dados);
    
    // 🔔 Notificar admin e verificar vencimento
    try {
      const usuarioLogado = localStorage.getItem("userName") || "Sistema";
      const isAdminUser = localStorage.getItem("isAdmin") === "true";
      const placaVeiculo = dados.veiculo_placa || dados.veiculo || "Seguro";
      
      // Notificar admin se um corretor editou
      if (!isAdminUser) {
        const notificacoesService = new NotificacoesService();
        await notificacoesService.criar({
          destinatario: "Administrator",
          titulo: "Seguro Editado",
          descricao: `${usuarioLogado} editou o seguro do veículo ${placaVeiculo}`,
          categoria: "Movimentacoes",
          tipo: "Movimentacao",
          prioridade: "Baixa",
          referencia_doctype: "Seguros",
          referencia_name: name,
          icone: "✏️"
        });
        console.log("✅ Notificação de edição enviada ao admin");
      }
      
      // Verificar se data de vencimento foi alterada e se está próxima
      if (dados.fim_vigencia) {
        const { verificarVencimentoSeguro } = await import("../Utils/NotificacoesHelper");
        await verificarVencimentoSeguro(name, dados.fim_vigencia, placaVeiculo);
      }
    } catch (notifError) {
      console.error("⚠️ Erro ao criar notificação:", notifError);
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error("Erro ao atualizar seguro:", error);
    throw error;
  }
}

export async function deletarSeguro(name: string) {
  try {
    // Buscar placa do veículo antes de deletar
    let placaVeiculo = name;
    try {
      const seguro = await frappe.get(`/resource/Seguros/${name}`);
      placaVeiculo = seguro.data?.data?.veiculo_placa || seguro.data?.data?.veiculo || name;
    } catch (err) {
      console.warn("⚠️ Não foi possível buscar placa do veículo");
    }
    
    // Permissão total - todos podem deletar
    await frappe.post('/method/frappe.client.delete', {
      doctype: 'Seguros',
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
          titulo: "Seguro Excluído",
          descricao: `${usuarioLogado} excluiu o seguro do veículo ${placaVeiculo}`,
          categoria: "Movimentacoes",
          tipo: "Movimentacao",
          prioridade: "Normal",
          referencia_doctype: "Seguros",
          icone: "🗑️"
        });
        console.log("✅ Notificação de exclusão enviada ao admin");
      }
    } catch (notifError) {
      console.error("⚠️ Erro ao criar notificação:", notifError);
    }
    
    return true;
  } catch (error: any) {
    console.error("Erro ao deletar Seguro:", error);
    throw error;
  }
}

export async function getSeguros(): Promise<seguro[]> {
  try {
    const seguros = await frappe.get("/resource/Seguros", {
      params: {
        fields: JSON.stringify(["*"]),
      },
    });
    
    const segurosData = seguros.data?.data || [];
    console.log("📊 Seguros do backend:", segurosData.length, segurosData);
    
    // Se for admin, retornar todos
    if (isAdmin()) {
      console.log("✅ Admin - retornando todos os seguros");
      const segurosFiltrados = segurosData;
      // Continuar com enriquecimento...
      const [segurados, seguradoras, corretores, veiculos] = await Promise.all([
        getSegurados(),
        getSeguradoras(),
        getCorretor(),
        getVehicle(),
      ]);
      return enrichSeguros(segurosFiltrados, segurados, seguradoras, corretores, veiculos);
    }
    
    // Filtrar por campo corretor_responsavel do backend
    const segurosFiltradosBackend = filterDataByUser(segurosData.map((s: any) => ({
      ...s,
      corretor: s.corretor_responsavel
    })));
    
    console.log("🔍 Seguros filtrados (backend por campo corretor):", segurosFiltradosBackend.length);
    
    // Se encontrou seguros pelo backend, usar eles
    if (segurosFiltradosBackend.length > 0) {
      const [segurados, seguradoras, corretores, veiculos] = await Promise.all([
        getSegurados(),
        getSeguradoras(),
        getCorretor(),
        getVehicle(),
      ]);
      return enrichSeguros(segurosFiltradosBackend, segurados, seguradoras, corretores, veiculos);
    }
    
    // Fallback: usar mapeamento local
    console.log("⚠️ Campo corretor não existe no backend");
    console.log("🔧 Filtrando por mapeamento local (seguros criados pelo corretor)");
    
    const corretorId = getCorretorId();
    if (!corretorId) {
      console.log("❌ Nenhum corretor logado");
      return [];
    }
    
    const segurosFiltradosLocal = filtrarPorCorretorLocal('seguro', segurosData, corretorId);
    console.log("🔍 Seguros com mapeamento local:", segurosFiltradosLocal.length);
    console.log("✅ Seguros filtrados (final):", segurosFiltradosLocal.length, segurosFiltradosLocal);
    
    const [seguradosEnrich, seguradorasEnrich, corretoresEnrich, veiculosEnrich] = await Promise.all([
      getSegurados(),
      getSeguradoras(),
      getCorretor(),
      getVehicle(),
    ]);
    
    return enrichSeguros(segurosFiltradosLocal, seguradosEnrich, seguradorasEnrich, corretoresEnrich, veiculosEnrich);
  } catch (error: any) {
    console.error("Erro ao listar seguros", error);
    throw error;
  }
}

// Função auxiliar para enriquecer seguros com dados relacionados
function enrichSeguros(
  seguros: any[],
  segurados: any[],
  seguradoras: any[],
  corretores: any[],
  veiculos: any[]
): seguro[] {
  const seguradosMap = new Map(
    segurados.map(s => [s.name, {
      nome: s.nome_completo,
      cpf: s.cpf,
      telefone: s.telefone,
      whatsapp: s.whatsapp,
    }])
  );
  
  const seguradorasMap = new Map(
    seguradoras.map(s => [s.name, {
      nome: s.nome_seguradora,
      logo: s.logo_seguradora,
    }])
  );
  
  const corretoresMap = new Map(
    corretores.map(c => [c.name, c.nome_completo])
  );
  
  const veiculosMap = new Map(
    veiculos.map(v => [v.name, {
      marca: v.marca,
      modelo: v.modelo,
      placa: v.placa,
    }])
  );
  
  return seguros.map((seguro: seguro) => {
    const dadosSegurado = seguradosMap.get(seguro.segurado);
    const dadosSeguradora = seguradorasMap.get(seguro.seguradora);
    const nomeCorretor = corretoresMap.get(seguro.corretor_responsavel);
    const dadosVeiculo = seguro.veiculo ? veiculosMap.get(seguro.veiculo) : null;
    
    return {
      ...seguro,
      segurado_nome: dadosSegurado?.nome || seguro.segurado,
      segurado_cpf: dadosSegurado?.cpf || '',
      segurado_telefone: dadosSegurado?.telefone || '',
      segurado_whatsapp: dadosSegurado?.whatsapp || '',
      seguradora_nome: dadosSeguradora?.nome || seguro.seguradora,
      seguradora_logo: dadosSeguradora?.logo || '',
      corretor_nome: nomeCorretor || seguro.corretor_responsavel,
      veiculo_marca: dadosVeiculo?.marca || '',
      veiculo_modelo: dadosVeiculo?.modelo || '',
      veiculo_placa: dadosVeiculo?.placa || '',
    };
  });
}
