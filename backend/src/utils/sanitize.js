const controlChars = /[\u0000-\u001F\u007F]/g;

export function sanitizeInput(text) {
  return text.replace(controlChars, '').trim();
}

