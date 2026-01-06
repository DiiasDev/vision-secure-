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

export const fieldsSegurados: Field[] = [
  // Dados do Segurado
  {
    fieldname: "nome_completo",
    label: "Nome Completo",
    fieldtype: "text",
    placeholder: "Digite o nome completo",
    required: true,
    section: "Dados do Segurado",
    fullWidth: true,
  },
  {
    fieldname: "tipo_pessoa",
    label: "Tipo de Pessoa",
    fieldtype: "Select",
    required: true,
    section: "Dados do Segurado",
    options: ["Física", "Jurídica"],
  },
  {
    fieldname: "data_nascimento",
    label: "Data de Nascimento",
    fieldtype: "Date",
    placeholder: "DD/MM/AAAA",
    required: true,
    section: "Dados do Segurado",
  },
  // Contato
  {
    fieldname: "telefone",
    label: "Telefone",
    fieldtype: "tel",
    placeholder: "(00) 00000-0000",
    required: true,
    section: "Contato",
  },
  {
    fieldname: "whatsapp",
    label: "WhatsApp",
    fieldtype: "tel",
    placeholder: "(00) 00000-0000",
    required: false,
    section: "Contato",
  },
  {
    fieldname: "email",
    label: "E-mail",
    fieldtype: "email",
    placeholder: "exemplo@email.com",
    required: true,
    section: "Contato",
    fullWidth: true,
  },
  // Documentos
  {
    fieldname: "cpf",
    label: "CPF",
    fieldtype: "text",
    placeholder: "000.000.000-00",
    required: true,
    section: "Documentos",
  },
  {
    fieldname: "rg",
    label: "RG",
    fieldtype: "text",
    placeholder: "Digite o RG",
    required: false,
    section: "Documentos",
  },
];
