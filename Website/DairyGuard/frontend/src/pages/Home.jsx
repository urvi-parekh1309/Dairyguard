import React from 'react';
import { 
  ShieldCheck, 
  Thermometer, 
  Activity, 
  Truck, 
  BarChart3, 
  FileCheck2, 
  ArrowRight, 
  CheckCircle2, 
  Radio, 
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home({ onNavigate }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section" style={{ position: 'relative', padding: '100px 0 80px', overflow: 'hidden' }}>
        {/* Ambient Glows */}
        <div style={{ position: 'absolute', top: '-10%', left: '15%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div className="section-container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', padding: '8px 20px', borderRadius: '30px', color: '#34D399', fontSize: '0.95rem', fontWeight: 600, marginBottom: '24px' }}>
            <Radio size={16} className="live-indicator" />
            <span>Next-Gen IoT Cold-Chain Quality Intelligence</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.4rem)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '20px', lineHeight: 1.15 }}>
            Monitor Milk. <br />
            <span className="text-gradient">Prevent Spoilage.</span>
          </h1>

          <p style={{ fontSize: '1.25rem', color: '#CBD5E1', maxWidth: '720px', margin: '0 auto 36px', lineHeight: 1.65 }}>
            DairyGuard protects dairy cooperatives and logistics fleets from spoilage losses with real-time temperature, pH, and TDS telemetry powered by predictive biochemical intelligence.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'signup')}
            >
              <span>{isAuthenticated ? 'Open Dashboard' : 'Get Started'}</span>
              <ArrowRight size={20} />
            </button>

            <button 
              className="btn btn-secondary btn-lg"
              onClick={() => onNavigate('subscription')}
            >
              <span>Explore Plans & Hardware</span>
            </button>
          </div>

          {/* Key Metric Highlights */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap', borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '36px' }}>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#10B981' }}>99.2%</div>
              <div style={{ fontSize: '0.95rem', color: '#CBD5E1', marginTop: '4px' }}>Prediction Confidence</div>
            </div>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#06B6D4' }}>&lt; 4.0°C</div>
              <div style={{ fontSize: '0.95rem', color: '#CBD5E1', marginTop: '4px' }}>Cold-Chain Guarantee</div>
            </div>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#3B82F6' }}>100%</div>
              <div style={{ fontSize: '0.95rem', color: '#CBD5E1', marginTop: '4px' }}>FSSAI & IDF Audit Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '80px 0', background: 'rgba(15, 23, 42, 0.4)' }}>
        <div className="section-container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ color: '#06B6D4', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              Built For Milk Integrity
            </div>
            <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.8px' }}>Comprehensive Cold-Chain Architecture</h2>
            <p style={{ maxWidth: '640px', margin: '14px auto 0', fontSize: '1.1rem', color: '#CBD5E1' }}>
              Everything needed to monitor, predict, and audit milk quality during collection and transit.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '26px' }}>
            {/* Feature 1: Spoilage Prediction */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.18)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={26} />
              </div>
              <h3 style={{ fontSize: '1.4rem' }}>Milk Spoilage Prediction</h3>
              <p style={{ fontSize: '1.02rem', lineHeight: 1.65, color: '#CBD5E1' }}>
                Food microbiology kinetics calculate microbial proliferation based on thermal exposure, lactic acidification, and transit time to predict spoilage before milk reaches the silo.
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#34D399', fontSize: '0.95rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} />
                <span>Low, Medium & High Risk Detection</span>
              </div>
            </div>

            {/* Feature 2: Quality Monitoring */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(6, 182, 212, 0.18)', color: '#22D3EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={26} />
              </div>
              <h3 style={{ fontSize: '1.4rem' }}>Milk Quality Monitoring</h3>
              <p style={{ fontSize: '1.02rem', lineHeight: 1.65, color: '#CBD5E1' }}>
                Continuous measurement of pH acidity levels and Total Dissolved Solids (TDS/EC) detects water dilution, neutralizing agents, and natural milk degradation instantaneously.
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#22D3EE', fontSize: '0.95rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} />
                <span>Chemical & Biochemical Assays</span>
              </div>
            </div>

            {/* Feature 3: Real-Time Sensor Telemetry */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(59, 130, 246, 0.18)', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Thermometer size={26} />
              </div>
              <h3 style={{ fontSize: '1.4rem' }}>Real-Time Sensor Monitoring</h3>
              <p style={{ fontSize: '1.02rem', lineHeight: 1.65, color: '#CBD5E1' }}>
                Seamless integration with ESP32 microcontrollers streaming live telemetry directly from milk tanker insulated vessels and chilling storage vats.
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#60A5FA', fontSize: '0.95rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} />
                <span>Sub-Second Telemetry Ingestion</span>
              </div>
            </div>

            {/* Feature 4: Transport Monitoring */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.18)', color: '#FBBF24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={26} />
              </div>
              <h3 style={{ fontSize: '1.4rem' }}>Transport Fleet Tracking</h3>
              <p style={{ fontSize: '1.02rem', lineHeight: 1.65, color: '#CBD5E1' }}>
                Assign batches to specific vehicles, track cold-chain transit status, driver manifests, and route origin to processing facility destination.
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#FBBF24', fontSize: '0.95rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} />
                <span>Vehicle & Batch Linkage</span>
              </div>
            </div>

            {/* Feature 5: Reports and Analytics */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(168, 85, 247, 0.18)', color: '#C084FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileCheck2 size={26} />
              </div>
              <h3 style={{ fontSize: '1.4rem' }}>Reports & PDF Certification</h3>
              <p style={{ fontSize: '1.02rem', lineHeight: 1.65, color: '#CBD5E1' }}>
                One-click official transit quality certificates and PDF compliance downloads with tamper-evident audit timestamps for laboratory and factory intake.
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#C084FC', fontSize: '0.95rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} />
                <span>Instant PDF Generation</span>
              </div>
            </div>

            {/* Feature 6: QR Code Manifest */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.18)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={26} />
              </div>
              <h3 style={{ fontSize: '1.4rem' }}>QR Batch Scanner</h3>
              <p style={{ fontSize: '1.02rem', lineHeight: 1.65, color: '#CBD5E1' }}>
                Scan physical batch QR codes with your mobile camera or upload manifest barcodes directly from shipping paperwork to register milk intake instantly.
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#34D399', fontSize: '0.95rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} />
                <span>Camera & Image Upload Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Banner */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="section-container">
          <div className="glass-card" style={{ padding: '56px 32px', maxWidth: '840px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '16px' }}>Ready to eliminate milk transit spoilage?</h2>
            <p style={{ color: '#CBD5E1', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              Join forward-thinking dairy cooperatives and logistics fleets utilizing DairyGuard IoT intelligence.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'signup')}
              >
                <span>Get Started Now</span>
                <ArrowRight size={20} />
              </button>
              <button 
                className="btn btn-secondary btn-lg"
                onClick={() => onNavigate('login')}
              >
                <span>Log In to Account</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
