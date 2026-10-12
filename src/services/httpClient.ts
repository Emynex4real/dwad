export const API_BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// The session lives in an httpOnly cookie the browser attaches automatically
// (see `credentials: 'include'` below) — this is only the CSRF token issued
// alongside it, kept in memory (never a cookie, since the API and frontend are
// on different domains and JS on this page can't read the API's cookies anyway).
let csrfToken: string | null = null;

export function setCsrfToken(token: string | null): void {
  csrfToken = token;
}

interface ApiFetchOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const method = options.method ?? 'GET';
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {};
  if (options.body !== undefined && !isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (method !== 'GET' && csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: isFormData ? (options.body as FormData) : options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data: unknown = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string'
        ? data.error
        : 'Request failed';
    throw new ApiError(message, response.status);
  }

  return data as T;
}

// `fetch` has no upload-progress event and can hang indefinitely on a stalled
// mobile connection with zero feedback to the user — this uses XHR instead,
// which exposes `upload.onprogress` and lets us enforce a hard timeout so an
// upload always either finishes or fails, never hangs forever.
export function uploadFormData<T>(
  path: string,
  formData: FormData,
  onProgress?: (percent: number) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}${path}`);
    xhr.withCredentials = true;
    xhr.timeout = 10 * 60 * 1000; // 10 minutes — generous for large audio files on slow mobile connections
    if (csrfToken) xhr.setRequestHeader('X-CSRF-Token', csrfToken);

    xhr.upload.onprogress = (event) => {
      if (onProgress && event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      let data: unknown;
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
      } catch {
        data = null;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data as T);
        return;
      }

      const message =
        typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string'
          ? data.error
          : 'Request failed';
      reject(new ApiError(message, xhr.status));
    };

    xhr.onerror = () => reject(new ApiError('Network error — please check your connection and try again.', 0));
    xhr.ontimeout = () => reject(new ApiError('Upload timed out. Please check your connection and try again.', 0));

    xhr.send(formData);
  });
}
