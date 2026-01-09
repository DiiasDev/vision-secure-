export interface seguro {
  tipo_seguro: "Auto" | "Residencial" | "Empresarial" | "Vida" | "Viagem" | "Outros";
  numero_apolice: string;
  status_segurado: "Ativo" | "Inativo" | "Cancelado" | "Suspenso" | "Vencido";
  segurado: string;
  segurado_nome?: string; // Nome completo do segurado (enriquecido)
  segurado_cpf?: string; // CPF do segurado (enriquecido)
  segurado_telefone?: string; // Telefone do segurado (enriquecido)
  segurado_whatsapp?: string; // WhatsApp do segurado (enriquecido)
  seguradora: string;
  seguradora_nome?: string; // Nome da seguradora (enriquecido)
  seguradora_logo?: string; // Logo da seguradora (enriquecido)
  corretor_responsavel: string;
  corretor_nome?: string; // Nome do corretor (enriquecido)
  veiculo?: string;
  veiculo_marca?: string; // Marca do veículo (enriquecido)
  veiculo_modelo?: string; // Modelo do veículo (enriquecido)
  veiculo_placa?: string; // Placa do veículo (enriquecido)
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