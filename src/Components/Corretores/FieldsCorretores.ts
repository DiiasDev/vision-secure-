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

export const camposCorretores: Field[] = [
    // Dados do Corretor
    {
        fieldname: 'nome_completo',
        label: 'Nome Completo',
        fieldtype: 'text',
        placeholder: 'Digite o nome completo',
        required: true,
        fullWidth: true,
        section: 'Dados do Corretor'
    },
    {
        fieldname: 'cargo',
        label: 'Cargo',
        fieldtype: 'text',
        placeholder: 'Digite o cargo',
        required: true,
        section: 'Dados do Corretor'
    },
    {
        fieldname: 'data_nascimento',
        label: 'Data de Nascimento',
        fieldtype: 'Date',
        placeholder: 'DD/MM/AAAA',
        required: true,
        section: 'Dados do Corretor'
    },
    {
        fieldname: 'status',
        label: 'Status',
        fieldtype: 'Select',
        required: true,
        defaultValue: 'Ativo',
        options: ['Ativo', 'Inativo', 'Suspenso'],
        section: 'Dados do Corretor'
    },
    
    // Contato
    {
        fieldname: 'telefone',
        label: 'Telefone',
        fieldtype: 'tel',
        placeholder: '(00) 00000-0000',
        required: true,
        section: 'Contato'
    },
    {
        fieldname: 'whatsapp',
        label: 'WhatsApp',
        fieldtype: 'tel',
        placeholder: '(00) 00000-0000',
        section: 'Contato'
    },
    {
        fieldname: 'email_principal',
        label: 'E-mail Principal',
        fieldtype: 'email',
        placeholder: 'exemplo@email.com',
        required: true,
        fullWidth: true,
        section: 'Contato'
    },
    
    // Documentos
    {
        fieldname: 'cpf',
        label: 'CPF',
        fieldtype: 'text',
        placeholder: '000.000.000-00',
        required: true,
        section: 'Documentos'
    },
    {
        fieldname: 'rg',
        label: 'RG',
        fieldtype: 'text',
        placeholder: 'Digite o RG',
        section: 'Documentos'
    },
    {
        fieldname: 'susep',
        label: 'SUSEP',
        fieldtype: 'text',
        placeholder: 'Digite o número SUSEP',
        section: 'Documentos'
    },
    
    // Endereço
    {
        fieldname: 'cep',
        label: 'CEP',
        fieldtype: 'text',
        placeholder: '00000-000',
        required: true,
        section: 'Endereço'
    },
    {
        fieldname: 'endereco',
        label: 'Endereço',
        fieldtype: 'text',
        placeholder: 'Rua, Número',
        required: true,
        section: 'Endereço'
    },
    {
        fieldname: 'cidade',
        label: 'Cidade',
        fieldtype: 'text',
        placeholder: 'Digite a cidade',
        required: true,
        section: 'Endereço'
    },
    {
        fieldname: 'estado',
        label: 'Estado',
        fieldtype: 'text',
        placeholder: 'Digite o estado',
        required: true,
        section: 'Endereço'
    },
    
    // Configurações
    {
        fieldname: 'corretor_principal',
        label: 'Corretor Principal',
        fieldtype: 'Select',
        required: true,
        defaultValue: 'Não',
        options: ['Não', 'Sim'],
        section: 'Configurações'
    },
    {
        fieldname: 'ativo_no_sistema',
        label: 'Ativo no Sistema',
        fieldtype: 'Select',
        required: true,
        defaultValue: 'Sim',
        options: ['Sim', 'Não'],
        section: 'Configurações'
    },
    
    // Observações
    {
        fieldname: 'observacoes',
        label: 'Observações Gerais',
        fieldtype: 'textarea',
        placeholder: 'Adicione observações gerais sobre o corretor',
        fullWidth: true,
        section: 'Observações'
    }
];
