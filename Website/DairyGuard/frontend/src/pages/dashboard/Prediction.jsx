import React, { useState } from 'react';
import { Sparkles, Calculator, CheckCircle2, AlertTriangle, AlertCircle, Info, RefreshCw, Layers } from 'lucide-react';
import { api } from '../../services/api';
import SpoilageRiskGauge from '../../components/charts/SpoilageRiskGauge';
import SensorStatusBadge from '../../components/dashboard/SensorStatusBadge';
import AlertBanner from '../../components/common/AlertBanner';

export default function Prediction() {
  const [params, setParams] = useState({
    temperature: 3.5,
    ph: 6.60,
    tds: 1200,
    storageDuration: 2.5
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleEvaluate = async (customParams = null) => {
    const payload = customParams || params;
    setLoading(true);
    setError('');

    try {
      const data = await api.prediction.evaluate(payload);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Prediction evaluation failed.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Preset Scenarios for instant evaluation
  const applyPreset = (presetParams) => {
    setParams(presetParams);
    handleEvaluate(presetParams);
  };

  return (
    <div className="dashboard-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '6px' }}>AI Milk Spoilage Prediction Model</h2>
          <p style={{ fontSize: '1.02rem', color: '#CBD5E1' }}>
            Biochemical kinetics engine evaluating bacterial latency, acidification rates, and cold-chain abuse
          </p>
        </div>
      </div>

      {error && <AlertBanner type="danger" message={error} onClose={() => setError('')} />}

      {/* Preset Scenario Shortcuts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.92rem', color: '#CBD5E1', fontWeight: 600 }}>PRESET SCENARIOS:</span>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => applyPreset({ temperature: 3.2, ph: 6.62, tds: 1210, storageDuration: 2 })}
        >
          <span style={{ color: '#10B981' }}>●</span> Optimal Cold-Chain
        </button>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => applyPreset({ temperature: 6.5, ph: 6.44, tds: 1140, storageDuration: 6 })}
        >
          <span style={{ color: '#F59E0B' }}>●</span> Thermal Breach (Moderate)
        </button>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => applyPreset({ temperature: 13.0, ph: 5.95, tds: 920, storageDuration: 8 })}
        >
          <span style={{ color: '#EF4444' }}>●</span> Souring & Temperature Failure
        </button>
      </div>

      {/* Main Grid: Parameters Form (Left) & Model Evaluation (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        {/* Input Parameters Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
            <Calculator size={22} style={{ color: '#06B6D4' }} />
            <h3 style={{ fontSize: '1.35rem' }}>Input Telemetry Parameters</h3>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleEvaluate(); }}>
            {/* 1. Temperature */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label" style={{ fontSize: '1.02rem' }}>Milk Temperature (°C)</label>
                <span style={{ fontSize: '0.95rem', color: '#34D399', fontWeight: 600 }}>{params.temperature} °C</span>
              </div>
              <input
                type="number"
                step="0.1"
                min="-5"
                max="45"
                className="form-control"
                value={params.temperature}
                onChange={(e) => setParams({ ...params, temperature: Number(e.target.value) })}
                required
              />
              <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>IDF standard storage baseline: 1.0°C - 4.0°C</span>
            </div>

            {/* 2. pH Acidity */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label" style={{ fontSize: '1.02rem' }}>Milk pH Acidity</label>
                <span style={{ fontSize: '0.95rem', color: '#06B6D4', fontWeight: 600 }}>{params.ph} pH</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="3.0"
                max="10.0"
                className="form-control"
                value={params.ph}
                onChange={(e) => setParams({ ...params, ph: Number(e.target.value) })}
                required
              />
              <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Normal fresh milk: 6.50 - 6.70 pH (&lt;6.4 indicates souring)</span>
            </div>

            {/* 3. TDS / EC */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label" style={{ fontSize: '1.02rem' }}>Total Dissolved Solids (TDS ppm)</label>
                <span style={{ fontSize: '0.95rem', color: '#3B82F6', fontWeight: 600 }}>{params.tds} ppm</span>
              </div>
              <input
                type="number"
                step="10"
                min="200"
                max="3000"
                className="form-control"
                value={params.tds}
                onChange={(e) => setParams({ ...params, tds: Number(e.target.value) })}
                required
              />
              <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Natural raw milk range: 1050 - 1300 ppm</span>
            </div>

            {/* 4. Storage / Transport Duration */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label" style={{ fontSize: '1.02rem' }}>Storage / Transit Duration (Hours)</label>
                <span style={{ fontSize: '0.95rem', color: '#F59E0B', fontWeight: 600 }}>{params.storageDuration} hrs</span>
              </div>
              <input
                type="number"
                step="0.5"
                min="0.1"
                max="120"
                className="form-control"
                value={params.storageDuration}
                onChange={(e) => setParams({ ...params, storageDuration: Number(e.target.value) })}
                required
              />
              <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Elapsed hours since initial dairy milking</span>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '20px', padding: '14px' }}
              disabled={loading}
            >
              <Sparkles size={20} />
              <span>{loading ? 'Evaluating Model...' : 'Calculate Spoilage Risk'}</span>
            </button>
          </form>
        </div>

        {/* Prediction Results Display Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
            <Layers size={22} style={{ color: '#10B981' }} />
            <h3 style={{ fontSize: '1.35rem' }}>Prediction Inference Result</h3>
          </div>

          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '22px' }}>
              {/* Gauge */}
              <SpoilageRiskGauge 
                score={result.riskScore}
                level={result.spoilageRisk}
                confidence={result.confidence}
              />

              {/* Status Header Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', padding: '16px 20px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Classification</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: result.riskColor }}>{result.spoilageRisk}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confidence</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34D399' }}>{result.confidence}%</div>
                </div>
              </div>

              {/* Recommendation Notice */}
              <div style={{ background: result.spoilageRisk === 'Low Risk' ? 'rgba(16, 185, 129, 0.12)' : (result.spoilageRisk === 'Medium Risk' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(239, 68, 68, 0.12)'), border: `1px solid ${result.riskColor}`, padding: '16px', borderRadius: '8px', fontSize: '0.98rem', lineHeight: 1.6 }}>
                <strong style={{ color: '#FFFFFF' }}>Quality Guidance:</strong> {result.recommendation}
              </div>

              {/* Factors Breakdown */}
              {result.factors && result.factors.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>
                    Microbial Kinetics Breakdown
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {result.factors.map((f, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.92rem', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
                        <div>
                          <strong>{f.parameter} ({f.value}):</strong> <span style={{ color: '#CBD5E1' }}>{f.impact}</span>
                        </div>
                        <SensorStatusBadge status={f.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
              <Sparkles size={48} style={{ color: '#06B6D4', marginBottom: '16px', opacity: 0.7 }} />
              <p style={{ fontSize: '0.95rem', maxWidth: '340px' }}>
                Set your parameters or select a preset scenario and click <strong>"Calculate Spoilage Risk"</strong> to run the predictive engine.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
