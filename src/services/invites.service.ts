import { apiFetch, ApiError } from './httpClient';

interface RegisterInvitePayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  genre?: string;
  country?: string;
  bio?: string;
  socialLinks?: { spotify?: string; instagram?: string };
  subscription: { plan: string; price: number };
}

export async function createInvite(): Promise<string> {
  const result = await apiFetch<{ token: string }>('/invites', { method: 'POST' });
  return result.token;
}

export async function checkInvite(token: string): Promise<boolean> {
  try {
    await apiFetch<{ valid: boolean }>(`/invites/${token}`);
    return true;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
}

export async function registerViaInvite(token: string, data: RegisterInvitePayload): Promise<void> {
  await apiFetch(`/invites/${token}/register`, { method: 'POST', body: data });
}
