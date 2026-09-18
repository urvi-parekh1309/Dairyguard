import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, Thermometer } from 'lucide-react';
import SensorStatusBadge from './SensorStatusBadge';

export default function RecentAlertsList({ alerts = [] }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div style={{ padding: '28px', textAlign: 'center', color: '#CBD5E1', fontSize: '1.02rem' }}>
        <ShieldCheck size={36} style={{ color: '#10B981', margin: '0 auto 10px', display: 'block' }} />
        <span>No critical alerts triggered. Cold chain and quality parameters within normal range.</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {alerts.map((alert, idx) => (
        <div 
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <AlertTriangle size={20} style={{ color: alert.severity === 'critical' ? '#EF4444' : '#F59E0B' }} />
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF' }}>{alert.title}</div>
              <div style={{ fontSize: '0.88rem', color: '#CBD5E1', marginTop: '2px' }}>{alert.description}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <SensorStatusBadge status={alert.status || (alert.severity === 'critical' ? 'High Risk' : 'Warning')} />
            <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '4px' }}>{alert.time || 'Just now'}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
