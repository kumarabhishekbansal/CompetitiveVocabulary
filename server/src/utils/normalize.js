/**
 * Normalization utility for vocabulary terms.
 * Ensures consistent case-insensitivity and collapses internal/surrounding whitespace.
 * e.g., "  Abundant  ", "abundant", and "ABUNDANT" all resolve to "abundant".
 */
export function normalizeTerm(rawTerm) {
  if (!rawTerm || typeof rawTerm !== 'string') {
    return '';
  }
  return rawTerm
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}
