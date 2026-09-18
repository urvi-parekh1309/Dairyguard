import React, { useState, useEffect } from 'react';
import { 
  Thermometer, 
  Activity, 
  Droplets, 
  ShieldAlert, 
  CheckCircle2, 
  Radio, 
  Clock, 
  RefreshCw, 
  Cpu, 
  PlusCircle, 
  Send 
} from 'lucide-react';
import MetricCard from '../../components/dashboard/MetricCard';
import SensorStatusBadge from '../../components/dashboard/SensorStatusBadge';
import RecentAlertsList from '../../components/dashboard/RecentAlertsList';
import SpoilageRiskGauge from '../../components/charts/SpoilageRiskGauge';
import AlertBanner from '../../components/common/AlertBanner';
import { api } from '../../services/api';

export default function Overview({ onNavigateTab }) {
  const [latestReading, setLatestReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchLatestData = async () => {
    try {
      const data = await api.sensors.getLatest();
      setLatestReading(data);
    } catch (err) {
      console.warn('Sensor data fetch warning:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLatestData();
    // Periodic refresh every 15 seconds
    const interval = setInterval(fetchLatestData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLatestData();
  };

  // Optional quick test simulator to demonstrate live ESP32 ingestion
  const handleSimulateESP32 = async () => {
    setSimulating(true);
    try {
      // Simulate typical fresh chilled milk transit reading
      const testReading = {
        temperature: Number((3.2 + Math.random() * 1.5).toFixed(1)),
        ph: Number((6.6 + (Math.random() * 0.1 - 0.05)).toFixed(2)),
        tds: Math.round(1180 + Math.random() * 40),
        deviceId: 'ESP32_TRANSIT_PROBE_01',
        timestamp: new Date().toISOString()
      };
      await api.sensors.ingestReading(testReading);
      setToastMessage('ESP32 telemetry reading successfully ingested!');
      await fetchLatestData();
    } catch (err) {
      setToastMessage('Simulation failed: ' + err.message);
    } finally {
      setSimulating(false);
    }
  };

  const hasData = !!latestReading;
  const prediction = latestReading?.prediction;

  return (
    <div className="dashboard-body">
      {/* Overview Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '6px' }}>Fleet & Sensor Overview</h2>
          <p style={{ fontSize: '1.02rem', color: '#CBD5E1' }}>
            Live status of milk tanks, onboard IoT telemetry, and cold-chain compliance
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleSimulateESP32}
            disabled={simulating}
            title="Sends a test telemetry payload as if an ESP32 hardware probe just reported"
          >
            <Send size={16} />
            <span>{simulating ? 'Transmitting...' : 'Simulate ESP32 Ingestion'}</span>
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <AlertBanner type="success" message={toastMessage} onClose={() => setToastMessage('')} />
      )}

      {/* Primary Telemetry Metrics Grid */}
      <div className="metrics-grid">
        {/* 1. Temperature */}
        <MetricCard
          title="Temperature"
          value={hasData ? latestReading.temperature : null}
          unit="°C"
          icon={Thermometer}
          variant={!hasData ? 'cyan' : (latestReading.temperature <= 4.0 ? 'emerald' : 'red')}
          empty={!hasData}
          footerText={hasData ? (latestReading.temperature <= 4.0 ? 'Cold-chain compliant' : 'Thermal warning') : ''}
          statusBadge={hasData ? <SensorStatusBadge status={latestReading.temperature <= 4.0 ? 'Optimal' : 'Warning'} /> : null}
        />

        {/* 2. pH Acidity */}
        <MetricCard
          title="pH Acidity"
          value={hasData ? latestReading.ph : null}
          unit="pH"
          icon={Activity}
          variant={!hasData ? 'cyan' : (latestReading.ph >= 6.5 && latestReading.ph <= 6.7 ? 'emerald' : 'amber')}
          empty={!hasData}
          footerText={hasData ? (latestReading.ph >= 6.5 && latestReading.ph <= 6.7 ? 'Fresh cow/buffalo milk' : 'Acidity altered') : ''}
          statusBadge={hasData ? <SensorStatusBadge status={latestReading.ph >= 6.5 && latestReading.ph <= 6.7 ? 'Fresh' : 'Check'} /> : null}
        />

        {/* 3. TDS / Conductivity */}
        <MetricCard
          title="TDS / EC"
          value={hasData ? latestReading.tds : null}
          unit="ppm"
          icon={Droplets}
          variant="blue"
          empty={!hasData}
          footerText={hasData ? 'Standard milk density' : ''}
          statusBadge={hasData ? <SensorStatusBadge status={latestReading.tds >= 1050 ? 'Standard' : 'Dilution'} /> : null}
        />

        {/* 4. Spoilage Risk */}
        <MetricCard
          title="Spoilage Risk"
          value={hasData && prediction ? prediction.spoilageRisk : null}
          icon={ShieldAlert}
          variant={!hasData ? 'cyan' : (prediction?.spoilageRisk === 'Low Risk' ? 'emerald' : (prediction?.spoilageRisk === 'Medium Risk' ? 'amber' : 'red'))}
          empty={!hasData}
          footerText={hasData && prediction ? `Model Confidence: ${prediction.confidence}%` : ''}
          statusBadge={hasData && prediction ? <SensorStatusBadge status={prediction.spoilageRisk} /> : null}
        />

        {/* 5. Milk Status */}
        <MetricCard
          title="Milk Status"
          value={hasData ? (prediction?.spoilageRisk === 'High Risk' ? 'Quarantined' : 'Safe for Intake') : null}
          icon={CheckCircle2}
          variant={!hasData ? 'cyan' : (prediction?.spoilageRisk === 'High Risk' ? 'red' : 'emerald')}
          empty={!hasData}
          footerText={hasData ? 'IDF standard validated' : ''}
          statusBadge={hasData ? <SensorStatusBadge status={prediction?.spoilageRisk === 'High Risk' ? 'Rejected' : 'Approved'} /> : null}
        />

        {/* 6. Device Status */}
        <MetricCard
          title="Device Status"
          value={hasData ? 'Online' : 'Standby'}
          icon={Radio}
          variant={hasData ? 'emerald' : 'cyan'}
          empty={false}
          footerText={hasData ? latestReading.deviceId || 'ESP32 Node' : 'No active sensor'}
          statusBadge={<SensorStatusBadge status={hasData ? 'Active' : 'Standby'} />}
        />

        {/* 7. Last Updated */}
        <MetricCard
          title="Last Updated"
          value={hasData ? new Date(latestReading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : null}
          icon={Clock}
          variant="cyan"
          empty={!hasData}
          footerText={hasData ? new Date(latestReading.timestamp).toLocaleDateString() : ''}
        />
      </div>

      {/* Main Status & Spoilage Evaluation Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Risk Visualizer Gauge */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.3rem' }}>AI Spoilage Prediction Status</h3>
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => onNavigateTab('prediction')}
            >
              Open Model Simulator
            </button>
          </div>

          {hasData && prediction ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <SpoilageRiskGauge 
                score={prediction.riskScore}
                level={prediction.spoilageRisk}
                confidence={prediction.confidence}
              />
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '8px', marginTop: '16px', fontSize: '0.95rem', color: '#CBD5E1', lineHeight: 1.5 }}>
                <strong style={{ color: '#FFFFFF' }}>Recommendation:</strong> {prediction.recommendation}
              </div>
            </div>
          ) : (
            <div className="sensor-empty-box" style={{ flex: 1, justifyContent: 'center' }}>
              <Cpu size={40} style={{ color: '#06B6D4' }} />
              <div className="sensor-empty-title">No sensor data available.</div>
              <p className="sensor-empty-subtext">
                Connect your ESP32 hardware probe or click "Simulate ESP32 Ingestion" above to see real-time predictive spoilage evaluation.
              </p>
            </div>
          )}
        </div>

        {/* Quick Fleet & Batch Status */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.3rem' }}>Recent Critical Events</h3>
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => onNavigateTab('analytics')}
            >
              View Analytics
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <RecentAlertsList alerts={hasData && prediction?.spoilageRisk === 'High Risk' ? [
              {
                title: 'High Spoilage Risk Detected',
                description: `Acidification or temperature anomaly detected in latest telemetry reading.`,
                severity: 'critical',
                status: 'High Risk',
                time: 'Just now'
              }
            ] : []} />
          </div>
        </div>
      </div>
    </div>
  );
}
