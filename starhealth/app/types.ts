// app/types.ts
export type User = {
  name: string;
  email: string;
  dob?: string;
};

export type UserSession = {
  token: string;
  email: string;
  name: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  message?: string;
};

// type pour le state
export type AuthView = 'login' | 'signup' | 'forgot' | 'verify' | 'enter-dob';

// valeurs utilisables à l'exécution
export const AUTH_VIEWS = {
  LOGIN: 'login' as AuthView,
  SIGNUP: 'signup' as AuthView,
  FORGOT: 'forgot' as AuthView,
  VERIFY: 'verify' as AuthView,
  ENTER_DOB: 'enter-dob' as AuthView,
};
