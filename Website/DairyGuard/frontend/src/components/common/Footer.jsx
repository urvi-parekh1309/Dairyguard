import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="section-container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-brand">
            <div className="navbar-brand" style={{ marginBottom: '12px' }}>
              <img src="/dairyguard-logo.svg" alt="DairyGuard Logo" className="navbar-logo-img" />
              <span>Dairy<span className="text-gradient">Guard</span></span>
            </div>
            <p>
              Intelligent IoT cold-chain telemetry and biochemical milk spoilage prevention for modern dairy farmers, transport fleets, and cooperatives.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Platform</h4>
            <ul className="footer-links">
              <li><a href="#features" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Core Features</a></li>
              <li><a href="#subscription" onClick={(e) => { e.preventDefault(); onNavigate('subscription'); }}>Pricing & Plans</a></li>
              <li><a href="#prediction" onClick={(e) => { e.preventDefault(); onNavigate('dashboard-prediction'); }}>Spoilage AI Model</a></li>
              <li><a href="#reports" onClick={(e) => { e.preventDefault(); onNavigate('dashboard-reports'); }}>Compliance Reports</a></li>
            </ul>
          </div>

          {/* Compliance & Standards */}
          <div className="footer-col">
            <h4>Standards</h4>
            <ul className="footer-links">
              <li><a href="#fssai">FSSAI Cold-Chain</a></li>
              <li><a href="#idf">IDF Milk Quality Guidelines</a></li>
              <li><a href="#iot">ESP32 Telemetry Protocol</a></li>
              <li><a href="#security">Tamper-Evident Logs</a></li>
            </ul>
          </div>

          {/* Contact / IoT Info */}
          <div className="footer-col">
            <h4>Telemetry Gateway</h4>
            <p style={{ fontSize: '0.88rem', marginBottom: '12px' }}>
              Compatible with high-precision DS18B20 temperature probes, analog pH sensors, and industrial TDS probes.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#10B981' }}>
              <span className="live-indicator"></span>
              <span>ESP32 Telemetry Gateway Ready</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} DairyGuard Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Built for Dairy Excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
