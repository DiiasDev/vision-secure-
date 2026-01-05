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

export const secoesVeiculos: FormSection[] = [
    {
        title: 'Dados do Veículo',
        fields: [
            {
                name: 'tipoVeiculo',
                label: 'Tipo de Veículo',
                type: 'select',
                required: true,
                fullWidth: false,
                options: [
                    { value: 'Carro', label: 'Carro' },
                    { value: 'Moto', label: 'Moto' },
                    { value: 'Caminhão', label: 'Caminhão' },
                    { value: 'Utilitário', label: 'Utilitário' },
                    { value: 'Outro', label: 'Outro' }
                ]
            },
            {
                name: 'marca',
                label: 'Marca',
                type: 'text',
                placeholder: 'Digite a marca do veículo',
                required: true,
                fullWidth: false
            },
            {
                name: 'modelo',
                label: 'Modelo',
                type: 'text',
                placeholder: 'Digite o modelo do veículo',
                required: true,
                fullWidth: false
            },
            {
                name: 'cor',
                label: 'Cor',
                type: 'text',
                placeholder: 'Digite a cor do veículo',
                required: true,
                fullWidth: false
            },
            {
                name: 'anoFabricacao',
                label: 'Ano de Fabricação',
                type: 'number',
                placeholder: '2020',
                required: true,
                fullWidth: false
            },
            {
                name: 'anoModelo',
                label: 'Ano do Modelo',
                type: 'number',
                placeholder: '2021',
                required: true,
                fullWidth: false
            }
        ]
    },
    {
        title: 'Identificação',
        fields: [
            {
                name: 'placa',
                label: 'Placa',
                type: 'text',
                placeholder: 'ABC-1234',
                required: true,
                fullWidth: false
            },
            {
                name: 'renavam',
                label: 'RENAVAM',
                type: 'text',
                placeholder: 'Digite o RENAVAM',
                required: true,
                fullWidth: false
            },
            {
                name: 'combustivel',
                label: 'Combustível',
                type: 'select',
                required: true,
                fullWidth: false,
                options: [
                    { value: 'Gasolina', label: 'Gasolina' },
                    { value: 'Etanol', label: 'Etanol' },
                    { value: 'Flex', label: 'Flex' },
                    { value: 'Diesel', label: 'Diesel' },
                    { value: 'Elétrico', label: 'Elétrico' },
                    { value: 'Híbrido', label: 'Híbrido' }
                ]
            }
        ]
    },
    {
        title: 'Uso do Veículo',
        fields: [
            {
                name: 'usoVeiculo',
                label: 'Uso do Veículo',
                type: 'select',
                required: true,
                fullWidth: false,
                options: [
                    { value: 'Particular', label: 'Particular' },
                    { value: 'Comercial', label: 'Comercial' },
                    { value: 'Aplicativo', label: 'Aplicativo' },
                    { value: 'Frota', label: 'Frota' }
                ]
            }
        ]
    }
];
