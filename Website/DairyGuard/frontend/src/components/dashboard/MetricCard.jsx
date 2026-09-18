import React from 'react';

export default function MetricCard({ 
  title, 
  value, 
  unit = '', 
  icon: Icon, 
  variant = 'cyan', 
  footerText = '', 
  statusBadge = null,
  empty = false 
}) {
  return (
    <div className="metric-card">
      <div className="metric-card-header">
        <span className="metric-card-title">{title}</span>
        {Icon && (
          <div className={`metric-card-icon icon-${variant}`}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="metric-value-container">
        {empty ? (
          <span style={{ fontSize: '1.05rem', color: '#94A3B8', fontWeight: 500, fontStyle: 'italic' }}>
            No sensor data available.
          </span>
        ) : (
          <>
            <span className="metric-value">{value}</span>
            {unit && <span className="metric-unit">{unit}</span>}
          </>
        )}
      </div>

      <div className="metric-footer">
        <span>{footerText || (empty ? 'Awaiting IoT transmission' : 'Real-time telemetry')}</span>
        {statusBadge && <div>{statusBadge}</div>}
      </div>
    </div>
  );
}
