import React from 'react';

export default function SensorStatusBadge({ status, type = null }) {
  if (!status) {
    return <span className="status-pill status-neutral">Offline</span>;
  }

  const s = String(status).toLowerCase();

  let className = 'status-neutral';
  if (s.includes('low') || s.includes('optimal') || s.includes('safe') || s.includes('active') || s.includes('delivered') || s.includes('fresh')) {
    className = 'status-safe';
  } else if (s.includes('med') || s.includes('warning') || s.includes('transit') || s.includes('moderate')) {
    className = 'status-warning';
  } else if (s.includes('high') || s.includes('critical') || s.includes('danger') || s.includes('rejected') || s.includes('spoil')) {
    className = 'status-critical';
  }

  return (
    <span className={`status-pill ${className}`}>
      {status}
    </span>
  );
}
