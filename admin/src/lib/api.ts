import { getToken, logout } from './auth';

// Backend URL and API key are hardcoded here — all secrets live only in backend/.env
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const ADMIN_KEY = 'd7a5b3f1e9c8a2b4d6e8f0a2c4e6b8d0a2f4e6c8b0d2a4f6e8c0d2a4b6f8e0c2';

// Build headers for every admin request — includes JWT Bearer token
function getAdminHeaders(): Record<string, string> {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'x-admin-key': ADMIN_KEY,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface Booking {
  _id: string;
  referenceNumber: string;
  eventType: string;
  guestCount: number;
  dateFlexibility: 'fixed' | 'flexible';
  venueId: string;
  date: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface StatsData {
  total: number;
  pending: number;
  confirmed: number;
  rejected: number;
  eventTypeBreakdown: { _id: string; count: number }[];
  monthlyBookings: { _id: string; count: number }[];
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BookingsResponse {
  success: boolean;
  data: Booking[];
  pagination: PaginationInfo;
}

export interface BookingFilters {
  status?: string;
  eventType?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  dateFrom?: string;
  dateTo?: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  // Auto-logout on 401 (token expired or invalid)
  if (res.status === 401) {
    logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Session expired. Please log in again.');
  }
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  async getStats(): Promise<{ success: boolean; data: StatsData }> {
    const res = await fetch(`${API_URL}/api/admin/stats`, {
      headers: getAdminHeaders(),
      cache: 'no-store',
    });
    return handleResponse(res);
  },

  async getBookings(filters: BookingFilters = {}): Promise<BookingsResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.set(k, String(v));
    });
    const res = await fetch(`${API_URL}/api/admin/bookings?${params}`, {
      headers: getAdminHeaders(),
      cache: 'no-store',
    });
    return handleResponse(res);
  },

  async getBooking(id: string): Promise<{ success: boolean; data: Booking }> {
    const res = await fetch(`${API_URL}/api/admin/bookings/${id}`, {
      headers: getAdminHeaders(),
      cache: 'no-store',
    });
    return handleResponse(res);
  },

  async updateStatus(
    id: string,
    status: 'pending' | 'confirmed' | 'rejected'
  ): Promise<{ success: boolean; data: Booking; message: string }> {
    const res = await fetch(`${API_URL}/api/admin/bookings/${id}/status`, {
      method: 'PATCH',
      headers: getAdminHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  async deleteBooking(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_URL}/api/admin/bookings/${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
    });
    return handleResponse(res);
  },

  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/api/health`, { cache: 'no-store' });
      return res.ok;
    } catch {
      return false;
    }
  },
};
