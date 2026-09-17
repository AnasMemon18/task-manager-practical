import { createContext, useEffect, useReducer, type ReactNode } from 'react';
import type { AuthSession, User } from '../types';
import * as authService from '../services/authService';

interface AuthState {
  user: User | null;
  initializing: boolean;
}

type AuthAction =
  | { type: 'INITIALIZED'; user: User | null }
  | { type: 'LOGIN_SUCCESS'; user: User }
  | { type: 'LOGOUT' };

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'INITIALIZED':
      return { user: action.user, initializing: false };
    case 'LOGIN_SUCCESS':
      return { user: action.user, initializing: false };
    case 'LOGOUT':
      return { user: null, initializing: false };
  }
}

interface AuthContextValue extends AuthState {
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    initializing: true,
  });

  // On mount, check localStorage for an existing (unexpired) session.
  useEffect(() => {
    const session: AuthSession | null = authService.getSession();
    dispatch({ type: 'INITIALIZED', user: session ? session.user : null });
  }, []);

  async function signup(email: string, password: string, name: string): Promise<void> {
    const session = await authService.signup(email, password, name);
    dispatch({ type: 'LOGIN_SUCCESS', user: session.user });
  }

  async function login(email: string, password: string): Promise<void> {
    const session = await authService.login(email, password);
    dispatch({ type: 'LOGIN_SUCCESS', user: session.user });
  }

  function logout(): void {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AuthContext.Provider value={{ ...state, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}