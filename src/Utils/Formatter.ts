/**
 * Formata uma data para o padrão brasileiro (dd/mm/yyyy)
 * @param dateString - String da data a ser formatada
 * @returns Data formatada ou 'N/A' se inválida
 */
export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  
  // Se a data está no formato YYYY-MM-DD, criar a data manualmente para evitar problemas de timezone
  if (dateString.includes('-') && dateString.length === 10) {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('pt-BR');
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('pt-BR');
}

/**
 * Formata um número de telefone brasileiro
 * @param phone - Número de telefone a ser formatado
 * @returns Telefone formatado (xx) xxxxx-xxxx ou 'N/A'
 */
export function formatPhone(phone: string): string {
  if (!phone) return 'N/A';
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Formata um CPF brasileiro
 * @param cpf - CPF a ser formatado
 * @returns CPF formatado xxx.xxx.xxx-xx ou 'N/A'
 */
export function formatCPF(cpf: string): string {
  if (!cpf) return 'N/A';
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }
  return cpf;
}

/**
 * Formata um CNPJ brasileiro
 * @param cnpj - CNPJ a ser formatado
 * @returns CNPJ formatado xx.xxx.xxx/xxxx-xx ou 'N/A'
 */
export function formatCNPJ(cnpj: string): string {
  if (!cnpj) return 'N/A';
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length === 14) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
  }
  return cnpj;
}

/**
 * Formata um CEP brasileiro
 * @param cep - CEP a ser formatado
 * @returns CEP formatado xxxxx-xxx ou 'N/A'
 */
export function formatCEP(cep: string): string {
  if (!cep) return 'N/A';
  const cleaned = cep.replace(/\D/g, '');
  
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
  return cep;
}

/**
 * Formata um valor monetário em Real brasileiro
 * @param value - Valor a ser formatado
 * @param decimals - Número de casas decimais (padrão: 2)
 * @returns Valor formatado R$ x.xxx,xx
 */
export function formatCurrency(
  value: number | string | null | undefined,
  decimals: number = 2
): string {
  const numValue =
    typeof value === 'string' ? parseFloat(value) : value ?? 0;
  
  if (isNaN(numValue)) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue);
}

/**
 * Formata um valor monetário em Real brasileiro (atalho para formatCurrency)
 * @param value - Valor a ser formatado
 * @param decimals - Número de casas decimais (padrão: 2)
 * @returns Valor formatado R$ x.xxx,xx
 */
export function formatNumber(value: number | string, decimals: number = 2): string {
  return formatCurrency(value, decimals);
}

/**
 * Limpa caracteres especiais de uma string, mantendo apenas números
 * @param value - String a ser limpa
 * @returns String apenas com números
 */
export function cleanNumericString(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Trunca um texto adicionando reticências
 * @param text - Texto a ser truncado
 * @param maxLength - Tamanho máximo do texto
 * @returns Texto truncado
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
