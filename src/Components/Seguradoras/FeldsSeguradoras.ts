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

export const fieldsSeguradoras: Field[] = [
  // Dados da Seguradora
  {
    fieldname: "nome_seguradora",
    label: "Nome da Seguradora",
    fieldtype: "text",
    placeholder: "Digite o nome da seguradora",
    required: true,
    section: "Dados da Seguradora",
  },
  {
    fieldname: "codigo_interno",
    label: "Código Interno",
    fieldtype: "text",
    placeholder: "Código usado para integração ou controle interno",
    section: "Dados da Seguradora",
  },
  {
    fieldname: "status",
    label: "Status",
    fieldtype: "Select",
    required: true,
    defaultValue: "Ativa",
    section: "Dados da Seguradora",
    options: ["Ativa", "Inativa", "Suspensa"],
  },
  // Contato
  {
    fieldname: "telefone",
    label: "Telefone",
    fieldtype: "tel",
    placeholder: "Digite o telefone",
    section: "Contato",
  },
  {
    fieldname: "site",
    label: "Site",
    fieldtype: "text",
    placeholder: "https://www.exemplo.com.br",
    section: "Contato",
  },
  {
    fieldname: "email",
    label: "E-mail",
    fieldtype: "email",
    placeholder: "contato@seguradora.com.br",
    section: "Contato",
    fullWidth: true,
  },
  // Identidade Visual
  {
    fieldname: "logo_seguradora",
    label: "Logo da Seguradora",
    fieldtype: "Attach Image",
    section: "Identidade Visual",
    fullWidth: true,
  },
  // Observações Internas
  {
    fieldname: "observacoes",
    label: "Observações",
    fieldtype: "Small Text",
    placeholder: "Adicione observações internas sobre a seguradora",
    section: "Observações Internas",
    fullWidth: true,
  },
];
