import httpClient from './httpClient'

export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export const authApi = {
  register: (name: string, email: string, password: string) =>
    httpClient.post<AuthResponse>('/auth/register', { name, email, password }).then((r) => r.data),

  login: (email: string, password: string) =>
    httpClient.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data),

  loginWithGoogle: (idToken: string) =>
    httpClient.post<AuthResponse>('/auth/google', { idToken }).then((r) => r.data),
}
