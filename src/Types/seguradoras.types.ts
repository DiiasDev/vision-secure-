export interface seguradora {
  nome_seguradora: string;
  codigo_interno?: string;
  status: "Ativa" | "Inativa" | "Suspensa";
  telefone?: string;
  site?: string;
  email?: string;
  logo_seguradora?: string;
  observacoes?: string;
  creation?: string;
  modified?: string;
  modified_by?: string;
  owner?: string;
  docstatus?: number;
  idx?: number;
  name?: string;
  doctype?: string;
}