import type { seguro } from "../Types/seguros.types";
import { frappe } from "./frappeClient";
import { getSegurados } from "./Segurados";
import { getSeguradoras } from "./Seguradoras";
import { getCorretor } from "./corretores";
import { getVehicle } from "./veiculos";
import { filterDataByUser, canEdit, getCurrentCorretorForNewRecord } from "../Utils/permissions";
import { salvarAssociacaoCorretor, filtrarPorCorretorLocal } from "../Utils/corretorMapping";
import { isAdmin, getCorretorId } from "./auth";

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
    if (!canEdit(dados.corretor_responsavel)) {
      throw new Error("Você não tem permissão para editar este seguro");
    }
    const response = await frappe.put(`/resource/Seguros/${name}`, dados);
    return response.data.data;
  } catch (error: any) {
    console.error("Erro ao atualizar seguro:", error);
    throw error;
  }
}

export async function deletarSeguro(name: string) {
  try {
    // Buscar o seguro primeiro para verificar permissão
    const seguro = await frappe.get(`/resource/Seguros/${name}`);
    const seguroData = seguro.data?.data;
    
    if (!canEdit(seguroData?.corretor_responsavel)) {
      throw new Error("Você não tem permissão para deletar este seguro");
    }
    
    // Usando método customizado do Frappe para forçar exclusão
    await frappe.post('/method/frappe.client.delete', {
      doctype: 'Seguros',
      name: name,
      force: 1
    });
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
