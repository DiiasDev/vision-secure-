import { getSeguros } from "./Seguros";
import { getCorretor } from "./corretores";

export class Financeiro {
  constructor() {}

  async getReceitasTotal(): Promise<number> {
    const seguros = await getSeguros();
    const total = seguros.reduce((acc, seguro) => {
      return acc + (seguro.valor_do_seguro || 0);
    }, 0);
    return total;
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

      const ativos = corretores.filter(corretor => corretor.status === "Ativo");
      
      console.log(`Total de corretores: ${corretores.length}, Ativos: ${ativos.length}`);
      return ativos.length;
    } catch (error: any) {
      console.error("Erro ao buscar corretores:", error);
      return 0;
    }
  }
}
