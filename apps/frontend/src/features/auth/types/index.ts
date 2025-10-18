export interface User {
  id: number;
  username: string;
  name?: string;
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name?: string;
}

export interface ForgotPasswordRequest {
  username: string;
}

export interface AuthResponse {
  user: User;
  message?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
