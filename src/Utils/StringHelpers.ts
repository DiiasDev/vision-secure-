/**
 * Obtém as iniciais de um nome completo
 * @param name - Nome completo
 * @returns Iniciais (primeira e última letra)
 */
export function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Capitaliza a primeira letra de uma string
 * @param text - Texto a ser capitalizado
 * @returns Texto com primeira letra maiúscula
 */
export function capitalizeFirst(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Capitaliza cada palavra de uma string
 * @param text - Texto a ser capitalizado
 * @returns Texto com cada palavra capitalizada
 */
export function capitalizeWords(text: string): string {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => capitalizeFirst(word))
    .join(' ');
}

/**
 * Remove acentos de uma string
 * @param text - Texto com acentos
 * @returns Texto sem acentos
 */
export function removeAccents(text: string): string {
  if (!text) return '';
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Gera um slug a partir de um texto
 * @param text - Texto para gerar slug
 * @returns Slug gerado
 */
export function generateSlug(text: string): string {
  if (!text) return '';
  return removeAccents(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Valida se um e-mail é válido
 * @param email - E-mail a ser validado
 * @returns true se válido, false se inválido
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Mascara um e-mail mostrando apenas parte dele
 * @param email - E-mail a ser mascarado
 * @returns E-mail mascarado (ex: jo***@email.com)
 */
export function maskEmail(email: string): string {
  if (!email) return '';
  const [username, domain] = email.split('@');
  if (!domain) return email;
  
  const visibleChars = Math.min(2, username.length - 1);
  const maskedUsername = username.slice(0, visibleChars) + '***';
  
  return `${maskedUsername}@${domain}`;
}
