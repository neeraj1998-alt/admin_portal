import type { User, LoginCredentials } from '../types/auth';
import { apiClient, setAuthToken, removeAuthToken, getAuthToken } from './apiClient';

const STORAGE_KEY = 'recruitment_admin_auth';

const adaptUser = (rawUser: any): User => {
  let role: User['role'] = 'Administrator';
  if (String(rawUser.role).toUpperCase().includes('RECRUITER')) {
    role = 'Recruiter';
  } else if (String(rawUser.role).toUpperCase().includes('HR')) {
    role = 'HR Manager';
  }

  const name =
    rawUser.name ||
    `${rawUser.first_name || ''} ${rawUser.last_name || ''}`.trim() ||
    String(rawUser.email || '').split('@')[0];

  return {
    id: Number(rawUser.id || 1),
    name,
    email: rawUser.email,
    role,
    avatarUrl: rawUser.avatarUrl,
  };
};

export const authService = {
  /**
   * Real backend login call
   */
  async login(credentials: LoginCredentials): Promise<User> {
    if (!credentials.email || !credentials.password) {
      throw new Error('Please provide both email and password.');
    }

    try {
      const response = await apiClient.post<any>('/auth/login', {
        email: credentials.email.trim(),
        password: credentials.password,
      });

      const token = response?.token;
      const rawUser = response?.user || response;

      if (!token) {
        throw new Error('Authentication succeeded but no token was provided.');
      }

      const user = adaptUser(rawUser);

      // Persist auth token
      setAuthToken(token, credentials.rememberMe !== false);

      // Persist user object
      const storage = credentials.rememberMe !== false ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEY, JSON.stringify({ ...user, token }));

      return user;
    } catch (err: any) {
      const msg = err?.message || 'Login failed. Please check your credentials.';
      throw new Error(msg);
    }
  },

  /**
   * Verify and fetch current authenticated user from backend or local storage
   */
  async verifySession(): Promise<User | null> {
    try {
      const response = await apiClient.get<any>('/auth/me');
      if (response) {
        const user = adaptUser(response);
        const currentToken = getAuthToken();
        const fullUser = { ...user, token: currentToken };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fullUser));
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fullUser));
        return user;
      }
    } catch (err: any) {
      if (err?.statusCode === 401) {
        removeAuthToken();
        return null;
      }
    }
    return this.getCurrentUser();
  },

  /**
   * Synchronously get cached user
   */
  getCurrentUser(): User | null {
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    const sessionData = sessionStorage.getItem(STORAGE_KEY);
    if (sessionData) {
      try {
        return JSON.parse(sessionData);
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }

    return null;
  },

  /**
   * Clear session / logout
   */
  logout(): void {
    removeAuthToken();
  },
};

