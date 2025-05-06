import type { Session, User } from "./authResult.ts";

type Credentials = {
  email: string;
  password: string;
  options?: { captchaToken?: string };
};

type SignInResponse =
  | { data: { user: User; session: Session }; error: null }
  | { data: { user: null; session: null }; error: Error };

type GetUserResponse = { data: { user: User }; error: null } | { data: { user: null }; error: Error };

export interface AuthClient {
  signInWithPassword: (credentials: Credentials) => Promise<SignInResponse>;
  signOut(scope?: "global" | "local" | "others"): Promise<{ error: Error | null }>;
  getUser(jwt?: string): Promise<GetUserResponse>;
}
