const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const STORAGE_KEY = 'recruitment_admin_auth';
const TOKEN_KEY = 'recruitment_admin_token';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
}

export class ApiError extends Error {
  statusCode: number;
  data?: any;

  constructor(message: string, statusCode: number = 500, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

export const getAuthToken = (): string | null => {
  const localToken = localStorage.getItem(TOKEN_KEY);
  if (localToken) return localToken;

  const sessionToken = sessionStorage.getItem(TOKEN_KEY);
  if (sessionToken) return sessionToken;

  // Check user object in storage
  const localData = localStorage.getItem(STORAGE_KEY);
  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      if (parsed.token) return parsed.token;
    } catch {
      // ignore
    }
  }

  const sessionData = sessionStorage.getItem(STORAGE_KEY);
  if (sessionData) {
    try {
      const parsed = JSON.parse(sessionData);
      if (parsed.token) return parsed.token;
    } catch {
      // ignore
    }
  }

  return null;
};

export const setAuthToken = (token: string, _rememberMe: boolean = true) => {
  localStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
};

const buildUrl = (endpoint: string, params?: Record<string, any>): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${API_BASE_URL}${cleanEndpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
};

const getHeaders = (isJson: boolean = true): HeadersInit => {
  const headers: Record<string, string> = {};

  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  let jsonResult: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      jsonResult = await response.json();
    } catch {
      jsonResult = null;
    }
  }

  if (response.status === 401) {
    // Clear stale auth token so app redirects to login cleanly
    removeAuthToken();
    const errorMsg = (jsonResult && (jsonResult.message || jsonResult.error)) || 'Session expired or invalid authentication token. Please log in again.';
    throw new ApiError(errorMsg, 401, jsonResult);
  }

  if (!response.ok) {
    const errorMsg =
      (jsonResult && (jsonResult.message || jsonResult.error)) ||
      `HTTP Error ${response.status}: ${response.statusText}`;
    throw new ApiError(errorMsg, response.status, jsonResult);
  }

  if (jsonResult && jsonResult.data !== undefined) {
    return jsonResult.data as T;
  }

  return jsonResult as T;
};

export const apiClient = {
  baseUrl: API_BASE_URL,

  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = buildUrl(endpoint, params);
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse<T>(response);
  },

  async post<T = any>(endpoint: string, body?: any): Promise<T> {
    const url = buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(true),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async put<T = any>(endpoint: string, body?: any): Promise<T> {
    const url = buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(true),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async patch<T = any>(endpoint: string, body?: any): Promise<T> {
    const url = buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async delete<T = any>(endpoint: string): Promise<T> {
    const url = buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse<T>(response);
  },

  async upload<T = any>(endpoint: string, formData: FormData): Promise<T> {
    const url = buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(false),
      body: formData,
    });
    return handleResponse<T>(response);
  },

  getDownloadUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${cleanEndpoint}`;
  },
};
