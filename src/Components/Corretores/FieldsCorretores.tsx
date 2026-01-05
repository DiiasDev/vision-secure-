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
}

interface FormSection {
    title: string;
    fields: FormField[];
}

export const secoesCorretores: FormSection[] = [
    {
        title: 'Dados do Corretor',
        fields: [
            {
                name: 'nomeCompleto',
                label: 'Nome Completo',
                type: 'text',
                placeholder: 'Digite o nome completo',
                required: true,
                fullWidth: true
            },
            {
                name: 'cargo',
                label: 'Cargo',
                type: 'text',
                placeholder: 'Digite o cargo',
                required: true,
                fullWidth: false
            },
            {
                name: 'dataNascimento',
                label: 'Data de Nascimento',
                type: 'date',
                placeholder: 'DD/MM/AAAA',
                required: true,
                fullWidth: false
            },
            {
                name: 'status',
                label: 'Status',
                type: 'select',
                required: true,
                defaultValue: 'Ativo',
                fullWidth: false,
                options: [
                    { value: 'Ativo', label: 'Ativo' },
                    { value: 'Inativo', label: 'Inativo' },
                    { value: 'Suspenso', label: 'Suspenso' }
                ]
            }
        ]
    },
    {
        title: 'Contato',
        fields: [
            {
                name: 'telefone',
                label: 'Telefone',
                type: 'tel',
                placeholder: '(00) 00000-0000',
                required: true,
                fullWidth: false
            },
            {
                name: 'whatsapp',
                label: 'WhatsApp',
                type: 'tel',
                placeholder: '(00) 00000-0000',
                fullWidth: false
            },
            {
                name: 'emailPrincipal',
                label: 'E-mail Principal',
                type: 'email',
                placeholder: 'exemplo@email.com',
                required: true,
                fullWidth: true
            }
        ]
    },
    {
        title: 'Documentos',
        fields: [
            {
                name: 'cpf',
                label: 'CPF',
                type: 'text',
                placeholder: '000.000.000-00',
                required: true,
                fullWidth: false
            },
            {
                name: 'rg',
                label: 'RG',
                type: 'text',
                placeholder: 'Digite o RG',
                fullWidth: false
            },
            {
                name: 'susep',
                label: 'SUSEP',
                type: 'text',
                placeholder: 'Digite o número SUSEP',
                required: false,
                fullWidth: false
            }
        ]
    },
    {
        title: 'Endereço',
        fields: [
            {
                name: 'cep',
                label: 'CEP',
                type: 'text',
                placeholder: '00000-000',
                required: true,
                fullWidth: false
            },
            {
                name: 'endereco',
                label: 'Endereço',
                type: 'text',
                placeholder: 'Rua, Número',
                required: true,
                fullWidth: false
            },
            {
                name: 'cidade',
                label: 'Cidade',
                type: 'text',
                placeholder: 'Digite a cidade',
                required: true,
                fullWidth: false
            },
            {
                name: 'estado',
                label: 'Estado',
                type: 'text',
                placeholder: 'Digite o estado',
                required: true,
                fullWidth: false
            }
        ]
    },
    {
        title: 'Configurações',
        fields: [
            {
                name: 'corretorPrincipal',
                label: 'Corretor Principal',
                type: 'select',
                required: true,
                defaultValue: '0',
                fullWidth: false,
                options: [
                    { value: '0', label: 'Não' },
                    { value: '1', label: 'Sim' }
                ]
            },
            {
                name: 'ativoNoSistema',
                label: 'Ativo no Sistema',
                type: 'select',
                required: true,
                defaultValue: '1',
                fullWidth: false,
                options: [
                    { value: '1', label: 'Sim' },
                    { value: '0', label: 'Não' }
                ]
            }
        ]
    },
    {
        title: 'Observações',
        fields: [
            {
                name: 'observacoes',
                label: 'Observações Gerais',
                type: 'textarea',
                placeholder: 'Adicione observações gerais sobre o corretor',
                fullWidth: true
            },
        ]
    }
];
