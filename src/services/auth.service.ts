import type { AuthUser } from '../types/dashboard';
import { apiFetch, ApiError, setStoredToken, clearStoredToken } from './httpClient';

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  try {
    const { token, user } = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    setStoredToken(token);
    return { success: true, user };
  } catch (err) {
    const message = err instanceof ApiError ? err.message : 'Login failed. Please try again.';
    return { success: false, error: message };
  }
}

export async function forgotPassword(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    await apiFetch('/auth/forgot-password', { method: 'POST', body: { email } });
    return { success: true };
  } catch (err) {
    const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.';
    return { success: false, error: message };
  }
}

export async function resetPassword(token: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    await apiFetch('/auth/reset-password', { method: 'POST', body: { token, password } });
    return { success: true };
  } catch (err) {
    const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.';
    return { success: false, error: message };
  }
}

export async function logout(): Promise<void> {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } finally {
    clearStoredToken();
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { user } = await apiFetch<{ user: AuthUser }>('/auth/me');
    return user;
  } catch {
    clearStoredToken();
    return null;
  }
}
