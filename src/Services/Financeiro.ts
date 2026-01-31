import { getSeguros } from "./Seguros";
import { getCorretor } from "./corretores";
import { frappe } from "./frappeClient";

export class Financeiro {
  constructor() {}

  async getReceitasTotal(): Promise<number> {
    const seguros = await getSeguros();
    const total = seguros.reduce((acc, seguro) => {
      return acc + (seguro.valor_do_seguro || 0);
    }, 0);
    return total;
  }

  async getEvolucaovendas(startDate?: string, endDate?: string) {
    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    const response = await frappe.get(
      "/method/vision_secure.seguros.doctype.seguros.seguros.data_evolucao_vendas",
      { params },
    );
    const { dados } = response.data.message || {};
    return dados.map((item: any) => ({
      mes: item.mes,
      vendas: item.vendas_atuais ?? item.total_vendas ?? 0,
      meta: item.meta ?? 0,
      ano_anterior: item.ano_anterior ?? 0,
    }));
  }

  async getVendasPorCategoria(startDate?: string, endDate?: string) {
    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    const response = await frappe.get(
      "/method/vision_secure.seguros.doctype.seguros.seguros.vendas_por_categoria",
      { params },
    );
    const { dados } = response.data.message || {};
    return dados;
  }

  async getRankingDeCorretores(startDate?: string, endDate?: string) {
    try {
      const params: any = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      const response = await frappe.get(
        "/method/vision_secure.seguros.doctype.seguros.seguros.ranking_de_corretores",
        { params },
      );
      const { dados } = response.data.message || {};
      return dados;
    } catch (error: any) {
      console.error("Erro ao fazer o get da função de ranking de corretores");
    }
  }

  async getVendasPorCategoriaCorretor(startDate?: string, endDate?: string) {
    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    const response = await frappe.get(
      "/method/vision_secure.seguros.doctype.seguros.seguros.vendas_por_categoria_corretor",
      { params },
    );
    const { dados } = response.data.message || {};
    return dados;
  }

  async getTotalVendas(): Promise<number> {
    const seguros = await getSeguros();
    return seguros.length;
  }

  async getTicketMedio(): Promise<number> {
    const seguros = await getSeguros();
    if (seguros.length === 0) return 0;
    const total = seguros.reduce((acc, seguro) => {
      return acc + (seguro.valor_do_seguro || 0);
    }, 0);
    return total / seguros.length;
  }

  async corretoresAtivos(): Promise<number> {
    try {
      const corretores = await getCorretor();

      if (!corretores || corretores.length === 0) {
        console.log("Nenhum corretor encontrado");
        return 0;
      }

      const ativos = corretores.filter(
        (corretor) => corretor.status === "Ativo",
      );

      console.log(
        `Total de corretores: ${corretores.length}, Ativos: ${ativos.length}`,
      );
      return ativos.length;
    } catch (error: any) {
      console.error("Erro ao buscar corretores:", error);
      return 0;
    }
  }
}
