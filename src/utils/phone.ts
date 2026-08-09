/**
 * Helper utilities for phone numbers, dialer links, and WhatsApp URLs.
 */

/**
 * Normalizes phone string to tel: URI format (e.g. "tel:+919876543210")
 */
export function getTelUrl(phone: string): string {
  if (!phone) return "#";
  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length === 10) {
    return `tel:+91${digitsOnly}`;
  }
  return `tel:+${digitsOnly}`;
}

/**
 * Normalizes phone string to WhatsApp wa.me URL format (e.g. "https://wa.me/919876543210")
 */
export function getWhatsAppUrl(phone: string): string {
  if (!phone) return "#";
  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length === 10) {
    return `https://wa.me/91${digitsOnly}`;
  }
  return `https://wa.me/${digitsOnly}`;
}
