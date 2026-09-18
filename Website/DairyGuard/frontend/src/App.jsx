import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Subscription from './pages/Subscription';
import ForgotPassword from './pages/ForgotPassword';

// Dashboard Subpages
import Overview from './pages/dashboard/Overview';
import Vehicles from './pages/dashboard/Vehicles';
import Batches from './pages/dashboard/Batches';
import Prediction from './pages/dashboard/Prediction';
import Analytics from './pages/dashboard/Analytics';
import Reports from './pages/dashboard/Reports';
import Settings from './pages/dashboard/Settings';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  
  // Hash-based simple reactive routing
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });

  const [activeDashboardTab, setActiveDashboardTab] = useState('overview');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        if (hash.startsWith('dashboard/')) {
          setCurrentRoute('dashboard');
          setActiveDashboardTab(hash.replace('dashboard/', ''));
        } else {
          setCurrentRoute(hash);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route, tab = null) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (route === 'dashboard') {
      const targetTab = tab || 'overview';
      setActiveDashboardTab(targetTab);
      setCurrentRoute('dashboard');
      window.location.hash = `dashboard/${targetTab}`;
    } else {
      setCurrentRoute(route);
      window.location.hash = route;
    }
  };

  const handleDashboardTabChange = (tabId) => {
    setActiveDashboardTab(tabId);
    window.location.hash = `dashboard/${tabId}`;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090D16', color: '#10B981', fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/dairyguard-logo.svg" alt="DairyGuard" style={{ width: '40px', height: '40px' }} />
          <span>DairyGuard IoT Gateway Initializing...</span>
        </div>
      </div>
    );
  }

  // Dashboard Shell View
  const isDashboard = currentRoute === 'dashboard' || currentRoute.startsWith('dashboard-');

  if (isDashboard) {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return (
        <div className="app-container">
          <Navbar currentPath="login" onNavigate={navigateTo} />
          <Login onNavigate={navigateTo} />
          <Footer onNavigate={navigateTo} />
        </div>
      );
    }

    const tabTitles = {
      overview: { title: 'Cold-Chain Telemetry Dashboard', subtitle: 'Live status of milk tanks, onboard IoT telemetry, and cold-chain compliance' },
      vehicles: { title: 'Transport Logistics & Fleet', subtitle: 'Manage milk transport tankers, drivers, live transit routes, and assigned batches' },
      batches: { title: 'Milk Batches & Intake', subtitle: 'Register milk collections, scan incoming delivery QR codes, and trace quality' },
      prediction: { title: 'AI Milk Spoilage Prediction Model', subtitle: 'Food microbiology kinetics calculating spoilage risk before silo unloading' },
      analytics: { title: 'Telemetry Trends & Analytics', subtitle: 'Multi-metric time-series curves for temperature, acidity, and TDS' },
      reports: { title: 'Milk Quality & Transit Reports', subtitle: 'Official generated PDF certificates for plant compliance and laboratory audit' },
      settings: { title: 'System & Account Settings', subtitle: 'Manage personal profile, cooperative credentials, and alert channels' }
    };

    const currentMeta = tabTitles[activeDashboardTab] || tabTitles.overview;

    return (
      <div className="dashboard-layout">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeDashboardTab}
          onTabChange={handleDashboardTabChange}
          onNavigateHome={() => navigateTo('home')}
        />

        {/* Main Content Pane */}
        <div className="dashboard-main">
          <Header
            title={currentMeta.title}
            subtitle={currentMeta.subtitle}
          />

          <main style={{ flex: 1 }}>
            {activeDashboardTab === 'overview' && <Overview onNavigateTab={handleDashboardTabChange} />}
            {activeDashboardTab === 'vehicles' && <Vehicles />}
            {activeDashboardTab === 'batches' && <Batches />}
            {activeDashboardTab === 'prediction' && <Prediction />}
            {activeDashboardTab === 'analytics' && <Analytics />}
            {activeDashboardTab === 'reports' && <Reports />}
            {activeDashboardTab === 'settings' && <Settings onNavigatePlan={() => navigateTo('subscription')} />}
          </main>
        </div>
      </div>
    );
  }

  // Public Landing / Auth / Subscription Views
  return (
    <div className="app-container">
      <Navbar currentPath={currentRoute} onNavigate={navigateTo} />

      <main className="main-content">
        {currentRoute === 'home' && <Home onNavigate={navigateTo} />}
        {currentRoute === 'login' && <Login onNavigate={navigateTo} />}
        {currentRoute === 'signup' && <Signup onNavigate={navigateTo} />}
        {currentRoute === 'subscription' && <Subscription onNavigate={navigateTo} />}
        {currentRoute === 'forgot-password' && <ForgotPassword onNavigate={navigateTo} />}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
