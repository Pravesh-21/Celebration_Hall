'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import StatusBadge from '@/components/StatusBadge';
import AuthGuard from '@/components/AuthGuard';
import Toast from '@/components/Toast';
import { api, Booking } from '@/lib/api';

type ToastState = { message: string; type: 'success' | 'error' | 'info' } | null;

const venueNames: Record<string, string> = {
  'grand-ballroom': 'Grand Ballroom',
  'crystal-pavilion': 'Crystal Pavilion',
  'garden-estate': 'Garden Estate',
  'royal-suite': 'Royal Suite',
};

export default function QueryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchBooking = useCallback(async () => {
    try {
      const res = await api.getBooking(id);
      if (res.success) setBooking(res.data);
    } catch (e: any) {
      setToast({ message: 'Failed to load query: ' + e.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchBooking(); }, [fetchBooking]);

  async function handleStatusUpdate(status: 'pending' | 'confirmed' | 'rejected') {
    if (!booking) return;
    setUpdating(true);
    try {
      const res = await api.updateStatus(id, status);
      if (res.success) {
        setBooking(res.data);
        setToast({ message: `Status updated to "${status}" successfully.`, type: 'success' });
      }
    } catch (e: any) {
      setToast({ message: 'Failed to update status: ' + e.message, type: 'error' });
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await api.deleteBooking(id);
      if (res.success) {
        setToast({ message: 'Booking deleted successfully.', type: 'success' });
        setTimeout(() => router.push('/queries'), 1500);
      }
    } catch (e: any) {
      setToast({ message: 'Failed to delete: ' + e.message, type: 'error' });
      setDeleting(false);
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  }

  function formatDateTime(iso: string) {
    return new Date(iso).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <AuthGuard>
      <div className="admin-layout">
        <Sidebar />

        <main className="admin-main">
          <div className="page-header">
            <div>
              <Link href="/queries" className="back-link" id="back-to-queries">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15,18 9,12 15,6" />
                </svg>
                Back to All Queries
              </Link>
              <h1 className="page-title">
                {loading ? 'Loading…' : booking?.referenceNumber ?? 'Query Detail'}
              </h1>
              {booking && (
                <p className="page-subtitle">
                  Received {formatDateTime(booking.createdAt)} · Last updated {formatDateTime(booking.updatedAt)}
                </p>
              )}
            </div>
            {booking && <StatusBadge status={booking.status} />}
          </div>

          <div className="page-content">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                <span className="spinner" />Loading query details…
              </div>
            ) : !booking ? (
              <div className="empty-state">
                <div className="empty-state-icon">❓</div>
                <p>Booking not found or may have been deleted.</p>
                <Link href="/queries" className="btn btn-ghost" style={{ marginTop: 16, display: 'inline-flex' }}>
                  ← Back to Queries
                </Link>
              </div>
            ) : (
              <div className="detail-grid">
                {/* Main Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                  {/* Guest Info */}
                  <div className="detail-card">
                    <h3>Guest Information</h3>
                    <div className="detail-field">
                      <span className="detail-field-label">Full Name</span>
                      <span className="detail-field-value">{booking.name}</span>
                    </div>
                    <div className="detail-field">
                      <span className="detail-field-label">Email</span>
                      <a
                        href={`mailto:${booking.email}`}
                        className="detail-field-value"
                        style={{ color: 'var(--gold)', textDecoration: 'none' }}
                        id="guest-email-link"
                      >
                        {booking.email}
                      </a>
                    </div>
                    <div className="detail-field">
                      <span className="detail-field-label">Phone</span>
                      <a
                        href={`tel:${booking.phone}`}
                        className="detail-field-value"
                        style={{ color: 'var(--gold)', textDecoration: 'none' }}
                        id="guest-phone-link"
                      >
                        {booking.phone}
                      </a>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="detail-card">
                    <h3>Event Details</h3>
                    <div className="detail-field">
                      <span className="detail-field-label">Event Type</span>
                      <span className="detail-field-value" style={{ textTransform: 'capitalize' }}>
                        {booking.eventType}
                      </span>
                    </div>
                    <div className="detail-field">
                      <span className="detail-field-label">Guest Count</span>
                      <span className="detail-field-value">
                        {booking.guestCount.toLocaleString()} guests
                      </span>
                    </div>
                    <div className="detail-field">
                      <span className="detail-field-label">Event Date</span>
                      <span className="detail-field-value">{formatDate(booking.date)}</span>
                    </div>
                    <div className="detail-field">
                      <span className="detail-field-label">Date Flexibility</span>
                      <span className="detail-field-value" style={{ textTransform: 'capitalize' }}>
                        {booking.dateFlexibility}
                      </span>
                    </div>
                    <div className="detail-field">
                      <span className="detail-field-label">Venue</span>
                      <span className="detail-field-value">
                        {venueNames[booking.venueId] ?? booking.venueId.replace(/-/g, ' ')}
                      </span>
                    </div>
                    {booking.notes && (
                      <div className="detail-field" style={{ display: 'block', paddingTop: 14 }}>
                        <span className="detail-field-label" style={{ display: 'block', marginBottom: 8 }}>
                          Notes
                        </span>
                        <div className="detail-notes">{booking.notes}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Status Actions */}
                  <div className="detail-card">
                    <h3>Update Status</h3>
                    <div className="action-group">
                      <button
                        id="btn-confirm"
                        className="btn btn-success"
                        disabled={booking.status === 'confirmed' || updating}
                        onClick={() => handleStatusUpdate('confirmed')}
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        {updating && booking.status !== 'confirmed' ? (
                          <><span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} />Updating…</>
                        ) : '✓ Confirm Booking'}
                      </button>

                      <button
                        id="btn-pending"
                        className="btn btn-ghost"
                        disabled={booking.status === 'pending' || updating}
                        onClick={() => handleStatusUpdate('pending')}
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        ⏳ Mark as Pending
                      </button>

                      <button
                        id="btn-reject"
                        className="btn btn-danger"
                        disabled={booking.status === 'rejected' || updating}
                        onClick={() => handleStatusUpdate('rejected')}
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        ✕ Reject Booking
                      </button>
                    </div>
                  </div>

                  {/* Query Meta */}
                  <div className="detail-card">
                    <h3>Query Info</h3>
                    <div className="detail-field">
                      <span className="detail-field-label">Reference #</span>
                      <span className="detail-field-value" style={{ color: 'var(--gold)', fontWeight: 700 }}>
                        {booking.referenceNumber}
                      </span>
                    </div>
                    <div className="detail-field">
                      <span className="detail-field-label">Status</span>
                      <StatusBadge status={booking.status} />
                    </div>
                    <div className="detail-field">
                      <span className="detail-field-label">Submitted</span>
                      <span className="detail-field-value" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {formatDateTime(booking.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Delete */}
                  <div className="detail-card">
                    <h3>Danger Zone</h3>
                    {!showDeleteConfirm ? (
                      <button
                        id="btn-delete-init"
                        className="btn btn-danger"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        🗑 Delete This Query
                      </button>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 4 }}>
                          Are you sure? This cannot be undone.
                        </p>
                        <button
                          id="btn-delete-confirm"
                          className="btn btn-danger"
                          style={{ width: '100%', justifyContent: 'center' }}
                          disabled={deleting}
                          onClick={handleDelete}
                        >
                          {deleting ? 'Deleting…' : 'Yes, Delete'}
                        </button>
                        <button
                          id="btn-delete-cancel"
                          className="btn btn-ghost"
                          style={{ width: '100%', justifyContent: 'center' }}
                          onClick={() => setShowDeleteConfirm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

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
