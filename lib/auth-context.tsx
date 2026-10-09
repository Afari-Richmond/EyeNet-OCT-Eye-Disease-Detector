"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  type User,
  fetchMe,
  loginUser,
  registerUser,
  setTokens,
  clearTokens,
  getAccessToken,
} from "@/lib/api";

type RegisterPayload = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};

type AuthContextValue = {
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  loginAsGuest: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      if (!getAccessToken()) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await fetchMe();
        setUser(me);
      } catch {
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };
    hydrate();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const { access, refresh } = await loginUser(username, password);
    setTokens(access, refresh);
    const me = await fetchMe();
    setUser(me);
    setIsGuest(false);
  }, []);

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await registerUser(payload);
      await login(payload.username, payload.password);
    },
    [login]
  );

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setIsGuest(false);
    window.location.href = "/login";
  }, []);

  const loginAsGuest = useCallback(() => {
    setIsGuest(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isGuest, isLoading, login, register, logout, loginAsGuest }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
