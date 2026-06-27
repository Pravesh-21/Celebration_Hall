type Status = 'pending' | 'confirmed' | 'rejected';

interface StatusBadgeProps {
  status: Status;
}

const labels: Record<Status, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  rejected: 'Rejected',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge ${status}`}>
      <span className="status-badge-dot" />
      {labels[status] ?? status}
    </span>
  );
}
