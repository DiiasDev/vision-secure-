export interface segurado {
    cpf: string;
    creation: string;
    data_nascimento: string;
    docstatus: number;
    doctype: string;
    email: string;
    idx: number;
    modified: string;
    modified_by: string;
    name: string;
    nome_completo: string;
    owner: string;
    rg: string;
    telefone: string;
    tipo_pessoa: string;
    whatsapp: string;
    corretor?: string; // ID do corretor responsável
}