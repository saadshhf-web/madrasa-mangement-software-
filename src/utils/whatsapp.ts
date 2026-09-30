/**
 * WhatsApp Helper Utilities for Madrasa Arabia Madina Tul Uloom
 */

export function cleanAndFormatPhoneNumber(phone: string): { formatted: string; isValid: boolean; error?: string } {
  if (!phone || !phone.trim()) {
    return { formatted: '', isValid: false, error: 'موبائل نمبر درج نہیں کیا گیا' };
  }

  // Remove non-digit characters except leading plus
  let cleaned = phone.replace(/[^\d+]/g, '');

  // Handle + prefix
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  // Handle Pakistani formats
  // 03001234567 -> 923001234567
  if (cleaned.startsWith('03')) {
    cleaned = '92' + cleaned.substring(1);
  } else if (cleaned.startsWith('3') && cleaned.length === 10) {
    cleaned = '92' + cleaned;
  } else if (cleaned.startsWith('0092')) {
    cleaned = cleaned.substring(2);
  }

  // Validation: Pakistani mobile numbers after international code 923XXXXXXXXX should be 12 digits
  if (cleaned.startsWith('92') && cleaned.length === 12) {
    return { formatted: cleaned, isValid: true };
  }

  // International format fallback (between 10 and 15 digits)
  if (cleaned.length >= 10 && cleaned.length <= 15) {
    return { formatted: cleaned, isValid: true };
  }

  return {
    formatted: cleaned,
    isValid: false,
    error: 'درست موبائل نمبر درج کریں (مثلاً: 03001234567 یا 923001234567)',
  };
}

export function generateWhatsAppUrl(phone: string, message: string): { url: string; error?: string } {
  const result = cleanAndFormatPhoneNumber(phone);
  if (!result.isValid) {
    return { url: '', error: result.error || 'درست WhatsApp نمبر دستیاب نہیں ہے' };
  }

  const encodedMessage = encodeURIComponent(message);
  return {
    url: `https://wa.me/${result.formatted}?text=${encodedMessage}`,
  };
}

export function openWhatsAppChat(phone: string, message: string): { success: boolean; error?: string } {
  const { url, error } = generateWhatsAppUrl(phone, message);
  if (error || !url) {
    return { success: false, error };
  }

  // Open in new tab/window for WhatsApp Web or WhatsApp Desktop / App
  window.open(url, '_blank', 'noopener,noreferrer');
  return { success: true };
}

// Replace template variables
export function formatMessageTemplate(template: string, data: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    const valStr = value !== undefined && value !== null ? String(value) : '';
    // Replace {key}, { key }, {Key}, etc.
    const regex = new RegExp(`\\{\\s*${key}\\s*\\}`, 'gi');
    result = result.replace(regex, valStr);
  }
  return result;
}
