import { frappe } from "./frappeClient";

export interface MetaApi {
  name?: string;
  corretor: string;
  mes: string;
  ano: number;
  categoria?: string;
  tipo_meta?: "Mensal" | "Anual";
  valor_meta: number;
  valor_atingido?: number;
}

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

const META_FIELDS_WITH_TIPO = [
  "name",
  "corretor",
  "mes",
  "ano",
  "categoria",
  "tipo_meta",
  "valor_meta",
  "valor_atingido",
  "creation",
  "modified",
];

const META_FIELDS_WITHOUT_TIPO = META_FIELDS_WITH_TIPO.filter(
  (field) => field !== "tipo_meta",
);

let supportsTipoMeta: boolean | null = null;

const isTipoMetaFieldError = (error: any) => {
  const exception = error?.response?.data?.exception || "";
  return (
    typeof exception === "string" &&
    exception.includes("Field not permitted in query") &&
    exception.includes("tipo_meta")
  );
};

export const getTipoMetaSupport = () => supportsTipoMeta;

const sanitizePayload = (dados: MetaApi) => {
  const payload: Record<string, any> = { ...dados };
  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });
  if (supportsTipoMeta === false) {
    delete payload.tipo_meta;
  }
  return payload;
};

export async function getMetas(): Promise<MetaApi[]> {
  try {
    const response = await frappe.get("/resource/Metas", {
      params: {
        fields: JSON.stringify(META_FIELDS_WITH_TIPO),
        order_by: "creation desc",
      },
    });
    supportsTipoMeta = true;
    return response.data?.data || [];
  } catch (error: any) {
    if (isTipoMetaFieldError(error)) {
      supportsTipoMeta = false;
      try {
        const response = await frappe.get("/resource/Metas", {
          params: {
            fields: JSON.stringify(META_FIELDS_WITHOUT_TIPO),
            order_by: "creation desc",
          },
        });
        return response.data?.data || [];
      } catch (fallbackError) {
        console.error("Erro ao listar metas:", fallbackError);
        throw fallbackError;
      }
    }
    console.error("Erro ao listar metas:", error);
    throw error;
  }
}

export async function getMetasMensaisCorretora(
  startDate?: string,
  endDate?: string,
): Promise<Record<string, number>> {
  const metas = await getMetas();
  const metasMensais = metas.filter(
    (meta) =>
      (meta.tipo_meta || "Mensal") === "Mensal" &&
      (!meta.corretor || meta.corretor === "Corretora") &&
      isMetaInRange(meta, startDate, endDate),
  );
  const totals: Record<string, number> = {};
  metasMensais.forEach((meta) => {
    const mesNumero = monthNameToNumber(meta.mes);
    if (!mesNumero) return;
    const key = `${String(mesNumero).padStart(2, "0")}/${meta.ano}`;
    totals[key] = (totals[key] || 0) + Number(meta.valor_meta || 0);
  });
  return totals;
}

export async function newMeta(dados: MetaApi): Promise<MetaApi> {
  try {
    if (supportsTipoMeta === false && dados.tipo_meta === "Anual") {
      throw new Error(
        "Backend sem campo tipo_meta. Rode o migrate do Frappe para usar metas anuais.",
      );
    }
    const response = await frappe.post(
      "/resource/Metas",
      sanitizePayload(dados),
    );
    return response.data?.data;
  } catch (error: any) {
    if (isTipoMetaFieldError(error)) {
      supportsTipoMeta = false;
      try {
        const response = await frappe.post(
          "/resource/Metas",
          sanitizePayload(dados),
        );
        return response.data?.data;
      } catch (fallbackError) {
        console.error("Erro ao cadastrar meta:", fallbackError);
        throw fallbackError;
      }
    }
    console.error("Erro ao cadastrar meta:", error);
    throw error;
  }
}

export async function atualizarMeta(
  name: string,
  dados: Partial<MetaApi>,
): Promise<MetaApi> {
  try {
    const response = await frappe.put(
      `/resource/Metas/${name}`,
      sanitizePayload(dados as MetaApi),
    );
    return response.data?.data;
  } catch (error: any) {
    if (isTipoMetaFieldError(error)) {
      supportsTipoMeta = false;
      try {
        const response = await frappe.put(
          `/resource/Metas/${name}`,
          sanitizePayload(dados as MetaApi),
        );
        return response.data?.data;
      } catch (fallbackError) {
        console.error("Erro ao atualizar meta:", fallbackError);
        throw fallbackError;
      }
    }
    console.error("Erro ao atualizar meta:", error);
    throw error;
  }
}

export async function deletarMeta(name: string): Promise<void> {
  try {
    await frappe.post("/method/frappe.client.delete", {
      doctype: "Metas",
      name,
      force: 1,
    });
  } catch (error: any) {
    console.error("Erro ao deletar meta:", error);
    throw error;
  }
}
