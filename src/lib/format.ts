import { STORE } from "@/config/store";

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat(STORE.locale, {
    style: "currency",
    currency: STORE.currency,
  }).format(cents / 100);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(STORE.locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(STORE.locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/** "14997471297" -> "(14) 99747-1297" (também cobre fixo de 10 dígitos). */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return value;
}

/** Monta o link do WhatsApp a partir de um telefone brasileiro (DDD + número, sem 55) e uma mensagem. */
export function buildWhatsappUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  const withCountryCode = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountryCode}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function orderCode(sequence: number): string {
  return `BB${String(sequence).padStart(5, "0")}`;
}

/** Converte o valor de um <input type="number" step="0.01"> (ex.: "159.9") em centavos. */
export function parsePriceInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  if (Number.isNaN(parsed)) return null;
  return Math.round(parsed * 100);
}

/** Centavos -> "159.90", para preencher um <input type="number" step="0.01">. */
export function centsToInputValue(cents: number): string {
  return (cents / 100).toFixed(2);
}
