type Field = {
  fieldname: string;
  label: string;
  fieldtype: string;
  required?: boolean;
  options?: string[] | string;
  section?: string;
  placeholder?: string;
  defaultValue?: string;
  fullWidth?: boolean;
};

export const fieldsVeiculos: Field[] = [
  // Dados do Veículo
  {
    fieldname: "tipo_veiculo",
    label: "Tipo de Veículo",
    fieldtype: "Select",
    required: true,
    section: "Dados do Veículo",
    options: ["Carro", "Moto", "Caminhão", "Utilitário", "Outro"],
  },
  {
    fieldname: "marca",
    label: "Marca",
    fieldtype: "Select",
    required: true,
    section: "Dados do Veículo",
    options: [
      "Volkswagen",
      "Fiat",
      "Chevrolet",
      "Ford",
      "Toyota",
      "Honda",
      "Renault",
      "Hyundai",
      "Nissan",
      "Jeep",
      "Peugeot",
      "Citroen",
      "Audi",
      "BMW",
      "Mercedes-Benz",
      "Volvo",
      "Land Rover",
      "Mitsubishi",
      "Kia",
      "Outros"
    ],
  },
  {
    fieldname: "modelo",
    label: "Modelo",
    fieldtype: "text",
    placeholder: "Digite o modelo do veículo",
    required: true,
    section: "Dados do Veículo",
  },
  {
    fieldname: "cor",
    label: "Cor",
    fieldtype: "text",
    placeholder: "Digite a cor do veículo",
    required: true,
    section: "Dados do Veículo",
  },
  {
    fieldname: "ano_fabricacao",
    label: "Ano de Fabricação",
    fieldtype: "number",
    placeholder: "2020",
    required: true,
    section: "Dados do Veículo",
  },
  {
    fieldname: "ano_modelo",
    label: "Ano do Modelo",
    fieldtype: "number",
    placeholder: "2021",
    required: true,
    section: "Dados do Veículo",
  },
  // Identificação
  {
    fieldname: "placa",
    label: "Placa",
    fieldtype: "text",
    placeholder: "ABC-1234",
    required: true,
    section: "Identificação",
  },
  {
    fieldname: "renavam",
    label: "RENAVAM",
    fieldtype: "text",
    placeholder: "Digite o RENAVAM",
    required: true,
    section: "Identificação",
  },
  {
    fieldname: "combustivel",
    label: "Combustível",
    fieldtype: "Select",
    required: true,
    section: "Identificação",
    options: ["Gasolina", "Etanol", "Flex", "Diesel", "Elétrico", "Híbrido"],
  },
  // Uso do Veículo
  {
    fieldname: "uso_veiculo",
    label: "Uso do Veículo",
    fieldtype: "Select",
    required: true,
    section: "Uso do Veículo",
    options: ["Particular", "Comercial", "Aplicativo", "Frota"],
  },
];
