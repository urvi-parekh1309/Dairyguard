import React, { useState } from 'react';
import { UserPlus, Building2, Phone, MapPin, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AlertBanner from '../components/common/AlertBanner';

export default function Signup({ onNavigate }) {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dairyName: '',
    phoneNumber: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signup(formData);
      onNavigate('dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '580px', padding: '36px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <UserPlus size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Create Dairy Account</h2>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>Register your dairy cooperative to deploy cold-chain IoT tracking</p>
        </div>

        {error && <AlertBanner type="danger" message={error} onClose={() => setError('')} />}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name *</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className="form-control"
                placeholder="Ramesh Patel"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Work Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="ramesh@pateldairy.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Dairy Cooperative Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="dairyName">Dairy Name / Cooperative Name *</label>
            <input
              id="dairyName"
              name="dairyName"
              type="text"
              className="form-control"
              placeholder="e.g. Anand Milk Producers Union Ltd."
              value={formData.dairyName}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {/* Phone Number */}
            <div className="form-group">
              <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                className="form-control"
                placeholder="+91 98765 43210"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label" htmlFor="location">Location / District</label>
              <input
                id="location"
                name="location"
                type="text"
                className="form-control"
                placeholder="Anand, Gujarat"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password *</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password *</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-control"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '14px', padding: '12px' }}
            disabled={loading}
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Login Redirect */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: '#94A3B8' }}>
          Already have an account?{' '}
          <a 
            href="#login" 
            style={{ color: '#06B6D4', fontWeight: 600 }}
            onClick={(e) => { e.preventDefault(); onNavigate('login'); }}
          >
            Sign In here
          </a>
        </div>
      </div>
    </div>
  );
}
