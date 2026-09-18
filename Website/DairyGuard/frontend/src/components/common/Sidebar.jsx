import React from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Boxes, 
  Sparkles, 
  BarChart3, 
  FileText, 
  Settings, 
  ArrowLeft, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ activeTab, onTabChange, onNavigateHome }) {
  const { logout } = useAuth();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Transport / Vehicles', icon: Truck },
    { id: 'batches', label: 'Milk Batches', icon: Boxes },
    { id: 'prediction', label: 'Prediction', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Milk Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="dashboard-sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <img src="/dairyguard-logo.svg" alt="DairyGuard Logo" style={{ width: '32px', height: '32px' }} />
        <span className="sidebar-brand-title">Dairy<span className="text-gradient">Guard</span></span>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
              type="button"
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions: Back to Home & Logout */}
      <div className="sidebar-footer">
        <button
          className="sidebar-link"
          onClick={onNavigateHome}
          type="button"
          title="Back to Landing Page"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        <button
          className="sidebar-link logout-btn"
          onClick={logout}
          type="button"
          title="Log out of session"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
