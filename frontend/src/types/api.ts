export interface GenerationApiResponse {
  data?: {
    content: string;
  };
  content?: string; // Direct access fallback
  error?: string;
  status?: number;
}

export interface ChatApiResponse {
  data?: {
    reply: string;
    context_used: string[];
  };
  reply?: string;
  context_used?: string[];
  error?: string;
  status?: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}
