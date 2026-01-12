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
    isAsync?: boolean;
};

export const camposSeguros: Field[] = [
    // Dados do Seguro
    {
        fieldname: 'tipo_seguro',
        label: 'Tipo de Seguro',
        fieldtype: 'Select',
        required: true,
        options: ['Auto', 'Residencial', 'Empresarial', 'Vida', 'Viagem', 'Outros'],
        section: 'Dados do Seguro'
    },
    {
        fieldname: 'numero_apolice',
        label: 'Número da Apólice',
        fieldtype: 'text',
        placeholder: 'Digite o número da apólice',
        required: true,
        section: 'Dados do Seguro'
    },
    {
        fieldname: 'status_segurado',
        label: 'Status do Seguro',
        fieldtype: 'Select',
        required: true,
        defaultValue: 'Ativo',
        options: ['Ativo', 'Inativo', 'Cancelado', 'Suspenso', 'Vencido'],
        section: 'Dados do Seguro'
    },
    
    // Partes Envolvidas
    {
        fieldname: 'segurado',
        label: 'Segurado',
        fieldtype: 'Select',
        required: true,
        options: [],
        section: 'Partes Envolvidas'
    },
    {
        fieldname: 'seguradora',
        label: 'Seguradora',
        fieldtype: 'Select',
        required: true,
        options: [],
        section: 'Partes Envolvidas'
    },
    {
        fieldname: 'corretor_responsavel',
        label: 'Corretor Responsável',
        fieldtype: 'Select',
        required: true,
        options: [],
        section: 'Partes Envolvidas'
    },
    {
        fieldname: 'veiculo',
        label: 'Veículo (Opcional)',
        fieldtype: 'Select',
        required: false,
        options: [],
        section: 'Partes Envolvidas'
    },
    
    // Vigência
    {
        fieldname: 'inicio_vigencia',
        label: 'Início da Vigência',
        fieldtype: 'Date',
        placeholder: 'DD/MM/AAAA',
        required: true,
        section: 'Vigência'
    },
    {
        fieldname: 'fim_vigencia',
        label: 'Fim da Vigência',
        fieldtype: 'Date',
        placeholder: 'DD/MM/AAAA',
        required: true,
        section: 'Vigência'
    },
    
    // Valores
    {
        fieldname: 'valor_premio',
        label: 'Valor do Prêmio',
        fieldtype: 'Float',
        placeholder: '0.00',
        required: true,
        section: 'Valores'
    },
    {
        fieldname: 'valor_franquia',
        label: 'Valor da Franquia',
        fieldtype: 'Float',
        placeholder: '0.00',
        required: true,
        section: 'Valores'
    },
    {
        fieldname: 'forma_pagamento',
        label: 'Forma de Pagamento',
        fieldtype: 'Select',
        required: true,
        options: ['À Vista', 'Mensal', 'Trimestral', 'Semestral', 'Anual'],
        section: 'Valores'
    },
    {
        fieldname: 'situacao_pagamento',
        label: 'Situação do Pagamento',
        fieldtype: 'Select',
        required: true,
        defaultValue: 'Em Dia',
        options: ['Em Dia', 'Pendente', 'Atrasado', 'Cancelado'],
        section: 'Valores'
    }
];
