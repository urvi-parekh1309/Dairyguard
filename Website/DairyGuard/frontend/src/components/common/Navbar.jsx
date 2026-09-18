import React from 'react';
import { ShieldCheck, Activity, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ currentPath, onNavigate }) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="section-container navbar-inner">
        {/* Brand */}
        <div 
          className="navbar-brand" 
          onClick={() => onNavigate('home')} 
          style={{ cursor: 'pointer' }}
        >
          <img src="/dairyguard-logo.svg" alt="DairyGuard Logo" className="navbar-logo-img" />
          <span>Dairy<span className="text-gradient">Guard</span></span>
        </div>

        {/* Links */}
        <ul className="navbar-nav">
          <li>
            <a 
              href="#home" 
              className={`nav-link ${currentPath === 'home' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="#features" 
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
                setTimeout(() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            >
              Features
            </a>
          </li>
          <li>
            <a 
              href="#subscriptions" 
              className={`nav-link ${currentPath === 'subscription' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); onNavigate('subscription'); }}
            >
              Subscription
            </a>
          </li>
          {isAuthenticated && (
            <li>
              <a 
                href="#dashboard" 
                className={`nav-link ${currentPath.startsWith('dashboard') ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}
              >
                Dashboard
              </a>
            </li>
          )}
        </ul>

        {/* Auth Buttons */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigate('dashboard')}
              >
                <LayoutDashboard size={16} />
                <span>{user?.dairyName || 'Cooperative'}</span>
              </button>
              <button 
                className="btn btn-outline btn-sm"
                onClick={logout}
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigate('login')}
              >
                <LogIn size={16} />
                <span>Login</span>
              </button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => onNavigate('signup')}
              >
                <UserPlus size={16} />
                <span>Sign Up</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
