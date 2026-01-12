import type { seguro } from "../Types/seguros.types";
import { frappe } from "./frappeClient";
import { getSegurados } from "./Segurados";
import { getSeguradoras } from "./Seguradoras";
import { getCorretor } from "./corretores";
import { getVehicle } from "./veiculos";

export async function newSeguro(dados: seguro) {
  try {
    const { data } = await frappe.post("/resource/Seguros", dados);
    return data.data;
  } catch (error: any) {
    console.error("Erro ao cadastrar novo Seguro", error);
  }
}

export async function atualizarSeguro(name: string, dados: Partial<seguro>) {
  try {
    const response = await frappe.put(`/resource/Seguros/${name}`, dados);
    return response.data.data;
  } catch (error: any) {
    console.error("Erro ao atualizar seguro:", error);
    throw error;
  }
}

export async function deletarSeguro(name: string) {
  try {
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
    
    // Buscar dados para enriquecimento
    const [segurados, seguradoras, corretores, veiculos] = await Promise.all([
      getSegurados(),
      getSeguradoras(),
      getCorretor(),
      getVehicle(),
    ]);
    
    // Criar mapas para enriquecimento
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
    
    // Enriquecer os seguros com todos os dados
    const segurosEnriquecidos = segurosData.map((seguro: seguro) => {
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
    
    return segurosEnriquecidos;
  } catch (error: any) {
    console.error("Erro ao listar seguros", error);
    throw error;
  }
}
