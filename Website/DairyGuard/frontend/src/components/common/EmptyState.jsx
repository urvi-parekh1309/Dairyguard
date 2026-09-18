import React from 'react';
import { DatabaseZap, AlertCircle } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = DatabaseZap, 
  title = 'No sensor data available.', 
  description = 'There are currently no telemetry records registered from your IoT sensors or transport vehicles.',
  action = null
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={32} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {action && (
        <div style={{ marginTop: '12px' }}>
          {action}
        </div>
      )}
    </div>
  );
}
