export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/['`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getApiOrigin() {
  return API_BASE.replace(/\/api\/?$/, "");
}

export function resolveMediaUrl(value) {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  if (value.startsWith("/")) {
    return `${getApiOrigin()}${value}`;
  }
  return value;
}

export function safeText(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

export function formatPhone(value) {
  if (!value) return "";
  return String(value);
}

export function formatPrice(value, suffix = "so'm") {
  if (value === null || value === undefined || value === "") return "";
  return `${value} ${suffix}`;
}
