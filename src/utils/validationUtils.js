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
