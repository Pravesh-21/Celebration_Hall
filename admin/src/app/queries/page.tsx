'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import StatusBadge from '@/components/StatusBadge';
import AuthGuard from '@/components/AuthGuard';
import Toast from '@/components/Toast';
import { api, Booking, PaginationInfo } from '@/lib/api';

type ToastState = { message: string; type: 'success' | 'error' | 'info' } | null;

const EVENT_TYPES = ['wedding', 'corporate', 'birthday', 'gala', 'conference', 'other'];

export default function QueriesPage() {
  const router = useRouter();

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchBookings = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await api.getBookings({
        search: search.trim() || undefined,
        status: statusFilter,
        eventType: eventFilter,
        page,
        limit: 15,
        sortBy,
        sortOrder,
      });
      if (res.success) {
        setBookings(res.data);
        setPagination(res.pagination);
      }
    } catch (e: any) {
      setToast({ message: 'Failed to fetch queries: ' + e.message, type: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, statusFilter, eventFilter, page, sortBy, sortOrder]);

  // Debounced search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchBookings();
    }, 350);
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
  }, [search]);

  // Refetch when filters/page change (not search — that's debounced)
  useEffect(() => {
    fetchBookings();
  }, [statusFilter, eventFilter, page, sortBy, sortOrder]);

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(() => fetchBookings(true), 30000);
    return () => clearInterval(interval);
  }, [fetchBookings]);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }

  function handleSort(column: string) {
    if (sortBy === column) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setPage(1);
  }

  function SortIcon({ col }: { col: string }) {
    if (sortBy !== col) return <span style={{ opacity: 0.3, marginLeft: 4 }}>↕</span>;
    return <span style={{ color: 'var(--gold)', marginLeft: 4 }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  }

  const start = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const end = pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : 0;

  return (
    <AuthGuard>
      <div className="admin-layout">
        <Sidebar />

        <main className="admin-main">
          <div className="page-header">
            <div>
              <h1 className="page-title">All Queries</h1>
              <p className="page-subtitle">
                {pagination ? `${pagination.total} total booking queries` : 'Loading…'}
              </p>
            </div>
          </div>

          <div className="page-content">
            <div className="table-card">
              {/* Filter Bar */}
              <div className="table-header-bar">
                {/* Search */}
                <div className="search-input-wrapper">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    id="query-search"
                    type="text"
                    className="search-input"
                    placeholder="Search by name, email, ref…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* Status filter */}
                <select
                  id="status-filter"
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>

                {/* Event type filter */}
                <select
                  id="event-filter"
                  className="filter-select"
                  value={eventFilter}
                  onChange={(e) => { setEventFilter(e.target.value); setPage(1); }}
                >
                  <option value="all">All Events</option>
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>

                {/* Refresh */}
                <button
                  id="refresh-queries-btn"
                  className={`btn-icon ${refreshing ? 'spinning' : ''}`}
                  onClick={() => fetchBookings(true)}
                  title="Refresh"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="23,4 23,10 17,10" /><polyline points="1,20 1,14 7,14" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                </button>
              </div>

              {/* Table */}
              {loading ? (
                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <span className="spinner" />Loading queries…
                </div>
              ) : bookings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🔍</div>
                  <p>No queries match your filters. Try adjusting the search or filters.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('referenceNumber')}
                        >
                          Ref # <SortIcon col="referenceNumber" />
                        </th>
                        <th
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('name')}
                        >
                          Guest <SortIcon col="name" />
                        </th>
                        <th
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('eventType')}
                        >
                          Event <SortIcon col="eventType" />
                        </th>
                        <th
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('guestCount')}
                        >
                          Guests <SortIcon col="guestCount" />
                        </th>
                        <th
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('date')}
                        >
                          Event Date <SortIcon col="date" />
                        </th>
                        <th
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('createdAt')}
                        >
                          Received <SortIcon col="createdAt" />
                        </th>
                        <th>Status</th>
                        <th>Venue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr
                          key={b._id}
                          id={`query-row-${b._id}`}
                          onClick={() => router.push(`/queries/${b._id}`)}
                        >
                          <td><span className="booking-ref">{b.referenceNumber}</span></td>
                          <td>
                            <div className="booking-name">{b.name}</div>
                            <div className="booking-email">{b.email}</div>
                          </td>
                          <td style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                            {b.eventType}
                          </td>
                          <td style={{ color: 'var(--text-primary)' }}>
                            {b.guestCount.toLocaleString()}
                          </td>
                          <td style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                            {formatDate(b.date)}
                          </td>
                          <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: 12 }}>
                            {formatDate(b.createdAt)}
                          </td>
                          <td><StatusBadge status={b.status} /></td>
                          <td style={{ color: 'var(--text-secondary)', textTransform: 'capitalize', fontSize: 12 }}>
                            {b.venueId.replace(/-/g, ' ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="pagination">
                  <div className="pagination-info">
                    Showing {start}–{end} of {pagination.total} queries
                  </div>
                  <div className="pagination-controls">
                    <button
                      className="page-btn"
                      id="page-prev-btn"
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      ‹
                    </button>
                    {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                      const p = i + 1;
                      return (
                        <button
                          key={p}
                          className={`page-btn ${p === page ? 'active' : ''}`}
                          id={`page-btn-${p}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      );
                    })}
                    <button
                      className="page-btn"
                      id="page-next-btn"
                      disabled={page === pagination.totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      ›
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Toasts */}
      {toast && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </AuthGuard>
  );
}
