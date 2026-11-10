/** Browser-only, versioned storage. Keep the UI independent from this implementation. */
export const STORAGE_KEY = 'gopixel:v1';
export function readLocalProgress<T>(fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}
export function writeLocalProgress(value: unknown): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
