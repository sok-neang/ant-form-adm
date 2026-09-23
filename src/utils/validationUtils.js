export function normalizeValue(value) {
  if (value === null || value instanceof File) return value;
  if (typeof value === "string") return value.trim();
  return value ?? "";
}

export function normalizeQuill(value) {
  if (!value || typeof value !== "object" || !Array.isArray(value.ops)) return null;

  const hasContent = value.ops.some(({ insert }) => {
    if (typeof insert === "string") return insert.trim().length > 0;
    return !!(insert?.image || insert?.video);
  });

  return hasContent ? JSON.stringify(value.ops) : null;
}

export function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;

  // Quill Delta
  if (typeof value === "object" && Array.isArray(value.ops)) {
    return !value.ops.some(({ insert }) => {
      if (typeof insert === "string") return insert.trim().length > 0;
      return !!(insert?.image || insert?.video);
    });
  }
  return false;
}

export function isEqual(a, b) {
  if (a instanceof File || b instanceof File) return a === b;

  const isObjectA = a === null || typeof a === "object";
  const isObjectB = b === null || typeof b === "object";

  if (isObjectA && isObjectB) return normalizeQuill(a) === normalizeQuill(b);
  
  return normalizeValue(a) === normalizeValue(b);
}

export function isValidKhmerPhone(phone) {
  if (!phone) return false;
  const cleaned = String(phone).replace(/[\s\-\.]/g, "");
  return /^(\+?855|0)[1-9]\d{7,8}$/.test(cleaned);
}

export function validatePhoneNumber(phone, required = true) {
  if (!phone || !String(phone).trim()) {
    return required ? "សូមបញ្ចូលលេខទូរស័ព្ទ" : "";
  }
  const str = String(phone).trim();
  const cleaned = str.replace(/[\s\-\.]/g, "");

  if (!/^\+?\d+$/.test(cleaned)) {
    return "លេខទូរស័ព្ទត្រូវតែជាលេខប៉ុណ្ណោះ";
  }

  if (cleaned.startsWith("0")) {
    if (cleaned.length < 9 || cleaned.length > 10) {
      return "លេខទូរស័ព្ទត្រូវមាន 9 ឬ 10 ខ្ទង់ "
    }
  }

  if (!isValidKhmerPhone(cleaned)) {
    return "លេខទូរស័ព្ទមិនត្រឹមត្រូវ (ឧទាហរណ៍៖ 012345678 ឬ 0978123456)";
  }

  return "";
}
