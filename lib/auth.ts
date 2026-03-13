import { USERS, User } from '@/data/mockData';

export function login(email: string, password: string): User | null {
  return USERS.find(u => u.email === email && u.password === password) || null;
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('prithvinet_user');
  return stored ? JSON.parse(stored) : null;
}

export function setUser(user: User) {
  localStorage.setItem('prithvinet_user', JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem('prithvinet_user');
}
