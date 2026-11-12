/**
 * Lightweight, robust API client using native fetch.
 * Automatically manages CSRF tokens and session cookies.
 */

const rawApiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const isVercelDeployment =
  typeof window !== 'undefined' && window.location.hostname.endsWith('.vercel.app');
// Route API requests through Vercel's same-origin /api/* rewrite so CSRF and session cookies stay first-party.
const API_BASE = isVercelDeployment ? '' : rawApiBase;

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

export async function getCsrfToken(forceRefresh = false): Promise<string> {
  let token = forceRefresh ? null : getCookie('csrftoken');
  if (!token) {
    try {
      const resp = await fetch(`${API_BASE}/api/auth/csrf/`, { credentials: 'include' });
      if (resp.ok) {
        const data = await resp.json();
        token = data.csrfToken || getCookie('csrftoken') || null;
      }
    } catch {
      // ignore
    }
  }
  return token || '';
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  _isRetry?: boolean;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  let url = endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') {
        searchParams.append(k, String(v));
      }
    });
    const qs = searchParams.toString();
    if (qs) {
      url += (url.includes('?') ? '&' : '?') + qs;
    }
  }

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const method = (options.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    headers['Content-Type'] = 'application/json';
    const csrfToken = await getCsrfToken(options._isRetry);
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }
  }

  const response = await fetch(url, {
    ...options,
    method,
    headers,
    credentials: 'include',
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    // If CSRF token mismatch / 403 on state-modifying requests, retry once with a freshly requested token
    if (response.status === 403 && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && !options._isRetry) {
      const freshToken = await getCsrfToken(true);
      if (freshToken) {
        return apiClient<T>(endpoint, {
          ...options,
          _isRetry: true,
          headers: {
            ...headers,
            'X-CSRFToken': freshToken,
          },
        });
      }
    }

    let errorMsg = `Request failed with status ${response.status}`;
    if (data && typeof data === 'object') {
      const payload = data as { error?: string; errors?: Record<string, string[] | string> };
      const fieldDetails = payload.errors
        ? Object.entries(payload.errors)
            .flatMap(([, msgs]) => (Array.isArray(msgs) ? msgs : [msgs]))
            .filter(Boolean)
        : [];
      if (fieldDetails.length > 0) {
        errorMsg = fieldDetails.join(' ');
      } else if (payload.error) {
        errorMsg = payload.error;
      }
    }
    throw new Error(errorMsg);
  }

  return data as T;
}
