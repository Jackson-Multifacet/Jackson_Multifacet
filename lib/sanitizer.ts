import DOMPurify from 'dompurify';

/**
 * Cleans a string of any potentially malicious HTML or script tags.
 * @param dirty The potentially unsafe string.
 * @returns A clean, safe string for rendering.
 */
export const sanitize = (dirty: string | null | undefined): string => {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty);
};
