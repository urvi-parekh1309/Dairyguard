import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function AlertBanner({ type = 'info', message, onClose }) {
  if (!message) return null;

  const icons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    danger: AlertCircle
  };

  const Icon = icons[type] || Info;

  return (
    <div className={`alert-banner alert-${type}`}>
      <Icon size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1 }}>{message}</div>
      {onClose && (
        <button 
          onClick={onClose} 
          style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
