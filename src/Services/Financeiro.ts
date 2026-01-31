import { getSeguros } from "./Seguros";
import { getCorretor } from "./corretores";
import { frappe } from "./frappeClient";

export interface PlanilhaAcertoResumo {
  id: number;
  nomeArquivo: string;
  dataCriacao: string;
  total_comissoes: number;
  planilhaUrl: string;
}

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

  async getPlanilhasAcertoFixas(): Promise<PlanilhaAcertoResumo[]> {
    return [
      {
        id: 1,
        nomeArquivo: "Acerto_Janeiro_2026.xlsx",
        dataCriacao: "25/01/2026 14:30",
        total_comissoes: 125430.5,
        planilhaUrl: "/files/Acerto_Janeiro_2026.xlsx",
      },
      {
        id: 2,
        nomeArquivo: "Acerto_Dezembro_2025.xlsx",
        dataCriacao: "26/12/2025 16:45",
        total_comissoes: 132980.25,
        planilhaUrl: "/files/Acerto_Dezembro_2025.xlsx",
      },
      {
        id: 3,
        nomeArquivo: "Acerto_Novembro_2025.xlsx",
        dataCriacao: "24/11/2025 10:20",
        total_comissoes: 118742.1,
        planilhaUrl: "/files/Acerto_Novembro_2025.xlsx",
      },
      {
        id: 4,
        nomeArquivo: "Acerto_Outubro_2025.xlsx",
        dataCriacao: "23/10/2025 15:10",
        total_comissoes: 109380.9,
        planilhaUrl: "/files/Acerto_Outubro_2025.xlsx",
      },
      {
        id: 5,
        nomeArquivo: "Acerto_Setembro_2025.xlsx",
        dataCriacao: "22/09/2025 11:30",
        total_comissoes: 102540.35,
        planilhaUrl: "/files/Acerto_Setembro_2025.xlsx",
      },
    ];
  }
}
