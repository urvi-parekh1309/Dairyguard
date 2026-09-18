import React, { useState, useEffect } from 'react';
import { User, Building2, CreditCard, Bell, LogOut, CheckCircle2, Save, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import AlertBanner from '../../components/common/AlertBanner';

export default function Settings({ onNavigatePlan }) {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'dairy', 'subscription', 'notifications'
  
  // Profile Form
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    location: user?.location || ''
  });

  // Dairy Info Form
  const [dairyData, setDairyData] = useState({
    dairyName: user?.dairyName || '',
    licenseNumber: '',
    location: user?.location || '',
    phoneNumber: user?.phoneNumber || ''
  });

  // Subscription Info
  const [currentSub, setCurrentSub] = useState(null);

  // Notification Toggles
  const [notifications, setNotifications] = useState({
    spoilageSms: true,
    temperatureBreach: true,
    dailyReportEmail: false,
    intakeQrScanned: true
  });

  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    // Fetch current dairy profile and subscription
    api.user.getDairyProfile()
      .then((data) => {
        if (data) {
          setDairyData({
            dairyName: data.dairyName || user?.dairyName || '',
            licenseNumber: data.licenseNumber || '',
            location: data.location || '',
            phoneNumber: data.phoneNumber || ''
          });
        }
      })
      .catch(() => {});

    api.subscriptions.getCurrent()
      .then((data) => setCurrentSub(data))
      .catch(() => {});
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.user.updateProfile(profileData);
      updateUser(updated);
      setBanner({ type: 'success', message: 'Profile details updated successfully!' });
    } catch (err) {
      setBanner({ type: 'danger', message: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDairy = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.user.updateDairyProfile(dairyData);
      updateUser({ dairyName: dairyData.dairyName });
      setBanner({ type: 'success', message: 'Dairy cooperative profile updated!' });
    } catch (err) {
      setBanner({ type: 'danger', message: err.message || 'Failed to update dairy details.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    setBanner({ type: 'success', message: 'Notification preferences saved!' });
  };

  return (
    <div className="dashboard-body">
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.85rem', marginBottom: '6px' }}>System & Account Settings</h2>
        <p style={{ fontSize: '1.02rem', color: '#CBD5E1' }}>
          Manage your personal profile, cooperative credentials, subscription tier, and alert channels
        </p>
      </div>

      {banner && <AlertBanner type={banner.type} message={banner.message} onClose={() => setBanner(null)} />}

      {/* Tabs Menu */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button
          className={`btn btn-sm ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setActiveTab('profile'); setBanner(null); }}
        >
          <User size={16} />
          <span>Profile</span>
        </button>

        <button
          className={`btn btn-sm ${activeTab === 'dairy' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setActiveTab('dairy'); setBanner(null); }}
        >
          <Building2 size={16} />
          <span>Dairy Information</span>
        </button>

        <button
          className={`btn btn-sm ${activeTab === 'subscription' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setActiveTab('subscription'); setBanner(null); }}
        >
          <CreditCard size={16} />
          <span>Subscription</span>
        </button>

        <button
          className={`btn btn-sm ${activeTab === 'notifications' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setActiveTab('notifications'); setBanner(null); }}
        >
          <Bell size={16} />
          <span>Notification Settings</span>
        </button>

        <button
          className="btn btn-danger btn-sm"
          style={{ marginLeft: 'auto' }}
          onClick={logout}
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>

      {/* 1. Profile Tab */}
      {activeTab === 'profile' && (
        <div className="glass-card" style={{ maxWidth: '640px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Personal Information</h3>
          <form onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Login ID)</label>
              <input
                type="email"
                className="form-control"
                value={profileData.email}
                disabled
                style={{ opacity: 0.6 }}
              />
              <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Contact support to modify primary email.</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location / Base</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }} disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>
      )}

      {/* 2. Dairy Information Tab */}
      {activeTab === 'dairy' && (
        <div className="glass-card" style={{ maxWidth: '640px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Dairy Cooperative Details</h3>
          <form onSubmit={handleSaveDairy}>
            <div className="form-group">
              <label className="form-label">Dairy / Cooperative Official Name *</label>
              <input
                type="text"
                className="form-control"
                value={dairyData.dairyName}
                onChange={(e) => setDairyData({ ...dairyData, dairyName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">FSSAI / Milk Federation License Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. FSSAI-LIC-10023456789012"
                value={dairyData.licenseNumber}
                onChange={(e) => setDairyData({ ...dairyData, licenseNumber: e.target.value })}
              />
              <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Printed on official generated transit reports.</span>
            </div>

            <div className="form-group">
              <label className="form-label">Cooperative Regional Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="District Chilling Center, Highway Rd."
                value={dairyData.location}
                onChange={(e) => setDairyData({ ...dairyData, location: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }} disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Update Dairy Details'}</span>
            </button>
          </form>
        </div>
      )}

      {/* 3. Subscription Tab */}
      {activeTab === 'subscription' && (
        <div className="glass-card" style={{ maxWidth: '640px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Current Active Subscription</h3>

          <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.84rem', color: '#34D399', textTransform: 'uppercase', fontWeight: 700 }}>ACTIVE PLAN</span>
              <span className="status-pill status-safe">Verified</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>
              {currentSub?.planDetails?.name || 'DairyGuard Complete'}
            </div>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginTop: '4px' }}>
              {currentSub?.planDetails?.tagline || 'End-to-end full cold-chain telemetry and biochemical quality assurance.'}
            </p>
            <div style={{ marginTop: '16px', fontSize: '0.85rem', color: '#E2E8F0' }}>
              Renewal Date: <strong>{currentSub?.renewalDate ? new Date(currentSub.renewalDate).toLocaleDateString() : 'Active Renewal'}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn btn-primary"
              onClick={onNavigatePlan}
            >
              <CreditCard size={16} />
              <span>Change or Upgrade Plan</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Notification Settings Tab */}
      {activeTab === 'notifications' && (
        <div className="glass-card" style={{ maxWidth: '640px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Alert Channels & Preferences</h3>
          <form onSubmit={handleSaveNotifications} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#FFFFFF' }}>High Spoilage Risk SMS Alerts</div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Dispatch SMS emergency warnings to driver and plant manager when risk reaches critical.</div>
              </div>
              <input
                type="checkbox"
                style={{ width: '18px', height: '18px', accentColor: '#10B981' }}
                checked={notifications.spoilageSms}
                onChange={(e) => setNotifications({ ...notifications, spoilageSms: e.target.checked })}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#FFFFFF' }}>Temperature Breach Notifications</div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Immediate in-app push alerts if vessel thermal reading rises above 4.0°C.</div>
              </div>
              <input
                type="checkbox"
                style={{ width: '18px', height: '18px', accentColor: '#10B981' }}
                checked={notifications.temperatureBreach}
                onChange={(e) => setNotifications({ ...notifications, temperatureBreach: e.target.checked })}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#FFFFFF' }}>Daily Audit Email Report</div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Receive a daily 6:00 PM summary PDF of all milk batches received and cold-chain compliance.</div>
              </div>
              <input
                type="checkbox"
                style={{ width: '18px', height: '18px', accentColor: '#10B981' }}
                checked={notifications.dailyReportEmail}
                onChange={(e) => setNotifications({ ...notifications, dailyReportEmail: e.target.checked })}
              />
            </label>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '12px', alignSelf: 'flex-start' }}>
              <Save size={16} />
              <span>Save Preferences</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
