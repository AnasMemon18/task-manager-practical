import type { AuthSession, User } from '../types';
import { getItem, removeItem, setItem } from './storage';

const USERS_KEY = 'users';
const SESSION_KEY = 'session';

// 24 hours in milliseconds, session expires after this
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

interface StoredUser extends User {
  password: string;
}

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function getUsers(): StoredUser[] {
  return getItem<StoredUser[]>(USERS_KEY) ?? [];
}

function saveUsers(users: StoredUser[]): void {
  setItem(USERS_KEY, users);
}

export async function signup(email: string, password: string, name: string): Promise<AuthSession> {
  const users = getUsers();

  const alreadyExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (alreadyExists) {
    throw new Error('An account with this email already exists.');
  }

  const hashedPassword = await hashPassword(password);

  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    email,
    name,
    password: hashedPassword,
  };

  saveUsers([...users, newUser]);

  return createSession(newUser);
}

export async function login(email: string, password: string): Promise<AuthSession> {
  const users = getUsers();

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const hashedPassword = await hashPassword(password);
  if (user.password !== hashedPassword) {
    throw new Error('Invalid email or password.');
  }

  return createSession(user);
}

export function logout(): void {
  removeItem(SESSION_KEY);
}

export function getSession(): AuthSession | null {
  const session = getItem<AuthSession>(SESSION_KEY);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    removeItem(SESSION_KEY);
    return null;
  }

  return session;
}

function createSession(user: StoredUser): AuthSession {
  const session: AuthSession = {
    user: { id: user.id, email: user.email, name: user.name },
    token: crypto.randomUUID(),
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };

  setItem(SESSION_KEY, session);
  return session;
}