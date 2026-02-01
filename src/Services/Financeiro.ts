import { getSeguros } from "./Seguros";
import { getCorretor } from "./corretores";
import { frappe } from "./frappeClient";
import { getMetas, type MetaApi } from "./metas";

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const CORRETORA_GERAL = "Corretora";

const monthNameToNumber = (mes?: string) => {
  if (!mes) return null;
  const index = MESES.findIndex(
    (item) => item.toLowerCase() === mes.toLowerCase(),
  );
  if (index === -1) return null;
  return index + 1;
};

const getMonthStart = (dateStr?: string) => {
  if (!dateStr) return null;
  const normalized = dateStr.includes(" ") ? dateStr.replace(" ", "T") : dateStr;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getMetaMonthDate = (meta: MetaApi) => {
  const mesNumero = monthNameToNumber(meta.mes);
  if (!mesNumero) return null;
  return new Date(Number(meta.ano), mesNumero - 1, 1);
};

const isMetaInRange = (meta: MetaApi, startDate?: string, endDate?: string) => {
  if (!startDate && !endDate) return true;
  const metaDate = getMetaMonthDate(meta);
  if (!metaDate) return false;
  const start = getMonthStart(startDate);
  const end = getMonthStart(endDate);
  if (start && metaDate < start) return false;
  if (end && metaDate > end) return false;
  return true;
};

const parseDateFlexible = (raw?: string) => {
  if (!raw) return null;
  if (typeof raw !== "string") {
    const date = new Date(raw as any);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const normalized = raw.includes(" ") ? raw.replace(" ", "T") : raw;
  const iso = new Date(normalized);
  if (!Number.isNaN(iso.getTime())) return iso;
  // dd/mm/yyyy or dd/mm/yyyy HH:mm:ss
  const match = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (match) {
    const [, dd, mm, yyyy, hh = "0", min = "0", ss = "0"] = match;
    const date = new Date(
      Number(yyyy),
      Number(mm) - 1,
      Number(dd),
      Number(hh),
      Number(min),
      Number(ss),
    );
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
};

const getSeguroDate = (seguro: any) => {
  return parseDateFlexible(seguro?.inicio_vigencia || seguro?.creation || "");
};

const getSeguroInicio = (seguro: any) => {
  return parseDateFlexible(seguro?.inicio_vigencia || "");
};

const buildMonthRange = (startDate: string, endDate: string) => {
  const start = getMonthStart(startDate);
  const end = getMonthStart(endDate);
  if (!start || !end) return [];
  const months: string[] = [];
  let cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const endCursor = new Date(end.getFullYear(), end.getMonth(), 1);
  while (cursor <= endCursor) {
    months.push(`${String(cursor.getMonth() + 1).padStart(2, "0")}/${cursor.getFullYear()}`);
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }
  return months;
};

const getSeguroRange = (seguro: any) => {
  const inicio = parseDateFlexible(seguro?.inicio_vigencia || "") || parseDateFlexible(seguro?.creation || "");
  const fim = parseDateFlexible(seguro?.fim_vigencia || "") || inicio;
  if (!inicio) return null;
  if (!fim) return { inicio, fim: inicio };
  if (fim < inicio) return { inicio: fim, fim: inicio };
  return { inicio, fim };
};

const buildMonthlyTotals = (seguros: any[], months: string[]) => {
  const totals = new Map<string, number>();
  months.forEach((mes) => {
    const [mm, yyyy] = mes.split("/");
    const monthStart = new Date(Number(yyyy), Number(mm) - 1, 1);
    const monthEnd = new Date(Number(yyyy), Number(mm), 0);
    let total = 0;
    seguros.forEach((seguro) => {
      const range = getSeguroRange(seguro);
      if (!range) return;
      if (range.inicio <= monthEnd && range.fim >= monthStart) {
        total += Number(seguro.valor_do_seguro) || 0;
      }
    });
    totals.set(mes, total);
  });
  return totals;
};

const matchCategoria = (categoria: string | undefined, tipoSeguro?: string) => {
  if (!categoria || categoria === "Geral") return true;
  if (!tipoSeguro) return false;
  return categoria.toLowerCase() === tipoSeguro.toLowerCase();
};

const matchCorretor = (corretor: string | undefined, seguro: any) => {
  if (!corretor || corretor === CORRETORA_GERAL) return true;
  return (
    seguro.corretor_nome === corretor ||
    seguro.corretor_responsavel === corretor
  );
};

const calcularRealizadoMeta = (meta: MetaApi, seguros: any[]) => {
  const tipoMeta = meta.tipo_meta || "Mensal";
  const metaMonth = monthNameToNumber(meta.mes);
  return seguros.reduce((acc, seguro) => {
    const data = getSeguroDate(seguro);
    if (!data) return acc;
    if (!matchCorretor(meta.corretor, seguro)) return acc;
    if (!matchCategoria(meta.categoria, seguro.tipo_seguro)) return acc;
    const ano = data.getFullYear();
    if (ano !== Number(meta.ano)) return acc;
    if (tipoMeta === "Mensal") {
      if (!metaMonth) return acc;
      const mes = data.getMonth() + 1;
      if (mes !== metaMonth) return acc;
    }
    return acc + (Number(seguro.valor_do_seguro) || 0);
  }, 0);
};

const buildMetaMonthlyMap = (metas: MetaApi[]) => {
  const map = new Map<string, number>();
  metas
    .filter((meta) => (meta.tipo_meta || "Mensal") === "Mensal")
    .forEach((meta) => {
      const mesNumero = monthNameToNumber(meta.mes);
      if (!mesNumero) return;
      const key = `${String(mesNumero).padStart(2, "0")}/${meta.ano}`;
      map.set(key, (map.get(key) || 0) + Number(meta.valor_meta || 0));
    });
  return map;
};

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
    if (!startDate || !endDate) {
      return [];
    }
    const [seguros, metas] = await Promise.all([getSeguros(), getMetas()]);
    const metasMensais = metas.filter(
      (meta) =>
        (meta.tipo_meta || "Mensal") === "Mensal" &&
        (!meta.corretor || meta.corretor === CORRETORA_GERAL),
    );
    const metaMap = buildMetaMonthlyMap(metasMensais);
    const meses = buildMonthRange(startDate, endDate);
    const vendasMap = buildMonthlyTotals(seguros, meses);

    const start = getMonthStart(startDate);
    const end = getMonthStart(endDate);
    const anoAnteriorMap = new Map<string, number>();
    if (start && end) {
      const mesesAnt = meses.map((mes) => {
        const [mm, yyyy] = mes.split("/");
        return `${mm}/${Number(yyyy) - 1}`;
      });
      const anoAntTotals = buildMonthlyTotals(seguros, mesesAnt);
      meses.forEach((mes) => {
        const [mm, yyyy] = mes.split("/");
        const keyAnt = `${mm}/${Number(yyyy) - 1}`;
        anoAnteriorMap.set(mes, anoAntTotals.get(keyAnt) || 0);
      });
    }

    return meses.map((mes) => ({
      mes,
      vendas: vendasMap.get(mes) || 0,
      meta: metaMap.get(mes) || 0,
      ano_anterior: anoAnteriorMap.get(mes) || 0,
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

  async getMetas(): Promise<MetaApi[]> {
    return getMetas();
  }

  async getMetasComProgresso(): Promise<MetaApi[]> {
    const [metas, seguros] = await Promise.all([getMetas(), getSeguros()]);
    return metas.map((meta) => ({
      ...meta,
      valor_atingido: calcularRealizadoMeta(meta, seguros),
    }));
  }

  async getMetasMensaisGrafico(ano?: number) {
    const alvoAno = ano ?? new Date().getFullYear();
    const [metas, seguros] = await Promise.all([getMetas(), getSeguros()]);
    const metasMensais = metas.filter(
      (meta) => (meta.tipo_meta || "Mensal") === "Mensal",
    );
    const metasCorretora = metasMensais.filter(
      (meta) => !meta.corretor || meta.corretor === CORRETORA_GERAL,
    );
    return MESES.map((mes, index) => {
      const metaTotal = metasCorretora
        .filter((meta) => meta.ano === alvoAno && meta.mes === mes)
        .reduce((acc, meta) => acc + Number(meta.valor_meta || 0), 0);
      const realizado = seguros.reduce((acc, seguro) => {
        const data = getSeguroDate(seguro);
        if (!data) return acc;
        if (data.getFullYear() !== alvoAno) return acc;
        if (data.getMonth() !== index) return acc;
        return acc + (Number(seguro.valor_do_seguro) || 0);
      }, 0);
      const hoje = new Date();
      const isFuturo =
        alvoAno > hoje.getFullYear() ||
        (alvoAno === hoje.getFullYear() && index > hoje.getMonth());
      const status = isFuturo
        ? "em-andamento"
        : realizado >= metaTotal && metaTotal > 0
          ? "atingida"
          : "nao-atingida";
      return { mes, meta: metaTotal, realizado, status };
    });
  }

  async getMetasAnuaisGrafico(ano?: number) {
    const alvoAno = ano ?? new Date().getFullYear();
    const [metas, seguros] = await Promise.all([getMetas(), getSeguros()]);
    const metasAnuais = metas.filter(
      (meta) => (meta.tipo_meta || "Mensal") === "Anual",
    );
    const metaTotal = metasAnuais
      .filter((meta) => meta.ano === alvoAno)
      .reduce((acc, meta) => acc + Number(meta.valor_meta || 0), 0);
    const realizado = seguros.reduce((acc, seguro) => {
      const data = getSeguroDate(seguro);
      if (!data) return acc;
      if (data.getFullYear() !== alvoAno) return acc;
      return acc + (Number(seguro.valor_do_seguro) || 0);
    }, 0);
    const status =
      realizado >= metaTotal && metaTotal > 0 ? "atingida" : "nao-atingida";
    return { ano: alvoAno, meta: metaTotal, realizado, status };
  }

  async getMetasPorCorretorRanking(startDate?: string, endDate?: string) {
    const [ranking, metas] = await Promise.all([
      this.getRankingDeCorretores(startDate, endDate),
      getMetas(),
    ]);
    const metasMensais = metas.filter(
      (meta) =>
        (meta.tipo_meta || "Mensal") === "Mensal" &&
        isMetaInRange(meta, startDate, endDate),
    );
    const agregadas = new Map<string, number>();
    metasMensais.forEach((meta) => {
      if (!meta.corretor || meta.corretor === CORRETORA_GERAL) return;
      const key = meta.corretor;
      agregadas.set(key, (agregadas.get(key) || 0) + Number(meta.valor_meta || 0));
    });
    return (ranking || []).map((item: any, idx: number) => {
      const nome = item.corretor || "Sem Nome";
      const meta = agregadas.get(nome) || 0;
      return {
        id: idx + 1,
        nome,
        vendas: item.valor || 0,
        meta,
      };
    });
  }

  async getMetasMensaisPorCategoria(startDate?: string, endDate?: string) {
    const metas = await getMetas();
    const metasMensais = metas.filter(
      (meta) =>
        (meta.tipo_meta || "Mensal") === "Mensal" &&
        (!meta.corretor || meta.corretor === CORRETORA_GERAL) &&
        isMetaInRange(meta, startDate, endDate),
    );
    const totais: Record<string, number> = {};
    metasMensais.forEach((meta) => {
      const categoria = (meta.categoria || "Outros").toLowerCase();
      const key =
        categoria === "auto" ||
        categoria === "vida" ||
        categoria === "residencial" ||
        categoria === "empresarial" ||
        categoria === "carga"
          ? categoria
          : "outros";
      totais[key] = (totais[key] || 0) + Number(meta.valor_meta || 0);
    });
    return totais;
  }

  async getMetasMensaisPorCategoriaCorretor(
    startDate?: string,
    endDate?: string,
  ) {
    const metas = await getMetas();
    const metasMensais = metas.filter(
      (meta) =>
        (meta.tipo_meta || "Mensal") === "Mensal" &&
        meta.corretor &&
        meta.corretor !== CORRETORA_GERAL &&
        isMetaInRange(meta, startDate, endDate),
    );
    const totais: Record<string, Record<string, number>> = {};
    metasMensais.forEach((meta) => {
      const corretor = meta.corretor || "Sem Nome";
      const categoria = (meta.categoria || "Outros").toLowerCase();
      const key =
        categoria === "auto" ||
        categoria === "vida" ||
        categoria === "residencial" ||
        categoria === "empresarial" ||
        categoria === "carga"
          ? categoria
          : "outros";
      if (!totais[corretor]) {
        totais[corretor] = {};
      }
      totais[corretor][key] =
        (totais[corretor][key] || 0) + Number(meta.valor_meta || 0);
    });
    return totais;
  }
}
