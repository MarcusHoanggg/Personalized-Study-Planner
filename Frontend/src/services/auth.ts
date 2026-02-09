// src/services/auth.ts
import type { User } from '../types';

let currentUser: User | null = null;

export function loginWithEmail(email: string): Promise<User> {
  return new Promise(resolve => {
    setTimeout(() => {
      currentUser = {
        id: '1',
        username: email.split('@')[0] || 'user',
        email,
        name: '',
        bio: '',
      };
      resolve(currentUser);
    }, 400);
  });
}

export function getCurrentUser(): User | null {
  return currentUser;
}

export function logout(): void {
  currentUser = null;
}
