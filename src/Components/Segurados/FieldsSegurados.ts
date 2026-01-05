interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' | 'date' | 'select';
    placeholder?: string;
    required?: boolean;
    defaultValue?: string;
    options?: { value: string; label: string }[];
    fullWidth?: boolean;
}

interface FormSection {
    title: string;
    fields: FormField[];
}

export const secoesSegurados: FormSection[] = [
    {
        title: 'Dados do Segurado',
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
                name: 'tipoPessoa',
                label: 'Tipo de Pessoa',
                type: 'select',
                required: true,
                options: [
                    { value: 'fisica', label: 'Física' },
                    { value: 'juridica', label: 'Jurídica' }
                ]
            },
            {
                name: 'dataNascimento',
                label: 'Data de Nascimento',
                type: 'date',
                placeholder: 'DD/MM/AAAA',
                required: true
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
                required: true
            },
            {
                name: 'whatsapp',
                label: 'WhatsApp',
                type: 'tel',
                placeholder: '(00) 00000-0000',
                required: false
            },
            {
                name: 'email',
                label: 'E-mail',
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
                required: true
            },
            {
                name: 'rg',
                label: 'RG',
                type: 'text',
                placeholder: 'Digite o RG',
                required: false
            }
        ]
    }
];
