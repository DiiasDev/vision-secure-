interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' | 'url' | 'select' | 'file' | 'date';
    placeholder?: string;
    required?: boolean;
    defaultValue?: string;
    options?: { value: string; label: string }[];
    fullWidth?: boolean;
    accept?: string;
    isAsync?: boolean; // Para indicar que as opções virão do backend
}

interface FormSection {
    title: string;
    fields: FormField[];
}

export const secoesSeguros: FormSection[] = [
    {
        title: 'Dados do Seguro',
        fields: [
            {
                name: 'tipoSeguro',
                label: 'Tipo de Seguro',
                type: 'select',
                required: true,
                fullWidth: false,
                options: [
                    { value: 'Auto', label: 'Auto' },
                    { value: 'Residencial', label: 'Residencial' },
                    { value: 'Empresarial', label: 'Empresarial' },
                    { value: 'Vida', label: 'Vida' },
                    { value: 'Viagem', label: 'Viagem' },
                    { value: 'Outros', label: 'Outros' }
                ]
            },
            {
                name: 'numeroApolice',
                label: 'Número da Apólice',
                type: 'text',
                placeholder: 'Digite o número da apólice',
                required: true,
                fullWidth: false
            },
            {
                name: 'statusSegurado',
                label: 'Status do Seguro',
                type: 'select',
                required: true,
                defaultValue: 'Ativo',
                fullWidth: false,
                options: [
                    { value: 'Ativo', label: 'Ativo' },
                    { value: 'Inativo', label: 'Inativo' },
                    { value: 'Cancelado', label: 'Cancelado' },
                    { value: 'Suspenso', label: 'Suspenso' },
                    { value: 'Vencido', label: 'Vencido' }
                ]
            }
        ]
    },
    {
        title: 'Partes Envolvidas',
        fields: [
            {
                name: 'segurado',
                label: 'Segurado',
                type: 'select',
                required: true,
                fullWidth: false,
                isAsync: true,
                options: [
                    // Opções virão do backend
                ]
            },
            {
                name: 'seguradora',
                label: 'Seguradora',
                type: 'select',
                required: true,
                fullWidth: false,
                isAsync: true,
                options: [
                    // Opções virão do backend
                ]
            },
            {
                name: 'corretorResponsavel',
                label: 'Corretor Responsável',
                type: 'select',
                required: true,
                fullWidth: false,
                isAsync: true,
                options: [
                    // Opções virão do backend
                ]
            },
            {
                name: 'veiculo',
                label: 'Veículo',
                type: 'select',
                required: false,
                fullWidth: false,
                isAsync: true,
                options: [
                    // Opções virão do backend
                ]
            }
        ]
    },
    {
        title: 'Vigência',
        fields: [
            {
                name: 'inicioVigencia',
                label: 'Início da Vigência',
                type: 'date',
                placeholder: 'DD/MM/AAAA',
                required: true,
                fullWidth: false
            },
            {
                name: 'fimVigencia',
                label: 'Fim da Vigência',
                type: 'date',
                placeholder: 'DD/MM/AAAA',
                required: true,
                fullWidth: false
            }
        ]
    },
    {
        title: 'Valores',
        fields: [
            {
                name: 'valorPremio',
                label: 'Valor do Prêmio',
                type: 'number',
                placeholder: '0.00',
                required: true,
                fullWidth: false
            },
            {
                name: 'valorFranquia',
                label: 'Valor da Franquia',
                type: 'number',
                placeholder: '0.00',
                required: true,
                fullWidth: false
            },
            {
                name: 'formaPagamento',
                label: 'Forma de Pagamento',
                type: 'select',
                required: true,
                fullWidth: false,
                options: [
                    { value: 'À Vista', label: 'À Vista' },
                    { value: 'Mensal', label: 'Mensal' },
                    { value: 'Trimestral', label: 'Trimestral' },
                    { value: 'Semestral', label: 'Semestral' },
                    { value: 'Anual', label: 'Anual' }
                ]
            },
            {
                name: 'situacaoPagamento',
                label: 'Situação do Pagamento',
                type: 'select',
                required: true,
                defaultValue: 'Pendente',
                fullWidth: false,
                options: [
                    { value: 'Pendente', label: 'Pendente' },
                    { value: 'Pago', label: 'Pago' },
                    { value: 'Atrasado', label: 'Atrasado' },
                    { value: 'Cancelado', label: 'Cancelado' }
                ]
            }
        ]
    }
];
