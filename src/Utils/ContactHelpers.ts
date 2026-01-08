import { cleanNumericString } from './Formatter';

/**
 * Abre o WhatsApp Web com um número de telefone
 * @param phone - Número de telefone (com ou sem formatação)
 * @param countryCode - Código do país (padrão: 55 - Brasil)
 */
export function openWhatsApp(phone: string, countryCode: string = '55'): void {
  if (!phone) return;
  const cleaned = cleanNumericString(phone);
  window.open(`https://wa.me/${countryCode}${cleaned}`, '_blank');
}

/**
 * Inicia uma chamada telefônica
 * @param phone - Número de telefone
 */
export function makePhoneCall(phone: string): void {
  if (!phone) return;
  window.location.href = `tel:${phone}`;
}

/**
 * Abre o cliente de e-mail com um destinatário
 * @param email - E-mail do destinatário
 * @param subject - Assunto do e-mail (opcional)
 * @param body - Corpo do e-mail (opcional)
 */
export function sendEmail(email: string, subject?: string, body?: string): void {
  if (!email) return;
  
  let mailtoUrl = `mailto:${email}`;
  const params: string[] = [];
  
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  
  if (params.length > 0) {
    mailtoUrl += `?${params.join('&')}`;
  }
  
  window.location.href = mailtoUrl;
}

/**
 * Copia um texto para a área de transferência
 * @param text - Texto a ser copiado
 * @returns Promise<boolean> - true se copiou com sucesso
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Erro ao copiar para área de transferência:', error);
    return false;
  }
}

/**
 * Valida se um telefone brasileiro é válido
 * @param phone - Telefone a ser validado
 * @returns true se válido, false se inválido
 */
export function isValidBrazilianPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = cleanNumericString(phone);
  // Celular: 11 dígitos (DDD + 9 + 8 dígitos)
  // Fixo: 10 dígitos (DDD + 8 dígitos)
  return cleaned.length === 10 || cleaned.length === 11;
}

/**
 * Valida se um CPF é válido
 * @param cpf - CPF a ser validado
 * @returns true se válido, false se inválido
 */
export function isValidCPF(cpf: string): boolean {
  if (!cpf) return false;
  const cleaned = cleanNumericString(cpf);
  
  if (cleaned.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleaned)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(10))) return false;
  
  return true;
}

/**
 * Valida se um CNPJ é válido
 * @param cnpj - CNPJ a ser validado
 * @returns true se válido, false se inválido
 */
export function isValidCNPJ(cnpj: string): boolean {
  if (!cnpj) return false;
  const cleaned = cleanNumericString(cnpj);
  
  if (cleaned.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleaned)) return false;
  
  // Validação do primeiro dígito verificador
  let size = cleaned.length - 2;
  let numbers = cleaned.substring(0, size);
  const digits = cleaned.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  
  // Validação do segundo dígito verificador
  size = size + 1;
  numbers = cleaned.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;
  
  return true;
}
