const TOKEN_KEY = 'nucleus_token';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable — session lives for the tab only */
  }
}

export interface ApiOptions {
  method?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
}

/** Minimal JSON API client: attaches the auth token, throws readable errors. */
export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(`/api${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
        ? data.error
        : `Request failed (${response.status})`;
    throw new Error(message);
  }
  return data as T;
}
