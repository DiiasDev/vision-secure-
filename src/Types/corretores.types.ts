export interface corretor {
  nome_completo: string;
  cargo: string;
  data_nascimento: string;
  status: "Ativo" | "Inativo" | "Suspenso";
  telefone: string;
  whatsapp?: string;
  email_principal: string;
  cpf: string;
  rg?: string;
  susep?: string;
  cep: string;
  endereco: string;
  cidade: string;
  estado: string;
  corretor_principal: 0 | 1;
  ativo_no_sistema: 0 | 1;
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