interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' | 'url' | 'select' | 'file';
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

export const secoesSeguradoras: FormSection[] = [
    {
        title: 'Dados da Seguradora',
        fields: [
            {
                name: 'nomeSeguradora',
                label: 'Nome da Seguradora',
                type: 'text',
                placeholder: 'Digite o nome da seguradora',
                required: true,
                fullWidth: false
            },
            {
                name: 'codigoInterno',
                label: 'Código Interno',
                type: 'text',
                placeholder: 'Código usado para integração ou controle interno',
                fullWidth: false
            },
            {
                name: 'status',
                label: 'Status',
                type: 'select',
                required: true,
                defaultValue: 'Ativa',
                fullWidth: false,
                options: [
                    { value: 'Ativa', label: 'Ativa' },
                    { value: 'Inativa', label: 'Inativa' },
                    { value: 'Suspensa', label: 'Suspensa' }
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
                placeholder: 'Digite o telefone',
                fullWidth: false
            },
            {
                name: 'site',
                label: 'Site',
                type: 'url',
                placeholder: 'https://www.exemplo.com.br',
                fullWidth: false
            },
            {
                name: 'email',
                label: 'E-mail',
                type: 'email',
                placeholder: 'contato@seguradora.com.br',
                fullWidth: true
            }
        ]
    },
    {
        title: 'Identidade Visual',
        fields: [
            {
                name: 'logoSeguradora',
                label: 'Logo da Seguradora',
                type: 'file',
                placeholder: 'URL ou caminho do logo',
                accept: 'image/*',
                fullWidth: true
            }
        ]
    },
    {
        title: 'Observações Internas',
        fields: [
            {
                name: 'observacoes',
                label: 'Observações',
                type: 'textarea',
                placeholder: 'Adicione observações internas sobre a seguradora',
                fullWidth: true
            }
        ]
    }
];
