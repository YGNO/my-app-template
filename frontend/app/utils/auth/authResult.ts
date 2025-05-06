export interface User {
  id: string;
  email?: string;
  role?: string;
}

export interface Session {
  provider_token?: string | null;
  provider_refresh_token?: string | null;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: User;
}
