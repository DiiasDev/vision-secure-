export interface veiculo {
  tipo_veiculo: "Carro" | "Moto" | "Caminhão" | "Utilitário" | "Outro";
  marca: string;
  modelo: string;
  cor: string;
  ano_fabricacao: number;
  ano_modelo: number;
  placa: string;
  renavam: string;
  combustivel: "Gasolina" | "Etanol" | "Flex" | "Diesel" | "Elétrico" | "Híbrido";
  uso_veiculo: "Particular" | "Comercial" | "Aplicativo" | "Frota";
  creation?: string;
  modified?: string;
  modified_by?: string;
  owner?: string;
  docstatus?: number;
  idx?: number;
  name?: string;
  doctype?: string;
}