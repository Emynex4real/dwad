import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../types/dashboard';
import { getArtistByEmail } from '../services/artists.service';
import { MOCK_ADMIN } from '../data/mock/artists';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'dwad_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored) as AuthUser);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    const normalized = email.trim().toLowerCase();

    // Admin check
    if (normalized === MOCK_ADMIN.email.toLowerCase()) {
      const authUser: AuthUser = { ...MOCK_ADMIN, role: 'admin' };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      setUser(authUser);
      return { success: true };
    }

    // Artist check
    const artist = getArtistByEmail(normalized);
    if (artist) {
      const authUser: AuthUser = {
        id: artist.id,
        email: artist.email,
        name: artist.name,
        role: 'artist',
        artistId: artist.id,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      setUser(authUser);
      return { success: true };
    }

    return { success: false, error: 'No account found with that email address.' };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
