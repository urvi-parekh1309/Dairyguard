import React, { useState } from 'react';
import { KeyRound, Mail, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import AlertBanner from '../components/common/AlertBanner';

export default function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your registered email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.auth.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to submit password reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <KeyRound size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Reset Password</h2>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>Enter your email to receive recovery instructions</p>
        </div>

        {error && <AlertBanner type="danger" message={error} onClose={() => setError('')} />}

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={48} style={{ color: '#10B981', margin: '0 auto 16px', display: 'block' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Check Your Email</h3>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginBottom: '24px' }}>
              We've dispatched password recovery instructions to <strong>{email}</strong>.
            </p>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => onNavigate('login')}>
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="reset-email">Email Address</label>
              <input
                id="reset-email"
                type="email"
                className="form-control"
                placeholder="dairy.manager@cooperative.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '12px', padding: '12px' }}
              disabled={loading}
            >
              <span>{loading ? 'Sending Request...' : 'Send Reset Link'}</span>
              <ArrowRight size={18} />
            </button>

            <button 
              type="button"
              className="btn btn-secondary" 
              style={{ width: '100%', marginTop: '12px' }}
              onClick={() => onNavigate('login')}
            >
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
