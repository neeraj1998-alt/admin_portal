export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Administrator' | 'HR Manager' | 'Recruiter';
  avatarUrl?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}
