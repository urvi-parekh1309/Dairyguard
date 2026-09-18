import React, { useState } from 'react';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AlertBanner from '../components/common/AlertBanner';

export default function Login({ onNavigate }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(formData);
      onNavigate('dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '36px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(16, 185, 129, 0.18)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <LogIn size={28} />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Welcome Back</h2>
          <p style={{ fontSize: '1.02rem', color: '#CBD5E1' }}>Sign in to access your DairyGuard cold-chain fleet</p>
        </div>

        {error && <AlertBanner type="danger" message={error} onClose={() => setError('')} />}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="dairy.manager@cooperative.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="password">Password</label>
              <a 
                href="#forgot-password" 
                style={{ fontSize: '0.92rem', color: '#22D3EE' }}
                onClick={(e) => { e.preventDefault(); onNavigate('forgot-password'); }}
              >
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '16px', padding: '14px', fontWeight: 700 }}
            disabled={loading}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight size={20} />
          </button>

          <button
            type="button"
            className="btn btn-outline"
            style={{ width: '100%', marginTop: '12px', padding: '12px', fontSize: '0.95rem', borderColor: 'rgba(255,255,255,0.15)', color: '#34D399' }}
            onClick={() => {
              setFormData({ email: 'demo@dairyguard.com', password: 'password123' });
              if (error) setError('');
            }}
          >
            ⚡ Auto-fill Demo Account (demo@dairyguard.com)
          </button>
        </form>

        {/* Signup Redirect */}
        <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '1rem', color: '#CBD5E1' }}>
          Don't have an account yet?{' '}
          <a 
            href="#signup" 
            style={{ color: '#34D399', fontWeight: 600 }}
            onClick={(e) => { e.preventDefault(); onNavigate('signup'); }}
          >
            Register Dairy
          </a>
        </div>
      </div>
    </div>
  );
}
