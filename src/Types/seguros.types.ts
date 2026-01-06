export interface seguro {
  tipo_seguro: "Auto" | "Residencial" | "Empresarial" | "Vida" | "Viagem" | "Outros";
  numero_apolice: string;
  status_segurado: "Ativo" | "Inativo" | "Cancelado" | "Suspenso" | "Vencido";
  segurado: string;
  seguradora: string;
  corretor_responsavel: string;
  veiculo?: string;
  inicio_vigencia: string;
  fim_vigencia: string;
  valor_premio: number;
  valor_franquia: number;
  forma_pagamento: "À Vista" | "Mensal" | "Trimestral" | "Semestral" | "Anual";
  situacao_pagamento: "Pendente" | "Pago" | "Atrasado" | "Cancelado";
  creation?: string;
  modified?: string;
  modified_by?: string;
  owner?: string;
  docstatus?: number;
  idx?: number;
  name?: string;
  doctype?: string;
}