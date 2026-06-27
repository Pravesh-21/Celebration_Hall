// All credentials live in backend/.env — this module calls the backend to authenticate.
// Tokens are signed JWTs with a 12-hour expiry.

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const TOKEN_KEY = 'gh_admin_token';

interface JWTPayload {
  username: string;
  role: string;
  exp: number; // Unix timestamp (seconds)
  iat: number;
}

function decodeToken(token: string): JWTPayload | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload)) as JWTPayload;
  } catch {
    return null;
  }
}

export async function login(username: string, password: string): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success && data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return false;

  // Check JWT expiry client-side (prevents stale tokens from keeping users "logged in")
  const payload = decodeToken(token);
  if (!payload) return false;

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (payload.exp < nowSeconds) {
    // Token expired — clean up
    localStorage.removeItem(TOKEN_KEY);
    return false;
  }

  return true;
}
