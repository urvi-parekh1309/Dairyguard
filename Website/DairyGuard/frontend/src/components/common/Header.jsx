import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, Wifi } from 'lucide-react';

export default function Header({ title, subtitle }) {
  const { user } = useAuth();

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'DG';

  return (
    <header className="dashboard-topbar">
      <div className="topbar-left">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p style={{ fontSize: '0.95rem', margin: '2px 0 0', color: '#CBD5E1' }}>{subtitle}</p>}
        </div>
      </div>

      <div className="topbar-right">
        {/* IoT Gateway Connectivity Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#34D399', background: 'rgba(16, 185, 129, 0.15)', padding: '7px 14px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
          <Wifi size={16} />
          <span>IoT Gateway Online</span>
        </div>

        {/* Dairy / User Pill */}
        <div className="user-badge">
          <div className="user-avatar">{initials}</div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF' }}>{user?.fullName || 'Dairy Owner'}</span>
            <span style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>{user?.dairyName || 'Cooperative'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
