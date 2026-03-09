export type JsonRecord = Record<string, unknown>;

export function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null;
}

export function toRecord(value: unknown): JsonRecord {
  return isRecord(value) ? value : {};
}

export function getString(
  value: unknown,
  fallback = "",
  transform?: (raw: string) => string,
): string {
  const raw = typeof value === "string" ? value : String(value ?? "");
  const normalized = raw.trim();
  const result = normalized || fallback;
  return transform ? transform(result) : result;
}

export function getNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getPositiveNumber(value: unknown, fallback = 0): number {
  const parsed = getNumber(value, fallback);
  return parsed > 0 ? parsed : fallback;
}

export function getArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function getNestedRecord(
  root: JsonRecord,
  key: string,
): JsonRecord | null {
  const value = root[key];
  return isRecord(value) ? value : null;
}

export function firstDefined<T>(...values: T[]): T | undefined {
  for (const value of values) {
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
}

export function toISODate(value: unknown): string {
  const raw = getString(value, "");
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);

  const date = new Date(raw || String(value ?? ""));
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function toDisplayDate(value: unknown): string {
  const iso = toISODate(value);
  if (!iso) return "-";
  const [yyyy, mm, dd] = iso.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

export function toListPayload(value: unknown): JsonRecord[] {
  if (Array.isArray(value)) {
    return value.filter(isRecord);
  }

  const record = toRecord(value);
  const listCandidates = [
    record.items,
    record.data,
    record.content,
    record.results,
    record.payload,
  ];

  for (const candidate of listCandidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter(isRecord);
    }
  }

  return [];
}
