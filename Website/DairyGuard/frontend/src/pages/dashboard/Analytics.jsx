import React, { useState, useEffect } from 'react';
import { BarChart3, Filter, Calendar, Truck, Boxes, RefreshCw, Send, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import RealtimeLineChart from '../../components/charts/RealtimeLineChart';
import EmptyState from '../../components/common/EmptyState';
import AlertBanner from '../../components/common/AlertBanner';

export default function Analytics() {
  const [timeframe, setTimeframe] = useState('7days'); // 'today', '7days', '30days', 'custom'
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [batches, setBatches] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [banner, setBanner] = useState(null);

  const fetchFilters = async () => {
    try {
      const [vList, bList] = await Promise.all([
        api.vehicles.getAll().catch(() => []),
        api.batches.getAll().catch(() => [])
      ]);
      setVehicles(vList || []);
      setBatches(bList || []);
    } catch (err) {
      console.warn('Filters fetch error:', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const data = await api.analytics.getMetrics({
        timeframe,
        vehicleId: selectedVehicle || undefined,
        batchId: selectedBatch || undefined
      });
      setAnalyticsData(data);
    } catch (err) {
      setBanner({ type: 'danger', message: 'Failed to load telemetry analytics: ' + err.message });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe, selectedVehicle, selectedBatch]);

  // Seed sample telemetry readings for demonstration if completely empty
  const handleSeedDemoData = async () => {
    setLoading(true);
    try {
      const now = Date.now();
      const points = [
        { temp: 3.2, ph: 6.65, tds: 1200, offset: 6 * 3600000 },
        { temp: 3.4, ph: 6.64, tds: 1210, offset: 5 * 3600000 },
        { temp: 3.8, ph: 6.62, tds: 1190, offset: 4 * 3600000 },
        { temp: 4.2, ph: 6.60, tds: 1180, offset: 3 * 3600000 },
        { temp: 4.6, ph: 6.57, tds: 1170, offset: 2 * 3600000 },
        { temp: 4.9, ph: 6.54, tds: 1160, offset: 1 * 3600000 },
        { temp: 3.6, ph: 6.61, tds: 1195, offset: 0 }
      ];

      for (const p of points) {
        await api.sensors.ingestReading({
          temperature: p.temp,
          ph: p.ph,
          tds: p.tds,
          timestamp: new Date(now - p.offset).toISOString(),
          deviceId: 'ESP32_TANKER_NODE_01'
        });
      }

      setBanner({ type: 'success', message: 'Generated real telemetry series for time analytics preview!' });
      await fetchAnalytics();
    } catch (err) {
      setBanner({ type: 'danger', message: 'Failed to generate telemetry series: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const hasData = analyticsData?.hasData;
  const summary = analyticsData?.summary;

  return (
    <div className="dashboard-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '6px' }}>Telemetry Trends & Analytics</h2>
          <p style={{ fontSize: '1.02rem', color: '#CBD5E1' }}>
            Multi-metric time-series curves for temperature degradation, acidity shifts, and spoilage risk
          </p>
        </div>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => { setRefreshing(true); fetchAnalytics(); }}
          disabled={refreshing}
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>

      {banner && <AlertBanner type={banner.type} message={banner.message} onClose={() => setBanner(null)} />}

      {/* Filters Bar */}
      <div className="glass-card" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '18px' }}>
        {/* Timeframe Buttons */}
        <div className="filters-bar">
          <span style={{ fontSize: '0.92rem', color: '#CBD5E1', fontWeight: 600 }}>TIMEFRAME:</span>
          <button 
            className={`filter-btn ${timeframe === 'today' ? 'active' : ''}`}
            onClick={() => setTimeframe('today')}
          >
            Today
          </button>
          <button 
            className={`filter-btn ${timeframe === '7days' ? 'active' : ''}`}
            onClick={() => setTimeframe('7days')}
          >
            7 Days
          </button>
          <button 
            className={`filter-btn ${timeframe === '30days' ? 'active' : ''}`}
            onClick={() => setTimeframe('30days')}
          >
            30 Days
          </button>
          <button 
            className={`filter-btn ${timeframe === 'custom' ? 'active' : ''}`}
            onClick={() => setTimeframe('custom')}
          >
            Custom Range
          </button>
        </div>

        {/* Entity Filters: Vehicle and Batch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Vehicle Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={16} color="#CBD5E1" />
            <select
              style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFFFFF', padding: '8px 12px', fontSize: '0.92rem' }}
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
            >
              <option value="">All Vehicles</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.vehicleId || v.id}>{v.vehicleNumber}</option>
              ))}
            </select>
          </div>

          {/* Batch Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Boxes size={16} color="#CBD5E1" />
            <select
              style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFFFFF', padding: '8px 12px', fontSize: '0.92rem' }}
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              <option value="">All Batches</option>
              {batches.map((b) => (
                <option key={b.id} value={b.batchId || b.id}>{b.batchId}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Analytics Summary Stats */}
      {hasData && summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '18px' }}>
          <div className="glass-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.85rem', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Data Points</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>{summary.totalReadings}</div>
          </div>
          <div className="glass-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.85rem', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Average Temp</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: summary.avgTemperature <= 4.0 ? '#10B981' : '#F59E0B', marginTop: '4px' }}>
              {summary.avgTemperature} °C
            </div>
          </div>
          <div className="glass-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.85rem', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Temp Range (Min-Max)</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#06B6D4', marginTop: '4px' }}>
              {summary.minTemperature}° - {summary.maxTemperature}°C
            </div>
          </div>
          <div className="glass-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.85rem', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Average pH</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#3B82F6', marginTop: '4px' }}>
              {summary.avgPh} pH
            </div>
          </div>
          <div className="glass-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.85rem', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Average TDS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#E2E8F0', marginTop: '4px' }}>
              {summary.avgTds} ppm
            </div>
          </div>
        </div>
      )}

      {/* Main Charts Grid */}
      {!hasData ? (
        <EmptyState
          icon={BarChart3}
          title="No sensor data available."
          description="There are currently no telemetry records registered from your IoT sensors or transport vehicles for the chosen filter."
          action={
            <button className="btn btn-primary btn-sm" onClick={handleSeedDemoData}>
              <Send size={14} />
              <span>Generate Sample Telemetry Sequence</span>
            </button>
          }
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px' }}>
          {/* Chart 1: Temperature Over Time */}
          <div className="chart-card">
            <RealtimeLineChart
              title="Temperature Over Time (°C)"
              data={analyticsData.temperatureSeries}
              dataKey="value"
              unit="°C"
              color="#06B6D4"
              height={220}
              minVal={0}
              maxVal={10}
            />
          </div>

          {/* Chart 2: pH Acidity Over Time */}
          <div className="chart-card">
            <RealtimeLineChart
              title="pH Acidity Over Time"
              data={analyticsData.phSeries}
              dataKey="value"
              unit="pH"
              color="#10B981"
              height={220}
              minVal={6.0}
              maxVal={7.0}
            />
          </div>

          {/* Chart 3: TDS Solids Over Time */}
          <div className="chart-card">
            <RealtimeLineChart
              title="TDS / EC Over Time (ppm)"
              data={analyticsData.tdsSeries}
              dataKey="value"
              unit="ppm"
              color="#3B82F6"
              height={220}
              minVal={800}
              maxVal={1500}
            />
          </div>

          {/* Chart 4: Spoilage Risk Index Over Time */}
          <div className="chart-card">
            <RealtimeLineChart
              title="Spoilage Risk Score Curve (0 - 100)"
              data={analyticsData.spoilageRiskSeries}
              dataKey="riskScore"
              unit="pts"
              color="#F59E0B"
              height={220}
              minVal={0}
              maxVal={100}
            />
          </div>
        </div>
      )}
    </div>
  );
}
