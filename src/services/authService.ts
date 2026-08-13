import type { User, LoginCredentials } from '../types/auth';

const STORAGE_KEY = 'recruitment_admin_auth';

// Default mock admin user for UI demonstration
const MOCK_ADMIN_USER: User = {
  id: 1,
  name: 'Admin User',
  email: 'admin@mhtechin.com',
  role: 'Administrator',
};

/**
 * Mock Authentication Service
 * NOTE: This is a placeholder auth abstraction. It does not perform actual DB password validation
 * until backend auth endpoints are provided by the team.
 */
export const authService = {
  /**
   * Mock login call simulating network delay & basic validation
   */
  async login(credentials: LoginCredentials): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!credentials.email || !credentials.password) {
          reject(new Error('Please provide both email and password.'));
          return;
        }

        if (!credentials.email.includes('@')) {
          reject(new Error('Please enter a valid email address.'));
          return;
        }

        if (credentials.password.length < 4) {
          reject(new Error('Password must be at least 4 characters long.'));
          return;
        }

        const user: User = {
          ...MOCK_ADMIN_USER,
          email: credentials.email,
          name: credentials.email.split('@')[0].replace('.', ' ').toUpperCase(),
        };

        if (credentials.rememberMe) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } else {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        }

        resolve(user);
      }, 700);
    });
  },

  /**
   * Check for existing session token or user in storage
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
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  }
};
